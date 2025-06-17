import"../modulepreload-polyfill-B5Qt9EMX.js";import{V as fs,S as _s}from"../stats.min-C3j8OIP4.js";/**
 * @license
 * Copyright 2021-present uino
 * SPDX-License-Identifier: BSD-3-Clause
 */class y{static generateUUID(){const e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(V[e&255]+V[e>>8&255]+V[e>>16&255]+V[e>>24&255]+"-"+V[t&255]+V[t>>8&255]+"-"+V[t>>16&15|64]+V[t>>24&255]+"-"+V[n&63|128]+V[n>>8&255]+"-"+V[n>>16&255]+V[n>>24&255]+V[i&255]+V[i>>8&255]+V[i>>16&255]+V[i>>24&255]).toUpperCase()}static lerp(e,t,n){return e+(t-e)*n}static clamp(e,t,n){return Math.max(t,Math.min(n,e))}static euclideanModulo(e,t){return(e%t+t)%t}static isPowerOfTwo(e){return(e&e-1)===0&&e!==0}static nearestPowerOfTwo(e){return Math.pow(2,Math.round(Math.log(e)/Math.LN2))}static nextPowerOfTwo(e){return e--,e|=e>>1,e|=e>>2,e|=e>>4,e|=e>>8,e|=e>>16,e++,e}static denormalize(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw new Error("Invalid component type.")}}static normalize(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw new Error("Invalid component type.")}}static toHalfFloat(e){Math.abs(e)>65504&&(console.warn("MathUtils.toHalfFloat(): Value out of range."),e=this.clamp(e,-65504,65504)),de.floatView[0]=e;const t=de.uint32View[0],n=t>>23&511;return de.baseTable[n]+((t&8388607)>>de.shiftTable[n])}static fromHalfFloat(e){const t=e>>10;return de.uint32View[0]=de.mantissaTable[de.offsetTable[t]+(e&1023)]+de.exponentTable[t],de.floatView[0]}}const V=[];for(let a=0;a<256;a++)V[a]=(a<16?"0":"")+a.toString(16);const de=ps();function ps(){const a=new ArrayBuffer(4),e=new Float32Array(a),t=new Uint32Array(a),n=new Uint32Array(512),i=new Uint32Array(512);for(let c=0;c<256;++c){const l=c-127;l<-27?(n[c]=0,n[c|256]=32768,i[c]=24,i[c|256]=24):l<-14?(n[c]=1024>>-l-14,n[c|256]=1024>>-l-14|32768,i[c]=-l-1,i[c|256]=-l-1):l<=15?(n[c]=l+15<<10,n[c|256]=l+15<<10|32768,i[c]=13,i[c|256]=13):l<128?(n[c]=31744,n[c|256]=64512,i[c]=24,i[c|256]=24):(n[c]=31744,n[c|256]=64512,i[c]=13,i[c|256]=13)}const s=new Uint32Array(2048),r=new Uint32Array(64),o=new Uint32Array(64);for(let c=1;c<1024;++c){let l=c<<13,h=0;for(;(l&8388608)===0;)l<<=1,h-=8388608;l&=-8388609,h+=947912704,s[c]=l|h}for(let c=1024;c<2048;++c)s[c]=939524096+(c-1024<<13);for(let c=1;c<31;++c)r[c]=c<<23;r[31]=1199570944,r[32]=2147483648;for(let c=33;c<63;++c)r[c]=2147483648+(c-32<<23);r[63]=3347054592;for(let c=1;c<64;++c)c!==32&&(o[c]=1024);return{floatView:e,uint32View:t,baseTable:n,shiftTable:i,mantissaTable:s,exponentTable:r,offsetTable:o}}class S{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}lerpVectors(e,t,n){return this.subVectors(t,e).multiplyScalar(n).add(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}set(e=0,t=0,n=0){return this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}getLength(){return Math.sqrt(this.getLengthSquared())}getLengthSquared(){return this.x*this.x+this.y*this.y+this.z*this.z}normalize(e=1){const t=this.getLength()||1,n=e/t;return this.x*=n,this.y*=n,this.z*=n,this}subtract(e,t=new S){return t.set(this.x-e.x,this.y-e.y,this.z-e.z)}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}crossVectors(e,t){const n=e.x,i=e.y,s=e.z,r=t.x,o=t.y,c=t.z;return this.x=i*c-s*o,this.y=s*r-n*c,this.z=n*o-i*r,this}cross(e){return this.crossVectors(this,e)}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,s=e._x,r=e._y,o=e._z,c=e._w,l=c*t+r*i-o*n,h=c*n+o*t-s*i,d=c*i+s*n-r*t,f=-s*t-r*n-o*i;return this.x=l*c+f*-s+h*-o-d*-r,this.y=h*c+f*-r+d*-s-l*-o,this.z=d*c+f*-o+l*-r-h*-s,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=e.elements,r=1/(s[3]*t+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*i+s[12])*r,this.y=(s[1]*t+s[5]*n+s[9]*i+s[13])*r,this.z=(s[2]*t+s[6]*n+s[10]*i+s[14])*r,this}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*i,this.y=s[1]*t+s[4]*n+s[7]*i,this.z=s[2]*t+s[5]*n+s[8]*i,this}transformDirection(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i,this.y=s[1]*t+s[5]*n+s[9]*i,this.z=s[2]*t+s[6]*n+s[10]*i,this.normalize()}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).getLength(),n=this.setFromMatrixColumn(e,1).getLength(),i=this.setFromMatrixColumn(e,2).getLength();return this.set(t,n,i)}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}fromArray(e,t=0,n=!1){let i=e[t],s=e[t+1],r=e[t+2];return n&&(i=y.denormalize(i,e),s=y.denormalize(s,e),r=y.denormalize(r,e)),this.x=i,this.y=s,this.z=r,this}toArray(e=[],t=0,n=!1){let i=this.x,s=this.y,r=this.z;return n&&(i=y.normalize(i,e),s=y.normalize(s,e),r=y.normalize(r,e)),e[t]=i,e[t+1]=s,e[t+2]=r,e}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}setFromSpherical(e){const t=Math.sin(e.phi)*e.radius;return this.x=t*Math.sin(e.theta),this.y=Math.cos(e.phi)*e.radius,this.z=t*Math.cos(e.theta),this}project(e){return this.applyMatrix4(e.projectionViewMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.worldMatrix)}reflect(e){return this.sub(ms.copy(e).multiplyScalar(2*this.dot(e)))}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}clone(){return new S(this.x,this.y,this.z)}}const ms=new S;class U{constructor(){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)}isIdentity(){const e=this.elements;return e[0]===1&&e[4]===0&&e[8]===0&&e[12]===0&&e[1]===0&&e[5]===1&&e[9]===0&&e[13]===0&&e[2]===0&&e[6]===0&&e[10]===1&&e[14]===0&&e[3]===0&&e[7]===0&&e[11]===0&&e[15]===1}set(e,t,n,i,s,r,o,c,l,h,d,f,u,p,_,v){const m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=i,m[1]=s,m[5]=r,m[9]=o,m[13]=c,m[2]=l,m[6]=h,m[10]=d,m[14]=f,m[3]=u,m[7]=p,m[11]=_,m[15]=v,this}clone(){return new U().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1)}makeTranslation(e,t,n){return this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1)}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,r=n[0],o=n[4],c=n[8],l=n[12],h=n[1],d=n[5],f=n[9],u=n[13],p=n[2],_=n[6],v=n[10],m=n[14],M=n[3],A=n[7],T=n[11],w=n[15],R=i[0],O=i[4],F=i[8],I=i[12],L=i[1],x=i[5],D=i[9],Q=i[13],Y=i[2],ee=i[6],G=i[10],ve=i[14],te=i[3],Z=i[7],Te=i[11],H=i[15];return s[0]=r*R+o*L+c*Y+l*te,s[4]=r*O+o*x+c*ee+l*Z,s[8]=r*F+o*D+c*G+l*Te,s[12]=r*I+o*Q+c*ve+l*H,s[1]=h*R+d*L+f*Y+u*te,s[5]=h*O+d*x+f*ee+u*Z,s[9]=h*F+d*D+f*G+u*Te,s[13]=h*I+d*Q+f*ve+u*H,s[2]=p*R+_*L+v*Y+m*te,s[6]=p*O+_*x+v*ee+m*Z,s[10]=p*F+_*D+v*G+m*Te,s[14]=p*I+_*Q+v*ve+m*H,s[3]=M*R+A*L+T*Y+w*te,s[7]=M*O+A*x+T*ee+w*Z,s[11]=M*F+A*D+T*G+w*Te,s[15]=M*I+A*Q+T*ve+w*H,this}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}inverse(){return this.getInverse(this)}getInverse(e){const t=this.elements,n=e.elements,i=n[0],s=n[1],r=n[2],o=n[3],c=n[4],l=n[5],h=n[6],d=n[7],f=n[8],u=n[9],p=n[10],_=n[11],v=n[12],m=n[13],M=n[14],A=n[15],T=u*M*d-m*p*d+m*h*_-l*M*_-u*h*A+l*p*A,w=v*p*d-f*M*d-v*h*_+c*M*_+f*h*A-c*p*A,R=f*m*d-v*u*d+v*l*_-c*m*_-f*l*A+c*u*A,O=v*u*h-f*m*h-v*l*p+c*m*p+f*l*M-c*u*M,F=i*T+s*w+r*R+o*O;if(F===0)return console.warn("Matrix4: can not invert matrix, determinant is 0"),this.identity();const I=1/F;return t[0]=T*I,t[1]=(m*p*o-u*M*o-m*r*_+s*M*_+u*r*A-s*p*A)*I,t[2]=(l*M*o-m*h*o+m*r*d-s*M*d-l*r*A+s*h*A)*I,t[3]=(u*h*o-l*p*o-u*r*d+s*p*d+l*r*_-s*h*_)*I,t[4]=w*I,t[5]=(f*M*o-v*p*o+v*r*_-i*M*_-f*r*A+i*p*A)*I,t[6]=(v*h*o-c*M*o-v*r*d+i*M*d+c*r*A-i*h*A)*I,t[7]=(c*p*o-f*h*o+f*r*d-i*p*d-c*r*_+i*h*_)*I,t[8]=R*I,t[9]=(v*u*o-f*m*o-v*s*_+i*m*_+f*s*A-i*u*A)*I,t[10]=(c*m*o-v*l*o+v*s*d-i*m*d-c*s*A+i*l*A)*I,t[11]=(f*l*o-c*u*o-f*s*d+i*u*d+c*s*_-i*l*_)*I,t[12]=O*I,t[13]=(f*m*r-v*u*r+v*s*p-i*m*p-f*s*M+i*u*M)*I,t[14]=(v*l*r-c*m*r-v*s*h+i*m*h+c*s*M-i*l*M)*I,t[15]=(c*u*r-f*l*r+f*s*h-i*u*h-c*s*p+i*l*p)*I,this}transform(e,t,n){const i=this.elements,s=n._x,r=n._y,o=n._z,c=n._w,l=s+s,h=r+r,d=o+o,f=s*l,u=s*h,p=s*d,_=r*h,v=r*d,m=o*d,M=c*l,A=c*h,T=c*d,w=t.x,R=t.y,O=t.z;return i[0]=(1-(_+m))*w,i[1]=(u+T)*w,i[2]=(p-A)*w,i[3]=0,i[4]=(u-T)*R,i[5]=(1-(f+m))*R,i[6]=(v+M)*R,i[7]=0,i[8]=(p+A)*O,i[9]=(v-M)*O,i[10]=(1-(f+_))*O,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}makeRotationFromQuaternion(e){const t=this.elements,n=e.x,i=e.y,s=e.z,r=e.w,o=n+n,c=i+i,l=s+s,h=n*o,d=n*c,f=n*l,u=i*c,p=i*l,_=s*l,v=r*o,m=r*c,M=r*l;return t[0]=1-(u+_),t[4]=d-M,t[8]=f+m,t[1]=d+M,t[5]=1-(h+_),t[9]=p-v,t[2]=f-m,t[6]=p+v,t[10]=1-(h+u),t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}extractRotation(e){const t=this.elements,n=e.elements,i=1/We.setFromMatrixColumn(e,0).getLength(),s=1/We.setFromMatrixColumn(e,1).getLength(),r=1/We.setFromMatrixColumn(e,2).getLength();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*r,t[9]=n[9]*r,t[10]=n[10]*r,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}lookAtRH(e,t,n){const i=this.elements;return j.subVectors(e,t),j.getLengthSquared()===0&&(j.z=1),j.normalize(),Ee.crossVectors(n,j),Ee.getLengthSquared()===0&&(Math.abs(n.z)===1?j.x+=1e-4:j.z+=1e-4,j.normalize(),Ee.crossVectors(n,j)),Ee.normalize(),St.crossVectors(j,Ee),i[0]=Ee.x,i[4]=St.x,i[8]=j.x,i[1]=Ee.y,i[5]=St.y,i[9]=j.y,i[2]=Ee.z,i[6]=St.z,i[10]=j.z,this}decompose(e,t,n){const i=this.elements;let s=We.set(i[0],i[1],i[2]).getLength();const r=We.set(i[4],i[5],i[6]).getLength(),o=We.set(i[8],i[9],i[10]).getLength();this.determinant()<0&&(s=-s),e.x=i[12],e.y=i[13],e.z=i[14],se.copy(this);const l=1/s,h=1/r,d=1/o;return se.elements[0]*=l,se.elements[1]*=l,se.elements[2]*=l,se.elements[4]*=h,se.elements[5]*=h,se.elements[6]*=h,se.elements[8]*=d,se.elements[9]*=d,se.elements[10]*=d,t.setFromRotationMatrix(se),n.x=s,n.y=r,n.z=o,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],s=e[12],r=e[1],o=e[5],c=e[9],l=e[13],h=e[2],d=e[6],f=e[10],u=e[14],p=e[3],_=e[7],v=e[11],m=e[15],M=t*o-n*r,A=t*c-i*r,T=n*c-i*o,w=h*_-d*p,R=h*v-f*p,O=d*v-f*_,F=t*O-n*R+i*w,I=r*O-o*R+c*w,L=h*T-d*A+f*M,x=p*T-_*A+v*M;return l*F-s*I+m*L-u*x}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),s=1-n,r=e.x,o=e.y,c=e.z,l=s*r,h=s*o;return this.set(l*r+n,l*o-i*c,l*c+i*o,0,l*o+i*c,h*o+n,h*c-i*r,0,l*c-i*o,h*c+i*r,s*c*c+n,0,0,0,0,1)}lerpMatrices(e,t,n){if(n===0)return this.copy(e);if(n===1)return this.copy(t);const i=this.elements,s=e.elements,r=t.elements;for(let o=0;o<16;o++)i[o]=s[o]*(1-n)+r[o]*n;return this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const We=new S,se=new U,Ee=new S,St=new S,j=new S;class Be{constructor(e=0,t=0,n=0,i=1){this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,s,r,o){let c=n[i+0],l=n[i+1],h=n[i+2],d=n[i+3];const f=s[r+0],u=s[r+1],p=s[r+2],_=s[r+3];if(o===0){e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=d;return}if(o===1){e[t]=f,e[t+1]=u,e[t+2]=p,e[t+3]=_;return}if(d!==_||c!==f||l!==u||h!==p){let v=1-o;const m=c*f+l*u+h*p+d*_,M=m>=0?1:-1,A=1-m*m;if(A>Number.EPSILON){const w=Math.sqrt(A),R=Math.atan2(w,m*M);v=Math.sin(v*R)/w,o=Math.sin(o*R)/w}const T=o*M;if(c=c*v+f*T,l=l*v+u*T,h=h*v+p*T,d=d*v+_*T,v===1-o){const w=1/Math.sqrt(c*c+l*l+h*h+d*d);c*=w,l*=w,h*=w,d*=w}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,i,s,r){const o=n[i],c=n[i+1],l=n[i+2],h=n[i+3],d=s[r],f=s[r+1],u=s[r+2],p=s[r+3];return e[t]=o*p+h*d+c*u-l*f,e[t+1]=c*p+h*f+l*d-o*u,e[t+2]=l*p+h*u+o*f-c*d,e[t+3]=h*p-o*d-c*f-l*u,e}get x(){return this._x}set x(e){this._x=e,this.onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this.onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this.onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this.onChangeCallback()}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this.onChangeCallback(),this}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}lerpQuaternions(e,t,n){if(n===0)return this.copy(e);if(n===1)return this.copy(t);const i=e._w,s=e._x,r=e._y,o=e._z;let c=t._w,l=t._x,h=t._y,d=t._z;i*c+s*l+r*h+o*d<0&&(c=-c,l=-l,h=-h,d=-d),this._w=i+n*(c-i),this._x=s+n*(l-s),this._y=r+n*(h-r),this._z=o+n*(d-o);const u=1/Math.sqrt(this._w*this._w+this._x*this._x+this._y*this._y+this._z*this._z);return this._w*=u,this._x*=u,this._y*=u,this._z*=u,this.onChangeCallback(),this}slerpQuaternions(e,t,n){if(n===0)return this.copy(e);if(n===1)return this.copy(t);const i=e._w,s=e._x,r=e._y,o=e._z;let c=t._w,l=t._x,h=t._y,d=t._z,f=i*c+s*l+r*h+o*d;if(f<0&&(f=-f,c=-c,l=-l,h=-h,d=-d),f<.95){const u=Math.acos(f),p=1/Math.sin(u),_=Math.sin(u*(1-n))*p,v=Math.sin(u*n)*p;this._w=i*_+c*v,this._x=s*_+l*v,this._y=r*_+h*v,this._z=o*_+d*v}else{this._w=i+n*(c-i),this._x=s+n*(l-s),this._y=r+n*(h-r),this._z=o+n*(d-o);const u=1/Math.sqrt(this._w*this._w+this._x*this._x+this._y*this._y+this._z*this._z);this._w*=u,this._x*=u,this._y*=u,this._z*=u}return this.onChangeCallback(),this}set(e=0,t=0,n=0,i=1){return this._x=e,this._y=t,this._z=n,this._w=i,this.onChangeCallback(),this}clone(){return new Be(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w!==void 0?e.w:1,this.onChangeCallback(),this}setFromEuler(e,t=!0){const n=Math.cos(e._x/2),i=Math.cos(e._y/2),s=Math.cos(e._z/2),r=Math.sin(e._x/2),o=Math.sin(e._y/2),c=Math.sin(e._z/2),l=e._order;return l==="XYZ"?(this._x=r*i*s+n*o*c,this._y=n*o*s-r*i*c,this._z=n*i*c+r*o*s,this._w=n*i*s-r*o*c):l==="YXZ"?(this._x=r*i*s+n*o*c,this._y=n*o*s-r*i*c,this._z=n*i*c-r*o*s,this._w=n*i*s+r*o*c):l==="ZXY"?(this._x=r*i*s-n*o*c,this._y=n*o*s+r*i*c,this._z=n*i*c+r*o*s,this._w=n*i*s-r*o*c):l==="ZYX"?(this._x=r*i*s-n*o*c,this._y=n*o*s+r*i*c,this._z=n*i*c-r*o*s,this._w=n*i*s+r*o*c):l==="YZX"?(this._x=r*i*s+n*o*c,this._y=n*o*s+r*i*c,this._z=n*i*c-r*o*s,this._w=n*i*s-r*o*c):l==="XZY"&&(this._x=r*i*s-n*o*c,this._y=n*o*s-r*i*c,this._z=n*i*c+r*o*s,this._w=n*i*s+r*o*c),t===!0&&this.onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],s=t[8],r=t[1],o=t[5],c=t[9],l=t[2],h=t[6],d=t[10],f=n+o+d;let u;return f>0?(u=.5/Math.sqrt(f+1),this._w=.25/u,this._x=(h-c)*u,this._y=(s-l)*u,this._z=(r-i)*u):n>o&&n>d?(u=2*Math.sqrt(1+n-o-d),this._w=(h-c)/u,this._x=.25*u,this._y=(i+r)/u,this._z=(s+l)/u):o>d?(u=2*Math.sqrt(1+o-n-d),this._w=(s-l)/u,this._x=(i+r)/u,this._y=.25*u,this._z=(c+h)/u):(u=2*Math.sqrt(1+d-n-o),this._w=(r-i)/u,this._x=(s+l)/u,this._y=(c+h)/u,this._z=.25*u),this.onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,s=e._z,r=e._w,o=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+r*o+i*l-s*c,this._y=i*h+r*c+s*o-n*l,this._z=s*h+r*l+n*c-i*o,this._w=r*h-n*o-i*c-s*l,this.onChangeCallback(),this}toMatrix4(e=new U){const t=e.elements,n=2*this._x*this._y,i=2*this._x*this._z,s=2*this._x*this._w,r=2*this._y*this._z,o=2*this._y*this._w,c=2*this._z*this._w,l=this._x*this._x,h=this._y*this._y,d=this._z*this._z,f=this._w*this._w;return t[0]=l-h-d+f,t[4]=n-c,t[8]=i+o,t[12]=0,t[1]=n+c,t[5]=-l+h-d+f,t[9]=r-s,t[13]=0,t[2]=i-o,t[6]=r+s,t[10]=-l-h+d+f,t[14]=0,t[3]=0,t[7]=0,t[11]=0,t[15]=1,e}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this.onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this.onChangeCallback(),this}fromArray(e,t=0,n=!1){let i=e[t],s=e[t+1],r=e[t+2],o=e[t+3];return n&&(i=y.denormalize(i,e),s=y.denormalize(s,e),r=y.denormalize(r,e),o=y.denormalize(o,e)),this._x=i,this._y=s,this._z=r,this._w=o,this.onChangeCallback(),this}toArray(e=[],t=0,n=!1){let i=this._x,s=this._y,r=this._z,o=this._w;return n&&(i=y.normalize(i,e),s=y.normalize(s,e),r=y.normalize(r,e),o=y.normalize(o,e)),e[t]=i,e[t+1]=s,e[t+2]=r,e[t+3]=o,e}onChange(e){return this.onChangeCallback=e,this}onChangeCallback(){}}const wn={SHADER:"shader"},pe={NONE:"none",NORMAL:"normal",ADD:"add",SUB:"sub",MUL:"mul",CUSTOM:"custom"},ce={ADD:100,SUBTRACT:101,REVERSE_SUBTRACT:102,MIN:103,MAX:104},K={ZERO:200,ONE:201,SRC_COLOR:202,SRC_ALPHA:203,SRC_ALPHA_SATURATE:204,DST_COLOR:205,DST_ALPHA:206,ONE_MINUS_SRC_COLOR:207,ONE_MINUS_SRC_ALPHA:208,ONE_MINUS_DST_COLOR:209,ONE_MINUS_DST_ALPHA:210},Xe={NONE:"none",FRONT:"front",BACK:"back"},ze={FRONT:"front",BACK:"back",DOUBLE:"double"},Gi={SMOOTH_SHADING:"smooth_shading",FLAT_SHADING:"flat_shading"},E={DEPTH_COMPONENT:1e3,DEPTH_STENCIL:1001,STENCIL_INDEX8:1002,ALPHA:1003,RED:1004,RGB:1005,RGBA:1006,LUMINANCE:1007,LUMINANCE_ALPHA:1008,RED_INTEGER:1010,RG:1011,RG_INTEGER:1012,RGB_INTEGER:1013,RGBA_INTEGER:1014,R32F:1100,R16F:1101,R8:1102,RG32F:1103,RG16F:1104,RG8:1105,RGB32F:1106,RGB16F:1107,RGB8:1108,RGBA32F:1109,RGBA16F:1110,RGBA8:1111,RGBA4:1112,RGB5_A1:1113,DEPTH_COMPONENT32F:1114,DEPTH_COMPONENT24:1115,DEPTH_COMPONENT16:1116,DEPTH24_STENCIL8:1117,DEPTH32F_STENCIL8:1118,R11F_G11F_B10F:1119,RGB_S3TC_DXT1:1200,RGBA_S3TC_DXT1:1201,RGBA_S3TC_DXT3:1202,RGBA_S3TC_DXT5:1203,RGB_PVRTC_4BPPV1:1204,RGB_PVRTC_2BPPV1:1205,RGBA_PVRTC_4BPPV1:1206,RGBA_PVRTC_2BPPV1:1207,RGB_ETC1:1208,RGBA_ASTC_4x4:1209,RGBA_BPTC:1210},N={UNSIGNED_BYTE:1500,UNSIGNED_SHORT_5_6_5:1501,UNSIGNED_SHORT_4_4_4_4:1502,UNSIGNED_SHORT_5_5_5_1:1503,UNSIGNED_SHORT:1504,UNSIGNED_INT:1505,UNSIGNED_INT_24_8:1506,FLOAT:1507,HALF_FLOAT:1508,FLOAT_32_UNSIGNED_INT_24_8_REV:1509,BYTE:1510,SHORT:1511,INT:1512},P={NEAREST:1600,LINEAR:1601,NEAREST_MIPMAP_NEAREST:1602,LINEAR_MIPMAP_NEAREST:1603,NEAREST_MIPMAP_LINEAR:1604,LINEAR_MIPMAP_LINEAR:1605},J={REPEAT:1700,CLAMP_TO_EDGE:1701,MIRRORED_REPEAT:1702},et={LEQUAL:515,LESS:513,ALWAYS:519},Kt={KEEP:7680},$={HARD:"hard",POISSON_SOFT:"poisson_soft",PCF3_SOFT:"pcf3_soft",PCF5_SOFT:"pcf5_soft",PCSS16_SOFT:"pcss16_soft",PCSS32_SOFT:"pcss32_soft",PCSS64_SOFT:"pcss64_soft"},Oe={LINEAR:"linear",SRGB:"sRGB",GAMMA:"Gamma"},gs={MULTIPLY:"ENVMAP_BLENDING_MULTIPLY"},vs={TRIANGLES:4},ut={NONE:0,RGB:1,RGBA:2},C={COLOR_ATTACHMENT0:2e3,COLOR_ATTACHMENT1:2001,COLOR_ATTACHMENT2:2002,COLOR_ATTACHMENT3:2003,COLOR_ATTACHMENT4:2004,COLOR_ATTACHMENT5:2005,COLOR_ATTACHMENT6:2006,COLOR_ATTACHMENT7:2007,COLOR_ATTACHMENT8:2008,COLOR_ATTACHMENT9:2009,COLOR_ATTACHMENT10:2010,COLOR_ATTACHMENT11:2011,COLOR_ATTACHMENT12:2012,COLOR_ATTACHMENT13:2013,COLOR_ATTACHMENT14:2014,COLOR_ATTACHMENT15:2015,DEPTH_ATTACHMENT:2020,STENCIL_ATTACHMENT:2021,DEPTH_STENCIL_ATTACHMENT:2030},Hi={STATIC_DRAW:35044,DYNAMIC_DRAW:35048},$t={ANY_SAMPLES_PASSED:7e3,ANY_SAMPLES_PASSED_CONSERVATIVE:7001,TIME_ELAPSED:7002};class pt{addEventListener(e,t,n){this._eventMap===void 0&&(this._eventMap={});const i=this._eventMap;i[e]===void 0&&(i[e]=[]),i[e].push({listener:t,thisObject:n||this})}removeEventListener(e,t,n){if(this._eventMap===void 0)return;const s=this._eventMap[e];if(s!==void 0)for(let r=0,o=s.length;r<o;r++){const c=s[r];if(c.listener===t&&c.thisObject===(n||this)){s.splice(r,1);break}}}dispatchEvent(e){if(this._eventMap===void 0)return;const n=this._eventMap[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let s=0,r=i.length;s<r;s++){const o=i[s];o.listener.call(o.thisObject,e)}e.target=null}}}class Ts{constructor(e,t,n){this.isLoading=!1,this.itemsLoaded=0,this.itemsTotal=0,this.urlModifier=void 0,this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n}itemStart(e){this.itemsTotal++,this.isLoading===!1&&this.onStart!==void 0&&this.onStart(e,this.itemsLoaded,this.itemsTotal),this.isLoading=!0}itemEnd(e){this.itemsLoaded++,this.onProgress!==void 0&&this.onProgress(e,this.itemsLoaded,this.itemsTotal),this.itemsLoaded===this.itemsTotal&&(this.isLoading=!1,this.onLoad!==void 0&&this.onLoad())}itemError(e){this.onError!==void 0&&this.onError(e)}resolveURL(e){return this.urlModifier?this.urlModifier(e):e}setURLModifier(e){return this.urlModifier=e,this}}const Ss=new Ts;class Vi{constructor(e){this.manager=e!==void 0?e:Ss,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(i,s){n.load(e,i,t,s)})}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setRequestHeader(e){return this.requestHeader=e,this}}class Es extends Vi{constructor(e){super(e),this.responseType=void 0,this.mimeType=void 0}load(e,t,n,i){e===void 0&&(e=""),this.path!=null&&(e=this.path+e),e=this.manager.resolveURL(e);const s=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),r=this.mimeType,o=this.responseType;fetch(s).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("t3d.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const l=c.body.getReader(),h=c.headers.get("Content-Length"),d=h?parseInt(h):0,f=d!==0;let u=0;const p=new ReadableStream({start(_){v();function v(){l.read().then(({done:m,value:M})=>{m?_.close():(u+=M.byteLength,n!==void 0&&n(new ProgressEvent("progress",{lengthComputable:f,loaded:u,total:d})),_.enqueue(M),v())})}}});return new Response(p)}else throw new xs(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(o){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(l=>new DOMParser().parseFromString(l,r));case"json":return c.json();default:if(r===void 0)return c.text();{const h=/charset="?([^;"\s]*)"?/i.exec(r),d=h&&h[1]?h[1].toLowerCase():void 0,f=new TextDecoder(d);return c.arrayBuffer().then(u=>f.decode(u))}}}).then(c=>{t&&t(c)}).catch(c=>{i&&i(c),this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}}class xs extends Error{constructor(e,t){super(e),this.response=t}}class B{constructor(e=0,t=0){this.x=e,this.y=t}set(e=0,t=0){return this.x=e,this.y=t,this}lerpVectors(e,t,n){return this.subVectors(t,e).multiplyScalar(n).add(e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}getLength(){return Math.sqrt(this.getLengthSquared())}getLengthSquared(){return this.x*this.x+this.y*this.y}normalize(e=1){const t=this.getLength()||1,n=e/t;return this.x*=n,this.y*=n,this}subtract(e,t=new B){return t.set(this.x-e.x,this.y-e.y)}sub(e){return this.x-=e.x,this.y-=e.y,this}copy(e){return this.x=e.x,this.y=e.y,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}fromArray(e,t=0,n=!1){let i=e[t],s=e[t+1];return n&&(i=y.denormalize(i,e),s=y.denormalize(s,e)),this.x=i,this.y=s,this}toArray(e=[],t=0,n=!1){let i=this.x,s=this.y;return n&&(i=y.normalize(i,e),s=y.normalize(s,e)),e[t]=i,e[t+1]=s,e}add(e){return this.x+=e.x,this.y+=e.y,this}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}clone(){return new B(this.x,this.y)}}class it{constructor(e,t){this.min=e!==void 0?e:new S(1/0,1/0,1/0),this.max=t!==void 0?t:new S(-1/0,-1/0,-1/0)}set(e,t){this.min.copy(e),this.max.copy(t)}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByBox3(e){return this.min.min(e.min),this.max.max(e.max),this}setFromArray(e,t=3,n=0){let i=1/0,s=1/0,r=1/0,o=-1/0,c=-1/0,l=-1/0;for(let h=0,d=e.length;h<d;h+=t){const f=e[h+n],u=e[h+n+1],p=e[h+n+2];f<i&&(i=f),u<s&&(s=u),p<r&&(r=p),f>o&&(o=f),u>c&&(c=u),p>l&&(l=p)}return this.min.set(i,s,r),this.max.set(o,c,l),this}clampPoint(e,t){return t.copy(e).min(this.max).max(this.min)}distanceToPoint(e){return this.clampPoint(e,Zn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Zn).getLength()*.5),e}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}getCenter(e=new S){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e=new S){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}getPoints(e){const t=this.min.x,n=this.min.y,i=this.min.z,s=this.max.x,r=this.max.y,o=this.max.z;return e[0].set(s,r,o),e[1].set(s,n,o),e[2].set(s,n,i),e[3].set(s,r,i),e[4].set(t,r,o),e[5].set(t,n,o),e[6].set(t,n,i),e[7].set(t,r,i),e}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ue[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ue[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ue[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ue[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ue[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ue[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ue[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ue[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ue),this)}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ot),Et.subVectors(this.max,ot),qe.subVectors(e.a,ot),Ye.subVectors(e.b,ot),Qe.subVectors(e.c,ot),xe.subVectors(Ye,qe),Me.subVectors(Qe,Ye),be.subVectors(qe,Qe);let t=[0,-xe.z,xe.y,0,-Me.z,Me.y,0,-be.z,be.y,xe.z,0,-xe.x,Me.z,0,-Me.x,be.z,0,-be.x,-xe.y,xe.x,0,-Me.y,Me.x,0,-be.y,be.x,0];return!Jt(t,qe,Ye,Qe,Et)||(t=[1,0,0,0,1,0,0,0,1],!Jt(t,qe,Ye,Qe,Et))?!1:(xt.crossVectors(xe,Me),t=[xt.x,xt.y,xt.z],Jt(t,qe,Ye,Qe,Et))}clone(){return new it().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}}const ue=[new S,new S,new S,new S,new S,new S,new S,new S],Zn=new S,qe=new S,Ye=new S,Qe=new S,xe=new S,Me=new S,be=new S,ot=new S,Et=new S,xt=new S,Ne=new S;function Jt(a,e,t,n,i){for(let s=0,r=a.length-3;s<=r;s+=3){Ne.fromArray(a,s);const o=i.x*Math.abs(Ne.x)+i.y*Math.abs(Ne.y)+i.z*Math.abs(Ne.z),c=e.dot(Ne),l=t.dot(Ne),h=n.dot(Ne);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}class tt{constructor(e,t,n){if(this.r=0,this.g=0,this.b=0,t===void 0&&n===void 0)return this.setHex(e);this.setRGB(e,t,n)}lerpColors(e,t,n){this.r=n*(t.r-e.r)+e.r,this.g=n*(t.g-e.g)+e.g,this.b=n*(t.b-e.b)+e.b}lerp(e,t){this.lerpColors(this,e,t)}clone(){return new tt(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}setHex(e){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,this}getHex(){return y.clamp(this.r*255,0,255)<<16^y.clamp(this.g*255,0,255)<<8^y.clamp(this.b*255,0,255)<<0}setRGB(e,t,n){return this.r=e,this.g=t,this.b=n,this}setHSL(e,t,n){if(e=y.euclideanModulo(e,1),t=y.clamp(t,0,1),n=y.clamp(n,0,1),t===0)this.r=this.g=this.b=n;else{const i=n<=.5?n*(1+t):n+t-n*t,s=2*n-i;this.r=en(s,i,e+1/3),this.g=en(s,i,e),this.b=en(s,i,e-1/3)}return this}convertSRGBToLinear(){return this.r=tn(this.r),this.g=tn(this.g),this.b=tn(this.b),this}convertLinearToSRGB(){return this.r=nn(this.r),this.g=nn(this.g),this.b=nn(this.b),this}fromArray(e,t=0,n=!1){let i=e[t],s=e[t+1],r=e[t+2];return n&&(i=y.denormalize(i,e),s=y.denormalize(s,e),r=y.denormalize(r,e)),this.r=i,this.g=s,this.b=r,this}toArray(e=[],t=0,n=!1){let i=this.r,s=this.g,r=this.b;return n&&(i=y.normalize(i,e),s=y.normalize(s,e),r=y.normalize(r,e)),e[t]=i,e[t+1]=s,e[t+2]=r,e}}function en(a,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?a+(e-a)*6*t:t<1/2?e:t<2/3?a+(e-a)*6*(2/3-t):a}function tn(a){return a<.04045?a*.0773993808:Math.pow(a*.9478672986+.0521327014,2.4)}function nn(a){return a<.0031308?a*12.92:1.055*Math.pow(a,.41666)-.055}const jn=new U;class nt{constructor(e=0,t=0,n=0,i=nt.DefaultOrder){this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this.onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this.onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this.onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this.onChangeCallback()}clone(){return new nt(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this.onChangeCallback(),this}set(e=0,t=0,n=0,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this.onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,s=i[0],r=i[4],o=i[8],c=i[1],l=i[5],h=i[9],d=i[2],f=i[6],u=i[10];return t==="XYZ"?(this._y=Math.asin(y.clamp(o,-1,1)),Math.abs(o)<.99999?(this._x=Math.atan2(-h,u),this._z=Math.atan2(-r,s)):(this._x=Math.atan2(f,l),this._z=0)):t==="YXZ"?(this._x=Math.asin(-y.clamp(h,-1,1)),Math.abs(h)<.99999?(this._y=Math.atan2(o,u),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,s),this._z=0)):t==="ZXY"?(this._x=Math.asin(y.clamp(f,-1,1)),Math.abs(f)<.99999?(this._y=Math.atan2(-d,u),this._z=Math.atan2(-r,l)):(this._y=0,this._z=Math.atan2(c,s))):t==="ZYX"?(this._y=Math.asin(-y.clamp(d,-1,1)),Math.abs(d)<.99999?(this._x=Math.atan2(f,u),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-r,l))):t==="YZX"?(this._z=Math.asin(y.clamp(c,-1,1)),Math.abs(c)<.99999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(o,u))):t==="XZY"?(this._z=Math.asin(-y.clamp(r,-1,1)),Math.abs(r)<.99999?(this._x=Math.atan2(f,l),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,u),this._y=0)):console.warn("given unsupported order: "+t),this._order=t,n===!0&&this.onChangeCallback(),this}setFromQuaternion(e,t,n){return e.toMatrix4(jn),this.setFromRotationMatrix(jn,t,n)}onChange(e){return this.onChangeCallback=e,this}onChangeCallback(){}}nt.RotationOrders=["XYZ","YZX","ZXY","XZY","YXZ","ZYX"];nt.DefaultOrder="XYZ";class He{constructor(){this.elements=[1,0,0,0,1,0,0,0,1]}set(e,t,n,i,s,r,o,c,l){const h=this.elements;return h[0]=e,h[3]=t,h[6]=n,h[1]=i,h[4]=s,h[7]=r,h[2]=o,h[5]=c,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1)}isIdentity(){const e=this.elements;return e[0]===1&&e[3]===0&&e[6]===0&&e[1]===0&&e[4]===1&&e[7]===0&&e[2]===0&&e[5]===0&&e[8]===1}inverse(){return this.getInverse(this)}getInverse(e){const t=e.elements,n=this.elements,i=t[0],s=t[1],r=t[2],o=t[3],c=t[4],l=t[5],h=t[6],d=t[7],f=t[8],u=f*c-l*d,p=l*h-f*o,_=d*o-c*h,v=i*u+s*p+r*_;if(v===0)return console.warn("Matrix3: .getInverse() can not invert matrix, determinant is 0"),this.identity();const m=1/v;return n[0]=u*m,n[1]=(r*d-f*s)*m,n[2]=(l*s-r*c)*m,n[3]=p*m,n[4]=(f*i-r*h)*m,n[5]=(r*o-l*i)*m,n[6]=_*m,n[7]=(s*h-d*i)*m,n[8]=(c*i-s*o)*m,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new He().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,r=n[0],o=n[3],c=n[6],l=n[1],h=n[4],d=n[7],f=n[2],u=n[5],p=n[8],_=i[0],v=i[3],m=i[6],M=i[1],A=i[4],T=i[7],w=i[2],R=i[5],O=i[8];return s[0]=r*_+o*M+c*w,s[3]=r*v+o*A+c*R,s[6]=r*m+o*T+c*O,s[1]=l*_+h*M+d*w,s[4]=l*v+h*A+d*R,s[7]=l*m+h*T+d*O,s[2]=f*_+u*M+p*w,s[5]=f*v+u*A+p*R,s[8]=f*m+u*T+p*O,this}transform(e,t,n,i,s,r,o){const c=this.elements,l=Math.cos(s),h=Math.sin(s);return c[0]=l*n,c[3]=-h*i,c[6]=e,c[1]=h*n,c[4]=l*i,c[7]=t,c[2]=0,c[5]=0,c[8]=1,(r||o)&&(c[6]-=r*c[0]+o*c[3],c[7]-=r*c[1]+o*c[4]),this}setUvTransform(e,t,n,i,s,r,o){const c=Math.cos(s),l=Math.sin(s);return this.set(n*c,n*l,-n*(c*r+l*o)+r+e,-i*l,i*c,-i*(-l*r+c*o)+o+t,0,0,1)}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10])}extractBasis(e,t,n){const i=this.elements;return e.fromArray(i),t.fromArray(i,3),n.fromArray(i,6),this}}const Kn=new S,Ms=new S,sn=new He;class me{constructor(e=new S(1,0,0),t=0){this.normal=e,this.constant=t}static intersectPlanes(e,t,n,i){return sn.set(e.normal.x,e.normal.y,e.normal.z,t.normal.x,t.normal.y,t.normal.z,n.normal.x,n.normal.y,n.normal.z),i.set(-e.constant,-t.constant,-n.constant),i.applyMatrix3(sn.inverse()),i}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=Kn.subVectors(n,t).cross(Ms.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}normalize(){const e=1/this.normal.getLength();return this.normal.multiplyScalar(e),this.constant*=e,this}distanceToPoint(e){return this.normal.dot(e)+this.constant}projectPoint(e,t=new S){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}mirrorPoint(e,t=new S){const n=this.distanceToPoint(e);return t.copy(e).addScaledVector(this.normal,-2*n)}coplanarPoint(e=new S){return e.copy(this.normal).multiplyScalar(-this.constant)}clone(){return new me().copy(this)}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}applyMatrix4(e,t){const n=t||sn.setFromMatrix4(e).inverse().transpose(),i=this.coplanarPoint(Kn).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}}const Mt=new S,As=new He;class ws{constructor(e=new me,t=new me,n=new me,i=new me,s=new me,r=new me){this.planes=[e,t,n,i,s,r]}set(e,t,n,i,s,r){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(s),o[5].copy(r),this}setFromMatrix(e){const t=this.planes,n=e.elements,i=n[0],s=n[1],r=n[2],o=n[3],c=n[4],l=n[5],h=n[6],d=n[7],f=n[8],u=n[9],p=n[10],_=n[11],v=n[12],m=n[13],M=n[14],A=n[15];return t[0].setComponents(o-i,d-c,_-f,A-v).normalize(),t[1].setComponents(o+i,d+c,_+f,A+v).normalize(),t[2].setComponents(o+s,d+l,_+u,A+m).normalize(),t[3].setComponents(o-s,d-l,_-u,A-m).normalize(),t[4].setComponents(o-r,d-h,_-p,A-M).normalize(),t[5].setComponents(o+r,d+h,_+p,A+M).normalize(),this}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(Mt.x=i.normal.x>0?e.max.x:e.min.x,Mt.y=i.normal.y>0?e.max.y:e.min.y,Mt.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Mt)<0)return!1}return!0}applyMatrix4(e){const t=this.planes,n=As.setFromMatrix4(e).inverse().transpose();for(let i=0;i<6;i++)t[i].applyMatrix4(e,n);return this}clone(){return new this.constructor().copy(this)}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}}const Ae=new S,At=new S,rn=new S,wt=new S,an=new S;class ys{constructor(e=new S,t=new S(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}at(e,t=new S){return t.copy(this.direction).multiplyScalar(e).add(this.origin)}distanceSqToPoint(e){const t=Ae.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ae.copy(this.direction).multiplyScalar(t).add(this.origin),Ae.distanceToSquared(e))}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t=new S){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectsBox(e){return this.intersectBox(e,Ae)!==null}intersectBox(e,t){let n,i,s,r,o,c;const l=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,f=this.origin;return l>=0?(n=(e.min.x-f.x)*l,i=(e.max.x-f.x)*l):(n=(e.max.x-f.x)*l,i=(e.min.x-f.x)*l),h>=0?(s=(e.min.y-f.y)*h,r=(e.max.y-f.y)*h):(s=(e.max.y-f.y)*h,r=(e.min.y-f.y)*h),n>r||s>i||((s>n||n!==n)&&(n=s),(r<i||i!==i)&&(i=r),d>=0?(o=(e.min.z-f.z)*d,c=(e.max.z-f.z)*d):(o=(e.max.z-f.z)*d,c=(e.min.z-f.z)*d),n>c||o>i)||((o>n||n!==n)&&(n=o),(c<i||i!==i)&&(i=c),i<0)?null:this.at(n>=0?n:i,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}intersectSphere(e,t){Ae.subVectors(e.center,this.origin);const n=Ae.dot(this.direction),i=Ae.dot(Ae)-n*n,s=e.radius*e.radius;if(i>s)return null;const r=Math.sqrt(s-i),o=n-r,c=n+r;return o<0&&c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectTriangle(e,t,n,i,s){rn.subVectors(t,e),wt.subVectors(n,e),an.crossVectors(rn,wt);let r=this.direction.dot(an),o;if(r>0){if(i)return null;o=1}else if(r<0)o=-1,r=-r;else return null;At.subVectors(this.origin,e);const c=o*this.direction.dot(wt.crossVectors(At,wt));if(c<0)return null;const l=o*this.direction.dot(rn.cross(At));if(l<0||c+l>r)return null;const h=-o*At.dot(an);return h<0?null:this.at(h/r,s)}}const $n=new it,ct=new S;class mt{constructor(e=new S,t=-1){this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):$n.setFromPoints(e).getCenter(n);let i=0;for(let s=0,r=e.length;s<r;s++)i=Math.max(i,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(i),this}setFromArray(e,t=3,n=0){const i=this.center;$n.setFromArray(e,t).getCenter(i);let s=0;for(let r=0,o=e.length;r<o;r+=t)ct.fromArray(e,r+n),s=Math.max(s,i.distanceToSquared(ct));return this.radius=Math.sqrt(s),this}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ct.subVectors(e,this.center);const t=ct.getLengthSquared();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(ct,i/n),this.radius+=i}return this}clone(){return new mt().copy(this)}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}}class Xt{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}clone(){return new Xt().copy(this)}makeSafe(){return this.phi=y.clamp(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.radius=e.getLength(),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e.x,e.z),this.phi=Math.acos(y.clamp(e.y/this.radius,-1,1))),this}}class Cs{constructor(){this.coefficients=[];for(let e=0;e<9;e++)this.coefficients.push(new S)}set(e){for(let t=0;t<9;t++)this.coefficients[t].copy(e[t]);return this}zero(){for(let e=0;e<9;e++)this.coefficients[e].set(0,0,0);return this}getAt(e,t){const n=e.x,i=e.y,s=e.z,r=this.coefficients;return t.copy(r[0]).multiplyScalar(.282095),t.addScaledVector(r[1],.488603*i),t.addScaledVector(r[2],.488603*s),t.addScaledVector(r[3],.488603*n),t.addScaledVector(r[4],1.092548*(n*i)),t.addScaledVector(r[5],1.092548*(i*s)),t.addScaledVector(r[6],.315392*(3*s*s-1)),t.addScaledVector(r[7],1.092548*(n*s)),t.addScaledVector(r[8],.546274*(n*n-i*i)),t}getIrradianceAt(e,t){const n=e.x,i=e.y,s=e.z,r=this.coefficients;return t.copy(r[0]).multiplyScalar(.886227),t.addScaledVector(r[1],2*.511664*i),t.addScaledVector(r[2],2*.511664*s),t.addScaledVector(r[3],2*.511664*n),t.addScaledVector(r[4],2*.429043*n*i),t.addScaledVector(r[5],2*.429043*i*s),t.addScaledVector(r[6],.743125*s*s-.247708),t.addScaledVector(r[7],2*.429043*n*s),t.addScaledVector(r[8],.429043*(n*n-i*i)),t}add(e){for(let t=0;t<9;t++)this.coefficients[t].add(e.coefficients[t]);return this}addScaledSH(e,t){for(let n=0;n<9;n++)this.coefficients[n].addScaledVector(e.coefficients[n],t);return this}scale(e){for(let t=0;t<9;t++)this.coefficients[t].multiplyScalar(e);return this}lerp(e,t){for(let n=0;n<9;n++)this.coefficients[n].lerpVectors(this.coefficients[n],e.coefficients[n],t);return this}equals(e){for(let t=0;t<9;t++)if(!this.coefficients[t].equals(e.coefficients[t]))return!1;return!0}copy(e){return this.set(e.coefficients)}clone(){return new this.constructor().copy(this)}fromArray(e,t=0){const n=this.coefficients;for(let i=0;i<9;i++)n[i].fromArray(e,t+i*3);return this}toArray(e=[],t=0){const n=this.coefficients;for(let i=0;i<9;i++)n[i].toArray(e,t+i*3);return e}static getBasisAt(e,t){const n=e.x,i=e.y,s=e.z;t[0]=.282095,t[1]=.488603*i,t[2]=.488603*s,t[3]=.488603*n,t[4]=1.092548*n*i,t[5]=1.092548*i*s,t[6]=.315392*(3*s*s-1),t[7]=1.092548*n*s,t[8]=.546274*(n*n-i*i)}}const De=new S,lt=new S,on=new S,ht=new S;class ki{constructor(e=new S,t=new S,n=new S){this.a=e,this.b=t,this.c=n}static normal(e,t,n,i){const s=i||new S;s.subVectors(n,t),De.subVectors(e,t),s.cross(De);const r=s.getLengthSquared();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static barycoordFromPoint(e,t,n,i,s){De.subVectors(i,t),lt.subVectors(n,t),on.subVectors(e,t);const r=De.dot(De),o=De.dot(lt),c=De.dot(on),l=lt.dot(lt),h=lt.dot(on),d=r*l-o*o,f=s||new S;if(d===0)return f.set(-2,-1,-1);const u=1/d,p=(l*c-o*h)*u,_=(r*h-o*c)*u;return f.set(1-p-_,_,p)}static containsPoint(e,t,n,i){return this.barycoordFromPoint(e,t,n,i,ht),ht.x>=0&&ht.y>=0&&ht.x+ht.y<=1}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}}class ae{constructor(e=0,t=0,n=0,i=1){this.x=e,this.y=t,this.z=n,this.w=i}lerpVectors(e,t,n){return this.subVectors(t,e).multiplyScalar(n).add(e)}set(e=0,t=0,n=0,i=1){return this.x=e,this.y=t,this.z=n,this.w=i,this}normalize(){return this.multiplyScalar(1/(this.getLength()||1))}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}getLengthSquared(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}getLength(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}getManhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=this.w,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i+r[12]*s,this.y=r[1]*t+r[5]*n+r[9]*i+r[13]*s,this.z=r[2]*t+r[6]*n+r[10]*i+r[14]*s,this.w=r[3]*t+r[7]*n+r[11]*i+r[15]*s,this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}fromArray(e,t=0,n=!1){let i=e[t],s=e[t+1],r=e[t+2],o=e[t+3];return n&&(i=y.denormalize(i,e),s=y.denormalize(s,e),r=y.denormalize(r,e),o=y.denormalize(o,e)),this.x=i,this.y=s,this.z=r,this.w=o,this}toArray(e=[],t=0,n=!1){let i=this.x,s=this.y,r=this.z,o=this.w;return n&&(i=y.normalize(i,e),s=y.normalize(s,e),r=y.normalize(r,e),o=y.normalize(o,e)),e[t]=i,e[t+1]=s,e[t+2]=r,e[t+3]=o,e}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}clone(){return new ae(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}}function Wi(a){const e={};for(const t in a){const n=a[t];Array.isArray(n)||ArrayBuffer.isView(n)?e[t]=n.slice():e[t]=n}return e}function Pn(a){const e=Array.isArray(a)?[]:{};if(a&&typeof a=="object")for(const t in a)a.hasOwnProperty(t)&&(e[t]=a[t]&&typeof a[t]=="object"?Pn(a[t]):a[t]);return e}let Rs=0;const Jn=new U;class ye{constructor(){this.id=Rs++,this.uuid=y.generateUUID(),this.name="",this.position=new S,this.scale=new S(1,1,1),this.euler=new nt,this.quaternion=new Be;const e=this.euler,t=this.quaternion;e.onChange(function(){t.setFromEuler(e,!1)}),t.onChange(function(){e.setFromQuaternion(t,void 0,!1)}),this.matrix=new U,this.worldMatrix=new U,this.children=new Array,this.parent=null,this.castShadow=!1,this.receiveShadow=!1,this.shadowType=$.PCF3_SOFT,this.frustumCulled=!0,this.visible=!0,this.renderOrder=0,this.renderLayer=0,this.renderable=!0,this.userData={},this.matrixAutoUpdate=!0,this.matrixNeedsUpdate=!0,this.worldMatrixNeedsUpdate=!0}onBeforeRender(){}onAfterRender(){}add(e){if(e===this){console.error("Object3D.add: object can't be added as a child of itself.",e);return}e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.worldMatrixNeedsUpdate=!0}remove(e){const t=this.children.indexOf(e);t!==-1&&(e.parent=null,this.children.splice(t,1),e.worldMatrixNeedsUpdate=!0)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}updateMatrix(e){if((this.matrixAutoUpdate||this.matrixNeedsUpdate)&&(this.matrix.transform(this.position,this.scale,this.quaternion),this.matrixNeedsUpdate=!1,this.worldMatrixNeedsUpdate=!0),this.worldMatrixNeedsUpdate||e){if(this.worldMatrix.copy(this.matrix),this.parent){const n=this.parent.worldMatrix;this.worldMatrix.premultiply(n)}this.worldMatrixNeedsUpdate=!1,e=!0}const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrix(e)}getWorldDirection(e=new S){const t=this.worldMatrix.elements;return e.set(t[8],t[9],t[10]).normalize()}lookAt(e,t){Jn.lookAtRH(e,this.position,t),this.quaternion.setFromRotationMatrix(Jn)}raycast(e,t){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.position.copy(e.position),this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.worldMatrix.copy(e.worldMatrix),this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.shadowType=e.shadowType,this.frustumCulled=e.frustumCulled,this.visible=e.visible,this.renderOrder=e.renderOrder,this.renderLayer=e.renderLayer,this.renderable=e.renderable,this.userData=Pn(e.userData),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}class Ce extends ye{constructor(e=16777215,t=1){super(),this.color=new tt(e),this.intensity=t}lookAt(e,t){ei.lookAtRH(this.position,e,t),this.quaternion.setFromRotationMatrix(ei)}copy(e){return super.copy(e),this.color.copy(e.color),this.intensity=e.intensity,this}}Ce.prototype.isLight=!0;const ei=new U;class _t extends Ce{constructor(e,t,n=10,i=10){super(e,t),this.width=n,this.height=i}get power(){return this.intensity*this.width*this.height*Math.PI}set power(e){this.intensity=e/(this.width*this.height*Math.PI)}copy(e){return super.copy(e),this.width=e.width,this.height=e.height,this}}_t.prototype.isRectAreaLight=!0;_t.LTC1=null;_t.LTC2=null;const we=new S,Ze=new U,cn=[],ln=[],hn=[];let Ps=0;class Ls{constructor(){this.id=Ps++,this.version=0,this.lights=[],this.ambient=new Float32Array([0,0,0]),this.sh=new Float32Array(27),this.hemisphere=[],this.directional=[],this.directionalShadow=[],this.directionalShadowMap=[],this.directionalShadowDepthMap=[],this.directionalShadowMatrix=new Float32Array(0),this.point=[],this.pointShadow=[],this.pointShadowMap=[],this.pointShadowMatrix=new Float32Array(0),this.spot=[],this.spotShadow=[],this.spotShadowMap=[],this.spotShadowDepthMap=[],this.spotShadowMatrix=new Float32Array(0),this.rectArea=[],this.LTC1=null,this.LTC2=null,this.useAmbient=!1,this.useSphericalHarmonics=!1,this.hemisNum=0,this.directsNum=0,this.pointsNum=0,this.spotsNum=0,this.rectAreaNum=0,this.directShadowNum=0,this.pointShadowNum=0,this.spotShadowNum=0,this.totalNum=0,this.shadowsNum=0,this.hash=new bs}begin(){this.totalNum=0,this.shadowsNum=0}push(e){this.lights[this.totalNum++]=e,yn(e)&&this.shadowsNum++}end(e){this.lights.length=this.totalNum,this.lights.sort(Ns),this._setupCache(e),this.hash.update(this),this.version++}_setupCache(e){for(let s=0;s<3;s++)this.ambient[s]=0;for(let s=0;s<this.sh.length;s++)this.sh[s]=0;this.useAmbient=!1,this.useSphericalHarmonics=!1,this.hemisNum=0,this.directsNum=0,this.pointsNum=0,this.spotsNum=0,this.rectAreaNum=0,this.directShadowNum=0,this.pointShadowNum=0,this.spotShadowNum=0,this.LTC1=null,this.LTC2=null;for(let s=0,r=this.lights.length;s<r;s++){const o=this.lights[s];o.isAmbientLight?this._doAddAmbientLight(o):o.isHemisphereLight?this._doAddHemisphereLight(o,e):o.isDirectionalLight?this._doAddDirectLight(o,e):o.isPointLight?this._doAddPointLight(o,e):o.isSpotLight?this._doAddSpotLight(o,e):o.isSphericalHarmonicsLight?this._doAddSphericalHarmonicsLight(o):o.isRectAreaLight&&this._doAddRectAreaLight(o,e)}const t=this.directShadowNum;if(t>0){this.directionalShadowMap.length=t,this.directionalShadowDepthMap.length=t,cn.length=t,this.directionalShadowMatrix.length!==t*16&&(this.directionalShadowMatrix=new Float32Array(t*16));for(let s=0;s<t;s++)cn[s].toArray(this.directionalShadowMatrix,s*16)}const n=this.pointShadowNum;if(n>0){this.pointShadowMap.length=n,ln.length=n,this.pointShadowMatrix.length!==n*16&&(this.pointShadowMatrix=new Float32Array(n*16));for(let s=0;s<n;s++)ln[s].toArray(this.pointShadowMatrix,s*16)}const i=this.spotShadowNum;if(i>0){this.spotShadowMap.length=i,this.spotShadowDepthMap.length=i,hn.length=i,this.spotShadowMatrix.length!==i*16&&(this.spotShadowMatrix=new Float32Array(i*16));for(let s=0;s<i;s++)hn[s].toArray(this.spotShadowMatrix,s*16)}this.rectAreaNum>0&&(this.LTC1=_t.LTC1,this.LTC2=_t.LTC2)}_doAddAmbientLight(e){const t=e.intensity,n=e.color;this.ambient[0]+=n.r*t,this.ambient[1]+=n.g*t,this.ambient[2]+=n.b*t,this.useAmbient=!0}_doAddSphericalHarmonicsLight(e){const t=e.intensity,n=e.sh.coefficients;for(let i=0;i<n.length;i+=1)this.sh[i*3]+=n[i].x*t,this.sh[i*3+1]+=n[i].y*t,this.sh[i*3+2]+=n[i].z*t;this.useSphericalHarmonics=!0}_doAddHemisphereLight(e,t){const n=e.intensity,i=e.color,s=e.groundColor,r=t.useAnchorMatrix,o=dt(e);o.skyColor[0]=i.r*n,o.skyColor[1]=i.g*n,o.skyColor[2]=i.b*n,o.groundColor[0]=s.r*n,o.groundColor[1]=s.g*n,o.groundColor[2]=s.b*n;const c=e.worldMatrix.elements,l=we.set(c[4],c[5],c[6]).normalize();r&&l.transformDirection(t.anchorMatrixInverse),l.toArray(o.direction),this.hemisphere[this.hemisNum++]=o}_doAddDirectLight(e,t){const n=e.intensity,i=e.color,s=t.useAnchorMatrix,r=dt(e);r.color[0]=i.r*n,r.color[1]=i.g*n,r.color[2]=i.b*n;const o=e.getWorldDirection(we);if(s&&o.transformDirection(t.anchorMatrixInverse),o.multiplyScalar(-1).toArray(r.direction),e.castShadow){const c=e.shadow,l=fn(e);l.shadowBias[0]=c.bias,l.shadowBias[1]=c.normalBias,l.shadowMapSize[0]=c.mapSize.x,l.shadowMapSize[1]=c.mapSize.y,l.shadowParams[0]=c.radius,l.shadowParams[1]=c.frustumEdgeFalloff,this.directionalShadow[this.directShadowNum++]=l,c.update(e),c.updateMatrix(),s&&c.matrix.multiply(t.anchorMatrix),this.directionalShadowMap[this.directsNum]=c.map,this.directionalShadowDepthMap[this.directsNum]=c.depthMap,cn[this.directsNum]=c.matrix}this.directional[this.directsNum++]=r}_doAddPointLight(e,t){const n=e.intensity,i=e.color,s=e.distance,r=e.decay,o=t.useAnchorMatrix,c=dt(e);c.color[0]=i.r*n,c.color[1]=i.g*n,c.color[2]=i.b*n,c.distance=s,c.decay=r;const l=we.setFromMatrixPosition(e.worldMatrix);if(o&&l.applyMatrix4(t.anchorMatrixInverse),c.position[0]=l.x,c.position[1]=l.y,c.position[2]=l.z,e.castShadow){const h=e.shadow,d=fn(e);d.shadowBias[0]=h.bias,d.shadowBias[1]=h.normalBias,d.shadowMapSize[0]=h.mapSize.x,d.shadowMapSize[1]=h.mapSize.y,d.shadowParams[0]=h.radius,d.shadowParams[1]=0,d.shadowCameraRange[0]=h.cameraNear,d.shadowCameraRange[1]=h.cameraFar,this.pointShadow[this.pointShadowNum++]=d,h.update(e,0),h.matrix.makeTranslation(-l.x,-l.y,-l.z),this.pointShadowMap[this.pointsNum]=h.map,ln[this.pointsNum]=h.matrix}this.point[this.pointsNum++]=c}_doAddSpotLight(e,t){const n=e.intensity,i=e.color,s=e.distance,r=e.decay,o=t.useAnchorMatrix,c=dt(e);c.color[0]=i.r*n,c.color[1]=i.g*n,c.color[2]=i.b*n,c.distance=s,c.decay=r;const l=we.setFromMatrixPosition(e.worldMatrix);o&&l.applyMatrix4(t.anchorMatrixInverse),c.position[0]=l.x,c.position[1]=l.y,c.position[2]=l.z;const h=e.getWorldDirection(we);o&&h.transformDirection(t.anchorMatrixInverse),h.multiplyScalar(-1).toArray(c.direction);const d=Math.cos(e.angle),f=Math.cos(e.angle*(1-e.penumbra));if(c.coneCos=d,c.penumbraCos=f,e.castShadow){const u=e.shadow,p=fn(e);p.shadowBias[0]=u.bias,p.shadowBias[1]=u.normalBias,p.shadowMapSize[0]=u.mapSize.x,p.shadowMapSize[1]=u.mapSize.y,p.shadowParams[0]=u.radius,p.shadowParams[1]=u.frustumEdgeFalloff,this.spotShadow[this.spotShadowNum++]=p,u.update(e),u.updateMatrix(),o&&u.matrix.multiply(t.anchorMatrix),this.spotShadowMap[this.spotsNum]=u.map,this.spotShadowDepthMap[this.spotsNum]=u.depthMap,hn[this.spotsNum]=u.matrix}this.spot[this.spotsNum++]=c}_doAddRectAreaLight(e,t){const n=e.intensity,i=e.color,s=e.height,r=e.width,o=t.useAnchorMatrix,c=dt(e);c.color[0]=i.r*n,c.color[1]=i.g*n,c.color[2]=i.b*n;const l=we.setFromMatrixPosition(e.worldMatrix);o&&l.applyMatrix4(t.anchorMatrixInverse),c.position[0]=l.x,c.position[1]=l.y,c.position[2]=l.z,Ze.copy(e.worldMatrix),o&&Ze.premultiply(t.anchorMatrixInverse),Ze.extractRotation(Ze);const h=we.set(r*.5,0,0);h.applyMatrix4(Ze),c.halfWidth[0]=h.x,c.halfWidth[1]=h.y,c.halfWidth[2]=h.z;const d=we.set(0,s*.5,0);d.applyMatrix4(Ze),c.halfHeight[0]=d.x,c.halfHeight[1]=d.y,c.halfHeight[2]=d.z,this.rectArea[this.rectAreaNum++]=c}}const dn=new WeakMap;function dt(a){if(dn.has(a))return dn.get(a);let e;return a.isHemisphereLight?e={direction:new Float32Array(3),skyColor:new Float32Array([0,0,0]),groundColor:new Float32Array([0,0,0])}:a.isDirectionalLight?e={direction:new Float32Array(3),color:new Float32Array([0,0,0])}:a.isPointLight?e={position:new Float32Array(3),color:new Float32Array([0,0,0]),distance:0,decay:0}:a.isSpotLight?e={position:new Float32Array(3),direction:new Float32Array(3),color:new Float32Array([0,0,0]),distance:0,coneCos:0,penumbraCos:0,decay:0}:a.isRectAreaLight&&(e={position:new Float32Array(3),color:new Float32Array([0,0,0]),halfWidth:new Float32Array(3),halfHeight:new Float32Array(3)}),dn.set(a,e),e}const un=new WeakMap;function fn(a){if(un.has(a))return un.get(a);let e;return a.isDirectionalLight?e={shadowBias:new Float32Array(2),shadowMapSize:new Float32Array(2),shadowParams:new Float32Array(2)}:a.isPointLight?e={shadowBias:new Float32Array(2),shadowMapSize:new Float32Array(2),shadowParams:new Float32Array(2),shadowCameraRange:new Float32Array(2)}:a.isSpotLight&&(e={shadowBias:new Float32Array(2),shadowMapSize:new Float32Array(2),shadowParams:new Float32Array(2)}),un.set(a,e),e}class bs{constructor(){this._factor=new Uint16Array(10)}update(e){this._factor[0]=e.useAmbient?1:0,this._factor[1]=e.useSphericalHarmonics?1:0,this._factor[2]=e.hemisNum,this._factor[3]=e.directsNum,this._factor[4]=e.pointsNum,this._factor[5]=e.spotsNum,this._factor[6]=e.rectAreaNum,this._factor[7]=e.directShadowNum,this._factor[8]=e.pointShadowNum,this._factor[9]=e.spotShadowNum}compare(e){if(!e)return!1;for(let t=0,n=e.length;t<n;t++)if(this._factor[t]!==e[t])return!1;return!0}copyTo(e){return e||(e=new this._factor.constructor(this._factor.length)),e.set(this._factor),e}}function Ns(a,e){const t=yn(a)?1:0;return(yn(e)?1:0)-t}function yn(a){return a.shadow&&a.castShadow}class Ds{constructor(e){this.id=e,this.opaque=[],this.opaqueCount=0,this.transparent=[],this.transparentCount=0,this._cache=[],this._cacheIndex=0,this._lastCacheIndex=0,this.opaqueSortCompareFn=Is,this.transparentSortCompareFn=Os}begin(){this._cacheIndex=0,this.opaqueCount=0,this.transparentCount=0}end(){this.opaque.length=this.opaqueCount,this.transparent.length=this.transparentCount;const e=this._cacheIndex,t=this._lastCacheIndex;if(t>e){const n=this._cache;for(let i=e;i<t;i++){const s=n[i];s.object=null,s.geometry=null,s.material=null,s.group=null}}this._lastCacheIndex=e}addRenderable(e,t,n,i,s){const r=this._cache;let o=r[this._cacheIndex];o===void 0?(o={object:e,geometry:t,material:n,z:i,renderOrder:e.renderOrder,group:s},r[this._cacheIndex]=o):(o.object=e,o.geometry=t,o.material=n,o.z=i,o.renderOrder=e.renderOrder,o.group=s),n.transparent?(this.transparent[this.transparentCount]=o,this.transparentCount++):(this.opaque[this.opaqueCount]=o,this.opaqueCount++),this._cacheIndex++}sort(){this.opaque.sort(this.opaqueSortCompareFn),Cn(this.transparent,0,this.transparent.length,this.transparentSortCompareFn)}}function Is(a,e){return a.renderOrder!==e.renderOrder?a.renderOrder-e.renderOrder:a.material.id!==e.material.id?a.material.id-e.material.id:a.id-e.id}function Os(a,e){return a.renderOrder!==e.renderOrder?a.renderOrder-e.renderOrder:a.z!==e.z?e.z-a.z:a.material.id!==e.material.id?a.material.id-e.material.id:a.id-e.id}function Cn(a,e,t,n){for(;;){if(t-e<=10){Us(a,e,t,n);return}const i=e+t>>1;let s=a[e],r=a[t-1],o=a[i];if(n(s,r)>0){const u=s;s=r,r=u}if(n(s,o)>=0){const u=s;s=o,o=r,r=u}else if(n(r,o)>0){const p=r;r=o,o=p}a[e]=s,a[t-1]=o;const h=r;let d=e+1,f=t-1;a[i]=a[d],a[d]=h;e:for(let u=d+1;u<f;u++){let p=a[u],_=n(p,h);if(_<0)a[u]=a[d],a[d]=p,d++;else if(_>0){do{if(f--,f==u)break e;const v=a[f];_=n(v,h)}while(_>0);a[u]=a[f],a[f]=p,_<0&&(p=a[u],a[u]=a[d],a[d]=p,d++)}}t-f<d-e?(Cn(a,f,t,n),t=d):(Cn(a,e,d,n),e=f)}}function Us(a,e,t,n){for(let i=e+1;i<t;i++){let s;const r=a[i];for(s=i-1;s>=e;s--){const o=a[s];if(n(o,r)>0)a[s+1]=o;else break}a[s+1]=r}}class Fs{constructor(){this.layerMap=new Map,this.layerList=[],this.lightsArray=[],this.skeletons=new Set,this._lastLayer=this.createLayer(0)}begin(){for(let e=0,t=this.layerList.length;e<t;e++)this.layerList[e].begin();this.lightsArray.length=0,this.skeletons.clear()}end(){for(let e=0,t=this.layerList.length;e<t;e++)this.layerList[e].end(),this.layerList[e].sort()}push(e,t){e.skeleton&&this.skeletons.add(e.skeleton),ti.setFromMatrixPosition(e.worldMatrix).applyMatrix4(t.projectionViewMatrix);const n=ti.z,i=e.renderLayer||0;let s=this._lastLayer;if(s.id!==i&&(s=this.layerMap.get(i),s||(s=this.createLayer(i)),this._lastLayer=s),Array.isArray(e.material)){const r=e.geometry.groups;for(let o=0;o<r.length;o++){const c=r[o],l=e.material[c.materialIndex];l&&s.addRenderable(e,e.geometry,l,n,c)}}else s.addRenderable(e,e.geometry,e.material,n)}pushLight(e){this.lightsArray.push(e)}setLayer(e,t){this.layerMap.set(e,t),this.layerList.push(t),this.layerList.sort(Bs)}createLayer(e){const t=new Ds(e);return this.setLayer(e,t),t}getLayer(e){return this.layerMap.get(e)}removeLayer(e){const t=this.layerMap.get(e);if(t){this.layerMap.delete(e);const n=this.layerList.indexOf(t);n!==-1&&this.layerList.splice(n,1),this._lastLayer===e&&(this._lastLayer=null)}}}const ti=new ae;function Bs(a,e){return a.id-e.id}const je=new me;let zs=0;class Gs{constructor(){this.id=zs++,this.version=0,this.useAnchorMatrix=!1,this.anchorMatrix=new U,this.anchorMatrixInverse=new U,this.disableShadowSampler=!1,this.logarithmicDepthBuffer=!1,this.fog=null,this.environment=null,this.envDiffuseIntensity=1,this.envSpecularIntensity=1,this.clippingPlanesData=new Float32Array([]),this.numClippingPlanes=0}update(e){this.useAnchorMatrix=!e.anchorMatrix.isIdentity(),this.anchorMatrix.copy(e.anchorMatrix),this.anchorMatrixInverse.getInverse(e.anchorMatrix),this.disableShadowSampler=e.disableShadowSampler,this.logarithmicDepthBuffer=e.logarithmicDepthBuffer,this.fog=e.fog,this.environment=e.environment,this.envDiffuseIntensity=e.envDiffuseIntensity,this.envSpecularIntensity=e.envSpecularIntensity,this.clippingPlanesData.length<e.clippingPlanes.length*4&&(this.clippingPlanesData=new Float32Array(e.clippingPlanes.length*4)),this.setClippingPlanesData(e.clippingPlanes,this.clippingPlanesData),this.numClippingPlanes=e.clippingPlanes.length,this.version++}setClippingPlanesData(e,t){for(let n=0;n<e.length;n++)je.copy(e[n]),this.useAnchorMatrix&&je.applyMatrix4(this.anchorMatrixInverse),t[n*4+0]=je.normal.x,t[n*4+1]=je.normal.y,t[n*4+2]=je.normal.z,t[n*4+3]=je.constant;return t}}function Hs(a){return a.elements[11]===-1}let Vs=0;class ks{constructor(e,t){this.scene=e,this.lights=t,this.camera={id:Vs++,version:0,near:0,far:0,position:new S,logDepthCameraNear:0,logDepthBufFC:0,viewMatrix:new U,projectionMatrix:new U,projectionViewMatrix:new U,rect:new ae(0,0,1,1)},this.gammaFactor=2,this.outputEncoding=Oe.LINEAR}updateCamera(e){const t=this.scene,n=this.camera,i=e.projectionMatrix;let s=0,r=0;Hs(i)?(s=i.elements[14]/(i.elements[10]-1),r=i.elements[14]/(i.elements[10]+1)):(s=(i.elements[14]+1)/i.elements[10],r=(i.elements[14]-1)/i.elements[10]),n.near=s,n.far=r,t.logarithmicDepthBuffer?(n.logDepthCameraNear=s,n.logDepthBufFC=2/(Math.log(r-s+1)*Math.LOG2E)):(n.logDepthCameraNear=0,n.logDepthBufFC=0),n.position.setFromMatrixPosition(e.worldMatrix),t.useAnchorMatrix&&n.position.applyMatrix4(t.anchorMatrixInverse),n.viewMatrix.copy(e.viewMatrix),t.useAnchorMatrix&&n.viewMatrix.multiply(t.anchorMatrix),n.projectionMatrix.copy(i),n.projectionViewMatrix.copy(i).multiply(n.viewMatrix),n.rect.copy(e.rect),n.version++,this.gammaFactor=e.gammaFactor,this.outputEncoding=e.outputEncoding}}class Ln extends ye{constructor(){super(),this.fog=null,this.environment=null,this.envDiffuseIntensity=1,this.envSpecularIntensity=1,this.clippingPlanes=[],this.disableShadowSampler=!1,this.logarithmicDepthBuffer=!1,this.anchorMatrix=new U,this._sceneData=new Gs,this._lightData=new Ls,this._renderQueueMap=new WeakMap,this._renderStatesMap=new WeakMap,this._skeletonVersion=0}updateRenderStates(e,t=!0){this._renderStatesMap.has(e)||this._renderStatesMap.set(e,new ks(this._sceneData,this._lightData));const n=this._renderStatesMap.get(e);return t&&this._sceneData.update(this),n.updateCamera(e),n}getRenderStates(e){return this._renderStatesMap.get(e)}updateRenderQueue(e,t=!0,n=!0){this._renderQueueMap.has(e)||this._renderQueueMap.set(e,new Fs);const i=this._renderQueueMap.get(e);if(i.begin(),this._pushToRenderQueue(this,e,i),i.end(),t){this._lightData.begin();for(const s of i.lightsArray)this._lightData.push(s);this._lightData.end(this._sceneData)}n&&this._skeletonVersion++;for(const s of i.skeletons)s._version!==this._skeletonVersion&&(s.updateBones(this._sceneData),s._version=this._skeletonVersion);return i}getRenderQueue(e){return this._renderQueueMap.get(e)}_pushToRenderQueue(e,t,n){if(!e.visible)return;e.geometry&&e.material&&e.renderable?e.frustumCulled&&t.frustumCulled?(ni.copy(e.geometry.boundingSphere).applyMatrix4(e.worldMatrix),t.frustum.intersectsSphere(ni)&&n.push(e,t)):n.push(e,t):e.isLight&&n.pushLight(e);const i=e.children;for(let s=0,r=i.length;s<r;s++)this._pushToRenderQueue(i[s],t,n)}}Ln.prototype.isScene=!0;const ni=new mt;class bn extends ye{constructor(){super(),this.viewMatrix=new U,this.projectionMatrix=new U,this.projectionMatrixInverse=new U,this.projectionViewMatrix=new U,this.frustum=new ws,this.gammaFactor=2,this.outputEncoding=Oe.LINEAR,this.rect=new ae(0,0,1,1),this.frustumCulled=!0}lookAt(e,t){ii.lookAtRH(this.position,e,t),this.quaternion.setFromRotationMatrix(ii)}setOrtho(e,t,n,i,s,r){this.projectionMatrix.set(2/(t-e),0,0,-(t+e)/(t-e),0,2/(i-n),0,-(i+n)/(i-n),0,0,-2/(r-s),-(r+s)/(r-s),0,0,0,1),this.projectionMatrixInverse.getInverse(this.projectionMatrix)}setPerspective(e,t,n,i){this.projectionMatrix.set(1/(t*Math.tan(e/2)),0,0,0,0,1/Math.tan(e/2),0,0,0,0,-(i+n)/(i-n),-2*i*n/(i-n),0,0,-1,0),this.projectionMatrixInverse.getInverse(this.projectionMatrix)}getWorldDirection(e=new S){return super.getWorldDirection(e).negate()}updateMatrix(e){ye.prototype.updateMatrix.call(this,e),this.viewMatrix.getInverse(this.worldMatrix),this.projectionViewMatrix.multiplyMatrices(this.projectionMatrix,this.viewMatrix),this.frustum.setFromMatrix(this.projectionViewMatrix)}copy(e,t){return ye.prototype.copy.call(this,e,t),this.viewMatrix.copy(e.viewMatrix),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.frustum.copy(e.frustum),this.gammaFactor=e.gammaFactor,this.outputEncoding=e.outputEncoding,this.rect.copy(e.rect),this.frustumCulled=e.frustumCulled,this}}bn.prototype.isCamera=!0;const ii=new U,_n=new mt,si=new U,yt=new ys,Ct=new S,Rt=new S,Pt=new S,Lt=new S,ri=new S,pn=new S,ai=new B,oi=new B,ci=new B,li=new S,bt=new S;class Nn extends ye{constructor(e,t){super(),this.geometry=e,this.material=t,this.morphTargetInfluences=null}getVertexPosition(e,t){const n=this.geometry,i=n.getAttribute("a_Position"),s=n.morphAttributes.position;t.fromArray(i.buffer.array,e*i.buffer.stride+i.offset);const r=this.morphTargetInfluences;if(s&&r){pn.set(0,0,0);for(let o=0,c=s.length;o<c;o++){const l=r[o],h=s[o];l!==0&&(ri.fromArray(h.buffer.array,e*h.buffer.stride+h.offset),pn.addScaledVector(ri,l))}t.add(pn)}return t}raycast(e,t){const n=this.geometry,i=this.worldMatrix;if(_n.copy(n.boundingSphere),_n.applyMatrix4(i),!e.intersectsSphere(_n)||(si.getInverse(i),yt.copy(e).applyMatrix4(si),!yt.intersectsBox(n.boundingBox)))return;const s=n.getAttribute("a_Position");if(!s)return;const r=n.getAttribute("a_Uv");let o;if(n.index){const c=n.index.buffer.array;for(let l=0;l<c.length;l+=3){const h=c[l],d=c[l+1],f=c[l+2];o=hi(this,e,yt,r,h,d,f),o&&(o.faceIndex=Math.floor(l/3),t.push(o))}}else for(let c=0;c<s.buffer.count;c+=3){const l=c,h=c+1,d=c+2;o=hi(this,e,yt,r,l,h,d),o&&(o.faceIndex=Math.floor(c/3),t.push(o))}}copy(e){return super.copy(e),e.morphTargetInfluences&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),this}clone(){return new this.constructor(this.geometry,this.material).copy(this)}}Nn.prototype.isMesh=!0;function hi(a,e,t,n,i,s,r){a.getVertexPosition(i,Rt),a.getVertexPosition(s,Pt),a.getVertexPosition(r,Lt);const o=Xs(a,e,t,Rt,Pt,Lt,li);if(o){let c,l,h;n&&(c=n.buffer.array,l=n.buffer.stride,h=n.offset,ai.fromArray(c,i*l+h),oi.fromArray(c,s*l+h),ci.fromArray(c,r*l+h),o.uv=Ws(li,Rt,Pt,Lt,ai,oi,ci));const d={a:i,b:s,c:r,normal:new S};ki.normal(Rt,Pt,Lt,d.normal),o.face=d}return o}function Ws(a,e,t,n,i,s,r){return ki.barycoordFromPoint(a,e,t,n,Ct),i.multiplyScalar(Ct.x),s.multiplyScalar(Ct.y),r.multiplyScalar(Ct.z),i.add(s).add(r),i.clone()}function Xs(a,e,t,n,i,s,r){let o;const c=a.material;return c.side===ze.BACK?o=t.intersectTriangle(s,i,n,!0,r):o=t.intersectTriangle(n,i,s,c.side!==ze.DOUBLE,r),o===null?null:(bt.copy(r),bt.applyMatrix4(a.worldMatrix),{distance:e.origin.distanceTo(bt),point:bt.clone(),object:a})}class Ue{constructor(e,t=e.stride,n=0,i=!1){this.buffer=e,this.size=t,this.offset=n,this.normalized=i,this.divisor=0}copy(e){return this.buffer=e.buffer,this.size=e.size,this.offset=e.offset,this.normalized=e.normalized,this.divisor=e.divisor,this}clone(e){let t;return e?(e.has(this.buffer)||e.set(this.buffer,this.buffer.clone()),t=new Ue(e.get(this.buffer),this.size,this.offset,this.normalized),t.divisor=this.divisor,t):(console.warn("t3d.Attribute.clone(): now requires a WeakMap as an argument to save shared buffers."),t=new Ue(this.buffer.clone(),this.size,this.offset,this.normalized),t.divisor=this.divisor,t)}}class Je{constructor(e,t){this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Hi.STATIC_DRAW,this.updateRange={offset:0,count:-1},this.version=0}onUploadCallback(){}copy(e){return this.array=new e.array.constructor(e.array),this.stride=e.stride,this.count=e.array.length/this.stride,this.usage=e.usage,this}clone(){const e=new this.array.constructor(this.array),t=new Je(e,this.stride);return t.usage=this.usage,t}}let qs=0;const re=new S,Nt=new S,di=new S,fe=new it,mn=new it;class Dn extends pt{constructor(){super(),this.id=qs++,this.uuid=y.generateUUID(),this.attributes={},this.morphAttributes={},this.index=null,this.boundingBox=new it,this.boundingSphere=new mt,this.groups=[],this.instanceCount=-1,this.version=0}addAttribute(e,t){this.attributes[e]=t}getAttribute(e){return this.attributes[e]}removeAttribute(e){delete this.attributes[e]}setIndex(e){if(Array.isArray(e)){const t=new(Ys(e)>65535?Uint32Array:Uint16Array)(e);this.index=new Ue(new Je(t,1))}else this.index=e}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}computeBoundingBox(){const e=this.attributes.a_Position||this.attributes.position;e&&this.boundingBox.setFromArray(e.buffer.array,e.buffer.stride,e.offset);const t=this.morphAttributes.position;if(t)for(let n=0;n<t.length;n++){const i=t[n];fe.setFromArray(i.buffer.array,i.buffer.stride,i.offset),re.addVectors(this.boundingBox.min,fe.min),this.boundingBox.expandByPoint(re),re.addVectors(this.boundingBox.max,fe.max),this.boundingBox.expandByPoint(re)}}computeBoundingSphere(){const e=this.attributes.a_Position||this.attributes.position,t=this.morphAttributes.position;if(!e)return;const n=e.buffer.stride,i=e.offset;if(t){fe.setFromArray(e.buffer.array,n,i);for(let o=0;o<t.length;o++){const c=t[o];mn.setFromArray(c.buffer.array,c.buffer.stride,c.offset),re.addVectors(fe.min,mn.min),fe.expandByPoint(re),re.addVectors(fe.max,mn.max),fe.expandByPoint(re)}const s=this.boundingSphere.center;fe.getCenter(s);let r=0;for(let o=0;o<e.buffer.count;o++){Nt.fromArray(e.buffer.array,o*n+i),r=s.distanceToSquared(Nt);for(let c=0;c<t.length;c++){const l=t[c];re.fromArray(l.buffer.array,o*l.buffer.stride+l.offset),di.addVectors(Nt,re);const h=s.distanceToSquared(di);h>r&&(r=h,Nt.add(re))}}this.boundingSphere.radius=Math.sqrt(r)}else this.boundingSphere.setFromArray(e.buffer.array,n,i)}dispose(){this.dispatchEvent({type:"dispose"})}copy(e){let t,n,i;this.index=null,this.attributes={},this.morphAttributes={},this.groups=[];const s=new WeakMap,r=e.index;r!==null&&this.setIndex(r.clone(s));const o=e.attributes;for(t in o){const h=o[t];this.addAttribute(t,h.clone(s))}const c=e.morphAttributes;for(t in c){const h=[],d=c[t];for(n=0,i=d.length;n<i;n++)h.push(d[n].clone(s));this.morphAttributes[t]=h}const l=e.groups;for(n=0,i=l.length;n<i;n++){const h=l[n];this.addGroup(h.start,h.count,h.materialIndex)}return this.boundingBox.copy(e.boundingBox),this.boundingSphere.copy(e.boundingSphere),this.instanceCount=e.instanceCount,this}clone(){return new Dn().copy(this)}}function Ys(a){if(a.length===0)return-1/0;let e=a[0];for(let t=1,n=a.length;t<n;++t)a[t]>e&&(e=a[t]);return e}class ft extends He{constructor(){super(),this.offset=new B(0,0),this.scale=new B(1,1),this.center=new B(0,0),this.rotation=0,this.needsUpdate=!1}update(){return this.needsUpdate?(this.needsUpdate=!1,this.updateMatrix(),this):this}updateMatrix(){return this.setUvTransform(this.offset.x,this.offset.y,this.scale.x,this.scale.y,this.rotation,this.center.x,this.center.y)}copy(e){return super.copy(e),e.isTransformUV?(this.offset.copy(e.offset),this.scale.copy(e.scale),this.center.copy(e.center),this.rotation=e.rotation,this.needsUpdate=e.needsUpdate,this):this}clone(){return new this.constructor().copy(this)}}ft.prototype.isTransformUV=!0;let Qs=0;class Zs extends pt{constructor(){super(),this.id=Qs++,this.uuid=y.generateUUID(),this.type=wn.SHADER,this.shaderName="",this.defines={},this.uniforms={},this.vertexShader="",this.fragmentShader="",this.precision=null,this.extUvCoordMask=0,this.transparent=!1,this.blending=pe.NORMAL,this.blendSrc=K.SRC_ALPHA,this.blendDst=K.ONE_MINUS_SRC_ALPHA,this.blendEquation=ce.ADD,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.premultipliedAlpha=!1,this.vertexColors=ut.NONE,this.vertexTangents=!1,this.opacity=1,this.diffuse=new tt(16777215),this.diffuseMap=null,this.diffuseMapCoord=0,this.diffuseMapTransform=new ft,this.alphaMap=null,this.alphaMapCoord=0,this.alphaMapTransform=new ft,this.emissive=new tt(0),this.emissiveMap=null,this.emissiveMapCoord=0,this.emissiveMapTransform=new ft,this.aoMap=null,this.aoMapIntensity=1,this.aoMapCoord=0,this.aoMapTransform=new ft,this.normalMap=null,this.normalScale=new B(1,1),this.bumpMap=null,this.bumpScale=1,this.envMap=null,this.envMapIntensity=1,this.envMapCombine=gs.MULTIPLY,this.depthFunc=et.LEQUAL,this.depthTest=!0,this.depthWrite=!0,this.colorWrite=!0,this.stencilTest=!1,this.stencilWriteMask=255,this.stencilFunc=et.ALWAYS,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Kt.KEEP,this.stencilZFail=Kt.KEEP,this.stencilZPass=Kt.KEEP,this.stencilFuncBack=null,this.stencilRefBack=null,this.stencilFuncMaskBack=null,this.stencilFailBack=null,this.stencilZFailBack=null,this.stencilZPassBack=null,this.clippingPlanes=null,this.alphaTest=0,this.alphaToCoverage=!1,this.side=ze.FRONT,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.shading=Gi.SMOOTH_SHADING,this.dithering=!1,this.acceptLight=!1,this.fog=!0,this.drawMode=vs.TRIANGLES,this.forceUpdateUniforms=!0,this.needsUpdate=!0}copy(e){return this.shaderName=e.shaderName,this.defines=Object.assign({},e.defines),this.uniforms=Wi(e.uniforms),this.vertexShader=e.vertexShader,this.fragmentShader=e.fragmentShader,this.precision=e.precision,this.extUvCoordMask=e.extUvCoordMask,this.transparent=e.transparent,this.blending=e.blending,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.premultipliedAlpha=e.premultipliedAlpha,this.vertexColors=e.vertexColors,this.vertexTangents=e.vertexTangents,this.opacity=e.opacity,this.diffuse.copy(e.diffuse),this.diffuseMap=e.diffuseMap,this.diffuseMapCoord=e.diffuseMapCoord,this.diffuseMapTransform.copy(e.diffuseMapTransform),this.alphaMap=e.alphaMap,this.alphaMapCoord=e.alphaMapCoord,this.alphaMapTransform.copy(e.alphaMapTransform),this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveMapCoord=e.emissiveMapCoord,this.emissiveMapTransform.copy(e.emissiveMapTransform),this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.aoMapCoord=e.aoMapCoord,this.aoMapTransform.copy(e.aoMapTransform),this.normalMap=e.normalMap,this.normalScale.copy(e.normalScale),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.envMap=e.envMap,this.envMapIntensity=e.envMapIntensity,this.envMapCombine=e.envMapCombine,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.colorWrite=e.colorWrite,this.stencilTest=e.stencilTest,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilFuncBack=e.stencilFuncBack,this.stencilRefBack=e.stencilRefBack,this.stencilFuncMaskBack=e.stencilFuncMaskBack,this.stencilFailBack=e.stencilFailBack,this.stencilZFailBack=e.stencilZFailBack,this.stencilZPassBack=e.stencilZPassBack,this.clippingPlanes=e.clippingPlanes,this.alphaTest=e.alphaTest,this.alphaToCoverage=e.alphaToCoverage,this.side=e.side,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.shading=e.shading,this.dithering=e.dithering,this.acceptLight=e.acceptLight,this.fog=e.fog,this.drawMode=e.drawMode,this}clone(){return new this.constructor().copy(this)}dispose(){this.dispatchEvent({type:"dispose"})}}class js extends Zs{constructor(e){super(),e&&(this.shaderName=e.name,Object.assign(this.defines,e.defines),this.uniforms=Wi(e.uniforms),this.vertexShader=e.vertexShader,this.fragmentShader=e.fragmentShader)}}class Re{constructor(e){this._key=e+"$",this._count=0}get(e){const t=this._key;let n=e[t];return n===void 0&&(n={},e[t]=n,this._count++),n}delete(e){const t=this._key;e[t]&&(this._count--,delete e[t])}size(){return this._count}}let ui=0;class Ks{constructor(e){this.id=ui++,this.context=e,this.capabilities={},this.shaderCompileOptions={checkErrors:!0,compileAsynchronously:!1,maxMaterialPrograms:5},this.asyncReadPixel=!1,this._passInfo={enabled:!1,count:0}}beginRender(){this._passInfo.enabled=!0}endRender(){this._passInfo.enabled=!1,this._passInfo.count++}renderRenderableItem(e,t,n){}renderRenderableList(e,t,n={}){for(let i=0,s=e.length;i<s;i++)this.renderRenderableItem(e[i],t,n)}renderScene(e,t,n={}){const i=e.getRenderStates(t),s=e.getRenderQueue(t);this.beginRender();let r;for(let o=0,c=s.layerList.length;o<c;o++)r=s.layerList[o],this.renderRenderableList(r.opaque,i,n),this.renderRenderableList(r.transparent,i,n);this.endRender()}clear(e,t,n){}setClearColor(e,t,n,i,s){}getClearColor(){}setRenderTarget(e){}getRenderTarget(){}blitRenderTarget(e,t,n=!0,i=!0,s=!0){}readRenderTargetPixels(e,t,n,i,s){}updateRenderTargetMipmap(e){}setTextureExternal(e,t){}setRenderBufferExternal(e,t){}setBufferExternal(e,t){}resetVertexArrayBindings(e){}resetState(){}beginQuery(e,t){}endQuery(e){}queryCounter(e){}isTimerQueryDisjoint(e){}isQueryResultAvailable(e){}getQueryResult(e){}increaseId(){return this.id=ui++,this.id}}class st extends pt{constructor(e,t){super(),this.width=e,this.height=t}resize(e,t){return this.width!==e||this.height!==t?(this.width=e,this.height=t,!0):!1}dispose(){this.dispatchEvent({type:"dispose"})}}st.prototype.isRenderTarget=!0;class gt extends pt{constructor(e,t,n=E.RGBA8,i=0){super(),this.width=e,this.height=t,this.format=n,this.multipleSampling=i}resize(e,t){return this.width!==e||this.height!==t?(this.dispose(),this.width=e,this.height=t,!0):!1}clone(){return new this.constructor().copy(this)}copy(e){return this.format=e.format,this.multipleSampling=e.multipleSampling,this}dispose(){this.dispatchEvent({type:"dispose"})}}gt.prototype.isRenderBuffer=!0;let $s=0;class vt extends pt{constructor(){super(),this.id=$s++,this.userData={},this.mipmaps=[],this.border=0,this.format=E.RGBA,this.internalformat=null,this.type=N.UNSIGNED_BYTE,this.magFilter=P.LINEAR,this.minFilter=P.LINEAR_MIPMAP_LINEAR,this.wrapS=J.CLAMP_TO_EDGE,this.wrapT=J.CLAMP_TO_EDGE,this.anisotropy=1,this.compare=void 0,this.generateMipmaps=!0,this.encoding=Oe.LINEAR,this.flipY=!0,this.premultiplyAlpha=!1,this.unpackAlignment=4,this.version=0}clone(){return new this.constructor().copy(this)}copy(e){return this.userData=Pn(e.userData),this.mipmaps=e.mipmaps.slice(0),this.border=e.border,this.format=e.format,this.internalformat=e.internalformat,this.type=e.type,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.anisotropy=e.anisotropy,this.compare=e.compare,this.generateMipmaps=e.generateMipmaps,this.encoding=e.encoding,this.flipY=e.flipY,this.premultiplyAlpha=e.premultiplyAlpha,this.unpackAlignment=e.unpackAlignment,this.version=e.version,this}dispose(){this.dispatchEvent({type:"dispose"}),this.version=0}}vt.prototype.isTexture=!0;class ge extends vt{constructor(){super(),this.image=null}copy(e){return super.copy(e),this.image=e.image,this}}ge.prototype.isTexture2D=!0;class Yt extends st{constructor(e,t){super(e,t),this._attachments={},this.attach(new ge,C.COLOR_ATTACHMENT0),this.attach(new gt(e,t,E.DEPTH_STENCIL),C.DEPTH_STENCIL_ATTACHMENT)}attach(e,t=C.COLOR_ATTACHMENT0){e.isTexture2D?e.image&&e.image.rtt?(e.image.width!==this.width||e.image.height!==this.height)&&(e.version++,e.image.width=this.width,e.image.height=this.height):(e.version++,e.image={rtt:!0,data:null,width:this.width,height:this.height}):e.resize(this.width,this.height),this._attachments[t]=e}detach(e=C.COLOR_ATTACHMENT0){delete this._attachments[e]}resize(e,t){const n=super.resize(e,t);if(n){this.dispose(!1);for(const i in this._attachments){const s=this._attachments[i];s.isTexture2D?(s.image={rtt:!0,data:null,width:this.width,height:this.height},s.version++):s.resize(e,t)}}return n}dispose(e=!0){if(super.dispose(),e)for(const t in this._attachments)this._attachments[t].dispose()}}Yt.prototype.isRenderTarget2D=!0;Object.defineProperties(Yt.prototype,{texture:{set:function(a){a?a.isTexture2D&&this.attach(a,C.COLOR_ATTACHMENT0):this.detach(C.COLOR_ATTACHMENT0)},get:function(){const a=this._attachments[C.COLOR_ATTACHMENT0];return a.isTexture2D?a:null}}});class In extends vt{constructor(){super(),this.image={data:new Uint8Array([255,255,255,255,255,255,255,255]),width:2,height:2,depth:2},this.format=E.RED,this.magFilter=P.NEAREST,this.minFilter=P.NEAREST,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.image=e.image,this}}In.prototype.isTexture2DArray=!0;class Xi extends st{constructor(e,t,n){super(e,t),this.depth=n,this._attachments={},this.attach(new In,C.COLOR_ATTACHMENT0),this.activeLayer=0,this.activeMipmapLevel=0}attach(e,t=C.COLOR_ATTACHMENT0){e.isTexture2DArray?e.image&&e.image.rtt?(e.image.width!==this.width||e.image.height!==this.height||e.image.depth!==this.depth)&&(e.version++,e.image.width=this.width,e.image.height=this.height,e.image.depth=this.depth):(e.version++,e.image={rtt:!0,data:null,width:this.width,height:this.height,depth:this.depth}):e.resize(this.width,this.height),this._attachments[t]=e}detach(e=C.COLOR_ATTACHMENT0){delete this._attachments[e]}resize(e,t,n){let i=!1;if((this.width!==e||this.height!==t||this.depth!==n)&&(this.width=e,this.height=t,this.depth=n,i=!0),i){this.dispose(!1);for(const s in this._attachments){const r=this._attachments[s];r.isTexture2DArray?(r.image={rtt:!0,data:null,width:this.width,height:this.height,depth:this.depth},r.version++):r.resize(e,t)}}return i}}Xi.prototype.isRenderTarget2DArray=!0;Object.defineProperties(Xi.prototype,{texture:{set:function(a){a?a.isTexture2DArray&&this.attach(a,C.COLOR_ATTACHMENT0):this.detach(C.COLOR_ATTACHMENT0)},get:function(){const a=this._attachments[C.COLOR_ATTACHMENT0];return a.isTexture2DArray?a:null}}});class On extends vt{constructor(){super(),this.image={data:new Uint8Array([255,255,255,255,255,255,255,255]),width:2,height:2,depth:2},this.wrapR=J.CLAMP_TO_EDGE,this.format=E.RED,this.type=N.UNSIGNED_BYTE,this.magFilter=P.NEAREST,this.minFilter=P.NEAREST,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.image=e.image,this}}On.prototype.isTexture3D=!0;class qi extends st{constructor(e,t,n){super(e,t),this.depth=n,this._attachments={},this.attach(new On,C.COLOR_ATTACHMENT0),this.activeLayer=0,this.activeMipmapLevel=0}attach(e,t=C.COLOR_ATTACHMENT0){e.isTexture3D?e.image&&e.image.rtt?(e.image.width!==this.width||e.image.height!==this.height||e.image.depth!==this.depth)&&(e.version++,e.image.width=this.width,e.image.height=this.height,e.image.depth=this.depth):(e.version++,e.image={rtt:!0,data:null,width:this.width,height:this.height,depth:this.depth}):e.resize(this.width,this.height),this._attachments[t]=e}detach(e=C.COLOR_ATTACHMENT0){delete this._attachments[e]}resize(e,t,n){let i=!1;if((this.width!==e||this.height!==t||this.depth!==n)&&(this.width=e,this.height=t,this.depth=n,i=!0),i){this.dispose(!1);for(const s in this._attachments){const r=this._attachments[s];r.isTexture3D?(r.image={rtt:!0,data:null,width:this.width,height:this.height,depth:this.depth},r.version++):r.resize(e,t)}}return i}dispose(e=!0){if(super.dispose(),e)for(const t in this._attachments)this._attachments[t].dispose()}}qi.prototype.isRenderTarget3D=!0;Object.defineProperties(qi.prototype,{texture:{set:function(a){a?a.isTexture3D&&this.attach(a,C.COLOR_ATTACHMENT0):this.detach(C.COLOR_ATTACHMENT0)},get:function(){const a=this._attachments[C.COLOR_ATTACHMENT0];return a.isTexture3D?a:null}}});class Yi extends st{constructor(e){super(e.width,e.height),this.view=e}resize(e,t){this.view.width=e,this.view.height=t,this.width=e,this.height=t}dispose(){}}Yi.prototype.isRenderTargetBack=!0;class Un extends vt{constructor(){super(),this.images=[],this.flipY=!1}copy(e){return super.copy(e),this.images=e.images.slice(0),this}}Un.prototype.isTextureCube=!0;class Fn extends st{constructor(e,t){super(e,t),this._attachments={},this.attach(new Un,C.COLOR_ATTACHMENT0),this.attach(new gt(e,t,E.DEPTH_STENCIL),C.DEPTH_STENCIL_ATTACHMENT),this.activeCubeFace=0,this.activeMipmapLevel=0}attach(e,t=C.COLOR_ATTACHMENT0){if(e.isTextureCube){let n=!1;for(let i=0;i<6;i++)e.images[i]&&e.images[i].rtt?(e.images[i].width!==this.width||e.images[i].height!==this.height)&&(e.images[i].width=this.width,e.images[i].height=this.height,n=!0):(e.images[i]={rtt:!0,data:null,width:this.width,height:this.height},n=!0);n&&e.version++}else e.resize(this.width,this.height);this._attachments[t]=e}detach(e=C.COLOR_ATTACHMENT0){delete this._attachments[e]}resize(e,t){if(super.resize(e,t)){this.dispose(!1);for(const i in this._attachments){const s=this._attachments[i];if(s.isTextureCube){for(let r=0;r<6;r++)s.images[r]={rtt:!0,data:null,width:this.width,height:this.height};s.version++}else s.resize(e,t)}}}dispose(e=!0){if(super.dispose(),e)for(const t in this._attachments)this._attachments[t].dispose()}}Fn.prototype.isRenderTargetCube=!0;Object.defineProperties(Fn.prototype,{texture:{set:function(a){a?a.isTextureCube&&this.attach(a,C.COLOR_ATTACHMENT0):this.detach(C.COLOR_ATTACHMENT0)},get:function(){const a=this._attachments[C.COLOR_ATTACHMENT0];return a.isTextureCube?a:null}}});class Js extends Ce{constructor(e,t){super(e,t)}}Js.prototype.isAmbientLight=!0;class Bn{constructor(){this.camera=new bn,this.matrix=new U,this.bias=0,this.normalBias=0,this.radius=1,this.cameraNear=1,this.cameraFar=500,this.mapSize=new B(512,512),this.autoUpdate=!0,this.needsUpdate=!1,this.renderTarget=null,this.map=null,this.depthMap=null}update(e,t){}updateMatrix(){const e=this.matrix,t=this.camera;e.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),e.multiply(t.projectionMatrix),e.multiply(t.viewMatrix)}copy(e){return this.camera.copy(e.camera),this.matrix.copy(e.matrix),this.bias=e.bias,this.normalBias=e.normalBias,this.radius=e.radius,this.cameraNear=e.cameraNear,this.cameraFar=e.cameraFar,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}prepareDepthMap(e,t){}}class er extends Bn{constructor(){super(),this.windowSize=500,this.frustumEdgeFalloff=0,this.renderTarget=new Yt(this.mapSize.x,this.mapSize.y);const e=this.renderTarget.texture;e.generateMipmaps=!1,e.minFilter=P.NEAREST,e.magFilter=P.NEAREST;const t=new ge;t.type=N.UNSIGNED_INT,t.format=E.DEPTH_COMPONENT,t.magFilter=P.LINEAR,t.minFilter=P.LINEAR,t.compare=et.LESS,t.generateMipmaps=!1;const n=new gt(this.mapSize.x,this.mapSize.y,E.DEPTH_COMPONENT16);this.renderTarget.detach(C.DEPTH_STENCIL_ATTACHMENT),this.renderTarget.attach(n,C.DEPTH_ATTACHMENT),this.map=e,this.depthMap=t,this._depthBuffer=n}update(e){this._updateCamera(e),(this.mapSize.x!==this.renderTarget.width||this.mapSize.y!==this.renderTarget.height)&&this.renderTarget.resize(this.mapSize.x,this.mapSize.y)}_updateCamera(e){const t=this.camera;t.matrix.copy(e.worldMatrix),t.matrix.decompose(t.position,t.quaternion,t.scale),t.updateMatrix();const n=this.windowSize/2;t.setOrtho(-n,n,-n,n,this.cameraNear,this.cameraFar)}copy(e){return super.copy(e),this.windowSize=e.windowSize,this.frustumEdgeFalloff=e.frustumEdgeFalloff,this}prepareDepthMap(e,t){const n=e&&t.version>=2,i=this.renderTarget,r=i._attachments[C.DEPTH_ATTACHMENT]===this.depthMap;n!==r&&(n?(t.getExtension("OES_texture_float_linear")&&(this.depthMap.type=N.FLOAT),i.dispose(),i.attach(this.depthMap,C.DEPTH_ATTACHMENT)):(i.dispose(),i.attach(this._depthBuffer,C.DEPTH_ATTACHMENT)))}}class tr extends Ce{constructor(e,t){super(e,t),this.shadow=new er}copy(e){return super.copy(e),this.shadow.copy(e.shadow),this}}tr.prototype.isDirectionalLight=!0;class nr extends Ce{constructor(e,t,n){super(e,n),this.groundColor=new tt(t!==void 0?t:16777215)}copy(e){super.copy(e),this.groundColor.copy(e.groundColor)}}nr.prototype.isHemisphereLight=!0;class ir extends Bn{constructor(){super(),this.renderTarget=new Fn(this.mapSize.x,this.mapSize.y);const e=this.renderTarget.texture;e.generateMipmaps=!1,e.minFilter=P.NEAREST,e.magFilter=P.NEAREST,this.map=e,this._targets=[new S(1,0,0),new S(-1,0,0),new S(0,1,0),new S(0,-1,0),new S(0,0,1),new S(0,0,-1)],this._ups=[new S(0,-1,0),new S(0,-1,0),new S(0,0,1),new S(0,0,-1),new S(0,-1,0),new S(0,-1,0)],this._lookTarget=new S}update(e,t){this._updateCamera(e,t),(this.mapSize.x!==this.renderTarget.width||this.mapSize.y!==this.renderTarget.height)&&this.renderTarget.resize(this.mapSize.x,this.mapSize.y)}_updateCamera(e,t){const n=this.camera,i=this._lookTarget,s=this._targets,r=this._ups;n.position.setFromMatrixPosition(e.worldMatrix),i.set(s[t].x+n.position.x,s[t].y+n.position.y,s[t].z+n.position.z),n.lookAt(i,r[t]),n.updateMatrix(),n.setPerspective(90/180*Math.PI,1,this.cameraNear,this.cameraFar)}}class sr extends Ce{constructor(e,t,n,i){super(e,t),this.decay=i!==void 0?i:1,this.distance=n!==void 0?n:200,this.shadow=new ir}copy(e){return super.copy(e),this.shadow.copy(e.shadow),this}}sr.prototype.isPointLight=!0;class rr extends Ce{constructor(e=new Cs,t=1){super(void 0,t),this.sh=e}copy(e){return super.copy(e),this.sh.copy(e.sh),this}}rr.prototype.isSphericalHarmonicsLight=!0;class ar extends Bn{constructor(){super(),this.frustumEdgeFalloff=0,this.renderTarget=new Yt(this.mapSize.x,this.mapSize.y);const e=this.renderTarget.texture;e.generateMipmaps=!1,e.minFilter=P.NEAREST,e.magFilter=P.NEAREST;const t=new ge;t.type=N.UNSIGNED_INT,t.format=E.DEPTH_COMPONENT,t.magFilter=P.LINEAR,t.minFilter=P.LINEAR,t.compare=et.LESS,t.generateMipmaps=!1;const n=new gt(this.mapSize.x,this.mapSize.y,E.DEPTH_COMPONENT16);this.renderTarget.detach(C.DEPTH_STENCIL_ATTACHMENT),this.renderTarget.attach(n,C.DEPTH_ATTACHMENT),this.map=e,this.depthMap=t,this._depthBuffer=n}update(e){this._updateCamera(e),(this.mapSize.x!==this.renderTarget.width||this.mapSize.y!==this.renderTarget.height)&&this.renderTarget.resize(this.mapSize.x,this.mapSize.y)}_updateCamera(e){const t=this.camera;t.matrix.copy(e.worldMatrix),t.matrix.decompose(t.position,t.quaternion,t.scale),t.updateMatrix(),t.setPerspective(e.angle*2,1,this.cameraNear,this.cameraFar)}copy(e){return super.copy(e),this.frustumEdgeFalloff=e.frustumEdgeFalloff,this}prepareDepthMap(e,t){const n=e&&t.version>=2,i=this.renderTarget,r=i._attachments[C.DEPTH_ATTACHMENT]===this.depthMap;n!==r&&(n?(t.getExtension("OES_texture_float_linear")&&(this.depthMap.type=N.FLOAT),i.dispose(),i.attach(this.depthMap,C.DEPTH_ATTACHMENT)):(i.dispose(),i.attach(this._depthBuffer,C.DEPTH_ATTACHMENT)))}}class or extends Ce{constructor(e,t,n,i,s,r){super(e,t),this.decay=r!==void 0?r:1,this.distance=n!==void 0?n:200,this.penumbra=s!==void 0?s:0,this.angle=i!==void 0?i:Math.PI/6,this.shadow=new ar}copy(e){return super.copy(e),this.shadow.copy(e.shadow),this}}or.prototype.isSpotLight=!0;class cr extends ye{constructor(){super()}}cr.prototype.isBone=!0;class lr extends Nn{constructor(e,t){super(e,t),this.skeleton=void 0,this.bindMode="attached",this.bindMatrix=new U,this.bindMatrixInverse=new U}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrix(),t=this.worldMatrix),this.bindMatrix.copy(t),this.bindMatrixInverse.getInverse(t)}updateMatrix(e){super.updateMatrix(e),this.bindMode==="attached"?this.bindMatrixInverse.getInverse(this.worldMatrix):this.bindMode==="detached"?this.bindMatrixInverse.getInverse(this.bindMatrix):console.warn("t3d.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}copy(e){return super.copy(e),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,this}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}applyBoneTransform(e,t){const n=this.skeleton,i=this.geometry,s=i.attributes.skinIndex,r=i.attributes.skinWeight;_i.fromArray(s.buffer.array,e*s.size),pi.fromArray(r.buffer.array,e*r.size),fi.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let o=0;o<4;o++){const c=gi(pi,o);if(c<Number.EPSILON)continue;const l=gi(_i,o);n.bones[l]&&(mi.multiplyMatrices(n.bones[l].worldMatrix,n.boneInverses[l]),t.addScaledVector(hr.copy(fi).applyMatrix4(mi),c))}return t.applyMatrix4(this.bindMatrixInverse)}}lr.prototype.isSkinnedMesh=!0;const fi=new S,_i=new ae,pi=new ae,hr=new S,mi=new U;function gi(a,e){switch(e){case 0:return a.x;case 1:return a.y;case 2:return a.z;case 3:return a.w;default:throw new Error("index is out of range: "+e)}}var dr=`#ifdef ALPHATEST
	if (outColor.a < u_AlphaTest) discard;
	outColor.a = u_Opacity;
#endif`,ur=`#ifdef ALPHATEST
	uniform float u_AlphaTest;
#endif`,fr=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
	varying vec2 vAOMapUV;
#endif`,_r=`#ifdef USE_AOMAP
	uniform mat3 aoMapUVTransform;
	varying vec2 vAOMapUV;
#endif`,pr=`#ifdef USE_AOMAP
	vAOMapUV = (aoMapUVTransform * vec3(AOMAP_UV, 1.)).xy;
#endif`,mr=`
#ifdef USE_AOMAP
    float ambientOcclusion = (texture2D(aoMap, vAOMapUV).r - 1.0) * aoMapIntensity + 1.0;
    
    reflectedLight.indirectDiffuse *= ambientOcclusion;
    #if defined(USE_ENV_MAP) && defined(USE_PBR)
        float dotNV = saturate(dot(N, V));
        reflectedLight.indirectSpecular *= computeSpecularOcclusion(dotNV, ambientOcclusion, roughness);
    #endif
#endif`,gr="vec4 outColor = vec4(u_Color, u_Opacity);",vr=`vec3 transformed = vec3(a_Position);
vec3 objectNormal = vec3(a_Normal);
#ifdef USE_TANGENT
    vec3 objectTangent = vec3(a_Tangent.xyz);
#endif`,Tr=`
vec3 BRDF_Diffuse_Lambert(vec3 diffuseColor) {
    return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick(const in vec3 specularColor, const in float dotLH) {
	float fresnel = exp2((-5.55473 * dotLH - 6.98316) * dotLH);
	return (1.0 - specularColor) * fresnel + specularColor;
}
float D_BlinnPhong(const in float shininess, const in float dotNH) {
	return RECIPROCAL_PI * (shininess * 0.5 + 1.0) * pow(dotNH, shininess);
}
float G_BlinnPhong_Implicit() {
	return 0.25;
}
vec3 BRDF_Specular_BlinnPhong(vec3 specularColor, vec3 N, vec3 L, vec3 V, float shininess) {
    vec3 H = normalize(L + V);
    float dotNH = saturate(dot(N, H));
    float dotLH = saturate(dot(L, H));
    vec3 F = F_Schlick(specularColor, dotLH);
    float G = G_BlinnPhong_Implicit();
    float D = D_BlinnPhong(shininess, dotNH);
    return F * G * D;
}
float D_GGX(const in float alpha, const in float dotNH) {
	float a2 = pow2(alpha);
	float denom = pow2(dotNH) * (a2 - 1.0) + 1.0;	return RECIPROCAL_PI * a2 / pow2(denom);
}
float G_GGX_SmithCorrelated(const in float alpha, const in float dotNL, const in float dotNV) {
	float a2 = pow2(alpha);
	float gv = dotNL * sqrt(a2 + (1.0 - a2) * pow2(dotNV));
	float gl = dotNV * sqrt(a2 + (1.0 - a2) * pow2(dotNL));
	return 0.5 / max(gv + gl, EPSILON);
}
vec3 BRDF_Specular_GGX(vec3 specularColor, vec3 N, vec3 L, vec3 V, float roughness) {
	float alpha = pow2(roughness);
	vec3 H = normalize(L + V);
	float dotNL = saturate(dot(N, L));
	float dotNV = saturate(dot(N, V));
	float dotNH = saturate(dot(N, H));
	float dotLH = saturate(dot(L, H));
	vec3 F = F_Schlick(specularColor, dotLH);
	float G = G_GGX_SmithCorrelated(alpha, dotNL, dotNV);
	float D = D_GGX(alpha, dotNH);
	return F * G * D;
}
vec2 integrateSpecularBRDF(const in float dotNV, const in float roughness) {
	const vec4 c0 = vec4(-1, -0.0275, -0.572, 0.022);
	const vec4 c1 = vec4(1, 0.0425, 1.04, -0.04);
	vec4 r = roughness * c0 + c1;
	float a004 = min(r.x * r.x, exp2(-9.28 * dotNV)) * r.x + r.y;
	return vec2(-1.04, 1.04) * a004 + r.zw;
}
vec3 F_Schlick_RoughnessDependent(const in vec3 F0, const in float dotNV, const in float roughness) {
	float fresnel = exp2((-5.55473 * dotNV - 6.98316) * dotNV);
	vec3 Fr = max(vec3(1.0 - roughness), F0) - F0;
	return Fr * fresnel + F0;
}
vec3 BRDF_Specular_GGX_Environment(const in vec3 N, const in vec3 V, const in vec3 specularColor, const in float roughness) {
	float dotNV = saturate(dot(N, V));
	vec2 brdf = integrateSpecularBRDF(dotNV, roughness);
	return specularColor * brdf.x + brdf.y;
}
void BRDF_Specular_Multiscattering_Environment(const in vec3 N, const in vec3 V, const in vec3 specularColor, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter) {
	float dotNV = saturate(dot(N, V));
	vec3 F = F_Schlick_RoughnessDependent(specularColor, dotNV, roughness);
	vec2 brdf = integrateSpecularBRDF(dotNV, roughness);
	vec3 FssEss = F * brdf.x + brdf.y;
	float Ess = brdf.x + brdf.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = specularColor + (1.0 - specularColor) * 0.047619;	vec3 Fms = FssEss * Favg / (1.0 - Ems * Favg);
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}`,Sr=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd(vec2 uv) {
		vec2 dSTdx = dFdx( uv );
		vec2 dSTdy = dFdy( uv );
		float Hll = bumpScale * texture2D( bumpMap, uv ).x;
		float dBx = bumpScale * texture2D( bumpMap, uv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, uv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy) {
		vec3 vSigmaX = vec3( dFdx( surf_pos.x ), dFdx( surf_pos.y ), dFdx( surf_pos.z ) );
		vec3 vSigmaY = vec3( dFdy( surf_pos.x ), dFdy( surf_pos.y ), dFdy( surf_pos.z ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 );
		fDet *= ( float( gl_FrontFacing ) * 2.0 - 1.0 );
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Er=`
#if NUM_CLIPPING_PLANES > 0
    vec4 plane;
    #pragma unroll_loop_start
    for (int i = 0; i < NUM_CLIPPING_PLANES; i++) {
        plane = clippingPlanes[i];
        if ( dot( -v_modelPos, plane.xyz ) > plane.w ) discard;
    }
    #pragma unroll_loop_end
#endif`,xr=`#if NUM_CLIPPING_PLANES > 0
    uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Mr=`#ifdef USE_VCOLOR_RGB
    outColor.rgb *= v_Color;
#endif
#ifdef USE_VCOLOR_RGBA
    outColor *= v_Color;
#endif`,Ar=`#ifdef USE_VCOLOR_RGB
    varying vec3 v_Color;
#endif
#ifdef USE_VCOLOR_RGBA
    varying vec4 v_Color;
#endif`,wr=`#ifdef USE_VCOLOR_RGB
    attribute vec3 a_Color;
    varying vec3 v_Color;
#endif
#ifdef USE_VCOLOR_RGBA
    attribute vec4 a_Color;
    varying vec4 v_Color;
#endif`,yr=`#if defined(USE_VCOLOR_RGB) || defined(USE_VCOLOR_RGBA)
    v_Color = a_Color;
#endif`,Cr=`uniform mat4 u_View;
uniform float u_Opacity;
uniform vec3 u_Color;
uniform vec3 u_CameraPosition;
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};`,Rr=`attribute vec3 a_Position;
attribute vec3 a_Normal;
#ifdef USE_TANGENT
	attribute vec4 a_Tangent;
#endif
#include <transpose>
#include <inverse>
uniform mat4 u_Projection;
uniform mat4 u_View;
uniform mat4 u_Model;
uniform mat4 u_ProjectionView;
uniform vec3 u_CameraPosition;
#define EPSILON 1e-6
#ifdef USE_MORPHTARGETS
    attribute vec3 morphTarget0;
    attribute vec3 morphTarget1;
    attribute vec3 morphTarget2;
    attribute vec3 morphTarget3;
    #ifdef USE_MORPHNORMALS
    	attribute vec3 morphNormal0;
    	attribute vec3 morphNormal1;
    	attribute vec3 morphNormal2;
    	attribute vec3 morphNormal3;
    #else
    	attribute vec3 morphTarget4;
    	attribute vec3 morphTarget5;
    	attribute vec3 morphTarget6;
    	attribute vec3 morphTarget7;
    #endif
#endif
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}`,Pr=`#ifdef USE_DIFFUSE_MAP
    outColor *= mapTexelToLinear(texture2D(diffuseMap, vDiffuseMapUV));
#endif`,Lr=`#ifdef USE_DIFFUSE_MAP
    uniform sampler2D diffuseMap;
    varying vec2 vDiffuseMapUV;
#endif`,br=`#ifdef USE_DIFFUSE_MAP
    vDiffuseMapUV = (uvTransform * vec3(DIFFUSEMAP_UV, 1.)).xy;
#endif`,Nr=`#ifdef USE_DIFFUSE_MAP
    varying vec2 vDiffuseMapUV;
#endif`,Dr=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = emissiveMapTexelToLinear(texture2D(emissiveMap, vEmissiveMapUV));
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Ir=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
	varying vec2 vEmissiveMapUV;
#endif`,Or=`#ifdef USE_EMISSIVEMAP
	vEmissiveMapUV = (emissiveMapUVTransform * vec3(EMISSIVEMAP_UV, 1.)).xy;
#endif`,Ur=`#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapUVTransform;
	varying vec2 vEmissiveMapUV;
#endif`,Fr="gl_FragColor = linearToOutputTexel(gl_FragColor);",Br=`vec4 LinearToLinear(in vec4 value) {
	return value;
}
vec4 GammaToLinear(in vec4 value, in float gammaFactor) {
	return vec4(pow(value.xyz, vec3(gammaFactor)), value.w);
}
vec4 LinearToGamma(in vec4 value, in float gammaFactor) {
	return vec4(pow(value.xyz, vec3(1.0 / gammaFactor)), value.w);
}
vec4 sRGBToLinear(in vec4 value) {
	return vec4(mix(pow(value.rgb * 0.9478672986 + vec3(0.0521327014), vec3(2.4)), value.rgb * 0.0773993808, vec3(lessThanEqual(value.rgb, vec3(0.04045)))), value.w);
}
vec4 LinearTosRGB(in vec4 value) {
	return vec4(mix(pow(value.rgb, vec3(0.41666)) * 1.055 - vec3(0.055), value.rgb * 12.92, vec3(lessThanEqual(value.rgb, vec3(0.0031308)))), value.w);
}`,zr="gl_FragColor = outColor;",Gr=`#ifdef USE_ENV_MAP
    vec3 envDir;
    #ifdef USE_VERTEX_ENVDIR
        envDir = v_EnvDir;
    #else
        envDir = reflect(normalize(v_modelPos - u_CameraPosition), N);
    #endif
    vec4 envColor = textureCube(envMap, vec3(envMapParams.z * envDir.x, envDir.yz));
    envColor = envMapTexelToLinear( envColor );
    #ifdef ENVMAP_BLENDING_MULTIPLY
		outColor = mix(outColor, envColor * outColor, envMapParams.y);
	#elif defined( ENVMAP_BLENDING_MIX )
		outColor = mix(outColor, envColor, envMapParams.y);
	#elif defined( ENVMAP_BLENDING_ADD )
		outColor += envColor * envMapParams.y;
	#endif
#endif`,Hr=`#ifdef USE_ENV_MAP
    #ifdef USE_VERTEX_ENVDIR
        varying vec3 v_EnvDir;
    #endif
    uniform samplerCube envMap;
    uniform vec3 envMapParams;
    uniform int maxMipLevel;
#endif`,Vr=`#ifdef USE_ENV_MAP
    #ifdef USE_VERTEX_ENVDIR
        varying vec3 v_EnvDir;
    #endif
#endif`,kr=`
#ifdef USE_ENV_MAP
    #ifdef USE_VERTEX_ENVDIR
        vec3 transformedNormal = (transposeMat4(inverseMat4(u_Model)) * vec4(objectNormal, 0.0)).xyz;
        transformedNormal = normalize(transformedNormal);
        v_EnvDir = reflect(normalize(worldPosition.xyz - u_CameraPosition), transformedNormal);
    #endif
#endif`,Wr=`#ifdef USE_FOG
    float depth = gl_FragCoord.z / gl_FragCoord.w;
    #ifdef USE_EXP2_FOG
        float fogFactor = 1.0 - exp(-u_FogDensity * u_FogDensity * depth * depth);
    #else
        float fogFactor = smoothstep(u_FogNear, u_FogFar, depth);
    #endif
    gl_FragColor.rgb = mix(gl_FragColor.rgb, u_FogColor, fogFactor);
#endif`,Xr=`#ifdef USE_FOG
    uniform vec3 u_FogColor;
    #ifdef USE_EXP2_FOG
        uniform float u_FogDensity;
    #else
        uniform float u_FogNear;
        uniform float u_FogFar;
    #endif
#endif`,qr=`mat4 inverseMat4(mat4 m) {
    float
    a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3],
    a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3],
    a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3],
    a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3],
    b00 = a00 * a11 - a01 * a10,
    b01 = a00 * a12 - a02 * a10,
    b02 = a00 * a13 - a03 * a10,
    b03 = a01 * a12 - a02 * a11,
    b04 = a01 * a13 - a03 * a11,
    b05 = a02 * a13 - a03 * a12,
    b06 = a20 * a31 - a21 * a30,
    b07 = a20 * a32 - a22 * a30,
    b08 = a20 * a33 - a23 * a30,
    b09 = a21 * a32 - a22 * a31,
    b10 = a21 * a33 - a23 * a31,
    b11 = a22 * a33 - a23 * a32,
    det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    return mat4(
        a11 * b11 - a12 * b10 + a13 * b09,
        a02 * b10 - a01 * b11 - a03 * b09,
        a31 * b05 - a32 * b04 + a33 * b03,
        a22 * b04 - a21 * b05 - a23 * b03,
        a12 * b08 - a10 * b11 - a13 * b07,
        a00 * b11 - a02 * b08 + a03 * b07,
        a32 * b02 - a30 * b05 - a33 * b01,
        a20 * b05 - a22 * b02 + a23 * b01,
        a10 * b10 - a11 * b08 + a13 * b06,
        a01 * b08 - a00 * b10 - a03 * b06,
        a30 * b04 - a31 * b02 + a33 * b00,
        a21 * b02 - a20 * b04 - a23 * b00,
        a11 * b07 - a10 * b09 - a12 * b06,
        a00 * b09 - a01 * b07 + a02 * b06,
        a31 * b01 - a30 * b03 - a32 * b00,
        a20 * b03 - a21 * b01 + a22 * b00) / det;
}`,Yr=`
#if (defined(USE_PHONG) || defined(USE_PBR))
    vec3 V = normalize(u_CameraPosition - v_modelPos);
#endif
#ifdef USE_PBR
    #ifdef USE_PBR2
        vec3 diffuseColor = outColor.xyz;
        vec3 specularColor = specularFactor.xyz;
        float roughness = max(1.0 - glossinessFactor, 0.0525);
    #else
        vec3 diffuseColor = outColor.xyz * (1.0 - metalnessFactor);
        vec3 specularColor = mix(vec3(0.04), outColor.xyz, metalnessFactor);
        float roughness = max(roughnessFactor, 0.0525);
    #endif
    vec3 dxy = max(abs(dFdx(geometryNormal)), abs(dFdy(geometryNormal)));
    float geometryRoughness = max(max(dxy.x, dxy.y), dxy.z);
    roughness += geometryRoughness;
    roughness = min(roughness, 1.0);
    #ifdef USE_CLEARCOAT
        float clearcoat = u_Clearcoat;
        float clearcoatRoughness = u_ClearcoatRoughness;
        #ifdef USE_CLEARCOATMAP
		    clearcoat *= texture2D(clearcoatMap, v_Uv).x;
        #endif
        #ifdef USE_CLEARCOAT_ROUGHNESSMAP
		    clearcoatRoughness *= texture2D(clearcoatRoughnessMap, v_Uv).y;
	    #endif
        clearcoat = saturate(clearcoat);
        clearcoatRoughness = max(clearcoatRoughness, 0.0525);
	    clearcoatRoughness += geometryRoughness;
	    clearcoatRoughness = min(clearcoatRoughness, 1.0);
    #endif
#else
    vec3 diffuseColor = outColor.xyz;
    #ifdef USE_PHONG
        vec3 specularColor = u_SpecularColor.xyz;
        float shininess = u_Specular;
    #endif
#endif
vec3 L;
float falloff;
float dotNL;
vec3 irradiance;
float clearcoatDHR;
#ifdef USE_CLEARCOAT
    float ccDotNL;
    vec3 ccIrradiance;
#endif
#if NUM_DIR_LIGHTS > 0
    #pragma unroll_loop_start
    for (int i = 0; i < NUM_DIR_LIGHTS; i++) {
        L = normalize(-u_Directional[i].direction);
        falloff = 1.0;
        #if defined(USE_SHADOW) && (UNROLLED_LOOP_INDEX < NUM_DIR_SHADOWS)
            #ifdef USE_PCSS_SOFT_SHADOW
                falloff *= getShadowWithPCSS(directionalDepthMap[i], directionalShadowMap[i], vDirectionalShadowCoord[i], u_DirectionalShadow[i].shadowMapSize, u_DirectionalShadow[i].shadowBias, u_DirectionalShadow[i].shadowParams);
            #else
                falloff *= getShadow(directionalShadowMap[i], vDirectionalShadowCoord[i], u_DirectionalShadow[i].shadowMapSize, u_DirectionalShadow[i].shadowBias, u_DirectionalShadow[i].shadowParams);
            #endif
        #endif
        dotNL = saturate(dot(N, L));
        irradiance = u_Directional[i].color * falloff * dotNL * PI;
        #ifdef USE_CLEARCOAT        
            ccDotNL = saturate(dot(clearcoatNormal, L));
            ccIrradiance = ccDotNL * u_Directional[i].color * falloff  * PI;
            clearcoatDHR = clearcoat * clearcoatDHRApprox(clearcoatRoughness, ccDotNL);
            reflectedLight.directSpecular += ccIrradiance * clearcoat * BRDF_Specular_GGX(specularColor, clearcoatNormal, L, V, clearcoatRoughness);
        #else
            clearcoatDHR = 0.0;
        #endif
        reflectedLight.directDiffuse += (1.0 - clearcoatDHR) * irradiance * BRDF_Diffuse_Lambert(diffuseColor);
        #ifdef USE_PHONG
            reflectedLight.directSpecular += irradiance * BRDF_Specular_BlinnPhong(specularColor, N, L, V, shininess) * specularStrength;
        #endif
        #ifdef USE_PBR
            reflectedLight.directSpecular += (1.0 - clearcoatDHR) * irradiance * BRDF_Specular_GGX(specularColor, N, L, V, roughness);
        #endif
    }
    #pragma unroll_loop_end
#endif
#if NUM_POINT_LIGHTS > 0
    vec3 worldV;
    #pragma unroll_loop_start
    for (int i = 0; i < NUM_POINT_LIGHTS; i++) {
        worldV = v_modelPos - u_Point[i].position;
        L = -worldV;
        falloff = pow(clamp(1. - length(L) / u_Point[i].distance, 0.0, 1.0), u_Point[i].decay);
        L = normalize(L);
        #if defined(USE_SHADOW) && (UNROLLED_LOOP_INDEX < NUM_POINT_SHADOWS)
            falloff *= getPointShadow(pointShadowMap[i], vPointShadowCoord[i], u_PointShadow[i].shadowMapSize, u_PointShadow[i].shadowBias, u_PointShadow[i].shadowParams, u_PointShadow[i].shadowCameraRange);
        #endif
        dotNL = saturate(dot(N, L));
        irradiance = u_Point[i].color * falloff * dotNL * PI;
        #ifdef USE_CLEARCOAT        
            ccDotNL = saturate(dot(clearcoatNormal, L));
            ccIrradiance = ccDotNL *  u_Point[i].color * falloff  * PI;
            clearcoatDHR = clearcoat * clearcoatDHRApprox(clearcoatRoughness, ccDotNL);
            reflectedLight.directSpecular += ccIrradiance * clearcoat * BRDF_Specular_GGX(specularColor, clearcoatNormal, L, V, clearcoatRoughness);
        #else
            clearcoatDHR = 0.0;
        #endif
        reflectedLight.directDiffuse += (1.0 - clearcoatDHR) * irradiance * BRDF_Diffuse_Lambert(diffuseColor);
        #ifdef USE_PHONG
            reflectedLight.directSpecular += irradiance * BRDF_Specular_BlinnPhong(specularColor, N, L, V, shininess) * specularStrength;
        #endif
        #ifdef USE_PBR
            reflectedLight.directSpecular += (1.0 - clearcoatDHR) * irradiance * BRDF_Specular_GGX(specularColor, N, L, V, roughness);
        #endif
    }
    #pragma unroll_loop_end
#endif
#if NUM_SPOT_LIGHTS > 0
    float lightDistance;
    float angleCos;
    #pragma unroll_loop_start
    for (int i = 0; i < NUM_SPOT_LIGHTS; i++) {
        L = u_Spot[i].position - v_modelPos;
        lightDistance = length(L);
        L = normalize(L);
        angleCos = dot(L, -normalize(u_Spot[i].direction));
        falloff = smoothstep(u_Spot[i].coneCos, u_Spot[i].penumbraCos, angleCos);
        falloff *= pow(clamp(1. - lightDistance / u_Spot[i].distance, 0.0, 1.0), u_Spot[i].decay);
        #if defined(USE_SHADOW) && (UNROLLED_LOOP_INDEX < NUM_SPOT_SHADOWS)
            #ifdef USE_PCSS_SOFT_SHADOW
                falloff *= getShadowWithPCSS(spotDepthMap[i], spotShadowMap[i], vSpotShadowCoord[i], u_SpotShadow[i].shadowMapSize, u_SpotShadow[i].shadowBias, u_SpotShadow[i].shadowParams);
            #else
                falloff *= getShadow(spotShadowMap[i], vSpotShadowCoord[i], u_SpotShadow[i].shadowMapSize, u_SpotShadow[i].shadowBias, u_SpotShadow[i].shadowParams);
            #endif
        #endif
        dotNL = saturate(dot(N, L));
        irradiance = u_Spot[i].color * falloff * dotNL * PI;
        #ifdef USE_CLEARCOAT        
            ccDotNL = saturate(dot(clearcoatNormal, L));
            ccIrradiance = ccDotNL *  u_Spot[i].color * falloff  * PI;
            clearcoatDHR = clearcoat * clearcoatDHRApprox(clearcoatRoughness, ccDotNL);
            reflectedLight.directSpecular += ccIrradiance * clearcoat * BRDF_Specular_GGX(specularColor, clearcoatNormal, L, V, clearcoatRoughness);
        #else
            clearcoatDHR = 0.0;
        #endif
        reflectedLight.directDiffuse += (1.0 - clearcoatDHR) * irradiance * BRDF_Diffuse_Lambert(diffuseColor);
        #ifdef USE_PHONG
            reflectedLight.directSpecular += irradiance * BRDF_Specular_BlinnPhong(specularColor, N, L, V, shininess) * specularStrength;
        #endif
        #ifdef USE_PBR
            reflectedLight.directSpecular += (1.0 - clearcoatDHR) * irradiance * BRDF_Specular_GGX(specularColor, N, L, V, roughness);
        #endif
    }
    #pragma unroll_loop_end
#endif
#if NUM_RECT_AREA_LIGHTS > 0
    vec3 RectAreaLightDirectSpecular;
    vec3 RectAreaLightDirectDiffuse;
    vec3 rectCoords[4];
    #pragma unroll_loop_start
    for (int i = 0; i < NUM_RECT_AREA_LIGHTS; i++) {
        LTC_RectCoords(u_RectArea[i].position, u_RectArea[i].halfWidth, u_RectArea[i].halfHeight, rectCoords);
        reflectedLight.directDiffuse += u_RectArea[i].color * LTC_Diffuse(diffuseColor, N, V, v_modelPos, rectCoords);
        #ifdef USE_PBR
            reflectedLight.directSpecular += u_RectArea[i].color * LTC_Specular(specularColor, N, V, v_modelPos, rectCoords, roughness);
        #endif
    }
    #pragma unroll_loop_end
#endif
vec3 indirectIrradiance = vec3(0., 0., 0.);   
#ifdef USE_AMBIENT_LIGHT
    indirectIrradiance += u_AmbientLightColor * PI;
#endif
#ifdef USE_SPHERICALHARMONICS_LIGHT
    indirectIrradiance += getLightProbeIrradiance(u_SphericalHarmonicsLightData, N);
#endif
#if NUM_HEMI_LIGHTS > 0
    float hemiDiffuseWeight;
    #pragma unroll_loop_start
    for (int i = 0; i < NUM_HEMI_LIGHTS; i++) {
        L = normalize(u_Hemi[i].direction);
        dotNL = dot(N, L);
        hemiDiffuseWeight = 0.5 * dotNL + 0.5;
        indirectIrradiance += mix(u_Hemi[i].groundColor, u_Hemi[i].skyColor, hemiDiffuseWeight) * PI;
    }
    #pragma unroll_loop_end
#endif
reflectedLight.indirectDiffuse += indirectIrradiance * BRDF_Diffuse_Lambert(diffuseColor);
#if defined(USE_ENV_MAP) && defined(USE_PBR)
    vec3 iblIrradiance = vec3(0., 0., 0.);
    vec3 indirectRadiance = vec3(0., 0., 0.);
    vec3 clearcoatRadiance = vec3(0., 0., 0.);
    vec3 envDir;
    #ifdef USE_VERTEX_ENVDIR
        envDir = v_EnvDir;
    #else
        envDir = reflect(normalize(v_modelPos - u_CameraPosition), N);
    #endif
    iblIrradiance += getLightProbeIndirectIrradiance(maxMipLevel, N);
    indirectRadiance += getLightProbeIndirectRadiance(roughness, maxMipLevel, N, envDir);
    #ifdef USE_CLEARCOAT
        vec3 clearcoatDir = reflect(normalize(v_modelPos - u_CameraPosition), clearcoatNormal);
        clearcoatRadiance += getLightProbeIndirectRadiance(clearcoatRoughness, maxMipLevel, clearcoatNormal, clearcoatDir);
    #endif
    #ifdef USE_CLEARCOAT
        float ccDotNV = saturate(dot(clearcoatNormal, V));
        reflectedLight.indirectSpecular += clearcoatRadiance * clearcoat * BRDF_Specular_GGX_Environment(clearcoatNormal, V, specularColor, clearcoatRoughness);
        ccDotNL = ccDotNV;
        clearcoatDHR = clearcoat * clearcoatDHRApprox(clearcoatRoughness, ccDotNL);
    #else
        clearcoatDHR = 0.0;
    #endif
    float clearcoatInv = 1.0 - clearcoatDHR;
    vec3 singleScattering = vec3(0.0);
    vec3 multiScattering = vec3(0.0);
    vec3 cosineWeightedIrradiance = iblIrradiance * RECIPROCAL_PI;
    BRDF_Specular_Multiscattering_Environment(N, V, specularColor, roughness, singleScattering, multiScattering);
    vec3 diffuse = diffuseColor * (1.0 - (singleScattering + multiScattering));
    reflectedLight.indirectSpecular += clearcoatInv * indirectRadiance * singleScattering;
    reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
    reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
#endif`,Qr=`#ifdef USE_AMBIENT_LIGHT
    uniform vec3 u_AmbientLightColor;
#endif
#ifdef USE_SPHERICALHARMONICS_LIGHT
    uniform vec3 u_SphericalHarmonicsLightData[9];
#endif
#ifdef USE_CLEARCOAT
    float clearcoatDHRApprox(const in float roughness, const in float dotNL) {
        return 0.04 + (1.0 - 0.16) * (pow(1.0 - dotNL, 5.0) * pow(1.0 - roughness, 2.0));
    }
#endif
#if NUM_HEMI_LIGHTS > 0
    struct HemisphereLight {
        vec3 direction;
        vec3 skyColor;
		vec3 groundColor;
    };
    uniform HemisphereLight u_Hemi[NUM_HEMI_LIGHTS];
#endif
#if NUM_DIR_LIGHTS > 0
    struct DirectLight {
        vec3 direction;
        vec3 color;
    };
    uniform DirectLight u_Directional[NUM_DIR_LIGHTS];
#endif
#if NUM_POINT_LIGHTS > 0
    struct PointLight {
        vec3 position;
        vec3 color;
        float distance;
        float decay;
    };
    uniform PointLight u_Point[NUM_POINT_LIGHTS];
#endif
#if NUM_SPOT_LIGHTS > 0
    struct SpotLight {
        vec3 position;
        vec3 color;
        float distance;
        float decay;
        float coneCos;
        float penumbraCos;
        vec3 direction;
    };
    uniform SpotLight u_Spot[NUM_SPOT_LIGHTS];
#endif
#if NUM_RECT_AREA_LIGHTS > 0
    struct RectAreaLight {
        vec3 position;
        vec3 color;
		vec3 halfWidth;
		vec3 halfHeight;
    };
    uniform RectAreaLight u_RectArea[NUM_RECT_AREA_LIGHTS];
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
    void LTC_RectCoords(const in vec3 lightPos, const in vec3 halfWidth, const in vec3 halfHeight, inout vec3 rectCoords[4]) {
        rectCoords[0] = lightPos + halfWidth - halfHeight;        rectCoords[1] = lightPos - halfWidth - halfHeight;
        rectCoords[2] = lightPos - halfWidth + halfHeight;
        rectCoords[3] = lightPos + halfWidth + halfHeight;
    }
    vec2 LTC_Uv(const in vec3 N, const in vec3 V, const in float roughness) {
        const float LUT_SIZE = 64.0; 
        const float LUT_SCALE = (LUT_SIZE - 1.0) / LUT_SIZE;
        const float LUT_BIAS = 0.5 / LUT_SIZE;
        float dotNV = saturate(dot(N, V));
        vec2 uv = vec2(roughness, sqrt(1.0 - dotNV));
        uv = uv * LUT_SCALE + LUT_BIAS;
        return uv;
    }
    vec3 LTC_EdgeVectorFormFactor(const in vec3 v1, const in vec3 v2) {
        float x = dot(v1, v2);
        float y = abs(x);
        float a = 0.8543985 + (0.4965155 + 0.0145206 * y) * y;
        float b = 3.4175940 + (4.1616724 + y) * y;
        float v = a / b;
        float theta_sintheta = (x > 0.0) ? v : 0.5 * inversesqrt(max(1.0 - x * x, 1e-7)) - v;
        return cross(v1, v2) * theta_sintheta;
    }
    float LTC_ClippedSphereFormFactor(const in vec3 f) {
        float l = length(f);
        return max((l * l + f.z) / (l + 1.0), 0.0);
    }
    vec3 LTC_Evaluate(const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[4]) {
        vec3 v1 = rectCoords[1] - rectCoords[0];
        vec3 v2 = rectCoords[3] - rectCoords[0];
        vec3 lightNormal = cross(v1, v2);
        if(dot(lightNormal, P - rectCoords[0]) < 0.0) return vec3(0.0);
        vec3 T1, T2;
        T1 = normalize(V - N * dot(V, N));
        T2 = - cross(N, T1);
        mat3 mat = mInv * mat3(
            T1.x, T2.x, N.x,
            T1.y, T2.y, N.y,
            T1.z, T2.z, N.z
        );
        vec3 coords[4];
        coords[0] = mat * (rectCoords[0] - P);
        coords[1] = mat * (rectCoords[1] - P);
        coords[2] = mat * (rectCoords[2] - P);
        coords[3] = mat * (rectCoords[3] - P);
        coords[0] = normalize(coords[0]);
        coords[1] = normalize(coords[1]);
        coords[2] = normalize(coords[2]);
        coords[3] = normalize(coords[3]);
        vec3 vectorFormFactor = vec3(0.0);
        vectorFormFactor += LTC_EdgeVectorFormFactor(coords[0], coords[1]);
        vectorFormFactor += LTC_EdgeVectorFormFactor(coords[1], coords[2]);
        vectorFormFactor += LTC_EdgeVectorFormFactor(coords[2], coords[3]);
        vectorFormFactor += LTC_EdgeVectorFormFactor(coords[3], coords[0]);
        float result = LTC_ClippedSphereFormFactor(vectorFormFactor);
        return vec3(result);
    }
    vec3 LTC_Diffuse(const in vec3 diffuseColor, const in vec3 N, const in vec3 V, const in vec3 P, const in vec3 rectCoords[4]) {
        return diffuseColor * LTC_Evaluate(N, V, P, mat3(1.0), rectCoords);
    }
    vec3 LTC_Specular(const in vec3 specularColor, const in vec3 N, const in vec3 V, const in vec3 P, const in vec3 rectCoords[4], const in float roughness) {
        vec2 ltc_uv = LTC_Uv(N, V, roughness);
        vec4 t1 = texture2D(ltc_1, ltc_uv);
        vec4 t2 = texture2D(ltc_2, ltc_uv);
        mat3 mInv = mat3(
            vec3(t1.x, 0, t1.y),
            vec3(0, 1, 0),
            vec3(t1.z, 0, t1.w)
        );
        vec3 fresnel = (specularColor * t2.x + (vec3(1.0) - specularColor) * t2.y);
        return fresnel * LTC_Evaluate(N, V, P, mInv, rectCoords);
    }
#endif
#if defined(USE_PBR) && defined(USE_ENV_MAP)
    vec3 getLightProbeIndirectIrradiance(const in int maxMIPLevel, const in vec3 N) {
        vec3 coordVec = vec3(envMapParams.z * N.x, N.yz);
    	#ifdef TEXTURE_LOD_EXT
    		vec4 envMapColor = textureCubeLodEXT(envMap, coordVec, float(maxMIPLevel));
    	#else
    		vec4 envMapColor = textureCube(envMap, coordVec, float(maxMIPLevel));
    	#endif
        envMapColor = envMapTexelToLinear(envMapColor);
        return PI * envMapColor.rgb * envMapParams.x;
    }
    float getSpecularMIPLevel(const in float roughness, const in int maxMIPLevel) {
    	float maxMIPLevelScalar = float(maxMIPLevel);
        float sigma = PI * roughness * roughness / (1.0 + roughness);
        float desiredMIPLevel = maxMIPLevelScalar + log2(sigma);
    	return clamp(desiredMIPLevel, 0.0, maxMIPLevelScalar);
    }
    vec3 getLightProbeIndirectRadiance(const in float roughness, const in int maxMIPLevel, const in vec3 normal, const in vec3 envDir) {
        float specularMIPLevel = getSpecularMIPLevel(roughness, maxMIPLevel);
        vec3 coordVec = normalize(mix(envDir, normal, roughness * roughness));
        coordVec.x *= envMapParams.z;
        #ifdef TEXTURE_LOD_EXT
    		vec4 envMapColor = textureCubeLodEXT(envMap, coordVec, specularMIPLevel);
    	#else
    		vec4 envMapColor = textureCube(envMap, coordVec, specularMIPLevel);
    	#endif
        envMapColor = envMapTexelToLinear(envMapColor);
        return envMapColor.rgb * envMapParams.y;
    }
    float computeSpecularOcclusion(const in float dotNV, const in float ambientOcclusion, const in float roughness) {
    	return saturate(pow(dotNV + ambientOcclusion, exp2(-16.0 * roughness - 1.0)) - 1.0 + ambientOcclusion);
    }
#endif
#ifdef USE_SPHERICALHARMONICS_LIGHT
    vec3 shGetIrradianceAt(in vec3 normal, in vec3 shCoefficients[9]) {
        float x = normal.x, y = normal.y, z = normal.z;
        vec3 result = shCoefficients[0] * 0.886227;
        result += shCoefficients[1] * 2.0 * 0.511664 * y;
        result += shCoefficients[2] * 2.0 * 0.511664 * z;
        result += shCoefficients[3] * 2.0 * 0.511664 * x;
        result += shCoefficients[4] * 2.0 * 0.429043 * x * y;
        result += shCoefficients[5] * 2.0 * 0.429043 * y * z;
        result += shCoefficients[6] * (0.743125 * z * z - 0.247708);
        result += shCoefficients[7] * 2.0 * 0.429043 * x * z;
        result += shCoefficients[8] * 0.429043 * (x * x - y * y);
        return result;
    }
    vec3 getLightProbeIrradiance(const in vec3 lightProbe[9], const in vec3 normal) {
        vec3 irradiance = shGetIrradianceAt(normal, lightProbe);
        return irradiance;
    }
#endif`,Zr=`#ifdef USE_ALPHA_MAP
	uniform sampler2D alphaMap;
	varying vec2 vAlphaMapUV;
#endif`,jr=`#ifdef USE_ALPHA_MAP
	outColor.a *= texture2D(alphaMap, vAlphaMapUV).g;
#endif`,Kr=`#ifdef USE_ALPHA_MAP
    uniform mat3 alphaMapUVTransform;
	varying vec2 vAlphaMapUV;
#endif`,$r=`#ifdef USE_ALPHA_MAP
	vAlphaMapUV = (alphaMapUVTransform * vec3(ALPHAMAP_UV, 1.)).xy;
#endif`,Jr=`#ifdef USE_NORMAL_MAP
    uniform sampler2D normalMap;
    uniform vec2 normalScale;
#endif
#if defined(USE_NORMAL_MAP) || defined(USE_CLEARCOAT_NORMALMAP)
    #if defined(USE_TANGENT) && !defined(FLAT_SHADED)
        #define USE_TBN
    #else
        #include <tsn>
    #endif
#endif`,ea=`
#ifdef FLAT_SHADED
    vec3 fdx = dFdx(v_modelPos);
    vec3 fdy = dFdy(v_modelPos);
    vec3 N = normalize(cross(fdx, fdy));
#else
    vec3 N = normalize(v_Normal);
    #ifdef DOUBLE_SIDED
        N = N * (float(gl_FrontFacing) * 2.0 - 1.0);
    #endif
#endif
#ifdef USE_TBN
	vec3 tangent = normalize(v_Tangent);
	vec3 bitangent = normalize(v_Bitangent);
	#ifdef DOUBLE_SIDED
		tangent = tangent * (float(gl_FrontFacing) * 2.0 - 1.0);
		bitangent = bitangent * (float(gl_FrontFacing) * 2.0 - 1.0);
	#endif
	mat3 tspace = mat3(tangent, bitangent, N);
#endif
vec3 geometryNormal = N;
#ifdef USE_NORMAL_MAP
    vec3 mapN = texture2D(normalMap, v_Uv).rgb * 2.0 - 1.0;
    mapN.xy *= normalScale;
    #ifdef USE_TBN
        N = normalize(tspace * mapN);
    #else
        mapN.xy *= (float(gl_FrontFacing) * 2.0 - 1.0);
        N = normalize(tsn(N, v_modelPos, v_Uv) * mapN);
    #endif
#elif defined(USE_BUMPMAP)
    N = perturbNormalArb(v_modelPos, N, dHdxy_fwd(v_Uv));
#endif
#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = geometryNormal;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D(clearcoatNormalMap, v_Uv).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	#ifdef USE_TBN
		clearcoatNormal = normalize(tspace * clearcoatMapN);
	#else
		clearcoatMapN.xy *= (float(gl_FrontFacing) * 2.0 - 1.0);
		clearcoatNormal = normalize(tsn(clearcoatNormal, v_modelPos, v_Uv) * clearcoatMapN);
	#endif
#endif`,ta=`#ifndef FLAT_SHADED
    varying vec3 v_Normal;
    #ifdef USE_TANGENT
        varying vec3 v_Tangent;
		varying vec3 v_Bitangent;
    #endif
#endif`,na=`#ifndef FLAT_SHADED
    varying vec3 v_Normal;
    #ifdef USE_TANGENT
        varying vec3 v_Tangent;
		varying vec3 v_Bitangent;
    #endif
#endif`,ia=`#ifndef FLAT_SHADED
    v_Normal = (transposeMat4(inverseMat4(u_Model)) * vec4(objectNormal, 0.0)).xyz;
    #ifdef FLIP_SIDED
    	v_Normal = - v_Normal;
    #endif
    #ifdef USE_TANGENT
        v_Tangent = (transposeMat4(inverseMat4(u_Model)) * vec4(objectTangent, 0.0)).xyz;
        #ifdef FLIP_SIDED
            v_Tangent = - v_Tangent;
        #endif
        v_Bitangent = normalize(cross(v_Normal, v_Tangent) * a_Tangent.w);
    #endif
#endif`,sa=`const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256.,  256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
    vec4 r = vec4( fract( v * PackFactors ), v );
    r.yzw -= r.xyz * ShiftRight8;    return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
    return dot( v, UnpackFactors );
}`,ra=`#ifdef USE_PREMULTIPLIED_ALPHA
    gl_FragColor.rgb = gl_FragColor.rgb * gl_FragColor.a;
#endif`,aa=`vec4 worldPosition = u_Model * vec4(transformed, 1.0);
gl_Position = u_ProjectionView * worldPosition;`,oa=`#if defined( DITHERING )
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,ca=`#if defined( DITHERING )
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,la=`#ifdef USE_SHADOW_SAMPLER
    float computeShadow(sampler2DShadow shadowMap, vec3 shadowCoord) {
        return texture2D( shadowMap, shadowCoord );
    }
#else
    float computeShadow(sampler2D shadowMap, vec3 shadowCoord) {
        return step(shadowCoord.z, unpackRGBAToDepth(texture2D(shadowMap, shadowCoord.xy)));
    }
#endif
float computeShadowWithPoissonSampling(sampler2DShadow shadowMap, vec3 shadowCoord, float texelSize) {
    vec3 poissonDisk[4];
    poissonDisk[0] = vec3(-0.94201624, -0.39906216, 0);
    poissonDisk[1] = vec3(0.94558609, -0.76890725, 0);
    poissonDisk[2] = vec3(-0.094184101, -0.92938870, 0);
    poissonDisk[3] = vec3(0.34495938, 0.29387760, 0);
    return computeShadow(shadowMap, shadowCoord + poissonDisk[0] * texelSize) * 0.25 +
        computeShadow(shadowMap, shadowCoord + poissonDisk[1] * texelSize) * 0.25 +
        computeShadow(shadowMap, shadowCoord + poissonDisk[2] * texelSize) * 0.25 +
        computeShadow(shadowMap, shadowCoord + poissonDisk[3] * texelSize) * 0.25;
}
float computeShadowWithPCF1(sampler2DShadow shadowSampler, vec3 shadowCoord) {
    return computeShadow(shadowSampler, shadowCoord);
}
float computeShadowWithPCF3(sampler2DShadow shadowSampler, vec3 shadowCoord, vec2 shadowMapSizeAndInverse) {
    vec2 uv = shadowCoord.xy * shadowMapSizeAndInverse.x;    uv += 0.5;    vec2 st = fract(uv);    vec2 base_uv = floor(uv) - 0.5;    base_uv *= shadowMapSizeAndInverse.y;
    vec2 uvw0 = 3. - 2. * st;
    vec2 uvw1 = 1. + 2. * st;
    vec2 u = vec2((2. - st.x) / uvw0.x - 1., st.x / uvw1.x + 1.) * shadowMapSizeAndInverse.y;
    vec2 v = vec2((2. - st.y) / uvw0.y - 1., st.y / uvw1.y + 1.) * shadowMapSizeAndInverse.y;
    float shadow = 0.;
    shadow += uvw0.x * uvw0.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[0], v[0]), shadowCoord.z));
    shadow += uvw1.x * uvw0.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[1], v[0]), shadowCoord.z));
    shadow += uvw0.x * uvw1.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[0], v[1]), shadowCoord.z));
    shadow += uvw1.x * uvw1.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[1], v[1]), shadowCoord.z));
    shadow = shadow / 16.;
    return shadow;
}
float computeShadowWithPCF5(sampler2DShadow shadowSampler, vec3 shadowCoord, vec2 shadowMapSizeAndInverse) {
    vec2 uv = shadowCoord.xy * shadowMapSizeAndInverse.x;    uv += 0.5;    vec2 st = fract(uv);    vec2 base_uv = floor(uv) - 0.5;    base_uv *= shadowMapSizeAndInverse.y;
    vec2 uvw0 = 4. - 3. * st;
    vec2 uvw1 = vec2(7.);
    vec2 uvw2 = 1. + 3. * st;
    vec3 u = vec3((3. - 2. * st.x) / uvw0.x - 2., (3. + st.x) / uvw1.x, st.x / uvw2.x + 2.) * shadowMapSizeAndInverse.y;
    vec3 v = vec3((3. - 2. * st.y) / uvw0.y - 2., (3. + st.y) / uvw1.y, st.y / uvw2.y + 2.) * shadowMapSizeAndInverse.y;
    float shadow = 0.;
    shadow += uvw0.x * uvw0.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[0], v[0]), shadowCoord.z));
    shadow += uvw1.x * uvw0.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[1], v[0]), shadowCoord.z));
    shadow += uvw2.x * uvw0.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[2], v[0]), shadowCoord.z));
    shadow += uvw0.x * uvw1.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[0], v[1]), shadowCoord.z));
    shadow += uvw1.x * uvw1.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[1], v[1]), shadowCoord.z));
    shadow += uvw2.x * uvw1.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[2], v[1]), shadowCoord.z));
    shadow += uvw0.x * uvw2.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[0], v[2]), shadowCoord.z));
    shadow += uvw1.x * uvw2.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[1], v[2]), shadowCoord.z));
    shadow += uvw2.x * uvw2.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[2], v[2]), shadowCoord.z));
    shadow = shadow / 144.;
    return shadow;
}
float computeFallOff(float value, vec2 clipSpace, float frustumEdgeFalloff) {
    float factor = mix(clipSpace.y * abs(clipSpace.y), dot(clipSpace, clipSpace), step(0., frustumEdgeFalloff));
    float mask = smoothstep(1.0 - abs(frustumEdgeFalloff), 1.00000012, clamp(factor, 0., 1.));
    return mix(value, 1.0, mask);
}
float getShadow(sampler2DShadow shadowMap, vec4 shadowCoord, vec2 shadowMapSize, vec2 shadowBias, vec2 shadowParams) {
    shadowCoord.xyz /= shadowCoord.w;
    shadowCoord.z += shadowBias.x;
    bvec4 inFrustumVec = bvec4 (shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0);
    bool inFrustum = all(inFrustumVec);
    bvec2 frustumTestVec = bvec2(inFrustum, shadowCoord.z <= 1.0);
    bool frustumTest = all(frustumTestVec);
    float shadow = 1.0;
    if (frustumTest) {
        #ifdef USE_HARD_SHADOW
            shadow = computeShadow(shadowMap, shadowCoord.xyz);
        #else
            #ifdef USE_PCF3_SOFT_SHADOW
                vec2 shadowMapSizeAndInverse = vec2(shadowMapSize.x, 1. / shadowMapSize.x);
                shadow = computeShadowWithPCF3(shadowMap, shadowCoord.xyz, shadowMapSizeAndInverse);
            #else
                #ifdef USE_PCF5_SOFT_SHADOW
                    vec2 shadowMapSizeAndInverse = vec2(shadowMapSize.x, 1. / shadowMapSize.x);
                    shadow = computeShadowWithPCF5(shadowMap, shadowCoord.xyz, shadowMapSizeAndInverse);
                #else
                    float texelSize = shadowParams.x * 0.5 / shadowMapSize.x;
                    shadow = computeShadowWithPoissonSampling(shadowMap, shadowCoord.xyz, texelSize);
                #endif
            #endif
        #endif
        shadow = computeFallOff(shadow, shadowCoord.xy * 2. - 1., shadowParams.y);
    }
    return shadow;
}
float textureCubeCompare(samplerCube depths, vec3 uv, float compare) {
    return step(compare, unpackRGBAToDepth(textureCube(depths, uv)));
}
float getPointShadow(samplerCube shadowMap, vec4 shadowCoord, vec2 shadowMapSize, vec2 shadowBias, vec2 shadowParams, vec2 shadowCameraRange) {
    float shadow = 1.0;
    vec3 lightToPosition = shadowCoord.xyz;
    float lightToPositionLength = length(lightToPosition);
    if (lightToPositionLength - shadowCameraRange.y <= 0.0 && lightToPositionLength - shadowCameraRange.x >= 0.0) {
        float dp = (lightToPositionLength - shadowCameraRange.x) / (shadowCameraRange.y - shadowCameraRange.x);
        dp += shadowBias.x;
		vec3 bd3D = normalize(lightToPosition);
        #ifdef USE_HARD_SHADOW
            shadow = textureCubeCompare(shadowMap, bd3D, dp);
        #else
            float texelSize = shadowParams.x * 0.5 / shadowMapSize.x;
            vec2 offset = vec2(-1.0, 1.0) * texelSize;
            shadow = (
                textureCubeCompare(shadowMap, bd3D + offset.xyy, dp) +
                textureCubeCompare(shadowMap, bd3D + offset.yyy, dp) +
                textureCubeCompare(shadowMap, bd3D + offset.xyx, dp) +
                textureCubeCompare(shadowMap, bd3D + offset.yyx, dp) +
                textureCubeCompare(shadowMap, bd3D, dp) +
                textureCubeCompare(shadowMap, bd3D + offset.xxy, dp) +
                textureCubeCompare(shadowMap, bd3D + offset.yxy, dp) +
                textureCubeCompare(shadowMap, bd3D + offset.xxx, dp) +
                textureCubeCompare(shadowMap, bd3D + offset.yxx, dp)
            ) * (1.0 / 9.0);
        #endif
    }
    return shadow;
}
#ifdef USE_PCSS_SOFT_SHADOW
    const vec3 PoissonSamplers32[64] = vec3[64](
        vec3(0.06407013, 0.05409927, 0.),
        vec3(0.7366577, 0.5789394, 0.),
        vec3(-0.6270542, -0.5320278, 0.),
        vec3(-0.4096107, 0.8411095, 0.),
        vec3(0.6849564, -0.4990818, 0.),
        vec3(-0.874181, -0.04579735, 0.),
        vec3(0.9989998, 0.0009880066, 0.),
        vec3(-0.004920578, -0.9151649, 0.),
        vec3(0.1805763, 0.9747483, 0.),
        vec3(-0.2138451, 0.2635818, 0.),
        vec3(0.109845, 0.3884785, 0.),
        vec3(0.06876755, -0.3581074, 0.),
        vec3(0.374073, -0.7661266, 0.),
        vec3(0.3079132, -0.1216763, 0.),
        vec3(-0.3794335, -0.8271583, 0.),
        vec3(-0.203878, -0.07715034, 0.),
        vec3(0.5912697, 0.1469799, 0.),
        vec3(-0.88069, 0.3031784, 0.),
        vec3(0.5040108, 0.8283722, 0.),
        vec3(-0.5844124, 0.5494877, 0.),
        vec3(0.6017799, -0.1726654, 0.),
        vec3(-0.5554981, 0.1559997, 0.),
        vec3(-0.3016369, -0.3900928, 0.),
        vec3(-0.5550632, -0.1723762, 0.),
        vec3(0.925029, 0.2995041, 0.),
        vec3(-0.2473137, 0.5538505, 0.),
        vec3(0.9183037, -0.2862392, 0.),
        vec3(0.2469421, 0.6718712, 0.),
        vec3(0.3916397, -0.4328209, 0.),
        vec3(-0.03576927, -0.6220032, 0.),
        vec3(-0.04661255, 0.7995201, 0.),
        vec3(0.4402924, 0.3640312, 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.)
    );
    const vec3 PoissonSamplers64[64] = vec3[64](
        vec3(-0.613392, 0.617481, 0.),
        vec3(0.170019, -0.040254, 0.),
        vec3(-0.299417, 0.791925, 0.),
        vec3(0.645680, 0.493210, 0.),
        vec3(-0.651784, 0.717887, 0.),
        vec3(0.421003, 0.027070, 0.),
        vec3(-0.817194, -0.271096, 0.),
        vec3(-0.705374, -0.668203, 0.),
        vec3(0.977050, -0.108615, 0.),
        vec3(0.063326, 0.142369, 0.),
        vec3(0.203528, 0.214331, 0.),
        vec3(-0.667531, 0.326090, 0.),
        vec3(-0.098422, -0.295755, 0.),
        vec3(-0.885922, 0.215369, 0.),
        vec3(0.566637, 0.605213, 0.),
        vec3(0.039766, -0.396100, 0.),
        vec3(0.751946, 0.453352, 0.),
        vec3(0.078707, -0.715323, 0.),
        vec3(-0.075838, -0.529344, 0.),
        vec3(0.724479, -0.580798, 0.),
        vec3(0.222999, -0.215125, 0.),
        vec3(-0.467574, -0.405438, 0.),
        vec3(-0.248268, -0.814753, 0.),
        vec3(0.354411, -0.887570, 0.),
        vec3(0.175817, 0.382366, 0.),
        vec3(0.487472, -0.063082, 0.),
        vec3(-0.084078, 0.898312, 0.),
        vec3(0.488876, -0.783441, 0.),
        vec3(0.470016, 0.217933, 0.),
        vec3(-0.696890, -0.549791, 0.),
        vec3(-0.149693, 0.605762, 0.),
        vec3(0.034211, 0.979980, 0.),
        vec3(0.503098, -0.308878, 0.),
        vec3(-0.016205, -0.872921, 0.),
        vec3(0.385784, -0.393902, 0.),
        vec3(-0.146886, -0.859249, 0.),
        vec3(0.643361, 0.164098, 0.),
        vec3(0.634388, -0.049471, 0.),
        vec3(-0.688894, 0.007843, 0.),
        vec3(0.464034, -0.188818, 0.),
        vec3(-0.440840, 0.137486, 0.),
        vec3(0.364483, 0.511704, 0.),
        vec3(0.034028, 0.325968, 0.),
        vec3(0.099094, -0.308023, 0.),
        vec3(0.693960, -0.366253, 0.),
        vec3(0.678884, -0.204688, 0.),
        vec3(0.001801, 0.780328, 0.),
        vec3(0.145177, -0.898984, 0.),
        vec3(0.062655, -0.611866, 0.),
        vec3(0.315226, -0.604297, 0.),
        vec3(-0.780145, 0.486251, 0.),
        vec3(-0.371868, 0.882138, 0.),
        vec3(0.200476, 0.494430, 0.),
        vec3(-0.494552, -0.711051, 0.),
        vec3(0.612476, 0.705252, 0.),
        vec3(-0.578845, -0.768792, 0.),
        vec3(-0.772454, -0.090976, 0.),
        vec3(0.504440, 0.372295, 0.),
        vec3(0.155736, 0.065157, 0.),
        vec3(0.391522, 0.849605, 0.),
        vec3(-0.620106, -0.328104, 0.),
        vec3(0.789239, -0.419965, 0.),
        vec3(-0.545396, 0.538133, 0.),
        vec3(-0.178564, -0.596057, 0.)
    );
    float getRand(vec2 seed) {
        return fract(sin(dot(seed.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }
    float computeShadowWithPCSS(sampler2D depthSampler, sampler2DShadow shadowSampler, vec3 shadowCoord, float shadowMapSizeInverse, float lightSizeUV, int searchTapCount, int pcfTapCount, vec3[64] poissonSamplers) {
        float depthMetric = shadowCoord.z;
        float blockerDepth = 0.0;
        float sumBlockerDepth = 0.0;
        float numBlocker = 0.0;
        for (int i = 0; i < searchTapCount; i++) {
            blockerDepth = unpackRGBAToDepth(texture(depthSampler, shadowCoord.xy + (lightSizeUV * shadowMapSizeInverse * PoissonSamplers32[i].xy)));
            if (blockerDepth < depthMetric) {
                sumBlockerDepth += blockerDepth;
                numBlocker++;
            }
        }
        if (numBlocker < 1.0) {
            return 1.0;
        }
        float avgBlockerDepth = sumBlockerDepth / numBlocker;
        float AAOffset = shadowMapSizeInverse * 10.;
        float penumbraRatio = ((depthMetric - avgBlockerDepth) + AAOffset);
        float filterRadius = penumbraRatio * lightSizeUV * shadowMapSizeInverse;
        float random = getRand(shadowCoord.xy);        float rotationAngle = random * 3.1415926;
        vec2 rotationVector = vec2(cos(rotationAngle), sin(rotationAngle));
        float shadow = 0.;
        for (int i = 0; i < pcfTapCount; i++) {
            vec3 offset = poissonSamplers[i];
            offset = vec3(offset.x * rotationVector.x - offset.y * rotationVector.y, offset.y * rotationVector.x + offset.x * rotationVector.y, 0.);
            shadow += texture(shadowSampler, shadowCoord + offset * filterRadius);
        }
        shadow /= float(pcfTapCount);
        shadow = mix(shadow, 1., depthMetric - avgBlockerDepth);
        return shadow;
    }
    float getShadowWithPCSS(sampler2D depthSampler, sampler2DShadow shadowMap, vec4 shadowCoord, vec2 shadowMapSize, vec2 shadowBias, vec2 shadowParams) {
        shadowCoord.xyz /= shadowCoord.w;
        shadowCoord.z += shadowBias.x;
        bvec4 inFrustumVec = bvec4 (shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0);
        bool inFrustum = all(inFrustumVec);
        bvec2 frustumTestVec = bvec2(inFrustum, shadowCoord.z <= 1.0);
        bool frustumTest = all(frustumTestVec);
        float shadow = 1.0;
        if (frustumTest) {
            #ifdef USE_PCSS16_SOFT_SHADOW
                shadow = computeShadowWithPCSS(depthSampler, shadowMap, shadowCoord.xyz, 1. / shadowMapSize.x, 0.1 * shadowMapSize.x, 16, 16, PoissonSamplers32);
            #else
                #ifdef USE_PCSS32_SOFT_SHADOW
                    shadow = computeShadowWithPCSS(depthSampler, shadowMap, shadowCoord.xyz, 1. / shadowMapSize.x, 0.1 * shadowMapSize.x, 16, 32, PoissonSamplers32);
                #else
                    shadow = computeShadowWithPCSS(depthSampler, shadowMap, shadowCoord.xyz, 1. / shadowMapSize.x, 0.1 * shadowMapSize.x, 32, 64, PoissonSamplers64);
                #endif
            #endif
            shadow = computeFallOff(shadow, shadowCoord.xy * 2. - 1., shadowParams.y);
        }
        return shadow;
    }
#endif`,ha=`#ifdef USE_SHADOW
#endif`,da=`#ifdef USE_SHADOW
	#if NUM_DIR_SHADOWS > 0
		uniform sampler2DShadow directionalShadowMap[NUM_DIR_SHADOWS];
		varying vec4 vDirectionalShadowCoord[NUM_DIR_SHADOWS];
		#ifdef USE_PCSS_SOFT_SHADOW
			uniform sampler2D directionalDepthMap[NUM_DIR_SHADOWS];
		#endif
		struct DirectLightShadow {
			vec2 shadowBias;
			vec2 shadowMapSize;
			vec2 shadowParams;
		};
		uniform DirectLightShadow u_DirectionalShadow[NUM_DIR_SHADOWS];
	#endif
	#if NUM_POINT_SHADOWS > 0
		uniform samplerCube pointShadowMap[NUM_POINT_SHADOWS];
		varying vec4 vPointShadowCoord[NUM_POINT_SHADOWS];
		struct PointLightShadow {
			vec2 shadowBias;
			vec2 shadowMapSize;
			vec2 shadowParams;
			vec2 shadowCameraRange;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow u_PointShadow[NUM_POINT_SHADOWS];
	#endif
	#if NUM_SPOT_SHADOWS > 0
		uniform sampler2DShadow spotShadowMap[NUM_SPOT_SHADOWS];
		varying vec4 vSpotShadowCoord[NUM_SPOT_SHADOWS];
		#ifdef USE_PCSS_SOFT_SHADOW
			uniform sampler2D spotDepthMap[NUM_SPOT_SHADOWS];
		#endif
		struct SpotLightShadow {
			vec2 shadowBias;
			vec2 shadowMapSize;
			vec2 shadowParams;
		};
		uniform SpotLightShadow u_SpotShadow[NUM_SPOT_SHADOWS];
	#endif
	#include <packing>
	#include <shadow>
#endif`,ua=`#ifdef USE_SHADOW
	#if NUM_DIR_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[NUM_DIR_SHADOWS];
		varying vec4 vDirectionalShadowCoord[NUM_DIR_SHADOWS];
		struct DirectLightShadow {
			vec2 shadowBias;
			vec2 shadowMapSize;
			vec2 shadowParams;
		};
		uniform DirectLightShadow u_DirectionalShadow[NUM_DIR_SHADOWS];
	#endif
	#if NUM_POINT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[NUM_POINT_SHADOWS];
		varying vec4 vPointShadowCoord[NUM_POINT_SHADOWS];
		struct PointLightShadow {
			vec2 shadowBias;
			vec2 shadowMapSize;
			vec2 shadowParams;
			vec2 shadowCameraRange;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow u_PointShadow[NUM_POINT_SHADOWS];
	#endif
	#if NUM_SPOT_SHADOWS > 0
		uniform mat4 spotShadowMatrix[NUM_SPOT_SHADOWS];
		varying vec4 vSpotShadowCoord[NUM_SPOT_SHADOWS];
		struct SpotLightShadow {
			vec2 shadowBias;
			vec2 shadowMapSize;
			vec2 shadowParams;
		};
		uniform SpotLightShadow u_SpotShadow[NUM_SPOT_SHADOWS];
	#endif
#endif`,fa=`
#ifdef USE_SHADOW
	#if NUM_DIR_SHADOWS > 0 || NUM_POINT_SHADOWS > 0 || NUM_SPOT_SHADOWS > 0
		vec3 shadowWorldNormal = (transposeMat4(inverseMat4(u_Model)) * vec4(objectNormal, 0.0)).xyz;
		shadowWorldNormal = normalize(shadowWorldNormal);
		vec4 shadowWorldPosition;
	#endif
	#if NUM_DIR_SHADOWS > 0
		#pragma unroll_loop_start
		for (int i = 0; i < NUM_DIR_SHADOWS; i++) {
			shadowWorldPosition = worldPosition + vec4(shadowWorldNormal * u_DirectionalShadow[i].shadowBias[1], 0);
			vDirectionalShadowCoord[i] = directionalShadowMatrix[i] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_SHADOWS > 0
		#pragma unroll_loop_start
		for (int i = 0; i < NUM_POINT_SHADOWS; i++) {
			shadowWorldPosition = worldPosition + vec4(shadowWorldNormal * u_PointShadow[i].shadowBias[1], 0);
			vPointShadowCoord[i] = pointShadowMatrix[i] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_SHADOWS > 0
		#pragma unroll_loop_start
		for (int i = 0; i < NUM_SPOT_SHADOWS; i++) {
			shadowWorldPosition = worldPosition + vec4(shadowWorldNormal * u_SpotShadow[i].shadowBias[1], 0);
			vSpotShadowCoord[i] = spotShadowMatrix[i] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif`,_a=`#ifdef USE_MORPHNORMALS
	objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
	objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
	objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
	objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
#endif`,pa=`#ifdef USE_MORPHTARGETS
	#ifndef USE_MORPHNORMALS
	uniform float morphTargetInfluences[ 8 ];
	#else
	uniform float morphTargetInfluences[ 4 ];
	#endif
#endif`,ma=`#ifdef USE_MORPHTARGETS
	transformed += morphTarget0 * morphTargetInfluences[ 0 ];
	transformed += morphTarget1 * morphTargetInfluences[ 1 ];
	transformed += morphTarget2 * morphTargetInfluences[ 2 ];
	transformed += morphTarget3 * morphTargetInfluences[ 3 ];
	#ifndef USE_MORPHNORMALS
        transformed += morphTarget4 * morphTargetInfluences[ 4 ];
        transformed += morphTarget5 * morphTargetInfluences[ 5 ];
        transformed += morphTarget6 * morphTargetInfluences[ 6 ];
        transformed += morphTarget7 * morphTargetInfluences[ 7 ];
	#endif
#endif`,ga=`#ifdef USE_SKINNING
    attribute vec4 skinIndex;
	attribute vec4 skinWeight;
    uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
    #ifdef BONE_TEXTURE
        uniform sampler2D boneTexture;
        uniform int boneTextureSize;
        mat4 getBoneMatrix( const in float i ) {
            float j = i * 4.0;
            float x = mod( j, float( boneTextureSize ) );
            float y = floor( j / float( boneTextureSize ) );
            float dx = 1.0 / float( boneTextureSize );
            float dy = 1.0 / float( boneTextureSize );
            y = dy * ( y + 0.5 );
            vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );
            vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );
            vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );
            vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );
            mat4 bone = mat4( v1, v2, v3, v4 );
            return bone;
        }
    #else
        uniform mat4 boneMatrices[MAX_BONES];
        mat4 getBoneMatrix(const in float i) {
            mat4 bone = boneMatrices[int(i)];
            return bone;
        }
    #endif
#endif`,va=`#ifdef USE_SKINNING
    mat4 boneMatX = getBoneMatrix( skinIndex.x );
    mat4 boneMatY = getBoneMatrix( skinIndex.y );
    mat4 boneMatZ = getBoneMatrix( skinIndex.z );
    mat4 boneMatW = getBoneMatrix( skinIndex.w );
    vec4 skinVertex = bindMatrix * vec4(transformed, 1.0);
    vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	skinned = bindMatrixInverse * skinned;
    transformed = skinned.xyz / skinned.w;
#endif`,Ta=`#ifdef USE_SKINNING
    mat4 skinMatrix = mat4( 0.0 );
    skinMatrix += skinWeight.x * boneMatX;
    skinMatrix += skinWeight.y * boneMatY;
    skinMatrix += skinWeight.z * boneMatZ;
    skinMatrix += skinWeight.w * boneMatW;
    skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
    objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
    #ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Sa=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, v_Uv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Ea=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,xa=`mat4 transposeMat4(mat4 inMatrix) {
    vec4 i0 = inMatrix[0];
    vec4 i1 = inMatrix[1];
    vec4 i2 = inMatrix[2];
    vec4 i3 = inMatrix[3];
    mat4 outMatrix = mat4(
        vec4(i0.x, i1.x, i2.x, i3.x),
        vec4(i0.y, i1.y, i2.y, i3.y),
        vec4(i0.z, i1.z, i2.z, i3.z),
        vec4(i0.w, i1.w, i2.w, i3.w)
    );
    return outMatrix;
}`,Ma=`mat3 tsn(vec3 N, vec3 V, vec2 uv) {
    vec3 q0 = dFdx(V.xyz);
    vec3 q1 = dFdy(V.xyz);
    vec2 st0 = dFdx(uv.xy);
    vec2 st1 = dFdy(uv.xy);
    float scale = sign(st1.y * st0.x - st0.y * st1.x);
    vec3 S = normalize((q0 * st1.y - q1 * st0.y) * scale);
    vec3 T = normalize((-q0 * st1.x + q1 * st0.x) * scale);
    return mat3(S, T, N);
}`,Aa=`#ifdef USE_UV1
    varying vec2 v_Uv;
#endif`,wa=`#if defined(USE_UV) || defined(USE_UV1)
    uniform mat3 uvTransform;
#endif
#ifdef USE_UV1
    attribute vec2 a_Uv;
    varying vec2 v_Uv;
#endif`,ya=`#ifdef USE_UV1
    v_Uv = (uvTransform * vec3(a_Uv, 1.)).xy;
#endif`,Ca="varying vec3 v_modelPos;",Ra="varying vec3 v_modelPos;",Pa=`
v_modelPos = worldPosition.xyz;`,La=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ba=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Na=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		uniform float logDepthCameraNear;
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
		uniform float logDepthCameraNear;
	#endif
#endif`,Da=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w - logDepthCameraNear;
		vIsPerspective = float( isPerspectiveMatrix( u_Projection ) );
	#else
		if ( isPerspectiveMatrix( u_Projection ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w - logDepthCameraNear + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,Ia=`#ifdef USE_CLEARCOAT
	uniform float u_Clearcoat;
	uniform float u_ClearcoatRoughness;
#endif
#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif`;const Qi={alphaTest_frag:dr,alphaTest_pars_frag:ur,aoMap_pars_frag:fr,aoMap_pars_vert:_r,aoMap_vert:pr,aoMap_frag:mr,begin_frag:gr,begin_vert:vr,bsdfs:Tr,bumpMap_pars_frag:Sr,clippingPlanes_frag:Er,clippingPlanes_pars_frag:xr,color_frag:Mr,color_pars_frag:Ar,color_pars_vert:wr,color_vert:yr,common_frag:Cr,common_vert:Rr,diffuseMap_frag:Pr,diffuseMap_pars_frag:Lr,diffuseMap_vert:br,diffuseMap_pars_vert:Nr,emissiveMap_frag:Dr,emissiveMap_pars_frag:Ir,emissiveMap_vert:Or,emissiveMap_pars_vert:Ur,encodings_frag:Fr,encodings_pars_frag:Br,end_frag:zr,envMap_frag:Gr,envMap_pars_frag:Hr,envMap_pars_vert:Vr,envMap_vert:kr,fog_frag:Wr,fog_pars_frag:Xr,inverse:qr,light_frag:Yr,light_pars_frag:Qr,alphamap_pars_frag:Zr,alphamap_frag:jr,alphamap_pars_vert:Kr,alphamap_vert:$r,normalMap_pars_frag:Jr,normal_frag:ea,normal_pars_frag:ta,normal_pars_vert:na,normal_vert:ia,packing:sa,premultipliedAlpha_frag:ra,pvm_vert:aa,dithering_frag:oa,dithering_pars_frag:ca,shadow:la,shadowMap_frag:ha,shadowMap_pars_frag:da,shadowMap_pars_vert:ua,shadowMap_vert:fa,morphnormal_vert:_a,morphtarget_pars_vert:pa,morphtarget_vert:ma,skinning_pars_vert:ga,skinning_vert:va,skinnormal_vert:Ta,specularMap_frag:Sa,specularMap_pars_frag:Ea,transpose:xa,tsn:Ma,uv_pars_frag:Aa,uv_pars_vert:wa,uv_vert:ya,modelPos_pars_frag:Ca,modelPos_pars_vert:Ra,modelPos_vert:Pa,logdepthbuf_frag:La,logdepthbuf_pars_frag:ba,logdepthbuf_pars_vert:Na,logdepthbuf_vert:Da,clearcoat_pars_frag:Ia};var Oa=`#include <common_frag>
#include <uv_pars_frag>
#include <color_pars_frag>
#include <diffuseMap_pars_frag>
#include <alphamap_pars_frag>
#include <alphaTest_pars_frag>
#include <modelPos_pars_frag>
#if defined(USE_ENV_MAP) && !defined(USE_VERTEX_ENVDIR)
    #include <normalMap_pars_frag>
    #include <normal_pars_frag>    
#endif
#include <envMap_pars_frag>
#include <aoMap_pars_frag>
#include <fog_pars_frag>
#include <logdepthbuf_pars_frag>
#include <clippingPlanes_pars_frag>
void main() {
    #include <clippingPlanes_frag>
    #include <logdepthbuf_frag>
    #include <begin_frag>
    #include <color_frag>
    #include <diffuseMap_frag>
    #include <alphamap_frag>
    #include <alphaTest_frag>
    ReflectedLight reflectedLight = ReflectedLight(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));
    reflectedLight.indirectDiffuse += vec3(1.0);
    #include <aoMap_frag>
    reflectedLight.indirectDiffuse *= outColor.xyz;
    outColor.xyz = reflectedLight.indirectDiffuse;
    #if defined(USE_ENV_MAP) && !defined(USE_VERTEX_ENVDIR)
        #include <normal_frag>
    #endif
    #include <envMap_frag>
    #include <end_frag>
    #include <encodings_frag>
    #include <premultipliedAlpha_frag>
    #include <fog_frag>
}`,Ua=`#include <common_vert>
#include <uv_pars_vert>
#include <color_pars_vert>
#include <diffuseMap_pars_vert>
#include <modelPos_pars_vert>
#if defined(USE_ENV_MAP) && !defined(USE_VERTEX_ENVDIR)
    #include <normal_pars_vert>
#endif
#include <envMap_pars_vert>
#include <aoMap_pars_vert>
#include <alphamap_pars_vert>
#include <morphtarget_pars_vert>
#include <skinning_pars_vert>
#include <logdepthbuf_pars_vert>
void main() {
    #include <begin_vert>
    #include <morphtarget_vert>
    #include <skinning_vert>
    #include <pvm_vert>
    #include <logdepthbuf_vert>
    #include <uv_vert>
    #include <color_vert>
    #include <diffuseMap_vert>
    #include <modelPos_vert>
    #ifdef USE_ENV_MAP
        #include <morphnormal_vert>
        #include <skinnormal_vert>
        #ifndef USE_VERTEX_ENVDIR
            #include <normal_vert>
        #endif  
    #endif
    #include <envMap_vert>
    #include <aoMap_vert>
    #include <alphamap_vert>
}`,Fa=`#include <common_frag>
#include <diffuseMap_pars_frag>
#include <alphaTest_pars_frag>
#include <modelPos_pars_frag>
#include <uv_pars_frag>
#include <packing>
#include <logdepthbuf_pars_frag>
#include <clippingPlanes_pars_frag>
void main() {
    #include <clippingPlanes_frag>
    #if defined(USE_DIFFUSE_MAP) && defined(ALPHATEST)
        vec4 texelColor = texture2D( diffuseMap, v_Uv );
        float alpha = texelColor.a * u_Opacity;
        if(alpha < u_AlphaTest) discard;
    #endif
    #include <logdepthbuf_frag>
    
    #ifdef DEPTH_PACKING_RGBA
        gl_FragColor = packDepthToRGBA(gl_FragCoord.z);
    #else
        gl_FragColor = vec4( vec3( 1.0 - gl_FragCoord.z ), u_Opacity );
    #endif
}`,Ba=`#include <common_vert>
#include <morphtarget_pars_vert>
#include <skinning_pars_vert>
#include <uv_pars_vert>
#include <modelPos_pars_vert>
#include <logdepthbuf_pars_vert>
void main() {
    #include <uv_vert>
    #include <begin_vert>
    #include <morphtarget_vert>
    #include <skinning_vert>
    #include <pvm_vert>
    #include <logdepthbuf_vert>
    #include <modelPos_vert>
}`,za=`#include <common_frag>
uniform float nearDistance;
uniform float farDistance;
#include <modelPos_pars_frag>
#include <packing>
#include <clippingPlanes_pars_frag>
void main() {
    #include <clippingPlanes_frag>
    
    float dist = length( v_modelPos - u_CameraPosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
    gl_FragColor = packDepthToRGBA(dist);
}`,Ga=`#include <common_vert>
#include <modelPos_pars_vert>
#include <morphtarget_pars_vert>
#include <skinning_pars_vert>
void main() {
    #include <begin_vert>
    #include <morphtarget_vert>
    #include <skinning_vert>
    #include <pvm_vert>
    #include <modelPos_vert>
}`,Ha=`#define USE_LAMBERT
#include <common_frag>
#include <dithering_pars_frag>
uniform vec3 emissive;
#include <uv_pars_frag>
#include <color_pars_frag>
#include <diffuseMap_pars_frag>
#include <normalMap_pars_frag>
#include <alphamap_pars_frag>
#include <alphaTest_pars_frag>
#include <bumpMap_pars_frag>
#include <light_pars_frag>
#include <normal_pars_frag>
#include <modelPos_pars_frag>
#include <bsdfs>
#include <envMap_pars_frag>
#include <aoMap_pars_frag>
#include <shadowMap_pars_frag>
#include <fog_pars_frag>
#include <emissiveMap_pars_frag>
#include <logdepthbuf_pars_frag>
#include <clippingPlanes_pars_frag>
void main() {
    #include <clippingPlanes_frag>
    #include <logdepthbuf_frag>
    #include <begin_frag>
    #include <color_frag>
    #include <diffuseMap_frag>
    #include <alphamap_frag>
    #include <alphaTest_frag>
    #include <normal_frag>
    ReflectedLight reflectedLight = ReflectedLight(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));
    #include <light_frag>
    #include <aoMap_frag>
    outColor.xyz = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
    #include <envMap_frag>
    #include <shadowMap_frag>
    vec3 totalEmissiveRadiance = emissive;
    #include <emissiveMap_frag>
    outColor.xyz += totalEmissiveRadiance;
    #include <end_frag>
    #include <encodings_frag>
    #include <premultipliedAlpha_frag>
    #include <fog_frag>
    #include <dithering_frag>
}`,Va=`#define USE_LAMBERT
#include <common_vert>
#include <normal_pars_vert>
#include <uv_pars_vert>
#include <color_pars_vert>
#include <diffuseMap_pars_vert>
#include <modelPos_pars_vert>
#include <envMap_pars_vert>
#include <aoMap_pars_vert>
#include <alphamap_pars_vert>
#include <emissiveMap_pars_vert>
#include <shadowMap_pars_vert>
#include <morphtarget_pars_vert>
#include <skinning_pars_vert>
#include <logdepthbuf_pars_vert>
void main() {
    #include <begin_vert>
    #include <morphtarget_vert>
    #include <morphnormal_vert>
    #include <skinning_vert>
    #include <skinnormal_vert>
    #include <pvm_vert>
    #include <normal_vert>
    #include <logdepthbuf_vert>
    #include <uv_vert>
    #include <color_vert>
    #include <diffuseMap_vert>
    #include <modelPos_vert>
    #include <envMap_vert>
    #include <aoMap_vert>
    #include <alphamap_vert>
    #include <emissiveMap_vert>
    #include <shadowMap_vert>
}`,ka=`#include <common_frag>
#include <diffuseMap_pars_frag>
#include <alphaTest_pars_frag>
#include <uv_pars_frag>
#include <packing>
#include <normal_pars_frag>
#include <logdepthbuf_pars_frag>
void main() {
    #if defined(USE_DIFFUSE_MAP) && defined(ALPHATEST)
        vec4 texelColor = texture2D( diffuseMap, v_Uv );
        float alpha = texelColor.a * u_Opacity;
        if(alpha < u_AlphaTest) discard;
    #endif
    #include <logdepthbuf_frag>
    vec4 packedNormalDepth;
    packedNormalDepth.xyz = normalize(v_Normal) * 0.5 + 0.5;
    packedNormalDepth.w = gl_FragCoord.z;
    gl_FragColor = packedNormalDepth;
}`,Wa=`#include <common_vert>
#include <morphtarget_pars_vert>
#include <skinning_pars_vert>
#include <normal_pars_vert>
#include <uv_pars_vert>
#include <logdepthbuf_pars_vert>
void main() {
    #include <uv_vert>
    #include <begin_vert>
    #include <morphtarget_vert>
    #include <morphnormal_vert>
    #include <skinning_vert>
    #include <skinnormal_vert>
    #include <normal_vert>
    #include <pvm_vert>
    #include <logdepthbuf_vert>
}`,Xa=`#define USE_PBR
#include <common_frag>
#include <dithering_pars_frag>
uniform float u_Metalness;
#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif
uniform float u_Roughness;
#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif
uniform vec3 emissive;
#include <uv_pars_frag>
#include <color_pars_frag>
#include <diffuseMap_pars_frag>
#include <alphamap_pars_frag>
#include <alphaTest_pars_frag>
#include <normalMap_pars_frag>
#include <bumpMap_pars_frag>
#include <envMap_pars_frag>
#include <aoMap_pars_frag>
#include <light_pars_frag>
#include <normal_pars_frag>
#include <clearcoat_pars_frag>
#include <modelPos_pars_frag>
#include <bsdfs>
#include <shadowMap_pars_frag>
#include <fog_pars_frag>
#include <emissiveMap_pars_frag>
#include <logdepthbuf_pars_frag>
#include <clippingPlanes_pars_frag>
void main() {
    #include <clippingPlanes_frag>
    #include <logdepthbuf_frag>
    #include <begin_frag>
    #include <color_frag>
    #include <diffuseMap_frag>
    #include <alphamap_frag>
    #include <alphaTest_frag>
    #include <normal_frag>
    float roughnessFactor = u_Roughness;
    #ifdef USE_ROUGHNESSMAP
    	vec4 texelRoughness = texture2D( roughnessMap, v_Uv );
    	roughnessFactor *= texelRoughness.g;
    #endif
    float metalnessFactor = u_Metalness;
    #ifdef USE_METALNESSMAP
    	vec4 texelMetalness = texture2D( metalnessMap, v_Uv );
    	metalnessFactor *= texelMetalness.b;
    #endif
    ReflectedLight reflectedLight = ReflectedLight(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));
    #include <light_frag>
    #include <aoMap_frag>
    outColor.xyz = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular;
    #include <shadowMap_frag>
    vec3 totalEmissiveRadiance = emissive;
    #include <emissiveMap_frag>
    outColor.xyz += totalEmissiveRadiance;
    #include <end_frag>
    #include <encodings_frag>
    #include <premultipliedAlpha_frag>
    #include <fog_frag>
    #include <dithering_frag>
}`,qa=`#define USE_PBR
#define USE_PBR2
#include <common_frag>
#include <dithering_pars_frag>
uniform vec3 u_SpecularColor;
#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif
uniform float glossiness;
#ifdef USE_GLOSSINESSMAP
	uniform sampler2D glossinessMap;
#endif
uniform vec3 emissive;
#include <uv_pars_frag>
#include <color_pars_frag>
#include <diffuseMap_pars_frag>
#include <alphamap_pars_frag>
#include <alphaTest_pars_frag>
#include <normalMap_pars_frag>
#include <bumpMap_pars_frag>
#include <envMap_pars_frag>
#include <aoMap_pars_frag>
#include <light_pars_frag>
#include <normal_pars_frag>
#include <modelPos_pars_frag>
#include <bsdfs>
#include <shadowMap_pars_frag>
#include <fog_pars_frag>
#include <emissiveMap_pars_frag>
#include <logdepthbuf_pars_frag>
#include <clippingPlanes_pars_frag>
void main() {
    #include <clippingPlanes_frag>
    #include <logdepthbuf_frag>
    #include <begin_frag>
    #include <color_frag>
    #include <diffuseMap_frag>
    #include <alphamap_frag>
    #include <alphaTest_frag>
    #include <normal_frag>
    vec3 specularFactor = u_SpecularColor;
    #ifdef USE_SPECULARMAP
        vec4 texelSpecular = texture2D(specularMap, v_Uv);
        texelSpecular = sRGBToLinear(texelSpecular);
        specularFactor *= texelSpecular.rgb;
    #endif
    float glossinessFactor = glossiness;
    #ifdef USE_GLOSSINESSMAP
        vec4 texelGlossiness = texture2D(glossinessMap, v_Uv);
        glossinessFactor *= texelGlossiness.a;
    #endif
    ReflectedLight reflectedLight = ReflectedLight(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));
    #include <light_frag>
    #include <aoMap_frag>
    outColor.xyz = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular;
    #include <shadowMap_frag>
    vec3 totalEmissiveRadiance = emissive;
    #include <emissiveMap_frag>
    outColor.xyz += totalEmissiveRadiance;
    #include <end_frag>
    #include <encodings_frag>
    #include <premultipliedAlpha_frag>
    #include <fog_frag>
    #include <dithering_frag>
}`,vi=`#define USE_PBR
#include <common_vert>
#include <normal_pars_vert>
#include <uv_pars_vert>
#include <color_pars_vert>
#include <diffuseMap_pars_vert>
#include <modelPos_pars_vert>
#include <envMap_pars_vert>
#include <aoMap_pars_vert>
#include <alphamap_pars_vert>
#include <emissiveMap_pars_vert>
#include <shadowMap_pars_vert>
#include <morphtarget_pars_vert>
#include <skinning_pars_vert>
#include <logdepthbuf_pars_vert>
void main() {
    #include <begin_vert>
    #include <morphtarget_vert>
    #include <morphnormal_vert>
    #include <skinning_vert>
    #include <skinnormal_vert>
    #include <pvm_vert>
    #include <normal_vert>
    #include <logdepthbuf_vert>
    #include <uv_vert>
    #include <color_vert>
    #include <diffuseMap_vert>
    #include <modelPos_vert>
    #include <envMap_vert>
    #include <aoMap_vert>
    #include <alphamap_vert>
    #include <emissiveMap_vert>
    #include <shadowMap_vert>
}`,Ya=`#define USE_PHONG
#include <common_frag>
#include <dithering_pars_frag>
uniform float u_Specular;
uniform vec3 u_SpecularColor;
#include <specularMap_pars_frag>
uniform vec3 emissive;
#include <uv_pars_frag>
#include <color_pars_frag>
#include <diffuseMap_pars_frag>
#include <alphamap_pars_frag>
#include <alphaTest_pars_frag>
#include <normalMap_pars_frag>
#include <bumpMap_pars_frag>
#include <light_pars_frag>
#include <normal_pars_frag>
#include <modelPos_pars_frag>
#include <bsdfs>
#include <envMap_pars_frag>
#include <aoMap_pars_frag>
#include <shadowMap_pars_frag>
#include <fog_pars_frag>
#include <emissiveMap_pars_frag>
#include <logdepthbuf_pars_frag>
#include <clippingPlanes_pars_frag>
void main() {
    #include <clippingPlanes_frag>
    #include <logdepthbuf_frag>
    #include <begin_frag>
    #include <color_frag>
    #include <diffuseMap_frag>
    #include <alphamap_frag>
    #include <alphaTest_frag>
    #include <normal_frag>
    #include <specularMap_frag>
    ReflectedLight reflectedLight = ReflectedLight(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));
    #include <light_frag>
    #include <aoMap_frag>
    outColor.xyz = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular;
    #include <envMap_frag>
    #include <shadowMap_frag>
    vec3 totalEmissiveRadiance = emissive;
    #include <emissiveMap_frag>
    outColor.xyz += totalEmissiveRadiance;
    #include <end_frag>
    #include <encodings_frag>
    #include <premultipliedAlpha_frag>
    #include <fog_frag>
    #include <dithering_frag>
}`,Qa=`#define USE_PHONG
#include <common_vert>
#include <normal_pars_vert>
#include <uv_pars_vert>
#include <color_pars_vert>
#include <diffuseMap_pars_vert>
#include <modelPos_pars_vert>
#include <envMap_pars_vert>
#include <aoMap_pars_vert>
#include <alphamap_pars_vert>
#include <emissiveMap_pars_vert>
#include <shadowMap_pars_vert>
#include <morphtarget_pars_vert>
#include <skinning_pars_vert>
#include <logdepthbuf_pars_vert>
void main() {
    #include <begin_vert>
    #include <morphtarget_vert>
    #include <morphnormal_vert>
    #include <skinning_vert>
    #include <skinnormal_vert>
    #include <pvm_vert>
    #include <normal_vert>
    #include <logdepthbuf_vert>
    #include <uv_vert>
    #include <color_vert>
    #include <diffuseMap_vert>
    #include <modelPos_vert>
    #include <envMap_vert>
    #include <aoMap_vert>
    #include <alphamap_vert>
    #include <emissiveMap_vert>
    #include <shadowMap_vert>
}`,Za=`#include <common_frag>
#include <color_pars_frag>
#include <diffuseMap_pars_frag>
#include <fog_pars_frag>
#include <logdepthbuf_pars_frag>
void main() {
    #include <begin_frag>
    #include <color_frag>
    #include <logdepthbuf_frag>
    #ifdef USE_DIFFUSE_MAP
        outColor *= texture2D(diffuseMap, vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y));
    #endif
    #include <end_frag>
    #include <encodings_frag>
    #include <premultipliedAlpha_frag>
    #include <fog_frag>
}`,ja=`#include <common_vert>
#include <color_pars_vert>
#include <logdepthbuf_pars_vert>
uniform float u_PointSize;
uniform float u_PointScale;
void main() {
    #include <begin_vert>
    #include <pvm_vert>
    #include <color_vert>
    vec4 mvPosition = u_View * u_Model * vec4(transformed, 1.0);
    #ifdef USE_SIZEATTENUATION
        gl_PointSize = u_PointSize * ( u_PointScale / - mvPosition.z );
    #else
        gl_PointSize = u_PointSize;
    #endif
    #include <logdepthbuf_vert>
}`;const Dt={basic_frag:Oa,basic_vert:Ua,depth_frag:Fa,depth_vert:Ba,distance_frag:za,distance_vert:Ga,lambert_frag:Ha,lambert_vert:Va,normaldepth_frag:ka,normaldepth_vert:Wa,pbr_frag:Xa,pbr_vert:vi,pbr2_frag:qa,pbr2_vert:vi,phong_frag:Ya,phong_vert:Qa,point_frag:Za,point_vert:ja};class Ka{constructor(e,t,n){this.gl=e,this.name=n.name,this.type=n.type,this.size=n.size,this.location=e.getAttribLocation(t,this.name),this.count=$a(e,this.type),this.format=Ja(e,this.type),this.locationSize=1,this.type===e.FLOAT_MAT2&&(this.locationSize=2),this.type===e.FLOAT_MAT3&&(this.locationSize=3),this.type===e.FLOAT_MAT4&&(this.locationSize=4)}}function $a(a,e){switch(e){case a.FLOAT:case a.INT:case a.UNSIGNED_INT:return 1;case a.FLOAT_VEC2:case a.INT_VEC2:return 2;case a.FLOAT_VEC3:case a.INT_VEC3:return 3;case a.FLOAT_VEC4:case a.INT_VEC4:return 4;case a.FLOAT_MAT2:return 4;case a.FLOAT_MAT3:return 9;case a.FLOAT_MAT4:return 16;default:return 0}}function Ja(a,e){switch(e){case a.FLOAT:case a.FLOAT_VEC2:case a.FLOAT_VEC3:case a.FLOAT_VEC4:case a.FLOAT_MAT2:case a.FLOAT_MAT3:case a.FLOAT_MAT4:return a.FLOAT;case a.INT:case a.INT_VEC2:case a.INT_VEC3:case a.INT_VEC4:return a.INT;case a.UNSIGNED_INT:return a.UNSIGNED_INT;default:return a.FLOAT}}class eo{constructor(e){this._gl=e,this._extensions={},this.version=parseFloat(/^WebGL (\d)/.exec(e.getParameter(e.VERSION))[1]);const t=this.getExtension("EXT_texture_filter_anisotropic");this.anisotropyExt=t,this.maxAnisotropy=t!==null?e.getParameter(t.MAX_TEXTURE_MAX_ANISOTROPY_EXT):1;let n=null,i=!1;try{this.version>1?(n=this.getExtension("EXT_disjoint_timer_query_webgl2"),n&&(i=!!e.getQuery(n.TIMESTAMP_EXT,n.QUERY_COUNTER_BITS_EXT))):(n=this.getExtension("EXT_disjoint_timer_query"),n&&(i=!!n.getQueryEXT(n.TIMESTAMP_EXT,n.QUERY_COUNTER_BITS_EXT)))}catch(s){console.warn(s)}this.timerQuery=n,this.canUseTimestamp=i,this.parallelShaderCompileExt=this.getExtension("KHR_parallel_shader_compile"),this.maxPrecision=no(e,"highp"),this.maxTextures=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),this.maxVertexTextures=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),this.maxTextureSize=e.getParameter(e.MAX_TEXTURE_SIZE),this.maxCubemapSize=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),this.maxVertexUniformVectors=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),this.maxSamples=this.version>1?e.getParameter(e.MAX_SAMPLES):1,this.lineWidthRange=e.getParameter(e.ALIASED_LINE_WIDTH_RANGE)}getExtension(e){const t=this._gl,n=this._extensions;if(n[e]!==void 0)return n[e];let i=null;for(const s of to)if(i=t.getExtension(s+e),i)break;return n[e]=i,i}}const to=["","WEBKIT_","MOZ_"];function no(a,e){if(e==="highp"){if(a.getShaderPrecisionFormat(a.VERTEX_SHADER,a.HIGH_FLOAT).precision>0&&a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,a.HIGH_FLOAT).precision>0)return"highp";e="mediump"}return e==="mediump"&&a.getShaderPrecisionFormat(a.VERTEX_SHADER,a.MEDIUM_FLOAT).precision>0&&a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,a.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}class io extends Re{constructor(e,t,n,i){super(e),this._gl=t,this._buffers=n,this._vertexArrayBindings=i;const s=this;function r(o){const c=o.target,l=s.get(c);c.removeEventListener("dispose",r),c.index!==null&&n.removeBuffer(c.index.buffer);for(const h in c.attributes)n.removeBuffer(c.attributes[h].buffer);for(const h in c.morphAttributes){const d=c.morphAttributes[h];for(let f=0,u=d.length;f<u;f++)n.removeBuffer(d[f].buffer)}i.releaseByGeometry(c),l.created=!1,s.delete(c)}this._onGeometryDispose=r}setGeometry(e,t){const n=this._gl,i=this._buffers,s=this.get(e);if(s.pass!==t.count){s.pass=t.count,s.created||(e.addEventListener("dispose",this._onGeometryDispose),s.created=!0),e.index!==null&&i.setBuffer(e.index.buffer,n.ELEMENT_ARRAY_BUFFER,this._vertexArrayBindings);for(const r in e.attributes)i.setBuffer(e.attributes[r].buffer,n.ARRAY_BUFFER);for(const r in e.morphAttributes){const o=e.morphAttributes[r];for(let c=0,l=o.length;c<l;c++)i.setBuffer(o[c].buffer,n.ARRAY_BUFFER)}return s}}}const so={u_Model:[1,null],u_Projection:[2,function(a){this.set(a.projectionMatrix.elements)}],u_View:[2,function(a){this.set(a.viewMatrix.elements)}],u_ProjectionView:[2,function(a){this.set(a.projectionViewMatrix.elements)}],u_CameraPosition:[2,function(a){this.setValue(a.position.x,a.position.y,a.position.z)}],logDepthBufFC:[2,function(a){this.set(a.logDepthBufFC)}],logDepthCameraNear:[2,function(a){this.set(a.logDepthCameraNear)}],u_FogColor:[3,function(a){const e=a.fog.color;this.setValue(e.r,e.g,e.b)}],u_FogDensity:[3,function(a){this.set(a.fog.density)}],u_FogNear:[3,function(a){this.set(a.fog.near)}],u_FogFar:[3,function(a){this.set(a.fog.far)}],u_Color:[4,function(a,e){const t=a.diffuse;this.setValue(t.r,t.g,t.b)}],u_Opacity:[4,function(a,e){this.set(a.opacity)}],u_AlphaTest:[4,function(a,e){this.set(a.alphaTest)}],diffuseMap:[4,function(a,e){this.set(a.diffuseMap,e)}],alphaMap:[4,function(a,e){this.set(a.alphaMap,e)}],alphaMapUVTransform:[4,function(a,e){const t=a.alphaMapTransform;t.isTransformUV&&t.update(),this.set(t.elements)}],normalMap:[4,function(a,e){this.set(a.normalMap,e)}],normalScale:[4,function(a,e){this.setValue(a.normalScale.x,a.normalScale.y)}],bumpMap:[4,function(a,e){this.set(a.bumpMap,e)}],bumpScale:[4,function(a,e){this.set(a.bumpScale)}],cubeMap:[4,function(a,e){this.set(a.cubeMap,e)}],u_Specular:[4,function(a,e){this.set(a.shininess)}],u_SpecularColor:[4,function(a,e){const t=a.specular;this.setValue(t.r,t.g,t.b)}],specularMap:[4,function(a,e){this.set(a.specularMap,e)}],aoMap:[4,function(a,e){this.set(a.aoMap,e)}],aoMapIntensity:[4,function(a,e){this.set(a.aoMapIntensity)}],aoMapUVTransform:[4,function(a,e){const t=a.aoMapTransform;t.isTransformUV&&t.update(),this.set(t.elements)}],u_Roughness:[4,function(a,e){this.set(a.roughness)}],roughnessMap:[4,function(a,e){this.set(a.roughnessMap,e)}],u_Metalness:[4,function(a,e){this.set(a.metalness)}],metalnessMap:[4,function(a,e){this.set(a.metalnessMap,e)}],u_Clearcoat:[4,function(a,e){this.set(a.clearcoat)}],u_ClearcoatRoughness:[4,function(a,e){this.set(a.clearcoatRoughness)}],clearcoatMap:[4,function(a,e){this.set(a.clearcoatMap,e)}],clearcoatRoughnessMap:[4,function(a,e){this.set(a.clearcoatRoughnessMap,e)}],clearcoatNormalMap:[4,function(a,e){this.set(a.clearcoatNormalMap,e)}],clearcoatNormalScale:[4,function(a,e){this.setValue(a.clearcoatNormalScale.x,a.clearcoatNormalScale.y)}],glossiness:[4,function(a,e){this.set(a.glossiness)}],glossinessMap:[4,function(a,e){this.set(a.glossinessMap,e)}],emissive:[4,function(a,e){const t=a.emissive;this.setValue(t.r,t.g,t.b)}],emissiveMap:[4,function(a,e){this.set(a.emissiveMap,e)}],emissiveMapUVTransform:[4,function(a,e){const t=a.emissiveMapTransform;t.isTransformUV&&t.update(),this.set(t.elements)}],uvTransform:[4,function(a,e){const t=a.diffuseMapTransform;t.isTransformUV&&t.update(),this.set(t.elements)}],u_PointSize:[4,function(a,e){this.set(a.size)}],envMap:[5,function(a,e){this.set(a.map,e)}],envMapParams:[5,function(a,e){this.setValue(a.diffuse,a.specular,a.map.images[0]&&a.map.images[0].rtt?1:-1)}],maxMipLevel:[5,function(a,e){this.set(e.get(a.map).__maxMipLevel||8)}]},Ge=new ge;Ge.image={data:new Uint8Array([1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1]),width:2,height:2};Ge.magFilter=P.NEAREST;Ge.minFilter=P.NEAREST;Ge.generateMipmaps=!1;Ge.version++;const oe=new ge;oe.image={data:null,width:2,height:2};oe.version++;oe.type=N.FLOAT_32_UNSIGNED_INT_24_8_REV;oe.format=E.DEPTH_STENCIL;oe.magFilter=P.NEAREST;oe.minFilter=P.NEAREST;oe.compare=et.LESS;oe.generateMipmaps=!1;oe.version++;const Ti=new On,Si=new In,Ei=new Un;function W(a,e){if(a.length!==e.length)return!1;for(let t=0,n=a.length;t<n;t++)if(a[t]!==e[t])return!1;return!0}function X(a,e){for(let t=0,n=e.length;t<n;t++)a[t]=e[t]}const xi=[];function It(a,e){let t=xi[e];t===void 0&&(t=new Int32Array(e),xi[e]=t);for(let n=0;n!==e;++n)t[n]=a.allocTexUnit();return t}function Zi(a,e){const t=a.gl,n=a.type,i=a.location,s=a.cache;switch(n){case t.FLOAT:a.setValue=function(r){s[0]!==r&&(t.uniform1f(i,r),s[0]=r)},e?a.set=function(r){W(s,r)||(t.uniform1fv(i,r),X(s,r))}:a.set=a.setValue;break;case t.SAMPLER_2D:case t.SAMPLER_2D_SHADOW:case t.INT_SAMPLER_2D:case t.UNSIGNED_INT_SAMPLER_2D:a.setValue=function(r,o){const c=o.allocTexUnit();o.setTexture2D(r||(n===t.SAMPLER_2D_SHADOW?oe:Ge),c),s[0]!==c&&(t.uniform1i(i,c),s[0]=c)},e?a.set=function(r,o){const c=r.length,l=It(o,c);for(let h=0;h!==c;++h)o.setTexture2D(r[h]||(n===t.SAMPLER_2D_SHADOW?oe:Ge),l[h]);W(s,l)||(t.uniform1iv(i,l),X(s,l))}:a.set=a.setValue;break;case t.SAMPLER_2D_ARRAY:case t.SAMPLER_2D_ARRAY_SHADOW:case t.INT_SAMPLER_2D_ARRAY:case t.UNSIGNED_INT_SAMPLER_2D_ARRAY:a.setValue=function(r,o){const c=o.allocTexUnit();o.setTexture2DArray(r||Si,c),s[0]!==c&&(t.uniform1i(i,c),s[0]=c)},e?a.set=function(r,o){const c=r.length,l=It(o,c);for(let h=0;h!==c;++h)o.setTexture2DArray(r[h]||Si,l[h]);W(s,l)||(t.uniform1iv(i,l),X(s,l))}:a.set=a.setValue;break;case t.SAMPLER_CUBE:case t.SAMPLER_CUBE_SHADOW:a.setValue=function(r,o){const c=o.allocTexUnit();o.setTextureCube(r||Ei,c),s[0]!==c&&(t.uniform1i(i,c),s[0]=c)},e?a.set=function(r,o){const c=r.length,l=It(o,c);for(let h=0;h!==c;++h)o.setTextureCube(r[h]||Ei,l[h]);W(s,l)||(t.uniform1iv(i,l),X(s,l))}:a.set=a.setValue;break;case t.SAMPLER_3D:a.setValue=function(r,o){const c=o.allocTexUnit();o.setTexture3D(r||Ti,c),s[0]!==c&&(t.uniform1i(i,c),s[0]=c)},e?a.set=function(r,o){const c=r.length,l=It(o,c);for(let h=0;h!==c;++h)o.setTexture3D(r[h]||Ti,l[h]);W(s,l)||(t.uniform1iv(i,l),X(s,l))}:a.set=a.setValue;break;case t.BOOL:case t.INT:a.setValue=function(r){s[0]!==r&&(t.uniform1i(i,r),s[0]=r)},e?a.set=function(r){W(s,r)||(t.uniform1iv(i,r),X(s,r))}:a.set=a.setValue;break;case t.FLOAT_VEC2:a.setValue=function(r,o){(s[0]!==r||s[1]!==o)&&(t.uniform2f(i,r,o),s[0]=r,s[1]=o)},a.set=function(r){W(s,r)||(t.uniform2fv(i,r),X(s,r))};break;case t.BOOL_VEC2:case t.INT_VEC2:a.setValue=function(r,o){(s[0]!==r||s[1]!==o)&&(t.uniform2i(i,r,o),s[0]=r,s[1]=o)},a.set=function(r){W(s,r)||(t.uniform2iv(i,r),X(s,r))};break;case t.FLOAT_VEC3:a.setValue=function(r,o,c){(s[0]!==r||s[1]!==o||s[2]!==c)&&(t.uniform3f(i,r,o,c),s[0]=r,s[1]=o,s[2]=c)},a.set=function(r){W(s,r)||(t.uniform3fv(i,r),X(s,r))};break;case t.BOOL_VEC3:case t.INT_VEC3:a.setValue=function(r,o,c){(s[0]!==r||s[1]!==o||s[2]!==c)&&(t.uniform3i(i,r,o,c),s[0]=r,s[1]=o,s[2]=c)},a.set=function(r){W(s,r)||(t.uniform3iv(i,r),X(s,r))};break;case t.FLOAT_VEC4:a.setValue=function(r,o,c,l){(s[0]!==r||s[1]!==o||s[2]!==c||s[3]!==l)&&(t.uniform4f(i,r,o,c,l),s[0]=r,s[1]=o,s[2]=c,s[3]=l)},a.set=function(r){W(s,r)||(t.uniform4fv(i,r),X(s,r))};break;case t.BOOL_VEC4:case t.INT_VEC4:a.setValue=function(r,o,c,l){(s[0]!==r||s[1]!==o||s[2]!==c||s[3]!==l)&&(t.uniform4i(i,r,o,c,l),s[0]=r,s[1]=o,s[2]=c,s[3]=l)},a.set=function(r){W(s,r)||(t.uniform4iv(i,r),X(s,r))};break;case t.FLOAT_MAT2:e?a.setValue=a.set=function(r){W(s,r)||(t.uniformMatrix2fv(i,!1,r),X(s,r))}:a.setValue=a.set=function(r){(s[0]!==r[0]||s[1]!==r[1]||s[2]!==r[2]||s[3]!==r[3])&&(t.uniformMatrix2fv(i,!1,r),s[0]=r[0],s[1]=r[1],s[2]=r[2],s[3]=r[3])};break;case t.FLOAT_MAT3:e?a.setValue=a.set=function(r){W(s,r)||(t.uniformMatrix3fv(i,!1,r),X(s,r))}:a.setValue=a.set=function(r){(s[0]!==r[0]||s[1]!==r[1]||s[2]!==r[2]||s[3]!==r[3]||s[4]!==r[4]||s[5]!==r[5]||s[6]!==r[6]||s[7]!==r[7]||s[8]!==r[8])&&(t.uniformMatrix3fv(i,!1,r),s[0]=r[0],s[1]=r[1],s[2]=r[2],s[3]=r[3],s[4]=r[4],s[5]=r[5],s[6]=r[6],s[7]=r[7],s[8]=r[8])};break;case t.FLOAT_MAT4:e?a.setValue=a.set=function(r){W(s,r)||(t.uniformMatrix4fv(i,!1,r),X(s,r))}:a.setValue=a.set=function(r){(s[0]!==r[0]||s[1]!==r[1]||s[2]!==r[2]||s[3]!==r[3]||s[4]!==r[4]||s[5]!==r[5]||s[6]!==r[6]||s[7]!==r[7]||s[8]!==r[8]||s[9]!==r[9]||s[10]!==r[10]||s[11]!==r[11]||s[12]!==r[12]||s[13]!==r[13]||s[14]!==r[14]||s[15]!==r[15])&&(t.uniformMatrix4fv(i,!1,r),s[0]=r[0],s[1]=r[1],s[2]=r[2],s[3]=r[3],s[4]=r[4],s[5]=r[5],s[6]=r[6],s[7]=r[7],s[8]=r[8],s[9]=r[9],s[10]=r[10],s[11]=r[11],s[12]=r[12],s[13]=r[13],s[14]=r[14],s[15]=r[15])};break}}class ro{constructor(e,t,n,i){this.gl=e,this.id=t,this.type=n.type,this.location=i,this.setValue=void 0,this.set=void 0,this.cache=[],Zi(this),this.internalGroup=0,this.internalFun=null;const s=so[t];s&&(this.internalGroup=s[0],this.internalFun=s[1])}}class ao{constructor(e,t,n,i){this.gl=e,this.id=t,this.type=n.type,this.size=n.size,this.location=i,this.setValue=void 0,this.set=void 0,this.cache=[],Zi(this,!0)}}class ji{constructor(){this.seq=[],this.map={}}}class oo extends ji{constructor(e){super(),this.id=e}set(e,t){const n=this.seq;for(let i=0,s=n.length;i!==s;++i){const r=n[i];r.set(e[r.id],t)}}}const gn=/(\w+)(\])?(\[|\.)?/g;function Mi(a,e){a.seq.push(e),a.map[e.id]=e}function co(a,e,t,n){const i=e.name,s=i.length;for(gn.lastIndex=0;;){const r=gn.exec(i),o=gn.lastIndex;let c=r[1];const l=r[2]==="]",h=r[3];if(l&&(c=c|0),h===void 0||h==="["&&o+2===s){Mi(n,h===void 0?new ro(a,c,e,t):new ao(a,c,e,t));break}else{let f=n.map[c];f===void 0&&(f=new oo(c),Mi(n,f)),n=f}}}class lo extends ji{constructor(e,t){super();const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const s=e.getActiveUniform(t,i),r=e.getUniformLocation(t,s.name);co(e,s,r,this)}}set(e,t,n){const i=this.map[e];i!==void 0&&i.set(t,n)}has(e){return!!this.map[e]}}let ho=0;class uo{constructor(e,t,n){this.gl=e,this.vshaderSource=t,this.fshaderSource=n,this.id=ho++,this.usedTimes=1,this.code="",this.name="",this.lightId=-1,this.lightVersion=-1,this.cameraId=-1,this.cameraVersion=-1,this.sceneId=-1,this.sceneVersion=-1,this.program,this._checkErrors=!0,this._compileAsynchronously=!1,this._status=0;let i,s,r;this.compile=function(l){s=Ai(e,e.VERTEX_SHADER,t),r=Ai(e,e.FRAGMENT_SHADER,n),i=e.createProgram(),e.attachShader(i,s),e.attachShader(i,r),e.linkProgram(i),this.program=i,this._checkErrors=l.checkErrors,this._compileAsynchronously=l.compileAsynchronously,this._status=1,e.deleteShader(s),e.deleteShader(r)},this.isReady=function(l){return this._status===1&&(this._compileAsynchronously&&l?e.getProgramParameter(i,l.COMPLETION_STATUS_KHR)&&(this._status=2,this._tryCheckErrors()):(this._status=2,this._tryCheckErrors())),this._status===2},this._tryCheckErrors=function(){if(this._checkErrors&&e.getProgramParameter(i,e.LINK_STATUS)===!1){const l=e.getProgramInfoLog(i).trim(),h=wi(e,s,"VERTEX"),d=wi(e,r,"FRAGMENT");this.program=void 0,this._status=0,console.error("Shader Error "+e.getError()+" - VALIDATE_STATUS "+e.getProgramParameter(i,e.VALIDATE_STATUS)+`

Shader Name: `+this.name+`
Program Info Log: `+l+`
`+h+`
`+d)}};let o;this.getUniforms=function(){return o===void 0&&(o=new lo(e,i)),o};let c;this.getAttributes=function(){return c===void 0&&(c=_o(e,i)),c},this.dispose=function(){e.deleteProgram(i),this.program=void 0,this._status=0}}}function fo(a,e){const t=a.split(`
`),n=[],i=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let r=i;r<s;r++){const o=r+1;n.push(`${o===e?">":" "} ${o}: ${t[r]}`)}return n.join(`
`)}function Ai(a,e,t){const n=a.createShader(e);return a.shaderSource(n,t),a.compileShader(n),n}function wi(a,e,t){const n=a.getShaderParameter(e,a.COMPILE_STATUS),i=a.getShaderInfoLog(e).trim();if(n&&i==="")return"";const s=/ERROR: 0:(\d+)/.exec(i);if(s){const r=parseInt(s[1]);return t+`

`+i+`

`+fo(a.getShaderSource(e),r)}else return i}function _o(a,e){const t={},n=a.getProgramParameter(e,a.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const s=a.getActiveAttrib(e,i);t[s.name]=new Ka(a,e,s)}return t}class po{constructor(e,t,n){this._gl=e,this._state=t,this._capabilities=n,this._programs=[]}getProgram(e,t,n,i){const s=this._programs;let r;for(let o=0,c=s.length;o<c;o++){const l=s[o];if(l.code===n){r=l,++r.usedTimes;break}}if(r===void 0){const o=mo(e.defines),c=Dt[e.type+"_vert"]||e.vertexShader||Dt.basic_vert,l=Dt[e.type+"_frag"]||e.fragmentShader||Dt.basic_frag;r=To(this._gl,o,t,c,l),r.name=t.shaderName,r.compile(i),r.code=n,s.push(r)}return r}releaseProgram(e){if(--e.usedTimes===0){const t=this._programs,n=t.indexOf(e);t[n]=t[t.length-1],t.pop(),e.dispose(this._gl)}}generateProps(e,t,n){const i=this._state,s=this._capabilities,r=e.acceptLight?n.lights:null,o=e.fog?n.scene.fog:null,c=e.envMap!==void 0?e.envMap||n.scene.environment:null,l=n.scene.logarithmicDepthBuffer,h=n.scene.disableShadowSampler,d=e.clippingPlanes&&e.clippingPlanes.length>0?e.clippingPlanes.length:n.scene.numClippingPlanes,f=e.clearcoat>0,u=!!e.diffuseMap,p=!!e.alphaMap,_=!!e.emissiveMap,v=!!e.aoMap,m=!!e.normalMap,M=!!e.bumpMap,A=!!e.specularMap,T=!!e.roughnessMap,w=!!e.metalnessMap,R=!!e.glossinessMap,O=!!c,F=f&&!!e.clearcoatMap,I=f&&!!e.clearcoatRoughnessMap,L=f&&!!e.clearcoatNormalMap;Ht=e.extUvCoordMask;const x={};x.shaderName=e.type===wn.SHADER&&e.shaderName?e.shaderName:e.type,x.version=s.version,x.precision=e.precision||s.maxPrecision,x.useStandardDerivatives=s.version>=2||!!s.getExtension("OES_standard_derivatives")||!!s.getExtension("GL_OES_standard_derivatives"),x.useShaderTextureLOD=s.version>=2||!!s.getExtension("EXT_shader_texture_lod"),x.useDiffuseMap=u,x.useAlphaMap=p,x.useEmissiveMap=_,x.useAOMap=v,x.useNormalMap=m,x.useBumpMap=M,x.useSpecularMap=A,x.useRoughnessMap=T,x.useMetalnessMap=w,x.useGlossinessMap=R,x.useEnvMap=O,x.envMapCombine=O&&e.envMapCombine,x.useClearcoat=f,x.useClearcoatMap=F,x.useClearcoatRoughnessMap=I,x.useClearcoatNormalMap=L,x.diffuseMapUv=u&&Ot(e.diffuseMapCoord),x.alphaMapUv=p&&Ot(e.alphaMapCoord),x.emissiveMapUv=_&&Ot(e.emissiveMapCoord),x.aoMapUv=v&&Ot(e.aoMapCoord),(m||M||A||T||w||R||F||I||L)&&(Ht|=1),x.activeMapCoords=Ht,x.useAmbientLight=!!r&&r.useAmbient,x.useSphericalHarmonicsLight=!!r&&r.useSphericalHarmonics,x.hemisphereLightNum=r?r.hemisNum:0,x.directLightNum=r?r.directsNum:0,x.pointLightNum=r?r.pointsNum:0,x.spotLightNum=r?r.spotsNum:0,x.rectAreaLightNum=r?r.rectAreaNum:0,x.directShadowNum=t.receiveShadow&&r?r.directShadowNum:0,x.pointShadowNum=t.receiveShadow&&r?r.pointShadowNum:0,x.spotShadowNum=t.receiveShadow&&r?r.spotShadowNum:0,x.useShadow=t.receiveShadow&&!!r&&r.shadowsNum>0,x.useShadowSampler=s.version>=2&&!h,x.shadowType=t.shadowType,!x.useShadowSampler&&x.shadowType!==$.HARD&&(x.shadowType=$.POISSON_SOFT),x.dithering=e.dithering;const D=i.currentRenderTarget;x.gammaFactor=n.gammaFactor,x.outputEncoding=D.texture?Ut(D.texture):n.outputEncoding,x.diffuseMapEncoding=Ut(e.diffuseMap||e.cubeMap),x.envMapEncoding=Ut(c),x.emissiveMapEncoding=Ut(e.emissiveMap),x.alphaTest=e.alphaTest>0,x.premultipliedAlpha=e.premultipliedAlpha,x.useVertexColors=e.vertexColors,x.useVertexTangents=!!e.normalMap&&e.vertexTangents,x.numClippingPlanes=d,x.flatShading=e.shading===Gi.FLAT_SHADING,x.fog=!!o,x.fogExp2=!!o&&o.isFogExp2,x.sizeAttenuation=e.sizeAttenuation,x.doubleSided=e.side===ze.DOUBLE,x.flipSided=e.side===ze.BACK,x.packDepthToRGBA=e.packToRGBA,x.logarithmicDepthBuffer=!!l,x.rendererExtensionFragDepth=s.version>=2||!!s.getExtension("EXT_frag_depth"),x.morphTargets=!!t.morphTargetInfluences,x.morphNormals=!!t.morphTargetInfluences&&t.geometry.morphAttributes.normal;const Q=t.isSkinnedMesh&&t.skeleton,Y=s.maxVertexUniformVectors,ee=s.maxVertexTextures>0&&(!!s.getExtension("OES_texture_float")||s.version>=2);let G=0;return ee?G=1024:(G=t.skeleton?t.skeleton.bones.length:0,G*16>Y&&(console.warn("Program: too many bones ("+G+"), current cpu only support "+Math.floor(Y/16)+" bones!!"),G=Math.floor(Y/16))),x.useSkinning=Q,x.bonesNum=G,x.useVertexTexture=ee,x}generateProgramCode(e,t){let n="";for(const i in e)n+=e[i]+"_";for(const i in t.defines)n+=i+"_"+t.defines[i]+"_";return t.type===wn.SHADER&&!t.shaderName&&(n+=t.vertexShader,n+=t.fragmentShader),n}}function mo(a){const e=[];for(const t in a){const n=a[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}let Ht=0;function Ot(a){return Ht|=1<<a,a===0?"a_Uv":`a_Uv${a+1}`}function Ut(a){let e;return a?a.encoding&&(e=a.encoding):e=Oe.LINEAR,e}function Ki(a){switch(a){case Oe.LINEAR:return["Linear","(value)"];case Oe.SRGB:return["sRGB","(value)"];case Oe.GAMMA:return["Gamma","(value, float(GAMMA_FACTOR))"];default:console.error("unsupported encoding: "+a)}}function vn(a,e){const t=Ki(e);return"vec4 "+a+"(vec4 value) { return "+t[0]+"ToLinear"+t[1]+"; }"}function go(a,e){const t=Ki(e);return"vec4 "+a+"(vec4 value) { return LinearTo"+t[0]+t[1]+"; }"}function vo(a){let e="";for(let t=1;t<8;t++)a&1<<t&&(e+="attribute vec2 a_Uv"+(t+1)+";",t!==7&&(e+=`
`));return e}function To(a,e,t,n,i){let s=["precision "+t.precision+" float;","precision "+t.precision+" int;","precision "+t.precision+" sampler2D;",t.version>=2?"precision "+t.precision+" isampler2D;":"",t.version>=2?"precision "+t.precision+" usampler2D;":"","#define SHADER_NAME "+t.shaderName,e,t.version>=2?"#define WEBGL2":"",t.useDiffuseMap?"#define USE_DIFFUSE_MAP":"",t.useAlphaMap?"#define USE_ALPHA_MAP":"",t.useEmissiveMap?"#define USE_EMISSIVEMAP":"",t.useAOMap?"#define USE_AOMAP":"",t.useNormalMap?"#define USE_NORMAL_MAP":"",t.useBumpMap?"#define USE_BUMPMAP":"",t.useSpecularMap?"#define USE_SPECULARMAP":"",t.useRoughnessMap?"#define USE_ROUGHNESSMAP":"",t.useMetalnessMap?"#define USE_METALNESSMAP":"",t.useGlossinessMap?"#define USE_GLOSSINESSMAP":"",t.useEnvMap?"#define USE_ENV_MAP":"",t.diffuseMapUv?"#define DIFFUSEMAP_UV "+t.diffuseMapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.activeMapCoords>0?"#define USE_UV":"",t.activeMapCoords&1?"#define USE_UV1":"",vo(t.activeMapCoords),t.useAmbientLight?"#define USE_AMBIENT_LIGHT":"",t.useSphericalHarmonicsLight?"#define USE_SPHERICALHARMONICS_LIGHT":"",t.useShadow?"#define USE_SHADOW":"",t.useVertexColors==ut.RGB?"#define USE_VCOLOR_RGB":"",t.useVertexColors==ut.RGBA?"#define USE_VCOLOR_RGBA":"",t.useVertexTangents?"#define USE_TANGENT":"",t.flatShading?"#define FLAT_SHADED":"",t.fog?"#define USE_FOG":"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.flipSided?"#define FLIP_SIDED":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.useSkinning?"#define USE_SKINNING":"",t.bonesNum>0?"#define MAX_BONES "+t.bonesNum:"",t.useVertexTexture?"#define BONE_TEXTURE":"",`
`].filter(yi).join(`
`),r=[t.useStandardDerivatives&&t.version<2?"#extension GL_OES_standard_derivatives : enable":"",t.useShaderTextureLOD&&t.version<2?"#extension GL_EXT_shader_texture_lod : enable":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth&&t.version<2?"#extension GL_EXT_frag_depth : enable":"","precision "+t.precision+" float;","precision "+t.precision+" int;","precision "+t.precision+" sampler2D;",t.version>=2?"precision "+t.precision+" isampler2D;":"",t.version>=2?"precision "+t.precision+" usampler2D;":"",t.version>=2?"precision "+t.precision+" sampler2DShadow;":"",t.version>=2?"precision "+t.precision+" samplerCubeShadow;":"","#define SHADER_NAME "+t.shaderName,"#define PI 3.14159265359","#define EPSILON 1e-6","float pow2(const in float x) { return x * x; }","#define LOG2 1.442695","#define RECIPROCAL_PI 0.31830988618","#define saturate(a) clamp(a, 0.0, 1.0)","#define whiteCompliment(a) (1.0 - saturate(a))","highp float rand(const in vec2 uv) {","	const highp float a = 12.9898, b = 78.233, c = 43758.5453;","	highp float dt = dot(uv.xy, vec2(a, b)), sn = mod(dt, PI);","	return fract(sin(sn) * c);","}",e,t.version>=2?"#define WEBGL2":"",t.useShadowSampler?"#define USE_SHADOW_SAMPLER":"#define sampler2DShadow sampler2D",t.useShaderTextureLOD?"#define TEXTURE_LOD_EXT":"",t.useDiffuseMap?"#define USE_DIFFUSE_MAP":"",t.useAlphaMap?"#define USE_ALPHA_MAP":"",t.useEmissiveMap?"#define USE_EMISSIVEMAP":"",t.useAOMap?"#define USE_AOMAP":"",t.useNormalMap?"#define USE_NORMAL_MAP":"",t.useBumpMap?"#define USE_BUMPMAP":"",t.useSpecularMap?"#define USE_SPECULARMAP":"",t.useRoughnessMap?"#define USE_ROUGHNESSMAP":"",t.useMetalnessMap?"#define USE_METALNESSMAP":"",t.useGlossinessMap?"#define USE_GLOSSINESSMAP":"",t.useEnvMap?"#define USE_ENV_MAP":"",t.envMapCombine?"#define "+t.envMapCombine:"",t.useClearcoat?"#define USE_CLEARCOAT":"",t.useClearcoatMap?"#define USE_CLEARCOATMAP":"",t.useClearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.useClearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.activeMapCoords&1?"#define USE_UV1":"",t.useAmbientLight?"#define USE_AMBIENT_LIGHT":"",t.useSphericalHarmonicsLight?"#define USE_SPHERICALHARMONICS_LIGHT":"",t.useShadow?"#define USE_SHADOW":"",t.shadowType===$.HARD?"#define USE_HARD_SHADOW":"",t.shadowType===$.POISSON_SOFT?"#define USE_POISSON_SOFT_SHADOW":"",t.shadowType===$.PCF3_SOFT?"#define USE_PCF3_SOFT_SHADOW":"",t.shadowType===$.PCF5_SOFT?"#define USE_PCF5_SOFT_SHADOW":"",t.shadowType===$.PCSS16_SOFT?"#define USE_PCSS16_SOFT_SHADOW":"",t.shadowType===$.PCSS32_SOFT?"#define USE_PCSS32_SOFT_SHADOW":"",t.shadowType===$.PCSS64_SOFT?"#define USE_PCSS64_SOFT_SHADOW":"",t.shadowType===$.PCSS16_SOFT||t.shadowType===$.PCSS32_SOFT||t.shadowType===$.PCSS64_SOFT?"#define USE_PCSS_SOFT_SHADOW":"",t.dithering?"#define DITHERING":"",Qi.encodings_pars_frag,"#define GAMMA_FACTOR "+t.gammaFactor,go("linearToOutputTexel",t.outputEncoding),vn("mapTexelToLinear",t.diffuseMapEncoding),t.useEnvMap?vn("envMapTexelToLinear",t.envMapEncoding):"",t.useEmissiveMap?vn("emissiveMapTexelToLinear",t.emissiveMapEncoding):"",t.alphaTest?"#define ALPHATEST":"",t.premultipliedAlpha?"#define USE_PREMULTIPLIED_ALPHA":"",t.useVertexColors==ut.RGB?"#define USE_VCOLOR_RGB":"",t.useVertexColors==ut.RGBA?"#define USE_VCOLOR_RGBA":"",t.useVertexTangents?"#define USE_TANGENT":"",t.flatShading?"#define FLAT_SHADED":"",t.fog?"#define USE_FOG":"",t.fogExp2?"#define USE_EXP2_FOG":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.packDepthToRGBA?"#define DEPTH_PACKING_RGBA":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"",`
`].filter(yi).join(`
`),o=n,c=i;if(o=Rn(o),c=Rn(c),o=Ci(o,t),c=Ci(c,t),o=Ri(o,t),c=Ri(c,t),o=Pi(o),c=Pi(c),t.version>1){const l=o.match(Li);l&&(o=o.replace(Li,"")),s=["#version 300 es",l?l.join(`
`):"","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+s,c=c.replace("#extension GL_EXT_draw_buffers : require","");let h=0;const d=[];for(;c.indexOf("gl_FragData["+h+"]")>-1;)c=c.replace("gl_FragData["+h+"]","pc_fragData"+h),d.push("layout(location = "+h+") out highp vec4 pc_fragData"+h+";"),h++;r=["#version 300 es","#define varying in",c.indexOf("layout")>-1||d.length>0?"":"out highp vec4 pc_fragColor;","#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad",d.join(`
`)].join(`
`)+`
`+r}return o=s+o,c=r+c,new uo(a,o,c)}const Rn=function(a){const e=/#include +<([\w\d.]+)>/g;function t(n,i){const s=Qi[i];if(s===void 0)throw new Error("Can not resolve #include <"+i+">");return Rn(s)}return a.replace(e,t)};function yi(a){return a!==""}function Ci(a,e){return a.replace(/NUM_HEMI_LIGHTS/g,e.hemisphereLightNum).replace(/NUM_DIR_LIGHTS/g,e.directLightNum).replace(/NUM_SPOT_LIGHTS/g,e.spotLightNum).replace(/NUM_POINT_LIGHTS/g,e.pointLightNum).replace(/NUM_RECT_AREA_LIGHTS/g,e.rectAreaLightNum).replace(/NUM_DIR_SHADOWS/g,e.directShadowNum).replace(/NUM_SPOT_SHADOWS/g,e.spotShadowNum).replace(/NUM_POINT_SHADOWS/g,e.pointShadowNum)}function Ri(a,e){return a.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes)}const So=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Eo(a,e,t,n){let i="";for(let s=parseInt(e);s<parseInt(t);s++)i+=n.replace(/\[\s*i\s*\]/g,"["+s+"]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function Pi(a){return a.replace(So,Eo)}const Li=/#extension .*/g;class xo extends Re{constructor(e,t,n){super(e),this._gl=t,this._capabilities=n;const i=n.timerQuery,s=this,r=o=>{const c=o.target,l=s.get(c);c.removeEventListener("dispose",r),l._webglQuery&&(n.version>1?t.deleteQuery(l._webglQuery):i.deleteQueryEXT(l._webglQuery)),s.delete(c)};this._onQueryDispose=r,this._typeToGL={[$t.ANY_SAMPLES_PASSED]:35887,[$t.ANY_SAMPLES_PASSED_CONSERVATIVE]:36202,[$t.TIME_ELAPSED]:35007}}_get(e){const t=this._capabilities,n=this.get(e);return n._webglQuery===void 0&&(e.addEventListener("dispose",this._onQueryDispose),n._webglQuery=t.version>1?this._gl.createQuery():t.timerQuery.createQueryEXT(),n._target=null,n._result=null),n}begin(e,t){const n=this._capabilities,i=this._typeToGL,s=this._get(e);n.version>1?this._gl.beginQuery(i[t],s._webglQuery):n.timerQuery.beginQueryEXT(i[t],s._webglQuery),s._target=t,s._result=null}end(e){const t=this._capabilities,n=this._typeToGL,i=this._get(e);t.version>1?this._gl.endQuery(n[i._target]):t.timerQuery.endQueryEXT(n[i._target])}counter(e){const t=this._capabilities.timerQuery,n=this._get(e);t.queryCounterEXT(n._webglQuery,t.TIMESTAMP_EXT),n._target=t.TIMESTAMP_EXT,n._result=null}isResultAvailable(e){const t=this._gl,n=this._capabilities,i=n.timerQuery,s=this._get(e);let r;return n.version>1?r=t.getQueryParameter(s._webglQuery,t.QUERY_RESULT_AVAILABLE):r=i.getQueryObjectEXT(s._webglQuery,i.QUERY_RESULT_AVAILABLE),r}isTimerDisjoint(){return this._gl.getParameter(this._capabilities.timerQuery.GPU_DISJOINT_EXT)}getResult(e){const t=this._gl,n=this._capabilities,i=n.timerQuery,s=this._get(e);return s._result===null&&(n.version>1?s._result=t.getQueryParameter(s._webglQuery,t.QUERY_RESULT):s._result=i.getQueryObjectEXT(s._webglQuery,i.QUERY_RESULT_EXT)),s._result}}class Mo{constructor(e,t){this._gl=e,this._capabilities=t}getGLType(e){const t=this._gl,n=this._capabilities,i=n.version>=2;if(e===N.UNSIGNED_BYTE)return t.UNSIGNED_BYTE;if(e===N.UNSIGNED_SHORT_5_6_5)return t.UNSIGNED_SHORT_5_6_5;if(e===N.UNSIGNED_SHORT_4_4_4_4)return t.UNSIGNED_SHORT_4_4_4_4;if(e===N.UNSIGNED_SHORT_5_5_5_1)return t.UNSIGNED_SHORT_5_5_5_1;let s;if(i){if(e===N.UNSIGNED_SHORT)return t.UNSIGNED_SHORT;if(e===N.UNSIGNED_INT)return t.UNSIGNED_INT;if(e===N.UNSIGNED_INT_24_8)return t.UNSIGNED_INT_24_8;if(e===N.FLOAT)return t.FLOAT;if(e===N.HALF_FLOAT)return t.HALF_FLOAT;if(e===N.FLOAT_32_UNSIGNED_INT_24_8_REV)return t.FLOAT_32_UNSIGNED_INT_24_8_REV;if(e===N.BYTE)return t.BYTE;if(e===N.SHORT)return t.SHORT;if(e===N.INT)return t.INT}else{if(e===N.UNSIGNED_SHORT||e===N.UNSIGNED_INT||e===N.UNSIGNED_INT_24_8)if(s=n.getExtension("WEBGL_depth_texture"),s){if(e===N.UNSIGNED_SHORT)return t.UNSIGNED_SHORT;if(e===N.UNSIGNED_INT)return t.UNSIGNED_INT;if(e===N.UNSIGNED_INT_24_8)return s.UNSIGNED_INT_24_8_WEBGL}else return console.warn("extension WEBGL_depth_texture is not support."),null;if(e===N.FLOAT)return s=n.getExtension("OES_texture_float"),s?t.FLOAT:(console.warn("extension OES_texture_float is not support."),null);if(e===N.HALF_FLOAT)return s=n.getExtension("OES_texture_half_float"),s?s.HALF_FLOAT_OES:(console.warn("extension OES_texture_half_float is not support."),null)}return t[e]!==void 0?t[e]:e}getGLFormat(e){const t=this._gl,n=this._capabilities;if(e===E.RGB)return t.RGB;if(e===E.RGBA)return t.RGBA;if(e===E.ALPHA)return t.ALPHA;if(e===E.LUMINANCE)return t.LUMINANCE;if(e===E.LUMINANCE_ALPHA)return t.LUMINANCE_ALPHA;if(e===E.DEPTH_COMPONENT)return t.DEPTH_COMPONENT;if(e===E.DEPTH_STENCIL)return t.DEPTH_STENCIL;if(e===E.RED)return t.RED;if(e===E.RED_INTEGER)return t.RED_INTEGER;if(e===E.RG)return t.RG;if(e===E.RG_INTEGER)return t.RG_INTEGER;if(e===E.RGB_INTEGER)return t.RGB_INTEGER;if(e===E.RGBA_INTEGER)return t.RGBA_INTEGER;let i;if(e===E.RGB_S3TC_DXT1||e===E.RGBA_S3TC_DXT1||e===E.RGBA_S3TC_DXT3||e===E.RGBA_S3TC_DXT5)if(i=n.getExtension("WEBGL_compressed_texture_s3tc"),i){if(e===E.RGB_S3TC_DXT1)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(e===E.RGBA_S3TC_DXT1)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(e===E.RGBA_S3TC_DXT3)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(e===E.RGBA_S3TC_DXT5)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return console.warn("extension WEBGL_compressed_texture_s3tc is not support."),null;if(e===E.RGB_PVRTC_4BPPV1||e===E.RGB_PVRTC_2BPPV1||e===E.RGBA_PVRTC_4BPPV1||e===E.RGBA_PVRTC_2BPPV1)if(i=n.getExtension("WEBGL_compressed_texture_pvrtc"),i){if(e===E.RGB_PVRTC_4BPPV1)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(e===E.RGB_PVRTC_2BPPV1)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(e===E.RGBA_PVRTC_4BPPV1)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(e===E.RGBA_PVRTC_2BPPV1)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return console.warn("extension WEBGL_compressed_texture_pvrtc is not support."),null;return e===E.RGB_ETC1?(i=n.getExtension("WEBGL_compressed_texture_etc1"),i?i.COMPRESSED_RGB_ETC1_WEBGL:(console.warn("extension WEBGL_compressed_texture_etc1 is not support."),null)):e===E.RGBA_ASTC_4x4?(i=n.getExtension("WEBGL_compressed_texture_astc"),i?i.COMPRESSED_RGBA_ASTC_4x4_KHR:(console.warn("extension WEBGL_compressed_texture_astc is not support."),null)):e===E.RGBA_BPTC?(i=n.getExtension("EXT_texture_compression_bptc"),i?i.COMPRESSED_RGBA_BPTC_UNORM_EXT:(console.warn("extension EXT_texture_compression_bptc is not support."),null)):t[e]!==void 0?t[e]:e}getGLInternalFormat(e){const t=this._gl,n=this._capabilities,i=n.version>=2;if(e===E.RGBA4)return t.RGBA4;if(e===E.RGB5_A1)return t.RGB5_A1;if(e===E.DEPTH_COMPONENT16)return t.DEPTH_COMPONENT16;if(e===E.STENCIL_INDEX8)return t.STENCIL_INDEX8;if(e===E.DEPTH_STENCIL)return t.DEPTH_STENCIL;let s;if(i){if(e===E.R8)return t.R8;if(e===E.RG8)return t.RG8;if(e===E.RGB8)return t.RGB8;if(e===E.RGBA8)return t.RGBA8;if(e===E.DEPTH_COMPONENT24)return t.DEPTH_COMPONENT24;if(e===E.DEPTH_COMPONENT32F)return t.DEPTH_COMPONENT32F;if(e===E.DEPTH24_STENCIL8)return t.DEPTH24_STENCIL8;if(e===E.DEPTH32F_STENCIL8)return t.DEPTH32F_STENCIL8;if(e===E.R16F||e===E.RG16F||e===E.RGB16F||e===E.RGBA16F||e===E.R32F||e===E.RG32F||e===E.RGB32F||e===E.RGBA32F||e===E.R11F_G11F_B10F)if(s=n.getExtension("EXT_color_buffer_float"),s){if(e===E.R16F)return t.R16F;if(e===E.RG16F)return t.RG16F;if(e===E.RGB16F)return t.RGB16F;if(e===E.RGBA16F)return t.RGBA16F;if(e===E.R32F)return t.R32F;if(e===E.RG32F)return t.RG32F;if(e===E.RGB32F)return t.RGB32F;if(e===E.RGBA32F)return t.RGBA32F;if(e===E.R11F_G11F_B10F)return t.R11F_G11F_B10F}else return console.warn("extension EXT_color_buffer_float is not support."),null}else if(e===E.RGBA32F||e===E.RGB32F)if(s=n.getExtension("WEBGL_color_buffer_float"),s){if(e===E.RGBA32F)return s.RGBA32F_EXT;if(e===E.RGB32F)return s.RGB32F_EXT}else return console.warn("extension WEBGL_color_buffer_float is not support."),null;return t[e]!==void 0?t[e]:e}}function bi(a,e,t,n){const i=new Uint8Array(4),s=a.createTexture();a.bindTexture(e,s),a.texParameteri(e,a.TEXTURE_MIN_FILTER,a.NEAREST),a.texParameteri(e,a.TEXTURE_MAG_FILTER,a.NEAREST);for(let r=0;r<n;r++)a.texImage2D(t+r,0,a.RGBA,1,1,0,a.RGBA,a.UNSIGNED_BYTE,i);return s}function Ao(a){let e=!1;const t=new ae;let n=null;const i=new ae(0,0,0,0);return{setMask:function(s){n!==s&&!e&&(a.colorMask(s,s,s,s),n=s)},setLocked:function(s){e=s},setClear:function(s,r,o,c,l){l===!0&&(s*=c,r*=c,o*=c),t.set(s,r,o,c),i.equals(t)===!1&&(a.clearColor(s,r,o,c),i.copy(t))},getClear:function(){return i},reset:function(){e=!1,n=null,i.set(-1,0,0,0)}}}function wo(a,e){let t=!1,n=null,i=null,s=null;return{setTest:function(r){r?e.enable(a.DEPTH_TEST):e.disable(a.DEPTH_TEST)},setMask:function(r){n!==r&&!t&&(a.depthMask(r),n=r)},setFunc:function(r){i!==r&&(a.depthFunc(r),i=r)},setLocked:function(r){t=r},setClear:function(r){s!==r&&(a.clearDepth(r),s=r)},reset:function(){t=!1,n=null,i=null,s=null}}}function yo(a,e){let t=!1,n=null,i=null,s=null,r=null,o=null,c=null,l=null,h=null,d=null,f=null,u=null,p=null,_=null,v=null;return{setTest:function(m){m?e.enable(a.STENCIL_TEST):e.disable(a.STENCIL_TEST)},setMask:function(m){n!==m&&!t&&(a.stencilMask(m),n=m)},setFunc:function(m,M,A,T,w,R){(i!==m||s!==M||r!==A||h!==T||d!==w||f!==R)&&(T===null||w===null||R===null?a.stencilFunc(m,M,A):(a.stencilFuncSeparate(a.FRONT,m,M,A),a.stencilFuncSeparate(a.BACK,T,w,R)),i=m,s=M,r=A,h=T,d=w,f=R)},setOp:function(m,M,A,T,w,R){(o!==m||c!==M||l!==A||u!==T||p!==w||_!==R)&&(T===null||w===null||R===null?a.stencilOp(m,M,A):(a.stencilOpSeparate(a.FRONT,m,M,A),a.stencilOpSeparate(a.BACK,T,w,R)),o=m,c=M,l=A,u=T,p=w,_=R)},setLocked:function(m){t=m},setClear:function(m){v!==m&&(a.clearStencil(m),v=m)},reset:function(){t=!1,n=null,i=null,s=null,r=null,o=null,c=null,l=null,h=null,d=null,f=null,u=null,p=null,_=null,v=null}}}class Co{constructor(e,t){this.gl=e,this.capabilities=t,this.colorBuffer=new Ao(e),this.depthBuffer=new wo(e,this),this.stencilBuffer=new yo(e,this),this.states={},this.currentBlending=null,this.currentBlendEquation=null,this.currentBlendSrc=null,this.currentBlendDst=null,this.currentBlendEquationAlpha=null,this.currentBlendSrcAlpha=null,this.currentBlendDstAlpha=null,this.currentPremultipliedAlpha=null,this.currentFlipSided=!1,this.currentCullFace=null;const n=e.getParameter(e.VIEWPORT);this.currentViewport=new ae().fromArray(n),this.currentLineWidth=null,this.currentPolygonOffsetFactor=null,this.currentPolygonOffsetUnits=null,this.currentProgram=null,this.currentBoundBuffers={},this.currentRenderTarget=null,this.currentTextureSlot=null,this.currentBoundTextures={},this.emptyTextures={},this.emptyTextures[e.TEXTURE_2D]=bi(e,e.TEXTURE_2D,e.TEXTURE_2D,1),this.emptyTextures[e.TEXTURE_CUBE_MAP]=bi(e,e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),this.blendEquationToGL={[ce.ADD]:e.FUNC_ADD,[ce.SUBTRACT]:e.FUNC_SUBTRACT,[ce.REVERSE_SUBTRACT]:e.FUNC_REVERSE_SUBTRACT,[ce.MIN]:e.MIN,[ce.MAX]:e.MAX},this.blendFactorToGL={[K.ZERO]:e.ZERO,[K.ONE]:e.ONE,[K.SRC_COLOR]:e.SRC_COLOR,[K.SRC_ALPHA]:e.SRC_ALPHA,[K.SRC_ALPHA_SATURATE]:e.SRC_ALPHA_SATURATE,[K.DST_COLOR]:e.DST_COLOR,[K.DST_ALPHA]:e.DST_ALPHA,[K.ONE_MINUS_SRC_COLOR]:e.ONE_MINUS_SRC_COLOR,[K.ONE_MINUS_SRC_ALPHA]:e.ONE_MINUS_SRC_ALPHA,[K.ONE_MINUS_DST_COLOR]:e.ONE_MINUS_DST_COLOR,[K.ONE_MINUS_DST_ALPHA]:e.ONE_MINUS_DST_ALPHA},this.colorBuffer.setClear(0,0,0,1),this.depthBuffer.setClear(1),this.stencilBuffer.setClear(0),this.depthBuffer.setTest(!0),this.depthBuffer.setFunc(et.LEQUAL),this.setFlipSided(!1),this.setCullFace(Xe.BACK)}enable(e){this.states[e]!==!0&&(this.gl.enable(e),this.states[e]=!0)}disable(e){this.states[e]!==!1&&(this.gl.disable(e),this.states[e]=!1)}setBlending(e,t,n,i,s,r,o,c){const l=this.gl;if(e===pe.NONE){this.disable(l.BLEND);return}if(this.enable(l.BLEND),e!==pe.CUSTOM)(e!==this.currentBlending||c!==this.currentPremultipliedAlpha)&&((this.currentBlendEquation!==ce.ADD||this.currentBlendEquationAlpha!==ce.ADD)&&(l.blendEquation(l.FUNC_ADD),this.currentBlendEquation=ce.ADD,this.currentBlendEquationAlpha=ce.ADD),e===pe.NORMAL?c?l.blendFuncSeparate(l.ONE,l.ONE_MINUS_SRC_ALPHA,l.ONE,l.ONE_MINUS_SRC_ALPHA):l.blendFuncSeparate(l.SRC_ALPHA,l.ONE_MINUS_SRC_ALPHA,l.ONE,l.ONE_MINUS_SRC_ALPHA):e===pe.ADD?c?l.blendFunc(l.ONE,l.ONE):l.blendFunc(l.SRC_ALPHA,l.ONE):e===pe.SUB?l.blendFuncSeparate(l.ZERO,l.ONE_MINUS_SRC_COLOR,l.ZERO,l.ONE):e===pe.MUL?c?l.blendFuncSeparate(l.ZERO,l.SRC_COLOR,l.ZERO,l.SRC_ALPHA):l.blendFunc(l.ZERO,l.SRC_COLOR):console.error("WebGLState: Invalid blending: ",e)),this.currentBlendSrc=null,this.currentBlendDst=null,this.currentBlendSrcAlpha=null,this.currentBlendDstAlpha=null;else{s=s||t,r=r||n,o=o||i;const h=this.blendEquationToGL,d=this.blendFactorToGL;(t!==this.currentBlendEquation||s!==this.currentBlendEquationAlpha)&&(l.blendEquationSeparate(h[t],h[s]),this.currentBlendEquation=t,this.currentBlendEquationAlpha=s),(n!==this.currentBlendSrc||i!==this.currentBlendDst||r!==this.currentBlendSrcAlpha||o!==this.currentBlendDstAlpha)&&(l.blendFuncSeparate(d[n],d[i],d[r],d[o]),this.currentBlendSrc=n,this.currentBlendDst=i,this.currentBlendSrcAlpha=r,this.currentBlendDstAlpha=o)}this.currentBlending=e,this.currentPremultipliedAlpha=c}setFlipSided(e){const t=this.gl;this.currentFlipSided!==e&&(e?t.frontFace(t.CW):t.frontFace(t.CCW),this.currentFlipSided=e)}setCullFace(e){const t=this.gl;e!==Xe.NONE?(this.enable(t.CULL_FACE),e!==this.currentCullFace&&(e===Xe.BACK?t.cullFace(t.BACK):e===Xe.FRONT?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):this.disable(t.CULL_FACE),this.currentCullFace=e}viewport(e){const t=this.currentViewport;t.equals(e)||(this.gl.viewport(e.x,e.y,e.z,e.w),t.copy(e))}setLineWidth(e){if(e!==this.currentLineWidth){const t=this.capabilities.lineWidthRange;t[0]<=e&&e<=t[1]?this.gl.lineWidth(e):console.warn("GL_ALIASED_LINE_WIDTH_RANGE is ["+t[0]+","+t[1]+"], but set to "+e+"."),this.currentLineWidth=e}}setPolygonOffset(e,t,n){const i=this.gl;e?(this.enable(i.POLYGON_OFFSET_FILL),(this.currentPolygonOffsetFactor!==t||this.currentPolygonOffsetUnits!==n)&&(i.polygonOffset(t,n),this.currentPolygonOffsetFactor=t,this.currentPolygonOffsetUnits=n)):this.disable(i.POLYGON_OFFSET_FILL)}setProgram(e){this.currentProgram!==e&&(this.gl.useProgram(e.program),this.currentProgram=e)}bindBuffer(e,t){const n=this.gl;this.currentBoundBuffers[e]!==t&&(n.bindBuffer(e,t),this.currentBoundBuffers[e]=t)}activeTexture(e){const t=this.gl;e===void 0&&(e=t.TEXTURE0+this.capabilities.maxTextures-1),this.currentTextureSlot!==e&&(t.activeTexture(e),this.currentTextureSlot=e)}bindTexture(e,t){const n=this.gl;this.currentTextureSlot===null&&this.activeTexture();let i=this.currentBoundTextures[this.currentTextureSlot];i===void 0&&(i={type:void 0,texture:void 0},this.currentBoundTextures[this.currentTextureSlot]=i),(i.type!==e||i.texture!==t)&&(n.bindTexture(e,t||this.emptyTextures[e]),i.type=e,i.texture=t)}reset(){const e=this.gl;e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.cullFace(e.BACK),e.frontFace(e.CCW),e.viewport(0,0,e.canvas.width,e.canvas.height),e.lineWidth(1),e.polygonOffset(0,0),e.useProgram(null),e.bindFramebuffer(e.FRAMEBUFFER,null),e.activeTexture(e.TEXTURE0),this.colorBuffer.reset(),this.depthBuffer.reset(),this.stencilBuffer.reset(),this.states={},this.currentBlending=null,this.currentBlendEquation=null,this.currentBlendSrc=null,this.currentBlendDst=null,this.currentBlendEquationAlpha=null,this.currentBlendSrcAlpha=null,this.currentBlendDstAlpha=null,this.currentPremultipliedAlpha=null,this.currentFlipSided=!1,this.currentCullFace=null,this.currentViewport.set(0,0,e.canvas.width,e.canvas.height),this.currentLineWidth=null,this.currentPolygonOffsetFactor=null,this.currentPolygonOffsetUnits=null,this.currentProgram=null,this.currentBoundBuffers={},this.currentRenderTarget=null,this.currentTextureSlot=null,this.currentBoundTextures={}}setMaterial(e,t){this.setCullFace(e.side===ze.DOUBLE?Xe.NONE:Xe.BACK);let n=e.side===ze.BACK;t&&(n=!n),this.setFlipSided(n),e.blending===pe.NORMAL&&e.transparent===!1?this.setBlending(pe.NONE):this.setBlending(e.blending,e.blendEquation,e.blendSrc,e.blendDst,e.blendEquationAlpha,e.blendSrcAlpha,e.blendDstAlpha,e.premultipliedAlpha),this.depthBuffer.setFunc(e.depthFunc),this.depthBuffer.setTest(e.depthTest),this.depthBuffer.setMask(e.depthWrite),this.colorBuffer.setMask(e.colorWrite);const i=e.stencilTest;this.stencilBuffer.setTest(i),i&&(this.stencilBuffer.setMask(e.stencilWriteMask),this.stencilBuffer.setFunc(e.stencilFunc,e.stencilRef,e.stencilFuncMask,e.stencilFuncBack,e.stencilRefBack,e.stencilFuncMaskBack),this.stencilBuffer.setOp(e.stencilFail,e.stencilZFail,e.stencilZPass,e.stencilFailBack,e.stencilZFailBack,e.stencilZPassBack)),this.setPolygonOffset(e.polygonOffset,e.polygonOffsetFactor,e.polygonOffsetUnits),e.lineWidth!==void 0&&this.setLineWidth(e.lineWidth),e.alphaToCoverage===!0?this.enable(this.gl.SAMPLE_ALPHA_TO_COVERAGE):this.disable(this.gl.SAMPLE_ALPHA_TO_COVERAGE)}}class Ro extends Re{constructor(e,t,n,i,s){super(e),this._gl=t,this._state=n,this._capabilities=i,this._constants=s,this._usedTextureUnits=0;const r=this;function o(c){const l=c.target,h=r.get(l);l.removeEventListener("dispose",o),h.__webglTexture&&!h.__external&&t.deleteTexture(h.__webglTexture),r.delete(l)}this._onTextureDispose=o,this._wrappingToGL={[J.REPEAT]:t.REPEAT,[J.CLAMP_TO_EDGE]:t.CLAMP_TO_EDGE,[J.MIRRORED_REPEAT]:t.MIRRORED_REPEAT},this._filterToGL={[P.NEAREST]:t.NEAREST,[P.LINEAR]:t.LINEAR,[P.NEAREST_MIPMAP_NEAREST]:t.NEAREST_MIPMAP_NEAREST,[P.LINEAR_MIPMAP_NEAREST]:t.LINEAR_MIPMAP_NEAREST,[P.NEAREST_MIPMAP_LINEAR]:t.NEAREST_MIPMAP_LINEAR,[P.LINEAR_MIPMAP_LINEAR]:t.LINEAR_MIPMAP_LINEAR}}allocTexUnit(){const e=this._usedTextureUnits++;return e>=this._capabilities.maxTextures&&console.warn("trying to use "+e+" texture units while this GPU supports only "+this._capabilities.maxTextures),e}resetTextureUnits(){this._usedTextureUnits=0}setTexture2D(e,t){const n=this._gl,i=this._state,s=this._capabilities,r=this._constants;t!==void 0&&(t=n.TEXTURE0+t);const o=this.get(e);if(e.image&&o.__version!==e.version&&(!e.image.rtt||t===void 0)&&!o.__external){o.__webglTexture===void 0&&(e.addEventListener("dispose",this._onTextureDispose),o.__webglTexture=n.createTexture()),i.activeTexture(t),i.bindTexture(n.TEXTURE_2D,o.__webglTexture);let c=e.image;const l=Ui(c);l&&(c=Oi(c,s.maxTextureSize),Ni(e)&&Ft(c)===!1&&s.version<2&&(c=Ii(c)));const h=!Ft(c)&&s.version<2;this._setPixelStores(e),this._setTextureParameters(e,h);const d=r.getGLFormat(e.format),f=r.getGLType(e.type),u=e.internalformat!==null?r.getGLInternalFormat(e.internalformat):Bt(n,s,d,f),p=e.mipmaps;let _;if(l)if(p.length>0&&!h){for(let v=0,m=p.length;v<m;v++)_=p[v],n.texImage2D(n.TEXTURE_2D,v,u,d,f,_);e.generateMipmaps=!1,o.__maxMipLevel=p.length-1}else n.texImage2D(n.TEXTURE_2D,0,u,d,f,c),o.__maxMipLevel=0;else if(p.length>0&&!h){const v=c.isCompressed;for(let m=0,M=p.length;m<M;m++)_=p[m],v?n.compressedTexImage2D(n.TEXTURE_2D,m,u,_.width,_.height,0,_.data):n.texImage2D(n.TEXTURE_2D,m,u,_.width,_.height,e.border,d,f,_.data);e.generateMipmaps=!1,o.__maxMipLevel=p.length-1}else n.texImage2D(n.TEXTURE_2D,0,u,c.width,c.height,e.border,d,f,c.data),o.__maxMipLevel=0;return e.generateMipmaps&&!h&&this._generateMipmap(n.TEXTURE_2D,e,c.width,c.height),o.__version=e.version,o}return i.activeTexture(t),i.bindTexture(n.TEXTURE_2D,o.__webglTexture),o}setTextureCube(e,t){const n=this._gl,i=this._state,s=this._capabilities,r=this._constants;t!==void 0&&(t=n.TEXTURE0+t);const o=this.get(e);if(e.images.length===6&&o.__version!==e.version&&(!e.images[0].rtt||t===void 0)&&!o.__external){o.__webglTexture===void 0&&(e.addEventListener("dispose",this._onTextureDispose),o.__webglTexture=n.createTexture()),i.activeTexture(t),i.bindTexture(n.TEXTURE_CUBE_MAP,o.__webglTexture);const c=[];let l=!1;for(let _=0;_<6;_++){let v=e.images[_];const m=Ui(v);m&&(v=Oi(v,s.maxTextureSize),Ni(e)&&Ft(v)===!1&&s.version<2&&(v=Ii(v))),!Ft(v)&&s.version<2&&(l=!0),c[_]=v,v.__isDom=m}this._setPixelStores(e),this._setTextureParameters(e,l);const h=r.getGLFormat(e.format),d=r.getGLType(e.type),f=e.internalformat!==null?r.getGLInternalFormat(e.internalformat):Bt(n,s,h,d),u=e.mipmaps;let p;for(let _=0;_<6;_++){const v=c[_];if(v.__isDom)if(u.length>0&&!l){for(let M=0,A=u.length;M<A;M++)p=u[M][_],n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+_,M,f,h,d,p);o.__maxMipLevel=u.length-1,e.generateMipmaps=!1}else n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+_,0,f,h,d,v),o.__maxMipLevel=0;else if(u.length>0&&!l){const M=v.isCompressed;for(let A=0,T=u.length;A<T;A++)p=u[A][_],M?n.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+_,A,f,p.width,p.height,0,p.data):n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+_,A,f,p.width,p.height,e.border,h,d,p.data);o.__maxMipLevel=u.length-1,e.generateMipmaps=!1}else n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+_,0,f,v.width,v.height,e.border,h,d,v.data),o.__maxMipLevel=0}return e.generateMipmaps&&!l&&this._generateMipmap(n.TEXTURE_CUBE_MAP,e,c[0].width,c[0].height),o.__version=e.version,o}return i.activeTexture(t),i.bindTexture(n.TEXTURE_CUBE_MAP,o.__webglTexture),o}setTexture3D(e,t){const n=this._gl,i=this._state,s=this._capabilities,r=this._constants;if(s.version<2){console.warn("Try to use Texture3D but browser not support WebGL2.0");return}t!==void 0&&(t=n.TEXTURE0+t);const o=this.get(e);if(e.image&&o.__version!==e.version&&!o.__external){o.__webglTexture===void 0&&(e.addEventListener("dispose",this._onTextureDispose),o.__webglTexture=n.createTexture()),i.activeTexture(t),i.bindTexture(n.TEXTURE_3D,o.__webglTexture),this._setPixelStores(e),this._setTextureParameters(e,!1);const c=e.image,l=r.getGLFormat(e.format),h=r.getGLType(e.type),d=e.internalformat!==null?r.getGLInternalFormat(e.internalformat):Bt(n,s,l,h);return n.texImage3D(n.TEXTURE_3D,0,d,c.width,c.height,c.depth,e.border,l,h,c.data),e.generateMipmaps&&this._generateMipmap(n.TEXTURE_3D,e,c.width,c.height),o.__version=e.version,o}return i.activeTexture(t),i.bindTexture(n.TEXTURE_3D,o.__webglTexture),o}setTexture2DArray(e,t){const n=this._gl,i=this._state,s=this._capabilities,r=this._constants;if(s.version<2){console.warn("Try to use Texture2DArray but browser not support WebGL2.0");return}t!==void 0&&(t=n.TEXTURE0+t);const o=this.get(e);if(e.image&&o.__version!==e.version&&!o.__external){o.__webglTexture===void 0&&(e.addEventListener("dispose",this._onTextureDispose),o.__webglTexture=n.createTexture()),i.activeTexture(t),i.bindTexture(n.TEXTURE_2D_ARRAY,o.__webglTexture),this._setPixelStores(e),this._setTextureParameters(e,!1);const c=e.image,l=r.getGLFormat(e.format),h=r.getGLType(e.type),d=e.internalformat!==null?r.getGLInternalFormat(e.internalformat):Bt(n,s,l,h);if(e.layerUpdates.size>0){for(const f of e.layerUpdates){const u=Po(c.width,c.height,e.format,e.type),p=c.data.subarray(f*u/c.data.BYTES_PER_ELEMENT,(f+1)*u/c.data.BYTES_PER_ELEMENT);n.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,f,c.width,c.height,1,l,h,p)}e.layerUpdates.clear()}else n.texImage3D(n.TEXTURE_2D_ARRAY,0,d,c.width,c.height,c.depth,e.border,l,h,c.data);return e.generateMipmaps&&this._generateMipmap(n.TEXTURE_2D_ARRAY,e,c.width,c.height),o.__version=e.version,o}return i.activeTexture(t),i.bindTexture(n.TEXTURE_2D_ARRAY,o.__webglTexture),o}setTextureExternal(e,t){const n=this._gl,i=this.get(e);i.__external||(i.__webglTexture?n.deleteTexture(i.__webglTexture):e.addEventListener("dispose",this._onTextureDispose)),i.__webglTexture=t,i.__external=!0}_setPixelStores(e){const t=this._gl;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,e.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,e.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,e.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,t.NONE)}_setTextureParameters(e,t){const n=this._gl,i=this._capabilities,s=this._wrappingToGL,r=this._filterToGL;let o=n.TEXTURE_2D;e.isTextureCube&&(o=n.TEXTURE_CUBE_MAP),e.isTexture3D&&(o=n.TEXTURE_3D),e.isTexture2DArray&&(o=n.TEXTURE_2D_ARRAY);let c=e.wrapS,l=e.wrapT,h=e.wrapR,d=e.magFilter,f=e.minFilter;t&&(c=J.CLAMP_TO_EDGE,l=J.CLAMP_TO_EDGE,e.isTexture3D&&(h=J.CLAMP_TO_EDGE),(e.wrapS!==J.CLAMP_TO_EDGE||e.wrapT!==J.CLAMP_TO_EDGE)&&console.warn("Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to t3d.TEXTURE_WRAP.CLAMP_TO_EDGE.",e),d=Di(e.magFilter),f=Di(e.minFilter),(e.minFilter!==P.NEAREST&&e.minFilter!==P.LINEAR||e.magFilter!==P.NEAREST&&e.magFilter!==P.LINEAR)&&console.warn("Texture is not power of two. Texture.minFilter and Texture.magFilter should be set to t3d.TEXTURE_FILTER.NEAREST or t3d.TEXTURE_FILTER.LINEAR.",e)),n.texParameteri(o,n.TEXTURE_WRAP_S,s[c]),n.texParameteri(o,n.TEXTURE_WRAP_T,s[l]),e.isTexture3D&&n.texParameteri(o,n.TEXTURE_WRAP_R,s[h]),n.texParameteri(o,n.TEXTURE_MAG_FILTER,r[d]),n.texParameteri(o,n.TEXTURE_MIN_FILTER,r[f]);const u=i.anisotropyExt;u&&n.texParameterf(o,u.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(e.anisotropy,i.maxAnisotropy)),i.version>=2&&(e.compare!==void 0?(n.texParameteri(o,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(o,n.TEXTURE_COMPARE_FUNC,e.compare)):n.texParameteri(o,n.TEXTURE_COMPARE_MODE,n.NONE))}_generateMipmap(e,t,n,i){this._gl.generateMipmap(e);const r=this.get(t);r.__maxMipLevel=Math.log(Math.max(n,i))*Math.LOG2E}}function Ni(a){return a.wrapS!==J.CLAMP_TO_EDGE||a.wrapT!==J.CLAMP_TO_EDGE||a.minFilter!==P.NEAREST&&a.minFilter!==P.LINEAR}function Di(a){return a===P.NEAREST||a===P.NEAREST_MIPMAP_LINEAR||a===P.NEAREST_MIPMAP_NEAREST?P.NEAREST:P.LINEAR}function Ft(a){return y.isPowerOfTwo(a.width)&&y.isPowerOfTwo(a.height)}function Ii(a){if(a instanceof HTMLImageElement||a instanceof HTMLCanvasElement){const e=document.createElementNS("http://www.w3.org/1999/xhtml","canvas");return e.width=y.nearestPowerOfTwo(a.width),e.height=y.nearestPowerOfTwo(a.height),e.getContext("2d").drawImage(a,0,0,e.width,e.height),console.warn("image is not power of two ("+a.width+"x"+a.height+"). Resized to "+e.width+"x"+e.height,a),e}return a}function Oi(a,e){if(a.width>e||a.height>e){const t=e/Math.max(a.width,a.height),n=document.createElementNS("http://www.w3.org/1999/xhtml","canvas");return n.width=Math.floor(a.width*t),n.height=Math.floor(a.height*t),n.getContext("2d").drawImage(a,0,0,a.width,a.height,0,0,n.width,n.height),console.warn("image is too big ("+a.width+"x"+a.height+"). Resized to "+n.width+"x"+n.height,a),n}return a}function Bt(a,e,t,n){if(e.version>=2===!1)return t;let s=t;return t===a.RED&&(n===a.FLOAT&&(s=a.R32F),n===a.HALF_FLOAT&&(s=a.R16F),n===a.UNSIGNED_BYTE&&(s=a.R8)),t===a.RG&&(n===a.FLOAT&&(s=a.RG32F),n===a.HALF_FLOAT&&(s=a.RG16F),n===a.UNSIGNED_BYTE&&(s=a.RG8)),t===a.RGB&&(n===a.FLOAT&&(s=a.RGB32F),n===a.HALF_FLOAT&&(s=a.RGB16F),n===a.UNSIGNED_BYTE&&(s=a.RGB8)),t===a.RGBA&&(n===a.FLOAT&&(s=a.RGBA32F),n===a.HALF_FLOAT&&(s=a.RGBA16F),n===a.UNSIGNED_BYTE&&(s=a.RGBA8),n===a.UNSIGNED_SHORT_4_4_4_4&&(s=a.RGBA4),n===a.UNSIGNED_SHORT_5_5_5_1&&(s=a.RGB5_A1)),(t===a.DEPTH_COMPONENT||t===a.DEPTH_STENCIL)&&(s=a.DEPTH_COMPONENT16,n===a.FLOAT&&(s=a.DEPTH_COMPONENT32F),n===a.UNSIGNED_INT&&(s=a.DEPTH_COMPONENT24),n===a.UNSIGNED_INT_24_8&&(s=a.DEPTH24_STENCIL8),n===a.FLOAT_32_UNSIGNED_INT_24_8_REV&&(s=a.DEPTH32F_STENCIL8)),(s===a.R16F||s===a.R32F||s===a.RG16F||s===a.RG32F||s===a.RGB16F||s===a.RGB32F||s===a.RGBA16F||s===a.RGBA32F)&&e.getExtension("EXT_color_buffer_float"),s}function Ui(a){return typeof HTMLImageElement<"u"&&a instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&a instanceof HTMLCanvasElement||typeof HTMLVideoElement<"u"&&a instanceof HTMLVideoElement||typeof ImageBitmap<"u"&&a instanceof ImageBitmap}function Po(a,e,t,n){const i=Lo(n);switch(t){case E.ALPHA:return a*e;case E.LUMINANCE:return a*e;case E.LUMINANCE_ALPHA:return a*e*2;case E.RED:return a*e/i.components*i.byteLength;case E.RED_INTEGER:return a*e/i.components*i.byteLength;case E.RG:return a*e*2/i.components*i.byteLength;case E.RG_INTEGER:return a*e*2/i.components*i.byteLength;case E.RGB:return a*e*3/i.components*i.byteLength;case E.RGBA:return a*e*4/i.components*i.byteLength;case E.RGBA_INTEGER:return a*e*4/i.components*i.byteLength;case E.RGB_S3TC_DXT1:case E.RGBA_S3TC_DXT1:return Math.floor((a+3)/4)*Math.floor((e+3)/4)*8;case E.RGBA_S3TC_DXT3:case E.RGBA_S3TC_DXT5:return Math.floor((a+3)/4)*Math.floor((e+3)/4)*16;case E.RGB_PVRTC_2BPPV1:case E.RGBA_PVRTC_2BPPV1:return Math.max(a,16)*Math.max(e,8)/4;case E.RGB_PVRTC_4BPPV1:case E.RGBA_PVRTC_4BPPV1:return Math.max(a,8)*Math.max(e,8)/2;case E.RGB_ETC1:return Math.floor((a+3)/4)*Math.floor((e+3)/4)*8;case E.RGBA_ASTC_4x4:return Math.floor((a+3)/4)*Math.floor((e+3)/4)*16;case E.RGBA_BPTC:return Math.ceil(a/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}const ie={byteLength:0,components:0};function Lo(a){switch(a){case N.UNSIGNED_BYTE:case N.ByteType:return ie.byteLength=1,ie.components=1,ie;case N.UNSIGNED_SHORT:case N.SHORT:case N.HALF_FLOAT:return ie.byteLength=2,ie.components=1,ie;case N.UNSIGNED_SHORT_4_4_4_4:case N.UNSIGNED_SHORT_5_5_5_1:return ie.byteLength=2,ie.components=4,ie;case N.UNSIGNED_INT:case N.INT:case N.FLOAT:return ie.byteLength=4,ie.components=1,ie}throw new Error(`Unknown texture type ${a}.`)}class bo extends Re{constructor(e,t,n,i){super(e),this._gl=t,this._capabilities=n,this._constants=i;const s=this;function r(o){const c=o.target;c.removeEventListener("dispose",r);const l=s.get(c);l.__webglRenderbuffer&&!l.__external&&t.deleteRenderbuffer(l.__webglRenderbuffer),s.delete(c)}this._onRenderBufferDispose=r}setRenderBuffer(e){const t=this._gl,n=this._capabilities,i=this._constants,s=this.get(e);if(s.__webglRenderbuffer===void 0){e.addEventListener("dispose",this._onRenderBufferDispose),s.__webglRenderbuffer=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,s.__webglRenderbuffer);const r=i.getGLInternalFormat(e.format);e.multipleSampling>0?(n.version<2&&console.error("render buffer multipleSampling is not support in webgl 1.0."),t.renderbufferStorageMultisample(t.RENDERBUFFER,Math.min(e.multipleSampling,n.maxSamples),r,e.width,e.height)):t.renderbufferStorage(t.RENDERBUFFER,r,e.width,e.height)}else t.bindRenderbuffer(t.RENDERBUFFER,s.__webglRenderbuffer);return s}setRenderBufferExternal(e,t){const n=this._gl,i=this.get(e);i.__external||(i.__webglRenderbuffer?n.deleteRenderbuffer(i.__webglRenderbuffer):e.addEventListener("dispose",this._onRenderBufferDispose)),i.__webglRenderbuffer=t,i.__external=!0}}class No extends Re{constructor(e,t,n,i,s,r,o){super(e),this._gl=t,this._state=n,this._capabilities=i,this._textures=s,this._renderBuffers=r,this._constants=o;const c=this;function l(h){const d=h.target;d.removeEventListener("dispose",l);const f=c.get(d);f.__webglFramebuffer&&t.deleteFramebuffer(f.__webglFramebuffer),f.__readBuffer&&t.deleteBuffer(f.__readBuffer),c.delete(d),n.currentRenderTarget===d&&(n.currentRenderTarget=null)}this._onRenderTargetDispose=l}_setupRenderTarget(e){const t=this._gl,n=this._state,i=this._textures,s=this._renderBuffers,r=this._capabilities,o=this.get(e);e.addEventListener("dispose",this._onRenderTargetDispose);const c=t.createFramebuffer(),l=[];o.__webglFramebuffer=c,o.__drawBuffers=l,e.isRenderTargetCube&&(o.__currentActiveCubeFace=e.activeCubeFace,o.__currentActiveMipmapLevel=e.activeMipmapLevel),(e.isRenderTarget3D||e.isRenderTarget2DArray)&&(o.__currentActiveLayer=e.activeLayer,o.__currentActiveMipmapLevel=e.activeMipmapLevel),t.bindFramebuffer(t.FRAMEBUFFER,c);for(const h in e._attachments){const d=Tn[h];d===t.DEPTH_ATTACHMENT||d===t.DEPTH_STENCIL_ATTACHMENT?r.version<2&&!r.getExtension("WEBGL_depth_texture")&&console.warn("WebGLRenderTargets: extension WEBGL_depth_texture is not support."):d!==t.STENCIL_ATTACHMENT&&l.push(d);const f=e._attachments[h];if(f.isTexture2D){const u=i.setTexture2D(f);t.framebufferTexture2D(t.FRAMEBUFFER,d,t.TEXTURE_2D,u.__webglTexture,0),n.bindTexture(t.TEXTURE_2D,null)}else if(f.isTextureCube){const u=i.setTextureCube(f);t.framebufferTexture2D(t.FRAMEBUFFER,d,t.TEXTURE_CUBE_MAP_POSITIVE_X+e.activeCubeFace,u.__webglTexture,e.activeMipmapLevel),n.bindTexture(t.TEXTURE_CUBE_MAP,null)}else if(f.isTexture3D){const u=i.setTexture3D(f);t.framebufferTextureLayer(t.FRAMEBUFFER,d,u.__webglTexture,e.activeMipmapLevel,e.activeLayer),n.bindTexture(t.TEXTURE_3D,null)}else if(f.isTexture2DArray){const u=i.setTexture2DArray(f);t.framebufferTextureLayer(t.FRAMEBUFFER,d,u.__webglTexture,e.activeMipmapLevel,e.activeLayer),n.bindTexture(t.TEXTURE_2D_ARRAY,null)}else{const u=s.setRenderBuffer(f);t.framebufferRenderbuffer(t.FRAMEBUFFER,d,t.RENDERBUFFER,u.__webglRenderbuffer)}}l.sort(Do),r.version>=2?t.drawBuffers(l):r.getExtension("WEBGL_draw_buffers")&&r.getExtension("WEBGL_draw_buffers").drawBuffersWEBGL(l)}setRenderTarget(e){const t=this._gl,n=this._state,i=this._textures;let s;if(n.currentRenderTarget!==e&&(e.isRenderTargetBack?t.bindFramebuffer(t.FRAMEBUFFER,null):(s=this.get(e),s.__webglFramebuffer===void 0?this._setupRenderTarget(e):t.bindFramebuffer(t.FRAMEBUFFER,s.__webglFramebuffer)),n.currentRenderTarget=e),e.isRenderTargetCube){s=this.get(e);const r=e.activeCubeFace,o=e.activeMipmapLevel;if(s.__currentActiveCubeFace!==r||s.__currentActiveMipmapLevel!==o){for(const c in e._attachments){const l=e._attachments[c];if(l.isTextureCube){const h=i.get(l);t.framebufferTexture2D(t.FRAMEBUFFER,Tn[c],t.TEXTURE_CUBE_MAP_POSITIVE_X+r,h.__webglTexture,o)}}s.__currentActiveCubeFace=r,s.__currentActiveMipmapLevel=o}}if(e.isRenderTarget3D||e.isRenderTarget2DArray){s=this.get(e);const r=e.activeLayer,o=e.activeMipmapLevel;if(s.__currentActiveLayer!==r||s.__currentActiveMipmapLevel!==o){for(const c in e._attachments){const l=e._attachments[c];if(l.isTexture3D||l.isTexture2DArray){const h=i.get(l);t.framebufferTextureLayer(t.FRAMEBUFFER,Tn[c],h.__webglTexture,o,r)}}s.__currentActiveLayer=r,s.__currentActiveMipmapLevel=o}}}blitRenderTarget(e,t,n=!0,i=!0,s=!0){const r=this._gl,o=this._capabilities;if(o.version<2){console.warn("WebGLRenderTargets: blitFramebuffer not support by WebGL"+o.version);return}const c=this.get(e).__webglFramebuffer,l=this.get(t).__webglFramebuffer;r.bindFramebuffer(r.READ_FRAMEBUFFER,c),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,l);let h=0;n&&(h|=r.COLOR_BUFFER_BIT),i&&(h|=r.DEPTH_BUFFER_BIT),s&&(h|=r.STENCIL_BUFFER_BIT),r.blitFramebuffer(0,0,e.width,e.height,0,0,t.width,t.height,h,r.NEAREST)}readRenderTargetPixels(e,t,n,i,s){const r=this._gl,o=this._state,c=this._constants,l=o.currentRenderTarget;if(l&&l.texture){if(e>=0&&e<=l.width-n&&t>=0&&t<=l.height-i){const h=c.getGLType(l.texture.type),d=c.getGLFormat(l.texture.format);r.readPixels(e,t,n,i,d,h,s)}}else console.warn("WebGLRenderTargets.readRenderTargetPixels: readPixels from renderTarget failed. Framebuffer not bound or texture not attached.")}readRenderTargetPixelsAsync(e,t,n,i,s){const r=this._gl,o=this._state,c=this._constants,l=o.currentRenderTarget;if(l&&l.texture)if(e>=0&&e<=l.width-n&&t>=0&&t<=l.height-i){const h=this.get(l);h.__readBuffer===void 0&&(h.__readBuffer=r.createBuffer()),r.bindBuffer(r.PIXEL_PACK_BUFFER,h.__readBuffer),r.bufferData(r.PIXEL_PACK_BUFFER,s.byteLength,r.STREAM_READ);const d=c.getGLType(l.texture.type),f=c.getGLFormat(l.texture.format);return r.readPixels(e,t,n,i,f,d,0),Oo(r).then(()=>h.__readBuffer?(r.bindBuffer(r.PIXEL_PACK_BUFFER,h.__readBuffer),r.getBufferSubData(r.PIXEL_PACK_BUFFER,0,s),r.bindBuffer(r.PIXEL_PACK_BUFFER,null),s):Promise.reject("Read Buffer is not valid."))}else return Promise.resolve(s);else return console.warn("WebGLRenderTargets.readRenderTargetPixelsAsync: readPixels from renderTarget failed. Framebuffer not bound or texture not attached."),Promise.reject()}updateRenderTargetMipmap(e){const t=this._gl,n=this._state,i=this._capabilities,s=e.texture;if(s.generateMipmaps&&s.minFilter!==P.NEAREST&&s.minFilter!==P.LINEAR&&(Io(e)||i.version>=2)){let r=t.TEXTURE_2D;s.isTextureCube&&(r=t.TEXTURE_CUBE_MAP),s.isTexture3D&&(r=t.TEXTURE_3D);const o=this._textures.get(s).__webglTexture;n.bindTexture(r,o),t.generateMipmap(r),n.bindTexture(r,null)}}}const Tn={[C.COLOR_ATTACHMENT0]:36064,[C.COLOR_ATTACHMENT1]:36065,[C.COLOR_ATTACHMENT2]:36066,[C.COLOR_ATTACHMENT3]:36067,[C.COLOR_ATTACHMENT4]:36068,[C.COLOR_ATTACHMENT5]:36069,[C.COLOR_ATTACHMENT6]:36070,[C.COLOR_ATTACHMENT7]:36071,[C.COLOR_ATTACHMENT8]:36072,[C.COLOR_ATTACHMENT9]:36073,[C.COLOR_ATTACHMENT10]:36074,[C.COLOR_ATTACHMENT11]:36075,[C.COLOR_ATTACHMENT12]:36076,[C.COLOR_ATTACHMENT13]:36077,[C.COLOR_ATTACHMENT14]:36078,[C.COLOR_ATTACHMENT15]:36079,[C.DEPTH_ATTACHMENT]:36096,[C.STENCIL_ATTACHMENT]:36128,[C.DEPTH_STENCIL_ATTACHMENT]:33306};function Do(a,e){return a-e}function Io(a){return y.isPowerOfTwo(a.width)&&y.isPowerOfTwo(a.height)}function Oo(a){const e=a.fenceSync(a.SYNC_GPU_COMMANDS_COMPLETE,0);return a.flush(),new Promise(function(t,n){function i(){const s=a.clientWaitSync(e,a.SYNC_FLUSH_COMMANDS_BIT,0);if(s===a.WAIT_FAILED){a.deleteSync(e),n();return}if(s===a.TIMEOUT_EXPIRED){requestAnimationFrame(i);return}a.deleteSync(e),t()}i()})}class Uo extends Re{constructor(e,t,n){super(e),this._gl=t,this._capabilities=n}setBuffer(e,t,n){const i=this.get(e),s=i.glBuffer===void 0;!s&&i.version===e.version||(n&&n.reset(),s||i.__external?this._createGLBuffer(i,e,t):(this._updateGLBuffer(i.glBuffer,e,t),i.version=e.version))}removeBuffer(e){const t=this._gl,n=this.get(e);n.glBuffer&&!n.__external&&t.deleteBuffer(n.glBuffer),this.delete(e)}setBufferExternal(e,t){const n=this._gl,i=this.get(e);i.__external||i.glBuffer&&n.deleteBuffer(i.glBuffer);const s=Fi(n,e.array);i.glBuffer=t,i.type=s,i.bytesPerElement=e.array.BYTES_PER_ELEMENT,i.version=e.version,i.__external=!0}_createGLBuffer(e,t,n){const i=this._gl,s=t.array,r=t.usage,o=i.createBuffer();i.bindBuffer(n,o),i.bufferData(n,s,r),t.onUploadCallback();const c=Fi(i,s);e.glBuffer=o,e.type=c,e.bytesPerElement=s.BYTES_PER_ELEMENT,e.version=t.version,e.__external=!1}_updateGLBuffer(e,t,n){const i=this._gl,s=this._capabilities,r=t.array,o=t.updateRange;i.bindBuffer(n,e),o.count===-1?i.bufferSubData(n,0,r):(s.version>=2?i.bufferSubData(n,o.offset*r.BYTES_PER_ELEMENT,r,o.offset,o.count):i.bufferSubData(n,o.offset*r.BYTES_PER_ELEMENT,r.subarray(o.offset,o.offset+o.count)),o.count=-1)}}function Fi(a,e){let t;return e instanceof Float32Array?t=a.FLOAT:e instanceof Float64Array?console.warn("Unsupported data buffer format: Float64Array."):e instanceof Uint16Array?t=a.UNSIGNED_SHORT:e instanceof Int16Array?t=a.SHORT:e instanceof Uint32Array?t=a.UNSIGNED_INT:e instanceof Int32Array?t=a.INT:e instanceof Int8Array?t=a.BYTE:e instanceof Uint8Array?t=a.UNSIGNED_BYTE:t=a.FLOAT,t}class Fo extends Re{constructor(e,t,n){super(e);const i=this;function s(r){const o=r.target,c=i.get(o);o.removeEventListener("dispose",s);const l=c.programList;if(l!==void 0)for(let h=0,d=l.length;h<d;h++){const f=l[h];n.releaseByProgram(f),t.releaseProgram(f)}i.delete(o)}this._onMaterialDispose=s,this._programs=t,this._vertexArrayBindings=n}setMaterial(e){const t=this.get(e);return t.programList===void 0&&(e.addEventListener("dispose",this._onMaterialDispose),t.programList=[]),t}updateProgram(e,t,n,i){const s=this._programs,r=this._vertexArrayBindings,o=this.get(e),c=s.generateProps(e,t,n),l=s.generateProgramCode(c,e),h=o.programList;let d=Bo(h,l);if(d===null&&(d=s.getProgram(e,c,l,i),h.unshift(d),h.length>i.maxMaterialPrograms)){const f=h.pop();r.releaseByProgram(f),s.releaseProgram(f)}o.currentProgram=d}}function Bo(a,e){let t=0,n=null;for(let i=a.length;t<i;t++){const s=a[t];if(s.code===e){n=s;break}}if(n!==null&&t>0){for(let i=t;i>0;i--)a[i]=a[i-1];a[0]=n}return n}const Sn="";class zo extends Re{constructor(e,t,n,i){super(e),this._gl=t,this._capabilities=n,this._buffers=i,this._isWebGL2=n.version>=2,this._vaoExt=n.getExtension("OES_vertex_array_object"),this._vaoCache={},this._currentGeometryProgram="",this._currentVAO=null}setup(e,t,n){if(e.morphTargetInfluences)this.reset(),this._setupVertexAttributes(n,t),this._currentGeometryProgram=Sn;else if(this._isWebGL2||this._vaoExt){const i=this.get(t);i._vaos===void 0&&(i._vaos={},this._vaoCache[t.id]=i._vaos);let s=i._vaos[n.id];s||(s=i._vaos[n.id]={version:-1,object:this._createVAO()}),this._bindVAO(s.object),s.version!==t.version&&(this._setupVertexAttributes(n,t),s.version=t.version)}else{const i=n.id+"_"+t.id+"_"+t.version;i!==this._currentGeometryProgram&&(this._setupVertexAttributes(n,t),this._currentGeometryProgram=i)}}releaseByGeometry(e){const t=this.get(e),n=t._vaos;if(n){for(const i in n){const s=n[i];s&&this._disposeVAO(s.object)}delete t._vaos,delete this._vaoCache[e.id]}}releaseByProgram(e){for(const t in this._vaoCache){const n=this._vaoCache[t];if(n){const i=n[e.id];if(!i)continue;this._disposeVAO(i.object),delete n[e.id]}}}reset(e){(this._currentVAO!==null||e)&&(this._isWebGL2?this._gl.bindVertexArray(null):this._vaoExt&&this._vaoExt.bindVertexArrayOES(null),this._currentVAO=null),this._currentGeometryProgram!==Sn&&(this._currentGeometryProgram=Sn)}_createVAO(){return this._isWebGL2?this._gl.createVertexArray():this._vaoExt?this._vaoExt.createVertexArrayOES():null}_bindVAO(e){this._currentVAO!==e&&(this._isWebGL2?this._gl.bindVertexArray(e):this._vaoExt&&this._vaoExt.bindVertexArrayOES(e),this._currentVAO=e)}_disposeVAO(e){this._isWebGL2?this._gl.deleteVertexArray(e):this._vaoExt&&this._vaoExt.deleteVertexArrayOES(e)}_setupVertexAttributes(e,t){const n=this._gl,i=this._isWebGL2,s=e.getAttributes(),r=this._capabilities,o=this._buffers;for(const c in s){const l=s[c],h=t.getAttribute(c);if(h){const d=h.size;l.count!==d&&console.warn("WebGLVertexArrayBindings: attribute "+c+" size not match! "+l.count+" : "+d);const f=h.buffer,u=o.get(f),p=u.type,_=i&&(l.format===n.INT||l.format===n.UNSIGNED_INT);for(let w=0,R=l.locationSize;w<R;w++)n.enableVertexAttribArray(l.location+w);if(h.divisor>0)for(let w=0,R=l.locationSize;w<R;w++)i?n.vertexAttribDivisor(l.location+w,h.divisor):r.getExtension("ANGLE_instanced_arrays")?r.getExtension("ANGLE_instanced_arrays").vertexAttribDivisorANGLE(l.location+w,h.divisor):console.warn("vertexAttribDivisor not supported");const v=u.bytesPerElement,m=u.glBuffer,M=f.stride,A=h.offset,T=h.normalized;if(n.bindBuffer(n.ARRAY_BUFFER,m),l.count===M&&l.locationSize===1)this._vertexAttribPointer(l.location,l.count,p,T,0,0,_);else for(let w=0;w<l.locationSize;w++)this._vertexAttribPointer(l.location+w,l.count/l.locationSize,p,T,v*M,v*(A+l.count/l.locationSize*w),_)}}if(t.index){const c=o.get(t.index.buffer);n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,c.glBuffer)}}_vertexAttribPointer(e,t,n,i,s,r,o){const c=this._gl;o?c.vertexAttribIPointer(e,t,n,s,r):c.vertexAttribPointer(e,t,n,i,s,r)}}const Go=new ae,zt=new U,En=new WeakMap,xn=new Float32Array(8),Ke={map:null,diffuse:1,specular:1};let Mn=new Float32Array([]);function Ho(a){return a.geometry}function Vo(a){return a.material}function ko(a){return!0}class zn extends Ks{constructor(e){super(e),this.capabilities={},this._textures=null,this._renderBuffers=null,this._renderTargets=null,this._buffers=null,this._geometries=null,this._programs=null,this._materials=null,this._state=null,this._vertexArrayBindings=null,this._queries=null,this.init(),this._currentMaterial=null}init(){const e=this.context,t=`_gl${this.increaseId()}`,n=new eo(e),i=new Mo(e,n),s=new Co(e,n),r=new Ro(t,e,s,n,i),o=new bo(t,e,n,i),c=new No(t,e,s,n,r,o,i),l=new Uo(t,e,n),h=new zo(t,e,n,l),d=new io(t,e,l,h),f=new po(e,s,n),u=new Fo(t,f,h),p=new xo(t,e,n);this.capabilities=n,this._textures=r,this._renderBuffers=o,this._renderTargets=c,this._buffers=l,this._geometries=d,this._programs=f,this._materials=u,this._state=s,this._vertexArrayBindings=h,this._queries=p}endRender(){super.endRender(),this._currentMaterial=null;const e=this._state;e.depthBuffer.setTest(!0),e.depthBuffer.setMask(!0),e.colorBuffer.setMask(!0)}clear(e,t,n){const i=this.context;let s=0;(e===void 0||e)&&(s|=i.COLOR_BUFFER_BIT),(t===void 0||t)&&(s|=i.DEPTH_BUFFER_BIT),(n===void 0||n)&&(s|=i.STENCIL_BUFFER_BIT),s>0&&i.clear(s)}setClearColor(e,t,n,i,s){this._state.colorBuffer.setClear(e,t,n,i,s)}getClearColor(){return this._state.colorBuffer.getClear()}setRenderTarget(e){this._renderTargets.setRenderTarget(e)}getRenderTarget(){return this._state.currentRenderTarget}blitRenderTarget(e,t,n=!0,i=!0,s=!0){this._renderTargets.blitRenderTarget(e,t,n,i,s)}readRenderTargetPixels(e,t,n,i,s){return this.asyncReadPixel?this._renderTargets.readRenderTargetPixelsAsync(e,t,n,i,s):(this._renderTargets.readRenderTargetPixels(e,t,n,i,s),Promise.resolve(s))}updateRenderTargetMipmap(e){this._renderTargets.updateRenderTargetMipmap(e)}setTextureExternal(e,t){this._textures.setTextureExternal(e,t)}setRenderBufferExternal(e,t){this._renderBuffers.setRenderBufferExternal(e,t)}setBufferExternal(e,t){this._buffers.setBufferExternal(e,t)}resetVertexArrayBindings(e){this._vertexArrayBindings.reset(e)}resetState(){this._state.reset()}beginQuery(e,t){this._queries.begin(e,t)}endQuery(e){this._queries.end(e)}queryCounter(e){this._queries.counter(e)}isTimerQueryDisjoint(e){return this._queries.isTimerDisjoint(e)}isQueryResultAvailable(e){return this._queries.isResultAvailable(e)}getQueryResult(e){return this._queries.getResult(e)}renderRenderableItem(e,t,n){const i=this._state,s=this.capabilities,r=this._vertexArrayBindings,o=this._textures,c=this._passInfo,l=n.getGeometry||Ho,h=n.getMaterial||Vo,d=n.beforeRender,f=n.afterRender,u=n.ifRender||ko,p=n.renderInfo,_=t.scene,v=t.lights,m=t.camera,M=i.currentRenderTarget;if(!u(e))return;if(!c.enabled){console.warn("WebGLRenderer: beginRender must be called before renderRenderableItem.");return}const A=e.object,T=h.call(this,e),w=l.call(this,e),R=e.group,O=T.fog?_.fog:null;Ke.map=T.envMap!==void 0?T.envMap||_.environment:null,Ke.diffuse=_.envDiffuseIntensity*T.envMapIntensity,Ke.specular=_.envSpecularIntensity*T.envMapIntensity;let F=_.clippingPlanesData,I=_.numClippingPlanes;T.clippingPlanes&&T.clippingPlanes.length>0&&(Mn.length<T.clippingPlanes.length*4&&(Mn=new Float32Array(T.clippingPlanes.length*4)),F=_.setClippingPlanesData(T.clippingPlanes,Mn),I=T.clippingPlanes.length),A.onBeforeRender(e,T),d&&d.call(this,e,T);const L=this._materials.setMaterial(T);if(T.needsUpdate===!1)if(L.currentProgram===void 0)T.needsUpdate=!0;else if(L.fog!==O)T.needsUpdate=!0;else if(L.envMap!==Ke.map)T.needsUpdate=!0;else if(L.numClippingPlanes!==I)T.needsUpdate=!0;else if(L.logarithmicDepthBuffer!==_.logarithmicDepthBuffer)T.needsUpdate=!0;else if(t.outputEncoding!==L.outputEncoding||t.gammaFactor!==L.gammaFactor)T.needsUpdate=!0;else if(s.version>1&&_.disableShadowSampler!==L.disableShadowSampler)T.needsUpdate=!0;else{const Z=T.acceptLight&&v.totalNum>0;(Z!==L.acceptLight||Z&&(!v.hash.compare(L.lightsHash)||A.receiveShadow!==L.receiveShadow||A.shadowType!==L.shadowType))&&(T.needsUpdate=!0)}T.needsUpdate&&(this._materials.updateProgram(T,A,t,this.shaderCompileOptions),L.fog=O,L.envMap=Ke.map,L.logarithmicDepthBuffer=_.logarithmicDepthBuffer,L.acceptLight=T.acceptLight,L.lightsHash=v.hash.copyTo(L.lightsHash),L.receiveShadow=A.receiveShadow,L.shadowType=A.shadowType,L.numClippingPlanes=I,L.outputEncoding=t.outputEncoding,L.gammaFactor=t.gammaFactor,L.disableShadowSampler=_.disableShadowSampler,T.needsUpdate=!1);const x=L.currentProgram;if(n.onlyCompile||!x.isReady(s.parallelShaderCompileExt))return;i.setProgram(x),this._geometries.setGeometry(w,c),A.morphTargetInfluences&&this._updateMorphtargets(A,w,x),r.setup(A,w,x);let D=!1;(x.lightId!==v.id||x.lightVersion!==v.version)&&(D=!0,x.lightId=v.id,x.lightVersion=v.version);let Q=!1;(x.cameraId!==m.id||x.cameraVersion!==m.version)&&(Q=!0,x.cameraId=m.id,x.cameraVersion=m.version);let Y=!1;(x.sceneId!==_.id||x.sceneVersion!==_.version)&&(Y=!0,x.sceneId=_.id,x.sceneVersion=_.version);let ee=!0;T.forceUpdateUniforms||(L.pass!==c.count?L.pass=c.count:ee=this._currentMaterial!==T),this._currentMaterial=T;const G=x.getUniforms();T.acceptLight&&this._uploadLights(G,v,_.disableShadowSampler,D),A.isSkinnedMesh&&this._uploadSkeleton(G,A,_);for(let Z=0,Te=G.seq.length;Z<Te;Z++){const H=G.seq[Z],Ve=H.id,Pe=H.internalGroup;if(T.uniforms&&T.uniforms[Ve]!==void 0){H.set(T.uniforms[Ve],o);continue}if(Pe===1){let Le=A.worldMatrix;_.useAnchorMatrix&&(Le=zt.copy(Le).premultiply(_.anchorMatrixInverse)),H.set(Le.elements);continue}if(Pe===2&&Q){H.internalFun(m);continue}if(Pe===3&&Y){H.internalFun(_);continue}if(Pe===4&&ee){H.internalFun(T,o);continue}if(Pe===5){H.internalFun(Ke,o);continue}if(Ve==="u_PointScale"){const Le=M.height*.5;H.set(Le)}else Ve==="clippingPlanes"&&H.set(F)}const ve=A.worldMatrix.determinant()<0;i.setMaterial(T,ve);const te=Go.set(M.width,M.height,M.width,M.height).multiply(m.rect);te.z-=te.x,te.w-=te.y,i.viewport(te.round()),this._draw(w,T,R,p),o.resetTextureUnits(),f&&f.call(this,e),A.onAfterRender(e)}_uploadLights(e,t,n,i){const s=this._textures;t.useAmbient&&i&&e.set("u_AmbientLightColor",t.ambient),t.useSphericalHarmonics&&i&&e.set("u_SphericalHarmonicsLightData",t.sh),t.hemisNum>0&&i&&e.set("u_Hemi",t.hemisphere),t.directsNum>0&&(i&&e.set("u_Directional",t.directional),t.directShadowNum>0&&(i&&e.set("u_DirectionalShadow",t.directionalShadow),e.has("directionalShadowMap")&&(this.capabilities.version>=2&&!n?e.set("directionalShadowMap",t.directionalShadowDepthMap,s):e.set("directionalShadowMap",t.directionalShadowMap,s),e.set("directionalShadowMatrix",t.directionalShadowMatrix)),e.has("directionalDepthMap")&&e.set("directionalDepthMap",t.directionalShadowMap,s))),t.pointsNum>0&&(i&&e.set("u_Point",t.point),t.pointShadowNum>0&&(i&&e.set("u_PointShadow",t.pointShadow),e.has("pointShadowMap")&&(e.set("pointShadowMap",t.pointShadowMap,s),e.set("pointShadowMatrix",t.pointShadowMatrix)))),t.spotsNum>0&&(i&&e.set("u_Spot",t.spot),t.spotShadowNum>0&&(i&&e.set("u_SpotShadow",t.spotShadow),e.has("spotShadowMap")&&(this.capabilities.version>=2&&!n?e.set("spotShadowMap",t.spotShadowDepthMap,s):e.set("spotShadowMap",t.spotShadowMap,s),e.set("spotShadowMatrix",t.spotShadowMatrix)),e.has("spotDepthMap")&&e.set("spotDepthMap",t.spotShadowMap,s))),t.rectAreaNum>0&&(i&&e.set("u_RectArea",t.rectArea),t.LTC1&&t.LTC2?(e.set("ltc_1",t.LTC1,s),e.set("ltc_2",t.LTC2,s)):console.warn("WebGLRenderer: RectAreaLight.LTC1 and LTC2 need to be set before use."))}_uploadSkeleton(e,t,n){if(t.skeleton&&t.skeleton.bones.length>0){const i=t.skeleton,s=this.capabilities;s.maxVertexTextures>0&&(s.getExtension("OES_texture_float")||s.version>=2)?(i.boneTexture===void 0&&i.generateBoneTexture(s.version>=2),e.set("boneTexture",i.boneTexture,this._textures),e.set("boneTextureSize",i.boneTexture.image.width)):e.set("boneMatrices",i.boneMatrices),e.set("bindMatrix",t.bindMatrix.elements),zt.copy(t.bindMatrixInverse),n.useAnchorMatrix&&zt.multiply(n.anchorMatrix),e.set("bindMatrixInverse",zt.elements)}}_updateMorphtargets(e,t,n){const i=e.morphTargetInfluences;En.has(t)||En.set(t,i.slice(0));const s=t.morphAttributes.position,r=t.morphAttributes.normal,o=En.get(t);for(let l=0;l<o.length;l++)o[l]!==0&&(s&&t.removeAttribute("morphTarget"+l),r&&t.removeAttribute("morphNormal"+l));for(let l=0;l<i.length;l++)o[l]=i[l];o.length=i.length;let c=0;for(let l=0;l<o.length;l++){const h=o[l];h>0&&(s&&t.addAttribute("morphTarget"+c,s[l]),r&&t.addAttribute("morphNormal"+c,r[l]),xn[c]=h,c++)}for(;c<8;c++)xn[c]=0;n.getUniforms().set("morphTargetInfluences",xn)}_draw(e,t,n,i){const s=this.context,r=this.capabilities,o=this._buffers,c=e.instanceCount,l=c>=0,h=!!n,d=h&&n.multiDrawCount!==void 0,f=e.index!==null;let u=0,p=1/0;if(!d){const _=e.getAttribute("a_Position");if(f?p=e.index.buffer.count:_&&(p=_.buffer.count),h&&(u=Math.max(u,n.start),p=Math.min(p,n.count)),p<0||p===1/0)return}if(f){const _=o.get(e.index.buffer),v=_.bytesPerElement,m=_.type;if(m===s.UNSIGNED_INT&&r.version<2&&!r.getExtension("OES_element_index_uint")&&console.warn("WebGLRenderer: draw elements type not support UNSIGNED_INT!"),l){if(c<=0)return;if(r.version>=2)s.drawElementsInstanced(t.drawMode,p,m,u*v,c);else if(r.getExtension("ANGLE_instanced_arrays"))r.getExtension("ANGLE_instanced_arrays").drawElementsInstancedANGLE(t.drawMode,p,m,u*v,c);else{console.warn("WebGLRenderer: using instanced draw but hardware does not support.");return}}else if(d){if(n.multiDrawCount<=0)return;const M=r.getExtension("WEBGL_multi_draw");if(!M){console.warn("WebGLRenderer: using multi draw but hardware does not support extension WEBGL_multi_draw.");return}M.multiDrawElementsWEBGL(t.drawMode,n.multiDrawCounts,0,m,n.multiDrawStarts,0,n.multiDrawCount)}else s.drawElements(t.drawMode,p,m,u*v)}else if(l){if(c<=0)return;if(r.version>=2)s.drawArraysInstanced(t.drawMode,u,p,c);else if(r.getExtension("ANGLE_instanced_arrays"))r.getExtension("ANGLE_instanced_arrays").drawArraysInstancedANGLE(t.drawMode,u,p,c);else{console.warn("WebGLRenderer: using instanced draw but hardware does not support.");return}}else if(d){if(n.multiDrawCount<=0)return;const _=r.getExtension("WEBGL_multi_draw");if(!_){console.warn("WebGLRenderer: using multi draw but hardware does not support extension WEBGL_multi_draw.");return}_.multiDrawArraysWEBGL(t.drawMode,n.multiDrawStarts,0,n.multiDrawCounts,0,n.multiDrawCount)}else s.drawArrays(t.drawMode,u,p);if(i){if(d){p=0;for(let _=0;_<n.multiDrawCount;_++)p+=n.multiDrawCounts[_]}i.update(p,t.drawMode,c<0?1:c)}}}class Wo extends ye{constructor(){super(),console.warn("Group has been deprecated, use Object3D instead.")}}Wo.prototype.isGroup=!0;Object.defineProperties(zn.prototype,{gl:{configurable:!0,get:function(){return console.warn("WebGLRenderer: .gl has been deprecated, use .context instead."),this.context}}});zn.prototype.render=function(a,e,t){console.warn("WebGLRenderer: .render() has been renamed to .renderRenderableItem()."),this.renderRenderableItem(a,e,t)};Object.defineProperties(Ln.prototype,{environmentLightIntensity:{configurable:!0,get:function(){return this.envDiffuseIntensity},set:function(a){this.envDiffuseIntensity=a}}});const Xo=y.nextPowerOfTwo,qo={name:"gaussian_splatting",defines:{},uniforms:{covariancesTexture:null,centersTexture:null,colorsTexture:null,focal:[0,0],basisViewport:[0,0]},vertexShader:`
        #include <common_vert>

        attribute uint splatIndex;

        uniform sampler2D centersTexture;
        uniform sampler2D colorsTexture;
        uniform sampler2D covariancesTexture;
		uniform vec2 covariancesTextureSize;
        uniform vec2 centersColorsTextureSize;

        uniform vec2 focal;
        uniform vec2 basisViewport;

        varying vec4 vColor;
        varying vec2 vPosition;

        vec2 getDataUV(in int stride, in int offset, in vec2 dimensions) {
            vec2 samplerUV = vec2(0.0, 0.0);
            float d = float(splatIndex * uint(stride) + uint(offset)) / dimensions.x;
            samplerUV.y = float(floor(d)) / dimensions.y;
            samplerUV.x = fract(d);
            return samplerUV;
        }

        const float sqrt8 = sqrt(8.0);

        #include <logdepthbuf_pars_vert>

        void main () {
            vec2 centersTextureSize = vec2(textureSize(centersTexture, 0));
            vec4 sampledCenter = texture(centersTexture, getDataUV(1, 0, centersTextureSize));
            vec3 splatCenter = sampledCenter.gba;

			mat4 transformModelViewMatrix = u_View * u_Model;

            vec4 viewCenter = transformModelViewMatrix * vec4(splatCenter, 1.0);
            vec4 clipCenter = u_Projection * viewCenter;

            float clip = 1.2 * clipCenter.w;
            if (clipCenter.z < -clip || clipCenter.x < -clip || clipCenter.x > clip || clipCenter.y < -clip || clipCenter.y > clip) {
                gl_Position = vec4(0.0, 0.0, 2.0, 1.0);
                return;
            }

            vPosition = a_Position.xy;
            vec2 colorsTextureSize = vec2(textureSize(colorsTexture, 0));
            vColor = texture(colorsTexture, getDataUV(1, 0, colorsTextureSize));

            vec2 covariancesTextureSize = vec2(textureSize(covariancesTexture, 0));
            vec2 sampledCovarianceA = texture(covariancesTexture, getDataUV(3, 0, covariancesTextureSize)).rg;
            vec2 sampledCovarianceB = texture(covariancesTexture, getDataUV(3, 1, covariancesTextureSize)).rg;
            vec2 sampledCovarianceC = texture(covariancesTexture, getDataUV(3, 2, covariancesTextureSize)).rg;

            vec3 cov3D_M11_M12_M13 = vec3(sampledCovarianceA.rg, sampledCovarianceB.r);
            vec3 cov3D_M22_M23_M33 = vec3(sampledCovarianceB.g, sampledCovarianceC.rg);

            // Construct the 3D covariance matrix
            mat3 Vrk = mat3(
                cov3D_M11_M12_M13.x, cov3D_M11_M12_M13.y, cov3D_M11_M12_M13.z,
                cov3D_M11_M12_M13.y, cov3D_M22_M23_M33.x, cov3D_M22_M23_M33.y,
                cov3D_M11_M12_M13.z, cov3D_M22_M23_M33.y, cov3D_M22_M23_M33.z
            );

            // Construct the Jacobian of the affine approximation of the projection matrix. It will be used to transform the
            // 3D covariance matrix instead of using the actual projection matrix because that transformation would
            // require a non-linear component (perspective division) which would yield a non-gaussian result. (This assumes
            // the current projection is a perspective projection).
            float s = 1.0 / (viewCenter.z * viewCenter.z);
            mat3 J = mat3(
                focal.x / viewCenter.z, 0., -(focal.x * viewCenter.x) * s,
                0., focal.y / viewCenter.z, -(focal.y * viewCenter.y) * s,
                0., 0., 0.
            );

			mat3 invy = mat3(-1, 0, 0, 0, -1, 0, 0, 0, 1);

            // Concatenate the projection approximation with the model-view transformation
            mat3 W = transpose(mat3(transformModelViewMatrix));
            mat3 T = invy * W * J;

            // Transform the 3D covariance matrix (Vrk) to compute the 2D covariance matrix
            mat3 cov2Dm = transpose(T) * Vrk * T;
            
            // Apply low-pass filter: every Gaussian should be at least
            // one pixel wide/high. Discard 3rd row and column.
            cov2Dm[0][0] += 0.3;
            cov2Dm[1][1] += 0.3;

            // We are interested in the upper-left 2x2 portion of the projected 3D covariance matrix because
            // we only care about the X and Y values. We want the X-diagonal, cov2Dm[0][0],
            // the Y-diagonal, cov2Dm[1][1], and the correlation between the two cov2Dm[0][1]. We don't
            // need cov2Dm[1][0] because it is a symetric matrix.
            vec3 cov2Dv = vec3(cov2Dm[0][0], cov2Dm[0][1], cov2Dm[1][1]);

            // We now need to solve for the eigen-values and eigen vectors of the 2D covariance matrix
            // so that we can determine the 2D basis for the splat. This is done using the method described
            // here: https://people.math.harvard.edu/~knill/teaching/math21b2004/exhibits/2dmatrices/index.html
            // After calculating the eigen-values and eigen-vectors, we calculate the basis for rendering the splat
            // by normalizing the eigen-vectors and then multiplying them by (sqrt(8) * eigen-value), which is
            // equal to scaling them by sqrt(8) standard deviations.
            //
            // This is a different approach than in the original work at INRIA. In that work they compute the
            // max extents of the projected splat in screen space to form a screen-space aligned bounding rectangle
            // which forms the geometry that is actually rasterized. The dimensions of that bounding box are 3.0
            // times the maximum eigen-value, or 3 standard deviations. They then use the inverse 2D covariance
            // matrix (called 'conic') in the CUDA rendering thread to determine fragment opacity by calculating the
            // full gaussian: exp(-0.5 * (X - mean) * conic * (X - mean)) * splat opacity
            float a = cov2Dv.x;
            float d = cov2Dv.z;
            float b = cov2Dv.y;
            float D = a * d - b * b;
            float trace = a + d;
            float traceOver2 = 0.5 * trace;
            float term2 = sqrt(max(0.1f, traceOver2 * traceOver2 - D));
            float eigenValue1 = traceOver2 + term2;
            float eigenValue2 = traceOver2 - term2;

            float transparentAdjust = step(1.0 / 255.0, vColor.a);
            eigenValue2 = eigenValue2 * transparentAdjust; // hide splat if alpha is zero

            vec2 eigenVector1 = normalize(vec2(b, eigenValue1 - a));
            // since the eigen vectors are orthogonal, we derive the second one from the first
            vec2 eigenVector2 = vec2(eigenVector1.y, -eigenVector1.x);

            // We use sqrt(8) standard deviations instead of 3 to eliminate more of the splat with a very low opacity.
            vec2 basisVector1 = eigenVector1 * sqrt8 * sqrt(eigenValue1);
            vec2 basisVector2 = eigenVector2 * sqrt8 * sqrt(eigenValue2);

            vec2 ndcOffset = vec2(vPosition.x * basisVector1 + vPosition.y * basisVector2) * basisViewport * 2.0;

            // Similarly scale the position data we send to the fragment shader
            vPosition *= sqrt8;

            gl_Position = vec4(clipCenter.xy + ndcOffset * clipCenter.w, clipCenter.zw);

            #include <logdepthbuf_vert>
        }
	`,fragmentShader:`
		#include <common_frag>
        #include <logdepthbuf_pars_frag>

        uniform float u_AlphaTest;

		varying vec4 vColor;
		varying vec2 vPosition;

		void main () {
            #include <logdepthbuf_frag>

			// Compute the positional squared distance from the center of the splat to the current fragment.
            float A = dot(vPosition, vPosition);
            // Since the positional data in vPosition has been scaled by sqrt(8), the squared result will be
            // scaled by a factor of 8. If the squared result is larger than 8, it means it is outside the ellipse
            // defined by the rectangle formed by vPosition. It also means it's farther
            // away than sqrt(8) standard deviations from the mean.
            if (A > 8.0) discard;

            if (vColor.a < u_AlphaTest) discard;

            vec3 color = vColor.rgb;

            // Since the rendered splat is scaled by sqrt(8), the inverse covariance matrix that is part of
            // the gaussian formula becomes the identity matrix. We're then left with (X - mean) * (X - mean),
            // and since 'mean' is zero, we have X * X, which is the same as A:
            float opacity = exp(-0.5 * A) * vColor.a;

            gl_FragColor = vec4(color.rgb * u_Color, opacity * u_Opacity);
		}
	`},Fe={convertSplatToInternalData:a=>{const e=new Float32Array(a),t=new Uint8Array(a),n=3*4+3*4+4+4,i=t.length/n,s=new Float32Array(3*i),r=new Float32Array(4*i),o=new Float32Array(3*i),c=new Uint8Array(4*i);for(let l=0;l<i;l++)s[3*l+0]=-e[8*l+0],s[3*l+1]=-e[8*l+1],s[3*l+2]=e[8*l+2],r[4*l+0]=(t[32*l+28+0]-128)/128,r[4*l+1]=(t[32*l+28+1]-128)/128,r[4*l+2]=(t[32*l+28+2]-128)/128,r[4*l+3]=(t[32*l+28+3]-128)/128,o[3*l+0]=e[8*l+3+0],o[3*l+1]=e[8*l+3+1],o[3*l+2]=e[8*l+3+2],c[4*l+0]=t[32*l+24+0],c[4*l+1]=t[32*l+24+1],c[4*l+2]=t[32*l+24+2],c[4*l+3]=t[32*l+24+3];return{vertexCount:i,positions:s,rotations:r,scales:o,colors:c}},generateCentersTexture:a=>{const{positions:e,vertexCount:t}=a,n=Fe.getTextureSize(t),i=new Float32Array(4*n*n);for(let r=0;r<t;r++)i[r*4+0]=0,i[r*4+1]=e[3*r+0],i[r*4+2]=e[3*r+1],i[r*4+3]=e[3*r+2];const s=new ge;return s.image={data:i,width:n,height:n},s.type=N.FLOAT,s.format=E.RGBA,s.magFilter=P.NEAREST,s.minFilter=P.NEAREST,s.generateMipmaps=!1,s.flipY=!1,s.version++,s},generateCovariancesTexture:a=>{const{rotations:e,scales:t,vertexCount:n}=a,i=Fe.getTextureSize(n*3),s=new Float32Array(2*i*i);for(let o=0;o<n;o++)_e.set(t[o*3+0],0,0,0,t[o*3+1],0,0,0,t[o*3+2]),Bi.set(e[o*4+1],e[o*4+2],e[o*4+3],e[o*4+0]),zi.makeRotationFromQuaternion(Bi),Gt.setFromMatrix4(zi),Gt.multiply(_e),_e.copy(Gt).transpose().premultiply(Gt),s[o*6+0]=_e.elements[0],s[o*6+1]=_e.elements[3],s[o*6+2]=_e.elements[6],s[o*6+3]=_e.elements[4],s[o*6+4]=_e.elements[7],s[o*6+5]=_e.elements[8];const r=new ge;return r.image={data:s,width:i,height:i},r.type=N.FLOAT,r.format=E.RG,r.internalformat=E.RG32F,r.magFilter=P.NEAREST,r.minFilter=P.NEAREST,r.generateMipmaps=!1,r.flipY=!1,r.version++,r},generateColorsTexture:a=>{const{colors:e,vertexCount:t}=a,n=Fe.getTextureSize(t),i=new Uint8Array(4*n*n);i.set(e);const s=new ge;return s.image={data:i,width:n,height:n},s.type=N.UNSIGNED_BYTE,s.format=E.RGBA,s.magFilter=P.NEAREST,s.minFilter=P.NEAREST,s.generateMipmaps=!1,s.flipY=!1,s.version++,s},getTextureSize:a=>{let e=Math.sqrt(a);return e=Xo(Math.ceil(e)),Math.max(4,e)}},Bi=new Be,_e=new He,Gt=new He,zi=new U;class Yo extends js{constructor(){super(qo),this.transparent=!0,this.depthTest=!0,this.depthWrite=!1}setTextures(e){const t=this.uniforms;t.covariancesTexture=Fe.generateCovariancesTexture(e),t.centersTexture=Fe.generateCentersTexture(e),t.colorsTexture=Fe.generateColorsTexture(e)}updateUniforms(e,t,n){const i=this.uniforms;i.basisViewport[0]=1/t,i.basisViewport[1]=1/n,i.focal[0]=e.projectionMatrix.elements[0]*t*.45,i.focal[1]=e.projectionMatrix.elements[5]*n*.45}}class Qo extends Dn{constructor(e){super(),this.setIndex(new Ue(new Je(new Uint16Array([0,1,2,0,2,3]),1),1));const t=[-1,-1,0,-1,1,0,1,1,0,1,-1,0],n=new Je(new Float32Array(t),3);this.addAttribute("a_Position",new Ue(n));const i=new Uint32Array(e),s=new Je(i,1);s.usage=Hi.DYNAMIC_DRAW;const r=new Ue(s);r.divisor=1,this.addAttribute("splatIndex",r)}updateSplatIndices(e,t){const n=this.attributes.splatIndex.buffer,i=n.array;for(let s=0;s<t;s++)i[s]=e[s];n.version++,this.instanceCount=t}}class Zo{constructor(){this.onUpdate=null,this._worker=null,this._status=$e.OFF,this._indices=null,this._lastMVPMatrix=new U}init(e,t){const n=new Blob(["(",jo.toString(),")(self)"],{type:"application/javascript"});this._worker=new Worker(URL.createObjectURL(n)),this._worker.postMessage({positions:e,count:t}),this._indices=new Uint32Array(t),this._worker.onmessage=i=>{i.data.init?this._status=$e.READY:(this._indices=i.data,this.onUpdate&&this.onUpdate(this._indices,t),this._status=$e.READY)}}update(e){if(this._status===$e.READY){const t=e.elements,n=this._lastMVPMatrix.elements,i=n[2]*t[2]+n[6]*t[6]+n[10]*t[10];Math.abs(i-1)>=.01&&(this._lastMVPMatrix.copy(e),this._status=$e.BUSY,this._worker.postMessage({mvpMatrix:t,indices:this._indices},[this._indices.buffer]))}}dispose(){this._worker&&(this._worker.terminate(),this._worker=null),this._status=$e.OFF,this._indices=null}}const $e={OFF:0,READY:1,BUSY:2};function jo(a){let e=0,t,n,i,s,r;a.onmessage=o=>{if(o.data.positions)t=o.data.positions,e=o.data.count,n=new Uint32Array(256*256),i=new Uint32Array(256*256),s=new Float32Array(e),r=new Int32Array(s.buffer),a.postMessage({init:!0});else if(o.data.mvpMatrix){const c=o.data.mvpMatrix,l=o.data.indices;let h=1/0,d=-1/0;for(let u=0;u<e;u++){const p=-(c[2]*t[3*u+0]+c[6]*t[3*u+1]+c[10]*t[3*u+2]+c[14]);s[u]=p,p>d&&(d=p),p<h&&(h=p)}n.fill(0);const f=(256*256-1)/(d-h);for(let u=0;u<e;u++)r[u]=(s[u]-h)*f|0,n[r[u]]++;i[0]=0;for(let u=1;u<256*256;u++)i[u]=i[u-1]+n[u-1];for(let u=0;u<e;u++)l[i[r[u]]++]=u;a.postMessage(l,[l.buffer])}else console.error("positions or mvpMatrix is not defined!")}}class $i extends Nn{constructor(e){const t=Fe.convertSplatToInternalData(e),n=new Yo;n.setTextures(t);const i=new Qo(t.vertexCount);i.boundingSphere.setFromArray(t.positions),i.boundingBox.setFromArray(t.positions),super(i,n);const s=new Zo;s.init(t.positions,t.vertexCount),s.onUpdate=(r,o)=>{i.updateSplatIndices(r,o)},this.frustumCulled=!1,this._internalData=t,this._worker=s}update(e,t,n){An.copy(e.projectionViewMatrix),An.multiply(this.worldMatrix),this._worker.update(An),this._internalData.vertexCount>0&&this.material.updateUniforms(e,t,n)}dispose(){this._worker.dispose(),this._internalData=null}}$i.prototype.isGaussianSplattingMesh=!0;const An=new U;class Ko extends Vi{constructor(e){super(e)}load(e,t,n,i){const s=this,r=new Es(this.manager);r.setResponseType("arraybuffer"),r.setRequestHeader(this.requestHeader),r.setPath(this.path),r.setWithCredentials(this.withCredentials),r.load(e,function(o){t!==void 0&&t(s.parse(o))},n,i)}parse(e){const t=new $i(e);return{buffer:e,node:t}}}class $o extends Ko{constructor(e){super(e)}parse(e){const t=this.convertPLYToSplat(e);return super.parse(t)}convertPLYToSplat(e){const t=new Uint8Array(e),n=new TextDecoder().decode(t.slice(0,1024*10)),i=`end_header
`,s=n.indexOf(i);if(s<0||!n)return e;const r=/element vertex (\d+)\n/.exec(n),o=r?parseInt(r[1]):0;let c=0;const l={double:8,int:4,uint:4,float:4,short:2,ushort:2,uchar:1},h=[],d=n.slice(0,s).split(`
`).filter(m=>m.startsWith("property "));for(const m of d){const[,M,A]=m.split(" ");if(h.push({name:A,type:M,offset:c}),!l[M])throw new Error(`Unsupported property type: ${M}`);c+=l[M]}const f=3*4+3*4+4+4,u=.28209479177387814,p=new DataView(e,s+i.length),_=new ArrayBuffer(f*o),v=new Be;for(let m=0;m<o;m++){const M=new Float32Array(_,m*f,3),A=new Float32Array(_,m*f+12,3),T=new Uint8ClampedArray(_,m*f+24,4),w=new Uint8ClampedArray(_,m*f+28,4);let R=255,O=0,F=0,I=0;for(let L=0;L<h.length;L++){const x=h[L];let D;switch(x.type){case"float":D=p.getFloat32(x.offset+m*c,!0);break;case"int":D=p.getInt32(x.offset+m*c,!0);break;default:throw new Error(`Unsupported property type: ${x.type}`)}switch(x.name){case"x":M[0]=D;break;case"y":M[1]=D;break;case"z":M[2]=D;break;case"scale_0":A[0]=Math.exp(D);break;case"scale_1":A[1]=Math.exp(D);break;case"scale_2":A[2]=Math.exp(D);break;case"red":T[0]=D;break;case"green":T[1]=D;break;case"blue":T[2]=D;break;case"f_dc_0":T[0]=(.5+u*D)*255;break;case"f_dc_1":T[1]=(.5+u*D)*255;break;case"f_dc_2":T[2]=(.5+u*D)*255;break;case"f_dc_3":T[3]=(.5+u*D)*255;break;case"opacity":T[3]=1/(1+Math.exp(-D))*255;break;case"rot_0":R=D;break;case"rot_1":O=D;break;case"rot_2":F=D;break;case"rot_3":I=D;break}}v.set(O,F,I,R),v.normalize(),w[0]=v.w*128+128,w[1]=v.x*128+128,w[2]=v.y*128+128,w[3]=v.z*128+128}return _}}class Jo{constructor(e,t){this.object=e,this.domElement=t,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new S,this.up=new S(0,1,0),this.minDistance=0,this.maxDistance=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!0,this.dampingFactor=.1,this.enableDollying=!0,this.dollyingSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:37,UP:38,RIGHT:39,BOTTOM:40},this.mouseButtons={ORBIT:0,DOLLY:1,PAN:2},this.touches={ORBIT:1,DOLLY_PAN:2},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this._domElementKeyEvents=null,this.getPolarAngle=function(){return o.phi},this.getAzimuthalAngle=function(){return o.theta},this.listenToKeyEvents=function(g){g.addEventListener("keydown",Wn),n._domElementKeyEvents=g},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position)},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),s=i.NONE},this.update=function(){const g=new S,b=new S(0,1,0),z=new Be,k=z.clone(),Se=new S,at=new Be,ke=2*Math.PI;return function(){z.setFromUnitVectors(n.up,b),k.copy(z).conjugate();const Tt=n.object.position;g.copy(Tt).sub(n.target),g.applyQuaternion(z),o.setFromVector3(g),n.autoRotate&&s===i.NONE&&F(R()),n.enableDamping?(o.theta+=c.theta*n.dampingFactor,o.phi+=c.phi*n.dampingFactor):(o.theta+=c.theta,o.phi+=c.phi);let ne=n.minAzimuthAngle,he=n.maxAzimuthAngle;return isFinite(ne)&&isFinite(he)&&(ne<-Math.PI?ne+=ke:ne>Math.PI&&(ne-=ke),he<-Math.PI?he+=ke:he>Math.PI&&(he-=ke),ne<=he?o.theta=Math.max(ne,Math.min(he,o.theta)):o.theta=o.theta>(ne+he)/2?Math.max(ne,o.theta):Math.min(he,o.theta)),o.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,o.phi)),o.makeSafe(),o.radius*=l,o.radius=Math.max(n.minDistance,Math.min(n.maxDistance,o.radius)),n.enableDamping===!0?n.target.addScaledVector(h,n.dampingFactor):n.target.add(h),g.setFromSpherical(o),g.applyQuaternion(k),Tt.copy(n.target).add(g),n.object.lookAt(n.target,n.up),n.enableDamping===!0?(c.theta*=1-n.dampingFactor,c.phi*=1-n.dampingFactor,h.multiplyScalar(1-n.dampingFactor)):(c.set(0,0,0),h.set(0,0,0)),l=1,Se.distanceToSquared(n.object.position)>r||8*(1-at.dot(n.object.quaternion))>r?(Se.copy(n.object.position),at.copy(n.object.quaternion),!0):!1}}(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",Xn),n.domElement.removeEventListener("pointerdown",Hn),n.domElement.removeEventListener("pointercancel",Vn),n.domElement.removeEventListener("wheel",kn),n.domElement.removeEventListener("pointermove",Qt),n.domElement.removeEventListener("pointerup",Zt),n._domElementKeyEvents!==null&&n._domElementKeyEvents.removeEventListener("keydown",Wn)};const n=this,i={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_DOLLY_PAN:4};let s=i.NONE;const r=1e-6,o=new Xt,c=new Xt;let l=1;const h=new S,d=new B,f=new B,u=new B,p=new B,_=new B,v=new B,m=new B,M=new B,A=new B,T=[],w={};function R(){return 2*Math.PI/60/60*n.autoRotateSpeed}function O(){return Math.pow(.95,n.dollyingSpeed)}function F(g){c.theta-=g}function I(g){c.phi-=g}const L=function(){const g=new S;return function(z,k){g.setFromMatrixColumn(k,0),g.multiplyScalar(-z),h.add(g)}}(),x=function(){const g=new S;return function(z,k){n.screenSpacePanning===!0?g.setFromMatrixColumn(k,1):(g.setFromMatrixColumn(k,0),g.crossVectors(n.up,g)),g.multiplyScalar(z),h.add(g)}}(),D=function(){const g=new S,b=new S;return function(k,Se){const at=n.domElement,ke=n.object.position;g.copy(ke).sub(n.target);const Qn=g.getLength(),Tt=b.set(0,0,Qn).applyMatrix4(n.object.projectionMatrix).z,ne=b.set(0,-1,Tt).applyMatrix4(n.object.projectionMatrixInverse).y;L(2*k*ne/at.clientHeight,n.object.matrix),x(2*Se*ne/at.clientHeight,n.object.matrix)}}();function Q(g){l/=g}function Y(g){l*=g}function ee(g){d.set(g.clientX,g.clientY)}function G(g){m.set(g.clientX,g.clientY)}function ve(g){p.set(g.clientX,g.clientY)}function te(g){f.set(g.clientX,g.clientY),u.subVectors(f,d).multiplyScalar(n.rotateSpeed);const b=n.domElement;F(2*Math.PI*u.x/b.clientHeight),I(2*Math.PI*u.y/b.clientHeight),d.copy(f)}function Z(g){M.set(g.clientX,g.clientY),A.subVectors(M,m),A.y>0?Q(O()):A.y<0&&Y(O()),m.copy(M)}function Te(g){_.set(g.clientX,g.clientY),v.subVectors(_,p).multiplyScalar(n.panSpeed),D(v.x,v.y),p.copy(_)}function H(g){g.deltaY<0?Y(O()):g.deltaY>0&&Q(O())}function Ve(g){let b=!1;switch(g.keyCode){case n.keys.UP:D(0,n.keyPanSpeed),b=!0;break;case n.keys.BOTTOM:D(0,-n.keyPanSpeed),b=!0;break;case n.keys.LEFT:D(n.keyPanSpeed,0),b=!0;break;case n.keys.RIGHT:D(-n.keyPanSpeed,0),b=!0;break}b&&g.preventDefault()}function Pe(){if(T.length===1)d.set(T[0].pageX,T[0].pageY);else{const g=.5*(T[0].pageX+T[1].pageX),b=.5*(T[0].pageY+T[1].pageY);d.set(g,b)}}function Le(){if(T.length===1)p.set(T[0].pageX,T[0].pageY);else{const g=.5*(T[0].pageX+T[1].pageX),b=.5*(T[0].pageY+T[1].pageY);p.set(g,b)}}function ns(){const g=T[0].pageX-T[1].pageX,b=T[0].pageY-T[1].pageY,z=Math.sqrt(g*g+b*b);m.set(0,z)}function is(){n.enableDollying&&ns(),n.enablePan&&Le()}function ss(g){if(T.length==1)f.set(g.pageX,g.pageY);else{const z=jt(g),k=.5*(g.pageX+z.x),Se=.5*(g.pageY+z.y);f.set(k,Se)}u.subVectors(f,d).multiplyScalar(n.rotateSpeed);const b=n.domElement;F(2*Math.PI*u.x/b.clientHeight),I(2*Math.PI*u.y/b.clientHeight),d.copy(f)}function rs(g){if(T.length===1)_.set(g.pageX,g.pageY);else{const b=jt(g),z=.5*(g.pageX+b.x),k=.5*(g.pageY+b.y);_.set(z,k)}v.subVectors(_,p).multiplyScalar(n.panSpeed),D(v.x,v.y),p.copy(_)}function as(g){const b=jt(g),z=g.pageX-b.x,k=g.pageY-b.y,Se=Math.sqrt(z*z+k*k);M.set(0,Se),A.set(0,Math.pow(M.y/m.y,n.dollyingSpeed)),Q(A.y),m.copy(M)}function os(g){n.enableDollying&&as(g),n.enablePan&&rs(g)}function Hn(g){n.enabled!==!1&&(T.length===0&&(n.domElement.setPointerCapture(g.pointerId),n.domElement.addEventListener("pointermove",Qt),n.domElement.addEventListener("pointerup",Zt)),us(g),g.pointerType==="touch"?hs(g):cs(g))}function Qt(g){n.enabled!==!1&&(g.pointerType==="touch"?ds(g):ls(g))}function Zt(g){qn(g),T.length===0&&(n.domElement.releasePointerCapture(g.pointerId),n.domElement.removeEventListener("pointermove",Qt),n.domElement.removeEventListener("pointerup",Zt)),s=i.NONE}function Vn(g){qn(g)}function cs(g){switch(g.button){case n.mouseButtons.ORBIT:if(n.enableRotate===!1)return;ee(g),s=i.ROTATE;break;case n.mouseButtons.DOLLY:if(n.enableDollying===!1)return;G(g),s=i.DOLLY;break;case n.mouseButtons.PAN:if(n.enablePan===!1)return;ve(g),s=i.PAN;break}}function ls(g){switch(s){case i.ROTATE:if(n.enableRotate===!1)return;te(g);break;case i.DOLLY:if(n.enableDollying===!1)return;Z(g);break;case i.PAN:if(n.enablePan===!1)return;Te(g);break}}function kn(g){n.enabled===!1||n.enableDollying===!1||s!==i.NONE||(g.preventDefault(),H(g))}function Wn(g){n.enabled===!1||n.enablePan===!1||Ve(g)}function hs(g){switch(Yn(g),T.length){case n.touches.ORBIT:if(n.enableRotate===!1)return;Pe(),s=i.TOUCH_ROTATE;break;case n.touches.DOLLY_PAN:if(n.enableDollying===!1&&n.enablePan===!1)return;is(),s=i.TOUCH_DOLLY_PAN;break;default:s=i.NONE}}function ds(g){switch(Yn(g),s){case i.TOUCH_ROTATE:if(n.enableRotate===!1)return;ss(g);break;case i.TOUCH_DOLLY_PAN:if(n.enableDollying===!1&&n.enablePan===!1)return;os(g);break;default:s=i.NONE}}function Xn(g){n.enabled!==!1&&g.preventDefault()}function us(g){T.push(g)}function qn(g){delete w[g.pointerId];for(let b=0;b<T.length;b++)if(T[b].pointerId==g.pointerId){T.splice(b,1);return}}function Yn(g){let b=w[g.pointerId];b===void 0&&(b=new B,w[g.pointerId]=b),b.set(g.pageX,g.pageY)}function jt(g){const b=g.pointerId===T[0].pointerId?T[1]:T[0];return w[b.pointerId]}n.domElement.addEventListener("contextmenu",Xn),n.domElement.addEventListener("pointerdown",Hn),n.domElement.addEventListener("pointercancel",Vn),n.domElement.addEventListener("wheel",kn,{passive:!1}),this.update()}}new fs;const qt=new _s;qt.showPanel(0);document.body.appendChild(qt.dom);const Ji=window.innerWidth,es=window.innerHeight,rt=document.createElement("canvas");rt.width=Ji;rt.height=es;document.body.appendChild(rt);const ec=rt.getContext("webgl2",{antialias:!0}),Vt=new zn(ec);Vt.setClearColor(1,1,1,1);const kt=new Yi(rt),Ie=new Ln,le=new bn;le.position.set(0,0,2);le.lookAt(new S(0,0,0),new S(0,1,0));le.setPerspective(75/180*Math.PI,Ji/es,.1,1e3);Ie.add(le);const tc=new Jo(le,rt),nc=new $o;let q=null,Wt=!1;const ic=.01;async function Gn(a){q&&(Ie.remove(q),q._sortWorker&&q._sortWorker._worker&&q._sortWorker._worker.terminate(),q=null);try{console.log(`Loading model: ${a}`);const{node:e}=await nc.loadAsync(a);console.log("Model loaded successfully",e),q=e,q.position.set(0,0,-1),q.scale.set(3,3,3),q.euler.y=Math.PI,q.euler.x=Math.PI,Ie.add(q)}catch(e){console.error("Error loading model:",e)}}function sc(){Wt=!Wt;const a=document.getElementById("rotateToggle");Wt?(a.textContent="停止旋转",a.classList.add("active")):(a.textContent="开启旋转",a.classList.remove("active"))}document.getElementById("load56k").addEventListener("click",()=>{Gn("/splats/model_56k.ply")});document.getElementById("load150k").addEventListener("click",()=>{Gn("/splats/model_150k.ply")});document.getElementById("rotateToggle").addEventListener("click",sc);Gn("/splats/model_56k.ply");window.addEventListener("resize",()=>{const a=window.innerWidth,e=window.innerHeight;le.setPerspective(75/180*Math.PI,a/e,.1,1e3),kt.resize(a,e)});function ts(){requestAnimationFrame(ts),qt.begin(),tc.update(),q&&(Wt&&(q.euler.y+=ic),q.update(le,kt.width,kt.height)),Ie.updateMatrix(),Ie.updateRenderStates(le),Ie.updateRenderQueue(le),Vt.setRenderTarget(kt),Vt.clear(!0,!0,!1),Vt.renderScene(Ie,le),qt.end()}ts();
