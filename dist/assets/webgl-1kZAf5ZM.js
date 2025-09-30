const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/flame_compute_frame_wasm-CeFRUB2k.js","assets/preload-helper-DD1OZmLC.js","assets/avatarCoreAdapter-Dytsxc4s.js"])))=>i.map(i=>d[i]);
import{_ as C}from"./preload-helper-DD1OZmLC.js";import{a as x,S as D}from"./binaryPlyLoader-Cx5R50qP.js";import"./babylonjs-BIcxYk3o.js";import"./protobuf-B46OxRQv.js";const z=`#version 300 es
precision highp float;

// 输入属性（每个splat实例）
layout(location = 0) in vec3 a_position;    // splat中心位置
layout(location = 1) in vec4 a_color;       // RGBA颜色
layout(location = 2) in vec3 a_scale;       // 缩放参数 [sx, sy, sz]
layout(location = 3) in vec4 a_rotation;    // 旋转四元数 [x, y, z, w]

// 顶点ID（0,1,2,3对应四边形的四个角）
layout(location = 4) in float a_vertexId;

// Uniform变量
uniform mat4 u_viewMatrix;
uniform mat4 u_projectionMatrix;
uniform vec2 u_screenSize;
uniform float u_boundsRadius;
uniform int u_enableFrustumCulling;

// 输出到片段着色器
out vec2 v_relativePosition;
out vec4 v_color;

// 常量定义（与Metal版本对齐）
const float BOUNDS_RADIUS = 3.0;

/**
 * 计算3D协方差矩阵（从scale和rotation）
 * 公式: Σ = R·S·S^T·R^T
 * 返回: mat3协方差矩阵
 */
mat3 computeCov3D(vec3 scale, vec4 rotation) {
    // 四元数归一化
    vec4 q = normalize(rotation);
    float qx = q.x;
    float qy = q.y;
    float qz = q.z;
    float qw = q.w;

    // 从四元数构建旋转矩阵R
    // GLSL mat3构造函数按列填充，所以这里写的是列向量
    // 对于四元数 q = [x,y,z,w]，旋转矩阵为:
    mat3 R = mat3(
        1.0 - 2.0*(qy*qy + qz*qz), 2.0*(qx*qy + qz*qw), 2.0*(qx*qz - qy*qw),  // 第一列
        2.0*(qx*qy - qz*qw), 1.0 - 2.0*(qx*qx + qz*qz), 2.0*(qy*qz + qx*qw),  // 第二列
        2.0*(qx*qz + qy*qw), 2.0*(qy*qz - qx*qw), 1.0 - 2.0*(qx*qx + qy*qy)   // 第三列
    );

    // 缩放矩阵S（对角矩阵）
    mat3 S = mat3(
        scale.x, 0.0, 0.0,
        0.0, scale.y, 0.0,
        0.0, 0.0, scale.z
    );

    // 计算协方差矩阵: Σ = R·S·S^T·R^T
    // 优化: S·S^T 对于对角矩阵等于 diag(scale^2)
    mat3 SSquared = mat3(
        scale.x * scale.x, 0.0, 0.0,
        0.0, scale.y * scale.y, 0.0,
        0.0, 0.0, scale.z * scale.z
    );

    // Σ = R·(S^2)·R^T
    mat3 covariance = R * SSquared * transpose(R);

    return covariance;
}

/**
 * 计算2D协方差矩阵（复刻Metal的calcCovariance2D函数）
 * 优化: 直接接收3D协方差矩阵而非拆分的covA/covB
 */
vec3 calcCovariance2D(vec3 viewPos, mat3 cov3D, mat4 viewMatrix, mat4 projectionMatrix, vec2 screenSize) {
    float invViewPosZ = 1.0 / viewPos.z;
    float invViewPosZSquared = invViewPosZ * invViewPosZ;

    // FOV限制（防止近平面artifacts）
    float tanHalfFovX = 1.0 / projectionMatrix[0][0];
    float tanHalfFovY = 1.0 / projectionMatrix[1][1];
    float limX = 1.3 * tanHalfFovX;
    float limY = 1.3 * tanHalfFovY;

    viewPos.x = clamp(viewPos.x * invViewPosZ, -limX, limX) * viewPos.z;
    viewPos.y = clamp(viewPos.y * invViewPosZ, -limY, limY) * viewPos.z;

    // 焦距计算
    float focalX = screenSize.x * projectionMatrix[0][0] / 2.0;
    float focalY = screenSize.y * projectionMatrix[1][1] / 2.0;

    // 雅可比矩阵 J
    mat3 J = mat3(
        focalX * invViewPosZ, 0.0, 0.0,
        0.0, focalY * invViewPosZ, 0.0,
        -(focalX * viewPos.x) * invViewPosZSquared, -(focalY * viewPos.y) * invViewPosZSquared, 0.0
    );

    // 视图变换矩阵 W (仅旋转部分) - 固定使用转置（经验最清晰）
    mat3 W = transpose(mat3(viewMatrix[0].xyz, viewMatrix[1].xyz, viewMatrix[2].xyz));

    // 投影变换 T = J * W
    mat3 T = J * W;

    // 2D协方差矩阵 = T * Vrk * T^T
    mat3 cov = T * cov3D * transpose(T);

    // 低通滤波器（确保每个高斯至少覆盖一个像素）
    cov[0][0] += 0.3;
    cov[1][1] += 0.3;

    return vec3(cov[0][0], cov[0][1], cov[1][1]);
}

/**
 * 分解协方差矩阵（复刻Metal的decomposeCovariance函数）
 */
void decomposeCovariance(vec3 cov2D, out vec2 v1, out vec2 v2) {
    float a = cov2D.x;
    float b = cov2D.y;
    float d = cov2D.z;

    float det = a * d - b * b;  // 行列式
    float trace = a + d;        // 迹

    float mean = 0.5 * trace;
    float dist = max(0.1, sqrt(mean * mean - det));

    // 特征值
    float lambda1 = mean + dist;
    float lambda2 = mean - dist;

    // 确保特征值为正
    lambda1 = max(lambda1, 0.01);
    lambda2 = max(lambda2, 0.01);

    // 特征向量 - 完全复刻MetalSplatter的算法
    vec2 eigenvector1;
    if (abs(b) < 1e-6) {
        eigenvector1 = (a > d) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    } else {
        // ✅ 修复：使用MetalSplatter的公式 (b, d - lambda2) 而不是 (b, lambda1 - a)
        eigenvector1 = normalize(vec2(b, d - lambda2));
    }

    // ✅ 修复：正交特征向量，使用MetalSplatter的方向 (y, -x) 而不是 (-y, x)
    vec2 eigenvector2 = vec2(eigenvector1.y, -eigenvector1.x);

    v1 = eigenvector1 * sqrt(lambda1);
    v2 = eigenvector2 * sqrt(lambda2);
}

void main() {
    // 直接使用原始位置数据，不进行硬编码缩放
    vec3 scaledPosition = a_position;

    // 转换到视图空间
    vec4 viewPosition4 = u_viewMatrix * vec4(scaledPosition, 1.0);
    vec3 viewPosition3 = viewPosition4.xyz;

    // 🚀 GPU优化: 在GPU中计算3D协方差矩阵
    mat3 cov3D = computeCov3D(a_scale, a_rotation);

    // 计算2D协方差矩阵
    vec3 cov2D = calcCovariance2D(viewPosition3, cov3D, u_viewMatrix, u_projectionMatrix, u_screenSize);

    // 分解协方差矩阵得到椭圆轴
    vec2 axis1, axis2;
    decomposeCovariance(cov2D, axis1, axis2);

    // 投影到屏幕空间
    vec4 projectedCenter = u_projectionMatrix * viewPosition4;

    // 视锥体剔除（对齐MetalSplatter边界，可调试禁用）
    if (u_enableFrustumCulling == 1) {
        float bounds = 1.2 * projectedCenter.w;
        if (projectedCenter.z < 0.0 ||
            projectedCenter.z > projectedCenter.w ||
            projectedCenter.x < -bounds ||
            projectedCenter.x > bounds ||
            projectedCenter.y < -bounds ||
            projectedCenter.y > bounds) {
            // 剔除到屏幕外
            gl_Position = vec4(1.0, 1.0, 0.0, 1.0);
            return;
        }
    }

    // 四边形顶点相对坐标 - 完全复刻Metal的relativeCoordinatesArray
    const vec2 relativeCoordinatesArray[4] = vec2[4](
        vec2(-1.0, -1.0),  // 0: 左下
        vec2(-1.0,  1.0),  // 1: 左上
        vec2( 1.0, -1.0),  // 2: 右下
        vec2( 1.0,  1.0)   // 3: 右上
    );

    vec2 relativeCoord = relativeCoordinatesArray[int(a_vertexId) % 4];

    // 计算椭圆变换后的相对位置（像素单位）
    vec2 ellipseRelativePos = relativeCoord.x * axis1 + relativeCoord.y * axis2;

    // 计算屏幕空间偏移
    vec2 screenSizeFloat = u_screenSize;
    vec2 projectedScreenDelta = ellipseRelativePos * 2.0 * BOUNDS_RADIUS / screenSizeFloat;

    // 最终顶点位置
    gl_Position = vec4(
        projectedCenter.x + projectedScreenDelta.x * projectedCenter.w,
        projectedCenter.y + projectedScreenDelta.y * projectedCenter.w,
        projectedCenter.z,
        projectedCenter.w
    );

    // 传递标准化坐标给片段着色器（椭圆内[-1,1]范围）
    v_relativePosition = relativeCoord * BOUNDS_RADIUS;
    v_color = a_color;
}
`,B=`#version 300 es
precision highp float;

// 从顶点着色器输入
in vec2 v_relativePosition;
in vec4 v_color;

// 输出颜色
out vec4 fragColor;

// 常量定义
const float BOUNDS_RADIUS = 3.0;
const float BOUNDS_RADIUS_SQUARED = BOUNDS_RADIUS * BOUNDS_RADIUS;

/**
 * 计算高斯透明度 - 完全复刻MetalSplatter算法
 */
float splatFragmentAlpha(vec2 relativePosition, float splatAlpha) {
    // ✅ 修复：完全匹配MetalSplatter的计算方式
    float negativeMagnitudeSquared = -dot(relativePosition, relativePosition);

    // 边界检查：超出椭圆边界的点被剔除
    if (negativeMagnitudeSquared < -BOUNDS_RADIUS_SQUARED) {
        return 0.0;
    }

    // ✅ 修复：高斯衰减，使用MetalSplatter的公式 exp(0.5 * negative)
    return exp(0.5 * negativeMagnitudeSquared) * splatAlpha;
}

void main() {
    // 计算当前像素的透明度
    float alpha = splatFragmentAlpha(v_relativePosition, v_color.a);

    // 非预乘alpha输出，标准alpha混合
    fragColor = vec4(v_color.rgb, alpha);
}
`;function L(c){const t=c.createShader(c.VERTEX_SHADER);if(c.shaderSource(t,z),c.compileShader(t),!c.getShaderParameter(t,c.COMPILE_STATUS))throw new Error("顶点着色器编译失败: "+c.getShaderInfoLog(t));const e=c.createShader(c.FRAGMENT_SHADER);if(c.shaderSource(e,B),c.compileShader(e),!c.getShaderParameter(e,c.COMPILE_STATUS))throw new Error("片段着色器编译失败: "+c.getShaderInfoLog(e));const i=c.createProgram();if(c.attachShader(i,t),c.attachShader(i,e),c.linkProgram(i),!c.getProgramParameter(i,c.LINK_STATUS))throw new Error("着色器程序链接失败: "+c.getProgramInfoLog(i));return c.deleteShader(t),c.deleteShader(e),i}const q=`#version 300 es
precision highp float;

// 基础四边形顶点属性（共享4个顶点）
layout(location = 0) in vec2 a_quadVertex;      // (-1,-1), (-1,1), (1,-1), (1,1)

// 实例化属性（每个splat实例）
layout(location = 1) in vec3 a_position;        // splat中心位置
layout(location = 2) in vec4 a_color;           // RGBA颜色
layout(location = 3) in vec3 a_scale;           // 缩放参数 [sx, sy, sz]
layout(location = 4) in vec4 a_rotation;        // 旋转四元数 [x, y, z, w]

// Uniform变量
uniform mat4 u_viewMatrix;
uniform mat4 u_projectionMatrix;
uniform vec2 u_screenSize;
uniform int u_enableFrustumCulling;

// 输出到片段着色器
out vec2 v_relativePosition;
out vec4 v_color;

// 常量定义
const float BOUNDS_RADIUS = 3.0;

/**
 * 计算3D协方差矩阵（从scale和rotation）
 * 公式: Σ = R·S·S^T·R^T
 * 返回: mat3协方差矩阵
 */
mat3 computeCov3D(vec3 scale, vec4 rotation) {
    // 四元数归一化
    vec4 q = normalize(rotation);
    float qx = q.x;
    float qy = q.y;
    float qz = q.z;
    float qw = q.w;

    // 从四元数构建旋转矩阵R
    // GLSL mat3构造函数按列填充，所以这里写的是列向量
    // 对于四元数 q = [x,y,z,w]，旋转矩阵为:
    mat3 R = mat3(
        1.0 - 2.0*(qy*qy + qz*qz), 2.0*(qx*qy + qz*qw), 2.0*(qx*qz - qy*qw),  // 第一列
        2.0*(qx*qy - qz*qw), 1.0 - 2.0*(qx*qx + qz*qz), 2.0*(qy*qz + qx*qw),  // 第二列
        2.0*(qx*qz + qy*qw), 2.0*(qy*qz - qx*qw), 1.0 - 2.0*(qx*qx + qy*qy)   // 第三列
    );

    // 缩放矩阵S（对角矩阵）
    mat3 S = mat3(
        scale.x, 0.0, 0.0,
        0.0, scale.y, 0.0,
        0.0, 0.0, scale.z
    );

    // 计算协方差矩阵: Σ = R·S·S^T·R^T
    // 优化: S·S^T 对于对角矩阵等于 diag(scale^2)
    mat3 SSquared = mat3(
        scale.x * scale.x, 0.0, 0.0,
        0.0, scale.y * scale.y, 0.0,
        0.0, 0.0, scale.z * scale.z
    );

    // Σ = R·(S^2)·R^T
    mat3 covariance = R * SSquared * transpose(R);

    return covariance;
}

/**
 * 计算2D协方差矩阵（复刻Metal版本）
 * 优化: 直接接收3D协方差矩阵而非拆分的covA/covB
 */
vec3 calcCovariance2D(vec3 viewPos, mat3 cov3D, mat4 viewMatrix, mat4 projectionMatrix, vec2 screenSize) {
    float invViewPosZ = 1.0 / viewPos.z;
    float invViewPosZSquared = invViewPosZ * invViewPosZ;

    // FOV限制
    float tanHalfFovX = 1.0 / projectionMatrix[0][0];
    float tanHalfFovY = 1.0 / projectionMatrix[1][1];
    float limX = 1.3 * tanHalfFovX;
    float limY = 1.3 * tanHalfFovY;

    viewPos.x = clamp(viewPos.x * invViewPosZ, -limX, limX) * viewPos.z;
    viewPos.y = clamp(viewPos.y * invViewPosZ, -limY, limY) * viewPos.z;

    // 焦距计算
    float focalX = screenSize.x * projectionMatrix[0][0] / 2.0;
    float focalY = screenSize.y * projectionMatrix[1][1] / 2.0;

    // 雅可比矩阵 J
    mat3 J = mat3(
        focalX * invViewPosZ, 0.0, 0.0,
        0.0, focalY * invViewPosZ, 0.0,
        -(focalX * viewPos.x) * invViewPosZSquared, -(focalY * viewPos.y) * invViewPosZSquared, 0.0
    );

    // 视图变换矩阵 W (仅旋转部分) - 固定使用转置（经验最清晰）
    mat3 W = transpose(mat3(viewMatrix[0].xyz, viewMatrix[1].xyz, viewMatrix[2].xyz));

    // 投影变换 T = J * W
    mat3 T = J * W;

    // 2D协方差矩阵 = T * Vrk * T^T
    mat3 cov = T * cov3D * transpose(T);

    // 低通滤波器
    cov[0][0] += 0.3;
    cov[1][1] += 0.3;

    return vec3(cov[0][0], cov[0][1], cov[1][1]);
}

/**
 * 分解协方差矩阵
 */
void decomposeCovariance(vec3 cov2D, out vec2 v1, out vec2 v2) {
    float a = cov2D.x;
    float b = cov2D.y;
    float d = cov2D.z;

    float det = a * d - b * b;
    float trace = a + d;

    float mean = 0.5 * trace;
    float dist = max(0.1, sqrt(mean * mean - det));

    // 特征值
    float lambda1 = mean + dist;
    float lambda2 = mean - dist;

    // 确保特征值为正
    lambda1 = max(lambda1, 0.01);
    lambda2 = max(lambda2, 0.01);

    // 特征向量 - 完全复刻MetalSplatter的算法
    vec2 eigenvector1;
    if (abs(b) < 1e-6) {
        eigenvector1 = (a > d) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    } else {
        // ✅ 修复：使用MetalSplatter的公式 (b, d - lambda2) 而不是 (b, lambda1 - a)
        eigenvector1 = normalize(vec2(b, d - lambda2));
    }

    // ✅ 修复：正交特征向量，使用MetalSplatter的方向 (y, -x) 而不是 (-y, x)
    vec2 eigenvector2 = vec2(eigenvector1.y, -eigenvector1.x);

    v1 = eigenvector1 * sqrt(lambda1);
    v2 = eigenvector2 * sqrt(lambda2);
}

void main() {
    // 直接使用原始位置数据，不进行硬编码缩放
    vec3 scaledPosition = a_position;

    // 转换到视图空间
    vec4 viewPosition4 = u_viewMatrix * vec4(scaledPosition, 1.0);
    vec3 viewPosition3 = viewPosition4.xyz;

    // 🚀 GPU优化: 在GPU中计算3D协方差矩阵
    mat3 cov3D = computeCov3D(a_scale, a_rotation);

    // 计算2D协方差矩阵
    vec3 cov2D = calcCovariance2D(viewPosition3, cov3D, u_viewMatrix, u_projectionMatrix, u_screenSize);

    // 分解协方差矩阵
    vec2 axis1, axis2;
    decomposeCovariance(cov2D, axis1, axis2);

    // 投影到屏幕空间
    vec4 projectedCenter = u_projectionMatrix * viewPosition4;

    // 视锥体剔除（对齐MetalSplatter边界，可调试禁用）
    if (u_enableFrustumCulling == 1) {
        float bounds = 1.2 * projectedCenter.w;
        if (projectedCenter.z < 0.0 ||
            projectedCenter.z > projectedCenter.w ||
            projectedCenter.x < -bounds ||
            projectedCenter.x > bounds ||
            projectedCenter.y < -bounds ||
            projectedCenter.y > bounds) {
            // 剔除到屏幕外
            gl_Position = vec4(1.0, 1.0, 0.0, 1.0);
            return;
        }
    }

    // 使用实例化的四边形顶点
    vec2 relativeCoord = a_quadVertex;

    // 计算椭圆变换后的相对位置（像素单位）
    vec2 ellipseRelativePos = relativeCoord.x * axis1 + relativeCoord.y * axis2;

    // 计算屏幕空间偏移
    vec2 screenSizeFloat = u_screenSize;
    vec2 projectedScreenDelta = ellipseRelativePos * 2.0 * BOUNDS_RADIUS / screenSizeFloat;

    // 最终顶点位置
    gl_Position = vec4(
        projectedCenter.x + projectedScreenDelta.x * projectedCenter.w,
        projectedCenter.y + projectedScreenDelta.y * projectedCenter.w,
        projectedCenter.z,
        projectedCenter.w
    );

    // 传递标准化坐标给片段着色器（椭圆内[-1,1]范围）
    v_relativePosition = relativeCoord * BOUNDS_RADIUS;
    v_color = a_color;
}
`,U=`#version 300 es
precision highp float;

in vec2 v_relativePosition;
in vec4 v_color;

out vec4 fragColor;

const float BOUNDS_RADIUS = 3.0;
const float BOUNDS_RADIUS_SQUARED = BOUNDS_RADIUS * BOUNDS_RADIUS;

float splatFragmentAlpha(vec2 relativePosition, float splatAlpha) {
    // ✅ 修复：完全匹配MetalSplatter的计算方式
    float negativeMagnitudeSquared = -dot(relativePosition, relativePosition);

    // 边界检查：超出椭圆边界的点被剔除
    if (negativeMagnitudeSquared < -BOUNDS_RADIUS_SQUARED) {
        return 0.0;
    }

    // ✅ 修复：高斯衰减，使用MetalSplatter的公式 exp(0.5 * negative)
    return exp(0.5 * negativeMagnitudeSquared) * splatAlpha;
}

void main() {
    float alpha = splatFragmentAlpha(v_relativePosition, v_color.a);

    // 非预乘alpha输出，标准alpha混合
    fragColor = vec4(v_color.rgb, alpha);
}
`;function W(c){const t=c.createShader(c.VERTEX_SHADER);if(c.shaderSource(t,q),c.compileShader(t),!c.getShaderParameter(t,c.COMPILE_STATUS))throw new Error("实例化顶点着色器编译失败: "+c.getShaderInfoLog(t));const e=c.createShader(c.FRAGMENT_SHADER);if(c.shaderSource(e,U),c.compileShader(e),!c.getShaderParameter(e,c.COMPILE_STATUS))throw new Error("实例化片段着色器编译失败: "+c.getShaderInfoLog(e));const i=c.createProgram();if(c.attachShader(i,t),c.attachShader(i,e),c.linkProgram(i),!c.getProgramParameter(i,c.LINK_STATUS))throw new Error("实例化着色器程序链接失败: "+c.getProgramInfoLog(i));return c.deleteShader(t),c.deleteShader(e),i}class V{constructor(t={}){this.options={batchSize:1e4,sortThreshold:.01,maxWorkers:4,sortStrategy:"distance",debug:!1,...t},this.workerSafeMaxCount=5e4,this.workers=[],this.availableWorkers=[],this.workerQueue=[],this.lastCameraPosition=[0,0,0],this.lastCameraForward=[0,0,-1],this.needsSort=!0,this.sorting=!1,this.sortProgress=0,this.sortStats={totalSorts:0,avgSortTime:0,lastSortTime:0,skippedSorts:0},this.onSortComplete=null,this.onSortProgress=null}async initialize(){await this.createWorkerPool()}async createWorkerPool(){const t=this.createWorkerCode(),e=new Blob([t],{type:"application/javascript"}),i=URL.createObjectURL(e);try{for(let a=0;a<this.options.maxWorkers;a++){const s=new Worker(i);s.onmessage=this.handleWorkerMessage.bind(this),s.onerror=this.handleWorkerError.bind(this),this.workers.push(s),this.availableWorkers.push(s)}}catch{}URL.revokeObjectURL(i)}createWorkerCode(){return`
            class SplatSortWorker {
                constructor() {
                    this.sortId = null;
                }

                // 从序列化数据重建splat位置信息（仅用于排序）
                deserializeSplatData(splatData) {
                    const count = splatData.count;
                    const positions = new Float32Array(splatData.positions);

                    const splats = [];
                    for (let i = 0; i < count; i++) {
                        const base3 = i * 3;
                        splats.push({
                            position: [
                                positions[base3],
                                positions[base3 + 1],
                                positions[base3 + 2]
                            ]
                        });
                    }
                    return splats;
                }

                sortSplats(splats, cameraPosition, cameraForward, sortStrategy) {
                    const startTime = performance.now();
                    const indexAndDepth = [];

                    // 计算每个splat的排序值
                    for (let i = 0; i < splats.length; i++) {
                        const splat = splats[i];
                        const pos = splat.position;

                        let sortValue;
                        if (sortStrategy === 'distance') {
                            // 欧几里得距离
                            const dx = pos[0] - cameraPosition[0];
                            const dy = pos[1] - cameraPosition[1];
                            const dz = pos[2] - cameraPosition[2];
                            sortValue = dx*dx + dy*dy + dz*dz; // 不开方，节省计算
                        } else {
                            // 沿相机前向的投影深度
                            sortValue =
                                (pos[0] - cameraPosition[0]) * cameraForward[0] +
                                (pos[1] - cameraPosition[1]) * cameraForward[1] +
                                (pos[2] - cameraPosition[2]) * cameraForward[2];
                        }

                        indexAndDepth.push({ index: i, depth: sortValue });
                    }

                    // 排序（从远到近）
                    indexAndDepth.sort((a, b) => b.depth - a.depth);

                    const sortTime = performance.now() - startTime;

                    return {
                        indexAndDepth,
                        sortTime,
                        splatCount: splats.length
                    };
                }

                // 批量排序（用于大数据集）
                batchSort(splats, cameraPosition, cameraForward, sortStrategy, batchSize) {
                    const totalBatches = Math.ceil(splats.length / batchSize);
                    const allResults = [];

                    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
                        const start = batchIndex * batchSize;
                        const end = Math.min(start + batchSize, splats.length);
                        const batch = splats.slice(start, end);

                        const result = this.sortSplats(batch, cameraPosition, cameraForward, sortStrategy);

                        // 调整索引偏移
                        result.indexAndDepth.forEach(item => {
                            item.index += start;
                        });

                        allResults.push(result);

                        // 发送进度更新
                        self.postMessage({
                            type: 'progress',
                            sortId: this.sortId,
                            progress: (batchIndex + 1) / totalBatches,
                            batchIndex: batchIndex + 1,
                            totalBatches
                        });
                    }

                    // 合并所有批次的结果
                    const mergedResult = this.mergeBatchResults(allResults);
                    return mergedResult;
                }

                // 合并批次排序结果
                mergeBatchResults(batchResults) {
                    const allIndexAndDepth = [];
                    let totalSortTime = 0;
                    let totalSplatCount = 0;

                    for (const result of batchResults) {
                        allIndexAndDepth.push(...result.indexAndDepth);
                        totalSortTime += result.sortTime;
                        totalSplatCount += result.splatCount;
                    }

                    // 最终全局排序
                    allIndexAndDepth.sort((a, b) => b.depth - a.depth);

                    return {
                        indexAndDepth: allIndexAndDepth,
                        sortTime: totalSortTime,
                        splatCount: totalSplatCount
                    };
                }
            }

            const sorter = new SplatSortWorker();

            self.onmessage = function(e) {
                const { type, sortId, splatData, splats, cameraPosition, cameraForward, sortStrategy, batchSize } = e.data;

                sorter.sortId = sortId;

                try {
                    let result;

                    if (type === 'sort') {
                        let processedSplats;

                        // 检查是否使用新的优化数据格式
                        if (splatData) {
                            // 新格式：从TypedArray反序列化
                            processedSplats = sorter.deserializeSplatData(splatData);
                        } else {
                            // 旧格式：直接使用splats数组（兼容性）
                            processedSplats = splats;
                        }

                        if (batchSize && processedSplats.length > batchSize) {
                            result = sorter.batchSort(processedSplats, cameraPosition, cameraForward, sortStrategy, batchSize);
                        } else {
                            result = sorter.sortSplats(processedSplats, cameraPosition, cameraForward, sortStrategy);
                        }

                        self.postMessage({
                            type: 'complete',
                            sortId,
                            result
                        });
                    }
                } catch (error) {
                    self.postMessage({
                        type: 'error',
                        sortId,
                        error: error.message
                    });
                }
            };
        `}handleWorkerMessage(t){const{type:e,sortId:i,result:a,progress:s,error:o}=t.data,r=t.target;switch(e){case"complete":this.handleSortComplete(r,i,a);break;case"progress":this.handleSortProgress(i,s);break;case"error":this.handleSortError(r,i,o);break}}handleWorkerError(t){const e=t.target;this.availableWorkers.includes(e)||this.availableWorkers.push(e),this.processWorkerQueue()}async sortSplats(t,e,i=[0,0,-1]){if(!this.shouldSort(e,i))return this.sortStats.skippedSorts++,null;if(this.sorting)return null;const a=performance.now();this.sorting=!0,this.sortProgress=0;try{let s;Array.isArray(t)&&t.length>this.workerSafeMaxCount?s=this.sortOnMainThread(t,e,i):this.availableWorkers.length>0?s=await this.sortWithWorker(t,e,i):s=this.sortOnMainThread(t,e,i);const o=performance.now()-a;return this.updateSortStats(o),this.lastCameraPosition=[...e],this.lastCameraForward=[...i],this.needsSort=!1,this.onSortComplete&&this.onSortComplete(s),s}finally{this.sorting=!1}}serializeSplatsOptimized(t){const e=t.length,i=new Float32Array(e*3),a=new Float32Array(e*4),s=new Float32Array(e*3),o=new Float32Array(e*3);for(let r=0;r<e;r++){const l=t[r],n=r*3,h=r*4;i[n]=l.position[0],i[n+1]=l.position[1],i[n+2]=l.position[2],a[h]=l.color[0],a[h+1]=l.color[1],a[h+2]=l.color[2],a[h+3]=l.color[3],s[n]=l.covA[0],s[n+1]=l.covA[1],s[n+2]=l.covA[2],o[n]=l.covB[0],o[n+1]=l.covB[1],o[n+2]=l.covB[2]}return{count:e,positions:i.buffer,colors:a.buffer,covAs:s.buffer,covBs:o.buffer}}sortWithWorker(t,e,i){return new Promise((a,s)=>{const o=this.availableWorkers.pop(),r=Date.now()+Math.random(),l=setTimeout(()=>{s(new Error("Sort timeout"))},3e4);o._currentResolve=a,o._currentReject=s,o._currentTimeout=l,o._currentSortId=r;const n=this.serializeSplatsOptimized(t);o.postMessage({type:"sort",sortId:r,splatData:n,cameraPosition:e,cameraForward:i,sortStrategy:this.options.sortStrategy,batchSize:this.options.batchSize},[n.positions,n.colors,n.covAs,n.covBs])})}handleSortComplete(t,e,i){t._currentSortId===e&&(clearTimeout(t._currentTimeout),t._currentResolve(i),delete t._currentResolve,delete t._currentReject,delete t._currentTimeout,delete t._currentSortId),this.availableWorkers.push(t),this.processWorkerQueue()}handleSortProgress(t,e){this.sortProgress=e,this.onSortProgress&&this.onSortProgress(e)}handleSortError(t,e,i){t._currentSortId===e&&(clearTimeout(t._currentTimeout),t._currentReject(new Error(i)),delete t._currentResolve,delete t._currentReject,delete t._currentTimeout,delete t._currentSortId),this.availableWorkers.push(t),this.processWorkerQueue()}processWorkerQueue(){this.workerQueue.length>0&&this.availableWorkers.length>0&&this.workerQueue.shift()()}sortOnMainThread(t,e,i){const a=performance.now(),s=[];for(let r=0;r<t.length;r++){const l=t[r];let n;if(this.options.sortStrategy==="distance")n=l.getDistanceToCamera(e);else{const h=l.position;n=(h[0]-e[0])*i[0]+(h[1]-e[1])*i[1]+(h[2]-e[2])*i[2]}s.push({index:r,depth:n})}s.sort((r,l)=>l.depth-r.depth);const o=performance.now()-a;return{indexAndDepth:s,sortTime:o,splatCount:t.length}}shouldSort(t,e){if(this.needsSort)return!0;const i=Math.sqrt(Math.pow(t[0]-this.lastCameraPosition[0],2)+Math.pow(t[1]-this.lastCameraPosition[1],2)+Math.pow(t[2]-this.lastCameraPosition[2],2)),a=e[0]*this.lastCameraForward[0]+e[1]*this.lastCameraForward[1]+e[2]*this.lastCameraForward[2],s=1-Math.abs(a);return i>this.options.sortThreshold||s>this.options.sortThreshold}markNeedsSort(){this.needsSort=!0}updateSortStats(t){this.sortStats.totalSorts++,this.sortStats.lastSortTime=t;const e=.1;this.sortStats.avgSortTime=this.sortStats.avgSortTime*(1-e)+t*e}getSortStats(){return{...this.sortStats}}onComplete(t){this.onSortComplete=t}onProgress(t){this.onSortProgress=t}dispose(){for(const t of this.workers)t.terminate();this.workers=[],this.availableWorkers=[],this.workerQueue=[]}}class A{constructor(){this.position=new Float32Array(3),this.color=new Float32Array(4),this.scale=new Float32Array(3),this.rotation=new Float32Array(4),this.covA=new Float32Array(3),this.covB=new Float32Array(3)}static fromPLY(t){const e=new A;e.position[0]=t.x||0,e.position[1]=t.y||0,e.position[2]=t.z||0,e.color[0]=(t.red||0)/255,e.color[1]=(t.green||0)/255,e.color[2]=(t.blue||0)/255,e.color[3]=t.opacity||1,e.scale[0]=t.scale_0||1,e.scale[1]=t.scale_1||1,e.scale[2]=t.scale_2||1,e.rotation[0]=t.rot_0||0,e.rotation[1]=t.rot_1||0,e.rotation[2]=t.rot_2||0,e.rotation[3]=t.rot_3||1;const i=[e.scale[0],e.scale[1],e.scale[2]],a=[e.rotation[0],e.rotation[1],e.rotation[2],e.rotation[3]],s=A.computeCovariance3D(i,a);return e.covA[0]=s[0][0],e.covA[1]=s[0][1],e.covA[2]=s[0][2],e.covB[0]=s[1][1],e.covB[1]=s[1][2],e.covB[2]=s[2][2],e}static computeCovariance3D(t,e){const i=e[3],a=e[0],s=e[1],o=e[2],r=Math.sqrt(i*i+a*a+s*s+o*o),l=i/r,n=a/r,h=s/r,m=o/r,d=[[1-2*(h*h+m*m),2*(n*h-m*l),2*(n*m+h*l)],[2*(n*h+m*l),1-2*(n*n+m*m),2*(h*m-n*l)],[2*(n*m-h*l),2*(h*m+n*l),1-2*(n*n+h*h)]],p=[[t[0],0,0],[0,t[1],0],[0,0,t[2]]],u=A.multiplyMatrices(d,p),f=A.multiplyMatrices(u,A.transpose(p));return A.multiplyMatrices(f,A.transpose(d))}static multiplyMatrices(t,e){const i=[[0,0,0],[0,0,0],[0,0,0]];for(let a=0;a<3;a++)for(let s=0;s<3;s++)i[a][s]=t[a][0]*e[0][s]+t[a][1]*e[1][s]+t[a][2]*e[2][s];return i}static transpose(t){return[[t[0][0],t[1][0],t[2][0]],[t[0][1],t[1][1],t[2][1]],[t[0][2],t[1][2],t[2][2]]]}static fromWASM(t){const e=new A;return e.position.set(t.position),e.color.set(t.color),e.covA.set(t.covA),e.covB.set(t.covB),e}toObject(){return{position:Array.from(this.position),color:Array.from(this.color),covA:Array.from(this.covA),covB:Array.from(this.covB)}}static fromObject(t){const e=new A;return e.position.set(t.position),e.color.set(t.color),e.covA.set(t.covA),e.covB.set(t.covB),e}clone(){const t=new A;return t.position.set(this.position),t.color.set(this.color),t.covA.set(this.covA),t.covB.set(this.covB),t}getDepthInCameraSpace(t){const e=this.position;return t[2]*e[0]+t[6]*e[1]+t[10]*e[2]+t[14]}getDistanceToCamera(t){const e=this.position[0]-t[0],i=this.position[1]-t[1],a=this.position[2]-t[2];return Math.sqrt(e*e+i*i+a*a)}isInFrustum(t,e=1.2){const i=this.position,a=t[0]*i[0]+t[4]*i[1]+t[8]*i[2]+t[12],s=t[1]*i[0]+t[5]*i[1]+t[9]*i[2]+t[13],o=t[2]*i[0]+t[6]*i[1]+t[10]*i[2]+t[14],r=t[3]*i[0]+t[7]*i[1]+t[11]*i[2]+t[15],l=e*r;return o>=0&&o<=r&&a>=-l&&a<=l&&s>=-l&&s<=l}}class M{constructor(){this.splats=[],this.isDirty=!0}add(t){this.splats.push(t),this.isDirty=!0}addBatch(t){this.splats.push(...t),this.isDirty=!0}clear(){this.splats=[],this.isDirty=!0}get count(){return this.splats.length}sortByDistance(t){this.splats.sort((e,i)=>{const a=e.getDistanceToCamera(t);return i.getDistanceToCamera(t)-a}),this.isDirty=!0}sortByDepth(t){this.splats.sort((e,i)=>{const a=e.getDepthInCameraSpace(t);return i.getDepthInCameraSpace(t)-a}),this.isDirty=!0}cullByFrustum(t){return this.splats.filter(e=>e.isInFrustum(t))}getBoundingBox(){if(this.splats.length===0)return{min:[0,0,0],max:[0,0,0]};const t=[1/0,1/0,1/0],e=[-1/0,-1/0,-1/0];for(const i of this.splats){const a=i.position;t[0]=Math.min(t[0],a[0]),t[1]=Math.min(t[1],a[1]),t[2]=Math.min(t[2],a[2]),e[0]=Math.max(e[0],a[0]),e[1]=Math.max(e[1],a[1]),e[2]=Math.max(e[2],a[2])}return{min:t,max:e}}toArray(){return this.splats.map(t=>t.toObject())}fromArray(t){this.splats=t.map(e=>A.fromObject(e)),this.isDirty=!0}markClean(){this.isDirty=!1}get dirty(){return this.isDirty}}class N{constructor(t={}){this.options={canvas:null,debug:!1,backgroundColor:[1,1,1,1],enableDepthTest:!0,maxIndexedSplatCount:1024,enableFrustumCulling:!0,...t},this.gl=null,this.shaderProgram=null,this.instancedShaderProgram=null,this.uniformLocations={},this.attributeLocations={},this.instancedUniformLocations={},this.instancedAttributeLocations={},this.splatBuffer=null,this.splatBufferPrime=null,this.indexBuffer=null,this.vertexArray=null,this.instancedSplatBuffer=null,this.quadVertexBuffer=null,this.instancedVertexArray=null,this.splatCount=0,this.isInitialized=!1,this.needsSort=!0,this.sorting=!1,this.hasLoggedValidation=!1,this.originalSplats=[],this.cameraWorldPosition=[0,0,0],this.cameraWorldForward=[0,0,-1],this.splatSorter=new V({debug:this.options.debug,sortThreshold:.01,maxWorkers:2}),this.renderStats={drawCalls:0,splatCount:0,frameTime:0},this.usingFlat=!1,this.flatData=null,this.lastOrderArray=null}async initialize(){try{const t=this.options.canvas;if(!t)throw new Error("Canvas element is required");if(this.gl=t.getContext("webgl2",{antialias:!1,alpha:!1,premultipliedAlpha:!0,powerPreference:"high-performance",preserveDrawingBuffer:!1}),!this.gl)throw new Error("WebGL2 not supported");const e=this.gl;return this.checkRequiredExtensions(),this.shaderProgram=L(e),this.instancedShaderProgram=W(e),this.setupShaderLocations(),this.setupWebGLState(),this.createBuffers(),await this.splatSorter.initialize(),this.isInitialized=!0,!0}catch(t){throw t}}checkRequiredExtensions(){const t=this.gl;t.getExtension("EXT_color_buffer_float"),t.getExtension("EXT_sRGB")?this.sRGBSupported=!0:this.sRGBSupported=!1}setupShaderLocations(){const t=this.gl,e=this.shaderProgram;this.uniformLocations={viewMatrix:t.getUniformLocation(e,"u_viewMatrix"),projectionMatrix:t.getUniformLocation(e,"u_projectionMatrix"),screenSize:t.getUniformLocation(e,"u_screenSize"),boundsRadius:t.getUniformLocation(e,"u_boundsRadius"),enableFrustumCulling:t.getUniformLocation(e,"u_enableFrustumCulling")},this.attributeLocations={position:0,color:1,scale:2,rotation:3,vertexId:4};const i=this.instancedShaderProgram;this.instancedUniformLocations={viewMatrix:t.getUniformLocation(i,"u_viewMatrix"),projectionMatrix:t.getUniformLocation(i,"u_projectionMatrix"),screenSize:t.getUniformLocation(i,"u_screenSize"),enableFrustumCulling:t.getUniformLocation(i,"u_enableFrustumCulling")},this.instancedAttributeLocations={quadVertex:0,position:1,color:2,scale:3,rotation:4}}setupWebGLState(){const t=this.gl;t.disable(t.DEPTH_TEST),t.depthMask(!0),t.enable(t.BLEND),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA);const e=this.options.backgroundColor;t.clearColor(e[0],e[1],e[2],e[3])}createBuffers(){const t=this.gl;this.vertexArray=t.createVertexArray(),this.splatBuffer=t.createBuffer(),this.splatBufferPrime=t.createBuffer(),this.createIndexBuffer(),this.instancedVertexArray=t.createVertexArray(),this.instancedSplatBuffer=t.createBuffer(),this.createQuadVertexBuffer()}createIndexBuffer(){const t=this.gl,e=this.options.maxIndexedSplatCount,i=new Uint32Array(e*6);for(let a=0;a<e;a++){const s=a*4,o=a*6;i[o+0]=s+0,i[o+1]=s+1,i[o+2]=s+2,i[o+3]=s+1,i[o+4]=s+3,i[o+5]=s+2}this.indexBuffer=t.createBuffer(),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.indexBuffer),t.bufferData(t.ELEMENT_ARRAY_BUFFER,i,t.STATIC_DRAW)}createQuadVertexBuffer(){const t=this.gl,e=new Float32Array([-1,-1,-1,1,1,-1,1,1]);this.quadVertexBuffer=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.quadVertexBuffer),t.bufferData(t.ARRAY_BUFFER,e,t.STATIC_DRAW)}loadSplats(t){if(!this.isInitialized)throw new Error("Renderer not initialized");const e=this.gl;this.splatCount=t.length,this.originalSplats=[...t],this.usingFlat=!1,this.flatData=null;const i=Math.min(t.length,this.options.maxIndexedSplatCount),a=t.slice(0,i),s=t.slice(i),o=this.packSplatData(a);e.bindBuffer(e.ARRAY_BUFFER,this.splatBuffer),e.bufferData(e.ARRAY_BUFFER,o,e.DYNAMIC_DRAW),e.bindBuffer(e.ARRAY_BUFFER,this.splatBufferPrime),e.bufferData(e.ARRAY_BUFFER,o,e.DYNAMIC_DRAW);const r=s.length>0?this.packInstancedSplatData(s):new Float32Array(0);e.bindBuffer(e.ARRAY_BUFFER,this.instancedSplatBuffer),e.bufferData(e.ARRAY_BUFFER,r,e.DYNAMIC_DRAW),this.needsSort=!0,this.splatSorter&&this.splatSorter.markNeedsSort(),this.options.debug&&!this.hasLoggedValidation&&(this.validateSplatDataSilent(t),this.hasLoggedValidation=!0)}loadSplatsFromFlat(t){if(!this.isInitialized)throw new Error("Renderer not initialized");const e=t.pointCount;this.splatCount=e,this.usingFlat=!0,this.flatData=t;const i=this.lastOrderArray&&this.lastOrderArray.length===e?this.lastOrderArray:null;this.packFlatToBuffers(t,i),this.needsSort=!0,this.splatSorter&&this.splatSorter.markNeedsSort()}packFlatToBuffers(t,e){const i=this.gl,a=t.pointCount,s=e||null,r=Math.min(a,this.options.maxIndexedSplatCount),l=Math.max(0,a-r),n=15,h=4,m=new Float32Array(r*h*n);let d=0;for(let f=0;f<r;f++){const v=s?s[f]:f,g=v*3,y=v*4,S=[t.scales[g]||1,t.scales[g+1]||1,t.scales[g+2]||1],w=[t.rotations[y+1]||0,t.rotations[y+2]||0,t.rotations[y+3]||0,t.rotations[y]||1];for(let F=0;F<4;F++)m[d++]=t.positions[g],m[d++]=t.positions[g+1],m[d++]=t.positions[g+2],m[d++]=t.colors[g],m[d++]=t.colors[g+1],m[d++]=t.colors[g+2],m[d++]=t.opacities[v]??1,m[d++]=S[0],m[d++]=S[1],m[d++]=S[2],m[d++]=w[0],m[d++]=w[1],m[d++]=w[2],m[d++]=w[3],m[d++]=F}i.bindBuffer(i.ARRAY_BUFFER,this.splatBuffer),i.bufferData(i.ARRAY_BUFFER,m,i.DYNAMIC_DRAW),i.bindBuffer(i.ARRAY_BUFFER,this.splatBufferPrime),i.bufferData(i.ARRAY_BUFFER,m,i.DYNAMIC_DRAW);const p=14,u=new Float32Array(l*p);d=0;for(let f=0;f<l;f++){const v=s?s[r+f]:r+f,g=v*3,y=v*4,S=[t.scales[g]||1,t.scales[g+1]||1,t.scales[g+2]||1],w=[t.rotations[y+1]||0,t.rotations[y+2]||0,t.rotations[y+3]||0,t.rotations[y]||1];u[d++]=t.positions[g],u[d++]=t.positions[g+1],u[d++]=t.positions[g+2],u[d++]=t.colors[g],u[d++]=t.colors[g+1],u[d++]=t.colors[g+2],u[d++]=t.opacities[v]??1,u[d++]=S[0],u[d++]=S[1],u[d++]=S[2],u[d++]=w[0],u[d++]=w[1],u[d++]=w[2],u[d++]=w[3]}i.bindBuffer(i.ARRAY_BUFFER,this.instancedSplatBuffer),i.bufferData(i.ARRAY_BUFFER,u,i.DYNAMIC_DRAW)}sortFlatData(){if(!this.flatData)return null;const t=this.flatData.pointCount,e=new Array(t),i=new Float32Array(t),a=this.cameraWorldPosition,s=this.cameraWorldForward;for(let o=0;o<t;o++){e[o]=o;const r=o*3,l=this.flatData.positions[r]-a[0],n=this.flatData.positions[r+1]-a[1],h=this.flatData.positions[r+2]-a[2];i[o]=l*s[0]+n*s[1]+h*s[2]}return e.sort((o,r)=>i[r]-i[o]),this.packFlatToBuffers(this.flatData,e),this.lastSortedIndexes=e.map(o=>({index:o,depth:i[o]})),this.lastOrderArray=Int32Array.from(e),this.lastSortedIndexes}updateSplatDataDirect(t){if(!this.isInitialized)throw new Error("Renderer not initialized");const e=this.gl;if(this.splatCount=t.length,this.originalSplats=[...t],this.lastSortedIndexes&&this.lastSortedIndexes.length===t.length){const i=this.lastSortedIndexes.map(n=>t[n.index]),a=Math.min(i.length,this.options.maxIndexedSplatCount),s=i.slice(0,a),o=i.slice(a),r=this.packSplatData(s),l=o.length>0?this.packInstancedSplatData(o):new Float32Array(0);e.bindBuffer(e.ARRAY_BUFFER,this.splatBuffer),e.bufferData(e.ARRAY_BUFFER,r,e.DYNAMIC_DRAW),e.bindBuffer(e.ARRAY_BUFFER,this.splatBufferPrime),e.bufferData(e.ARRAY_BUFFER,r,e.DYNAMIC_DRAW),e.bindBuffer(e.ARRAY_BUFFER,this.instancedSplatBuffer),e.bufferData(e.ARRAY_BUFFER,l,e.DYNAMIC_DRAW)}else this.loadSplats(t)}packSplatData(t){const a=new Float32Array(t.length*4*15);let s=0;for(let o=0;o<t.length;o++){const r=t[o];for(let l=0;l<4;l++)a[s++]=r.position[0],a[s++]=r.position[1],a[s++]=r.position[2],a[s++]=r.color[0],a[s++]=r.color[1],a[s++]=r.color[2],a[s++]=r.color[3],a[s++]=r.scale[0],a[s++]=r.scale[1],a[s++]=r.scale[2],a[s++]=r.rotation[0],a[s++]=r.rotation[1],a[s++]=r.rotation[2],a[s++]=r.rotation[3],a[s++]=l}return a}packInstancedSplatData(t){const i=new Float32Array(t.length*14);let a=0;for(let s=0;s<t.length;s++){const o=t[s];i[a++]=o.position[0],i[a++]=o.position[1],i[a++]=o.position[2],i[a++]=o.color[0],i[a++]=o.color[1],i[a++]=o.color[2],i[a++]=o.color[3],i[a++]=o.scale[0],i[a++]=o.scale[1],i[a++]=o.scale[2],i[a++]=o.rotation[0],i[a++]=o.rotation[1],i[a++]=o.rotation[2],i[a++]=o.rotation[3]}return i}setupVertexAttributes(){const t=this.gl,e=15,i=4,a=e*i;t.bindVertexArray(this.vertexArray),t.bindBuffer(t.ARRAY_BUFFER,this.splatBuffer),t.enableVertexAttribArray(this.attributeLocations.position),t.vertexAttribPointer(this.attributeLocations.position,3,t.FLOAT,!1,a,0),t.enableVertexAttribArray(this.attributeLocations.color),t.vertexAttribPointer(this.attributeLocations.color,4,t.FLOAT,!1,a,3*i),t.enableVertexAttribArray(this.attributeLocations.scale),t.vertexAttribPointer(this.attributeLocations.scale,3,t.FLOAT,!1,a,7*i),t.enableVertexAttribArray(this.attributeLocations.rotation),t.vertexAttribPointer(this.attributeLocations.rotation,4,t.FLOAT,!1,a,10*i),t.enableVertexAttribArray(this.attributeLocations.vertexId),t.vertexAttribPointer(this.attributeLocations.vertexId,1,t.FLOAT,!1,a,14*i),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.indexBuffer)}setupInstancedVertexAttributes(){const t=this.gl;t.bindVertexArray(this.instancedVertexArray),t.bindBuffer(t.ARRAY_BUFFER,this.quadVertexBuffer),t.enableVertexAttribArray(this.instancedAttributeLocations.quadVertex),t.vertexAttribPointer(this.instancedAttributeLocations.quadVertex,2,t.FLOAT,!1,0,0),t.bindBuffer(t.ARRAY_BUFFER,this.instancedSplatBuffer);const e=14,i=4,a=e*i;t.enableVertexAttribArray(this.instancedAttributeLocations.position),t.vertexAttribPointer(this.instancedAttributeLocations.position,3,t.FLOAT,!1,a,0),t.vertexAttribDivisor(this.instancedAttributeLocations.position,1),t.enableVertexAttribArray(this.instancedAttributeLocations.color),t.vertexAttribPointer(this.instancedAttributeLocations.color,4,t.FLOAT,!1,a,3*i),t.vertexAttribDivisor(this.instancedAttributeLocations.color,1),t.enableVertexAttribArray(this.instancedAttributeLocations.scale),t.vertexAttribPointer(this.instancedAttributeLocations.scale,3,t.FLOAT,!1,a,7*i),t.vertexAttribDivisor(this.instancedAttributeLocations.scale,1),t.enableVertexAttribArray(this.instancedAttributeLocations.rotation),t.vertexAttribPointer(this.instancedAttributeLocations.rotation,4,t.FLOAT,!1,a,10*i),t.vertexAttribDivisor(this.instancedAttributeLocations.rotation,1)}render(t,e,i){if(!this.isInitialized||this.splatCount===0)return;const a=performance.now(),s=this.gl;this.currentViewMatrix=t,this.currentProjectionMatrix=e,this.currentScreenSize=i,s.viewport(0,0,i[0],i[1]);const o=this.options.backgroundColor;s.clearColor(o[0],o[1],o[2],o[3]),s.clear(s.COLOR_BUFFER_BIT|s.DEPTH_BUFFER_BIT),this.options.debug&&this.validateRenderState(),this.renderWithMixedStrategy(),s.getError(),this.renderStats.frameTime=performance.now()-a,this.renderStats.splatCount=this.splatCount}renderWithMixedStrategy(){const t=this.gl,e=Math.min(this.splatCount,this.options.maxIndexedSplatCount),i=Math.max(0,this.splatCount-e);if(this.renderStats.drawCalls=0,e>0){t.useProgram(this.shaderProgram),t.uniformMatrix4fv(this.uniformLocations.viewMatrix,!1,this.currentViewMatrix),t.uniformMatrix4fv(this.uniformLocations.projectionMatrix,!1,this.currentProjectionMatrix),t.uniform2fv(this.uniformLocations.screenSize,this.currentScreenSize),t.uniform1f(this.uniformLocations.boundsRadius,3),t.uniform1i(this.uniformLocations.enableFrustumCulling,this.options.enableFrustumCulling?1:0),this.setupVertexAttributes();const a=e*6;t.drawElements(t.TRIANGLES,a,t.UNSIGNED_INT,0),this.renderStats.drawCalls++}i>0&&(t.useProgram(this.instancedShaderProgram),t.uniformMatrix4fv(this.instancedUniformLocations.viewMatrix,!1,this.currentViewMatrix),t.uniformMatrix4fv(this.instancedUniformLocations.projectionMatrix,!1,this.currentProjectionMatrix),t.uniform2fv(this.instancedUniformLocations.screenSize,this.currentScreenSize),t.uniform1i(this.instancedUniformLocations.enableFrustumCulling,this.options.enableFrustumCulling?1:0),this.setupInstancedVertexAttributes(),t.drawArraysInstanced(t.TRIANGLE_STRIP,0,4,i),this.renderStats.drawCalls++)}updateCamera(t,e=[0,0,-1]){this.cameraWorldPosition=[...t],this.cameraWorldForward=[...e]}async sortSplats(t){if(this.usingFlat&&this.flatData)return{indexAndDepth:this.sortFlatData(),sortTime:0,splatCount:this.splatCount};const e=this.originalSplats.length>0?this.originalSplats:t,i=await this.splatSorter.sortSplats(e,this.cameraWorldPosition,this.cameraWorldForward);return i&&i.indexAndDepth&&this.applySortResult(e,i.indexAndDepth),i}applySortResult(t,e){const i=this.gl;this.lastSortedIndexes=e;const a=e.map(h=>t[h.index]),s=Math.min(a.length,this.options.maxIndexedSplatCount),o=a.slice(0,s),r=a.slice(s),l=this.packSplatData(o),n=r.length>0?this.packInstancedSplatData(r):new Float32Array(0);i.bindBuffer(i.ARRAY_BUFFER,this.splatBuffer),i.bufferData(i.ARRAY_BUFFER,l,i.DYNAMIC_DRAW),i.bindBuffer(i.ARRAY_BUFFER,this.splatBufferPrime),i.bufferData(i.ARRAY_BUFFER,l,i.DYNAMIC_DRAW),i.bindBuffer(i.ARRAY_BUFFER,this.instancedSplatBuffer),i.bufferData(i.ARRAY_BUFFER,n,i.DYNAMIC_DRAW)}dispose(){if(!this.gl)return;const t=this.gl;this.splatBuffer&&t.deleteBuffer(this.splatBuffer),this.splatBufferPrime&&t.deleteBuffer(this.splatBufferPrime),this.indexBuffer&&t.deleteBuffer(this.indexBuffer),this.vertexArray&&t.deleteVertexArray(this.vertexArray),this.instancedSplatBuffer&&t.deleteBuffer(this.instancedSplatBuffer),this.quadVertexBuffer&&t.deleteBuffer(this.quadVertexBuffer),this.instancedVertexArray&&t.deleteVertexArray(this.instancedVertexArray),this.shaderProgram&&t.deleteProgram(this.shaderProgram),this.instancedShaderProgram&&t.deleteProgram(this.instancedShaderProgram),this.splatSorter&&this.splatSorter.dispose(),this.isInitialized=!1}calculateSplatBounds(t){if(t.length===0)return null;let e=1/0,i=-1/0,a=1/0,s=-1/0,o=1/0,r=-1/0;for(const u of t){const f=u.position;e=Math.min(e,f[0]),i=Math.max(i,f[0]),a=Math.min(a,f[1]),s=Math.max(s,f[1]),o=Math.min(o,f[2]),r=Math.max(r,f[2])}const l=[(e+i)/2,(a+s)/2,(o+r)/2],n=[i-e,s-a,r-o],h=Math.max(...n);let m=1/0,d=-1/0,p=[];for(let u=0;u<Math.min(t.length,10);u++){const f=t[u];m=Math.min(m,f.color[3]),d=Math.max(d,f.color[3]),p.push([...f.color])}return{min:[e,a,o],max:[i,s,r],center:l,size:n,maxDimension:h,alphaRange:[m,d],sampleColors:p}}validateSplatDataSilent(t){if(t.length===0)return;const e=t[0];e.covA&&e.covB&&(e.covA[0],e.covA[1],e.covA[2],e.covA[1],e.covB[0],e.covB[1],e.covA[2],e.covB[1],e.covB[2]);for(let i=0;i<Math.min(t.length,3);i++)this.validateSingleSplat(t[i],i)}validateSingleSplat(t,e){return!(!t.position||t.position.length<3||t.position.some(i=>!isFinite(i))||!t.color||t.color.length<4||t.color.some(i=>i<0||i>1||!isFinite(i)))}debugRenderState(t,e,i,a){}validateRenderState(){const t=this.gl;this.splatCount,t.isBuffer(this.splatBuffer),t.isBuffer(this.instancedSplatBuffer),t.isProgram(this.shaderProgram),t.isProgram(this.instancedShaderProgram),t.isEnabled(t.DEPTH_TEST),t.isEnabled(t.BLEND);const e=t.getParameter(t.BLEND_SRC_ALPHA),i=t.getParameter(t.BLEND_DST_ALPHA);e!==t.SRC_ALPHA||t.ONE_MINUS_SRC_ALPHA,!this.cameraWorldPosition||this.cameraWorldPosition.length,!this.currentViewMatrix||this.currentViewMatrix.length,!this.currentProjectionMatrix||this.currentProjectionMatrix.length}getRenderStats(){return{...this.renderStats}}}class j{constructor(t={}){this.options={debug:!1,enableCaching:!0,batchSize:1e3,...t},this.wasmModule=null,this.flameManager=null,this.isInitialized=!1,this.splatCollection=new M,this.lastFrameData=null,this.lastSplatCount=0,this.computeStats={totalFrames:0,avgComputeTime:0,lastComputeTime:0,wasmCallCount:0}}async initialize(t,e){try{return this.wasmModule=await t,this.flameManager=new e({logLevel:this.options.debug?"verbose":"basic",enableValidation:this.options.debug,enablePerformanceMetrics:!0}),await this.flameManager.initialize(this.wasmModule),this.isInitialized=!0,!0}catch(i){throw i}}async loadFlameModel(t){if(!this.isInitialized)throw new Error("WASM adapter not initialized");try{return await this.flameManager.loadFlameModel(t),!0}catch(e){throw e}}async load3DGSData(t){if(!this.isInitialized)throw new Error("WASM adapter not initialized");try{this.original3DGSData=t;const{originalPoints:e,binding:i,flameFaces:a}=this.convertGaussianDataToFlameFormat(t);await this.flameManager.set3DGSData(e,i,a);const s=t.positions?.length/3||0;return this.lastSplatCount=s,!0}catch(e){throw e}}convertGaussianDataToFlameFormat(t){const e=t.positions?.length/3||0;if(e===0)throw new Error("No valid Gaussian data provided");const i=[];for(let o=0;o<e;o++){const r={position:[t.positions[o*3],t.positions[o*3+1],t.positions[o*3+2]],rotation:[t.rotations[o*4],t.rotations[o*4+1],t.rotations[o*4+2],t.rotations[o*4+3]],color:[t.colors[o*3],t.colors[o*3+1],t.colors[o*3+2]],scale:[t.scales[o*3],t.scales[o*3+1],t.scales[o*3+2]],opacity:t.opacities[o]};i.push(r)}const a=new Array(e).fill(0).map((o,r)=>r),s=new Int32Array([0,1,2]);return{originalPoints:i,binding:a,flameFaces:s}}async computeFrame(t){if(!this.isInitialized)throw new Error("WASM adapter not initialized");const e=performance.now();try{if(this.options.enableCaching&&this.lastFrameData&&this.areParamsEqual(t,this.lastFrameData))return this.computeStats.lastComputeTime=performance.now()-e,this.splatCollection;let i;try{i=await this.flameManager.computeFrameFlat(t)}catch(o){if(o.message.includes("detached ArrayBuffer"))i=await this.flameManager.computeFrame(t);else throw o}if(this.computeStats.wasmCallCount++,!i.success||!i.data||!i.data.points)throw new Error("Invalid WASM computation result");const a=this.convertWASMResultToSplats(i.data);this.splatCollection.clear(),this.splatCollection.addBatch(a),this.lastFrameData={...t},this.lastSplatCount=a.length;const s=performance.now()-e;return this.updateComputeStats(s),this.splatCollection}catch(i){throw i}}convertOriginalPLYToSplats(t){const e=[];try{const i=t.positions?.length/3||0;if(i===0)throw new Error("No points data in original PLY data");for(let a=0;a<i;a++){const s=new A;s.position[0]=t.positions[a*3],s.position[1]=t.positions[a*3+1],s.position[2]=t.positions[a*3+2],t.colors?(s.color[0]=t.colors[a*3],s.color[1]=t.colors[a*3+1],s.color[2]=t.colors[a*3+2],s.color[3]=1):s.color[0]=s.color[1]=s.color[2]=s.color[3]=1,t.opacities&&(s.color[3]=Math.max(0,Math.min(1,t.opacities[a])));const o=t.rotations?[t.rotations[a*4],t.rotations[a*4+1],t.rotations[a*4+2],t.rotations[a*4+3]]:[1,0,0,0],r=t.scales?[t.scales[a*3],t.scales[a*3+1],t.scales[a*3+2]]:[.1,.1,.1],l={rotation:o,scale:r};this.computeCovarianceFromRotationScale(l,s),e.push(s)}}catch(i){throw i}return e}convertWASMResultToSplats(t){const e=[];try{if(!t.points||t.points.length===0)throw new Error("No points data in WASM result");const i=t.points.length;for(let a=0;a<i;a++){const s=t.points[a],o=new A;if(s.position&&Array.isArray(s.position)&&s.position.length>=3)o.position[0]=s.position[0],o.position[1]=s.position[1],o.position[2]=s.position[2];else throw new Error(`Invalid position data at point ${a}`);s.color&&Array.isArray(s.color)&&s.color.length>=3?(o.color[0]=s.color[0],o.color[1]=s.color[1],o.color[2]=s.color[2],o.color[3]=1):(o.color[0]=1,o.color[1]=1,o.color[2]=1,o.color[3]=1),typeof s.opacity=="number"&&(o.color[3]=Math.max(0,Math.min(1,s.opacity))),this.computeCovarianceFromRotationScale(s,o),e.push(o)}}catch(i){throw i}return e}computeCovarianceFromRotationScale(t,e){let i=[1,0,0,0],a=[.1,.1,.1];t.rotation&&Array.isArray(t.rotation)&&t.rotation.length>=4&&(i=t.rotation.slice()),t.scale&&Array.isArray(t.scale)&&t.scale.length>=3&&(a=t.scale.slice());const s=i[0],o=i[1],r=i[2],l=i[3],n=Math.sqrt(s*s+o*o+r*r+l*l);n>1e-6&&(i[0]=s/n,i[1]=o/n,i[2]=r/n,i[3]=l/n);const h=i[0],m=i[1],d=i[2],p=i[3],u=[[1-2*(d*d+p*p),2*(m*d-h*p),2*(m*p+h*d)],[2*(m*d+h*p),1-2*(m*m+p*p),2*(d*p-h*m)],[2*(m*p-h*d),2*(d*p+h*m),1-2*(m*m+d*d)]],f=Math.max(1e-6,a[0]),v=Math.max(1e-6,a[1]),g=Math.max(1e-6,a[2]),y=f*f,S=v*v,w=g*g,F=u[0][0]*u[0][0]*y+u[0][1]*u[0][1]*S+u[0][2]*u[0][2]*w,E=u[0][0]*u[1][0]*y+u[0][1]*u[1][1]*S+u[0][2]*u[1][2]*w,T=u[0][0]*u[2][0]*y+u[0][1]*u[2][1]*S+u[0][2]*u[2][2]*w,I=u[1][0]*u[1][0]*y+u[1][1]*u[1][1]*S+u[1][2]*u[1][2]*w,_=u[1][0]*u[2][0]*y+u[1][1]*u[2][1]*S+u[1][2]*u[2][2]*w,k=u[2][0]*u[2][0]*y+u[2][1]*u[2][1]*S+u[2][2]*u[2][2]*w;e.covA[0]=F,e.covA[1]=E,e.covA[2]=T,e.covB[0]=I,e.covB[1]=_,e.covB[2]=k}async computeFrameBatched(t,e=null){const i=e||this.options.batchSize;if(this.lastSplatCount<=i)return this.computeFrame(t);const a=Math.ceil(this.lastSplatCount/i),s=[];for(let o=0;o<a;o++){const r=o*i,l=Math.min(r+i,this.lastSplatCount),n={...t,batchStart:r,batchEnd:l},h=await this.computeFrame(n);s.push(...h.splats)}return this.splatCollection.clear(),this.splatCollection.addBatch(s),this.splatCollection}getCurrentSplats(){return this.splatCollection}areParamsEqual(t,e){if(!t||!e)return!1;const i=Object.keys(t),a=Object.keys(e);if(i.length!==a.length)return!1;for(const s of i)if(t[s]!==e[s])return!1;return!0}updateComputeStats(t){this.computeStats.totalFrames++,this.computeStats.lastComputeTime=t;const e=.1;this.computeStats.avgComputeTime=this.computeStats.avgComputeTime*(1-e)+t*e}getComputeStats(){return{...this.computeStats}}getWASMMemoryStats(){return!this.wasmModule||!this.wasmModule.HEAP8?null:{totalMemory:this.wasmModule.HEAP8.length,usedMemory:this.wasmModule.HEAP8.buffer.byteLength,heapSize:this.wasmModule.HEAPU8?this.wasmModule.HEAPU8.length:0}}dispose(){this.flameManager&&typeof this.flameManager.dispose=="function"&&this.flameManager.dispose(),this.splatCollection.clear(),this.lastFrameData=null,this.isInitialized=!1}clearCache(){this.lastFrameData=null,this.splatCollection.clear()}setDebugMode(t){this.options.debug=t,this.flameManager&&typeof this.flameManager.setDebugMode=="function"&&this.flameManager.setDebugMode(t)}}async function P(c={}){const t=new j(c);try{const[e,{FlameComplete3DGSManager:i}]=await Promise.all([C(()=>import("./flame_compute_frame_wasm-CeFRUB2k.js"),__vite__mapDeps([0,1])).then(a=>a.default()),C(()=>import("./flameComplete3DGSAdapter-BtVJ4aPR.js"),[])]);return await t.initialize(e,i),t}catch(e){throw e}}const b={createPerspectiveMatrix(c,t,e,i){const a=1/Math.tan(c*Math.PI/180/2),s=1/(e-i);return new Float32Array([a/t,0,0,0,0,a,0,0,0,0,(e+i)*s,-1,0,0,e*i*s*2,0])},createLookAtMatrix(c,t,e){const i=[c[0]-t[0],c[1]-t[1],c[2]-t[2]],a=Math.sqrt(i[0]*i[0]+i[1]*i[1]+i[2]*i[2]);i[0]/=a,i[1]/=a,i[2]/=a;const s=[e[1]*i[2]-e[2]*i[1],e[2]*i[0]-e[0]*i[2],e[0]*i[1]-e[1]*i[0]],o=Math.sqrt(s[0]*s[0]+s[1]*s[1]+s[2]*s[2]);s[0]/=o,s[1]/=o,s[2]/=o;const r=[i[1]*s[2]-i[2]*s[1],i[2]*s[0]-i[0]*s[2],i[0]*s[1]-i[1]*s[0]];return new Float32Array([s[0],r[0],i[0],0,s[1],r[1],i[1],0,s[2],r[2],i[2],0,-(s[0]*c[0]+s[1]*c[1]+s[2]*c[2]),-(r[0]*c[0]+r[1]*c[1]+r[2]*c[2]),-(i[0]*c[0]+i[1]*c[1]+i[2]*c[2]),1])}};class O{constructor(t={}){this.options={canvas:null,debug:!1,backgroundColor:[1,1,1,1],enableWASM:!0,enableAutoSort:!0,enablePerformanceMonitoring:!0,targetFPS:60,...t},this.canvas=this.options.canvas,this.renderer=null,this.wasmAdapter=null,this.isInitialized=!1,this.camera={position:[-.02,-.013,1.5],target:[0,0,0],up:[0,1,0],fov:22,aspect:1,near:.01,far:100},this.isRendering=!1,this.animationFrameId=null,this.lastFrameTime=0,this.currentSplats=null,this.needsRender=!0,this.performanceMonitor={enabled:this.options.enablePerformanceMonitoring,frameCount:0,startTime:performance.now(),lastFpsUpdate:0,currentFPS:0,frameHistory:[],maxHistoryLength:120},this.onFrameRender=null,this.onPerformanceUpdate=null,this.onError=null}async initialize(){try{const t=this.options.canvas;if(!t)throw new Error("Canvas element is required");if(this.renderer=new N({canvas:t,debug:this.options.debug,backgroundColor:this.options.backgroundColor}),await this.renderer.initialize(),this.options.enableWASM)try{this.wasmAdapter=await P({debug:this.options.debug})}catch{this.wasmAdapter=null}return this.updateCameraAspect(),this.updateCamera(),this.isInitialized=!0,!0}catch(t){throw this.onError&&this.onError(t),t}}async initializeWASM(t,e){try{if(!this.isInitialized)throw new Error("System must be initialized first");if(!e)throw new Error("FLAME data is required");if(this.wasmAdapter||(this.wasmAdapter=await P({debug:this.options.debug})),await this.wasmAdapter.loadFlameModel(e.flameModel),await this.wasmAdapter.flameManager.set3DGSData(e.original3DGSPoints,e.binding,e.flameFaces),t&&window.WasmMemoryReader)try{const i=new window.WasmMemoryReader(t);this.wasmAdapter.flameManager.setWasmMemoryReader(i)}catch{}return!0}catch(i){throw this.onError&&this.onError(i),i}}async updateFrame(t){if(!this.isInitialized)throw new Error("System not initialized");if(this.wasmAdapter)try{const e=await this.wasmAdapter.computeFrame(t);this.currentSplats=e,this.currentSplats&&this.currentSplats.count>0&&(this.renderer.loadSplats(this.currentSplats.toArray()),this.needsRender=!0)}catch(e){this.onError&&this.onError(e)}}renderFrame(){if(!(!this.isInitialized||!this.renderer))try{this.updateCameraMatrices(),this.renderer.render(this.viewMatrix,this.projectionMatrix,[this.options.canvas.width,this.options.canvas.height]),this.needsRender=!1}catch(t){this.onError&&this.onError(t)}}updateCameraMatrices(){this.projectionMatrix=b.createPerspectiveMatrix(this.camera.fov,this.camera.aspect,this.camera.near,this.camera.far),this.viewMatrix=b.createLookAtMatrix(this.camera.position,this.camera.target,this.camera.up)}async loadFlameModel(t){if(!this.isInitialized)throw new Error("System not initialized");if(this.wasmAdapter)try{await this.wasmAdapter.loadFlameModel(t)}catch(e){throw e}}async loadGaussianData(t){if(!this.isInitialized)throw new Error("System not initialized");try{if(this.wasmAdapter)await this.wasmAdapter.load3DGSData(t),this.currentSplats=new M;else{const e=this.convertGaussianDataToSplats(t);this.currentSplats=new M,this.currentSplats.addBatch(e),this.renderer.loadSplats(this.currentSplats.toArray())}return this.needsRender=!0,!0}catch(e){throw e}}convertGaussianDataToSplats(t){const e=[],i=t.positions||[],a=t.colors||[],s=t.scales||[],o=t.rotations||[],r=t.opacities||[],l=i.length/3;for(let n=0;n<l;n++){const h=new A;if(h.position[0]=i[n*3]||0,h.position[1]=i[n*3+1]||0,h.position[2]=i[n*3+2]||0,a.length>0?(h.color[0]=a[n*3]||1,h.color[1]=a[n*3+1]||1,h.color[2]=a[n*3+2]||1,h.color[3]=r[n]||1):h.color.set([1,1,1,1]),s.length>0&&o.length>0){const m=[s[n*3]||1,s[n*3+1]||1,s[n*3+2]||1],d=[o[n*4]||0,o[n*4+1]||0,o[n*4+2]||0,o[n*4+3]||1],p=A.computeCovariance3D(m,d);h.covA[0]=p[0][0],h.covA[1]=p[0][1],h.covA[2]=p[0][2],h.covB[0]=p[1][1],h.covB[1]=p[1][2],h.covB[2]=p[2][2]}else h.covA.set([.1,0,0]),h.covB.set([.1,0,.1]);e.push(h)}return e}async updateFlameParams(t){if(!this.isInitialized)throw new Error("System not initialized");if(this.wasmAdapter)try{const e=await this.wasmAdapter.computeFrame(t);e&&e.count>0&&(this.currentSplats=e,this.options.enableAutoSort&&await this.sortSplats(),this.renderer.loadSplats(this.currentSplats.toArray()),this.needsRender=!0)}catch(e){this.onError&&this.onError(e)}}async sortSplats(){if(!(!this.currentSplats||this.currentSplats.count===0))try{this.renderer.updateCamera(this.camera.position,this.getCameraForward()),await this.renderer.sortSplats(this.currentSplats.splats)}catch{}}async updateCamera(t={}){Object.assign(this.camera,t),t.aspect===void 0&&this.updateCameraAspect(),this.options.enableAutoSort&&this.currentSplats&&this.currentSplats.count>0&&await this.sortSplats(),this.needsRender=!0}updateCameraAspect(){const t=this.options.canvas;t&&(this.camera.aspect=t.width/t.height)}getCameraForward(){const t=[this.camera.target[0]-this.camera.position[0],this.camera.target[1]-this.camera.position[1],this.camera.target[2]-this.camera.position[2]],e=Math.sqrt(t[0]*t[0]+t[1]*t[1]+t[2]*t[2]);return e>0&&(t[0]/=e,t[1]/=e,t[2]/=e),t}startRendering(){if(!this.isInitialized)throw new Error("System not initialized");this.isRendering||(this.isRendering=!0,this.performanceMonitor.startTime=performance.now(),this.performanceMonitor.frameCount=0,this.renderLoop())}stopRendering(){this.isRendering&&(this.isRendering=!1,this.animationFrameId&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null))}renderLoop(){if(!this.isRendering)return;const t=performance.now(),e=t-this.lastFrameTime,i=1e3/this.options.targetFPS;if(e<i&&!this.needsRender){this.animationFrameId=requestAnimationFrame(()=>this.renderLoop());return}this.lastFrameTime=t;try{this.renderFrame(),this.updatePerformanceMonitor(t,e),this.needsRender=!1}catch(a){this.onError&&this.onError(a)}this.animationFrameId=requestAnimationFrame(()=>this.renderLoop())}renderFrame(){if(!this.renderer||!this.currentSplats)return;const t=this.options.canvas,e=t.width,i=t.height,a=b.createPerspectiveMatrix(this.camera.fov,this.camera.aspect,this.camera.near,this.camera.far),s=b.createLookAtMatrix(this.camera.position,this.camera.target,this.camera.up);this.renderer.render(s,a,[e,i]),this.onFrameRender&&this.onFrameRender({frameTime:this.renderer.getRenderStats().frameTime,splatCount:this.currentSplats.count})}updatePerformanceMonitor(t,e){if(this.performanceMonitor.enabled&&(this.performanceMonitor.frameCount++,this.performanceMonitor.frameHistory.push(e),this.performanceMonitor.frameHistory.length>this.performanceMonitor.maxHistoryLength&&this.performanceMonitor.frameHistory.shift(),t-this.performanceMonitor.lastFpsUpdate>=1e3)){const i=t-this.performanceMonitor.startTime;this.performanceMonitor.currentFPS=Math.round(this.performanceMonitor.frameCount/i*1e3),this.performanceMonitor.lastFpsUpdate=t,this.onPerformanceUpdate&&this.onPerformanceUpdate(this.getPerformanceStats())}}getPerformanceStats(){const t=this.renderer?this.renderer.getRenderStats():{},e=this.wasmAdapter?this.wasmAdapter.getComputeStats():{},i=this.performanceMonitor.frameHistory,a=i.length>0?i.reduce((s,o)=>s+o,0)/i.length:0;return{fps:this.performanceMonitor.currentFPS,avgFrameTime:a,renderStats:t,wasmStats:e,splatCount:this.currentSplats?this.currentSplats.count:0}}getSystemStatus(){return{initialized:this.isInitialized,rendering:this.isRendering,wasmEnabled:!!this.wasmAdapter,splatCount:this.currentSplats?this.currentSplats.count:0,camera:{...this.camera}}}handleResize(){!this.isInitialized||!this.renderer||(this.updateCameraAspect(),typeof this.renderer.handleResize=="function"&&this.renderer.handleResize(),this.needsRender=!0)}dispose(){this.stopRendering(),this.renderer&&this.renderer.dispose(),this.wasmAdapter&&this.wasmAdapter.dispose(),this.currentSplats=null,this.isInitialized=!1}}class Y{constructor(t={}){this.options={sampleRate:44100,enableCrossfade:!0,bufferSize:4096,...t},this.audioContext=null,this.sourceNode=null,this.gainNode=null,this.analyserNode=null,this.audioBuffer=null,this.isLoaded=!1,this.isPlaying=!1,this.isPaused=!1,this.startTime=0,this.pauseTime=0,this.currentTime=0,this.duration=0,this.onPlay=null,this.onPause=null,this.onStop=null,this.onTimeUpdate=null,this.onEnded=null,this.timeUpdateInterval=null,this.isMobile=this.detectMobile(),this.isMobile||this.initializeAudioContext()}detectMobile(){const t=navigator.userAgent||navigator.vendor||window.opera;return/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(t.toLowerCase())||"ontouchstart"in window||window.innerWidth<=768}async initializeAudioContext(){try{if(this.audioContext)return;const t=window.AudioContext||window.webkitAudioContext;this.audioContext=new t({sampleRate:this.options.sampleRate}),this.gainNode=this.audioContext.createGain(),this.gainNode.connect(this.audioContext.destination),this.analyserNode=this.audioContext.createAnalyser(),this.analyserNode.fftSize=256,this.gainNode.connect(this.analyserNode),console.log("✅ AudioManager initialized successfully")}catch(t){throw console.error("❌ Failed to initialize AudioContext:",t),new Error("AudioContext initialization failed")}}async loadAudio(t){try{this.isMobile&&!this.audioContext&&await this.initializeAudioContext(),await this.resumeAudioContext();const e=await fetch(t);if(!e.ok)throw new Error(`HTTP error! status: ${e.status}`);const i=await e.arrayBuffer();return this.audioBuffer=await this.audioContext.decodeAudioData(i),this.duration=this.audioBuffer.duration,this.isLoaded=!0,!0}catch(e){throw console.error("❌ Failed to load audio:",e),this.isLoaded=!1,new Error(`Audio loading failed: ${e.message}`)}}async resumeAudioContext(){if(!this.audioContext)throw new Error("AudioContext not initialized");if(this.audioContext.state==="suspended")try{await this.audioContext.resume()}catch{throw this.isMobile?new Error("移动端需要用户手动点击才能启动音频播放。"):new Error("需要用户手动操作才能启动音频播放")}}async play(){if(!this.isLoaded)throw new Error("Audio not loaded");this.isMobile&&!this.audioContext&&(console.log("📱 Initializing AudioContext for mobile play..."),await this.initializeAudioContext()),await this.resumeAudioContext(),this.stop(),this.sourceNode=this.audioContext.createBufferSource(),this.sourceNode.buffer=this.audioBuffer,this.sourceNode.connect(this.gainNode),this.sourceNode.onended=()=>{this.isPlaying&&(this.stop(),this.onEnded&&this.onEnded())};const t=this.isPaused?this.pauseTime:0;try{this.isMobile&&this.audioContext.state==="suspended"&&await this.audioContext.resume(),this.sourceNode.start(0,t),this.startTime=this.audioContext.currentTime-t,this.isPlaying=!0,this.isPaused=!1,this.startTimeUpdate(),this.onPlay&&this.onPlay()}catch(e){throw this.isPlaying=!1,this.isMobile?new Error(`移动端音频播放失败: ${e.message}`):new Error(`音频播放失败: ${e.message}`)}}pause(){this.isPlaying&&(this.pauseTime=this.getCurrentTime(),this.sourceNode&&this.sourceNode.stop(),this.isPlaying=!1,this.isPaused=!0,this.stopTimeUpdate(),console.log("⏸️ Audio paused at",this.pauseTime.toFixed(2),"seconds"),this.onPause&&this.onPause())}stop(){if(this.sourceNode){try{this.sourceNode.stop()}catch{}this.sourceNode=null}this.isPlaying=!1,this.isPaused=!1,this.startTime=0,this.pauseTime=0,this.currentTime=0,this.stopTimeUpdate(),console.log("⏹️ Audio stopped"),this.onStop&&this.onStop()}getCurrentTime(){if(!this.isPlaying||!this.audioContext)return this.isPaused?this.pauseTime:0;const t=this.audioContext.currentTime-this.startTime;return Math.min(t,this.duration)}async seekTo(t){if(!this.isLoaded)return;const e=this.isPlaying;this.stop(),this.pauseTime=Math.max(0,Math.min(t,this.duration)),e?(this.isPaused=!0,await this.play()):this.isPaused=!0,console.log("⏭️ Seeked to",this.pauseTime.toFixed(2),"seconds")}setVolume(t){this.gainNode&&this.audioContext&&this.gainNode.gain.setValueAtTime(Math.max(0,Math.min(1,t)),this.audioContext.currentTime)}getVolume(){return this.gainNode&&this.audioContext?this.gainNode.gain.value:0}startTimeUpdate(){this.stopTimeUpdate(),this.timeUpdateInterval=setInterval(()=>{this.currentTime=this.getCurrentTime(),this.onTimeUpdate&&this.onTimeUpdate(this.currentTime)},50)}stopTimeUpdate(){this.timeUpdateInterval&&(clearInterval(this.timeUpdateInterval),this.timeUpdateInterval=null)}getAnalyserData(){if(!this.analyserNode||!this.audioContext)return null;const t=this.analyserNode.frequencyBinCount,e=new Uint8Array(t);return this.analyserNode.getByteFrequencyData(e),e}getState(){return{isLoaded:this.isLoaded,isPlaying:this.isPlaying,isPaused:this.isPaused,currentTime:this.getCurrentTime(),duration:this.duration,volume:this.getVolume()}}destroy(){this.stop(),this.stopTimeUpdate(),this.audioContext&&this.audioContext.close(),this.onPlay=null,this.onPause=null,this.onStop=null,this.onTimeUpdate=null,this.onEnded=null,console.log("🧹 AudioManager destroyed")}}class G{constructor(t={}){this.options={baseAssetsPath:"/assets",modelFolder:"3dgs4",enableCache:!0,enableValidation:!0,...t},this.cache=new Map,this.protoRoot=null,this.FlameType=null,this.FlameAnimationType=null,this.animationData=null,this.frameCount=0,this.isLoaded=!1}async initializeProtobufTypes(){if(!this.FlameAnimationType)try{this.protoRoot=new x.Root;const t=new x.Type("Flame").add(new x.Field("translation",1,"float","repeated",{packed:!0})).add(new x.Field("rotation",2,"float","repeated",{packed:!0})).add(new x.Field("neck_pose",3,"float","repeated",{packed:!0})).add(new x.Field("jaw_pose",4,"float","repeated",{packed:!0})).add(new x.Field("eye_pose",5,"float","repeated",{packed:!0})).add(new x.Field("eye_lid",6,"float","repeated",{packed:!0})).add(new x.Field("expression",7,"float","repeated",{packed:!0})),e=new x.Type("FlameAnimation").add(new x.Field("keyframes",1,"Flame","repeated"));this.protoRoot.add(t),this.protoRoot.add(e),this.protoRoot.resolveAll(),this.FlameType=this.protoRoot.lookupType("Flame"),this.FlameAnimationType=this.protoRoot.lookupType("FlameAnimation"),console.log("✅ Protobuf types initialized successfully"),console.log("   Flame fields:",Object.keys(this.FlameType.fields)),console.log("   FlameAnimation fields:",Object.keys(this.FlameAnimationType.fields))}catch(t){throw console.error("❌ Failed to initialize protobuf types:",t),new Error(`Protobuf initialization failed: ${t.message}`)}}async loadAnimationData(t="mono.pb"){try{await this.initializeProtobufTypes();const e=`${this.options.baseAssetsPath}/${this.options.modelFolder}/${t}`;if(console.log("📁 Loading animation data:",e),this.options.enableCache&&this.cache.has(e)){const l=this.cache.get(e);return this.animationData=l.animationData,this.frameCount=l.frameCount,this.isLoaded=!0,console.log("✅ Animation data loaded from cache:",this.frameCount,"frames"),this.animationData}const i=await fetch(e);if(!i.ok)throw new Error(`HTTP error! status: ${i.status}`);const a=await i.arrayBuffer(),s=new Uint8Array(a);console.log("📦 Binary data loaded:",s.length,"bytes");const o=this.FlameAnimationType.decode(s),r=this.FlameAnimationType.toObject(o,{longs:String,enums:String,bytes:String,defaults:!1,arrays:!0,objects:!1,oneofs:!1});return this.options.enableValidation&&this.validateAnimationData(r),this.animationData=this.processAnimationData(r),this.frameCount=this.animationData.length,this.isLoaded=!0,this.options.enableCache&&this.cache.set(e,{animationData:this.animationData,frameCount:this.frameCount}),console.log("✅ Animation data processed successfully"),console.log("   Total frames:",this.frameCount),console.log("   Frame rate: 25 fps (assumed)"),console.log("   Duration:",(this.frameCount/25).toFixed(2),"seconds"),this.animationData}catch(e){throw console.error("❌ Failed to load animation data:",e),this.isLoaded=!1,new Error(`Animation data loading failed: ${e.message}`)}}validateAnimationData(t){if(!t.keyframes||!Array.isArray(t.keyframes))throw new Error("Invalid animation data: missing or invalid keyframes");if(t.keyframes.length===0)throw new Error("Invalid animation data: no keyframes found");const e=t.keyframes[0],i=["translation","rotation","neck_pose","jaw_pose","eye_pose","expression"];for(const s of i)(!e[s]||!Array.isArray(e[s]))&&console.warn(`⚠️ Missing or invalid field: ${s} in frame data`);const a={translation:3,rotation:3,neck_pose:3,jaw_pose:3,eye_pose:6,expression:100};for(const[s,o]of Object.entries(a))e[s]&&e[s].length!==o&&console.warn(`⚠️ Unexpected array length for ${s}: expected ${o}, got ${e[s].length}`);console.log("✅ Animation data validation passed")}processAnimationData(t){const e=[];for(let i=0;i<t.keyframes.length;i++){const a=t.keyframes[i],s={translation:a.translation||[0,0,0],rotation:a.rotation||[0,0,0],neck_pose:a.neck_pose||[0,0,0],jaw_pose:a.jaw_pose||[0,0,0],eyes_pose:a.eye_pose||[0,0,0,0,0,0],expr:a.expression||new Array(100).fill(0),eyelid:a.eye_lid||[0,0],frameIndex:i,timestamp:i/25,shape:null,static_offset:null};e.push(s)}return e}getFrameData(t){if(!this.isLoaded||!this.animationData)return console.warn("⚠️ Animation data not loaded"),null;const e=Math.max(0,Math.min(t,this.frameCount-1));return e!==t&&console.warn(`⚠️ Frame index clamped: ${t} -> ${e}`),this.animationData[e]}getFrameDataByTime(t,e=25){const i=Math.floor(t*e);return this.getFrameData(i)}getDuration(t=25){return this.isLoaded?this.frameCount/t:0}getFrameCount(){return this.frameCount}isAnimationLoaded(){return this.isLoaded}getAnimationStats(){if(!this.isLoaded)return null;const t={frameCount:this.frameCount,duration:this.getDuration(),fps:25,avgExpressionMagnitude:0,avgJawMovement:0,avgNeckMovement:0};let e=0,i=0,a=0;for(const s of this.animationData){const o=Math.sqrt(s.expr.reduce((n,h)=>n+h*h,0));e+=o;const r=Math.sqrt(s.jaw_pose.reduce((n,h)=>n+h*h,0));i+=r;const l=Math.sqrt(s.neck_pose.reduce((n,h)=>n+h*h,0));a+=l}return t.avgExpressionMagnitude=e/this.frameCount,t.avgJawMovement=i/this.frameCount,t.avgNeckMovement=a/this.frameCount,t}clearCache(){this.cache.clear(),console.log("🧹 Animation data cache cleared")}destroy(){this.clearCache(),this.animationData=null,this.frameCount=0,this.isLoaded=!1,this.protoRoot=null,this.FlameType=null,this.FlameAnimationType=null,console.log("🧹 AnimationDataLoader destroyed")}}class ${constructor(t={}){this.options={enableAutoplay:!1,preload:"auto",crossOrigin:"anonymous",...t},this.audioElement=null,this.isLoaded=!1,this.isPlaying=!1,this.isPaused=!1,this.duration=0,this.onPlay=null,this.onPause=null,this.onStop=null,this.onTimeUpdate=null,this.onEnded=null,this.onError=null,this.isIOS=this.detectIOS(),this.isMobile=this.detectMobile()}detectIOS(){const t=navigator.userAgent.toLowerCase();return/iphone|ipad|ipod/.test(t)||navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1}detectMobile(){const t=navigator.userAgent.toLowerCase();return/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(t)||"ontouchstart"in window||window.innerWidth<=768}createAudioElement(){return this.audioElement?this.audioElement:(this.audioElement=document.createElement("audio"),this.audioElement.crossOrigin=this.options.crossOrigin,this.audioElement.preload=this.options.preload,this.isIOS&&(this.audioElement.controls=!1,this.audioElement.muted=!1,this.audioElement.playsInline=!0,this.audioElement.setAttribute("playsinline","true")),this.setupAudioEvents(),this.audioElement.style.display="none",document.body.appendChild(this.audioElement),this.audioElement)}setupAudioEvents(){this.audioElement&&(this.audioElement.addEventListener("loadeddata",()=>{this.duration=this.audioElement.duration,this.isLoaded=!0}),this.audioElement.addEventListener("play",()=>{this.isPlaying=!0,this.isPaused=!1,this.onPlay&&this.onPlay()}),this.audioElement.addEventListener("pause",()=>{this.isPlaying=!1,this.isPaused=!0,this.onPause&&this.onPause()}),this.audioElement.addEventListener("ended",()=>{this.isPlaying=!1,this.isPaused=!1,this.onEnded&&this.onEnded()}),this.audioElement.addEventListener("timeupdate",()=>{this.onTimeUpdate&&this.onTimeUpdate(this.audioElement.currentTime)}),this.audioElement.addEventListener("error",t=>{const e=this.audioElement.error;this.onError&&this.onError(new Error(`Audio error: ${e?.message||"Unknown error"}`))}))}async loadAudio(t){try{return this.createAudioElement(),new Promise((e,i)=>{const a=()=>{this.audioElement.removeEventListener("loadeddata",a),this.audioElement.removeEventListener("error",s),e(!0)},s=o=>{this.audioElement.removeEventListener("loadeddata",a),this.audioElement.removeEventListener("error",s),i(new Error(`Failed to load audio: ${this.audioElement.error?.message}`))};this.audioElement.addEventListener("loadeddata",a),this.audioElement.addEventListener("error",s),this.audioElement.src=t,this.audioElement.load()})}catch(e){throw console.error("📱 Failed to load mobile audio:",e),e}}async play(){if(!this.audioElement||!this.isLoaded)throw new Error("Audio not loaded");try{this.isIOS&&this.audioElement.currentTime>0&&(this.audioElement.currentTime=0);const t=this.audioElement.play();t!==void 0&&await t}catch(t){throw this.isIOS?new Error(`iOS 音频播放失败: ${t.message}`):new Error(`移动端音频播放失败: ${t.message}`)}}pause(){this.audioElement&&this.isPlaying&&this.audioElement.pause()}stop(){this.audioElement&&(this.audioElement.pause(),this.audioElement.currentTime=0,this.isPlaying=!1,this.isPaused=!1,this.onStop&&this.onStop())}seekTo(t){this.audioElement&&this.isLoaded&&(this.audioElement.currentTime=Math.max(0,Math.min(t,this.duration)))}setVolume(t){this.audioElement&&(this.audioElement.volume=Math.max(0,Math.min(1,t)))}getVolume(){return this.audioElement?this.audioElement.volume:0}getCurrentTime(){return this.audioElement?this.audioElement.currentTime:0}getState(){return{isLoaded:this.isLoaded,isPlaying:this.isPlaying,isPaused:this.isPaused,currentTime:this.getCurrentTime(),duration:this.duration,volume:this.getVolume(),isIOS:this.isIOS,isMobile:this.isMobile}}destroy(){this.stop(),this.audioElement&&(this.audioElement.parentNode&&this.audioElement.parentNode.removeChild(this.audioElement),this.audioElement=null),this.onPlay=null,this.onPause=null,this.onStop=null,this.onTimeUpdate=null,this.onEnded=null,this.onError=null}}class H{constructor(t={}){this.options={fps:25,audioFile:"mono.wav",animationFile:"mono.pb",enableSmoothing:!0,smoothingFactor:.1,enableTimeCorrection:!0,maxTimeDrift:.1,...t},this.detectMobile()?this.audioManager=new $({enableAutoplay:!1,preload:"auto"}):this.audioManager=new Y({sampleRate:44100,enableCrossfade:!0}),this.animationLoader=new G({baseAssetsPath:this.options.baseAssetsPath,modelFolder:this.options.modelFolder,enableCache:!0}),this.isInitialized=!1,this.isPlaying=!1,this.isPaused=!1,this.currentTime=0,this.duration=0,this.animationData=null,this.currentFrameIndex=-1,this.lastFrameIndex=-1,this.frameUpdateInterval=null,this.timeDriftCorrection=0,this.lastUpdateTime=0,this.onPlay=null,this.onPause=null,this.onStop=null,this.onTimeUpdate=null,this.onFrameUpdate=null,this.onEnded=null,this.onError=null,this.performanceStats={frameUpdates:0,droppedFrames:0,avgFrameTime:0,maxFrameTime:0,syncErrors:0},this.setupAudioCallbacks()}detectMobile(){const t=navigator.userAgent.toLowerCase();return/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(t)||"ontouchstart"in window||window.innerWidth<=768}setupAudioCallbacks(){this.audioManager.onPlay=()=>{this.isPlaying=!0,this.isPaused=!1,this.startFrameUpdates(),this.onPlay&&this.onPlay()},this.audioManager.onPause=()=>{this.isPlaying=!1,this.isPaused=!0,this.stopFrameUpdates(),this.onPause&&this.onPause()},this.audioManager.onStop=()=>{this.isPlaying=!1,this.isPaused=!1,this.currentFrameIndex=-1,this.stopFrameUpdates(),this.onStop&&this.onStop()},this.audioManager.onTimeUpdate=t=>{this.currentTime=t,this.onTimeUpdate&&this.onTimeUpdate(t)},this.audioManager.onEnded=()=>{this.isPlaying=!1,this.stopFrameUpdates(),this.onEnded&&this.onEnded()}}async initialize(){if(this.isInitialized)return!0;try{console.log("🎭 Initializing AudioAnimationPlayer..."),this.animationData=await this.animationLoader.loadAnimationData(this.options.animationFile);const t=this.animationLoader.getDuration(this.options.fps);return this.duration=t,console.log("📊 Animation data loaded:"),console.log("   Animation duration:",t.toFixed(2),"seconds"),console.log("   Frame count:",this.animationLoader.getFrameCount()),console.log("   Animation FPS:",this.options.fps),this.isInitialized=!0,console.log("✅ AudioAnimationPlayer initialized successfully (audio will load on first play)"),!0}catch(t){throw console.error("❌ Failed to initialize AudioAnimationPlayer:",t),this.isInitialized=!1,this.onError&&this.onError(t),t}}async play(){if(!this.isInitialized)throw new Error("Player not initialized");try{if(console.log("▶️ Starting audio animation playback"),!this.audioManager.isLoaded){console.log("🎵 Loading audio on first play...");const t=`${this.options.baseAssetsPath}/${this.options.modelFolder}/${this.options.audioFile}`;await this.audioManager.loadAudio(t);const e=this.audioManager.duration,i=this.animationLoader.getDuration(this.options.fps);console.log("📊 Duration comparison:"),console.log("   Audio duration:",e.toFixed(2),"seconds"),console.log("   Animation duration:",i.toFixed(2),"seconds"),Math.abs(e-i)>.5&&console.warn(`⚠️ Duration mismatch: audio=${e.toFixed(2)}s, animation=${i.toFixed(2)}s`),this.duration=Math.min(e,i),console.log("✅ Audio loaded successfully, duration:",this.duration.toFixed(2),"seconds")}this.resetPerformanceStats(),await this.audioManager.play()}catch(t){throw console.error("❌ Failed to start playback:",t),this.onError&&this.onError(t),t}}pause(){this.isPlaying&&(console.log("⏸️ Pausing audio animation playback"),this.audioManager.pause())}stop(){(this.isPlaying||this.isPaused)&&(console.log("⏹️ Stopping audio animation playback"),this.audioManager.stop(),this.currentTime=0)}async seekTo(t){if(!this.isInitialized)return;const e=Math.max(0,Math.min(t,this.duration));console.log("⏭️ Seeking to",e.toFixed(2),"seconds"),await this.audioManager.seekTo(e),this.currentTime=e,this.updateAnimationFrame(e)}setVolume(t){this.audioManager.setVolume(t)}getVolume(){return this.audioManager.getVolume()}startFrameUpdates(){this.stopFrameUpdates(),this.frameUpdateInterval=setInterval(()=>{this.updateFrame()},1e3/60),console.log("🔄 Frame updates started (60fps)")}stopFrameUpdates(){this.frameUpdateInterval&&(clearInterval(this.frameUpdateInterval),this.frameUpdateInterval=null,console.log("⏹️ Frame updates stopped"))}updateFrame(){const t=performance.now();try{const i=this.audioManager.getCurrentTime()+this.timeDriftCorrection;this.updateAnimationFrame(i);const a=performance.now()-t;this.updatePerformanceStats(a)}catch(e){console.error("❌ Frame update error:",e),this.performanceStats.syncErrors++,this.onError&&this.onError(e)}}updateAnimationFrame(t){const e=Math.floor(t*this.options.fps),i=Math.max(0,Math.min(e,this.animationLoader.getFrameCount()-1));if(i===this.currentFrameIndex)return;if(this.currentFrameIndex>=0&&i>this.currentFrameIndex+1){const s=i-this.currentFrameIndex-1;this.performanceStats.droppedFrames+=s,console.warn(`⚠️ Dropped ${s} frames (${this.currentFrameIndex} -> ${i})`)}this.lastFrameIndex=this.currentFrameIndex,this.currentFrameIndex=i;const a=this.animationLoader.getFrameData(this.currentFrameIndex);if(!a){console.warn("⚠️ Failed to get frame data for index:",this.currentFrameIndex);return}if(this.options.enableSmoothing&&this.lastFrameIndex>=0&&this.lastFrameIndex!==this.currentFrameIndex){const s=this.animationLoader.getFrameData(this.lastFrameIndex);if(s){const o=t*this.options.fps%1,r=this.interpolateFrameData(s,a,o);this.emitFrameUpdate(r,this.currentFrameIndex,t)}else this.emitFrameUpdate(a,this.currentFrameIndex,t)}else this.emitFrameUpdate(a,this.currentFrameIndex,t);this.performanceStats.frameUpdates++}interpolateFrameData(t,e,i){const a=this.options.smoothingFactor*i,s=1-a;return{...e,translation:[t.translation[0]*s+e.translation[0]*a,t.translation[1]*s+e.translation[1]*a,t.translation[2]*s+e.translation[2]*a],rotation:[t.rotation[0]*s+e.rotation[0]*a,t.rotation[1]*s+e.rotation[1]*a,t.rotation[2]*s+e.rotation[2]*a],expr:t.expr.map((r,l)=>r*s+(e.expr[l]||0)*a),jaw_pose:t.jaw_pose.map((r,l)=>r*s+(e.jaw_pose[l]||0)*a),neck_pose:t.neck_pose.map((r,l)=>r*s+(e.neck_pose[l]||0)*a)}}emitFrameUpdate(t,e,i){this.onFrameUpdate&&this.onFrameUpdate({frameData:t,frameIndex:e,currentTime:i,progress:i/this.duration})}updatePerformanceStats(t){this.performanceStats.avgFrameTime=this.performanceStats.avgFrameTime*.9+t*.1,t>this.performanceStats.maxFrameTime&&(this.performanceStats.maxFrameTime=t)}resetPerformanceStats(){this.performanceStats={frameUpdates:0,droppedFrames:0,avgFrameTime:0,maxFrameTime:0,syncErrors:0}}getState(){return{isInitialized:this.isInitialized,isPlaying:this.isPlaying,isPaused:this.isPaused,currentTime:this.currentTime,duration:this.duration,currentFrameIndex:this.currentFrameIndex,frameCount:this.animationLoader?.getFrameCount()||0,volume:this.audioManager?.getVolume()||0,performanceStats:{...this.performanceStats}}}getAnimationStats(){return this.animationLoader?.getAnimationStats()||null}destroy(){console.log("🧹 Destroying AudioAnimationPlayer..."),this.stop(),this.stopFrameUpdates(),this.audioManager&&this.audioManager.destroy(),this.animationLoader&&this.animationLoader.destroy(),this.onPlay=null,this.onPause=null,this.onStop=null,this.onTimeUpdate=null,this.onFrameUpdate=null,this.onEnded=null,this.onError=null,this.isInitialized=!1,console.log("✅ AudioAnimationPlayer destroyed")}}const X="/assets/avatar_core_wasm-BBh-nlZQ.wasm";class Z{constructor(t={}){this.options={enableFallback:!0,maxPendingRequests:2,forceFailback:!1,...t},this.worker=null,this.isReady=!1,this.isInitializing=!1,this.initializationError=null,this.requestId=0,this.pendingRequests=new Map,this.isComputing=!1,this.latestResult=null,this.resultTimestamp=0,this.fallbackManager=null,this.usingFallback=!1,this.stats={totalRequests:0,completedRequests:0,skippedRequests:0,averageComputeTime:0,lastComputeTime:0}}async initialize(t){if(this.isInitializing||this.isReady)return this.isReady;this.isInitializing=!0;try{await this.createWorker();const e={...t,baseUrl:window.location.origin,wasmUrl:new URL(X,window.location.origin).href},i=await this.sendMessage("init",e);if(i.success)return this.isReady=!0,console.log("✅ WorkerFLAMEManager initialized successfully"),!0;throw new Error(i.error||"Worker initialization failed")}catch(e){return console.error("❌ WorkerFLAMEManager initialization failed:",e),this.initializationError=e,this.options.enableFallback&&await this.initializeFallback(t),this.isReady}finally{this.isInitializing=!1}}async createWorker(){try{const t=await C(()=>import("./flameComputeWorker-LV9yu0Zx.js"),[]);this.worker=new t.default,this.worker.onmessage=e=>{this.handleWorkerMessage(e)},this.worker.onerror=e=>{console.error("❌ Worker error:",e),this.handleWorkerError(e)},this.worker.onmessageerror=e=>{console.error("❌ Worker message error:",e),this.handleWorkerError(e)}}catch(t){throw console.error("❌ Failed to create worker:",t),new Error(`Worker creation failed: ${t.message}`)}}async initializeFallback(t){try{console.log("🔄 Initializing fallback mode...");const{AvatarCoreAdapter:e}=await C(async()=>{const{AvatarCoreAdapter:i}=await import("./avatarCoreAdapter-Dytsxc4s.js");return{AvatarCoreAdapter:i}},__vite__mapDeps([2,1]));this.fallbackManager=new e(t),await this.fallbackManager.initialize(),await this.fallbackManager.loadCharacter(),this.usingFallback=!0,this.isReady=!0,console.log("✅ Fallback mode initialized")}catch(e){throw console.error("❌ Fallback initialization failed:",e),e}}handleWorkerMessage(t){const{type:e,id:i,data:a}=t.data;switch(e){case"init_result":case"compute_result":case"switch_result":case"pong":this.resolveRequest(i,a);break;case"error":this.rejectRequest(i,new Error(a.error||"Worker error"));break;default:console.warn("🤷 Unknown worker message type:",e)}}handleWorkerError(t){for(const[e,{reject:i}]of this.pendingRequests)i(new Error(`Worker error: ${t.message}`));this.pendingRequests.clear(),this.isReady=!1,this.isComputing=!1}sendMessage(t,e,i=1e4){return new Promise((a,s)=>{const o=++this.requestId;this.pendingRequests.set(o,{resolve:a,reject:s});const r=setTimeout(()=>{this.pendingRequests.has(o)&&(this.pendingRequests.delete(o),s(new Error(`Worker request timeout (${i}ms)`)))},i);try{this.worker.postMessage({type:t,id:o,data:e})}catch(l){this.pendingRequests.delete(o),clearTimeout(r),s(l)}this.pendingRequests.get(o).timeoutId=r})}resolveRequest(t,e){const i=this.pendingRequests.get(t);i&&(clearTimeout(i.timeoutId),this.pendingRequests.delete(t),i.resolve(e),e&&e.success&&e.data&&e.data.pointCount&&this.handleComputeResult(e))}rejectRequest(t,e){const i=this.pendingRequests.get(t);i&&(clearTimeout(i.timeoutId),this.pendingRequests.delete(t),i.reject(e))}handleComputeResult(t){this.isComputing=!1,this.latestResult={positions:new Float32Array(t.data.positions),scales:new Float32Array(t.data.scales),rotations:new Float32Array(t.data.rotations),colors:new Float32Array(t.data.colors),opacities:new Float32Array(t.data.opacities),pointCount:t.data.pointCount},this.resultTimestamp=performance.now(),this.stats.completedRequests++,this.stats.lastComputeTime=t.performance?.totalTime||0,this.updateAverageComputeTime()}async computeFrameAsync(t){if(!this.isReady)return console.warn("⚠️ FLAME manager not ready"),!1;if(this.isComputing||this.pendingRequests.size>=this.options.maxPendingRequests)return this.stats.skippedRequests++,!1;this.stats.totalRequests++,this.isComputing=!0;try{return this.usingFallback?await this.computeFrameFallback(t):(await this.sendMessage("compute",{params:t},5e3)).success}catch(e){return console.error("❌ Compute frame failed:",e),this.isComputing=!1,!1}}async computeFrameFallback(t){try{const e=await this.fallbackManager.computeCompleteFrame(t);if(e&&e.points){const i=this.convertToFlat(e);return this.latestResult=i,this.resultTimestamp=performance.now(),this.isComputing=!1,!0}return!1}catch(e){return console.error("❌ Fallback compute failed:",e),this.isComputing=!1,!1}}convertToFlat(t){const e=t.pointCount,i=new Float32Array(e*3),a=new Float32Array(e*3),s=new Float32Array(e*4),o=new Float32Array(e*3),r=new Float32Array(e);for(let l=0;l<e;l++){const n=t.points[l],h=l*3,m=l*4;i[h]=n.position[0],i[h+1]=n.position[1],i[h+2]=n.position[2],a[h]=n.scale[0],a[h+1]=n.scale[1],a[h+2]=n.scale[2],s[m]=n.rotation[3],s[m+1]=n.rotation[0],s[m+2]=n.rotation[1],s[m+3]=n.rotation[2],o[h]=n.color[0],o[h+1]=n.color[1],o[h+2]=n.color[2],r[l]=n.opacity}return{positions:i,scales:a,rotations:s,colors:o,opacities:r,pointCount:e}}async switchAnimationFile(t){if(!this.isReady)throw new Error("FLAME manager not ready");try{return this.usingFallback?(await this.fallbackManager.switchAnimationFile(t),!0):(await this.sendMessage("switch_animation",{filename:t})).success}catch(e){throw console.error("❌ Switch animation failed:",e),e}}getLatestResult(){const t=this.latestResult;return this.latestResult=null,t}hasNewResult(t=0){return this.latestResult&&this.resultTimestamp>t}updateAverageComputeTime(){this.stats.completedRequests===1?this.stats.averageComputeTime=this.stats.lastComputeTime:this.stats.completedRequests>1&&(this.stats.averageComputeTime=.1*this.stats.lastComputeTime+(1-.1)*this.stats.averageComputeTime)}getStats(){return{...this.stats,isReady:this.isReady,isComputing:this.isComputing,usingFallback:this.usingFallback,pendingRequests:this.pendingRequests.size}}async healthCheck(){if(!this.isReady||this.usingFallback)return{healthy:this.isReady};try{const t=await this.sendMessage("ping",{},1e3);return{healthy:t.ready,computing:t.computing}}catch(t){return{healthy:!1,error:t.message}}}dispose(){for(const[t,{reject:e}]of this.pendingRequests)e(new Error("Manager disposed"));this.pendingRequests.clear(),this.worker&&(this.worker.terminate(),this.worker=null),this.fallbackManager&&typeof this.fallbackManager.dispose=="function"&&this.fallbackManager.dispose(),this.isReady=!1,this.isComputing=!1,this.latestResult=null,console.log("🧹 WorkerFLAMEManager disposed")}}window.addEventListener("error",function(c){console.error("❌ [GLOBAL ERROR] 全局未处理错误:",c.error),console.error("❌ [GLOBAL ERROR] 错误堆栈:",c.error?.stack),console.error("❌ [GLOBAL ERROR] 文件:",c.filename),console.error("❌ [GLOBAL ERROR] 行号:",c.lineno),console.error("❌ [GLOBAL ERROR] 列号:",c.colno),console.error("❌ [GLOBAL ERROR] 完整事件:",c)});window.addEventListener("unhandledrejection",function(c){console.error("❌ [PROMISE ERROR] 未处理的Promise rejection:",c.reason),console.error("❌ [PROMISE ERROR] Promise:",c.promise),console.error("❌ [PROMISE ERROR] 完整事件:",c)});window.SparkPlyLoader=D;function Q(){return document.createElement("canvas").getContext("webgl2")?{supported:!0,message:"WebGL2 is supported"}:{supported:!1,message:"WebGL2 not supported by this browser"}}window.WasmMemoryReader=class{constructor(t){this.wasmModule=t,this.refreshHeapViews()}refreshHeapViews(){this.HEAPF32=this.wasmModule.HEAPF32,this.HEAP32=this.wasmModule.HEAP32}readFloatArray(t,e){try{const i=t>>2;return this.HEAPF32.subarray(i,i+e)}catch(i){if(i.message.includes("detached ArrayBuffer")){this.refreshHeapViews();const a=t>>2;return this.HEAPF32.subarray(a,a+e)}throw i}}readIntArray(t,e){try{const i=t>>2;return this.HEAP32.subarray(i,i+e)}catch(i){if(i.message.includes("detached ArrayBuffer")){this.refreshHeapViews();const a=t>>2;return this.HEAP32.subarray(a,a+e)}throw i}}convertSharedResult(t){const e=t.pointCount;this.refreshHeapViews();const i=this.readFloatArray(t.positionsPtr,e*3),a=this.readFloatArray(t.scalesPtr,e*3),s=this.readFloatArray(t.rotationsPtr,e*4),o=this.readFloatArray(t.colorsPtr,e*3),r=this.readFloatArray(t.opacitiesPtr,e),l=this.readIntArray(t.bindingsPtr,e);return{success:!0,data:{positions:i,scales:a,rotations:s,colors:o,opacities:r,bindings:l,pointCount:e},metadata:{totalTime:t.totalTimeMs,pointCount:e}}}};class J{constructor(){this.system=null,this.flameManager=null,this.workerFlameManager=null,this.dataLoader=null,this.wasmModule=null,this.allData=null,this.shapeParameters=null,this.isInitialized=!1,this.useWorkerMode=!0,this.lastResultTimestamp=0,this.animationSettings={isAnimating:!1,animationTime:0,frameCount:0,animationFrameId:null},this.audioAnimationPlayer=null,this.currentPerformanceData=null,this.fpsCounter={fps:0,frameTime:0,lastTime:0,frameCount:0,timeAccumulator:0},this.initializeUI()}async initialize(){const t=document.getElementById("webgl-canvas"),e=document.getElementById("loading-overlay"),i=document.getElementById("loading-text");if(!t)throw new Error("Canvas element not found!");window.demo=this;try{e.style.display="flex";const a=Q();if(!a.supported)throw new Error(a.message);await new Promise(p=>setTimeout(p,100)),this.resizeCanvas();const s=document.getElementById("webgl-canvas"),o=s.getBoundingClientRect();(s.width===0||s.height===0)&&(s.width=800,s.height=600),this.workerFlameManager=new Z({enableFallback:!0,maxPendingRequests:2});const r={logLevel:"basic",enableValidation:!1,enablePerformanceMetrics:!0,wasmPath:"/src/wasm/avatar_core_wasm.js",baseAssetsPath:"/assets",modelFolder:"3dgs4"};i.textContent="初始化Worker计算系统...",await this.workerFlameManager.initialize(r)?(console.log("✅ Worker模式初始化成功"),this.useWorkerMode=!0,this.workerFlameManager.getStats().usingFallback&&(console.log("⚠️ Worker创建失败，自动切换到主线程fallback模式"),this.useWorkerMode=!1)):(console.log("⚠️ Worker模式初始化失败，使用降级模式"),this.useWorkerMode=!1),this.shapeParameters=new Array(400).fill(0),this.flameManager=this.workerFlameManager,i.textContent="创建WebGL 3DGS系统...",this.system=new O({canvas:t,debug:!0,backgroundColor:[1,1,1,1],enableWASM:!1,enableAutoSort:!0,enablePerformanceMonitoring:!0,targetFPS:60}),i.textContent="初始化渲染器...",await this.system.initialize(),this.system.onError=p=>{this.showError(p.message)},i.textContent="执行首次渲染...";const n=this.createAnimationParams(0);if(!await this.workerFlameManager.computeFrameAsync(n))throw new Error("首次Worker计算失败");let m=0;for(;!this.workerFlameManager.latestResult&&m<50;)await new Promise(p=>setTimeout(p,100)),m++;const d=this.workerFlameManager.getLatestResult();if(!d||!d.pointCount)throw new Error("首次渲染数据无效");await this.updateWebGLSystemFromFlat(d,!0),this.system.startRendering(),this.system.needsRender=!0,this.system.renderFrame(),this.system.currentSplats&&this.system.currentSplats.count>0&&this.adjustCameraToSplats(),await this.initializeAudioAnimationPlayer(),e.style.display="none",this.isInitialized=!0,this.animationSettings.isAnimating=!0,this.animationLoop()}catch(a){console.error("❌ 初始化失败:",a),this.showError("初始化失败: "+a.message),e.style.display="none"}}async updateWebGLSystemFromFlat(t,e=!1){if(!t||!t.pointCount)throw console.error("❌ Invalid flat result:",t),new Error("Invalid flat computation result");this.system.currentSplats={count:t.pointCount},this.system.renderer&&(e?(this.system.renderer.loadSplatsFromFlat(t),this.system.options.enableAutoSort&&await this.system.sortSplats()):this.system.renderer.loadSplatsFromFlat(t),this.system.needsRender=!0),this.currentPerformanceData={totalTime:0,pointCount:t.pointCount,fps:this.fpsCounter.fps||0,frameTime:this.fpsCounter.frameTime||0,frameNumber:this.animationSettings.frameCount}}initializeUI(){this.bindUIEvents(),window.addEventListener("resize",()=>{this.isInitialized&&this.resizeCanvas()})}bindUIEvents(){document.getElementById("generate-data-btn").addEventListener("click",()=>{this.startAnimation()}),this.bindMobileEvents()}bindMobileEvents(){const t=document.getElementById("generate-data-btn-mobile");t&&t.addEventListener("click",()=>{this.startAnimation()})}createAnimationParams(t){const i=Math.floor(t*30);if(this.allData?.idleAnimation?.length){const a=this.allData.idleAnimation.length;return{frameIndex:i%a,expression:[],pose:[0,0,0],neck:[0,0,0],jaw:[0,0,0],eyes:[0,0,0,0,0,0],translation:[0,0,0]}}else return{frameIndex:i,expression:[],pose:[0,0,0],neck:[0,0,0],jaw:[0,0,0],eyes:[0,0,0,0,0,0],translation:[0,0,0]}}hslToRgb(t,e,i){let a,s,o;if(e===0)a=s=o=i;else{const r=(h,m,d)=>(d<0&&(d+=1),d>1&&(d-=1),d<.16666666666666666?h+(m-h)*6*d:d<.5?m:d<.6666666666666666?h+(m-h)*(.6666666666666666-d)*6:h),l=i<.5?i*(1+e):i+e-i*e,n=2*i-l;a=r(n,l,t+1/3),s=r(n,l,t),o=r(n,l,t-1/3)}return[a,s,o]}async startAnimation(){if(this.isInitialized)try{await this.startAudioAnimation()}catch(t){this.showError("启动动画失败: "+t.message),this.updateButtonText()}}updateButtonText(){const t=document.getElementById("generate-data-btn"),e=document.getElementById("generate-data-btn-mobile");this.audioAnimationPlayer&&this.audioAnimationPlayer.isPlaying?(t&&(t.textContent="独白播放中...",t.disabled=!0),e&&(e.disabled=!0,e.style.opacity="0.5",e.title="独白播放中...")):(t&&(t.textContent="播放独白",t.disabled=!1),e&&(e.disabled=!1,e.style.opacity="1",e.title="播放独白"))}async animationLoop(){if(this.animationSettings.isAnimating){if(this.audioAnimationPlayer&&this.audioAnimationPlayer.isPlaying){this.animationSettings.isAnimating&&(this.animationSettings.animationFrameId=requestAnimationFrame(()=>this.animationLoop()));return}try{const t=performance.now();if(this.workerFlameManager?.getStats()?.usingFallback||!1){await this.renderWithFallbackMode();const s=performance.now()-t;this.updateFPSWithRealTime(s)}else await this.renderWithWorker(),this.updateFPSFromAnimationLoop();this.currentPerformanceData&&(this.currentPerformanceData.fps=this.fpsCounter.fps,this.updatePerformanceStats(this.currentPerformanceData)),this.animationSettings.animationTime+=1/30,this.animationSettings.frameCount++,this.animationSettings.isAnimating&&(this.animationSettings.animationFrameId=requestAnimationFrame(()=>this.animationLoop()))}catch(t){console.error("❌ 动画执行错误:",t),this.animationSettings.isAnimating=!1,this.showError("动画执行错误: "+t.message)}}}async renderWithFallbackMode(){const t=this.createAnimationParams(this.animationSettings.animationTime);if(await this.workerFlameManager.computeFrameAsync(t)&&this.workerFlameManager.hasNewResult(this.lastResultTimestamp)){const i=this.workerFlameManager.getLatestResult();i&&(await this.updateWebGLSystemFromFlat(i,!1),this.system.renderFrame(),this.lastResultTimestamp=performance.now())}else this.system.renderFrame()}async renderWithWorker(){const t=this.createAnimationParams(this.animationSettings.animationTime);if(this.workerFlameManager.computeFrameAsync(t),this.workerFlameManager.hasNewResult(this.lastResultTimestamp)){const e=this.workerFlameManager.getLatestResult();if(e){await this.updateWebGLSystemFromFlat(e,!1),this.system.renderFrame(),this.lastResultTimestamp=performance.now();const i=this.workerFlameManager.getStats();this.currentPerformanceData&&(this.currentPerformanceData.workerComputeTime=i.lastComputeTime,this.currentPerformanceData.workerAverageTime=i.averageComputeTime)}}else this.system.renderFrame()}async initializeAudioAnimationPlayer(){try{console.log("🎭 Initializing audio animation player..."),this.audioAnimationPlayer=new H({baseAssetsPath:"/assets",modelFolder:"3dgs4",audioFile:"mono.wav",animationFile:"mono.pb",fps:25}),this.audioAnimationPlayer.onFrameUpdate=t=>{this.handleAudioAnimationFrame(t)},this.audioAnimationPlayer.onPlay=()=>{console.log("🎵 Audio animation started"),this.updateButtonText()},this.audioAnimationPlayer.onStop=()=>{console.log("⏹️ Audio animation stopped"),this.updateButtonText()},this.audioAnimationPlayer.onEnded=async()=>{console.log("🎵 Audio animation ended, switching to breathing animation");try{await this.workerFlameManager.switchAnimationFile("idle.pb"),this.animationSettings.isAnimating=!0,this.animationLoop(),this.updateButtonText()}catch(t){console.error("❌ Failed to switch back to idle animation:",t)}},this.audioAnimationPlayer.onError=t=>{console.error("❌ Audio animation error:",t),this.showError("音频动画错误: "+t.message)},await this.audioAnimationPlayer.initialize(),console.log("✅ Audio animation player initialized"),this.updateButtonText()}catch(t){console.error("❌ Failed to initialize audio animation player:",t),this.audioAnimationPlayer=null}}async handleAudioAnimationFrame(t){const{frameData:e,frameIndex:i,currentTime:a,progress:s}=t;try{const o=performance.now(),r={frameIndex:i};this.workerFlameManager.computeFrameAsync(r);let l=0;for(;!this.workerFlameManager.hasNewResult(this.lastResultTimestamp)&&l<10;)await new Promise(n=>setTimeout(n,5)),l++;if(this.workerFlameManager.hasNewResult(this.lastResultTimestamp)){const n=this.workerFlameManager.getLatestResult();if(n){await this.updateWebGLSystemFromFlat(n,!1),this.system.renderFrame(),this.lastResultTimestamp=performance.now(),this.updateFPSFromAnimationLoop();const m=performance.now()-o,d=this.workerFlameManager.getStats();this.currentPerformanceData={totalTime:d.lastComputeTime||0,pointCount:n.pointCount||0,fps:this.fpsCounter.fps||0,frameTime:m,frameNumber:i},this.updatePerformanceStats(this.currentPerformanceData)}}}catch(o){console.error("❌ Audio animation frame processing error:",o)}}createAnimationParamsFromFrameData(t){const e={frameIndex:t.frameIndex||0,expr_params:t.expr&&Array.isArray(t.expr)?t.expr:[],rotation:t.rotation&&Array.isArray(t.rotation)?t.rotation:[0,0,0],neck_pose:t.neck_pose&&Array.isArray(t.neck_pose)?t.neck_pose:[0,0,0],jaw_pose:t.jaw_pose&&Array.isArray(t.jaw_pose)?t.jaw_pose:[0,0,0],eyes_pose:t.eyes_pose&&Array.isArray(t.eyes_pose)?t.eyes_pose:[0,0,0,0,0,0],translation:t.translation&&Array.isArray(t.translation)?t.translation:[0,0,0],eyelid:t.eyelid&&Array.isArray(t.eyelid)?t.eyelid:[0,0]};if(e.frameIndex<10||e.frameIndex%50===0){const i=e.expr_params.reduce((s,o)=>s+Math.abs(o),0),a=e.jaw_pose.reduce((s,o)=>s+Math.abs(o),0);if(console.log(`🔍 FRAME ${e.frameIndex} ANALYSIS:`),console.log(`   - frameData.expr exists: ${!!t.expr}`),console.log(`   - frameData.expr type: ${typeof t.expr}`),console.log(`   - frameData.expr isArray: ${Array.isArray(t.expr)}`),console.log(`   - frameData.expr length: ${t.expr?t.expr.length:"N/A"}`),console.log(`   - expr_params sum: ${i.toFixed(4)}`),console.log(`   - jaw_pose sum: ${a.toFixed(4)}`),t.expr&&t.expr.length>0){const s=t.expr.filter(o=>Math.abs(o)>.001).length;console.log(`   - non-zero expression params: ${s}/${t.expr.length}`),s>0&&console.log(`   - first few non-zero expr values: ${t.expr.filter(o=>Math.abs(o)>.001).slice(0,5).map(o=>o.toFixed(4)).join(", ")}`)}console.log(`🎯 Frame ${e.frameIndex}:
                        - expr_params: ${e.expr_params.length} params, sum=${i.toFixed(3)}
                        - jaw_pose: [${e.jaw_pose.map(s=>s.toFixed(3)).join(",")}], sum=${a.toFixed(3)}
                        - neck_pose: [${e.neck_pose.map(s=>s.toFixed(3)).join(",")}]
                        - translation: [${e.translation.map(s=>s.toFixed(3)).join(",")}]`)}return e}async startAudioAnimation(){if(!this.audioAnimationPlayer){this.showError("音频动画播放器未初始化");return}try{this.animationSettings.isAnimating=!1,this.animationSettings.animationFrameId&&(cancelAnimationFrame(this.animationSettings.animationFrameId),this.animationSettings.animationFrameId=null),await this.workerFlameManager.switchAnimationFile("mono.pb"),await this.audioAnimationPlayer.play(),console.log("🎵 Audio animation playback started")}catch(t){console.error("❌ Failed to start audio animation:",t),this.showError("音频动画播放失败: "+t.message)}}adjustCameraToSplats(){!this.system||!this.system.currentSplats||this.system.updateCamera({position:[-.02,-.013,1.5],target:[0,0,0],fov:22})}addTestSplats(){const{SplatData:t}=window;if(!t)return;const e=[];for(let i=0;i<5;i++){const a=new t;a.position=[i*.2-.4,0,-.5],a.color=[1,0,0,1],a.covA=[.1,0,0],a.covB=[.1,0,.1],e.push(a)}this.system.currentSplats.addBatch(e),this.system.renderer.loadSplats(this.system.currentSplats.toArray()),this.system.needsRender=!0}resizeCanvas(){const t=document.getElementById("webgl-canvas"),e=t.getBoundingClientRect();t.width=e.width*window.devicePixelRatio,t.height=e.height*window.devicePixelRatio,this.system&&this.system.renderer&&(this.system.renderer.gl.viewport(0,0,t.width,t.height),this.system.updateCameraAspect(),typeof this.system.handleResize=="function"&&this.system.handleResize(),this.system.needsRender=!0)}updateFPSFromAnimationLoop(){const t=performance.now();if(this.fpsCounter.lastTime===0){this.fpsCounter.lastTime=t;return}const e=t-this.fpsCounter.lastTime;this.fpsCounter.lastTime=t,this.fpsCounter.frameCount++,this.fpsCounter.timeAccumulator+=e,this.fpsCounter.timeAccumulator>=500&&(this.fpsCounter.fps=this.fpsCounter.frameCount*1e3/this.fpsCounter.timeAccumulator,this.fpsCounter.frameTime=this.fpsCounter.timeAccumulator/this.fpsCounter.frameCount,this.fpsCounter.frameCount=0,this.fpsCounter.timeAccumulator=0)}updateFPSWithRealTime(t){this.fpsCounter.frameTime=t,this.fpsCounter.frameCount++,this.fpsCounter.timeAccumulator+=t,this.fpsCounter.timeAccumulator>=500&&(this.fpsCounter.fps=this.fpsCounter.frameCount*1e3/this.fpsCounter.timeAccumulator,this.fpsCounter.frameCount=0,this.fpsCounter.timeAccumulator=0)}updatePerformanceStats(t){const e=(i,a)=>{const s=document.getElementById(i);s&&(s.textContent=a)};if(e("fps-display",t.fps!==void 0?`FPS: ${t.fps.toFixed(1)}`:"FPS: --"),e("flame-compute-time",t.totalTime?`FLAME: ${t.totalTime.toFixed(2)} ms`:"FLAME: -- ms"),t.pointCount&&e("render-info",`点云: ${t.pointCount} | 状态: 正在渲染`),this.system&&this.system.camera){const i=this.system.camera;e("camera-info",`相机: FOV ${i.fov}° | 距离 ${i.position[2].toFixed(2)}`)}}showError(t){const e=document.getElementById("error-display");e.textContent=t,e.style.display="block",setTimeout(()=>{e.style.display="none"},5e3)}dispose(){this.animationSettings.isAnimating=!1,this.animationSettings.animationFrameId&&cancelAnimationFrame(this.animationSettings.animationFrameId),this.workerFlameManager&&(this.workerFlameManager.dispose(),this.workerFlameManager=null),this.system&&(this.system.dispose(),this.system=null),this.audioAnimationPlayer&&(typeof this.audioAnimationPlayer.dispose=="function"&&this.audioAnimationPlayer.dispose(),this.audioAnimationPlayer=null),this.flameManager=null,this.allData=null,console.log("🧹 Demo resources cleaned up (Worker mode)")}}const R=new J;window.addEventListener("load",()=>{R.initialize()});window.addEventListener("beforeunload",()=>{R.dispose()});window.webglDemo=R;
