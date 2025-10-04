var U=Object.defineProperty;var I=(h,e,t)=>e in h?U(h,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):h[e]=t;var n=(h,e,t)=>I(h,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function t(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(r){if(r.ep)return;r.ep=!0;const o=t(r);fetch(r.href,o)}})();const k="modulepreload",O=function(h){return"/"+h},S={},j=function(e,t,a){let r=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),s=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));r=Promise.allSettled(t.map(c=>{if(c=O(c),c in S)return;S[c]=!0;const d=c.endsWith(".css"),f=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${f}`))return;const u=document.createElement("link");if(u.rel=d?"stylesheet":k,d||(u.as="script"),u.crossOrigin="",u.href=c,s&&u.setAttribute("nonce",s),document.head.appendChild(u),d)return new Promise((l,m)=>{u.addEventListener("load",l),u.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${c}`)))})}))}function o(i){const s=new Event("vite:preloadError",{cancelable:!0});if(s.payload=i,window.dispatchEvent(s),!s.defaultPrevented)throw i}return r.then(i=>{for(const s of i||[])s.status==="rejected"&&o(s.reason);return e().catch(o)})};class G{constructor(e){n(this,"module");n(this,"allocatedPointers");n(this,"structPointers");this.module=e,this.allocatedPointers=new Set,this.structPointers=new Map}allocateAndCopy(e){const t=e.byteLength,a=this.module._malloc(t);if(!a)throw new Error(`Failed to allocate ${t} bytes in WASM memory`);const r=new Uint8Array(e);return this.module.writeArrayToMemory(r,a),this.allocatedPointers.add(a),{ptr:a,size:t}}createTemplateConfig(e){const a=this.module._malloc(128);if(!a)throw new Error("Failed to allocate AvatarTemplateConfig structure");const r=this.allocateAndCopy(e.flameModel),o=this.allocateAndCopy(e.headTemplate),i=this.allocateAndCopy(e.landmarks),s=this.allocateAndCopy(e.masks),c=this.allocateAndCopy(e.lEyelid),d=this.allocateAndCopy(e.rEyelid),f=this.allocateAndCopy(e.teethObj),u=this.allocateAndCopy(e.teethNpz);let l=0;return this.module.setValue(a+l,r.ptr,"i32"),l+=4,this.module.setValue(a+l,r.size,"i32"),l+=4,this.module.setValue(a+l,o.ptr,"i32"),l+=4,this.module.setValue(a+l,o.size,"i32"),l+=4,this.module.setValue(a+l,i.ptr,"i32"),l+=4,this.module.setValue(a+l,i.size,"i32"),l+=4,this.module.setValue(a+l,s.ptr,"i32"),l+=4,this.module.setValue(a+l,s.size,"i32"),l+=4,this.module.setValue(a+l,c.ptr,"i32"),l+=4,this.module.setValue(a+l,c.size,"i32"),l+=4,this.module.setValue(a+l,d.ptr,"i32"),l+=4,this.module.setValue(a+l,d.size,"i32"),l+=4,this.module.setValue(a+l,f.ptr,"i32"),l+=4,this.module.setValue(a+l,f.size,"i32"),l+=4,this.module.setValue(a+l,u.ptr,"i32"),l+=4,this.module.setValue(a+l,u.size,"i32"),l+=4,this.structPointers.set("template_config",a),a}createCharacterData(e,t){const r=this.module._malloc(16);if(!r)throw new Error("Failed to allocate AvatarCharacterData structure");const o=this.allocateAndCopy(e),i=this.allocateAndCopy(t);let s=0;return this.module.setValue(r+s,o.ptr,"i32"),s+=4,this.module.setValue(r+s,o.size,"i32"),s+=4,this.module.setValue(r+s,i.ptr,"i32"),s+=4,this.module.setValue(r+s,i.size,"i32"),s+=4,this.structPointers.set("character_data",r),r}createFlameParams(e){var o,i,s,c,d,f,u;const a=this.module._malloc(1672);if(!a)throw new Error("Failed to allocate AvatarFlameParams structure");let r=0;for(let l=0;l<300;l++){const m=((o=e.shape_params)==null?void 0:o[l])||0;this.module.setValue(a+r,m,"float"),r+=4}for(let l=0;l<100;l++){const m=((i=e.expr_params)==null?void 0:i[l])||0;this.module.setValue(a+r,m,"float"),r+=4}for(let l=0;l<3;l++){const m=((s=e.rotation)==null?void 0:s[l])||0;this.module.setValue(a+r,m,"float"),r+=4}for(let l=0;l<3;l++){const m=((c=e.translation)==null?void 0:c[l])||0;this.module.setValue(a+r,m,"float"),r+=4}for(let l=0;l<3;l++){const m=((d=e.neck_pose)==null?void 0:d[l])||0;this.module.setValue(a+r,m,"float"),r+=4}for(let l=0;l<3;l++){const m=((f=e.jaw_pose)==null?void 0:f[l])||0;this.module.setValue(a+r,m,"float"),r+=4}for(let l=0;l<6;l++){const m=((u=e.eyes_pose)==null?void 0:u[l])||0;this.module.setValue(a+r,m,"float"),r+=4}return a}readSplatPointFlatArray(e){if(!e)throw new Error("Invalid array pointer");const t=this.module.getValue(e,"i32"),a=this.module.getValue(e+4,"i32");if(a===0||!t)return null;const o=a*13,i=t/4,s=new Float32Array(o);return s.set(this.module.HEAPF32.subarray(i,i+o)),s}readMeshData(e){const t=this.module.getValue(e+0,"*"),a=this.module.getValue(e+4,"i32"),r=this.module.getValue(e+8,"*"),o=this.module.getValue(e+12,"i32"),i=this.module.getValue(e+16,"float"),s=this.module.getValue(e+20,"*"),c=this.module.getValue(e+24,"i32"),d=new Float32Array(a*3);if(t&&a>0)for(let l=0;l<a*3;l++)d[l]=this.module.getValue(t+l*4,"float");const f=new Uint32Array(o*3);if(r&&o>0)for(let l=0;l<o*3;l++)f[l]=this.module.getValue(r+l*4,"i32");let u=null;if(s&&c>0){u=new Float32Array(c*3);for(let l=0;l<c*3;l++)u[l]=this.module.getValue(s+l*4,"float")}return{vertices:d,vertexCount:a,faces:f,faceCount:o,landmarks:u,landmarkCount:c,computeTime:i}}free(e){e&&this.allocatedPointers.has(e)&&(this.module._free(e),this.allocatedPointers.delete(e))}freeStruct(e){const t=this.structPointers.get(e);t&&(this.module._free(t),this.structPointers.delete(e))}cleanup(){for(const e of this.allocatedPointers)this.module._free(e);this.allocatedPointers.clear();for(const[,e]of this.structPointers)this.module._free(e);this.structPointers.clear()}getMemoryStats(){return{allocatedPointers:this.allocatedPointers.size,structPointers:this.structPointers.size,totalAllocatedMB:Math.round(this.allocatedPointers.size*1024/1024)}}}class q{constructor(e={}){n(this,"options");n(this,"baseUrl");n(this,"cache");n(this,"loadingPromises");n(this,"templateResources");n(this,"characterResources");this.options={baseAssetsPath:"/",modelFolder:"3dgs",enableCache:!0,retryCount:3,retryDelay:1e3,enableProgressCallback:!0,baseUrl:"",...e},this.baseUrl=e.baseUrl||"",this.cache=new Map,this.loadingPromises=new Map,this.templateResources={flameModel:"flame_model.pb",headTemplate:"head_template_mesh.obj",landmarks:"flame_landmark_embedding.json",masks:"flame_masks.json",lEyelid:"l_eyelid.json",rEyelid:"r_eyelid.json",teethObj:"fine_teeth.obj",teethNpz:"fine_teeth.npz"},this.characterResources={shape:"shape.pb",pointCloud:"point_cloud.ply"}}async loadTemplateResources(e=null){const t=Object.keys(this.templateResources).length;let a=0;const r=(o,i)=>{i&&a++,e&&this.options.enableProgressCallback&&e({stage:"template_resources",filename:o,loaded:a,total:t,progress:a/t*100})};try{const o=Object.entries(this.templateResources).map(async([c,d])=>{r(d,!1);const f=await this.loadBinaryResource(`${this.options.baseAssetsPath}/flame/${d}`);return r(d,!0),[c,f]}),i=await Promise.all(o);return Object.fromEntries(i)}catch(o){console.error("❌ Failed to load template resources:",o);const i=o instanceof Error?o.message:String(o);throw new Error(`Template resources loading failed: ${i}`)}}async loadCharacterData(e=null){const t=Object.keys(this.characterResources).length;let a=0;const r=(o,i)=>{i&&a++,e&&this.options.enableProgressCallback&&e({stage:"character_data",filename:o,loaded:a,total:t,progress:a/t*100})};try{const o=this.options.modelFolder,[i,s]=await Promise.all([this.loadBinaryResource(`${this.options.baseAssetsPath}/${o}/${this.characterResources.shape}`,d=>r(this.characterResources.shape,d)),this.loadBinaryResource(`${this.options.baseAssetsPath}/${o}/${this.characterResources.pointCloud}`,d=>r(this.characterResources.pointCloud,d))]);return{shape:i,pointCloud:s}}catch(o){console.error("❌ Failed to load character data:",o);const i=o instanceof Error?o.message:String(o);throw new Error(`Character data loading failed: ${i}`)}}async loadAnimationData(){try{const e=`${this.options.baseAssetsPath}/${this.options.modelFolder}/idle.pb`;return await this.loadBinaryResource(e)}catch(e){console.error("❌ Failed to load animation data:",e);const t=e instanceof Error?e.message:String(e);throw new Error(`Animation data loading failed: ${t}`)}}async loadBinaryResource(e,t=null){if(this.options.enableCache&&this.cache.has(e))return t&&t(!0),this.cache.get(e);if(this.loadingPromises.has(e))return await this.loadingPromises.get(e);const a=this.loadBinaryResourceInternal(e,t);this.loadingPromises.set(e,a);try{const r=await a;return this.options.enableCache&&this.cache.set(e,r),r}finally{this.loadingPromises.delete(e)}}async loadBinaryResourceInternal(e,t=null){let a=null;const r=this.baseUrl?`${this.baseUrl}${e}`:e;for(let o=1;o<=this.options.retryCount;o++)try{const i=await fetch(r);if(!i.ok)throw new Error(`HTTP ${i.status}: ${i.statusText}`);const s=i.headers.get("content-type");this.validateContentType(e,s);const c=await i.arrayBuffer();if(c.byteLength===0)throw new Error("Received empty file");return t&&t(!0),o>1,c}catch(i){a=i instanceof Error?i:new Error(String(i)),o<this.options.retryCount&&await this.delay(this.options.retryDelay*o)}throw new Error(`Failed to load ${e} after ${this.options.retryCount} attempts: ${(a==null?void 0:a.message)||"Unknown error"}`)}validateContentType(e,t){var i;const a={".pb":["application/octet-stream","application/x-protobuf"],".obj":["text/plain","application/octet-stream"],".json":["application/json","text/plain"],".ply":["application/octet-stream","text/plain"],".npz":["application/octet-stream","application/zip"]},r=(i=e.split(".").pop())==null?void 0:i.toLowerCase(),o=r?a[`.${r}`]:void 0;o&&t&&o.some(s=>t.includes(s))}async delay(e){return new Promise(t=>setTimeout(t,e))}getTotalSizeMB(e){let t=0;for(const a of Object.values(e))a instanceof ArrayBuffer&&(t+=a.byteLength);return(t/(1024*1024)).toFixed(2)}clearCache(){this.cache.clear(),this.loadingPromises.clear()}getCacheStats(){let e=0,t=0;for(const a of this.cache.values())e+=a.byteLength,t++;return{files:t,totalSizeMB:(e/(1024*1024)).toFixed(2),cacheHitRate:this.cache.size>0?(this.cache.size/(this.cache.size+this.loadingPromises.size)*100).toFixed(1):"0"}}async preloadAllResources(e=null){try{const[t,a]=await Promise.all([this.loadTemplateResources(e),this.loadCharacterData(e)]);return{templateResources:t,characterData:a}}catch(t){console.error("❌ Failed to preload resources:",t);const a=t instanceof Error?t.message:String(t);throw new Error(`Resource preloading failed: ${a}`)}}}class ${constructor(e={}){n(this,"options");n(this,"wasmConfig");n(this,"wasmModule");n(this,"memoryManager");n(this,"resourceLoader");n(this,"coreHandle");n(this,"characterHandle");n(this,"animationHandle");n(this,"totalFrames");n(this,"isInitialized");n(this,"isCharacterLoaded");n(this,"api");n(this,"performanceMetrics");n(this,"wasmTime",0);n(this,"errorCodes");n(this,"flameInfo");n(this,"characterInfo");this.options={logLevel:"basic",enableValidation:!0,enablePerformanceMetrics:!0,retryCount:3,baseAssetsPath:"/",modelFolder:"3dgs",wasmPath:"/avatar_core_wasm.wasm",...e},this.wasmConfig=e.wasmConfig||{},this.wasmModule=null,this.memoryManager=null,this.resourceLoader=null,this.coreHandle=null,this.characterHandle=null,this.animationHandle=null,this.totalFrames=null,this.isInitialized=!1,this.isCharacterLoaded=!1,this.api={},this.performanceMetrics={initTime:0,loadTime:0,computeFrames:0,totalComputeTime:0,averageComputeTime:0},this.errorCodes={0:"AVATAR_SUCCESS",1:"AVATAR_ERROR_INVALID_PARAMETER",2:"AVATAR_ERROR_MEMORY_ALLOCATION",3:"AVATAR_ERROR_INVALID_DATA_FORMAT",4:"AVATAR_ERROR_CHARACTER_NOT_FOUND",5:"AVATAR_ERROR_ANIMATION_NOT_FOUND",6:"AVATAR_ERROR_COMPUTATION_FAILED"}}async initialize(e=null){const t=performance.now();try{await this.updateProgress(e,"Initializing WASM module...",10),await this.loadWASMModule(),await this.updateProgress(e,"Loading template resources...",30);const a=await this.resourceLoader.loadTemplateResources();return await this.updateProgress(e,"Initializing Avatar Core...",60),await this.initializeAvatarCore(a),await this.updateProgress(e,"System ready",100),this.isInitialized=!0,this.performanceMetrics.initTime=performance.now()-t,!0}catch(a){console.error("❌ Avatar Core initialization failed:",a);const r=a instanceof Error?a.message:String(a);throw new Error(`Avatar Core initialization failed: ${r}`)}}async loadWASMModule(){try{const{default:e}=await j(async()=>{const{default:t}=await import("./avatar_core_wasm-CwEDTqcO.js");return{default:t}},[]);this.wasmConfig&&Object.keys(this.wasmConfig).length>0?this.wasmModule=await e(this.wasmConfig):this.wasmModule=await e(),this.validateWASMModule(),this.memoryManager=new G(this.wasmModule),this.resourceLoader=new q({baseAssetsPath:this.options.baseAssetsPath,modelFolder:this.options.modelFolder,baseUrl:this.wasmConfig.baseUrl}),this.setupCAPIFunctions()}catch(e){const t=e instanceof Error?e.message:String(e);throw new Error(`Failed to load WASM module: ${t}`)}}validateWASMModule(){const e=["cwrap","_malloc","_free","setValue","getValue","writeArrayToMemory"];for(const t of e)if(typeof this.wasmModule[t]!="function")throw new Error(`WASM module missing required function: ${t}`);this.initializeMemoryViews()}initializeMemoryViews(){try{const e=this.wasmModule._malloc(4);if(!e)throw new Error("Memory allocation test failed");const t=305419896;if(this.wasmModule.setValue(e,t,"i32"),this.wasmModule.getValue(e,"i32")!==t)throw new Error("Memory read/write test failed");this.wasmModule._free(e)}catch(e){const t=e instanceof Error?e.message:String(e);throw new Error(`Memory system initialization failed: ${t}`)}}setupCAPIFunctions(){this.api={initialize:this.wasmModule.cwrap("avatar_core_initialize","number",["number"]),release:this.wasmModule.cwrap("avatar_core_release",null,["number"]),getVersion:this.wasmModule.cwrap("avatar_core_get_version","string",[]),getErrorString:this.wasmModule.cwrap("avatar_core_get_error_string","string",["number"]),loadCharacter:this.wasmModule.cwrap("avatar_core_load_character","number",["number","number"]),removeCharacter:this.wasmModule.cwrap("avatar_core_remove_character",null,["number","number"]),getCharacterInfo:this.wasmModule.cwrap("avatar_core_get_character_info","number",["number","number","number"]),loadAnimation:this.wasmModule.cwrap("avatar_core_load_animation","number",["number","number"]),parseAnimationFramesFromFile:this.wasmModule.cwrap("avatar_core_parse_animation_frames_from_file","number",["number","number","number"]),getAnimationFrameCount:this.wasmModule.cwrap("avatar_core_get_animation_frame_count","number",["number","number"]),getFrameFromAnimation:this.wasmModule.cwrap("avatar_core_get_frame_from_animation","number",["number","number","number"]),computeFrameFlat:this.wasmModule.cwrap("avatar_core_compute_frame_as_splat_points_flat","number",["number","number","number","number"]),freeSplatPointsFlat:this.wasmModule.cwrap("avatar_core_free_splat_points_flat",null,["number"]),computeFrameAsMesh:this.wasmModule.cwrap("avatar_core_compute_frame_as_mesh","number",["number","number","number","number"]),freeMeshData:this.wasmModule.cwrap("avatar_core_free_mesh_data",null,["number"]),setEyeTrackingConfig:this.wasmModule.cwrap("avatar_core_set_eye_tracking_config","number",["number","number"]),setGazeTarget:this.wasmModule.cwrap("avatar_core_set_gaze_target","number",["number","number","number","number"]),resetEyeTracking:this.wasmModule.cwrap("avatar_core_reset_eye_tracking","number",["number"]),getFlameInfo:this.wasmModule.cwrap("avatar_core_get_flame_info","number",["number","number","number","number"])}}async initializeAvatarCore(e){try{const t=this.memoryManager.createTemplateConfig(e),a=this.api.initialize(t);if(!a)throw new Error("avatar_core_initialize returned NULL - initialization failed");this.coreHandle=a,await this.queryFlameInfo()}catch(t){const a=t instanceof Error?t.message:String(t);throw new Error(`Failed to initialize Avatar Core: ${a}`)}}async loadCharacter(e=null){if(!this.isInitialized)throw new Error("Avatar Core not initialized");const t=performance.now();try{await this.updateProgress(e,"Loading character data...",20);const a=await this.resourceLoader.loadCharacterData();await this.updateProgress(e,"Creating character...",60);const r=this.memoryManager.createCharacterData(a.shape,a.pointCloud),o=this.api.loadCharacter(this.coreHandle,r);if(!o)throw new Error("avatar_core_load_character returned NULL - character loading failed");return this.characterHandle=o,this.isCharacterLoaded=!0,await this.queryCharacterInfo(),await this.updateProgress(e,"Character loaded",100),this.performanceMetrics.loadTime=performance.now()-t,!0}catch(a){console.error("❌ Character loading failed:",a);const r=a instanceof Error?a.message:String(a);throw new Error(`Character loading failed: ${r}`)}}async loadAnimationFromData(e){const t=this.memoryManager.allocateAndCopy(e),a=this.wasmModule._malloc(8);this.wasmModule.setValue(a,t.ptr,"i32"),this.wasmModule.setValue(a+4,t.size,"i32");const r=this.api.loadAnimation(this.coreHandle,a);if(this.wasmModule._free(a),!r)throw new Error("avatar_core_load_animation returned NULL");return r}async loadAnimation(){if(this.animationHandle)return this.animationHandle;if(!this.isInitialized)throw new Error("Avatar Core not initialized");try{const e=await this.resourceLoader.loadAnimationData();return this.animationHandle=await this.loadAnimationFromData(e),await this.getAnimationTotalFrames(),this.animationHandle}catch(e){console.error("❌ Failed to load animation:",e);const t=e instanceof Error?e.message:String(e);throw new Error(`Failed to load animation: ${t}`)}}async switchAnimationFile(e){if(!this.isInitialized)throw new Error("Avatar Core not initialized");try{const t=`${this.options.baseAssetsPath}/${this.options.modelFolder}/${e}`,a=this.wasmConfig.baseUrl?`${this.wasmConfig.baseUrl}${t}`:t,r=await fetch(a);if(!r.ok)throw new Error(`HTTP error! status: ${r.status}`);const o=await r.arrayBuffer(),i=await this.loadAnimationFromData(o);return this.animationHandle=i,this.totalFrames=null,await this.getAnimationTotalFrames(),this.totalFrames}catch(t){console.error(`❌ Failed to switch animation to ${e}:`,t);const a=t instanceof Error?t.message:String(t);throw new Error(`Failed to switch animation: ${a}`)}}async getAnimationTotalFrames(){if(this.totalFrames!==null)return this.totalFrames;if(!this.animationHandle)return await this.loadAnimation(),this.totalFrames;try{const e=this.wasmModule._malloc(4),t=this.api.getAnimationFrameCount(this.animationHandle,e);if(t!==0){this.wasmModule._free(e);const r=this.api.getErrorString(t);throw new Error(`Failed to get animation frame count: ${r}`)}const a=this.wasmModule.getValue(e,"i32");return this.wasmModule._free(e),this.totalFrames=a,a}catch(e){console.error("❌ Failed to get animation frame count:",e);const t=e instanceof Error?e.message:String(e);throw new Error(`Failed to get animation frame count: ${t}`)}}async getAnimationFrameParams(e=0){this.animationHandle||await this.loadAnimation(),this.totalFrames!==null&&this.totalFrames>0&&(e=e%this.totalFrames,e<0&&(e+=this.totalFrames));try{const t=this.wasmModule._malloc(472),a=this.api.getFrameFromAnimation(this.animationHandle,e,t);if(a!==0){this.wasmModule._free(t);const r=this.api.getErrorString(a);throw new Error(`Failed to get frame ${e}: ${r}`)}return t}catch(t){console.error(`❌ Failed to get animation frame ${e}:`,t);const a=t instanceof Error?t.message:String(t);throw new Error(`Failed to get animation frame ${e}: ${a}`)}}async setGazeTarget(e,t,a){if(!this.isCharacterLoaded)throw new Error("Character not loaded");try{const r=this.api.setGazeTarget(this.coreHandle,e,t,a);return this.checkError(r,"avatar_core_set_gaze_target"),!0}catch(r){console.error("❌ Failed to set gaze target:",r);const o=r instanceof Error?r.message:String(r);throw new Error(`Failed to set gaze target: ${o}`)}}async resetEyeTracking(){if(!this.isCharacterLoaded)throw new Error("Character not loaded");try{const e=this.api.resetEyeTracking(this.coreHandle);return this.checkError(e,"avatar_core_reset_eye_tracking"),!0}catch(e){console.error("❌ Failed to reset eye tracking:",e);const t=e instanceof Error?e.message:String(e);throw new Error(`Failed to reset eye tracking: ${t}`)}}async queryFlameInfo(){try{const e=this.wasmModule._malloc(4),t=this.wasmModule._malloc(4),a=this.wasmModule._malloc(4),r=this.api.getFlameInfo(this.coreHandle,e,t,a);this.checkError(r,"avatar_core_get_flame_info");const o=this.wasmModule.getValue(e,"i32"),i=this.wasmModule.getValue(t,"i32"),s=this.wasmModule.getValue(a,"i32");this.wasmModule._free(e),this.wasmModule._free(t),this.wasmModule._free(a),this.flameInfo={vertexCount:o,faceCount:i,jointCount:s}}catch(e){const t=e instanceof Error?e.message:String(e);console.error("❌ Failed to query FLAME info:",t)}}async queryCharacterInfo(){try{const e=this.wasmModule._malloc(4),t=this.wasmModule._malloc(1),a=this.api.getCharacterInfo(this.characterHandle,e,t);this.checkError(a,"avatar_core_get_character_info");const r=this.wasmModule.getValue(e,"i32"),o=this.wasmModule.getValue(t,"i8")!==0;this.wasmModule._free(e),this.wasmModule._free(t),this.characterInfo={pointCount:r,hasAnimation:o}}catch(e){const t=e instanceof Error?e.message:String(e);console.error("❌ Failed to query character info:",t)}}checkError(e,t){if(e!==0){const a=this.errorCodes[e]||`UNKNOWN_ERROR_${e}`,r=this.api.getErrorString(e);throw console.error(`❌ ${t} failed: code=${e}, name=${a}, message=${r}`),new Error(`${t} failed: ${a} - ${r}`)}}async updateProgress(e,t,a){e&&typeof e=="function"&&e({message:t,progress:a})}getPerformanceMetrics(){var e,t,a,r;return{...this.performanceMetrics,memoryStats:(e=this.memoryManager)==null?void 0:e.getMemoryStats(),cacheStats:(t=this.resourceLoader)==null?void 0:t.getCacheStats(),flameInfo:this.flameInfo,characterInfo:this.characterInfo,version:((r=(a=this.api).getVersion)==null?void 0:r.call(a))||"unknown"}}async release(){try{this.characterHandle&&this.coreHandle&&(this.api.removeCharacter(this.coreHandle,this.characterHandle),this.characterHandle=null,this.isCharacterLoaded=!1),this.coreHandle&&(this.api.release(this.coreHandle),this.coreHandle=null),this.memoryManager&&this.memoryManager.cleanup(),this.resourceLoader&&this.resourceLoader.clearCache(),this.isInitialized=!1}catch(e){console.error("❌ Failed to release resources:",e)}}async loadFlameModel(e){return!0}async load3DGSData(e,t,a){return!0}async computeCompleteFrameFlat(e){if(!this.isCharacterLoaded)throw new Error("Character not loaded");const t=performance.now();let a=null,r=null;try{const o=(e==null?void 0:e.frameIndex)??0;r=await this.getAnimationFrameParams(o),a=this.wasmModule._malloc(16);const i=this.api.computeFrameFlat(this.coreHandle,this.characterHandle,r,a);this.checkError(i,"avatar_core_compute_frame_as_splat_points_flat");const s=this.memoryManager.readSplatPointFlatArray(a),c=performance.now()-t;return this.wasmTime=c,this.performanceMetrics.computeFrames++,this.performanceMetrics.totalComputeTime+=c,this.performanceMetrics.averageComputeTime=this.performanceMetrics.totalComputeTime/this.performanceMetrics.computeFrames,s}catch(o){console.error("❌ computeCompleteFrameFlat failed:",o);const i=o instanceof Error?o.message:String(o);throw new Error(`computeCompleteFrameFlat failed: ${i}`)}finally{a!==null&&(this.api.freeSplatPointsFlat(a),this.wasmModule._free(a)),r!==null&&this.wasmModule._free(r)}}async computeFrameAsMeshFromUserParams(e){if(!this.isCharacterLoaded)throw new Error("Character not loaded");const t=performance.now();let a=null;try{const r=this.convertUserParamsToFlameParams(e),o=this.memoryManager.createFlameParams(r);a=this.wasmModule._malloc(28);const i=this.api.computeFrameAsMesh(this.coreHandle,this.characterHandle,o,a);this.checkError(i,"avatar_core_compute_frame_as_mesh");const s=this.memoryManager.readMeshData(a);this.wasmModule._free(o),this.api.freeMeshData(a);const c=performance.now()-t;return this.performanceMetrics.computeFrames++,this.performanceMetrics.totalComputeTime+=c,this.performanceMetrics.averageComputeTime=this.performanceMetrics.totalComputeTime/this.performanceMetrics.computeFrames,{vertices:s.vertices||new Float32Array,vertexCount:s.vertexCount,faces:s.faces||new Uint32Array,faceCount:s.faceCount,landmarks:s.landmarks||new Float32Array,landmarkCount:s.landmarkCount,computeTime:s.computeTime,totalTime:c}}catch(r){console.error("❌ Mesh computation failed:",r);const o=r instanceof Error?r.message:String(r);throw new Error(`Mesh computation failed: ${o}`)}finally{a!==null&&this.wasmModule._free(a)}}convertUserParamsToFlameParams(e){return{shape_params:e.shape_params||Array(300).fill(0),expr_params:e.expr_params||Array(100).fill(0),rotation:e.rotation||[0,0,0],translation:e.translation||[0,0,0],neck_pose:e.neck_pose||[0,0,0],jaw_pose:e.jaw_pose||[0,0,0],eyes_pose:e.eyes_pose||[0,0,0,0,0,0],eyelid:e.eyelid||[0,0],has_eyelid:e.eyelid&&e.eyelid.length>=2}}async computeFrameAsMesh(e){if(!this.isCharacterLoaded)throw new Error("Character not loaded");const t=performance.now();let a=null;try{const r=this.memoryManager.createFlameParams(e);a=this.wasmModule._malloc(32);const o=this.api.computeFrameAsMesh(this.coreHandle,this.characterHandle,r,a);this.checkError(o,"avatar_core_compute_frame_as_mesh");const i=this.memoryManager.readMeshData(a);this.wasmModule._free(r),this.api.freeMeshData(a);const s=performance.now()-t;return this.performanceMetrics.computeFrames++,this.performanceMetrics.totalComputeTime+=s,this.performanceMetrics.averageComputeTime=this.performanceMetrics.totalComputeTime/this.performanceMetrics.computeFrames,{vertices:i.vertices||new Float32Array,vertexCount:i.vertexCount,faces:i.faces||new Uint32Array,faceCount:i.faceCount,landmarks:i.landmarks||new Float32Array,landmarkCount:i.landmarkCount,computeTime:i.computeTime,totalTime:s}}catch(r){console.error("❌ Mesh computation failed:",r);const o=r instanceof Error?r.message:String(r);throw new Error(`Mesh computation failed: ${o}`)}finally{a!==null&&this.wasmModule._free(a)}}async computeCompleteFrameAsMesh(e){if(!this.isCharacterLoaded)throw new Error("Character not loaded");try{const t=(e==null?void 0:e.frameIndex)??0,a=await this.getAnimationFrameParams(t),r=await this.computeFrameAsMeshWithPtr(a);return this.wasmModule._free(a),r}catch(t){console.error("❌ computeCompleteFrameAsMesh failed:",t);const a=t instanceof Error?t.message:String(t);throw new Error(`computeCompleteFrameAsMesh failed: ${a}`)}}async computeFrameAsMeshWithPtr(e){const t=performance.now();let a=null;try{a=this.wasmModule._malloc(32);const r=this.api.computeFrameAsMesh(this.coreHandle,this.characterHandle,e,a);this.checkError(r,"avatar_core_compute_frame_as_mesh");const o=this.memoryManager.readMeshData(a);(!o.vertices||o.vertices.length===0)&&console.error("❌ [MESH COMPUTE RESULT] No vertices in result!"),this.api.freeMeshData(a);const i=performance.now()-t;return this.performanceMetrics.computeFrames++,this.performanceMetrics.totalComputeTime+=i,this.performanceMetrics.averageComputeTime=this.performanceMetrics.totalComputeTime/this.performanceMetrics.computeFrames,{vertices:o.vertices||new Float32Array,vertexCount:o.vertexCount,faces:o.faces||new Uint32Array,faceCount:o.faceCount,landmarks:o.landmarks||new Float32Array,landmarkCount:o.landmarkCount,computeTime:o.computeTime,totalTime:i}}catch(r){console.error("❌ Mesh computation failed:",r);const o=r instanceof Error?r.message:String(r);throw new Error(`Mesh computation failed: ${o}`)}finally{a!==null&&this.wasmModule._free(a)}}}const H=`#version 300 es
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
`;class W{constructor(e,t){n(this,"canvas");n(this,"backgroundColor");n(this,"gl");n(this,"shaderProgram");n(this,"uniformLocations");n(this,"attributeLocations");n(this,"splatBuffer");n(this,"quadVertexBuffer");n(this,"vertexArray");n(this,"splatCount");n(this,"isInitialized");n(this,"splatBufferSize");this.canvas=e,this.backgroundColor=t||[1,1,1,1],this.gl=null,this.shaderProgram=null,this.uniformLocations={},this.attributeLocations={},this.splatBuffer=null,this.quadVertexBuffer=null,this.vertexArray=null,this.splatCount=0,this.isInitialized=!1,this.splatBufferSize=0}async initialize(){try{if(this.gl=this.canvas.getContext("webgl2",{antialias:!1,alpha:!1,premultipliedAlpha:!0,powerPreference:"high-performance",preserveDrawingBuffer:!1}),!this.gl)throw new Error("WebGL2 not supported");const e=this.gl;this.shaderProgram=this.createShaderProgram(e),this.setupShaderLocations(),this.setupWebGLState(),this.createBuffers(),this.isInitialized=!0}catch(e){throw e}}setupShaderLocations(){const e=this.gl;if(!e)throw new Error("WebGL context not initialized");const t=this.shaderProgram;if(!t)throw new Error("Shader program not initialized");this.uniformLocations={viewMatrix:e.getUniformLocation(t,"u_viewMatrix"),projectionMatrix:e.getUniformLocation(t,"u_projectionMatrix"),screenSize:e.getUniformLocation(t,"u_screenSize"),enableFrustumCulling:e.getUniformLocation(t,"u_enableFrustumCulling")},this.attributeLocations={quadVertex:0,position:1,color:2,covA:3,covB:4}}setupWebGLState(){const e=this.gl;if(!e)throw new Error("WebGL context not initialized");e.disable(e.DEPTH_TEST),e.depthMask(!0),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),e.clearColor(this.backgroundColor[0],this.backgroundColor[1],this.backgroundColor[2],this.backgroundColor[3])}createBuffers(){const e=this.gl;if(!e)throw new Error("WebGL context not initialized");this.vertexArray=e.createVertexArray(),this.splatBuffer=e.createBuffer(),this.createQuadVertexBuffer()}createQuadVertexBuffer(){const e=this.gl;if(!e)throw new Error("WebGL context not initialized");const t=new Float32Array([-1,-1,-1,1,1,-1,1,1]);this.quadVertexBuffer=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,this.quadVertexBuffer),e.bufferData(e.ARRAY_BUFFER,t,e.STATIC_DRAW)}loadSplatsFromPackedData(e,t,a){if(!this.isInitialized)throw new Error("Renderer not initialized");this.splatCount=t,this.uploadToGPU(e)}uploadToGPU(e){const t=this.gl;if(!t)throw new Error("WebGL context not initialized");t.bindBuffer(t.ARRAY_BUFFER,this.splatBuffer),this.splatBufferSize!==e.byteLength?(t.bufferData(t.ARRAY_BUFFER,e,t.DYNAMIC_DRAW),this.splatBufferSize=e.byteLength):t.bufferSubData(t.ARRAY_BUFFER,0,e)}setupVertexAttributes(){const e=this.gl;if(!e)throw new Error("WebGL context not initialized");e.bindVertexArray(this.vertexArray),e.bindBuffer(e.ARRAY_BUFFER,this.quadVertexBuffer),e.enableVertexAttribArray(this.attributeLocations.quadVertex),e.vertexAttribPointer(this.attributeLocations.quadVertex,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,this.splatBuffer);const t=13,a=4,r=t*a;e.enableVertexAttribArray(this.attributeLocations.position),e.vertexAttribPointer(this.attributeLocations.position,3,e.FLOAT,!1,r,0),e.vertexAttribDivisor(this.attributeLocations.position,1),e.enableVertexAttribArray(this.attributeLocations.color),e.vertexAttribPointer(this.attributeLocations.color,4,e.FLOAT,!1,r,3*a),e.vertexAttribDivisor(this.attributeLocations.color,1),e.enableVertexAttribArray(this.attributeLocations.covA),e.vertexAttribPointer(this.attributeLocations.covA,3,e.FLOAT,!1,r,7*a),e.vertexAttribDivisor(this.attributeLocations.covA,1),e.enableVertexAttribArray(this.attributeLocations.covB),e.vertexAttribPointer(this.attributeLocations.covB,3,e.FLOAT,!1,r,10*a),e.vertexAttribDivisor(this.attributeLocations.covB,1)}render(e,t,a){if(!this.isInitialized||this.splatCount===0)return;const r=this.gl;if(!r)throw new Error("WebGL context not initialized");r.viewport(0,0,a[0],a[1]),r.clearColor(this.backgroundColor[0],this.backgroundColor[1],this.backgroundColor[2],this.backgroundColor[3]),r.clear(r.COLOR_BUFFER_BIT|r.DEPTH_BUFFER_BIT),r.useProgram(this.shaderProgram),r.uniformMatrix4fv(this.uniformLocations.viewMatrix,!1,e),r.uniformMatrix4fv(this.uniformLocations.projectionMatrix,!1,t),r.uniform2fv(this.uniformLocations.screenSize,a),r.uniform1i(this.uniformLocations.enableFrustumCulling,1),this.setupVertexAttributes(),r.drawArraysInstanced(r.TRIANGLE_STRIP,0,4,this.splatCount)}createShaderProgram(e){const t=e.createShader(e.VERTEX_SHADER);if(!t)throw new Error("Failed to create vertex shader");if(e.shaderSource(t,H),e.compileShader(t),!e.getShaderParameter(t,e.COMPILE_STATUS)){const o=e.getShaderInfoLog(t);throw e.deleteShader(t),new Error("顶点着色器编译失败: "+o)}const a=e.createShader(e.FRAGMENT_SHADER);if(!a)throw e.deleteShader(t),new Error("Failed to create fragment shader");if(e.shaderSource(a,N),e.compileShader(a),!e.getShaderParameter(a,e.COMPILE_STATUS)){const o=e.getShaderInfoLog(a);throw e.deleteShader(t),e.deleteShader(a),new Error("片段着色器编译失败: "+o)}const r=e.createProgram();if(!r)throw e.deleteShader(t),e.deleteShader(a),new Error("Failed to create shader program");if(e.attachShader(r,t),e.attachShader(r,a),e.linkProgram(r),!e.getProgramParameter(r,e.LINK_STATUS)){const o=e.getProgramInfoLog(r);throw e.deleteShader(t),e.deleteShader(a),e.deleteProgram(r),new Error("着色器程序链接失败: "+o)}return e.deleteShader(t),e.deleteShader(a),r}dispose(){if(!this.gl)return;const e=this.gl;this.splatBuffer&&e.deleteBuffer(this.splatBuffer),this.quadVertexBuffer&&e.deleteBuffer(this.quadVertexBuffer),this.vertexArray&&e.deleteVertexArray(this.vertexArray),this.shaderProgram&&e.deleteProgram(this.shaderProgram),this.isInitialized=!1}}const Y=`/**
 * WebGPU 3DGS 渲染着色器
 *
 * 实例化渲染：每个 splat 绘制一个四边形
 * 对应 WebGL 版本的 GLSL 着色器
 */

// ============ Uniform Bindings ============

struct Uniforms {
  viewMatrix: mat4x4f,
  projectionMatrix: mat4x4f,
  screenSize: vec2f,
  enableFrustumCulling: u32,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

// ============ Storage Buffer Bindings (间接索引渲染) ============

@group(1) @binding(0) var<storage, read> sortIndices: array<u32>;
@group(1) @binding(1) var<storage, read> splatData: array<f32>;

// ============ Vertex Shader ============

struct VertexInput {
  // 共享四边形顶点 (per-vertex)
  @location(0) quadVertex: vec2f,
}

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) relativePosition: vec2f,
  @location(1) color: vec4f,
}

// 常量定义
const BOUNDS_RADIUS: f32 = 3.0;

/**
 * 计算2D协方差矩阵（复刻 WebGL 版本）
 */
fn calcCovariance2D(
  viewPos: vec3f,
  cov3Da: vec3f,
  cov3Db: vec3f,
  viewMatrix: mat4x4f,
  projectionMatrix: mat4x4f,
  screenSize: vec2f
) -> vec3f {
  let invViewPosZ = 1.0 / viewPos.z;
  let invViewPosZSquared = invViewPosZ * invViewPosZ;

  // FOV 限制
  let tanHalfFovX = 1.0 / projectionMatrix[0][0];
  let tanHalfFovY = 1.0 / projectionMatrix[1][1];
  let limX = 1.3 * tanHalfFovX;
  let limY = 1.3 * tanHalfFovY;

  var clampedViewPos = viewPos;
  clampedViewPos.x = clamp(viewPos.x * invViewPosZ, -limX, limX) * viewPos.z;
  clampedViewPos.y = clamp(viewPos.y * invViewPosZ, -limY, limY) * viewPos.z;

  // 焦距计算
  let focalX = screenSize.x * projectionMatrix[0][0] / 2.0;
  let focalY = screenSize.y * projectionMatrix[1][1] / 2.0;

  // 雅可比矩阵 J
  let J = mat3x3f(
    focalX * invViewPosZ, 0.0, -(focalX * clampedViewPos.x) * invViewPosZSquared,
    0.0, focalY * invViewPosZ, -(focalY * clampedViewPos.y) * invViewPosZSquared,
    0.0, 0.0, 0.0
  );

  // 视图变换矩阵 W (仅旋转部分) - 转置
  let W = transpose(mat3x3f(
    viewMatrix[0].xyz,
    viewMatrix[1].xyz,
    viewMatrix[2].xyz
  ));

  // 投影变换 T = J * W
  let T = J * W;

  // 3D 协方差矩阵 Vrk（对称矩阵）
  let Vrk = mat3x3f(
    cov3Da.x, cov3Da.y, cov3Da.z,
    cov3Da.y, cov3Db.x, cov3Db.y,
    cov3Da.z, cov3Db.y, cov3Db.z
  );

  // 2D 协方差矩阵: cov = T * Vrk * T^T
  let cov = T * Vrk * transpose(T);

  // 低通滤波器
  var result = vec3f(cov[0][0], cov[0][1], cov[1][1]);
  result.x += 0.3;
  result.z += 0.3;

  return result;
}

/**
 * 分解协方差矩阵
 */
fn decomposeCovariance(cov2D: vec3f) -> array<vec2f, 2> {
  let a = cov2D.x;
  let b = cov2D.y;
  let d = cov2D.z;

  let det = a * d - b * b;
  let trace = a + d;

  let mean = 0.5 * trace;
  let dist = max(0.1, sqrt(mean * mean - det));

  // 特征值
  var lambda1 = mean + dist;
  var lambda2 = mean - dist;

  // 确保特征值为正
  lambda1 = max(lambda1, 0.01);
  lambda2 = max(lambda2, 0.01);

  // 特征向量（复刻 WebGL MetalSplatter 算法）
  var eigenvector1: vec2f;
  if (abs(b) < 1e-6) {
    eigenvector1 = select(vec2f(0.0, 1.0), vec2f(1.0, 0.0), a > d);
  } else {
    eigenvector1 = normalize(vec2f(b, d - lambda2));
  }

  // 正交特征向量
  let eigenvector2 = vec2f(eigenvector1.y, -eigenvector1.x);

  let v1 = eigenvector1 * sqrt(lambda1);
  let v2 = eigenvector2 * sqrt(lambda2);

  return array<vec2f, 2>(v1, v2);
}

@vertex
fn vertexMain(
  input: VertexInput,
  @builtin(instance_index) instanceIndex: u32
) -> VertexOutput {
  var output: VertexOutput;

  // 🚀 间接索引：通过排序索引读取实际数据
  let sortedIdx = sortIndices[instanceIndex];
  let dataOffset = sortedIdx * 13u;

  // 从 storage buffer 读取 splat 数据
  let position = vec3f(
    splatData[dataOffset + 0u],
    splatData[dataOffset + 1u],
    splatData[dataOffset + 2u]
  );
  let color = vec4f(
    splatData[dataOffset + 3u],
    splatData[dataOffset + 4u],
    splatData[dataOffset + 5u],
    splatData[dataOffset + 6u]
  );
  let covA = vec3f(
    splatData[dataOffset + 7u],
    splatData[dataOffset + 8u],
    splatData[dataOffset + 9u]
  );
  let covB = vec3f(
    splatData[dataOffset + 10u],
    splatData[dataOffset + 11u],
    splatData[dataOffset + 12u]
  );

  // 转换到视图空间
  let viewPosition4 = uniforms.viewMatrix * vec4f(position, 1.0);
  let viewPosition3 = viewPosition4.xyz;

  // 计算 2D 协方差矩阵
  let cov2D = calcCovariance2D(
    viewPosition3,
    covA,
    covB,
    uniforms.viewMatrix,
    uniforms.projectionMatrix,
    uniforms.screenSize
  );

  // 分解协方差矩阵
  let axes = decomposeCovariance(cov2D);
  let axis1 = axes[0];
  let axis2 = axes[1];

  // 投影到屏幕空间
  let projectedCenter = uniforms.projectionMatrix * viewPosition4;

  // 视锥体剔除
  if (uniforms.enableFrustumCulling == 1u) {
    let bounds = 1.2 * projectedCenter.w;
    if (projectedCenter.z < 0.0 ||
        projectedCenter.z > projectedCenter.w ||
        projectedCenter.x < -bounds ||
        projectedCenter.x > bounds ||
        projectedCenter.y < -bounds ||
        projectedCenter.y > bounds) {
      // 剔除到屏幕外
      output.position = vec4f(2.0, 2.0, 0.0, 1.0);
      output.relativePosition = vec2f(0.0);
      output.color = vec4f(0.0);
      return output;
    }
  }

  // 使用实例化的四边形顶点
  let relativeCoord = input.quadVertex;

  // 计算椭圆变换后的相对位置（像素单位）
  let ellipseRelativePos = relativeCoord.x * axis1 + relativeCoord.y * axis2;

  // 计算屏幕空间偏移
  let projectedScreenDelta = ellipseRelativePos * 2.0 * BOUNDS_RADIUS / uniforms.screenSize;

  // 最终顶点位置
  output.position = vec4f(
    projectedCenter.x + projectedScreenDelta.x * projectedCenter.w,
    projectedCenter.y + projectedScreenDelta.y * projectedCenter.w,
    projectedCenter.z,
    projectedCenter.w
  );

  // 传递给 fragment shader
  output.relativePosition = relativeCoord * BOUNDS_RADIUS;
  output.color = color;

  return output;
}

// ============ Fragment Shader ============

const BOUNDS_RADIUS_SQUARED: f32 = BOUNDS_RADIUS * BOUNDS_RADIUS;

fn splatFragmentAlpha(relativePosition: vec2f, splatAlpha: f32) -> f32 {
  // 复刻 WebGL MetalSplatter 计算方式
  let negativeMagnitudeSquared = -dot(relativePosition, relativePosition);

  // 边界检查：超出椭圆边界的点被剔除
  if (negativeMagnitudeSquared < -BOUNDS_RADIUS_SQUARED) {
    return 0.0;
  }

  // 高斯衰减
  return exp(0.5 * negativeMagnitudeSquared) * splatAlpha;
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
  let alpha = splatFragmentAlpha(input.relativePosition, input.color.a);

  // 非预乘 alpha 输出，标准 alpha 混合
  return vec4f(input.color.rgb, alpha);
}
`;class X{constructor(e,t){n(this,"canvas");n(this,"backgroundColor");n(this,"device",null);n(this,"context",null);n(this,"renderPipeline",null);n(this,"quadVertexBuffer",null);n(this,"uniformBuffer",null);n(this,"uniformBindGroup",null);n(this,"sortIndexBuffer",null);n(this,"splatDataBuffer",null);n(this,"storageBindGroup",null);n(this,"lastSortOrder",null);n(this,"bindGroupNeedsUpdate",!1);n(this,"splatCount",0);n(this,"presentationFormat","bgra8unorm");this.canvas=e,this.backgroundColor=t||[1,1,1,1]}async initialize(){const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e)throw new Error("WebGPU: No GPU adapter found");if(this.device=await e.requestDevice(),this.context=this.canvas.getContext("webgpu"),!this.context)throw new Error("WebGPU: Failed to get canvas context");this.presentationFormat=navigator.gpu.getPreferredCanvasFormat(),this.context.configure({device:this.device,format:this.presentationFormat,alphaMode:"opaque"}),this.createUniformBuffer(),this.createQuadVertexBuffer(),await this.createRenderPipeline()}createUniformBuffer(){if(!this.device)return;const e=160;this.uniformBuffer=this.device.createBuffer({label:"Uniform Buffer",size:e,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})}createQuadVertexBuffer(){if(!this.device)return;const e=new Float32Array([-1,-1,-1,1,1,-1,1,1]);this.quadVertexBuffer=this.device.createBuffer({label:"Quad Vertex Buffer",size:e.byteLength,usage:GPUBufferUsage.VERTEX,mappedAtCreation:!0}),new Float32Array(this.quadVertexBuffer.getMappedRange()).set(e),this.quadVertexBuffer.unmap()}async createRenderPipeline(){if(!this.device)return;const e=this.device.createShaderModule({label:"3DGS Render Shader",code:Y}),t=this.device.createBindGroupLayout({label:"Uniform Bind Group Layout",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),a=this.device.createBindGroupLayout({label:"Storage Bind Group Layout",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}}]}),r=this.device.createPipelineLayout({label:"Render Pipeline Layout",bindGroupLayouts:[t,a]}),o=[{arrayStride:8,stepMode:"vertex",attributes:[{shaderLocation:0,offset:0,format:"float32x2"}]}];this.renderPipeline=this.device.createRenderPipeline({label:"3DGS Render Pipeline",layout:r,vertex:{module:e,entryPoint:"vertexMain",buffers:o},fragment:{module:e,entryPoint:"fragmentMain",targets:[{format:this.presentationFormat,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]},primitive:{topology:"triangle-strip",stripIndexFormat:void 0},depthStencil:void 0}),this.uniformBindGroup=this.device.createBindGroup({label:"Uniform Bind Group",layout:t,entries:[{binding:0,resource:{buffer:this.uniformBuffer}}]})}loadSplatsFromPackedData(e,t,a){if(!this.device)throw new Error("Device not initialized");if(this.splatCount=t,(!this.splatDataBuffer||this.splatDataBuffer.size!==e.byteLength)&&(this.splatDataBuffer&&this.splatDataBuffer.destroy(),this.splatDataBuffer=this.device.createBuffer({label:"Splat Data Buffer",size:e.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.bindGroupNeedsUpdate=!0),this.device.queue.writeBuffer(this.splatDataBuffer,0,e.buffer,e.byteOffset,e.byteLength),a){const r=a.byteLength,o=!this.lastSortOrder||a!==this.lastSortOrder;if((!this.sortIndexBuffer||this.sortIndexBuffer.size!==r)&&(this.sortIndexBuffer&&this.sortIndexBuffer.destroy(),this.sortIndexBuffer=this.device.createBuffer({label:"Sort Index Buffer",size:r,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.bindGroupNeedsUpdate=!0),o&&(this.device.queue.writeBuffer(this.sortIndexBuffer,0,a.buffer,a.byteOffset,a.byteLength),this.lastSortOrder=a),this.bindGroupNeedsUpdate&&this.renderPipeline&&this.sortIndexBuffer&&this.splatDataBuffer){const i=this.renderPipeline.getBindGroupLayout(1);this.storageBindGroup=this.device.createBindGroup({label:"Storage Bind Group",layout:i,entries:[{binding:0,resource:{buffer:this.sortIndexBuffer}},{binding:1,resource:{buffer:this.splatDataBuffer}}]}),this.bindGroupNeedsUpdate=!1}}}render(e,t,a){if(!this.device||!this.context||!this.renderPipeline||this.splatCount===0||!this.storageBindGroup)return;this.updateUniforms(e,t,a);const r=this.context.getCurrentTexture().createView(),o=this.device.createCommandEncoder({label:"Render Command Encoder"}),i=o.beginRenderPass({label:"Render Pass",colorAttachments:[{view:r,clearValue:{r:this.backgroundColor[0],g:this.backgroundColor[1],b:this.backgroundColor[2],a:this.backgroundColor[3]},loadOp:"clear",storeOp:"store"}]});i.setPipeline(this.renderPipeline),i.setBindGroup(0,this.uniformBindGroup),i.setBindGroup(1,this.storageBindGroup),i.setVertexBuffer(0,this.quadVertexBuffer),i.draw(4,this.splatCount),i.end(),this.device.queue.submit([o.finish()])}updateUniforms(e,t,a){if(!this.device||!this.uniformBuffer)return;const r=new ArrayBuffer(160),o=new Float32Array(r),i=new Uint32Array(r);o.set(e,0),o.set(t,16),o[32]=a[0],o[33]=a[1],i[36]=1,this.device.queue.writeBuffer(this.uniformBuffer,0,r)}dispose(){var e,t,a,r,o;(e=this.sortIndexBuffer)==null||e.destroy(),(t=this.splatDataBuffer)==null||t.destroy(),(a=this.quadVertexBuffer)==null||a.destroy(),(r=this.uniformBuffer)==null||r.destroy(),(o=this.device)==null||o.destroy(),this.sortIndexBuffer=null,this.splatDataBuffer=null,this.quadVertexBuffer=null,this.uniformBuffer=null,this.uniformBindGroup=null,this.storageBindGroup=null,this.device=null,this.context=null,this.renderPipeline=null}}let y=null,x=null,F=null,E=null,B=null,D=null;const A=2048,T=A-1;function L(h,e,t){const r=h.length/13;(!y||y.length!==r)&&(y=new Float32Array(r),x=new Uint32Array(y.buffer),F=new Uint32Array(r),E=new Uint32Array(r),B=new Uint32Array(r),D=new Uint32Array(A));const o=y,i=x,s=F,c=E,d=B,f=D,u=e[0],l=e[1],m=e[2],z=t[0],V=t[1],R=t[2];for(let p=0;p<r;p++){const w=p*13;o[p]=(h[w]-u)*z+(h[w+1]-l)*V+(h[w+2]-m)*R,s[p]=p}for(let p=0;p<r;p++){const w=i[p];i[p]=w^(-(w>>31)|2147483648)}C(i,s,c,f,0,r),C(i,c,s,f,11,r),C(i,s,c,f,22,r);for(let p=0;p<r;p++)d[p]=c[r-1-p];return d}function C(h,e,t,a,r,o){a.fill(0);for(let s=0;s<o;s++){const c=h[e[s]]>>r&T;a[c]++}let i=0;for(let s=0;s<A;s++){const c=a[s];a[s]=i,i+=c}for(let s=0;s<o;s++){const c=e[s],d=h[c]>>r&T;t[a[d]++]=c}}const M=13;let b=null;function Z(h,e){const t=e.length,a=t*M;(!b||b.length!==a)&&(b=new Float32Array(a));for(let r=0;r<t;r++){const i=e[r]*M,s=r*M;for(let c=0;c<M;c++)b[s+c]=h[i+c]}return b}class Q{constructor(e){n(this,"renderer",null);n(this,"backend",null);n(this,"canvas");n(this,"options");n(this,"camera");n(this,"viewMatrix",new Float32Array(16));n(this,"projectionMatrix",new Float32Array(16));n(this,"originalPackedData",null);n(this,"sortMode","balance");n(this,"cachedSortOrder",null);n(this,"sortOrderComputed",!1);n(this,"renderTime",0);n(this,"sortTime",0);this.options=e,this.canvas=e.canvas,this.sortMode=e.sortMode||"balance";const t=e.camera||{position:[-.02,-.013,1.5],target:[0,0,0],fov:22,near:.01,far:100};this.camera={...t,up:[0,1,0],aspect:1}}async initialize(){const{preferBackend:e,backgroundColor:t}=this.options;if(e!=="webgl"&&await this.checkWebGPUSupport())try{this.renderer=new X(this.canvas,t),await this.renderer.initialize(),this.backend="webgpu",console.log("✅ Using WebGPU renderer"),this.updateCameraAspect();return}catch(r){console.warn("⚠️ WebGPU init failed, fallback to WebGL:",r)}this.renderer=new W(this.canvas,t),await this.renderer.initialize(),this.backend="webgl",console.log("✅ Using WebGL renderer"),this.updateCameraAspect()}loadSplatsFromPackedData(e){if(!this.renderer)throw new Error("Renderer not initialized");const t=this.originalPackedData&&this.originalPackedData.length===e.length;this.originalPackedData=e,t||(this.sortOrderComputed=!1,this.cachedSortOrder=null)}renderFrame(){if(!this.renderer||!this.originalPackedData)return;const e=performance.now();this.updateCameraMatrices();const t=Math.floor(this.originalPackedData.length/13);let a;if(this.sortMode==="quality"){const r=performance.now();a=L(this.originalPackedData,this.camera.position,this.getCameraForward()),this.sortTime=performance.now()-r}else this.sortTime=0,this.sortOrderComputed||(this.cachedSortOrder=L(this.originalPackedData,this.camera.position,this.getCameraForward()),this.sortOrderComputed=!0),a=this.cachedSortOrder;if(this.backend==="webgpu")this.renderer.loadSplatsFromPackedData(this.originalPackedData,t,a);else{const r=Z(this.originalPackedData,a);this.renderer.loadSplatsFromPackedData(r,t)}this.renderer.render(this.viewMatrix,this.projectionMatrix,[this.canvas.width,this.canvas.height]),this.renderTime=performance.now()-e}setSortMode(e){this.sortMode!==e&&(this.sortMode=e,this.sortOrderComputed=!1,this.cachedSortOrder=null,console.log(`🎨 Sort mode changed to: ${e}`))}getSortMode(){return this.sortMode}updateCamera(e){Object.assign(this.camera,e),this.updateCameraAspect()}handleResize(){this.updateCameraAspect()}getBackend(){return this.backend}dispose(){var e;(e=this.renderer)==null||e.dispose(),this.renderer=null}async checkWebGPUSupport(){if(!navigator.gpu)return!1;try{return await navigator.gpu.requestAdapter()!==null}catch{return!1}}updateCameraAspect(){this.camera.aspect=this.canvas.width/this.canvas.height}updateCameraMatrices(){this.updatePerspectiveMatrix(this.camera.fov,this.camera.aspect,this.camera.near,this.camera.far),this.updateLookAtMatrix(this.camera.position,this.camera.target,this.camera.up)}getCameraForward(){const e=[this.camera.target[0]-this.camera.position[0],this.camera.target[1]-this.camera.position[1],this.camera.target[2]-this.camera.position[2]],t=Math.sqrt(e[0]**2+e[1]**2+e[2]**2);return t>0&&(e[0]/=t,e[1]/=t,e[2]/=t),e}updatePerspectiveMatrix(e,t,a,r){const o=1/Math.tan(e*Math.PI/180/2),i=1/(a-r),s=this.projectionMatrix;s[0]=o/t,s[1]=0,s[2]=0,s[3]=0,s[4]=0,s[5]=o,s[6]=0,s[7]=0,s[8]=0,s[9]=0,s[10]=(a+r)*i,s[11]=-1,s[12]=0,s[13]=0,s[14]=a*r*i*2,s[15]=0}updateLookAtMatrix(e,t,a){const r=[e[0]-t[0],e[1]-t[1],e[2]-t[2]],o=Math.sqrt(r[0]**2+r[1]**2+r[2]**2);r[0]/=o,r[1]/=o,r[2]/=o;const i=[a[1]*r[2]-a[2]*r[1],a[2]*r[0]-a[0]*r[2],a[0]*r[1]-a[1]*r[0]],s=Math.sqrt(i[0]**2+i[1]**2+i[2]**2);i[0]/=s,i[1]/=s,i[2]/=s;const c=[r[1]*i[2]-r[2]*i[1],r[2]*i[0]-r[0]*i[2],r[0]*i[1]-r[1]*i[0]],d=this.viewMatrix;d[0]=i[0],d[1]=c[0],d[2]=r[0],d[3]=0,d[4]=i[1],d[5]=c[1],d[6]=r[1],d[7]=0,d[8]=i[2],d[9]=c[2],d[10]=r[2],d[11]=0,d[12]=-(i[0]*e[0]+i[1]*e[1]+i[2]*e[2]),d[13]=-(c[0]*e[0]+c[1]*e[1]+c[2]*e[2]),d[14]=-(r[0]*e[0]+r[1]*e[1]+r[2]*e[2]),d[15]=1}}const g={rendering:{backgroundColor:[1,1,1,1],sortMode:"balance"},camera:{position:[-.02,-.013,1.5],target:[0,0,0],fov:22,near:.01,far:100},animation:{fps:25,idleFile:"idle.pb",audioFile:"mono.pb",audioWavFile:"mono.wav"},avatar:{baseAssetsPath:"",modelFolder:"3dgs4",wasmPath:"/src/wasm/avatar_core_wasm.js"},wasm:{logLevel:"basic",enableValidation:!1,enablePerformanceMetrics:!0}};class J{constructor(){n(this,"audio",null);n(this,"_isPlaying",!1);n(this,"fps",g.animation.fps);n(this,"onEndedCallback")}async initialize(e,t){return this.onEndedCallback=t,new Promise((a,r)=>{this.audio=new Audio(e),this.audio.addEventListener("canplaythrough",()=>{this.setupEventListeners(),a()},{once:!0}),this.audio.addEventListener("error",()=>{r(new Error(`Failed to load audio: ${e}`))},{once:!0}),this.audio.load()})}setupEventListeners(){this.audio&&(this.audio.addEventListener("play",()=>{this._isPlaying=!0}),this.audio.addEventListener("ended",()=>{var e;this._isPlaying=!1,(e=this.onEndedCallback)==null||e.call(this)}))}async play(){if(!this.audio)throw new Error("Audio not loaded");this.audio.currentTime=0,await this.audio.play()}stop(){this.audio&&(this._isPlaying=!1,this.audio.pause(),this.audio.currentTime=0)}isPlaying(){return this._isPlaying}getCurrentFrameIndex(){return this.audio?Math.floor(this.audio.currentTime*this.fps):0}dispose(){this.stop(),this.audio&&(this.audio.src="",this.audio=null),this.onEndedCallback=void 0}}class K{constructor(){n(this,"avatarCore",null);n(this,"renderSystem",null);n(this,"animationPlayer",null);n(this,"animationLoopId",null);n(this,"animationStartTime",0);n(this,"lastFrameIndex",-1);n(this,"onPlaybackEndedCallback");n(this,"statsCache",{wasmTime:0,renderTime:0,sortTime:0})}async initialize(e){console.log("🚀 Initializing Avatar App...");try{await this.initializeAvatarCore(),await this.initializeRenderSystem(e),await this.renderFirstFrame(),this.startAnimationLoop(),console.log("✅ Avatar App initialized successfully"),console.log(`🎨 Rendering mode: ${this.renderSystem.getSortMode().toUpperCase()}`),this.renderSystem.getSortMode()==="balance"?console.log("  ↳ Balance mode: First-frame sorting, subsequent frames reuse cache"):console.log("  ↳ Quality mode: Every frame re-sorting")}catch(t){throw console.error("❌ Avatar App initialization failed:",t),t}}async initializeAvatarCore(){console.log("🔧 Initializing Avatar Core (main thread)..."),this.avatarCore=new $({logLevel:g.wasm.logLevel,enableValidation:g.wasm.enableValidation,enablePerformanceMetrics:g.wasm.enablePerformanceMetrics,baseAssetsPath:g.avatar.baseAssetsPath,modelFolder:g.avatar.modelFolder,wasmPath:g.avatar.wasmPath}),await this.avatarCore.initialize(),await this.avatarCore.loadCharacter(),await this.avatarCore.loadAnimation(),console.log("✅ Avatar Core initialized")}async initializeRenderSystem(e){this.renderSystem=new Q({canvas:e,backgroundColor:g.rendering.backgroundColor,camera:g.camera,sortMode:g.rendering.sortMode}),await this.renderSystem.initialize()}async renderFirstFrame(){await this.renderFrame(0)}async renderFrame(e){if(!this.avatarCore||!this.renderSystem)return;const t=await this.avatarCore.computeCompleteFrameFlat({frameIndex:e});if(!t){console.warn("⚠️ No splat data returned from WASM");return}this.renderSystem.loadSplatsFromPackedData(t),this.renderSystem.renderFrame()}startAnimationLoop(){this.animationStartTime=Date.now(),this.animationLoop()}async animationLoop(){const e=this.getCurrentFrameIndex();if(e!==this.lastFrameIndex)try{await this.renderFrame(e),this.lastFrameIndex=e}catch(t){console.error("❌ Animation loop error:",t)}this.animationLoopId=requestAnimationFrame(()=>this.animationLoop())}getCurrentFrameIndex(){var t;if((t=this.animationPlayer)!=null&&t.isPlaying())return this.animationPlayer.getCurrentFrameIndex();const e=(Date.now()-this.animationStartTime)/1e3;return Math.floor(e*g.animation.fps)}stopAnimationLoop(){this.animationLoopId!==null&&(cancelAnimationFrame(this.animationLoopId),this.animationLoopId=null)}setOnPlaybackEnded(e){this.onPlaybackEndedCallback=e}async playAudioAnimation(){try{if(await this.avatarCore.switchAnimationFile(g.animation.audioFile),this.animationPlayer)this.animationPlayer.stop();else{const e=`/${g.avatar.modelFolder}/${g.animation.audioWavFile}`;this.animationPlayer=new J,await this.animationPlayer.initialize(e,async()=>{this.animationPlayer.stop(),await this.avatarCore.switchAnimationFile(g.animation.idleFile),this.animationStartTime=Date.now(),this.onPlaybackEndedCallback&&this.onPlaybackEndedCallback()})}await this.animationPlayer.play()}catch(e){throw console.error("❌ Failed to play audio animation:",e),await this.avatarCore.switchAnimationFile(g.animation.idleFile),this.animationStartTime=Date.now(),e}}setSortMode(e){var t;(t=this.renderSystem)==null||t.setSortMode(e)}getSortMode(){var e;return((e=this.renderSystem)==null?void 0:e.getSortMode())||null}getRenderBackend(){var e;return((e=this.renderSystem)==null?void 0:e.getBackend())||null}getPerformanceStats(){var e,t,a;return this.statsCache.wasmTime=((e=this.avatarCore)==null?void 0:e.wasmTime)||0,this.statsCache.renderTime=((t=this.renderSystem)==null?void 0:t.renderTime)||0,this.statsCache.sortTime=((a=this.renderSystem)==null?void 0:a.sortTime)||0,this.statsCache}handleResize(){var e;(e=this.renderSystem)==null||e.handleResize()}dispose(){var e,t;this.stopAnimationLoop(),(e=this.renderSystem)==null||e.dispose(),(t=this.avatarCore)==null||t.release()}}class ee{constructor(){n(this,"loaderEl");n(this,"loaderMessage");n(this,"errorEl");n(this,"errorMessage");this.loaderEl=document.getElementById("loader"),this.loaderMessage=document.getElementById("loader-message"),this.errorEl=document.getElementById("error"),this.errorMessage=document.getElementById("error-message")}show(e="正在加载..."){this.loaderMessage.textContent=e,this.loaderEl.style.display="flex",this.errorEl.style.display="none"}hide(){this.loaderEl.style.display="none"}showError(e){this.loaderEl.style.display="none",this.errorEl.style.display="flex",this.errorMessage.textContent=e}}class te{constructor(e){n(this,"app");n(this,"controlsEl");n(this,"backendInfo");n(this,"backendBadge");n(this,"playBtn");n(this,"sortBtn");n(this,"isPlaying",!1);n(this,"sortMode","balance");this.app=e,this.controlsEl=document.getElementById("controls"),this.backendInfo=document.getElementById("backend-info"),this.backendBadge=document.getElementById("backend-badge"),this.playBtn=document.getElementById("play-btn"),this.sortBtn=document.getElementById("sort-btn"),this.playBtn.addEventListener("click",()=>this.handlePlay()),this.sortBtn.addEventListener("click",()=>this.handleToggleSortMode())}show(){var t;const e=((t=this.app.getRenderBackend())==null?void 0:t.toUpperCase())||"Unknown";this.backendBadge.textContent=e,this.backendBadge.className=`badge backend-${e.toLowerCase()}`,this.backendInfo.style.display="flex",this.sortMode=this.app.getSortMode()||"balance",this.sortBtn.textContent=this.sortMode==="quality"?"🎯 Quality":"⚡ Balance",this.controlsEl.style.display="flex"}hide(){this.controlsEl.style.display="none",this.backendInfo.style.display="none"}setOnPlaybackEnded(e){this.app.setOnPlaybackEnded(()=>{this.isPlaying=!1,this.playBtn.disabled=!1,this.playBtn.textContent="▶️ 播放",e()})}async handlePlay(){if(!this.isPlaying)try{this.isPlaying=!0,this.playBtn.disabled=!0,this.playBtn.textContent="播放中...",await this.app.playAudioAnimation()}catch(e){throw console.error("❌ 播放失败:",e),this.isPlaying=!1,this.playBtn.disabled=!1,this.playBtn.textContent="▶️ 播放",e}}handleToggleSortMode(){this.sortMode=this.sortMode==="balance"?"quality":"balance",this.app.setSortMode(this.sortMode),this.sortBtn.textContent=this.sortMode==="quality"?"🎯 Quality":"⚡ Balance",console.log(`🎨 排序模式切换: ${this.sortMode}`)}}class ae{constructor(e){n(this,"container");n(this,"fpsEl");n(this,"wasmEl");n(this,"renderEl");n(this,"sortEl");n(this,"frameCount",0);n(this,"lastFpsUpdate",0);n(this,"currentFps",0);n(this,"lastUpdate",0);n(this,"UPDATE_INTERVAL",1e3);this.container=document.getElementById(e),this.fpsEl=this.createStatItem("FPS","0"),this.wasmEl=this.createStatItem("WASM","0ms"),this.renderEl=this.createStatItem("Render","0ms"),this.sortEl=this.createStatItem("Sort","0ms"),this.container.appendChild(this.fpsEl),this.container.appendChild(this.wasmEl),this.container.appendChild(this.renderEl),this.container.appendChild(this.sortEl),this.sortEl.style.display="none"}createStatItem(e,t){const a=document.createElement("div");return a.className="stat-item",a.innerHTML=`
      <span class="stat-label">${e}:</span>
      <span class="stat-value">${t}</span>
    `,a}update(e,t,a){const r=performance.now();this.frameCount++,r-this.lastFpsUpdate>=1e3&&(this.currentFps=Math.round(this.frameCount*1e3/(r-this.lastFpsUpdate)),this.frameCount=0,this.lastFpsUpdate=r),!(r-this.lastUpdate<this.UPDATE_INTERVAL)&&(this.lastUpdate=r,this.updateValue(this.fpsEl,String(this.currentFps)),this.updateValue(this.wasmEl,this.formatTime(e)),this.updateValue(this.renderEl,this.formatTime(t)),a!==void 0?(this.sortEl.style.display="flex",this.updateValue(this.sortEl,this.formatTime(a))):this.sortEl.style.display="none")}updateValue(e,t){const a=e.querySelector(".stat-value");a&&(a.textContent=t)}formatTime(e){return e.toFixed(1)+"ms"}}const P=document.getElementById("canvas");let v;function _(){const h=window.devicePixelRatio||1,e=window.innerWidth,t=window.innerHeight;P.width=Math.floor(e*h),P.height=Math.floor(t*h),P.style.width=`${e}px`,P.style.height=`${t}px`,v==null||v.handleResize()}function re(h){function e(){if(!v)return;const t=v.getPerformanceStats(),a=v.getSortMode();h.update(t.wasmTime,t.renderTime,a==="quality"?t.sortTime:void 0),requestAnimationFrame(e)}requestAnimationFrame(e)}async function oe(){const h=new ee;try{_(),h.show("正在加载 WASM..."),v=new K,await v.initialize(P);const e=new te(v),t=new ae("performance-stats");e.setOnPlaybackEnded(()=>{console.log("✅ 播放完成")}),h.hide(),e.show(),document.getElementById("performance-stats").style.display="block",re(t),console.log("✅ Avatar App 初始化成功")}catch(e){console.error("❌ 初始化失败:",e),h.showError(e.message||"初始化失败")}}window.addEventListener("resize",_);window.addEventListener("orientationchange",_);window.addEventListener("DOMContentLoaded",oe);
