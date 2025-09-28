const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/flame_compute_frame_wasm-CeFRUB2k.js","assets/preload-helper-DD1OZmLC.js"])))=>i.map(i=>d[i]);
import{_ as E}from"./preload-helper-DD1OZmLC.js";import{AvatarCoreAdapter as B}from"./avatarCoreAdapter-BV86A3Te.js";import{a as w,S as L}from"./binaryPlyLoader-Cx5R50qP.js";import"./babylonjs-BIcxYk3o.js";import"./protobuf-B46OxRQv.js";const z=`#version 300 es
precision highp float;

// 输入属性（每个splat实例）
layout(location = 0) in vec3 a_position;    // splat中心位置
layout(location = 1) in vec4 a_color;       // RGBA颜色
layout(location = 2) in vec3 a_covA;        // 协方差矩阵上三角 [xx, xy, xz]
layout(location = 3) in vec3 a_covB;        // 协方差矩阵下三角 [yy, yz, zz]

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
 * 计算2D协方差矩阵（复刻Metal的calcCovariance2D函数）
 */
vec3 calcCovariance2D(vec3 viewPos, vec3 cov3Da, vec3 cov3Db, mat4 viewMatrix, mat4 projectionMatrix, vec2 screenSize) {
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

    // 3D协方差矩阵 Vrk
    mat3 Vrk = mat3(
        cov3Da.x, cov3Da.y, cov3Da.z,
        cov3Da.y, cov3Db.x, cov3Db.y,
        cov3Da.z, cov3Db.y, cov3Db.z
    );

    // 2D协方差矩阵 = T * Vrk * T^T
    mat3 cov = T * Vrk * transpose(T);

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

    // 计算2D协方差矩阵
    vec3 cov2D = calcCovariance2D(viewPosition3, a_covA, a_covB, u_viewMatrix, u_projectionMatrix, u_screenSize);

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
`,U=`#version 300 es
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
`;function k(h){const t=h.createShader(h.VERTEX_SHADER);if(h.shaderSource(t,z),h.compileShader(t),!h.getShaderParameter(t,h.COMPILE_STATUS))throw new Error("顶点着色器编译失败: "+h.getShaderInfoLog(t));const e=h.createShader(h.FRAGMENT_SHADER);if(h.shaderSource(e,U),h.compileShader(e),!h.getShaderParameter(e,h.COMPILE_STATUS))throw new Error("片段着色器编译失败: "+h.getShaderInfoLog(e));const i=h.createProgram();if(h.attachShader(i,t),h.attachShader(i,e),h.linkProgram(i),!h.getProgramParameter(i,h.LINK_STATUS))throw new Error("着色器程序链接失败: "+h.getProgramInfoLog(i));return h.deleteShader(t),h.deleteShader(e),i}const V=`#version 300 es
precision highp float;

// 基础四边形顶点属性（共享4个顶点）
layout(location = 0) in vec2 a_quadVertex;      // (-1,-1), (-1,1), (1,-1), (1,1)

// 实例化属性（每个splat实例）
layout(location = 1) in vec3 a_position;        // splat中心位置
layout(location = 2) in vec4 a_color;           // RGBA颜色
layout(location = 3) in vec3 a_covA;            // 协方差矩阵上三角
layout(location = 4) in vec3 a_covB;            // 协方差矩阵下三角

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
 * 计算2D协方差矩阵（复刻Metal版本）
 */
vec3 calcCovariance2D(vec3 viewPos, vec3 cov3Da, vec3 cov3Db, mat4 viewMatrix, mat4 projectionMatrix, vec2 screenSize) {
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

    // 3D协方差矩阵 Vrk
    mat3 Vrk = mat3(
        cov3Da.x, cov3Da.y, cov3Da.z,
        cov3Da.y, cov3Db.x, cov3Db.y,
        cov3Da.z, cov3Db.y, cov3Db.z
    );

    // 2D协方差矩阵
    mat3 cov = T * Vrk * transpose(T);

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

    // 计算2D协方差矩阵
    vec3 cov2D = calcCovariance2D(viewPosition3, a_covA, a_covB, u_viewMatrix, u_projectionMatrix, u_screenSize);

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
`,W=`#version 300 es
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
`;function N(h){const t=h.createShader(h.VERTEX_SHADER);if(h.shaderSource(t,V),h.compileShader(t),!h.getShaderParameter(t,h.COMPILE_STATUS))throw new Error("实例化顶点着色器编译失败: "+h.getShaderInfoLog(t));const e=h.createShader(h.FRAGMENT_SHADER);if(h.shaderSource(e,W),h.compileShader(e),!h.getShaderParameter(e,h.COMPILE_STATUS))throw new Error("实例化片段着色器编译失败: "+h.getShaderInfoLog(e));const i=h.createProgram();if(h.attachShader(i,t),h.attachShader(i,e),h.linkProgram(i),!h.getProgramParameter(i,h.LINK_STATUS))throw new Error("实例化着色器程序链接失败: "+h.getProgramInfoLog(i));return h.deleteShader(t),h.deleteShader(e),i}class j{constructor(t={}){this.options={batchSize:1e4,sortThreshold:.01,maxWorkers:4,sortStrategy:"distance",debug:!1,...t},this.workerSafeMaxCount=5e4,this.workers=[],this.availableWorkers=[],this.workerQueue=[],this.lastCameraPosition=[0,0,0],this.lastCameraForward=[0,0,-1],this.needsSort=!0,this.sorting=!1,this.sortProgress=0,this.sortStats={totalSorts:0,avgSortTime:0,lastSortTime:0,skippedSorts:0},this.onSortComplete=null,this.onSortProgress=null}async initialize(){await this.createWorkerPool()}async createWorkerPool(){const t=this.createWorkerCode(),e=new Blob([t],{type:"application/javascript"}),i=URL.createObjectURL(e);try{for(let s=0;s<this.options.maxWorkers;s++){const o=new Worker(i);o.onmessage=this.handleWorkerMessage.bind(this),o.onerror=this.handleWorkerError.bind(this),this.workers.push(o),this.availableWorkers.push(o)}}catch{}URL.revokeObjectURL(i)}createWorkerCode(){return`
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
        `}handleWorkerMessage(t){const{type:e,sortId:i,result:s,progress:o,error:a}=t.data,r=t.target;switch(e){case"complete":this.handleSortComplete(r,i,s);break;case"progress":this.handleSortProgress(i,o);break;case"error":this.handleSortError(r,i,a);break}}handleWorkerError(t){const e=t.target;this.availableWorkers.includes(e)||this.availableWorkers.push(e),this.processWorkerQueue()}async sortSplats(t,e,i=[0,0,-1]){if(!this.shouldSort(e,i))return this.sortStats.skippedSorts++,null;if(this.sorting)return null;const s=performance.now();this.sorting=!0,this.sortProgress=0;try{let o;Array.isArray(t)&&t.length>this.workerSafeMaxCount?o=this.sortOnMainThread(t,e,i):this.availableWorkers.length>0?o=await this.sortWithWorker(t,e,i):o=this.sortOnMainThread(t,e,i);const a=performance.now()-s;return this.updateSortStats(a),this.lastCameraPosition=[...e],this.lastCameraForward=[...i],this.needsSort=!1,this.onSortComplete&&this.onSortComplete(o),o}finally{this.sorting=!1}}serializeSplatsOptimized(t){const e=t.length,i=new Float32Array(e*3),s=new Float32Array(e*4),o=new Float32Array(e*3),a=new Float32Array(e*3);for(let r=0;r<e;r++){const n=t[r],d=r*3,l=r*4;i[d]=n.position[0],i[d+1]=n.position[1],i[d+2]=n.position[2],s[l]=n.color[0],s[l+1]=n.color[1],s[l+2]=n.color[2],s[l+3]=n.color[3],o[d]=n.covA[0],o[d+1]=n.covA[1],o[d+2]=n.covA[2],a[d]=n.covB[0],a[d+1]=n.covB[1],a[d+2]=n.covB[2]}return{count:e,positions:i.buffer,colors:s.buffer,covAs:o.buffer,covBs:a.buffer}}sortWithWorker(t,e,i){return new Promise((s,o)=>{const a=this.availableWorkers.pop(),r=Date.now()+Math.random(),n=setTimeout(()=>{o(new Error("Sort timeout"))},3e4);a._currentResolve=s,a._currentReject=o,a._currentTimeout=n,a._currentSortId=r;const d=this.serializeSplatsOptimized(t);a.postMessage({type:"sort",sortId:r,splatData:d,cameraPosition:e,cameraForward:i,sortStrategy:this.options.sortStrategy,batchSize:this.options.batchSize},[d.positions,d.colors,d.covAs,d.covBs])})}handleSortComplete(t,e,i){t._currentSortId===e&&(clearTimeout(t._currentTimeout),t._currentResolve(i),delete t._currentResolve,delete t._currentReject,delete t._currentTimeout,delete t._currentSortId),this.availableWorkers.push(t),this.processWorkerQueue()}handleSortProgress(t,e){this.sortProgress=e,this.onSortProgress&&this.onSortProgress(e)}handleSortError(t,e,i){t._currentSortId===e&&(clearTimeout(t._currentTimeout),t._currentReject(new Error(i)),delete t._currentResolve,delete t._currentReject,delete t._currentTimeout,delete t._currentSortId),this.availableWorkers.push(t),this.processWorkerQueue()}processWorkerQueue(){this.workerQueue.length>0&&this.availableWorkers.length>0&&this.workerQueue.shift()()}sortOnMainThread(t,e,i){const s=performance.now(),o=[];for(let r=0;r<t.length;r++){const n=t[r];let d;if(this.options.sortStrategy==="distance")d=n.getDistanceToCamera(e);else{const l=n.position;d=(l[0]-e[0])*i[0]+(l[1]-e[1])*i[1]+(l[2]-e[2])*i[2]}o.push({index:r,depth:d})}o.sort((r,n)=>n.depth-r.depth);const a=performance.now()-s;return{indexAndDepth:o,sortTime:a,splatCount:t.length}}shouldSort(t,e){if(this.needsSort)return!0;const i=Math.sqrt(Math.pow(t[0]-this.lastCameraPosition[0],2)+Math.pow(t[1]-this.lastCameraPosition[1],2)+Math.pow(t[2]-this.lastCameraPosition[2],2)),s=e[0]*this.lastCameraForward[0]+e[1]*this.lastCameraForward[1]+e[2]*this.lastCameraForward[2],o=1-Math.abs(s);return i>this.options.sortThreshold||o>this.options.sortThreshold}markNeedsSort(){this.needsSort=!0}updateSortStats(t){this.sortStats.totalSorts++,this.sortStats.lastSortTime=t;const e=.1;this.sortStats.avgSortTime=this.sortStats.avgSortTime*(1-e)+t*e}getSortStats(){return{...this.sortStats}}onComplete(t){this.onSortComplete=t}onProgress(t){this.onSortProgress=t}dispose(){for(const t of this.workers)t.terminate();this.workers=[],this.availableWorkers=[],this.workerQueue=[]}}class A{constructor(){this.position=new Float32Array(3),this.color=new Float32Array(4),this.covA=new Float32Array(3),this.covB=new Float32Array(3)}static fromPLY(t){const e=new A;e.position[0]=t.x||0,e.position[1]=t.y||0,e.position[2]=t.z||0,e.color[0]=(t.red||0)/255,e.color[1]=(t.green||0)/255,e.color[2]=(t.blue||0)/255,e.color[3]=t.opacity||1;const i=[t.scale_0||1,t.scale_1||1,t.scale_2||1],s=[t.rot_0||0,t.rot_1||0,t.rot_2||0,t.rot_3||1],o=A.computeCovariance3D(i,s);return e.covA[0]=o[0][0],e.covA[1]=o[0][1],e.covA[2]=o[0][2],e.covB[0]=o[1][1],e.covB[1]=o[1][2],e.covB[2]=o[2][2],e}static computeCovariance3D(t,e){const i=e[3],s=e[0],o=e[1],a=e[2],r=Math.sqrt(i*i+s*s+o*o+a*a),n=i/r,d=s/r,l=o/r,u=a/r,c=[[1-2*(l*l+u*u),2*(d*l-u*n),2*(d*u+l*n)],[2*(d*l+u*n),1-2*(d*d+u*u),2*(l*u-d*n)],[2*(d*u-l*n),2*(l*u+d*n),1-2*(d*d+l*l)]],p=[[t[0],0,0],[0,t[1],0],[0,0,t[2]]],m=A.multiplyMatrices(c,p),f=A.multiplyMatrices(m,A.transpose(p));return A.multiplyMatrices(f,A.transpose(c))}static multiplyMatrices(t,e){const i=[[0,0,0],[0,0,0],[0,0,0]];for(let s=0;s<3;s++)for(let o=0;o<3;o++)i[s][o]=t[s][0]*e[0][o]+t[s][1]*e[1][o]+t[s][2]*e[2][o];return i}static transpose(t){return[[t[0][0],t[1][0],t[2][0]],[t[0][1],t[1][1],t[2][1]],[t[0][2],t[1][2],t[2][2]]]}static fromWASM(t){const e=new A;return e.position.set(t.position),e.color.set(t.color),e.covA.set(t.covA),e.covB.set(t.covB),e}toObject(){return{position:Array.from(this.position),color:Array.from(this.color),covA:Array.from(this.covA),covB:Array.from(this.covB)}}static fromObject(t){const e=new A;return e.position.set(t.position),e.color.set(t.color),e.covA.set(t.covA),e.covB.set(t.covB),e}clone(){const t=new A;return t.position.set(this.position),t.color.set(this.color),t.covA.set(this.covA),t.covB.set(this.covB),t}getDepthInCameraSpace(t){const e=this.position;return t[2]*e[0]+t[6]*e[1]+t[10]*e[2]+t[14]}getDistanceToCamera(t){const e=this.position[0]-t[0],i=this.position[1]-t[1],s=this.position[2]-t[2];return Math.sqrt(e*e+i*i+s*s)}isInFrustum(t,e=1.2){const i=this.position,s=t[0]*i[0]+t[4]*i[1]+t[8]*i[2]+t[12],o=t[1]*i[0]+t[5]*i[1]+t[9]*i[2]+t[13],a=t[2]*i[0]+t[6]*i[1]+t[10]*i[2]+t[14],r=t[3]*i[0]+t[7]*i[1]+t[11]*i[2]+t[15],n=e*r;return a>=0&&a<=r&&s>=-n&&s<=n&&o>=-n&&o<=n}}class M{constructor(){this.splats=[],this.isDirty=!0}add(t){this.splats.push(t),this.isDirty=!0}addBatch(t){this.splats.push(...t),this.isDirty=!0}clear(){this.splats=[],this.isDirty=!0}get count(){return this.splats.length}sortByDistance(t){this.splats.sort((e,i)=>{const s=e.getDistanceToCamera(t);return i.getDistanceToCamera(t)-s}),this.isDirty=!0}sortByDepth(t){this.splats.sort((e,i)=>{const s=e.getDepthInCameraSpace(t);return i.getDepthInCameraSpace(t)-s}),this.isDirty=!0}cullByFrustum(t){return this.splats.filter(e=>e.isInFrustum(t))}getBoundingBox(){if(this.splats.length===0)return{min:[0,0,0],max:[0,0,0]};const t=[1/0,1/0,1/0],e=[-1/0,-1/0,-1/0];for(const i of this.splats){const s=i.position;t[0]=Math.min(t[0],s[0]),t[1]=Math.min(t[1],s[1]),t[2]=Math.min(t[2],s[2]),e[0]=Math.max(e[0],s[0]),e[1]=Math.max(e[1],s[1]),e[2]=Math.max(e[2],s[2])}return{min:t,max:e}}toArray(){return this.splats.map(t=>t.toObject())}fromArray(t){this.splats=t.map(e=>A.fromObject(e)),this.isDirty=!0}markClean(){this.isDirty=!1}get dirty(){return this.isDirty}}class O{constructor(t={}){this.options={canvas:null,debug:!1,backgroundColor:[1,1,1,1],enableDepthTest:!0,maxIndexedSplatCount:1024,enableFrustumCulling:!0,...t},this.gl=null,this.shaderProgram=null,this.instancedShaderProgram=null,this.uniformLocations={},this.attributeLocations={},this.instancedUniformLocations={},this.instancedAttributeLocations={},this.splatBuffer=null,this.splatBufferPrime=null,this.indexBuffer=null,this.vertexArray=null,this.instancedSplatBuffer=null,this.quadVertexBuffer=null,this.instancedVertexArray=null,this.splatCount=0,this.isInitialized=!1,this.needsSort=!0,this.sorting=!1,this.hasLoggedValidation=!1,this.originalSplats=[],this.cameraWorldPosition=[0,0,0],this.cameraWorldForward=[0,0,-1],this.splatSorter=new j({debug:this.options.debug,sortThreshold:.01,maxWorkers:2}),this.renderStats={drawCalls:0,splatCount:0,frameTime:0},this.usingFlat=!1,this.flatData=null,this.lastOrderArray=null}async initialize(){try{const t=this.options.canvas;if(!t)throw new Error("Canvas element is required");if(this.gl=t.getContext("webgl2",{antialias:!1,alpha:!1,premultipliedAlpha:!0,powerPreference:"high-performance",preserveDrawingBuffer:!1}),!this.gl)throw new Error("WebGL2 not supported");const e=this.gl;return this.checkRequiredExtensions(),this.shaderProgram=k(e),this.instancedShaderProgram=N(e),this.setupShaderLocations(),this.setupWebGLState(),this.createBuffers(),await this.splatSorter.initialize(),this.isInitialized=!0,!0}catch(t){throw t}}checkRequiredExtensions(){const t=this.gl;t.getExtension("EXT_color_buffer_float"),t.getExtension("EXT_sRGB")?this.sRGBSupported=!0:this.sRGBSupported=!1}setupShaderLocations(){const t=this.gl,e=this.shaderProgram;this.uniformLocations={viewMatrix:t.getUniformLocation(e,"u_viewMatrix"),projectionMatrix:t.getUniformLocation(e,"u_projectionMatrix"),screenSize:t.getUniformLocation(e,"u_screenSize"),boundsRadius:t.getUniformLocation(e,"u_boundsRadius"),enableFrustumCulling:t.getUniformLocation(e,"u_enableFrustumCulling")},this.attributeLocations={position:0,color:1,covA:2,covB:3,vertexId:4};const i=this.instancedShaderProgram;this.instancedUniformLocations={viewMatrix:t.getUniformLocation(i,"u_viewMatrix"),projectionMatrix:t.getUniformLocation(i,"u_projectionMatrix"),screenSize:t.getUniformLocation(i,"u_screenSize"),enableFrustumCulling:t.getUniformLocation(i,"u_enableFrustumCulling")},this.instancedAttributeLocations={quadVertex:0,position:1,color:2,covA:3,covB:4}}setupWebGLState(){const t=this.gl;t.disable(t.DEPTH_TEST),t.depthMask(!0),t.enable(t.BLEND),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA);const e=this.options.backgroundColor;t.clearColor(e[0],e[1],e[2],e[3])}createBuffers(){const t=this.gl;this.vertexArray=t.createVertexArray(),this.splatBuffer=t.createBuffer(),this.splatBufferPrime=t.createBuffer(),this.createIndexBuffer(),this.instancedVertexArray=t.createVertexArray(),this.instancedSplatBuffer=t.createBuffer(),this.createQuadVertexBuffer()}createIndexBuffer(){const t=this.gl,e=this.options.maxIndexedSplatCount,i=new Uint32Array(e*6);for(let s=0;s<e;s++){const o=s*4,a=s*6;i[a+0]=o+0,i[a+1]=o+1,i[a+2]=o+2,i[a+3]=o+1,i[a+4]=o+3,i[a+5]=o+2}this.indexBuffer=t.createBuffer(),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.indexBuffer),t.bufferData(t.ELEMENT_ARRAY_BUFFER,i,t.STATIC_DRAW)}createQuadVertexBuffer(){const t=this.gl,e=new Float32Array([-1,-1,-1,1,1,-1,1,1]);this.quadVertexBuffer=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.quadVertexBuffer),t.bufferData(t.ARRAY_BUFFER,e,t.STATIC_DRAW)}loadSplats(t){if(!this.isInitialized)throw new Error("Renderer not initialized");const e=this.gl;this.splatCount=t.length,this.originalSplats=[...t],this.usingFlat=!1,this.flatData=null;const i=Math.min(t.length,this.options.maxIndexedSplatCount),s=t.slice(0,i),o=t.slice(i),a=this.packSplatData(s);e.bindBuffer(e.ARRAY_BUFFER,this.splatBuffer),e.bufferData(e.ARRAY_BUFFER,a,e.DYNAMIC_DRAW),e.bindBuffer(e.ARRAY_BUFFER,this.splatBufferPrime),e.bufferData(e.ARRAY_BUFFER,a,e.DYNAMIC_DRAW);const r=o.length>0?this.packInstancedSplatData(o):new Float32Array(0);e.bindBuffer(e.ARRAY_BUFFER,this.instancedSplatBuffer),e.bufferData(e.ARRAY_BUFFER,r,e.DYNAMIC_DRAW),this.needsSort=!0,this.splatSorter&&this.splatSorter.markNeedsSort(),this.options.debug&&!this.hasLoggedValidation&&(this.validateSplatDataSilent(t),this.hasLoggedValidation=!0)}loadSplatsFromFlat(t){if(!this.isInitialized)throw new Error("Renderer not initialized");const e=t.pointCount;this.splatCount=e,this.usingFlat=!0,this.flatData=t;const i=this.lastOrderArray&&this.lastOrderArray.length===e?this.lastOrderArray:null;this.packFlatToBuffers(t,i),this.needsSort=!0,this.splatSorter&&this.splatSorter.markNeedsSort()}packFlatToBuffers(t,e){const i=this.gl,s=t.pointCount,o=e||null,r=Math.min(s,this.options.maxIndexedSplatCount),n=Math.max(0,s-r),d=14,l=4,u=new Float32Array(r*l*d);let c=0;for(let f=0;f<r;f++){const S=o?o[f]:f,g=S*3,v=S*4,x=[t.scales[g]||1,t.scales[g+1]||1,t.scales[g+2]||1],b=[t.rotations[v+1]||0,t.rotations[v+2]||0,t.rotations[v+3]||0,t.rotations[v]||1],y=A.computeCovariance3D(x,b);for(let F=0;F<4;F++)u[c++]=t.positions[g],u[c++]=t.positions[g+1],u[c++]=t.positions[g+2],u[c++]=t.colors[g],u[c++]=t.colors[g+1],u[c++]=t.colors[g+2],u[c++]=t.opacities[S]??1,u[c++]=y[0][0],u[c++]=y[0][1],u[c++]=y[0][2],u[c++]=y[1][1],u[c++]=y[1][2],u[c++]=y[2][2],u[c++]=F}i.bindBuffer(i.ARRAY_BUFFER,this.splatBuffer),i.bufferData(i.ARRAY_BUFFER,u,i.DYNAMIC_DRAW),i.bindBuffer(i.ARRAY_BUFFER,this.splatBufferPrime),i.bufferData(i.ARRAY_BUFFER,u,i.DYNAMIC_DRAW);const p=13,m=new Float32Array(n*p);c=0;for(let f=0;f<n;f++){const S=o?o[r+f]:r+f,g=S*3,v=S*4,x=[t.scales[g]||1,t.scales[g+1]||1,t.scales[g+2]||1],b=[t.rotations[v+1]||0,t.rotations[v+2]||0,t.rotations[v+3]||0,t.rotations[v]||1],y=A.computeCovariance3D(x,b);m[c++]=t.positions[g],m[c++]=t.positions[g+1],m[c++]=t.positions[g+2],m[c++]=t.colors[g],m[c++]=t.colors[g+1],m[c++]=t.colors[g+2],m[c++]=t.opacities[S]??1,m[c++]=y[0][0],m[c++]=y[0][1],m[c++]=y[0][2],m[c++]=y[1][1],m[c++]=y[1][2],m[c++]=y[2][2]}i.bindBuffer(i.ARRAY_BUFFER,this.instancedSplatBuffer),i.bufferData(i.ARRAY_BUFFER,m,i.DYNAMIC_DRAW)}sortFlatData(){if(!this.flatData)return null;const t=this.flatData.pointCount,e=new Array(t),i=new Float32Array(t),s=this.cameraWorldPosition,o=this.cameraWorldForward;for(let a=0;a<t;a++){e[a]=a;const r=a*3,n=this.flatData.positions[r]-s[0],d=this.flatData.positions[r+1]-s[1],l=this.flatData.positions[r+2]-s[2];i[a]=n*o[0]+d*o[1]+l*o[2]}return e.sort((a,r)=>i[r]-i[a]),this.packFlatToBuffers(this.flatData,e),this.lastSortedIndexes=e.map(a=>({index:a,depth:i[a]})),this.lastOrderArray=Int32Array.from(e),this.lastSortedIndexes}updateSplatDataDirect(t){if(!this.isInitialized)throw new Error("Renderer not initialized");const e=this.gl;if(this.splatCount=t.length,this.originalSplats=[...t],this.lastSortedIndexes&&this.lastSortedIndexes.length===t.length){const i=this.lastSortedIndexes.map(d=>t[d.index]),s=Math.min(i.length,this.options.maxIndexedSplatCount),o=i.slice(0,s),a=i.slice(s),r=this.packSplatData(o),n=a.length>0?this.packInstancedSplatData(a):new Float32Array(0);e.bindBuffer(e.ARRAY_BUFFER,this.splatBuffer),e.bufferData(e.ARRAY_BUFFER,r,e.DYNAMIC_DRAW),e.bindBuffer(e.ARRAY_BUFFER,this.splatBufferPrime),e.bufferData(e.ARRAY_BUFFER,r,e.DYNAMIC_DRAW),e.bindBuffer(e.ARRAY_BUFFER,this.instancedSplatBuffer),e.bufferData(e.ARRAY_BUFFER,n,e.DYNAMIC_DRAW)}else this.loadSplats(t)}packSplatData(t){const s=new Float32Array(t.length*4*14);let o=0;for(let a=0;a<t.length;a++){const r=t[a];for(let n=0;n<4;n++)s[o++]=r.position[0],s[o++]=r.position[1],s[o++]=r.position[2],s[o++]=r.color[0],s[o++]=r.color[1],s[o++]=r.color[2],s[o++]=r.color[3],s[o++]=r.covA[0],s[o++]=r.covA[1],s[o++]=r.covA[2],s[o++]=r.covB[0],s[o++]=r.covB[1],s[o++]=r.covB[2],s[o++]=n}return s}packInstancedSplatData(t){const i=new Float32Array(t.length*13);let s=0;for(let o=0;o<t.length;o++){const a=t[o];i[s++]=a.position[0],i[s++]=a.position[1],i[s++]=a.position[2],i[s++]=a.color[0],i[s++]=a.color[1],i[s++]=a.color[2],i[s++]=a.color[3],i[s++]=a.covA[0],i[s++]=a.covA[1],i[s++]=a.covA[2],i[s++]=a.covB[0],i[s++]=a.covB[1],i[s++]=a.covB[2]}return i}setupVertexAttributes(){const t=this.gl,e=14,i=4,s=e*i;t.bindVertexArray(this.vertexArray),t.bindBuffer(t.ARRAY_BUFFER,this.splatBuffer),t.enableVertexAttribArray(this.attributeLocations.position),t.vertexAttribPointer(this.attributeLocations.position,3,t.FLOAT,!1,s,0),t.enableVertexAttribArray(this.attributeLocations.color),t.vertexAttribPointer(this.attributeLocations.color,4,t.FLOAT,!1,s,3*i),t.enableVertexAttribArray(this.attributeLocations.covA),t.vertexAttribPointer(this.attributeLocations.covA,3,t.FLOAT,!1,s,7*i),t.enableVertexAttribArray(this.attributeLocations.covB),t.vertexAttribPointer(this.attributeLocations.covB,3,t.FLOAT,!1,s,10*i),t.enableVertexAttribArray(this.attributeLocations.vertexId),t.vertexAttribPointer(this.attributeLocations.vertexId,1,t.FLOAT,!1,s,13*i),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.indexBuffer)}setupInstancedVertexAttributes(){const t=this.gl;t.bindVertexArray(this.instancedVertexArray),t.bindBuffer(t.ARRAY_BUFFER,this.quadVertexBuffer),t.enableVertexAttribArray(this.instancedAttributeLocations.quadVertex),t.vertexAttribPointer(this.instancedAttributeLocations.quadVertex,2,t.FLOAT,!1,0,0),t.bindBuffer(t.ARRAY_BUFFER,this.instancedSplatBuffer);const e=13,i=4,s=e*i;t.enableVertexAttribArray(this.instancedAttributeLocations.position),t.vertexAttribPointer(this.instancedAttributeLocations.position,3,t.FLOAT,!1,s,0),t.vertexAttribDivisor(this.instancedAttributeLocations.position,1),t.enableVertexAttribArray(this.instancedAttributeLocations.color),t.vertexAttribPointer(this.instancedAttributeLocations.color,4,t.FLOAT,!1,s,3*i),t.vertexAttribDivisor(this.instancedAttributeLocations.color,1),t.enableVertexAttribArray(this.instancedAttributeLocations.covA),t.vertexAttribPointer(this.instancedAttributeLocations.covA,3,t.FLOAT,!1,s,7*i),t.vertexAttribDivisor(this.instancedAttributeLocations.covA,1),t.enableVertexAttribArray(this.instancedAttributeLocations.covB),t.vertexAttribPointer(this.instancedAttributeLocations.covB,3,t.FLOAT,!1,s,10*i),t.vertexAttribDivisor(this.instancedAttributeLocations.covB,1)}render(t,e,i){if(!this.isInitialized||this.splatCount===0)return;const s=performance.now(),o=this.gl;this.currentViewMatrix=t,this.currentProjectionMatrix=e,this.currentScreenSize=i,o.viewport(0,0,i[0],i[1]);const a=this.options.backgroundColor;o.clearColor(a[0],a[1],a[2],a[3]),o.clear(o.COLOR_BUFFER_BIT|o.DEPTH_BUFFER_BIT),this.options.debug&&this.validateRenderState(),this.renderWithMixedStrategy(),o.getError(),this.renderStats.frameTime=performance.now()-s,this.renderStats.splatCount=this.splatCount}renderWithMixedStrategy(){const t=this.gl,e=Math.min(this.splatCount,this.options.maxIndexedSplatCount),i=Math.max(0,this.splatCount-e);if(this.renderStats.drawCalls=0,e>0){t.useProgram(this.shaderProgram),t.uniformMatrix4fv(this.uniformLocations.viewMatrix,!1,this.currentViewMatrix),t.uniformMatrix4fv(this.uniformLocations.projectionMatrix,!1,this.currentProjectionMatrix),t.uniform2fv(this.uniformLocations.screenSize,this.currentScreenSize),t.uniform1f(this.uniformLocations.boundsRadius,3),t.uniform1i(this.uniformLocations.enableFrustumCulling,this.options.enableFrustumCulling?1:0),this.setupVertexAttributes();const s=e*6;t.drawElements(t.TRIANGLES,s,t.UNSIGNED_INT,0),this.renderStats.drawCalls++}i>0&&(t.useProgram(this.instancedShaderProgram),t.uniformMatrix4fv(this.instancedUniformLocations.viewMatrix,!1,this.currentViewMatrix),t.uniformMatrix4fv(this.instancedUniformLocations.projectionMatrix,!1,this.currentProjectionMatrix),t.uniform2fv(this.instancedUniformLocations.screenSize,this.currentScreenSize),t.uniform1i(this.instancedUniformLocations.enableFrustumCulling,this.options.enableFrustumCulling?1:0),this.setupInstancedVertexAttributes(),t.drawArraysInstanced(t.TRIANGLE_STRIP,0,4,i),this.renderStats.drawCalls++)}updateCamera(t,e=[0,0,-1]){this.cameraWorldPosition=[...t],this.cameraWorldForward=[...e]}async sortSplats(t){if(this.usingFlat&&this.flatData)return{indexAndDepth:this.sortFlatData(),sortTime:0,splatCount:this.splatCount};const e=this.originalSplats.length>0?this.originalSplats:t,i=await this.splatSorter.sortSplats(e,this.cameraWorldPosition,this.cameraWorldForward);return i&&i.indexAndDepth&&this.applySortResult(e,i.indexAndDepth),i}applySortResult(t,e){const i=this.gl;this.lastSortedIndexes=e;const s=e.map(l=>t[l.index]),o=Math.min(s.length,this.options.maxIndexedSplatCount),a=s.slice(0,o),r=s.slice(o),n=this.packSplatData(a),d=r.length>0?this.packInstancedSplatData(r):new Float32Array(0);i.bindBuffer(i.ARRAY_BUFFER,this.splatBuffer),i.bufferData(i.ARRAY_BUFFER,n,i.DYNAMIC_DRAW),i.bindBuffer(i.ARRAY_BUFFER,this.splatBufferPrime),i.bufferData(i.ARRAY_BUFFER,n,i.DYNAMIC_DRAW),i.bindBuffer(i.ARRAY_BUFFER,this.instancedSplatBuffer),i.bufferData(i.ARRAY_BUFFER,d,i.DYNAMIC_DRAW)}dispose(){if(!this.gl)return;const t=this.gl;this.splatBuffer&&t.deleteBuffer(this.splatBuffer),this.splatBufferPrime&&t.deleteBuffer(this.splatBufferPrime),this.indexBuffer&&t.deleteBuffer(this.indexBuffer),this.vertexArray&&t.deleteVertexArray(this.vertexArray),this.instancedSplatBuffer&&t.deleteBuffer(this.instancedSplatBuffer),this.quadVertexBuffer&&t.deleteBuffer(this.quadVertexBuffer),this.instancedVertexArray&&t.deleteVertexArray(this.instancedVertexArray),this.shaderProgram&&t.deleteProgram(this.shaderProgram),this.instancedShaderProgram&&t.deleteProgram(this.instancedShaderProgram),this.splatSorter&&this.splatSorter.dispose(),this.isInitialized=!1}calculateSplatBounds(t){if(t.length===0)return null;let e=1/0,i=-1/0,s=1/0,o=-1/0,a=1/0,r=-1/0;for(const m of t){const f=m.position;e=Math.min(e,f[0]),i=Math.max(i,f[0]),s=Math.min(s,f[1]),o=Math.max(o,f[1]),a=Math.min(a,f[2]),r=Math.max(r,f[2])}const n=[(e+i)/2,(s+o)/2,(a+r)/2],d=[i-e,o-s,r-a],l=Math.max(...d);let u=1/0,c=-1/0,p=[];for(let m=0;m<Math.min(t.length,10);m++){const f=t[m];u=Math.min(u,f.color[3]),c=Math.max(c,f.color[3]),p.push([...f.color])}return{min:[e,s,a],max:[i,o,r],center:n,size:d,maxDimension:l,alphaRange:[u,c],sampleColors:p}}validateSplatDataSilent(t){if(t.length===0)return;const e=t[0];e.covA&&e.covB&&(e.covA[0],e.covA[1],e.covA[2],e.covA[1],e.covB[0],e.covB[1],e.covA[2],e.covB[1],e.covB[2]);for(let i=0;i<Math.min(t.length,3);i++)this.validateSingleSplat(t[i],i)}validateSingleSplat(t,e){return!(!t.position||t.position.length<3||t.position.some(i=>!isFinite(i))||!t.color||t.color.length<4||t.color.some(i=>i<0||i>1||!isFinite(i)))}debugRenderState(t,e,i,s){}validateRenderState(){const t=this.gl;this.splatCount,t.isBuffer(this.splatBuffer),t.isBuffer(this.instancedSplatBuffer),t.isProgram(this.shaderProgram),t.isProgram(this.instancedShaderProgram),t.isEnabled(t.DEPTH_TEST),t.isEnabled(t.BLEND);const e=t.getParameter(t.BLEND_SRC_ALPHA),i=t.getParameter(t.BLEND_DST_ALPHA);e!==t.SRC_ALPHA||t.ONE_MINUS_SRC_ALPHA,!this.cameraWorldPosition||this.cameraWorldPosition.length,!this.currentViewMatrix||this.currentViewMatrix.length,!this.currentProjectionMatrix||this.currentProjectionMatrix.length}getRenderStats(){return{...this.renderStats}}}class Y{constructor(t={}){this.options={debug:!1,enableCaching:!0,batchSize:1e3,...t},this.wasmModule=null,this.flameManager=null,this.isInitialized=!1,this.splatCollection=new M,this.lastFrameData=null,this.lastSplatCount=0,this.computeStats={totalFrames:0,avgComputeTime:0,lastComputeTime:0,wasmCallCount:0}}async initialize(t,e){try{return this.wasmModule=await t,this.flameManager=new e({logLevel:this.options.debug?"verbose":"basic",enableValidation:this.options.debug,enablePerformanceMetrics:!0}),await this.flameManager.initialize(this.wasmModule),this.isInitialized=!0,!0}catch(i){throw i}}async loadFlameModel(t){if(!this.isInitialized)throw new Error("WASM adapter not initialized");try{return await this.flameManager.loadFlameModel(t),!0}catch(e){throw e}}async load3DGSData(t){if(!this.isInitialized)throw new Error("WASM adapter not initialized");try{this.original3DGSData=t;const{originalPoints:e,binding:i,flameFaces:s}=this.convertGaussianDataToFlameFormat(t);await this.flameManager.set3DGSData(e,i,s);const o=t.positions?.length/3||0;return this.lastSplatCount=o,!0}catch(e){throw e}}convertGaussianDataToFlameFormat(t){const e=t.positions?.length/3||0;if(e===0)throw new Error("No valid Gaussian data provided");const i=[];for(let a=0;a<e;a++){const r={position:[t.positions[a*3],t.positions[a*3+1],t.positions[a*3+2]],rotation:[t.rotations[a*4],t.rotations[a*4+1],t.rotations[a*4+2],t.rotations[a*4+3]],color:[t.colors[a*3],t.colors[a*3+1],t.colors[a*3+2]],scale:[t.scales[a*3],t.scales[a*3+1],t.scales[a*3+2]],opacity:t.opacities[a]};i.push(r)}const s=new Array(e).fill(0).map((a,r)=>r),o=new Int32Array([0,1,2]);return{originalPoints:i,binding:s,flameFaces:o}}async computeFrame(t){if(!this.isInitialized)throw new Error("WASM adapter not initialized");const e=performance.now();try{if(this.options.enableCaching&&this.lastFrameData&&this.areParamsEqual(t,this.lastFrameData))return this.computeStats.lastComputeTime=performance.now()-e,this.splatCollection;let i;try{i=await this.flameManager.computeFrameFlat(t)}catch(a){if(a.message.includes("detached ArrayBuffer"))i=await this.flameManager.computeFrame(t);else throw a}if(this.computeStats.wasmCallCount++,!i.success||!i.data||!i.data.points)throw new Error("Invalid WASM computation result");const s=this.convertWASMResultToSplats(i.data);this.splatCollection.clear(),this.splatCollection.addBatch(s),this.lastFrameData={...t},this.lastSplatCount=s.length;const o=performance.now()-e;return this.updateComputeStats(o),this.splatCollection}catch(i){throw i}}convertOriginalPLYToSplats(t){const e=[];try{const i=t.positions?.length/3||0;if(i===0)throw new Error("No points data in original PLY data");for(let s=0;s<i;s++){const o=new A;o.position[0]=t.positions[s*3],o.position[1]=t.positions[s*3+1],o.position[2]=t.positions[s*3+2],t.colors?(o.color[0]=t.colors[s*3],o.color[1]=t.colors[s*3+1],o.color[2]=t.colors[s*3+2],o.color[3]=1):o.color[0]=o.color[1]=o.color[2]=o.color[3]=1,t.opacities&&(o.color[3]=Math.max(0,Math.min(1,t.opacities[s])));const a=t.rotations?[t.rotations[s*4],t.rotations[s*4+1],t.rotations[s*4+2],t.rotations[s*4+3]]:[1,0,0,0],r=t.scales?[t.scales[s*3],t.scales[s*3+1],t.scales[s*3+2]]:[.1,.1,.1],n={rotation:a,scale:r};this.computeCovarianceFromRotationScale(n,o),e.push(o)}}catch(i){throw i}return e}convertWASMResultToSplats(t){const e=[];try{if(!t.points||t.points.length===0)throw new Error("No points data in WASM result");const i=t.points.length;for(let s=0;s<i;s++){const o=t.points[s],a=new A;if(o.position&&Array.isArray(o.position)&&o.position.length>=3)a.position[0]=o.position[0],a.position[1]=o.position[1],a.position[2]=o.position[2];else throw new Error(`Invalid position data at point ${s}`);o.color&&Array.isArray(o.color)&&o.color.length>=3?(a.color[0]=o.color[0],a.color[1]=o.color[1],a.color[2]=o.color[2],a.color[3]=1):(a.color[0]=1,a.color[1]=1,a.color[2]=1,a.color[3]=1),typeof o.opacity=="number"&&(a.color[3]=Math.max(0,Math.min(1,o.opacity))),this.computeCovarianceFromRotationScale(o,a),e.push(a)}}catch(i){throw i}return e}computeCovarianceFromRotationScale(t,e){let i=[1,0,0,0],s=[.1,.1,.1];t.rotation&&Array.isArray(t.rotation)&&t.rotation.length>=4&&(i=t.rotation.slice()),t.scale&&Array.isArray(t.scale)&&t.scale.length>=3&&(s=t.scale.slice());const o=i[0],a=i[1],r=i[2],n=i[3],d=Math.sqrt(o*o+a*a+r*r+n*n);d>1e-6&&(i[0]=o/d,i[1]=a/d,i[2]=r/d,i[3]=n/d);const l=i[0],u=i[1],c=i[2],p=i[3],m=[[1-2*(c*c+p*p),2*(u*c-l*p),2*(u*p+l*c)],[2*(u*c+l*p),1-2*(u*u+p*p),2*(c*p-l*u)],[2*(u*p-l*c),2*(c*p+l*u),1-2*(u*u+c*c)]],f=Math.max(1e-6,s[0]),S=Math.max(1e-6,s[1]),g=Math.max(1e-6,s[2]),v=f*f,x=S*S,b=g*g,y=m[0][0]*m[0][0]*v+m[0][1]*m[0][1]*x+m[0][2]*m[0][2]*b,F=m[0][0]*m[1][0]*v+m[0][1]*m[1][1]*x+m[0][2]*m[1][2]*b,T=m[0][0]*m[2][0]*v+m[0][1]*m[2][1]*x+m[0][2]*m[2][2]*b,I=m[1][0]*m[1][0]*v+m[1][1]*m[1][1]*x+m[1][2]*m[1][2]*b,_=m[1][0]*m[2][0]*v+m[1][1]*m[2][1]*x+m[1][2]*m[2][2]*b,D=m[2][0]*m[2][0]*v+m[2][1]*m[2][1]*x+m[2][2]*m[2][2]*b;e.covA[0]=y,e.covA[1]=F,e.covA[2]=T,e.covB[0]=I,e.covB[1]=_,e.covB[2]=D}async computeFrameBatched(t,e=null){const i=e||this.options.batchSize;if(this.lastSplatCount<=i)return this.computeFrame(t);const s=Math.ceil(this.lastSplatCount/i),o=[];for(let a=0;a<s;a++){const r=a*i,n=Math.min(r+i,this.lastSplatCount),d={...t,batchStart:r,batchEnd:n},l=await this.computeFrame(d);o.push(...l.splats)}return this.splatCollection.clear(),this.splatCollection.addBatch(o),this.splatCollection}getCurrentSplats(){return this.splatCollection}areParamsEqual(t,e){if(!t||!e)return!1;const i=Object.keys(t),s=Object.keys(e);if(i.length!==s.length)return!1;for(const o of i)if(t[o]!==e[o])return!1;return!0}updateComputeStats(t){this.computeStats.totalFrames++,this.computeStats.lastComputeTime=t;const e=.1;this.computeStats.avgComputeTime=this.computeStats.avgComputeTime*(1-e)+t*e}getComputeStats(){return{...this.computeStats}}getWASMMemoryStats(){return!this.wasmModule||!this.wasmModule.HEAP8?null:{totalMemory:this.wasmModule.HEAP8.length,usedMemory:this.wasmModule.HEAP8.buffer.byteLength,heapSize:this.wasmModule.HEAPU8?this.wasmModule.HEAPU8.length:0}}dispose(){this.flameManager&&typeof this.flameManager.dispose=="function"&&this.flameManager.dispose(),this.splatCollection.clear(),this.lastFrameData=null,this.isInitialized=!1}clearCache(){this.lastFrameData=null,this.splatCollection.clear()}setDebugMode(t){this.options.debug=t,this.flameManager&&typeof this.flameManager.setDebugMode=="function"&&this.flameManager.setDebugMode(t)}}async function R(h={}){const t=new Y(h);try{const[e,{FlameComplete3DGSManager:i}]=await Promise.all([E(()=>import("./flame_compute_frame_wasm-CeFRUB2k.js"),__vite__mapDeps([0,1])).then(s=>s.default()),E(()=>import("./flameComplete3DGSAdapter-BtVJ4aPR.js"),[])]);return await t.initialize(e,i),t}catch(e){throw e}}const C={createPerspectiveMatrix(h,t,e,i){const s=1/Math.tan(h*Math.PI/180/2),o=1/(e-i);return new Float32Array([s/t,0,0,0,0,s,0,0,0,0,(e+i)*o,-1,0,0,e*i*o*2,0])},createLookAtMatrix(h,t,e){const i=[h[0]-t[0],h[1]-t[1],h[2]-t[2]],s=Math.sqrt(i[0]*i[0]+i[1]*i[1]+i[2]*i[2]);i[0]/=s,i[1]/=s,i[2]/=s;const o=[e[1]*i[2]-e[2]*i[1],e[2]*i[0]-e[0]*i[2],e[0]*i[1]-e[1]*i[0]],a=Math.sqrt(o[0]*o[0]+o[1]*o[1]+o[2]*o[2]);o[0]/=a,o[1]/=a,o[2]/=a;const r=[i[1]*o[2]-i[2]*o[1],i[2]*o[0]-i[0]*o[2],i[0]*o[1]-i[1]*o[0]];return new Float32Array([o[0],r[0],i[0],0,o[1],r[1],i[1],0,o[2],r[2],i[2],0,-(o[0]*h[0]+o[1]*h[1]+o[2]*h[2]),-(r[0]*h[0]+r[1]*h[1]+r[2]*h[2]),-(i[0]*h[0]+i[1]*h[1]+i[2]*h[2]),1])}};class q{constructor(t={}){this.options={canvas:null,debug:!1,backgroundColor:[1,1,1,1],enableWASM:!0,enableAutoSort:!0,enablePerformanceMonitoring:!0,targetFPS:60,...t},this.canvas=this.options.canvas,this.renderer=null,this.wasmAdapter=null,this.isInitialized=!1,this.camera={position:[-.02,-.013,1.5],target:[0,0,0],up:[0,1,0],fov:22,aspect:1,near:.01,far:100},this.isRendering=!1,this.animationFrameId=null,this.lastFrameTime=0,this.currentSplats=null,this.needsRender=!0,this.performanceMonitor={enabled:this.options.enablePerformanceMonitoring,frameCount:0,startTime:performance.now(),lastFpsUpdate:0,currentFPS:0,frameHistory:[],maxHistoryLength:120},this.onFrameRender=null,this.onPerformanceUpdate=null,this.onError=null}async initialize(){try{const t=this.options.canvas;if(!t)throw new Error("Canvas element is required");if(this.renderer=new O({canvas:t,debug:this.options.debug,backgroundColor:this.options.backgroundColor}),await this.renderer.initialize(),this.options.enableWASM)try{this.wasmAdapter=await R({debug:this.options.debug})}catch{this.wasmAdapter=null}return this.updateCameraAspect(),this.updateCamera(),this.isInitialized=!0,!0}catch(t){throw this.onError&&this.onError(t),t}}async initializeWASM(t,e){try{if(!this.isInitialized)throw new Error("System must be initialized first");if(!e)throw new Error("FLAME data is required");if(this.wasmAdapter||(this.wasmAdapter=await R({debug:this.options.debug})),await this.wasmAdapter.loadFlameModel(e.flameModel),await this.wasmAdapter.flameManager.set3DGSData(e.original3DGSPoints,e.binding,e.flameFaces),t&&window.WasmMemoryReader)try{const i=new window.WasmMemoryReader(t);this.wasmAdapter.flameManager.setWasmMemoryReader(i)}catch{}return!0}catch(i){throw this.onError&&this.onError(i),i}}async updateFrame(t){if(!this.isInitialized)throw new Error("System not initialized");if(this.wasmAdapter)try{const e=await this.wasmAdapter.computeFrame(t);this.currentSplats=e,this.currentSplats&&this.currentSplats.count>0&&(this.renderer.loadSplats(this.currentSplats.toArray()),this.needsRender=!0)}catch(e){this.onError&&this.onError(e)}}renderFrame(){if(!(!this.isInitialized||!this.renderer))try{this.updateCameraMatrices(),this.renderer.render(this.viewMatrix,this.projectionMatrix,[this.options.canvas.width,this.options.canvas.height]),this.needsRender=!1}catch(t){this.onError&&this.onError(t)}}updateCameraMatrices(){this.projectionMatrix=C.createPerspectiveMatrix(this.camera.fov,this.camera.aspect,this.camera.near,this.camera.far),this.viewMatrix=C.createLookAtMatrix(this.camera.position,this.camera.target,this.camera.up)}async loadFlameModel(t){if(!this.isInitialized)throw new Error("System not initialized");if(this.wasmAdapter)try{await this.wasmAdapter.loadFlameModel(t)}catch(e){throw e}}async loadGaussianData(t){if(!this.isInitialized)throw new Error("System not initialized");try{if(this.wasmAdapter)await this.wasmAdapter.load3DGSData(t),this.currentSplats=new M;else{const e=this.convertGaussianDataToSplats(t);this.currentSplats=new M,this.currentSplats.addBatch(e),this.renderer.loadSplats(this.currentSplats.toArray())}return this.needsRender=!0,!0}catch(e){throw e}}convertGaussianDataToSplats(t){const e=[],i=t.positions||[],s=t.colors||[],o=t.scales||[],a=t.rotations||[],r=t.opacities||[],n=i.length/3;for(let d=0;d<n;d++){const l=new A;if(l.position[0]=i[d*3]||0,l.position[1]=i[d*3+1]||0,l.position[2]=i[d*3+2]||0,s.length>0?(l.color[0]=s[d*3]||1,l.color[1]=s[d*3+1]||1,l.color[2]=s[d*3+2]||1,l.color[3]=r[d]||1):l.color.set([1,1,1,1]),o.length>0&&a.length>0){const u=[o[d*3]||1,o[d*3+1]||1,o[d*3+2]||1],c=[a[d*4]||0,a[d*4+1]||0,a[d*4+2]||0,a[d*4+3]||1],p=A.computeCovariance3D(u,c);l.covA[0]=p[0][0],l.covA[1]=p[0][1],l.covA[2]=p[0][2],l.covB[0]=p[1][1],l.covB[1]=p[1][2],l.covB[2]=p[2][2]}else l.covA.set([.1,0,0]),l.covB.set([.1,0,.1]);e.push(l)}return e}async updateFlameParams(t){if(!this.isInitialized)throw new Error("System not initialized");if(this.wasmAdapter)try{const e=await this.wasmAdapter.computeFrame(t);e&&e.count>0&&(this.currentSplats=e,this.options.enableAutoSort&&await this.sortSplats(),this.renderer.loadSplats(this.currentSplats.toArray()),this.needsRender=!0)}catch(e){this.onError&&this.onError(e)}}async sortSplats(){if(!(!this.currentSplats||this.currentSplats.count===0))try{this.renderer.updateCamera(this.camera.position,this.getCameraForward()),await this.renderer.sortSplats(this.currentSplats.splats)}catch{}}async updateCamera(t={}){Object.assign(this.camera,t),t.aspect===void 0&&this.updateCameraAspect(),this.options.enableAutoSort&&this.currentSplats&&this.currentSplats.count>0&&await this.sortSplats(),this.needsRender=!0}updateCameraAspect(){const t=this.options.canvas;t&&(this.camera.aspect=t.width/t.height)}getCameraForward(){const t=[this.camera.target[0]-this.camera.position[0],this.camera.target[1]-this.camera.position[1],this.camera.target[2]-this.camera.position[2]],e=Math.sqrt(t[0]*t[0]+t[1]*t[1]+t[2]*t[2]);return e>0&&(t[0]/=e,t[1]/=e,t[2]/=e),t}startRendering(){if(!this.isInitialized)throw new Error("System not initialized");this.isRendering||(this.isRendering=!0,this.performanceMonitor.startTime=performance.now(),this.performanceMonitor.frameCount=0,this.renderLoop())}stopRendering(){this.isRendering&&(this.isRendering=!1,this.animationFrameId&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null))}renderLoop(){if(!this.isRendering)return;const t=performance.now(),e=t-this.lastFrameTime,i=1e3/this.options.targetFPS;if(e<i&&!this.needsRender){this.animationFrameId=requestAnimationFrame(()=>this.renderLoop());return}this.lastFrameTime=t;try{this.renderFrame(),this.updatePerformanceMonitor(t,e),this.needsRender=!1}catch(s){this.onError&&this.onError(s)}this.animationFrameId=requestAnimationFrame(()=>this.renderLoop())}renderFrame(){if(!this.renderer||!this.currentSplats)return;const t=this.options.canvas,e=t.width,i=t.height,s=C.createPerspectiveMatrix(this.camera.fov,this.camera.aspect,this.camera.near,this.camera.far),o=C.createLookAtMatrix(this.camera.position,this.camera.target,this.camera.up);this.renderer.render(o,s,[e,i]),this.onFrameRender&&this.onFrameRender({frameTime:this.renderer.getRenderStats().frameTime,splatCount:this.currentSplats.count})}updatePerformanceMonitor(t,e){if(this.performanceMonitor.enabled&&(this.performanceMonitor.frameCount++,this.performanceMonitor.frameHistory.push(e),this.performanceMonitor.frameHistory.length>this.performanceMonitor.maxHistoryLength&&this.performanceMonitor.frameHistory.shift(),t-this.performanceMonitor.lastFpsUpdate>=1e3)){const i=t-this.performanceMonitor.startTime;this.performanceMonitor.currentFPS=Math.round(this.performanceMonitor.frameCount/i*1e3),this.performanceMonitor.lastFpsUpdate=t,this.onPerformanceUpdate&&this.onPerformanceUpdate(this.getPerformanceStats())}}getPerformanceStats(){const t=this.renderer?this.renderer.getRenderStats():{},e=this.wasmAdapter?this.wasmAdapter.getComputeStats():{},i=this.performanceMonitor.frameHistory,s=i.length>0?i.reduce((o,a)=>o+a,0)/i.length:0;return{fps:this.performanceMonitor.currentFPS,avgFrameTime:s,renderStats:t,wasmStats:e,splatCount:this.currentSplats?this.currentSplats.count:0}}getSystemStatus(){return{initialized:this.isInitialized,rendering:this.isRendering,wasmEnabled:!!this.wasmAdapter,splatCount:this.currentSplats?this.currentSplats.count:0,camera:{...this.camera}}}handleResize(){!this.isInitialized||!this.renderer||(this.updateCameraAspect(),typeof this.renderer.handleResize=="function"&&this.renderer.handleResize(),this.needsRender=!0)}dispose(){this.stopRendering(),this.renderer&&this.renderer.dispose(),this.wasmAdapter&&this.wasmAdapter.dispose(),this.currentSplats=null,this.isInitialized=!1}}class ${constructor(t={}){this.options={sampleRate:44100,enableCrossfade:!0,bufferSize:4096,...t},this.audioContext=null,this.sourceNode=null,this.gainNode=null,this.analyserNode=null,this.audioBuffer=null,this.isLoaded=!1,this.isPlaying=!1,this.isPaused=!1,this.startTime=0,this.pauseTime=0,this.currentTime=0,this.duration=0,this.onPlay=null,this.onPause=null,this.onStop=null,this.onTimeUpdate=null,this.onEnded=null,this.timeUpdateInterval=null,this.isMobile=this.detectMobile(),this.isMobile||this.initializeAudioContext()}detectMobile(){const t=navigator.userAgent||navigator.vendor||window.opera;return/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(t.toLowerCase())||"ontouchstart"in window||window.innerWidth<=768}async initializeAudioContext(){try{if(this.audioContext)return;const t=window.AudioContext||window.webkitAudioContext;this.audioContext=new t({sampleRate:this.options.sampleRate}),this.gainNode=this.audioContext.createGain(),this.gainNode.connect(this.audioContext.destination),this.analyserNode=this.audioContext.createAnalyser(),this.analyserNode.fftSize=256,this.gainNode.connect(this.analyserNode),console.log("✅ AudioManager initialized successfully")}catch(t){throw console.error("❌ Failed to initialize AudioContext:",t),new Error("AudioContext initialization failed")}}async loadAudio(t){try{this.isMobile&&!this.audioContext&&await this.initializeAudioContext(),await this.resumeAudioContext();const e=await fetch(t);if(!e.ok)throw new Error(`HTTP error! status: ${e.status}`);const i=await e.arrayBuffer();return this.audioBuffer=await this.audioContext.decodeAudioData(i),this.duration=this.audioBuffer.duration,this.isLoaded=!0,!0}catch(e){throw console.error("❌ Failed to load audio:",e),this.isLoaded=!1,new Error(`Audio loading failed: ${e.message}`)}}async resumeAudioContext(){if(!this.audioContext)throw new Error("AudioContext not initialized");if(this.audioContext.state==="suspended")try{await this.audioContext.resume()}catch{throw this.isMobile?new Error("移动端需要用户手动点击才能启动音频播放。"):new Error("需要用户手动操作才能启动音频播放")}}async play(){if(!this.isLoaded)throw new Error("Audio not loaded");this.isMobile&&!this.audioContext&&(console.log("📱 Initializing AudioContext for mobile play..."),await this.initializeAudioContext()),await this.resumeAudioContext(),this.stop(),this.sourceNode=this.audioContext.createBufferSource(),this.sourceNode.buffer=this.audioBuffer,this.sourceNode.connect(this.gainNode),this.sourceNode.onended=()=>{this.isPlaying&&(this.stop(),this.onEnded&&this.onEnded())};const t=this.isPaused?this.pauseTime:0;try{this.isMobile&&this.audioContext.state==="suspended"&&await this.audioContext.resume(),this.sourceNode.start(0,t),this.startTime=this.audioContext.currentTime-t,this.isPlaying=!0,this.isPaused=!1,this.startTimeUpdate(),this.onPlay&&this.onPlay()}catch(e){throw this.isPlaying=!1,this.isMobile?new Error(`移动端音频播放失败: ${e.message}`):new Error(`音频播放失败: ${e.message}`)}}pause(){this.isPlaying&&(this.pauseTime=this.getCurrentTime(),this.sourceNode&&this.sourceNode.stop(),this.isPlaying=!1,this.isPaused=!0,this.stopTimeUpdate(),console.log("⏸️ Audio paused at",this.pauseTime.toFixed(2),"seconds"),this.onPause&&this.onPause())}stop(){if(this.sourceNode){try{this.sourceNode.stop()}catch{}this.sourceNode=null}this.isPlaying=!1,this.isPaused=!1,this.startTime=0,this.pauseTime=0,this.currentTime=0,this.stopTimeUpdate(),console.log("⏹️ Audio stopped"),this.onStop&&this.onStop()}getCurrentTime(){if(!this.isPlaying||!this.audioContext)return this.isPaused?this.pauseTime:0;const t=this.audioContext.currentTime-this.startTime;return Math.min(t,this.duration)}async seekTo(t){if(!this.isLoaded)return;const e=this.isPlaying;this.stop(),this.pauseTime=Math.max(0,Math.min(t,this.duration)),e?(this.isPaused=!0,await this.play()):this.isPaused=!0,console.log("⏭️ Seeked to",this.pauseTime.toFixed(2),"seconds")}setVolume(t){this.gainNode&&this.audioContext&&this.gainNode.gain.setValueAtTime(Math.max(0,Math.min(1,t)),this.audioContext.currentTime)}getVolume(){return this.gainNode&&this.audioContext?this.gainNode.gain.value:0}startTimeUpdate(){this.stopTimeUpdate(),this.timeUpdateInterval=setInterval(()=>{this.currentTime=this.getCurrentTime(),this.onTimeUpdate&&this.onTimeUpdate(this.currentTime)},50)}stopTimeUpdate(){this.timeUpdateInterval&&(clearInterval(this.timeUpdateInterval),this.timeUpdateInterval=null)}getAnalyserData(){if(!this.analyserNode||!this.audioContext)return null;const t=this.analyserNode.frequencyBinCount,e=new Uint8Array(t);return this.analyserNode.getByteFrequencyData(e),e}getState(){return{isLoaded:this.isLoaded,isPlaying:this.isPlaying,isPaused:this.isPaused,currentTime:this.getCurrentTime(),duration:this.duration,volume:this.getVolume()}}destroy(){this.stop(),this.stopTimeUpdate(),this.audioContext&&this.audioContext.close(),this.onPlay=null,this.onPause=null,this.onStop=null,this.onTimeUpdate=null,this.onEnded=null,console.log("🧹 AudioManager destroyed")}}class H{constructor(t={}){this.options={baseAssetsPath:"/assets",modelFolder:"3dgs4",enableCache:!0,enableValidation:!0,...t},this.cache=new Map,this.protoRoot=null,this.FlameType=null,this.FlameAnimationType=null,this.animationData=null,this.frameCount=0,this.isLoaded=!1}async initializeProtobufTypes(){if(!this.FlameAnimationType)try{this.protoRoot=new w.Root;const t=new w.Type("Flame").add(new w.Field("translation",1,"float","repeated",{packed:!0})).add(new w.Field("rotation",2,"float","repeated",{packed:!0})).add(new w.Field("neck_pose",3,"float","repeated",{packed:!0})).add(new w.Field("jaw_pose",4,"float","repeated",{packed:!0})).add(new w.Field("eye_pose",5,"float","repeated",{packed:!0})).add(new w.Field("eye_lid",6,"float","repeated",{packed:!0})).add(new w.Field("expression",7,"float","repeated",{packed:!0})),e=new w.Type("FlameAnimation").add(new w.Field("keyframes",1,"Flame","repeated"));this.protoRoot.add(t),this.protoRoot.add(e),this.protoRoot.resolveAll(),this.FlameType=this.protoRoot.lookupType("Flame"),this.FlameAnimationType=this.protoRoot.lookupType("FlameAnimation"),console.log("✅ Protobuf types initialized successfully"),console.log("   Flame fields:",Object.keys(this.FlameType.fields)),console.log("   FlameAnimation fields:",Object.keys(this.FlameAnimationType.fields))}catch(t){throw console.error("❌ Failed to initialize protobuf types:",t),new Error(`Protobuf initialization failed: ${t.message}`)}}async loadAnimationData(t="mono.pb"){try{await this.initializeProtobufTypes();const e=`${this.options.baseAssetsPath}/${this.options.modelFolder}/${t}`;if(console.log("📁 Loading animation data:",e),this.options.enableCache&&this.cache.has(e)){const n=this.cache.get(e);return this.animationData=n.animationData,this.frameCount=n.frameCount,this.isLoaded=!0,console.log("✅ Animation data loaded from cache:",this.frameCount,"frames"),this.animationData}const i=await fetch(e);if(!i.ok)throw new Error(`HTTP error! status: ${i.status}`);const s=await i.arrayBuffer(),o=new Uint8Array(s);console.log("📦 Binary data loaded:",o.length,"bytes");const a=this.FlameAnimationType.decode(o),r=this.FlameAnimationType.toObject(a,{longs:String,enums:String,bytes:String,defaults:!1,arrays:!0,objects:!1,oneofs:!1});return this.options.enableValidation&&this.validateAnimationData(r),this.animationData=this.processAnimationData(r),this.frameCount=this.animationData.length,this.isLoaded=!0,this.options.enableCache&&this.cache.set(e,{animationData:this.animationData,frameCount:this.frameCount}),console.log("✅ Animation data processed successfully"),console.log("   Total frames:",this.frameCount),console.log("   Frame rate: 25 fps (assumed)"),console.log("   Duration:",(this.frameCount/25).toFixed(2),"seconds"),this.animationData}catch(e){throw console.error("❌ Failed to load animation data:",e),this.isLoaded=!1,new Error(`Animation data loading failed: ${e.message}`)}}validateAnimationData(t){if(!t.keyframes||!Array.isArray(t.keyframes))throw new Error("Invalid animation data: missing or invalid keyframes");if(t.keyframes.length===0)throw new Error("Invalid animation data: no keyframes found");const e=t.keyframes[0],i=["translation","rotation","neck_pose","jaw_pose","eye_pose","expression"];for(const o of i)(!e[o]||!Array.isArray(e[o]))&&console.warn(`⚠️ Missing or invalid field: ${o} in frame data`);const s={translation:3,rotation:3,neck_pose:3,jaw_pose:3,eye_pose:6,expression:100};for(const[o,a]of Object.entries(s))e[o]&&e[o].length!==a&&console.warn(`⚠️ Unexpected array length for ${o}: expected ${a}, got ${e[o].length}`);console.log("✅ Animation data validation passed")}processAnimationData(t){const e=[];for(let i=0;i<t.keyframes.length;i++){const s=t.keyframes[i],o={translation:s.translation||[0,0,0],rotation:s.rotation||[0,0,0],neck_pose:s.neck_pose||[0,0,0],jaw_pose:s.jaw_pose||[0,0,0],eyes_pose:s.eye_pose||[0,0,0,0,0,0],expr:s.expression||new Array(100).fill(0),eyelid:s.eye_lid||[0,0],frameIndex:i,timestamp:i/25,shape:null,static_offset:null};e.push(o)}return e}getFrameData(t){if(!this.isLoaded||!this.animationData)return console.warn("⚠️ Animation data not loaded"),null;const e=Math.max(0,Math.min(t,this.frameCount-1));return e!==t&&console.warn(`⚠️ Frame index clamped: ${t} -> ${e}`),this.animationData[e]}getFrameDataByTime(t,e=25){const i=Math.floor(t*e);return this.getFrameData(i)}getDuration(t=25){return this.isLoaded?this.frameCount/t:0}getFrameCount(){return this.frameCount}isAnimationLoaded(){return this.isLoaded}getAnimationStats(){if(!this.isLoaded)return null;const t={frameCount:this.frameCount,duration:this.getDuration(),fps:25,avgExpressionMagnitude:0,avgJawMovement:0,avgNeckMovement:0};let e=0,i=0,s=0;for(const o of this.animationData){const a=Math.sqrt(o.expr.reduce((d,l)=>d+l*l,0));e+=a;const r=Math.sqrt(o.jaw_pose.reduce((d,l)=>d+l*l,0));i+=r;const n=Math.sqrt(o.neck_pose.reduce((d,l)=>d+l*l,0));s+=n}return t.avgExpressionMagnitude=e/this.frameCount,t.avgJawMovement=i/this.frameCount,t.avgNeckMovement=s/this.frameCount,t}clearCache(){this.cache.clear(),console.log("🧹 Animation data cache cleared")}destroy(){this.clearCache(),this.animationData=null,this.frameCount=0,this.isLoaded=!1,this.protoRoot=null,this.FlameType=null,this.FlameAnimationType=null,console.log("🧹 AnimationDataLoader destroyed")}}class G{constructor(t={}){this.options={enableAutoplay:!1,preload:"auto",crossOrigin:"anonymous",...t},this.audioElement=null,this.isLoaded=!1,this.isPlaying=!1,this.isPaused=!1,this.duration=0,this.onPlay=null,this.onPause=null,this.onStop=null,this.onTimeUpdate=null,this.onEnded=null,this.onError=null,this.isIOS=this.detectIOS(),this.isMobile=this.detectMobile()}detectIOS(){const t=navigator.userAgent.toLowerCase();return/iphone|ipad|ipod/.test(t)||navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1}detectMobile(){const t=navigator.userAgent.toLowerCase();return/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(t)||"ontouchstart"in window||window.innerWidth<=768}createAudioElement(){return this.audioElement?this.audioElement:(this.audioElement=document.createElement("audio"),this.audioElement.crossOrigin=this.options.crossOrigin,this.audioElement.preload=this.options.preload,this.isIOS&&(this.audioElement.controls=!1,this.audioElement.muted=!1,this.audioElement.playsInline=!0,this.audioElement.setAttribute("playsinline","true")),this.setupAudioEvents(),this.audioElement.style.display="none",document.body.appendChild(this.audioElement),this.audioElement)}setupAudioEvents(){this.audioElement&&(this.audioElement.addEventListener("loadeddata",()=>{this.duration=this.audioElement.duration,this.isLoaded=!0}),this.audioElement.addEventListener("play",()=>{this.isPlaying=!0,this.isPaused=!1,this.onPlay&&this.onPlay()}),this.audioElement.addEventListener("pause",()=>{this.isPlaying=!1,this.isPaused=!0,this.onPause&&this.onPause()}),this.audioElement.addEventListener("ended",()=>{this.isPlaying=!1,this.isPaused=!1,this.onEnded&&this.onEnded()}),this.audioElement.addEventListener("timeupdate",()=>{this.onTimeUpdate&&this.onTimeUpdate(this.audioElement.currentTime)}),this.audioElement.addEventListener("error",t=>{const e=this.audioElement.error;this.onError&&this.onError(new Error(`Audio error: ${e?.message||"Unknown error"}`))}))}async loadAudio(t){try{return this.createAudioElement(),new Promise((e,i)=>{const s=()=>{this.audioElement.removeEventListener("loadeddata",s),this.audioElement.removeEventListener("error",o),e(!0)},o=a=>{this.audioElement.removeEventListener("loadeddata",s),this.audioElement.removeEventListener("error",o),i(new Error(`Failed to load audio: ${this.audioElement.error?.message}`))};this.audioElement.addEventListener("loadeddata",s),this.audioElement.addEventListener("error",o),this.audioElement.src=t,this.audioElement.load()})}catch(e){throw console.error("📱 Failed to load mobile audio:",e),e}}async play(){if(!this.audioElement||!this.isLoaded)throw new Error("Audio not loaded");try{this.isIOS&&this.audioElement.currentTime>0&&(this.audioElement.currentTime=0);const t=this.audioElement.play();t!==void 0&&await t}catch(t){throw this.isIOS?new Error(`iOS 音频播放失败: ${t.message}`):new Error(`移动端音频播放失败: ${t.message}`)}}pause(){this.audioElement&&this.isPlaying&&this.audioElement.pause()}stop(){this.audioElement&&(this.audioElement.pause(),this.audioElement.currentTime=0,this.isPlaying=!1,this.isPaused=!1,this.onStop&&this.onStop())}seekTo(t){this.audioElement&&this.isLoaded&&(this.audioElement.currentTime=Math.max(0,Math.min(t,this.duration)))}setVolume(t){this.audioElement&&(this.audioElement.volume=Math.max(0,Math.min(1,t)))}getVolume(){return this.audioElement?this.audioElement.volume:0}getCurrentTime(){return this.audioElement?this.audioElement.currentTime:0}getState(){return{isLoaded:this.isLoaded,isPlaying:this.isPlaying,isPaused:this.isPaused,currentTime:this.getCurrentTime(),duration:this.duration,volume:this.getVolume(),isIOS:this.isIOS,isMobile:this.isMobile}}destroy(){this.stop(),this.audioElement&&(this.audioElement.parentNode&&this.audioElement.parentNode.removeChild(this.audioElement),this.audioElement=null),this.onPlay=null,this.onPause=null,this.onStop=null,this.onTimeUpdate=null,this.onEnded=null,this.onError=null}}class X{constructor(t={}){this.options={fps:25,audioFile:"mono.wav",animationFile:"mono.pb",enableSmoothing:!0,smoothingFactor:.1,enableTimeCorrection:!0,maxTimeDrift:.1,...t},this.detectMobile()?this.audioManager=new G({enableAutoplay:!1,preload:"auto"}):this.audioManager=new $({sampleRate:44100,enableCrossfade:!0}),this.animationLoader=new H({baseAssetsPath:this.options.baseAssetsPath,modelFolder:this.options.modelFolder,enableCache:!0}),this.isInitialized=!1,this.isPlaying=!1,this.isPaused=!1,this.currentTime=0,this.duration=0,this.animationData=null,this.currentFrameIndex=-1,this.lastFrameIndex=-1,this.frameUpdateInterval=null,this.timeDriftCorrection=0,this.lastUpdateTime=0,this.onPlay=null,this.onPause=null,this.onStop=null,this.onTimeUpdate=null,this.onFrameUpdate=null,this.onEnded=null,this.onError=null,this.performanceStats={frameUpdates:0,droppedFrames:0,avgFrameTime:0,maxFrameTime:0,syncErrors:0},this.setupAudioCallbacks()}detectMobile(){const t=navigator.userAgent.toLowerCase();return/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(t)||"ontouchstart"in window||window.innerWidth<=768}setupAudioCallbacks(){this.audioManager.onPlay=()=>{this.isPlaying=!0,this.isPaused=!1,this.startFrameUpdates(),this.onPlay&&this.onPlay()},this.audioManager.onPause=()=>{this.isPlaying=!1,this.isPaused=!0,this.stopFrameUpdates(),this.onPause&&this.onPause()},this.audioManager.onStop=()=>{this.isPlaying=!1,this.isPaused=!1,this.currentFrameIndex=-1,this.stopFrameUpdates(),this.onStop&&this.onStop()},this.audioManager.onTimeUpdate=t=>{this.currentTime=t,this.onTimeUpdate&&this.onTimeUpdate(t)},this.audioManager.onEnded=()=>{this.isPlaying=!1,this.stopFrameUpdates(),this.onEnded&&this.onEnded()}}async initialize(){if(this.isInitialized)return!0;try{console.log("🎭 Initializing AudioAnimationPlayer..."),this.animationData=await this.animationLoader.loadAnimationData(this.options.animationFile);const t=this.animationLoader.getDuration(this.options.fps);return this.duration=t,console.log("📊 Animation data loaded:"),console.log("   Animation duration:",t.toFixed(2),"seconds"),console.log("   Frame count:",this.animationLoader.getFrameCount()),console.log("   Animation FPS:",this.options.fps),this.isInitialized=!0,console.log("✅ AudioAnimationPlayer initialized successfully (audio will load on first play)"),!0}catch(t){throw console.error("❌ Failed to initialize AudioAnimationPlayer:",t),this.isInitialized=!1,this.onError&&this.onError(t),t}}async play(){if(!this.isInitialized)throw new Error("Player not initialized");try{if(console.log("▶️ Starting audio animation playback"),!this.audioManager.isLoaded){console.log("🎵 Loading audio on first play...");const t=`${this.options.baseAssetsPath}/${this.options.modelFolder}/${this.options.audioFile}`;await this.audioManager.loadAudio(t);const e=this.audioManager.duration,i=this.animationLoader.getDuration(this.options.fps);console.log("📊 Duration comparison:"),console.log("   Audio duration:",e.toFixed(2),"seconds"),console.log("   Animation duration:",i.toFixed(2),"seconds"),Math.abs(e-i)>.5&&console.warn(`⚠️ Duration mismatch: audio=${e.toFixed(2)}s, animation=${i.toFixed(2)}s`),this.duration=Math.min(e,i),console.log("✅ Audio loaded successfully, duration:",this.duration.toFixed(2),"seconds")}this.resetPerformanceStats(),await this.audioManager.play()}catch(t){throw console.error("❌ Failed to start playback:",t),this.onError&&this.onError(t),t}}pause(){this.isPlaying&&(console.log("⏸️ Pausing audio animation playback"),this.audioManager.pause())}stop(){(this.isPlaying||this.isPaused)&&(console.log("⏹️ Stopping audio animation playback"),this.audioManager.stop(),this.currentTime=0)}async seekTo(t){if(!this.isInitialized)return;const e=Math.max(0,Math.min(t,this.duration));console.log("⏭️ Seeking to",e.toFixed(2),"seconds"),await this.audioManager.seekTo(e),this.currentTime=e,this.updateAnimationFrame(e)}setVolume(t){this.audioManager.setVolume(t)}getVolume(){return this.audioManager.getVolume()}startFrameUpdates(){this.stopFrameUpdates(),this.frameUpdateInterval=setInterval(()=>{this.updateFrame()},1e3/60),console.log("🔄 Frame updates started (60fps)")}stopFrameUpdates(){this.frameUpdateInterval&&(clearInterval(this.frameUpdateInterval),this.frameUpdateInterval=null,console.log("⏹️ Frame updates stopped"))}updateFrame(){const t=performance.now();try{const i=this.audioManager.getCurrentTime()+this.timeDriftCorrection;this.updateAnimationFrame(i);const s=performance.now()-t;this.updatePerformanceStats(s)}catch(e){console.error("❌ Frame update error:",e),this.performanceStats.syncErrors++,this.onError&&this.onError(e)}}updateAnimationFrame(t){const e=Math.floor(t*this.options.fps),i=Math.max(0,Math.min(e,this.animationLoader.getFrameCount()-1));if(i===this.currentFrameIndex)return;if(this.currentFrameIndex>=0&&i>this.currentFrameIndex+1){const o=i-this.currentFrameIndex-1;this.performanceStats.droppedFrames+=o,console.warn(`⚠️ Dropped ${o} frames (${this.currentFrameIndex} -> ${i})`)}this.lastFrameIndex=this.currentFrameIndex,this.currentFrameIndex=i;const s=this.animationLoader.getFrameData(this.currentFrameIndex);if(!s){console.warn("⚠️ Failed to get frame data for index:",this.currentFrameIndex);return}if(this.options.enableSmoothing&&this.lastFrameIndex>=0&&this.lastFrameIndex!==this.currentFrameIndex){const o=this.animationLoader.getFrameData(this.lastFrameIndex);if(o){const a=t*this.options.fps%1,r=this.interpolateFrameData(o,s,a);this.emitFrameUpdate(r,this.currentFrameIndex,t)}else this.emitFrameUpdate(s,this.currentFrameIndex,t)}else this.emitFrameUpdate(s,this.currentFrameIndex,t);this.performanceStats.frameUpdates++}interpolateFrameData(t,e,i){const s=this.options.smoothingFactor*i,o=1-s;return{...e,translation:[t.translation[0]*o+e.translation[0]*s,t.translation[1]*o+e.translation[1]*s,t.translation[2]*o+e.translation[2]*s],rotation:[t.rotation[0]*o+e.rotation[0]*s,t.rotation[1]*o+e.rotation[1]*s,t.rotation[2]*o+e.rotation[2]*s],expr:t.expr.map((r,n)=>r*o+(e.expr[n]||0)*s),jaw_pose:t.jaw_pose.map((r,n)=>r*o+(e.jaw_pose[n]||0)*s),neck_pose:t.neck_pose.map((r,n)=>r*o+(e.neck_pose[n]||0)*s)}}emitFrameUpdate(t,e,i){this.onFrameUpdate&&this.onFrameUpdate({frameData:t,frameIndex:e,currentTime:i,progress:i/this.duration})}updatePerformanceStats(t){this.performanceStats.avgFrameTime=this.performanceStats.avgFrameTime*.9+t*.1,t>this.performanceStats.maxFrameTime&&(this.performanceStats.maxFrameTime=t)}resetPerformanceStats(){this.performanceStats={frameUpdates:0,droppedFrames:0,avgFrameTime:0,maxFrameTime:0,syncErrors:0}}getState(){return{isInitialized:this.isInitialized,isPlaying:this.isPlaying,isPaused:this.isPaused,currentTime:this.currentTime,duration:this.duration,currentFrameIndex:this.currentFrameIndex,frameCount:this.animationLoader?.getFrameCount()||0,volume:this.audioManager?.getVolume()||0,performanceStats:{...this.performanceStats}}}getAnimationStats(){return this.animationLoader?.getAnimationStats()||null}destroy(){console.log("🧹 Destroying AudioAnimationPlayer..."),this.stop(),this.stopFrameUpdates(),this.audioManager&&this.audioManager.destroy(),this.animationLoader&&this.animationLoader.destroy(),this.onPlay=null,this.onPause=null,this.onStop=null,this.onTimeUpdate=null,this.onFrameUpdate=null,this.onEnded=null,this.onError=null,this.isInitialized=!1,console.log("✅ AudioAnimationPlayer destroyed")}}window.addEventListener("error",function(h){console.error("❌ [GLOBAL ERROR] 全局未处理错误:",h.error),console.error("❌ [GLOBAL ERROR] 错误堆栈:",h.error?.stack),console.error("❌ [GLOBAL ERROR] 文件:",h.filename),console.error("❌ [GLOBAL ERROR] 行号:",h.lineno),console.error("❌ [GLOBAL ERROR] 列号:",h.colno),console.error("❌ [GLOBAL ERROR] 完整事件:",h)});window.addEventListener("unhandledrejection",function(h){console.error("❌ [PROMISE ERROR] 未处理的Promise rejection:",h.reason),console.error("❌ [PROMISE ERROR] Promise:",h.promise),console.error("❌ [PROMISE ERROR] 完整事件:",h)});window.SparkPlyLoader=L;function Z(){return document.createElement("canvas").getContext("webgl2")?{supported:!0,message:"WebGL2 is supported"}:{supported:!1,message:"WebGL2 not supported by this browser"}}window.WasmMemoryReader=class{constructor(t){this.wasmModule=t,this.refreshHeapViews()}refreshHeapViews(){this.HEAPF32=this.wasmModule.HEAPF32,this.HEAP32=this.wasmModule.HEAP32}readFloatArray(t,e){try{const i=t>>2;return this.HEAPF32.subarray(i,i+e)}catch(i){if(i.message.includes("detached ArrayBuffer")){this.refreshHeapViews();const s=t>>2;return this.HEAPF32.subarray(s,s+e)}throw i}}readIntArray(t,e){try{const i=t>>2;return this.HEAP32.subarray(i,i+e)}catch(i){if(i.message.includes("detached ArrayBuffer")){this.refreshHeapViews();const s=t>>2;return this.HEAP32.subarray(s,s+e)}throw i}}convertSharedResult(t){const e=t.pointCount;this.refreshHeapViews();const i=this.readFloatArray(t.positionsPtr,e*3),s=this.readFloatArray(t.scalesPtr,e*3),o=this.readFloatArray(t.rotationsPtr,e*4),a=this.readFloatArray(t.colorsPtr,e*3),r=this.readFloatArray(t.opacitiesPtr,e),n=this.readIntArray(t.bindingsPtr,e);return{success:!0,data:{positions:i,scales:s,rotations:o,colors:a,opacities:r,bindings:n,pointCount:e},metadata:{totalTime:t.totalTimeMs,pointCount:e}}}};class Q{constructor(){this.system=null,this.flameManager=null,this.dataLoader=null,this.wasmModule=null,this.allData=null,this.shapeParameters=null,this.isInitialized=!1,this.animationSettings={isAnimating:!1,animationTime:0,frameCount:0,animationFrameId:null},this.audioAnimationPlayer=null,this.currentPerformanceData=null,this.fpsCounter={fps:0,frameTime:0,lastTime:0,frameCount:0,timeAccumulator:0},this.initializeUI()}async initialize(){const t=document.getElementById("webgl-canvas"),e=document.getElementById("loading-overlay"),i=document.getElementById("loading-text");if(!t)throw new Error("Canvas element not found!");window.demo=this;try{e.style.display="flex";const s=Z();if(!s.supported)throw new Error(s.message);await new Promise(l=>setTimeout(l,100)),this.resizeCanvas();const o=document.getElementById("webgl-canvas"),a=o.getBoundingClientRect();(o.width===0||o.height===0)&&(o.width=800,o.height=600),this.avatarCore=new B({logLevel:"basic",enableValidation:!0,enablePerformanceMetrics:!0,wasmPath:"/src/wasm/avatar_core_wasm.js",baseAssetsPath:"/assets",modelFolder:"3dgs4"}),await this.avatarCore.initialize(l=>{i.textContent=`${l.message} (${Math.round(l.progress)}%)`}),await this.avatarCore.loadCharacter(l=>{i.textContent=`${l.message} (${Math.round(l.progress)}%)`}),this.shapeParameters=new Array(400).fill(0),this.flameManager=this.avatarCore,i.textContent="创建WebGL 3DGS系统...",this.system=new q({canvas:t,debug:!0,backgroundColor:[1,1,1,1],enableWASM:!1,enableAutoSort:!0,enablePerformanceMonitoring:!0,targetFPS:60}),i.textContent="初始化渲染器...",await this.system.initialize(),this.system.onError=l=>{this.showError(l.message)},i.textContent="执行首次渲染...";const r=this.createAnimationParams(0),n=await this.avatarCore.computeCompleteFrame(r);if(!n||!n.points||n.points.length===0)throw new Error("首次Avatar Core计算失败");const d={success:!0,points:n.points,pointCount:n.pointCount,computeTime:n.computeTime,transformedPoints:n.points.map((l,u)=>!l||!l.position||!l.scale||!l.rotation||!l.color||l.opacity===void 0?null:{x:l.position[0]||0,y:l.position[1]||0,z:l.position[2]||0,scaleX:l.scale[0]||0,scaleY:l.scale[1]||0,scaleZ:l.scale[2]||0,rotW:l.rotation[3]||0,rotX:l.rotation[0]||0,rotY:l.rotation[1]||0,rotZ:l.rotation[2]||0,r:l.color[0]||0,g:l.color[1]||0,b:l.color[2]||0,a:l.opacity||0}).filter(l=>l!==null)};await this.updateWebGLSystem(d,!0),this.system.startRendering(),this.system.needsRender=!0,this.system.renderFrame(),this.system.currentSplats&&this.system.currentSplats.count>0&&this.adjustCameraToSplats(),await this.initializeAudioAnimationPlayer(),e.style.display="none",this.isInitialized=!0,this.animationSettings.isAnimating=!0,this.animationLoop()}catch(s){console.error("❌ 初始化失败:",s),this.showError("初始化失败: "+s.message),e.style.display="none"}}async updateWebGLSystem(t,e=!1){if(!t||!t.points||t.points.length===0)throw console.error("❌ Invalid FLAME computation result:",t),new Error("Invalid FLAME computation result");const i=t.pointCount,s=new Float32Array(i*3),o=new Float32Array(i*3),a=new Float32Array(i*4),r=new Float32Array(i*3),n=new Float32Array(i);for(let l=0;l<i;l++){const u=t.points[l],c=l*3,p=l*4;s[c]=u.position[0]||0,s[c+1]=u.position[1]||0,s[c+2]=u.position[2]||0,o[c]=u.scale[0]||1,o[c+1]=u.scale[1]||1,o[c+2]=u.scale[2]||1,a[p]=u.rotation[3]||1,a[p+1]=u.rotation[0]||0,a[p+2]=u.rotation[1]||0,a[p+3]=u.rotation[2]||0,r[c]=u.color[0]||0,r[c+1]=u.color[1]||0,r[c+2]=u.color[2]||0,n[l]=u.opacity||1}if(t={success:!0,data:{positions:s,scales:o,rotations:a,colors:r,opacities:n,pointCount:i}},t.data.positions&&t.data.pointCount)this.system.currentSplats={count:t.data.pointCount},this.system.renderer&&(e?(this.system.renderer.loadSplatsFromFlat(t.data),this.system.options.enableAutoSort&&await this.system.sortSplats()):this.system.renderer.loadSplatsFromFlat(t.data),this.system.needsRender=!0);else if(t.data.points){const l=this.convertFLAMEResultToSplats(t.data.points);this.system.currentSplats=new M,this.system.currentSplats.addBatch(l),this.system.renderer&&(e?(this.system.renderer.loadSplats(l),this.system.options.enableAutoSort&&await this.system.sortSplats()):this.updateAnimationFrame(l),this.system.needsRender=!0)}else throw new Error("Unsupported FLAME result data format");this.currentPerformanceData={totalTime:t.computeTime||0,pointCount:t.pointCount||(t.data?.points?t.data.points.length:0),fps:this.fpsCounter?.fps||0,frameTime:this.fpsCounter?.frameTime||0,frameNumber:this.animationSettings.frameCount}}updateAnimationFrame(t){const e=this.system.renderer,i=e.splatSorter,s=i.markNeedsSort;i.markNeedsSort=()=>{};try{e.updateSplatDataDirect(t)}finally{i.markNeedsSort=s}}convertFLAMEResultToSplats(t){const e=[];for(let i=0;i<t.length;i++){const s=t[i],o=new A;o.position[0]=s.position[0],o.position[1]=s.position[1],o.position[2]=s.position[2],o.color[0]=s.color[0],o.color[1]=s.color[1],o.color[2]=s.color[2],o.color[3]=s.opacity||1,o.rotation=new Float32Array(4),o.scale=new Float32Array(3),o.rotation[0]=s.rotation[0],o.rotation[1]=s.rotation[1],o.rotation[2]=s.rotation[2],o.rotation[3]=s.rotation[3],o.scale[0]=s.scale[0],o.scale[1]=s.scale[1],o.scale[2]=s.scale[2];const a=[s.rotation[1],s.rotation[2],s.rotation[3],s.rotation[0]],r=A.computeCovariance3D(s.scale,a);o.covA[0]=r[0][0],o.covA[1]=r[0][1],o.covA[2]=r[0][2],o.covB[0]=r[1][1],o.covB[1]=r[1][2],o.covB[2]=r[2][2];const n=Math.sqrt(o.rotation[0]**2+o.rotation[1]**2+o.rotation[2]**2+o.rotation[3]**2);Math.abs(n-1)>.001&&(o.rotation[0]/=n,o.rotation[1]/=n,o.rotation[2]/=n,o.rotation[3]/=n),e.push(o)}if(this.analyzeSplatData(e),e.length>0){const i=e[0];i.covA[0]*i.covB[0]-i.covA[1]*i.covA[1],i.covA[0]<=0||i.covB[0]<=0}return e}convertFLAMEResultFlatToSplats(t){const e=t.pointCount,i=new Array(e);for(let s=0;s<e;s++){const o=new A,a=s*3;o.position[0]=t.positions[a],o.position[1]=t.positions[a+1],o.position[2]=t.positions[a+2],o.color[0]=t.colors[a],o.color[1]=t.colors[a+1],o.color[2]=t.colors[a+2],o.color[3]=t.opacities[s]??1;const r=a,n=s*4,d=[t.scales[r]||1,t.scales[r+1]||1,t.scales[r+2]||1],l=[t.rotations[n+1]||0,t.rotations[n+2]||0,t.rotations[n+3]||0,t.rotations[n]||1],u=A.computeCovariance3D(d,l);o.covA[0]=u[0][0],o.covA[1]=u[0][1],o.covA[2]=u[0][2],o.covB[0]=u[1][1],o.covB[1]=u[1][2],o.covB[2]=u[2][2],i[s]=o}return i}analyzeSplatData(t){if(t.length===0)return{};const e=t.map(r=>r.position),i=t.map(r=>r.scale||[0,0,0]),s=t.map(r=>r.covA),o={count:t.length,position:{min:[Math.min(...e.map(r=>r[0])),Math.min(...e.map(r=>r[1])),Math.min(...e.map(r=>r[2]))],max:[Math.max(...e.map(r=>r[0])),Math.max(...e.map(r=>r[1])),Math.max(...e.map(r=>r[2]))],center:[e.reduce((r,n)=>r+n[0],0)/e.length,e.reduce((r,n)=>r+n[1],0)/e.length,e.reduce((r,n)=>r+n[2],0)/e.length]},scale:{min:Math.min(...i.map(r=>Math.min(...r))),max:Math.max(...i.map(r=>Math.max(...r))),avg:i.reduce((r,n)=>r+Math.max(...n),0)/i.length},covariance:{min_diag:Math.min(...s.map(r=>Math.min(r[0],r[1],r[2]))),max_diag:Math.max(...s.map(r=>Math.max(r[0],r[1],r[2]))),avg_trace:s.reduce((r,n)=>r+n[0],0)/s.length}},a=[];return o.scale.max>.1&&a.push(`Scale too large: ${o.scale.max}`),o.position.max[2]>5&&a.push(`Positions too far: ${o.position.max[2]}`),o.covariance.max_diag>1&&a.push(`Covariance too large: ${o.covariance.max_diag}`),o.potential_issues=a,o}initializeUI(){this.bindUIEvents(),window.addEventListener("resize",()=>{this.isInitialized&&this.resizeCanvas()})}bindUIEvents(){document.getElementById("generate-data-btn").addEventListener("click",()=>{this.startAnimation()}),this.bindMobileEvents()}bindMobileEvents(){const t=document.getElementById("generate-data-btn-mobile");t&&t.addEventListener("click",()=>{this.startAnimation()})}createAnimationParams(t){const i=Math.floor(t*30);if(this.allData?.idleAnimation?.length){const s=this.allData.idleAnimation.length;return{frameIndex:i%s,expression:[],pose:[0,0,0],neck:[0,0,0],jaw:[0,0,0],eyes:[0,0,0,0,0,0],translation:[0,0,0]}}else return{frameIndex:i,expression:[],pose:[0,0,0],neck:[0,0,0],jaw:[0,0,0],eyes:[0,0,0,0,0,0],translation:[0,0,0]}}hslToRgb(t,e,i){let s,o,a;if(e===0)s=o=a=i;else{const r=(l,u,c)=>(c<0&&(c+=1),c>1&&(c-=1),c<.16666666666666666?l+(u-l)*6*c:c<.5?u:c<.6666666666666666?l+(u-l)*(.6666666666666666-c)*6:l),n=i<.5?i*(1+e):i+e-i*e,d=2*i-n;s=r(d,n,t+1/3),o=r(d,n,t),a=r(d,n,t-1/3)}return[s,o,a]}async startAnimation(){if(this.isInitialized)try{await this.startAudioAnimation()}catch(t){this.showError("启动动画失败: "+t.message),this.updateButtonText()}}updateButtonText(){const t=document.getElementById("generate-data-btn"),e=document.getElementById("generate-data-btn-mobile");this.audioAnimationPlayer&&this.audioAnimationPlayer.isPlaying?(t&&(t.textContent="独白播放中...",t.disabled=!0),e&&(e.disabled=!0,e.style.opacity="0.5",e.title="独白播放中...")):(t&&(t.textContent="播放独白",t.disabled=!1),e&&(e.disabled=!1,e.style.opacity="1",e.title="播放独白"))}async animationLoop(){if(this.animationSettings.isAnimating){if(this.audioAnimationPlayer&&this.audioAnimationPlayer.isPlaying){this.animationSettings.isAnimating&&(this.animationSettings.animationFrameId=requestAnimationFrame(()=>this.animationLoop()));return}try{const t=performance.now();await this.renderDirectly();const i=performance.now()-t;this.updateFPSWithRealTime(i),this.currentPerformanceData&&(this.currentPerformanceData.realFrameTime=i,this.currentPerformanceData.fps=this.fpsCounter.fps,this.currentPerformanceData.frameTime=i,this.updatePerformanceStats(this.currentPerformanceData)),this.animationSettings.animationTime+=1/30,this.animationSettings.frameCount++,this.animationSettings.isAnimating&&(this.animationSettings.animationFrameId=requestAnimationFrame(()=>this.animationLoop()))}catch(t){console.error("❌ 动画执行错误:",t),this.animationSettings.isAnimating=!1,this.showError("动画执行错误: "+t.message)}}}updateRenderTime(t,e){this.currentPerformanceData&&this.updatePerformanceStats(this.currentPerformanceData)}async renderDirectly(){const t=this.createAnimationParams(this.animationSettings.animationTime),e=await this.avatarCore.computeCompleteFrame(t);if(e&&e.points&&e.points.length>0){e.points[0];const i={success:!0,points:e.points,pointCount:e.pointCount,computeTime:e.computeTime,transformedPoints:e.points.map(a=>!a||!a.position||!a.scale||!a.rotation||!a.color||a.opacity===void 0?null:{x:a.position[0]||0,y:a.position[1]||0,z:a.position[2]||0,scaleX:a.scale[0]||0,scaleY:a.scale[1]||0,scaleZ:a.scale[2]||0,rotW:a.rotation[3]||0,rotX:a.rotation[0]||0,rotY:a.rotation[1]||0,rotZ:a.rotation[2]||0,r:a.color[0]||0,g:a.color[1]||0,b:a.color[2]||0,a:a.opacity||0}).filter(a=>a!==null)},s=performance.now();await this.updateWebGLSystem(i),this.system.renderFrame();const o=performance.now()-s;this.updateRenderTime(i,o)}}async initializeAudioAnimationPlayer(){try{console.log("🎭 Initializing audio animation player..."),this.audioAnimationPlayer=new X({baseAssetsPath:"/assets",modelFolder:"3dgs4",audioFile:"mono.wav",animationFile:"mono.pb",fps:25}),this.audioAnimationPlayer.onFrameUpdate=t=>{this.handleAudioAnimationFrame(t)},this.audioAnimationPlayer.onPlay=()=>{console.log("🎵 Audio animation started"),this.updateButtonText()},this.audioAnimationPlayer.onStop=()=>{console.log("⏹️ Audio animation stopped"),this.updateButtonText()},this.audioAnimationPlayer.onEnded=async()=>{console.log("🎵 Audio animation ended, switching to breathing animation");try{await this.flameManager.switchAnimationFile("idle.pb"),this.animationSettings.isAnimating=!0,this.animationLoop(),this.updateButtonText()}catch(t){console.error("❌ Failed to switch back to idle animation:",t)}},this.audioAnimationPlayer.onError=t=>{console.error("❌ Audio animation error:",t),this.showError("音频动画错误: "+t.message)},await this.audioAnimationPlayer.initialize(),console.log("✅ Audio animation player initialized"),this.updateButtonText()}catch(t){console.error("❌ Failed to initialize audio animation player:",t),this.audioAnimationPlayer=null}}async handleAudioAnimationFrame(t){const{frameData:e,frameIndex:i,currentTime:s,progress:o}=t;try{const a=performance.now(),r=this.createAnimationParamsFromFrameData(e);if(r.expr_params.length>0){const d=r.expr_params.reduce((l,u)=>l+Math.abs(u),0);d>.01&&console.log(`🎯 Frame ${i}: Expression activity detected (sum=${d.toFixed(3)})`)}const n=await this.flameManager.computeCompleteFrame({frameIndex:i});if(n&&n.points&&n.points.length>0){const d={success:!0,points:n.points,pointCount:n.pointCount,computeTime:n.computeTime,transformedPoints:n.points.map(c=>!c||!c.position||!c.scale||!c.rotation||!c.color||c.opacity===void 0?null:{x:c.position[0]||0,y:c.position[1]||0,z:c.position[2]||0,scaleX:c.scale[0]||0,scaleY:c.scale[1]||0,scaleZ:c.scale[2]||0,rotW:c.rotation[3]||0,rotX:c.rotation[0]||0,rotY:c.rotation[1]||0,rotZ:c.rotation[2]||0,r:c.color[0]||0,g:c.color[1]||0,b:c.color[2]||0,a:c.opacity||0}).filter(c=>c!==null)};await this.updateWebGLSystem(d,!1),this.system.renderFrame();const u=performance.now()-a;this.updateFPSWithRealTime(u),this.currentPerformanceData={totalTime:n.computeTime||0,pointCount:n.pointCount||0,fps:this.fpsCounter.fps||0,frameTime:u,frameNumber:i},this.updatePerformanceStats(this.currentPerformanceData)}}catch(a){console.error("❌ Audio animation frame processing error:",a)}}createAnimationParamsFromFrameData(t){const e={frameIndex:t.frameIndex||0,expr_params:t.expr&&Array.isArray(t.expr)?t.expr:[],rotation:t.rotation&&Array.isArray(t.rotation)?t.rotation:[0,0,0],neck_pose:t.neck_pose&&Array.isArray(t.neck_pose)?t.neck_pose:[0,0,0],jaw_pose:t.jaw_pose&&Array.isArray(t.jaw_pose)?t.jaw_pose:[0,0,0],eyes_pose:t.eyes_pose&&Array.isArray(t.eyes_pose)?t.eyes_pose:[0,0,0,0,0,0],translation:t.translation&&Array.isArray(t.translation)?t.translation:[0,0,0],eyelid:t.eyelid&&Array.isArray(t.eyelid)?t.eyelid:[0,0]};if(e.frameIndex<10||e.frameIndex%50===0){const i=e.expr_params.reduce((o,a)=>o+Math.abs(a),0),s=e.jaw_pose.reduce((o,a)=>o+Math.abs(a),0);if(console.log(`🔍 FRAME ${e.frameIndex} ANALYSIS:`),console.log(`   - frameData.expr exists: ${!!t.expr}`),console.log(`   - frameData.expr type: ${typeof t.expr}`),console.log(`   - frameData.expr isArray: ${Array.isArray(t.expr)}`),console.log(`   - frameData.expr length: ${t.expr?t.expr.length:"N/A"}`),console.log(`   - expr_params sum: ${i.toFixed(4)}`),console.log(`   - jaw_pose sum: ${s.toFixed(4)}`),t.expr&&t.expr.length>0){const o=t.expr.filter(a=>Math.abs(a)>.001).length;console.log(`   - non-zero expression params: ${o}/${t.expr.length}`),o>0&&console.log(`   - first few non-zero expr values: ${t.expr.filter(a=>Math.abs(a)>.001).slice(0,5).map(a=>a.toFixed(4)).join(", ")}`)}console.log(`🎯 Frame ${e.frameIndex}:
                        - expr_params: ${e.expr_params.length} params, sum=${i.toFixed(3)}
                        - jaw_pose: [${e.jaw_pose.map(o=>o.toFixed(3)).join(",")}], sum=${s.toFixed(3)}
                        - neck_pose: [${e.neck_pose.map(o=>o.toFixed(3)).join(",")}]
                        - translation: [${e.translation.map(o=>o.toFixed(3)).join(",")}]`)}return e}async startAudioAnimation(){if(!this.audioAnimationPlayer){this.showError("音频动画播放器未初始化");return}try{this.animationSettings.isAnimating=!1,this.animationSettings.animationFrameId&&(cancelAnimationFrame(this.animationSettings.animationFrameId),this.animationSettings.animationFrameId=null),await this.flameManager.switchAnimationFile("mono.pb"),await this.audioAnimationPlayer.play(),console.log("🎵 Audio animation playback started")}catch(t){console.error("❌ Failed to start audio animation:",t),this.showError("音频动画播放失败: "+t.message)}}adjustCameraToSplats(){!this.system||!this.system.currentSplats||this.system.updateCamera({position:[-.02,-.013,1.5],target:[0,0,0],fov:22})}addTestSplats(){const{SplatData:t}=window;if(!t)return;const e=[];for(let i=0;i<5;i++){const s=new t;s.position=[i*.2-.4,0,-.5],s.color=[1,0,0,1],s.covA=[.1,0,0],s.covB=[.1,0,.1],e.push(s)}this.system.currentSplats.addBatch(e),this.system.renderer.loadSplats(this.system.currentSplats.toArray()),this.system.needsRender=!0}resizeCanvas(){const t=document.getElementById("webgl-canvas"),e=t.getBoundingClientRect();t.width=e.width*window.devicePixelRatio,t.height=e.height*window.devicePixelRatio,this.system&&this.system.renderer&&(this.system.renderer.gl.viewport(0,0,t.width,t.height),this.system.updateCameraAspect(),typeof this.system.handleResize=="function"&&this.system.handleResize(),this.system.needsRender=!0)}updateFPSWithRealTime(t){this.fpsCounter.frameTime=t,this.fpsCounter.frameCount++,this.fpsCounter.timeAccumulator+=t,this.fpsCounter.timeAccumulator>=500&&(this.fpsCounter.fps=this.fpsCounter.frameCount*1e3/this.fpsCounter.timeAccumulator,this.fpsCounter.frameCount=0,this.fpsCounter.timeAccumulator=0)}updateFPS(){const t=performance.now();if(this.fpsCounter.lastTime===0){this.fpsCounter.lastTime=t;return}t-this.fpsCounter.lastTime,this.fpsCounter.lastTime=t}updatePerformanceStats(t){const e=(i,s)=>{const o=document.getElementById(i);o&&(o.textContent=s)};if(e("fps-display",t.fps!==void 0?`FPS: ${t.fps.toFixed(1)}`:"FPS: --"),e("flame-compute-time",t.totalTime?`FLAME: ${t.totalTime.toFixed(2)} ms`:"FLAME: -- ms"),t.pointCount&&e("render-info",`点云: ${t.pointCount} | 状态: 正在渲染`),this.system&&this.system.camera){const i=this.system.camera;e("camera-info",`相机: FOV ${i.fov}° | 距离 ${i.position[2].toFixed(2)}`)}}showError(t){const e=document.getElementById("error-display");e.textContent=t,e.style.display="block",setTimeout(()=>{e.style.display="none"},5e3)}dispose(){this.animationSettings.isAnimating=!1,this.animationSettings.animationFrameId&&cancelAnimationFrame(this.animationSettings.animationFrameId),this.system&&(this.system.dispose(),this.system=null),this.flameManager&&(this.flameManager=null),this.allData=null,console.log("🧹 Demo resources cleaned up")}}const P=new Q;window.addEventListener("load",()=>{P.initialize()});window.addEventListener("beforeunload",()=>{P.dispose()});window.webglDemo=P;
