// 3DGS 性能测试自动化脚本
class PerformanceTester {
    constructor() {
        this.testResults = {
            metadata: {
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                screen: `${screen.width}x${screen.height}`,
                devicePixelRatio: window.devicePixelRatio
            },
            tests: {},
            summary: {}
        };
        
        this.models = {
            '56k': { 
                url: '/splats/model_56k.ply', 
                name: '56K 点云模型', 
                expectedPoints: 56000 
            },
            '150k': { 
                url: '/splats/model_150k.ply', 
                name: '150K 点云模型', 
                expectedPoints: 150000 
            }
        };
        
        this.isRunning = false;
        this.currentTest = null;
        this.progressCallback = null;
        this.logCallback = null;
    }

    // 设置回调函数
    setCallbacks(progressCallback, logCallback) {
        this.progressCallback = progressCallback;
        this.logCallback = logCallback;
    }

    // 记录日志
    log(message) {
        const timestamp = new Date().toLocaleTimeString();
        const logMessage = `[${timestamp}] ${message}`;
        console.log(logMessage);
        if (this.logCallback) {
            this.logCallback(logMessage);
        }
    }

    // 更新进度
    updateProgress(percent, message = '') {
        if (this.progressCallback) {
            this.progressCallback(percent, message);
        }
    }

