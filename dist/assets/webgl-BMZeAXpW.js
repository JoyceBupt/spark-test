const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/flame_compute_frame_wasm-5Z0ve_fG.js","assets/binaryPlyLoader-XfY_fKVH.js","assets/babylonjs-BIcxYk3o.js","assets/protobuf-B46OxRQv.js"])))=>i.map(i=>d[i]);
import{_ as F,l as I,S as T,F as z,a as L}from"./binaryPlyLoader-XfY_fKVH.js";import"./babylonjs-BIcxYk3o.js";import"./protobuf-B46OxRQv.js";const U=`#version 300 es
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
`,k=`#version 300 es
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
`;function W(l){const t=l.createShader(l.VERTEX_SHADER);if(l.shaderSource(t,U),l.compileShader(t),!l.getShaderParameter(t,l.COMPILE_STATUS))throw new Error("顶点着色器编译失败: "+l.getShaderInfoLog(t));const e=l.createShader(l.FRAGMENT_SHADER);if(l.shaderSource(e,k),l.compileShader(e),!l.getShaderParameter(e,l.COMPILE_STATUS))throw new Error("片段着色器编译失败: "+l.getShaderInfoLog(e));const r=l.createProgram();if(l.attachShader(r,t),l.attachShader(r,e),l.linkProgram(r),!l.getProgramParameter(r,l.LINK_STATUS))throw new Error("着色器程序链接失败: "+l.getProgramInfoLog(r));return l.deleteShader(t),l.deleteShader(e),r}const V=`#version 300 es
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
`,N=`#version 300 es
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
`;function j(l){const t=l.createShader(l.VERTEX_SHADER);if(l.shaderSource(t,V),l.compileShader(t),!l.getShaderParameter(t,l.COMPILE_STATUS))throw new Error("实例化顶点着色器编译失败: "+l.getShaderInfoLog(t));const e=l.createShader(l.FRAGMENT_SHADER);if(l.shaderSource(e,N),l.compileShader(e),!l.getShaderParameter(e,l.COMPILE_STATUS))throw new Error("实例化片段着色器编译失败: "+l.getShaderInfoLog(e));const r=l.createProgram();if(l.attachShader(r,t),l.attachShader(r,e),l.linkProgram(r),!l.getProgramParameter(r,l.LINK_STATUS))throw new Error("实例化着色器程序链接失败: "+l.getProgramInfoLog(r));return l.deleteShader(t),l.deleteShader(e),r}class Y{constructor(t={}){this.options={batchSize:1e4,sortThreshold:.01,maxWorkers:4,sortStrategy:"distance",debug:!1,...t},this.workerSafeMaxCount=5e4,this.workers=[],this.availableWorkers=[],this.workerQueue=[],this.lastCameraPosition=[0,0,0],this.lastCameraForward=[0,0,-1],this.needsSort=!0,this.sorting=!1,this.sortProgress=0,this.sortStats={totalSorts:0,avgSortTime:0,lastSortTime:0,skippedSorts:0},this.onSortComplete=null,this.onSortProgress=null}async initialize(){await this.createWorkerPool()}async createWorkerPool(){const t=this.createWorkerCode(),e=new Blob([t],{type:"application/javascript"}),r=URL.createObjectURL(e);try{for(let a=0;a<this.options.maxWorkers;a++){const o=new Worker(r);o.onmessage=this.handleWorkerMessage.bind(this),o.onerror=this.handleWorkerError.bind(this),this.workers.push(o),this.availableWorkers.push(o)}}catch{}URL.revokeObjectURL(r)}createWorkerCode(){return`
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
        `}handleWorkerMessage(t){const{type:e,sortId:r,result:a,progress:o,error:i}=t.data,s=t.target;switch(e){case"complete":this.handleSortComplete(s,r,a);break;case"progress":this.handleSortProgress(r,o);break;case"error":this.handleSortError(s,r,i);break}}handleWorkerError(t){const e=t.target;this.availableWorkers.includes(e)||this.availableWorkers.push(e),this.processWorkerQueue()}async sortSplats(t,e,r=[0,0,-1]){if(!this.shouldSort(e,r))return this.sortStats.skippedSorts++,null;if(this.sorting)return null;const a=performance.now();this.sorting=!0,this.sortProgress=0;try{let o;Array.isArray(t)&&t.length>this.workerSafeMaxCount?o=this.sortOnMainThread(t,e,r):this.availableWorkers.length>0?o=await this.sortWithWorker(t,e,r):o=this.sortOnMainThread(t,e,r);const i=performance.now()-a;return this.updateSortStats(i),this.lastCameraPosition=[...e],this.lastCameraForward=[...r],this.needsSort=!1,this.onSortComplete&&this.onSortComplete(o),o}finally{this.sorting=!1}}serializeSplatsOptimized(t){const e=t.length,r=new Float32Array(e*3),a=new Float32Array(e*4),o=new Float32Array(e*3),i=new Float32Array(e*3);for(let s=0;s<e;s++){const n=t[s],c=s*3,h=s*4;r[c]=n.position[0],r[c+1]=n.position[1],r[c+2]=n.position[2],a[h]=n.color[0],a[h+1]=n.color[1],a[h+2]=n.color[2],a[h+3]=n.color[3],o[c]=n.covA[0],o[c+1]=n.covA[1],o[c+2]=n.covA[2],i[c]=n.covB[0],i[c+1]=n.covB[1],i[c+2]=n.covB[2]}return{count:e,positions:r.buffer,colors:a.buffer,covAs:o.buffer,covBs:i.buffer}}sortWithWorker(t,e,r){return new Promise((a,o)=>{const i=this.availableWorkers.pop(),s=Date.now()+Math.random(),n=setTimeout(()=>{o(new Error("Sort timeout"))},3e4);i._currentResolve=a,i._currentReject=o,i._currentTimeout=n,i._currentSortId=s;const c=this.serializeSplatsOptimized(t);i.postMessage({type:"sort",sortId:s,splatData:c,cameraPosition:e,cameraForward:r,sortStrategy:this.options.sortStrategy,batchSize:this.options.batchSize},[c.positions,c.colors,c.covAs,c.covBs])})}handleSortComplete(t,e,r){t._currentSortId===e&&(clearTimeout(t._currentTimeout),t._currentResolve(r),delete t._currentResolve,delete t._currentReject,delete t._currentTimeout,delete t._currentSortId),this.availableWorkers.push(t),this.processWorkerQueue()}handleSortProgress(t,e){this.sortProgress=e,this.onSortProgress&&this.onSortProgress(e)}handleSortError(t,e,r){t._currentSortId===e&&(clearTimeout(t._currentTimeout),t._currentReject(new Error(r)),delete t._currentResolve,delete t._currentReject,delete t._currentTimeout,delete t._currentSortId),this.availableWorkers.push(t),this.processWorkerQueue()}processWorkerQueue(){this.workerQueue.length>0&&this.availableWorkers.length>0&&this.workerQueue.shift()()}sortOnMainThread(t,e,r){const a=performance.now(),o=[];for(let s=0;s<t.length;s++){const n=t[s];let c;if(this.options.sortStrategy==="distance")c=n.getDistanceToCamera(e);else{const h=n.position;c=(h[0]-e[0])*r[0]+(h[1]-e[1])*r[1]+(h[2]-e[2])*r[2]}o.push({index:s,depth:c})}o.sort((s,n)=>n.depth-s.depth);const i=performance.now()-a;return{indexAndDepth:o,sortTime:i,splatCount:t.length}}shouldSort(t,e){if(this.needsSort)return!0;const r=Math.sqrt(Math.pow(t[0]-this.lastCameraPosition[0],2)+Math.pow(t[1]-this.lastCameraPosition[1],2)+Math.pow(t[2]-this.lastCameraPosition[2],2)),a=e[0]*this.lastCameraForward[0]+e[1]*this.lastCameraForward[1]+e[2]*this.lastCameraForward[2],o=1-Math.abs(a);return r>this.options.sortThreshold||o>this.options.sortThreshold}markNeedsSort(){this.needsSort=!0}updateSortStats(t){this.sortStats.totalSorts++,this.sortStats.lastSortTime=t;const e=.1;this.sortStats.avgSortTime=this.sortStats.avgSortTime*(1-e)+t*e}getSortStats(){return{...this.sortStats}}onComplete(t){this.onSortComplete=t}onProgress(t){this.onSortProgress=t}dispose(){for(const t of this.workers)t.terminate();this.workers=[],this.availableWorkers=[],this.workerQueue=[]}}class S{constructor(){this.position=new Float32Array(3),this.color=new Float32Array(4),this.covA=new Float32Array(3),this.covB=new Float32Array(3)}static fromPLY(t){const e=new S;e.position[0]=t.x||0,e.position[1]=t.y||0,e.position[2]=t.z||0,e.color[0]=(t.red||0)/255,e.color[1]=(t.green||0)/255,e.color[2]=(t.blue||0)/255,e.color[3]=t.opacity||1;const r=[t.scale_0||1,t.scale_1||1,t.scale_2||1],a=[t.rot_0||0,t.rot_1||0,t.rot_2||0,t.rot_3||1],o=S.computeCovariance3D(r,a);return e.covA[0]=o[0][0],e.covA[1]=o[0][1],e.covA[2]=o[0][2],e.covB[0]=o[1][1],e.covB[1]=o[1][2],e.covB[2]=o[2][2],e}static computeCovariance3D(t,e){const r=e[3],a=e[0],o=e[1],i=e[2],s=Math.sqrt(r*r+a*a+o*o+i*i),n=r/s,c=a/s,h=o/s,d=i/s,u=[[1-2*(h*h+d*d),2*(c*h-d*n),2*(c*d+h*n)],[2*(c*h+d*n),1-2*(c*c+d*d),2*(h*d-c*n)],[2*(c*d-h*n),2*(h*d+c*n),1-2*(c*c+h*h)]],p=[[t[0],0,0],[0,t[1],0],[0,0,t[2]]],m=S.multiplyMatrices(u,p),f=S.multiplyMatrices(m,S.transpose(p));return S.multiplyMatrices(f,S.transpose(u))}static multiplyMatrices(t,e){const r=[[0,0,0],[0,0,0],[0,0,0]];for(let a=0;a<3;a++)for(let o=0;o<3;o++)r[a][o]=t[a][0]*e[0][o]+t[a][1]*e[1][o]+t[a][2]*e[2][o];return r}static transpose(t){return[[t[0][0],t[1][0],t[2][0]],[t[0][1],t[1][1],t[2][1]],[t[0][2],t[1][2],t[2][2]]]}static fromWASM(t){const e=new S;return e.position.set(t.position),e.color.set(t.color),e.covA.set(t.covA),e.covB.set(t.covB),e}toObject(){return{position:Array.from(this.position),color:Array.from(this.color),covA:Array.from(this.covA),covB:Array.from(this.covB)}}static fromObject(t){const e=new S;return e.position.set(t.position),e.color.set(t.color),e.covA.set(t.covA),e.covB.set(t.covB),e}clone(){const t=new S;return t.position.set(this.position),t.color.set(this.color),t.covA.set(this.covA),t.covB.set(this.covB),t}getDepthInCameraSpace(t){const e=this.position;return t[2]*e[0]+t[6]*e[1]+t[10]*e[2]+t[14]}getDistanceToCamera(t){const e=this.position[0]-t[0],r=this.position[1]-t[1],a=this.position[2]-t[2];return Math.sqrt(e*e+r*r+a*a)}isInFrustum(t,e=1.2){const r=this.position,a=t[0]*r[0]+t[4]*r[1]+t[8]*r[2]+t[12],o=t[1]*r[0]+t[5]*r[1]+t[9]*r[2]+t[13],i=t[2]*r[0]+t[6]*r[1]+t[10]*r[2]+t[14],s=t[3]*r[0]+t[7]*r[1]+t[11]*r[2]+t[15],n=e*s;return i>=0&&i<=s&&a>=-n&&a<=n&&o>=-n&&o<=n}}class M{constructor(){this.splats=[],this.isDirty=!0}add(t){this.splats.push(t),this.isDirty=!0}addBatch(t){this.splats.push(...t),this.isDirty=!0}clear(){this.splats=[],this.isDirty=!0}get count(){return this.splats.length}sortByDistance(t){this.splats.sort((e,r)=>{const a=e.getDistanceToCamera(t);return r.getDistanceToCamera(t)-a}),this.isDirty=!0}sortByDepth(t){this.splats.sort((e,r)=>{const a=e.getDepthInCameraSpace(t);return r.getDepthInCameraSpace(t)-a}),this.isDirty=!0}cullByFrustum(t){return this.splats.filter(e=>e.isInFrustum(t))}getBoundingBox(){if(this.splats.length===0)return{min:[0,0,0],max:[0,0,0]};const t=[1/0,1/0,1/0],e=[-1/0,-1/0,-1/0];for(const r of this.splats){const a=r.position;t[0]=Math.min(t[0],a[0]),t[1]=Math.min(t[1],a[1]),t[2]=Math.min(t[2],a[2]),e[0]=Math.max(e[0],a[0]),e[1]=Math.max(e[1],a[1]),e[2]=Math.max(e[2],a[2])}return{min:t,max:e}}toArray(){return this.splats.map(t=>t.toObject())}fromArray(t){this.splats=t.map(e=>S.fromObject(e)),this.isDirty=!0}markClean(){this.isDirty=!1}get dirty(){return this.isDirty}}class O{constructor(t={}){this.options={canvas:null,debug:!1,backgroundColor:[1,1,1,1],enableDepthTest:!0,maxIndexedSplatCount:1024,enableFrustumCulling:!0,...t},this.gl=null,this.shaderProgram=null,this.instancedShaderProgram=null,this.uniformLocations={},this.attributeLocations={},this.instancedUniformLocations={},this.instancedAttributeLocations={},this.splatBuffer=null,this.splatBufferPrime=null,this.indexBuffer=null,this.vertexArray=null,this.instancedSplatBuffer=null,this.quadVertexBuffer=null,this.instancedVertexArray=null,this.splatCount=0,this.isInitialized=!1,this.needsSort=!0,this.sorting=!1,this.hasLoggedValidation=!1,this.originalSplats=[],this.cameraWorldPosition=[0,0,0],this.cameraWorldForward=[0,0,-1],this.splatSorter=new Y({debug:this.options.debug,sortThreshold:.01,maxWorkers:2}),this.renderStats={drawCalls:0,splatCount:0,frameTime:0},this.usingFlat=!1,this.flatData=null,this.lastOrderArray=null}async initialize(){try{const t=this.options.canvas;if(!t)throw new Error("Canvas element is required");if(this.gl=t.getContext("webgl2",{antialias:!1,alpha:!1,premultipliedAlpha:!0,powerPreference:"high-performance",preserveDrawingBuffer:!1}),!this.gl)throw new Error("WebGL2 not supported");const e=this.gl;return this.checkRequiredExtensions(),this.shaderProgram=W(e),this.instancedShaderProgram=j(e),this.setupShaderLocations(),this.setupWebGLState(),this.createBuffers(),await this.splatSorter.initialize(),this.isInitialized=!0,!0}catch(t){throw t}}checkRequiredExtensions(){const t=this.gl;t.getExtension("EXT_color_buffer_float"),t.getExtension("EXT_sRGB")?this.sRGBSupported=!0:this.sRGBSupported=!1}setupShaderLocations(){const t=this.gl,e=this.shaderProgram;this.uniformLocations={viewMatrix:t.getUniformLocation(e,"u_viewMatrix"),projectionMatrix:t.getUniformLocation(e,"u_projectionMatrix"),screenSize:t.getUniformLocation(e,"u_screenSize"),boundsRadius:t.getUniformLocation(e,"u_boundsRadius"),enableFrustumCulling:t.getUniformLocation(e,"u_enableFrustumCulling")},this.attributeLocations={position:0,color:1,covA:2,covB:3,vertexId:4};const r=this.instancedShaderProgram;this.instancedUniformLocations={viewMatrix:t.getUniformLocation(r,"u_viewMatrix"),projectionMatrix:t.getUniformLocation(r,"u_projectionMatrix"),screenSize:t.getUniformLocation(r,"u_screenSize"),enableFrustumCulling:t.getUniformLocation(r,"u_enableFrustumCulling")},this.instancedAttributeLocations={quadVertex:0,position:1,color:2,covA:3,covB:4}}setupWebGLState(){const t=this.gl;t.disable(t.DEPTH_TEST),t.depthMask(!0),t.enable(t.BLEND),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA);const e=this.options.backgroundColor;t.clearColor(e[0],e[1],e[2],e[3])}createBuffers(){const t=this.gl;this.vertexArray=t.createVertexArray(),this.splatBuffer=t.createBuffer(),this.splatBufferPrime=t.createBuffer(),this.createIndexBuffer(),this.instancedVertexArray=t.createVertexArray(),this.instancedSplatBuffer=t.createBuffer(),this.createQuadVertexBuffer()}createIndexBuffer(){const t=this.gl,e=this.options.maxIndexedSplatCount,r=new Uint32Array(e*6);for(let a=0;a<e;a++){const o=a*4,i=a*6;r[i+0]=o+0,r[i+1]=o+1,r[i+2]=o+2,r[i+3]=o+1,r[i+4]=o+3,r[i+5]=o+2}this.indexBuffer=t.createBuffer(),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.indexBuffer),t.bufferData(t.ELEMENT_ARRAY_BUFFER,r,t.STATIC_DRAW)}createQuadVertexBuffer(){const t=this.gl,e=new Float32Array([-1,-1,-1,1,1,-1,1,1]);this.quadVertexBuffer=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.quadVertexBuffer),t.bufferData(t.ARRAY_BUFFER,e,t.STATIC_DRAW)}loadSplats(t){if(!this.isInitialized)throw new Error("Renderer not initialized");const e=this.gl;this.splatCount=t.length,this.originalSplats=[...t],this.usingFlat=!1,this.flatData=null;const r=Math.min(t.length,this.options.maxIndexedSplatCount),a=t.slice(0,r),o=t.slice(r),i=this.packSplatData(a);e.bindBuffer(e.ARRAY_BUFFER,this.splatBuffer),e.bufferData(e.ARRAY_BUFFER,i,e.DYNAMIC_DRAW),e.bindBuffer(e.ARRAY_BUFFER,this.splatBufferPrime),e.bufferData(e.ARRAY_BUFFER,i,e.DYNAMIC_DRAW);const s=o.length>0?this.packInstancedSplatData(o):new Float32Array(0);e.bindBuffer(e.ARRAY_BUFFER,this.instancedSplatBuffer),e.bufferData(e.ARRAY_BUFFER,s,e.DYNAMIC_DRAW),this.needsSort=!0,this.splatSorter&&this.splatSorter.markNeedsSort(),this.options.debug&&!this.hasLoggedValidation&&(this.validateSplatDataSilent(t),this.hasLoggedValidation=!0)}loadSplatsFromFlat(t){if(!this.isInitialized)throw new Error("Renderer not initialized");const e=t.pointCount;this.splatCount=e,this.usingFlat=!0,this.flatData=t;const r=this.lastOrderArray&&this.lastOrderArray.length===e?this.lastOrderArray:null;this.packFlatToBuffers(t,r),this.needsSort=!0,this.splatSorter&&this.splatSorter.markNeedsSort()}packFlatToBuffers(t,e){const r=this.gl,a=t.pointCount,o=e||null,s=Math.min(a,this.options.maxIndexedSplatCount),n=Math.max(0,a-s),c=14,h=4,d=new Float32Array(s*h*c);let u=0;for(let f=0;f<s;f++){const y=o?o[f]:f,v=y*3,A=y*4,w=[t.scales[v]||1,t.scales[v+1]||1,t.scales[v+2]||1],b=[t.rotations[A+1]||0,t.rotations[A+2]||0,t.rotations[A+3]||0,t.rotations[A]||1],g=S.computeCovariance3D(w,b);for(let x=0;x<4;x++)d[u++]=t.positions[v],d[u++]=t.positions[v+1],d[u++]=t.positions[v+2],d[u++]=t.colors[v],d[u++]=t.colors[v+1],d[u++]=t.colors[v+2],d[u++]=t.opacities[y]??1,d[u++]=g[0][0],d[u++]=g[0][1],d[u++]=g[0][2],d[u++]=g[1][1],d[u++]=g[1][2],d[u++]=g[2][2],d[u++]=x}r.bindBuffer(r.ARRAY_BUFFER,this.splatBuffer),r.bufferData(r.ARRAY_BUFFER,d,r.DYNAMIC_DRAW),r.bindBuffer(r.ARRAY_BUFFER,this.splatBufferPrime),r.bufferData(r.ARRAY_BUFFER,d,r.DYNAMIC_DRAW);const p=13,m=new Float32Array(n*p);u=0;for(let f=0;f<n;f++){const y=o?o[s+f]:s+f,v=y*3,A=y*4,w=[t.scales[v]||1,t.scales[v+1]||1,t.scales[v+2]||1],b=[t.rotations[A+1]||0,t.rotations[A+2]||0,t.rotations[A+3]||0,t.rotations[A]||1],g=S.computeCovariance3D(w,b);m[u++]=t.positions[v],m[u++]=t.positions[v+1],m[u++]=t.positions[v+2],m[u++]=t.colors[v],m[u++]=t.colors[v+1],m[u++]=t.colors[v+2],m[u++]=t.opacities[y]??1,m[u++]=g[0][0],m[u++]=g[0][1],m[u++]=g[0][2],m[u++]=g[1][1],m[u++]=g[1][2],m[u++]=g[2][2]}r.bindBuffer(r.ARRAY_BUFFER,this.instancedSplatBuffer),r.bufferData(r.ARRAY_BUFFER,m,r.DYNAMIC_DRAW)}sortFlatData(){if(!this.flatData)return null;const t=this.flatData.pointCount,e=new Array(t),r=new Float32Array(t),a=this.cameraWorldPosition,o=this.cameraWorldForward;for(let i=0;i<t;i++){e[i]=i;const s=i*3,n=this.flatData.positions[s]-a[0],c=this.flatData.positions[s+1]-a[1],h=this.flatData.positions[s+2]-a[2];r[i]=n*o[0]+c*o[1]+h*o[2]}return e.sort((i,s)=>r[s]-r[i]),this.packFlatToBuffers(this.flatData,e),this.lastSortedIndexes=e.map(i=>({index:i,depth:r[i]})),this.lastOrderArray=Int32Array.from(e),this.lastSortedIndexes}updateSplatDataDirect(t){if(!this.isInitialized)throw new Error("Renderer not initialized");const e=this.gl;if(this.splatCount=t.length,this.originalSplats=[...t],this.lastSortedIndexes&&this.lastSortedIndexes.length===t.length){const r=this.lastSortedIndexes.map(c=>t[c.index]),a=Math.min(r.length,this.options.maxIndexedSplatCount),o=r.slice(0,a),i=r.slice(a),s=this.packSplatData(o),n=i.length>0?this.packInstancedSplatData(i):new Float32Array(0);e.bindBuffer(e.ARRAY_BUFFER,this.splatBuffer),e.bufferData(e.ARRAY_BUFFER,s,e.DYNAMIC_DRAW),e.bindBuffer(e.ARRAY_BUFFER,this.splatBufferPrime),e.bufferData(e.ARRAY_BUFFER,s,e.DYNAMIC_DRAW),e.bindBuffer(e.ARRAY_BUFFER,this.instancedSplatBuffer),e.bufferData(e.ARRAY_BUFFER,n,e.DYNAMIC_DRAW)}else this.loadSplats(t)}packSplatData(t){const a=new Float32Array(t.length*4*14);let o=0;for(let i=0;i<t.length;i++){const s=t[i];for(let n=0;n<4;n++)a[o++]=s.position[0],a[o++]=s.position[1],a[o++]=s.position[2],a[o++]=s.color[0],a[o++]=s.color[1],a[o++]=s.color[2],a[o++]=s.color[3],a[o++]=s.covA[0],a[o++]=s.covA[1],a[o++]=s.covA[2],a[o++]=s.covB[0],a[o++]=s.covB[1],a[o++]=s.covB[2],a[o++]=n}return a}packInstancedSplatData(t){const r=new Float32Array(t.length*13);let a=0;for(let o=0;o<t.length;o++){const i=t[o];r[a++]=i.position[0],r[a++]=i.position[1],r[a++]=i.position[2],r[a++]=i.color[0],r[a++]=i.color[1],r[a++]=i.color[2],r[a++]=i.color[3],r[a++]=i.covA[0],r[a++]=i.covA[1],r[a++]=i.covA[2],r[a++]=i.covB[0],r[a++]=i.covB[1],r[a++]=i.covB[2]}return r}setupVertexAttributes(){const t=this.gl,e=14,r=4,a=e*r;t.bindVertexArray(this.vertexArray),t.bindBuffer(t.ARRAY_BUFFER,this.splatBuffer),t.enableVertexAttribArray(this.attributeLocations.position),t.vertexAttribPointer(this.attributeLocations.position,3,t.FLOAT,!1,a,0),t.enableVertexAttribArray(this.attributeLocations.color),t.vertexAttribPointer(this.attributeLocations.color,4,t.FLOAT,!1,a,3*r),t.enableVertexAttribArray(this.attributeLocations.covA),t.vertexAttribPointer(this.attributeLocations.covA,3,t.FLOAT,!1,a,7*r),t.enableVertexAttribArray(this.attributeLocations.covB),t.vertexAttribPointer(this.attributeLocations.covB,3,t.FLOAT,!1,a,10*r),t.enableVertexAttribArray(this.attributeLocations.vertexId),t.vertexAttribPointer(this.attributeLocations.vertexId,1,t.FLOAT,!1,a,13*r),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.indexBuffer)}setupInstancedVertexAttributes(){const t=this.gl;t.bindVertexArray(this.instancedVertexArray),t.bindBuffer(t.ARRAY_BUFFER,this.quadVertexBuffer),t.enableVertexAttribArray(this.instancedAttributeLocations.quadVertex),t.vertexAttribPointer(this.instancedAttributeLocations.quadVertex,2,t.FLOAT,!1,0,0),t.bindBuffer(t.ARRAY_BUFFER,this.instancedSplatBuffer);const e=13,r=4,a=e*r;t.enableVertexAttribArray(this.instancedAttributeLocations.position),t.vertexAttribPointer(this.instancedAttributeLocations.position,3,t.FLOAT,!1,a,0),t.vertexAttribDivisor(this.instancedAttributeLocations.position,1),t.enableVertexAttribArray(this.instancedAttributeLocations.color),t.vertexAttribPointer(this.instancedAttributeLocations.color,4,t.FLOAT,!1,a,3*r),t.vertexAttribDivisor(this.instancedAttributeLocations.color,1),t.enableVertexAttribArray(this.instancedAttributeLocations.covA),t.vertexAttribPointer(this.instancedAttributeLocations.covA,3,t.FLOAT,!1,a,7*r),t.vertexAttribDivisor(this.instancedAttributeLocations.covA,1),t.enableVertexAttribArray(this.instancedAttributeLocations.covB),t.vertexAttribPointer(this.instancedAttributeLocations.covB,3,t.FLOAT,!1,a,10*r),t.vertexAttribDivisor(this.instancedAttributeLocations.covB,1)}render(t,e,r){if(!this.isInitialized||this.splatCount===0)return;const a=performance.now(),o=this.gl;this.currentViewMatrix=t,this.currentProjectionMatrix=e,this.currentScreenSize=r,o.viewport(0,0,r[0],r[1]);const i=this.options.backgroundColor;o.clearColor(i[0],i[1],i[2],i[3]),o.clear(o.COLOR_BUFFER_BIT|o.DEPTH_BUFFER_BIT),this.options.debug&&this.validateRenderState(),this.renderWithMixedStrategy(),o.getError(),this.renderStats.frameTime=performance.now()-a,this.renderStats.splatCount=this.splatCount}renderWithMixedStrategy(){const t=this.gl,e=Math.min(this.splatCount,this.options.maxIndexedSplatCount),r=Math.max(0,this.splatCount-e);if(this.renderStats.drawCalls=0,e>0){t.useProgram(this.shaderProgram),t.uniformMatrix4fv(this.uniformLocations.viewMatrix,!1,this.currentViewMatrix),t.uniformMatrix4fv(this.uniformLocations.projectionMatrix,!1,this.currentProjectionMatrix),t.uniform2fv(this.uniformLocations.screenSize,this.currentScreenSize),t.uniform1f(this.uniformLocations.boundsRadius,3),t.uniform1i(this.uniformLocations.enableFrustumCulling,this.options.enableFrustumCulling?1:0),this.setupVertexAttributes();const a=e*6;t.drawElements(t.TRIANGLES,a,t.UNSIGNED_INT,0),this.renderStats.drawCalls++}r>0&&(t.useProgram(this.instancedShaderProgram),t.uniformMatrix4fv(this.instancedUniformLocations.viewMatrix,!1,this.currentViewMatrix),t.uniformMatrix4fv(this.instancedUniformLocations.projectionMatrix,!1,this.currentProjectionMatrix),t.uniform2fv(this.instancedUniformLocations.screenSize,this.currentScreenSize),t.uniform1i(this.instancedUniformLocations.enableFrustumCulling,this.options.enableFrustumCulling?1:0),this.setupInstancedVertexAttributes(),t.drawArraysInstanced(t.TRIANGLE_STRIP,0,4,r),this.renderStats.drawCalls++)}updateCamera(t,e=[0,0,-1]){this.cameraWorldPosition=[...t],this.cameraWorldForward=[...e]}async sortSplats(t){if(this.usingFlat&&this.flatData)return{indexAndDepth:this.sortFlatData(),sortTime:0,splatCount:this.splatCount};const e=this.originalSplats.length>0?this.originalSplats:t,r=await this.splatSorter.sortSplats(e,this.cameraWorldPosition,this.cameraWorldForward);return r&&r.indexAndDepth&&this.applySortResult(e,r.indexAndDepth),r}applySortResult(t,e){const r=this.gl;this.lastSortedIndexes=e;const a=e.map(h=>t[h.index]),o=Math.min(a.length,this.options.maxIndexedSplatCount),i=a.slice(0,o),s=a.slice(o),n=this.packSplatData(i),c=s.length>0?this.packInstancedSplatData(s):new Float32Array(0);r.bindBuffer(r.ARRAY_BUFFER,this.splatBuffer),r.bufferData(r.ARRAY_BUFFER,n,r.DYNAMIC_DRAW),r.bindBuffer(r.ARRAY_BUFFER,this.splatBufferPrime),r.bufferData(r.ARRAY_BUFFER,n,r.DYNAMIC_DRAW),r.bindBuffer(r.ARRAY_BUFFER,this.instancedSplatBuffer),r.bufferData(r.ARRAY_BUFFER,c,r.DYNAMIC_DRAW)}dispose(){if(!this.gl)return;const t=this.gl;this.splatBuffer&&t.deleteBuffer(this.splatBuffer),this.splatBufferPrime&&t.deleteBuffer(this.splatBufferPrime),this.indexBuffer&&t.deleteBuffer(this.indexBuffer),this.vertexArray&&t.deleteVertexArray(this.vertexArray),this.instancedSplatBuffer&&t.deleteBuffer(this.instancedSplatBuffer),this.quadVertexBuffer&&t.deleteBuffer(this.quadVertexBuffer),this.instancedVertexArray&&t.deleteVertexArray(this.instancedVertexArray),this.shaderProgram&&t.deleteProgram(this.shaderProgram),this.instancedShaderProgram&&t.deleteProgram(this.instancedShaderProgram),this.splatSorter&&this.splatSorter.dispose(),this.isInitialized=!1}calculateSplatBounds(t){if(t.length===0)return null;let e=1/0,r=-1/0,a=1/0,o=-1/0,i=1/0,s=-1/0;for(const m of t){const f=m.position;e=Math.min(e,f[0]),r=Math.max(r,f[0]),a=Math.min(a,f[1]),o=Math.max(o,f[1]),i=Math.min(i,f[2]),s=Math.max(s,f[2])}const n=[(e+r)/2,(a+o)/2,(i+s)/2],c=[r-e,o-a,s-i],h=Math.max(...c);let d=1/0,u=-1/0,p=[];for(let m=0;m<Math.min(t.length,10);m++){const f=t[m];d=Math.min(d,f.color[3]),u=Math.max(u,f.color[3]),p.push([...f.color])}return{min:[e,a,i],max:[r,o,s],center:n,size:c,maxDimension:h,alphaRange:[d,u],sampleColors:p}}validateSplatDataSilent(t){if(t.length===0)return;const e=t[0];e.covA&&e.covB&&(e.covA[0],e.covA[1],e.covA[2],e.covA[1],e.covB[0],e.covB[1],e.covA[2],e.covB[1],e.covB[2]);for(let r=0;r<Math.min(t.length,3);r++)this.validateSingleSplat(t[r],r)}validateSingleSplat(t,e){return!(!t.position||t.position.length<3||t.position.some(r=>!isFinite(r))||!t.color||t.color.length<4||t.color.some(r=>r<0||r>1||!isFinite(r)))}debugRenderState(t,e,r,a){}validateRenderState(){const t=this.gl;this.splatCount,t.isBuffer(this.splatBuffer),t.isBuffer(this.instancedSplatBuffer),t.isProgram(this.shaderProgram),t.isProgram(this.instancedShaderProgram),t.isEnabled(t.DEPTH_TEST),t.isEnabled(t.BLEND);const e=t.getParameter(t.BLEND_SRC_ALPHA),r=t.getParameter(t.BLEND_DST_ALPHA);e!==t.SRC_ALPHA||t.ONE_MINUS_SRC_ALPHA,!this.cameraWorldPosition||this.cameraWorldPosition.length,!this.currentViewMatrix||this.currentViewMatrix.length,!this.currentProjectionMatrix||this.currentProjectionMatrix.length}getRenderStats(){return{...this.renderStats}}}class q{constructor(t={}){this.options={debug:!1,enableCaching:!0,batchSize:1e3,...t},this.wasmModule=null,this.flameManager=null,this.isInitialized=!1,this.splatCollection=new M,this.lastFrameData=null,this.lastSplatCount=0,this.computeStats={totalFrames:0,avgComputeTime:0,lastComputeTime:0,wasmCallCount:0}}async initialize(t,e){try{return this.wasmModule=await t,this.flameManager=new e({logLevel:this.options.debug?"verbose":"basic",enableValidation:this.options.debug,enablePerformanceMetrics:!0}),await this.flameManager.initialize(this.wasmModule),this.isInitialized=!0,!0}catch(r){throw r}}async loadFlameModel(t){if(!this.isInitialized)throw new Error("WASM adapter not initialized");try{return await this.flameManager.loadFlameModel(t),!0}catch(e){throw e}}async load3DGSData(t){if(!this.isInitialized)throw new Error("WASM adapter not initialized");try{this.original3DGSData=t;const{originalPoints:e,binding:r,flameFaces:a}=this.convertGaussianDataToFlameFormat(t);await this.flameManager.set3DGSData(e,r,a);const o=t.positions?.length/3||0;return this.lastSplatCount=o,!0}catch(e){throw e}}convertGaussianDataToFlameFormat(t){const e=t.positions?.length/3||0;if(e===0)throw new Error("No valid Gaussian data provided");const r=[];for(let i=0;i<e;i++){const s={position:[t.positions[i*3],t.positions[i*3+1],t.positions[i*3+2]],rotation:[t.rotations[i*4],t.rotations[i*4+1],t.rotations[i*4+2],t.rotations[i*4+3]],color:[t.colors[i*3],t.colors[i*3+1],t.colors[i*3+2]],scale:[t.scales[i*3],t.scales[i*3+1],t.scales[i*3+2]],opacity:t.opacities[i]};r.push(s)}const a=new Array(e).fill(0).map((i,s)=>s),o=new Int32Array([0,1,2]);return{originalPoints:r,binding:a,flameFaces:o}}async computeFrame(t){if(!this.isInitialized)throw new Error("WASM adapter not initialized");const e=performance.now();try{if(this.options.enableCaching&&this.lastFrameData&&this.areParamsEqual(t,this.lastFrameData))return this.computeStats.lastComputeTime=performance.now()-e,this.splatCollection;let r;try{r=await this.flameManager.computeFrameFlat(t)}catch(i){if(i.message.includes("detached ArrayBuffer"))r=await this.flameManager.computeFrame(t);else throw i}if(this.computeStats.wasmCallCount++,!r.success||!r.data||!r.data.points)throw new Error("Invalid WASM computation result");const a=this.convertWASMResultToSplats(r.data);this.splatCollection.clear(),this.splatCollection.addBatch(a),this.lastFrameData={...t},this.lastSplatCount=a.length;const o=performance.now()-e;return this.updateComputeStats(o),this.splatCollection}catch(r){throw r}}convertOriginalPLYToSplats(t){const e=[];try{const r=t.positions?.length/3||0;if(r===0)throw new Error("No points data in original PLY data");for(let a=0;a<r;a++){const o=new S;o.position[0]=t.positions[a*3],o.position[1]=t.positions[a*3+1],o.position[2]=t.positions[a*3+2],t.colors?(o.color[0]=t.colors[a*3],o.color[1]=t.colors[a*3+1],o.color[2]=t.colors[a*3+2],o.color[3]=1):o.color[0]=o.color[1]=o.color[2]=o.color[3]=1,t.opacities&&(o.color[3]=Math.max(0,Math.min(1,t.opacities[a])));const i=t.rotations?[t.rotations[a*4],t.rotations[a*4+1],t.rotations[a*4+2],t.rotations[a*4+3]]:[1,0,0,0],s=t.scales?[t.scales[a*3],t.scales[a*3+1],t.scales[a*3+2]]:[.1,.1,.1],n={rotation:i,scale:s};this.computeCovarianceFromRotationScale(n,o),e.push(o)}}catch(r){throw r}return e}convertWASMResultToSplats(t){const e=[];try{if(!t.points||t.points.length===0)throw new Error("No points data in WASM result");const r=t.points.length;for(let a=0;a<r;a++){const o=t.points[a],i=new S;if(o.position&&Array.isArray(o.position)&&o.position.length>=3)i.position[0]=o.position[0],i.position[1]=o.position[1],i.position[2]=o.position[2];else throw new Error(`Invalid position data at point ${a}`);o.color&&Array.isArray(o.color)&&o.color.length>=3?(i.color[0]=o.color[0],i.color[1]=o.color[1],i.color[2]=o.color[2],i.color[3]=1):(i.color[0]=1,i.color[1]=1,i.color[2]=1,i.color[3]=1),typeof o.opacity=="number"&&(i.color[3]=Math.max(0,Math.min(1,o.opacity))),this.computeCovarianceFromRotationScale(o,i),e.push(i)}}catch(r){throw r}return e}computeCovarianceFromRotationScale(t,e){let r=[1,0,0,0],a=[.1,.1,.1];t.rotation&&Array.isArray(t.rotation)&&t.rotation.length>=4&&(r=t.rotation.slice()),t.scale&&Array.isArray(t.scale)&&t.scale.length>=3&&(a=t.scale.slice());const o=r[0],i=r[1],s=r[2],n=r[3],c=Math.sqrt(o*o+i*i+s*s+n*n);c>1e-6&&(r[0]=o/c,r[1]=i/c,r[2]=s/c,r[3]=n/c);const h=r[0],d=r[1],u=r[2],p=r[3],m=[[1-2*(u*u+p*p),2*(d*u-h*p),2*(d*p+h*u)],[2*(d*u+h*p),1-2*(d*d+p*p),2*(u*p-h*d)],[2*(d*p-h*u),2*(u*p+h*d),1-2*(d*d+u*u)]],f=Math.max(1e-6,a[0]),y=Math.max(1e-6,a[1]),v=Math.max(1e-6,a[2]),A=f*f,w=y*y,b=v*v,g=m[0][0]*m[0][0]*A+m[0][1]*m[0][1]*w+m[0][2]*m[0][2]*b,x=m[0][0]*m[1][0]*A+m[0][1]*m[1][1]*w+m[0][2]*m[1][2]*b,D=m[0][0]*m[2][0]*A+m[0][1]*m[2][1]*w+m[0][2]*m[2][2]*b,P=m[1][0]*m[1][0]*A+m[1][1]*m[1][1]*w+m[1][2]*m[1][2]*b,E=m[1][0]*m[2][0]*A+m[1][1]*m[2][1]*w+m[1][2]*m[2][2]*b,_=m[2][0]*m[2][0]*A+m[2][1]*m[2][1]*w+m[2][2]*m[2][2]*b;e.covA[0]=g,e.covA[1]=x,e.covA[2]=D,e.covB[0]=P,e.covB[1]=E,e.covB[2]=_}async computeFrameBatched(t,e=null){const r=e||this.options.batchSize;if(this.lastSplatCount<=r)return this.computeFrame(t);const a=Math.ceil(this.lastSplatCount/r),o=[];for(let i=0;i<a;i++){const s=i*r,n=Math.min(s+r,this.lastSplatCount),c={...t,batchStart:s,batchEnd:n},h=await this.computeFrame(c);o.push(...h.splats)}return this.splatCollection.clear(),this.splatCollection.addBatch(o),this.splatCollection}getCurrentSplats(){return this.splatCollection}areParamsEqual(t,e){if(!t||!e)return!1;const r=Object.keys(t),a=Object.keys(e);if(r.length!==a.length)return!1;for(const o of r)if(t[o]!==e[o])return!1;return!0}updateComputeStats(t){this.computeStats.totalFrames++,this.computeStats.lastComputeTime=t;const e=.1;this.computeStats.avgComputeTime=this.computeStats.avgComputeTime*(1-e)+t*e}getComputeStats(){return{...this.computeStats}}getWASMMemoryStats(){return!this.wasmModule||!this.wasmModule.HEAP8?null:{totalMemory:this.wasmModule.HEAP8.length,usedMemory:this.wasmModule.HEAP8.buffer.byteLength,heapSize:this.wasmModule.HEAPU8?this.wasmModule.HEAPU8.length:0}}dispose(){this.flameManager&&typeof this.flameManager.dispose=="function"&&this.flameManager.dispose(),this.splatCollection.clear(),this.lastFrameData=null,this.isInitialized=!1}clearCache(){this.lastFrameData=null,this.splatCollection.clear()}setDebugMode(t){this.options.debug=t,this.flameManager&&typeof this.flameManager.setDebugMode=="function"&&this.flameManager.setDebugMode(t)}}async function B(l={}){const t=new q(l);try{const[e,{FlameComplete3DGSManager:r}]=await Promise.all([F(()=>import("./flame_compute_frame_wasm-5Z0ve_fG.js"),__vite__mapDeps([0,1,2,3])).then(a=>a.default()),F(()=>import("./binaryPlyLoader-XfY_fKVH.js").then(a=>a.f),__vite__mapDeps([1,2,3]))]);return await t.initialize(e,r),t}catch(e){throw e}}const C={createPerspectiveMatrix(l,t,e,r){const a=1/Math.tan(l*Math.PI/180/2),o=1/(e-r);return new Float32Array([a/t,0,0,0,0,a,0,0,0,0,(e+r)*o,-1,0,0,e*r*o*2,0])},createLookAtMatrix(l,t,e){const r=[l[0]-t[0],l[1]-t[1],l[2]-t[2]],a=Math.sqrt(r[0]*r[0]+r[1]*r[1]+r[2]*r[2]);r[0]/=a,r[1]/=a,r[2]/=a;const o=[e[1]*r[2]-e[2]*r[1],e[2]*r[0]-e[0]*r[2],e[0]*r[1]-e[1]*r[0]],i=Math.sqrt(o[0]*o[0]+o[1]*o[1]+o[2]*o[2]);o[0]/=i,o[1]/=i,o[2]/=i;const s=[r[1]*o[2]-r[2]*o[1],r[2]*o[0]-r[0]*o[2],r[0]*o[1]-r[1]*o[0]];return new Float32Array([o[0],s[0],r[0],0,o[1],s[1],r[1],0,o[2],s[2],r[2],0,-(o[0]*l[0]+o[1]*l[1]+o[2]*l[2]),-(s[0]*l[0]+s[1]*l[1]+s[2]*l[2]),-(r[0]*l[0]+r[1]*l[1]+r[2]*l[2]),1])}};class H{constructor(t={}){this.options={canvas:null,debug:!1,backgroundColor:[1,1,1,1],enableWASM:!0,enableAutoSort:!0,enablePerformanceMonitoring:!0,targetFPS:60,...t},this.renderer=null,this.wasmAdapter=null,this.isInitialized=!1,this.camera={position:[-.02,-.013,1.5],target:[0,0,0],up:[0,1,0],fov:22,aspect:1,near:.01,far:100},this.isRendering=!1,this.animationFrameId=null,this.lastFrameTime=0,this.currentSplats=null,this.needsRender=!0,this.performanceMonitor={enabled:this.options.enablePerformanceMonitoring,frameCount:0,startTime:performance.now(),lastFpsUpdate:0,currentFPS:0,frameHistory:[],maxHistoryLength:120},this.onFrameRender=null,this.onPerformanceUpdate=null,this.onError=null}async initialize(){try{const t=this.options.canvas;if(!t)throw new Error("Canvas element is required");if(this.renderer=new O({canvas:t,debug:this.options.debug,backgroundColor:this.options.backgroundColor}),await this.renderer.initialize(),this.options.enableWASM)try{this.wasmAdapter=await B({debug:this.options.debug})}catch{this.wasmAdapter=null}return this.updateCameraAspect(),this.updateCamera(),this.isInitialized=!0,!0}catch(t){throw this.onError&&this.onError(t),t}}async initializeWASM(t,e){try{if(!this.isInitialized)throw new Error("System must be initialized first");if(!e)throw new Error("FLAME data is required");if(this.wasmAdapter||(this.wasmAdapter=await B({debug:this.options.debug})),await this.wasmAdapter.loadFlameModel(e.flameModel),await this.wasmAdapter.flameManager.set3DGSData(e.original3DGSPoints,e.binding,e.flameFaces),t&&window.WasmMemoryReader)try{const r=new window.WasmMemoryReader(t);this.wasmAdapter.flameManager.setWasmMemoryReader(r)}catch{}return!0}catch(r){throw this.onError&&this.onError(r),r}}async updateFrame(t){if(!this.isInitialized)throw new Error("System not initialized");if(this.wasmAdapter)try{const e=await this.wasmAdapter.computeFrame(t);this.currentSplats=e,this.currentSplats&&this.currentSplats.count>0&&(this.renderer.loadSplats(this.currentSplats.toArray()),this.needsRender=!0)}catch(e){this.onError&&this.onError(e)}}renderFrame(){if(!(!this.isInitialized||!this.renderer))try{this.updateCameraMatrices(),this.renderer.render(this.viewMatrix,this.projectionMatrix,[this.options.canvas.width,this.options.canvas.height]),this.needsRender=!1}catch(t){this.onError&&this.onError(t)}}updateCameraMatrices(){this.projectionMatrix=C.createPerspectiveMatrix(this.camera.fov,this.camera.aspect,this.camera.near,this.camera.far),this.viewMatrix=C.createLookAtMatrix(this.camera.position,this.camera.target,this.camera.up)}async loadFlameModel(t){if(!this.isInitialized)throw new Error("System not initialized");if(this.wasmAdapter)try{await this.wasmAdapter.loadFlameModel(t)}catch(e){throw e}}async loadGaussianData(t){if(!this.isInitialized)throw new Error("System not initialized");try{if(this.wasmAdapter)await this.wasmAdapter.load3DGSData(t),this.currentSplats=new M;else{const e=this.convertGaussianDataToSplats(t);this.currentSplats=new M,this.currentSplats.addBatch(e),this.renderer.loadSplats(this.currentSplats.toArray())}return this.needsRender=!0,!0}catch(e){throw e}}convertGaussianDataToSplats(t){const e=[],r=t.positions||[],a=t.colors||[],o=t.scales||[],i=t.rotations||[],s=t.opacities||[],n=r.length/3;for(let c=0;c<n;c++){const h=new S;if(h.position[0]=r[c*3]||0,h.position[1]=r[c*3+1]||0,h.position[2]=r[c*3+2]||0,a.length>0?(h.color[0]=a[c*3]||1,h.color[1]=a[c*3+1]||1,h.color[2]=a[c*3+2]||1,h.color[3]=s[c]||1):h.color.set([1,1,1,1]),o.length>0&&i.length>0){const d=[o[c*3]||1,o[c*3+1]||1,o[c*3+2]||1],u=[i[c*4]||0,i[c*4+1]||0,i[c*4+2]||0,i[c*4+3]||1],p=S.computeCovariance3D(d,u);h.covA[0]=p[0][0],h.covA[1]=p[0][1],h.covA[2]=p[0][2],h.covB[0]=p[1][1],h.covB[1]=p[1][2],h.covB[2]=p[2][2]}else h.covA.set([.1,0,0]),h.covB.set([.1,0,.1]);e.push(h)}return e}async updateFlameParams(t){if(!this.isInitialized)throw new Error("System not initialized");if(this.wasmAdapter)try{const e=await this.wasmAdapter.computeFrame(t);e&&e.count>0&&(this.currentSplats=e,this.options.enableAutoSort&&await this.sortSplats(),this.renderer.loadSplats(this.currentSplats.toArray()),this.needsRender=!0)}catch(e){this.onError&&this.onError(e)}}async sortSplats(){if(!(!this.currentSplats||this.currentSplats.count===0))try{this.renderer.updateCamera(this.camera.position,this.getCameraForward()),await this.renderer.sortSplats(this.currentSplats.splats)}catch{}}async updateCamera(t={}){Object.assign(this.camera,t),t.aspect===void 0&&this.updateCameraAspect(),this.options.enableAutoSort&&this.currentSplats&&this.currentSplats.count>0&&await this.sortSplats(),this.needsRender=!0}updateCameraAspect(){const t=this.options.canvas;t&&(this.camera.aspect=t.width/t.height)}getCameraForward(){const t=[this.camera.target[0]-this.camera.position[0],this.camera.target[1]-this.camera.position[1],this.camera.target[2]-this.camera.position[2]],e=Math.sqrt(t[0]*t[0]+t[1]*t[1]+t[2]*t[2]);return e>0&&(t[0]/=e,t[1]/=e,t[2]/=e),t}startRendering(){if(!this.isInitialized)throw new Error("System not initialized");this.isRendering||(this.isRendering=!0,this.performanceMonitor.startTime=performance.now(),this.performanceMonitor.frameCount=0,this.renderLoop())}stopRendering(){this.isRendering&&(this.isRendering=!1,this.animationFrameId&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null))}renderLoop(){if(!this.isRendering)return;const t=performance.now(),e=t-this.lastFrameTime,r=1e3/this.options.targetFPS;if(e<r&&!this.needsRender){this.animationFrameId=requestAnimationFrame(()=>this.renderLoop());return}this.lastFrameTime=t;try{this.renderFrame(),this.updatePerformanceMonitor(t,e),this.needsRender=!1}catch(a){this.onError&&this.onError(a)}this.animationFrameId=requestAnimationFrame(()=>this.renderLoop())}renderFrame(){if(!this.renderer||!this.currentSplats)return;const t=this.options.canvas,e=t.width,r=t.height,a=C.createPerspectiveMatrix(this.camera.fov,this.camera.aspect,this.camera.near,this.camera.far),o=C.createLookAtMatrix(this.camera.position,this.camera.target,this.camera.up);this.renderer.render(o,a,[e,r]),this.onFrameRender&&this.onFrameRender({frameTime:this.renderer.getRenderStats().frameTime,splatCount:this.currentSplats.count})}updatePerformanceMonitor(t,e){if(this.performanceMonitor.enabled&&(this.performanceMonitor.frameCount++,this.performanceMonitor.frameHistory.push(e),this.performanceMonitor.frameHistory.length>this.performanceMonitor.maxHistoryLength&&this.performanceMonitor.frameHistory.shift(),t-this.performanceMonitor.lastFpsUpdate>=1e3)){const r=t-this.performanceMonitor.startTime;this.performanceMonitor.currentFPS=Math.round(this.performanceMonitor.frameCount/r*1e3),this.performanceMonitor.lastFpsUpdate=t,this.onPerformanceUpdate&&this.onPerformanceUpdate(this.getPerformanceStats())}}getPerformanceStats(){const t=this.renderer?this.renderer.getRenderStats():{},e=this.wasmAdapter?this.wasmAdapter.getComputeStats():{},r=this.performanceMonitor.frameHistory,a=r.length>0?r.reduce((o,i)=>o+i,0)/r.length:0;return{fps:this.performanceMonitor.currentFPS,avgFrameTime:a,renderStats:t,wasmStats:e,splatCount:this.currentSplats?this.currentSplats.count:0}}getSystemStatus(){return{initialized:this.isInitialized,rendering:this.isRendering,wasmEnabled:!!this.wasmAdapter,splatCount:this.currentSplats?this.currentSplats.count:0,camera:{...this.camera}}}handleResize(){!this.isInitialized||!this.renderer||(this.updateCameraAspect(),typeof this.renderer.handleResize=="function"&&this.renderer.handleResize(),this.needsRender=!0)}dispose(){this.stopRendering(),this.renderer&&this.renderer.dispose(),this.wasmAdapter&&this.wasmAdapter.dispose(),this.currentSplats=null,this.isInitialized=!1}}window.loadCompleteFlameData=I;window.SparkPlyLoader=T;function G(){return document.createElement("canvas").getContext("webgl2")?{supported:!0,message:"WebGL2 is supported"}:{supported:!1,message:"WebGL2 not supported by this browser"}}window.WasmMemoryReader=class{constructor(t){this.wasmModule=t,this.refreshHeapViews()}refreshHeapViews(){this.HEAPF32=this.wasmModule.HEAPF32,this.HEAP32=this.wasmModule.HEAP32}readFloatArray(t,e){try{const r=t>>2;return this.HEAPF32.subarray(r,r+e)}catch(r){if(r.message.includes("detached ArrayBuffer")){this.refreshHeapViews();const a=t>>2;return this.HEAPF32.subarray(a,a+e)}throw r}}readIntArray(t,e){try{const r=t>>2;return this.HEAP32.subarray(r,r+e)}catch(r){if(r.message.includes("detached ArrayBuffer")){this.refreshHeapViews();const a=t>>2;return this.HEAP32.subarray(a,a+e)}throw r}}convertSharedResult(t){const e=t.pointCount;this.refreshHeapViews();const r=this.readFloatArray(t.positionsPtr,e*3),a=this.readFloatArray(t.scalesPtr,e*3),o=this.readFloatArray(t.rotationsPtr,e*4),i=this.readFloatArray(t.colorsPtr,e*3),s=this.readFloatArray(t.opacitiesPtr,e),n=this.readIntArray(t.bindingsPtr,e);return{success:!0,data:{positions:r,scales:a,rotations:o,colors:i,opacities:s,bindings:n,pointCount:e},metadata:{flameToMeshTime:t.flameToMeshTimeMs,meshBindingTime:t.meshBindingTimeMs,pointTransformTime:t.pointTransformTimeMs,totalTime:t.totalTimeMs,pointCount:e}}}};class X{constructor(){this.system=null,this.flameManager=null,this.dataLoader=null,this.wasmModule=null,this.allData=null,this.shapeParameters=null,this.isInitialized=!1,this.animationSettings={isAnimating:!1,animationTime:0,animationSpeed:1,frameCount:0,animationFrameId:null},this.currentPerformanceData=null,this.fpsCounter={fps:0,frameTime:0,lastTime:0,frameCount:0,timeAccumulator:0},this.initializeUI()}async initialize(){const t=document.getElementById("webgl-canvas"),e=document.getElementById("loading-overlay"),r=document.getElementById("loading-text");window.demo=this;try{e.style.display="flex";const a=G();if(!a.supported)throw new Error(a.message);await new Promise(d=>setTimeout(d,100)),this.resizeCanvas();const o=document.getElementById("webgl-canvas"),i=o.getBoundingClientRect();(o.width===0||o.height===0)&&(o.width=800,o.height=600),r.textContent="加载WASM模块...";const s=(await F(async()=>{const{default:d}=await import("./flame_compute_frame_wasm-5Z0ve_fG.js");return{default:d}},__vite__mapDeps([0,1,2,3]))).default;if(this.wasmModule=await s(),this.flameManager=new z,await this.flameManager.initialize(this.wasmModule),r.textContent="加载FLAME数据...",this.dataLoader=new L({baseAssetsPath:"./assets",modelFolder:"3dgs3"}),this.allData=await this.dataLoader.loadAllData(),!this.allData||!this.allData.original3DGSPoints||this.allData.original3DGSPoints.length===0)throw new Error("点云数据加载失败或为空");this.shapeParameters=this.allData.shapeData||new Array(300).fill(0),r.textContent="初始化FLAME模型...",await this.flameManager.loadFlameModel(this.allData.flameModel),r.textContent="设置3DGS数据...",await this.flameManager.set3DGSData(this.allData.original3DGSPoints,this.allData.binding,this.allData.flameFaces),r.textContent="创建WebGL 3DGS系统...",this.system=new H({canvas:t,debug:!0,backgroundColor:[1,1,1,1],enableWASM:!1,enableAutoSort:!0,enablePerformanceMonitoring:!0,targetFPS:60}),r.textContent="初始化渲染器...",await this.system.initialize(),this.system.onError=d=>{this.showError(d.message)},r.textContent="初始化内存读取器...";const n=new WasmMemoryReader(this.wasmModule);this.flameManager.setWasmMemoryReader(n),r.textContent="执行首次渲染...";const c=this.createAnimationParams(0);let h;try{h=await this.flameManager.computeFrameFlat(c)}catch(d){if(d.message.includes("detached ArrayBuffer"))h=await this.flameManager.computeFrame(c);else throw d}if(!h.success)throw new Error("首次FLAME计算失败");await this.updateWebGLSystem(h,!0),this.system.startRendering(),this.system.needsRender=!0,this.system.renderFrame(),this.system.currentSplats&&this.system.currentSplats.count>0&&this.adjustCameraToSplats(),e.style.display="none",this.isInitialized=!0}catch(a){this.showError("初始化失败: "+a.message),e.style.display="none"}}async updateWebGLSystem(t,e=!1){if(!t.success||!t.data)throw new Error("Invalid FLAME computation result");if(t.data.positions&&t.data.pointCount)this.system.currentSplats={count:t.data.pointCount},this.system.renderer&&(e?(this.system.renderer.loadSplatsFromFlat(t.data),this.system.options.enableAutoSort&&await this.system.sortSplats()):this.system.renderer.loadSplatsFromFlat(t.data),this.system.needsRender=!0);else if(t.data.points){const r=this.convertFLAMEResultToSplats(t.data.points);this.system.currentSplats=new M,this.system.currentSplats.addBatch(r),this.system.renderer&&(e?(this.system.renderer.loadSplats(r),this.system.options.enableAutoSort&&await this.system.sortSplats()):this.updateAnimationFrame(r),this.system.needsRender=!0)}else throw new Error("Unsupported FLAME result data format");this.currentPerformanceData={flameToMeshTime:t.metadata?.flameToMeshTime||0,meshBindingTime:t.metadata?.meshBindingTime||0,pointTransformTime:t.metadata?.pointTransformTime||0,sortRenderTime:0,totalTime:t.metadata?.totalTime||0,pointCount:t.data.pointCount||(t.data.points?t.data.points.length:0),fps:this.fpsCounter?.fps||0,frameTime:this.fpsCounter?.frameTime||0,frameNumber:this.animationSettings.frameCount}}updateAnimationFrame(t){const e=this.system.renderer,r=e.splatSorter,a=r.markNeedsSort;r.markNeedsSort=()=>{};try{e.updateSplatDataDirect(t)}finally{r.markNeedsSort=a}}convertFLAMEResultToSplats(t){const e=[];for(let r=0;r<t.length;r++){const a=t[r],o=new S;o.position[0]=a.position[0],o.position[1]=a.position[1],o.position[2]=a.position[2],o.color[0]=a.color[0],o.color[1]=a.color[1],o.color[2]=a.color[2],o.color[3]=a.opacity||1,o.rotation=new Float32Array(4),o.scale=new Float32Array(3),o.rotation[0]=a.rotation[0],o.rotation[1]=a.rotation[1],o.rotation[2]=a.rotation[2],o.rotation[3]=a.rotation[3],o.scale[0]=a.scale[0],o.scale[1]=a.scale[1],o.scale[2]=a.scale[2];const i=[a.rotation[1],a.rotation[2],a.rotation[3],a.rotation[0]],s=S.computeCovariance3D(a.scale,i);o.covA[0]=s[0][0],o.covA[1]=s[0][1],o.covA[2]=s[0][2],o.covB[0]=s[1][1],o.covB[1]=s[1][2],o.covB[2]=s[2][2];const n=Math.sqrt(o.rotation[0]**2+o.rotation[1]**2+o.rotation[2]**2+o.rotation[3]**2);Math.abs(n-1)>.001&&(o.rotation[0]/=n,o.rotation[1]/=n,o.rotation[2]/=n,o.rotation[3]/=n),e.push(o)}if(this.analyzeSplatData(e),e.length>0){const r=e[0];r.covA[0]*r.covB[0]-r.covA[1]*r.covA[1],r.covA[0]<=0||r.covB[0]<=0}return e}convertFLAMEResultFlatToSplats(t){const e=t.pointCount,r=new Array(e);for(let a=0;a<e;a++){const o=new S,i=a*3;o.position[0]=t.positions[i],o.position[1]=t.positions[i+1],o.position[2]=t.positions[i+2],o.color[0]=t.colors[i],o.color[1]=t.colors[i+1],o.color[2]=t.colors[i+2],o.color[3]=t.opacities[a]??1;const s=i,n=a*4,c=[t.scales[s]||1,t.scales[s+1]||1,t.scales[s+2]||1],h=[t.rotations[n+1]||0,t.rotations[n+2]||0,t.rotations[n+3]||0,t.rotations[n]||1],d=S.computeCovariance3D(c,h);o.covA[0]=d[0][0],o.covA[1]=d[0][1],o.covA[2]=d[0][2],o.covB[0]=d[1][1],o.covB[1]=d[1][2],o.covB[2]=d[2][2],r[a]=o}return r}analyzeSplatData(t){if(t.length===0)return{};const e=t.map(s=>s.position),r=t.map(s=>s.scale||[0,0,0]),a=t.map(s=>s.covA),o={count:t.length,position:{min:[Math.min(...e.map(s=>s[0])),Math.min(...e.map(s=>s[1])),Math.min(...e.map(s=>s[2]))],max:[Math.max(...e.map(s=>s[0])),Math.max(...e.map(s=>s[1])),Math.max(...e.map(s=>s[2]))],center:[e.reduce((s,n)=>s+n[0],0)/e.length,e.reduce((s,n)=>s+n[1],0)/e.length,e.reduce((s,n)=>s+n[2],0)/e.length]},scale:{min:Math.min(...r.map(s=>Math.min(...s))),max:Math.max(...r.map(s=>Math.max(...s))),avg:r.reduce((s,n)=>s+Math.max(...n),0)/r.length},covariance:{min_diag:Math.min(...a.map(s=>Math.min(s[0],s[1],s[2]))),max_diag:Math.max(...a.map(s=>Math.max(s[0],s[1],s[2]))),avg_trace:a.reduce((s,n)=>s+n[0],0)/a.length}},i=[];return o.scale.max>.1&&i.push(`Scale too large: ${o.scale.max}`),o.position.max[2]>5&&i.push(`Positions too far: ${o.position.max[2]}`),o.covariance.max_diag>1&&i.push(`Covariance too large: ${o.covariance.max_diag}`),o.potential_issues=i,o}initializeUI(){this.bindUIEvents(),this.updateSliderValues(),window.addEventListener("resize",()=>{this.isInitialized&&this.resizeCanvas()})}bindUIEvents(){document.getElementById("generate-data-btn").addEventListener("click",()=>{this.startAnimation()}),document.getElementById("load-test-data-btn").addEventListener("click",()=>{this.pauseAnimation()}),document.getElementById("reset-camera-btn").addEventListener("click",()=>{this.resetCamera()}),document.getElementById("animation-speed").addEventListener("input",e=>{const r=parseFloat(e.target.value);document.getElementById("animation-speed-value").textContent=r.toFixed(1),this.animationSettings.animationSpeed=r}),this.bindMobileEvents()}bindMobileEvents(){const t=document.getElementById("generate-data-btn-mobile");t&&t.addEventListener("click",()=>{this.startAnimation()});const e=document.getElementById("load-test-data-btn-mobile");e&&e.addEventListener("click",()=>{this.pauseAnimation()});const r=document.getElementById("reset-camera-btn-mobile");r&&r.addEventListener("click",()=>{this.resetCamera()});const a=document.getElementById("animation-speed-mobile");a&&a.addEventListener("input",o=>{const i=parseFloat(o.target.value);document.getElementById("animation-speed-value-mobile").textContent=i.toFixed(1),this.animationSettings.animationSpeed=i;const s=document.getElementById("animation-speed");s&&(s.value=i,document.getElementById("animation-speed-value").textContent=i.toFixed(1))})}updateSliderValues(){const t=document.getElementById("animation-speed-value"),e=document.getElementById("animation-speed");t&&e&&(t.textContent=parseFloat(e.value).toFixed(1))}createAnimationParams(t){if(!this.allData?.idleAnimation?.length)return{shape:this.shapeParameters||new Array(300).fill(0),expression:new Array(100).fill(0),pose:new Array(3).fill(0),neck:new Array(3).fill(0),jaw:new Array(3).fill(0),eyes:new Array(6).fill(0),translation:new Array(3).fill(0),eyelid:[0,0]};const e=this.allData.idleAnimation.length,r=Math.floor(t*30)%e,a=this.allData.idleAnimation[r];if(!a?.content)throw new Error(`动画帧${r}数据损坏`);const o=a.content,i=(n,c)=>Array.isArray(n)?Array.isArray(n[0])?n[0]:n:c;return{shape:this.shapeParameters||new Array(300).fill(0),expression:i(o.expr,new Array(100).fill(0)),pose:i(o.rotation,new Array(3).fill(0)),neck:i(o.neck_pose,new Array(3).fill(0)),jaw:i(o.jaw_pose,new Array(3).fill(0)),eyes:i(o.eyes_pose,new Array(6).fill(0)),translation:i(o.translation,new Array(3).fill(0)),eyelid:i(o.eyelid,[0,0])}}hslToRgb(t,e,r){let a,o,i;if(e===0)a=o=i=r;else{const s=(h,d,u)=>(u<0&&(u+=1),u>1&&(u-=1),u<.16666666666666666?h+(d-h)*6*u:u<.5?d:u<.6666666666666666?h+(d-h)*(.6666666666666666-u)*6:h),n=r<.5?r*(1+e):r+e-r*e,c=2*r-n;a=s(c,n,t+1/3),o=s(c,n,t),i=s(c,n,t-1/3)}return[a,o,i]}async startAnimation(){if(!(!this.isInitialized||this.animationSettings.isAnimating))try{document.getElementById("generate-data-btn").disabled=!0,document.getElementById("generate-data-btn").textContent="动画中...",this.animationSettings.isAnimating=!0,this.animationSettings.animationTime=0,this.animationSettings.frameCount=0,this.animationLoop()}catch(t){this.showError("启动动画失败: "+t.message),this.animationSettings.isAnimating=!1,document.getElementById("generate-data-btn").disabled=!1,document.getElementById("generate-data-btn").textContent="开始动画"}}pauseAnimation(){this.animationSettings.isAnimating=!1,this.animationSettings.animationFrameId&&(cancelAnimationFrame(this.animationSettings.animationFrameId),this.animationSettings.animationFrameId=null),document.getElementById("generate-data-btn").disabled=!1,document.getElementById("generate-data-btn").textContent="开始动画",document.getElementById("load-test-data-btn").textContent="动画已暂停"}async animationLoop(){if(this.animationSettings.isAnimating)try{const t=performance.now();await this.renderDirectly();const r=performance.now()-t;this.updateFPSWithRealTime(r),this.currentPerformanceData&&(this.currentPerformanceData.realFrameTime=r,this.currentPerformanceData.fps=this.fpsCounter.fps,this.currentPerformanceData.frameTime=r,this.updatePerformanceStats(this.currentPerformanceData)),this.animationSettings.animationTime+=1/30*this.animationSettings.animationSpeed,this.animationSettings.frameCount++,this.animationSettings.isAnimating&&(this.animationSettings.animationFrameId=requestAnimationFrame(()=>this.animationLoop()))}catch(t){this.pauseAnimation(),this.showError("动画执行错误: "+t.message)}}updateRenderTime(t,e){this.currentPerformanceData&&(this.currentPerformanceData.webglRenderTime=e,this.updatePerformanceStats(this.currentPerformanceData))}async renderDirectly(){const t=this.createAnimationParams(this.animationSettings.animationTime);let e;try{e=await this.flameManager.computeFrameFlat(t)}catch(r){if(r.message.includes("detached ArrayBuffer"))e=await this.flameManager.computeFrame(t);else throw r}if(e.success){const r=performance.now();await this.updateWebGLSystem(e),this.system.renderFrame();const a=performance.now()-r;this.updateRenderTime(e,a)}}resetCamera(){this.system&&(this.system.updateCamera({position:[-.02,-.013,1.5],target:[0,0,0],fov:22}),document.getElementById("camera-fov").value=22,document.getElementById("camera-distance").value=1.5,document.getElementById("animation-speed").value=1,this.updateSliderValues())}adjustCameraToSplats(){!this.system||!this.system.currentSplats||this.system.updateCamera({position:[-.02,-.013,1.5],target:[0,0,0],fov:22})}addTestSplats(){const{SplatData:t}=window;if(!t)return;const e=[];for(let r=0;r<5;r++){const a=new t;a.position=[r*.2-.4,0,-.5],a.color=[1,0,0,1],a.covA=[.1,0,0],a.covB=[.1,0,.1],e.push(a)}this.system.currentSplats.addBatch(e),this.system.renderer.loadSplats(this.system.currentSplats.toArray()),this.system.needsRender=!0}resizeCanvas(){const t=document.getElementById("webgl-canvas"),e=t.getBoundingClientRect();t.width=e.width*window.devicePixelRatio,t.height=e.height*window.devicePixelRatio,this.system&&this.system.renderer&&(this.system.renderer.gl.viewport(0,0,t.width,t.height),this.system.updateCameraAspect(),typeof this.system.handleResize=="function"&&this.system.handleResize(),this.system.needsRender=!0)}updateFPSWithRealTime(t){this.fpsCounter.frameTime=t,this.fpsCounter.frameCount++,this.fpsCounter.timeAccumulator+=t,this.fpsCounter.timeAccumulator>=500&&(this.fpsCounter.fps=this.fpsCounter.frameCount*1e3/this.fpsCounter.timeAccumulator,this.fpsCounter.frameCount=0,this.fpsCounter.timeAccumulator=0)}updateFPS(){const t=performance.now();if(this.fpsCounter.lastTime===0){this.fpsCounter.lastTime=t;return}t-this.fpsCounter.lastTime,this.fpsCounter.lastTime=t}updatePerformanceStats(t){const e=(a,o)=>(parseFloat(a)||0).toFixed(o),r=(a,o)=>{const i=document.getElementById(a);i&&(i.textContent=o)};if(r("flame-to-mesh-time",e(t.flameToMeshTime||0,2)),r("mesh-binding-time",e(t.meshBindingTime||0,2)),r("point-transform-time",e(t.pointTransformTime||0,2)),r("webgl-render-time",t.webglRenderTime?t.webglRenderTime.toFixed(2):"-"),r("real-frame-time",t.realFrameTime?t.realFrameTime.toFixed(1):"-"),r("point-count",t.pointCount||0),r("flame-to-mesh-time-mobile",e(t.flameToMeshTime||0,2)),r("mesh-binding-time-mobile",e(t.meshBindingTime||0,2)),r("point-transform-time-mobile",e(t.pointTransformTime||0,2)),r("webgl-render-time-mobile",t.webglRenderTime?t.webglRenderTime.toFixed(2):"-"),r("real-frame-time-mobile",t.realFrameTime?t.realFrameTime.toFixed(1):"-"),r("point-count-mobile",t.pointCount||0),r("fps-display",t.fps?`FPS: ${t.fps.toFixed(1)}`:"FPS: --"),r("frame-count",`帧: ${t.frameNumber||0}`),t.pointCount&&r("render-info",`点云: ${t.pointCount} | 状态: 正在渲染`),this.system&&this.system.camera){const a=this.system.camera;r("camera-info",`相机: FOV ${a.fov}° | 距离 ${a.position[2].toFixed(2)}`)}}showError(t){const e=document.getElementById("error-display");e.textContent=t,e.style.display="block",setTimeout(()=>{e.style.display="none"},5e3)}dispose(){this.pauseAnimation(),this.system&&(this.system.dispose(),this.system=null),this.flameManager&&(this.flameManager=null),this.allData=null,console.log("🧹 Demo resources cleaned up")}}const R=new X;window.addEventListener("load",()=>{R.initialize()});window.addEventListener("beforeunload",()=>{R.dispose()});window.webglDemo=R;