    // 等待指定时间
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 获取 GPU 信息
    getGPUInfo(renderer) {
        try {
            const gl = renderer.getContext();
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                return {
                    renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
                    vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
                };
            }
        } catch (e) {
            console.warn('无法获取 GPU 信息:', e);
        }
        return { renderer: 'Unknown', vendor: 'Unknown' };
    }

    // 单个模型性能测试
    testModel(modelKey, scene, camera, renderer, SplatMesh, onProgress) {
        return new Promise(async (resolveTest, rejectTest) => {
            const modelConfig = this.models[modelKey];
            this.log(`开始测试 ${modelConfig.name}...`);
            
            const testData = {
                modelName: modelConfig.name,
                expectedPoints: modelConfig.expectedPoints,
                loadTime: 0,
                samples: [],
                statistics: {}
            };
    
            try {
                // 清理旧模型
                const existingMesh = scene.children.find(child => child instanceof SplatMesh);
                if (existingMesh) {
                    scene.remove(existingMesh);
                    existingMesh.dispose?.();
                }
    
                // 测量加载时间
                const loadStartTime = performance.now();
                const splatMesh = new SplatMesh({ url: modelConfig.url });
                splatMesh.position.set(0, 0, -3);
                scene.add(splatMesh);
                
                // 等待模型稳定加载
                await this.wait(2000);
                testData.loadTime = performance.now() - loadStartTime;
                
                this.log(`${modelConfig.name} 加载完成，耗时: ${testData.loadTime.toFixed(2)}ms`);
    
                // 性能测试循环 (15秒)
                const testDuration = 15000;
                const testStartTime = performance.now();
                let frameCount = 0;

                const testLoop = () => {
                    // 检查停止条件
                    if (!this.isRunning || performance.now() - testStartTime > testDuration) {
                        this.calculateStatistics(testData);
                        this.log(`${modelConfig.name} 测试完成 - 总帧数: ${testData.samples.length}, 平均FPS: ${testData.statistics.avgFPS.toFixed(1)}`);
                        renderer.info.reset(); // 为下一个测试重置信息
                        resolveTest(testData);
                        return;
                    }

                    const frameStartTime = performance.now();
                    
                    // 1. 模拟排序 (通过旋转触发)
                    const sortStartTime = performance.now();
                    splatMesh.rotation.y += 0.01;
                    const sortTime = performance.now() - sortStartTime;

                    // 2. 渲染并收集信息
                    renderer.info.autoReset = false;
                    renderer.info.reset();
                    const renderStartTime = performance.now();
                    renderer.render(scene, camera);
                    const renderTime = performance.now() - renderStartTime;
                    
                    const totalFrameTime = performance.now() - frameStartTime;
                    // 避免除以零
                    const fps = totalFrameTime > 0 ? 1000 / totalFrameTime : 0;
                    
                    // 收集数据
                    testData.samples.push({
                        frameNumber: frameCount,
                        fps: fps,
                        totalFrameTime: totalFrameTime,
                        sortTime: sortTime,
                        renderTime: renderTime,
                        jsHeapMemory: performance.memory ? performance.memory.usedJSHeapSize : 0,
                        rendererMemory: { ...renderer.info.memory },
                        rendererRender: { ...renderer.info.render }
                    });
                    
                    frameCount++;
                    const progress = ((performance.now() - testStartTime) / testDuration) * 100;
                    if (onProgress) {
                        onProgress(progress, `测试 ${modelConfig.name} - FPS: ${Math.round(fps)}`);
                    }
                    
                    // 调度下一帧
                    requestAnimationFrame(testLoop);
                };

                // 启动测试循环
                requestAnimationFrame(testLoop);
                
            } catch (error) {
                this.log(`测试 ${modelConfig.name} 时出错: ${error.message}`);
                testData.error = error.message;
                rejectTest(error);
            }
        });
    }

    // 计算统计数据
    calculateStatistics(testData) {
        const samples = testData.samples;
        if (samples.length === 0) return;

        // 过滤掉前10%的数据 (预热阶段)
        const warmupCount = Math.floor(samples.length * 0.1);
        const validSamples = samples.slice(warmupCount);
        if (validSamples.length === 0) return;

        const getAverage = (arr, prop) => arr.reduce((sum, s) => sum + s[prop], 0) / arr.length;
        
        testData.statistics = {
            totalFrames: validSamples.length,
            
            // FPS
            avgFPS: getAverage(validSamples, 'fps'),
            minFPS: Math.min(...validSamples.map(s => s.fps)),
            maxFPS: Math.max(...validSamples.map(s => s.fps)),
            
            // 帧时间
            avgFrameTime: getAverage(validSamples, 'totalFrameTime'),
            
            // 渲染时间
            avgRenderTime: getAverage(validSamples, 'renderTime'),

            // 排序时间
            avgSortTime: getAverage(validSamples, 'sortTime'),
            
            // 内存 (JS Heap)
            avgJsHeapMemory: getAverage(validSamples, 'jsHeapMemory'),
            
            // Renderer Info (GPU 资源代理)
            rendererInfo: {
                avgCalls: getAverage(validSamples.map(s => s.rendererRender), 'calls'),
                avgTriangles: getAverage(validSamples.map(s => s.rendererRender), 'triangles'),
                avgPoints: getAverage(validSamples.map(s => s.rendererRender), 'points'),
                avgGeometries: getAverage(validSamples.map(s => s.rendererMemory), 'geometries'),
                avgTextures: getAverage(validSamples.map(s => s.rendererMemory), 'textures'),
            }
        };
    }

    // 生成性能对比分析
    generateComparison() {
        const tests = this.testResults.tests;
        const models = Object.keys(tests);
        if (models.length < 2) return null;

        const comparison = {};
        const model1Key = models[0], model2Key = models[1];
        const stats1 = tests[model1Key].statistics, stats2 = tests[model2Key].statistics;

        if (!stats1 || !stats2) return null;

        comparison[`${model1Key}_vs_${model2Key}`] = {
            fpsRatio: stats1.avgFPS / stats2.avgFPS,
            renderTimeRatio: stats2.avgRenderTime / stats1.avgRenderTime,
            sortTimeRatio: stats2.avgSortTime / stats1.avgSortTime,
            
            fpsChange: ((stats2.avgFPS - stats1.avgFPS) / stats1.avgFPS) * 100,
            renderTimeChange: ((stats2.avgRenderTime - stats1.avgRenderTime) / stats1.avgRenderTime) * 100,
            sortTimeChange: ((stats2.avgSortTime - stats1.avgSortTime) / stats1.avgSortTime) * 100,

            // GPU 资源使用对比
            pointsChange: ((stats2.rendererInfo.avgPoints - stats1.rendererInfo.avgPoints) / stats1.rendererInfo.avgPoints) * 100,
            drawCallsChange: ((stats2.rendererInfo.avgCalls - stats1.rendererInfo.avgCalls) / stats1.rendererInfo.avgCalls) * 100,
        };
        
        return comparison;
    }

    // 运行完整测试
    async runFullTest(scene, camera, renderer, SplatMesh) {
        if (this.isRunning) {
            this.log('测试已在运行中...');
            return;
        }

        this.isRunning = true;
        this.testResults.tests = {};
        
        this.log('开始 3DGS 性能自动化测试 (已修复)...');
        this.updateProgress(0, '初始化测试...');

        // 收集系统信息
        this.testResults.metadata.gpu = this.getGPUInfo(renderer);
        this.testResults.metadata.canvas = {
            width: renderer.domElement.width,
            height: renderer.domElement.height,
            pixelRatio: renderer.getPixelRatio()
        };

        const modelKeys = Object.keys(this.models);
        
        try {
            const originalOnProgress = this.progressCallback; // The one connected to the UI

            for (let i = 0; i < modelKeys.length; i++) {
                const modelKey = modelKeys[i];
                const baseProgress = (i / modelKeys.length) * 100;
                const progressScope = 100 / modelKeys.length;

                // 包装 progress updater
                const scopedProgressCallback = (localProgress, msg) => {
                    if (originalOnProgress) {
                        const overallProgress = baseProgress + (localProgress / 100) * progressScope;
                        originalOnProgress(overallProgress, msg);
                    }
                };
                
                const testResult = await this.testModel(modelKey, scene, camera, renderer, SplatMesh, scopedProgressCallback);
                this.testResults.tests[modelKey] = testResult;
                
                if (i < modelKeys.length - 1) {
                    this.log('准备下一个测试...');
                    await this.wait(2000); // 测试间隔
                }
            }

            this.testResults.comparison = this.generateComparison();
            this.generateSummary();
            
            this.updateProgress(100, '测试完成！');
            this.log('所有测试完成，正在生成报告...');
            
            this.downloadResults();
            
        } catch (error) {
            this.log(`测试过程中发生严重错误: ${error.message}`);
        } finally {
            this.isRunning = false;
        }
    }

    // 生成测试总结
    generateSummary() {
        const tests = this.testResults.tests;
        const summary = {
            totalTests: Object.keys(tests).length,
            testDate: new Date().toLocaleString('zh-CN'),
            keyFindings: []
        };

        const comparison = this.testResults.comparison;
        if (comparison) {
            const key = Object.keys(comparison)[0];
            const compData = comparison[key];
            summary.keyFindings.push(
                `从 56k 升级到 150k 模型，点云数量增加了约 168%，这导致:`
            );
            summary.keyFindings.push(
                `  - 平均 FPS 下降 ${Math.abs(compData.fpsChange).toFixed(1)}%`
            );
            summary.keyFindings.push(
                `  - 平均渲染时间增加 ${compData.renderTimeChange.toFixed(1)}%`
            );
            summary.keyFindings.push(
                `  - 平均排序时间增加 ${compData.sortTimeChange.toFixed(1)}%`
            );
             summary.keyFindings.push(
                `  - GPU绘制调用 (Draw Calls) 增加 ${compData.drawCallsChange.toFixed(1)}%`
            );

            if (compData.sortTimeChange > compData.renderTimeChange) {
                summary.keyFindings.push("结论: '排序时间'的增长是主要的性能瓶颈。");
            } else {
                summary.keyFindings.push("结论: '渲染时间'的增长是主要的性能瓶颈。");
            }
        }
        this.testResults.summary = summary;
    }

    // 下载测试结果
    downloadResults() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `3dgs-performance-test-v2-${timestamp}.json`;
        
        const dataStr = JSON.stringify(this.testResults, (key, value) => 
            typeof value === 'number' ? parseFloat(value.toFixed(4)) : value, 
            2
        );
        // 添加 UTF-8 BOM 标记
        const utf8BOM = '\uFEFF';
        const dataBlob = new Blob([utf8BOM + dataStr], { 
            type: 'application/json;charset=utf-8' 
        });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        
        this.log(`测试结果已保存为: ${filename}`);
        this.log('请将此新生成的文件发送给我进行详细分析！');
    }

    // 获取当前测试状态
    getStatus() {
        return {
            isRunning: this.isRunning,
            currentTest: this.currentTest,
            hasResults: Object.keys(this.testResults.tests).length > 0
        };
    }
}

// 导出给全局使用
window.PerformanceTester = PerformanceTester; 