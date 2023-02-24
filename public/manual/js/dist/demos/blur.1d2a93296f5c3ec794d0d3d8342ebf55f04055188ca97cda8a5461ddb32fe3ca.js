"use strict";(()=>{var w=(l=>typeof require!="undefined"?require:typeof Proxy!="undefined"?new Proxy(l,{get:(e,t)=>(typeof require!="undefined"?require:e)[t]}):l)(function(l){if(typeof require!="undefined")return require.apply(this,arguments);throw new Error('Dynamic require of "'+l+'" is not supported')});var S=w("three");var f=w("three");var te="varying vec2 vUv;void main(){vUv=position.xy*0.5+0.5;gl_Position=vec4(position.xy,1.0,1.0);}";var T=w("three");var D={VERY_SMALL:0,SMALL:1,MEDIUM:2,LARGE:3,VERY_LARGE:4,HUGE:5};var se=`#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec4 sum=texture2D(inputBuffer,vUv0);sum+=texture2D(inputBuffer,vUv1);sum+=texture2D(inputBuffer,vUv2);sum+=texture2D(inputBuffer,vUv3);gl_FragColor=sum*0.25;
#include <encodings_fragment>
}`;var ie="uniform vec4 texelSize;uniform float kernel;uniform float scale;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec2 uv=position.xy*0.5+0.5;vec2 dUv=(texelSize.xy*vec2(kernel)+texelSize.zw)*scale;vUv0=vec2(uv.x-dUv.x,uv.y+dUv.y);vUv1=vec2(uv.x+dUv.x,uv.y+dUv.y);vUv2=vec2(uv.x+dUv.x,uv.y-dUv.y);vUv3=vec2(uv.x-dUv.x,uv.y-dUv.y);gl_Position=vec4(position.xy,1.0,1.0);}";var we=[new Float32Array([0,0]),new Float32Array([0,1,1]),new Float32Array([0,1,1,2]),new Float32Array([0,1,2,2,3]),new Float32Array([0,1,2,3,4,4,5]),new Float32Array([0,1,2,3,4,5,7,8,9,10])],L=class extends T.ShaderMaterial{constructor(e=new T.Vector4){super({name:"KawaseBlurMaterial",uniforms:{inputBuffer:new T.Uniform(null),texelSize:new T.Uniform(new T.Vector4),scale:new T.Uniform(1),kernel:new T.Uniform(0)},blending:T.NoBlending,depthWrite:!1,depthTest:!1,fragmentShader:se,vertexShader:ie}),this.toneMapped=!1,this.setTexelSize(e.x,e.y),this.kernelSize=D.MEDIUM}set inputBuffer(e){this.uniforms.inputBuffer.value=e}setInputBuffer(e){this.inputBuffer=e}get kernelSequence(){return we[this.kernelSize]}get scale(){return this.uniforms.scale.value}set scale(e){this.uniforms.scale.value=e}getScale(){return this.uniforms.scale.value}setScale(e){this.uniforms.scale.value=e}getKernel(){return null}get kernel(){return this.uniforms.kernel.value}set kernel(e){this.uniforms.kernel.value=e}setKernel(e){this.kernel=e}setTexelSize(e,t){this.uniforms.texelSize.value.set(e,t,e*.5,t*.5)}setSize(e,t){let s=1/e,i=1/t;this.uniforms.texelSize.value.set(s,i,s*.5,i*.5)}};var F=w("three");var re=`#include <common>
#include <dithering_pars_fragment>
#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
uniform float opacity;varying vec2 vUv;void main(){vec4 texel=texture2D(inputBuffer,vUv);gl_FragColor=opacity*texel;
#include <encodings_fragment>
#include <dithering_fragment>
}`;var E=class extends F.ShaderMaterial{constructor(){super({name:"CopyMaterial",uniforms:{inputBuffer:new F.Uniform(null),opacity:new F.Uniform(1)},blending:F.NoBlending,depthWrite:!1,depthTest:!1,fragmentShader:re,vertexShader:te}),this.toneMapped=!1}set inputBuffer(e){this.uniforms.inputBuffer.value=e}setInputBuffer(e){this.uniforms.inputBuffer.value=e}getOpacity(e){return this.uniforms.opacity.value}setOpacity(e){this.uniforms.opacity.value=e}};var x=w("three");var ne=`#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
uniform vec2 kernel[STEPS];varying vec2 vOffset;varying vec2 vUv;void main(){vec4 result=texture2D(inputBuffer,vUv)*kernel[0].y;for(int i=1;i<STEPS;++i){vec2 offset=kernel[i].x*vOffset;vec4 c0=texture2D(inputBuffer,vUv+offset);vec4 c1=texture2D(inputBuffer,vUv-offset);result+=(c0+c1)*kernel[i].y;}gl_FragColor=result;
#include <encodings_fragment>
}`;var ae="uniform vec2 texelSize;uniform vec2 direction;uniform float scale;varying vec2 vOffset;varying vec2 vUv;void main(){vOffset=direction*texelSize*scale;vUv=position.xy*0.5+0.5;gl_Position=vec4(position.xy,1.0,1.0);}";var H=class extends x.ShaderMaterial{constructor({kernelSize:e=35}={}){super({name:"GaussianBlurMaterial",uniforms:{inputBuffer:new x.Uniform(null),texelSize:new x.Uniform(new x.Vector2),direction:new x.Uniform(new x.Vector2),kernel:new x.Uniform(null),scale:new x.Uniform(1)},blending:x.NoBlending,depthWrite:!1,depthTest:!1,fragmentShader:ne,vertexShader:ae}),this.toneMapped=!1,this._kernelSize=0,this.kernelSize=e}set inputBuffer(e){this.uniforms.inputBuffer.value=e}get kernelSize(){return this._kernelSize}set kernelSize(e){this._kernelSize=e,this.generateKernel(e)}get direction(){return this.uniforms.direction.value}get scale(){return this.uniforms.scale.value}set scale(e){this.uniforms.scale.value=e}generateKernel(e){let t=new W(e),s=t.linearSteps,i=new Float64Array(s*2);for(let n=0,r=0;n<s;++n)i[r++]=t.linearOffsets[n],i[r++]=t.linearWeights[n];this.uniforms.kernel.value=i,this.defines.STEPS=s.toFixed(0),this.needsUpdate=!0}setSize(e,t){this.uniforms.texelSize.value.set(1/e,1/t)}};var y=w("three");var g=w("three"),be=new g.Camera,C=null;function ze(){if(C===null){let l=new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),e=new Float32Array([0,0,2,0,0,2]);C=new g.BufferGeometry,C.setAttribute!==void 0?(C.setAttribute("position",new g.BufferAttribute(l,3)),C.setAttribute("uv",new g.BufferAttribute(e,2))):(C.addAttribute("position",new g.BufferAttribute(l,3)),C.addAttribute("uv",new g.BufferAttribute(e,2)))}return C}var m=class{constructor(e="Pass",t=new g.Scene,s=be){this.name=e,this.renderer=null,this.scene=t,this.camera=s,this.screen=null,this.rtt=!0,this.needsSwap=!0,this.needsDepthTexture=!1,this.enabled=!0}get renderToScreen(){return!this.rtt}set renderToScreen(e){if(this.rtt===e){let t=this.fullscreenMaterial;t!==null&&(t.needsUpdate=!0),this.rtt=!e}}set mainScene(e){}set mainCamera(e){}setRenderer(e){this.renderer=e}isEnabled(){return this.enabled}setEnabled(e){this.enabled=e}get fullscreenMaterial(){return this.screen!==null?this.screen.material:null}set fullscreenMaterial(e){let t=this.screen;t!==null?t.material=e:(t=new g.Mesh(ze(),e),t.frustumCulled=!1,this.scene===null&&(this.scene=new g.Scene),this.scene.add(t),this.screen=t)}getFullscreenMaterial(){return this.fullscreenMaterial}setFullscreenMaterial(e){this.fullscreenMaterial=e}getDepthTexture(){return null}setDepthTexture(e,t=g.BasicDepthPacking){}render(e,t,s,i,n){throw new Error("Render method not implemented!")}setSize(e,t){}initialize(e,t,s){}dispose(){for(let e of Object.keys(this)){let t=this[e];(t instanceof g.WebGLRenderTarget||t instanceof g.Material||t instanceof g.Texture||t instanceof m)&&this[e].dispose()}}};var G=class extends m{constructor(e,t=!0){super("CopyPass"),this.fullscreenMaterial=new E,this.needsSwap=!1,this.renderTarget=e,e===void 0&&(this.renderTarget=new y.WebGLRenderTarget(1,1,{minFilter:y.LinearFilter,magFilter:y.LinearFilter,stencilBuffer:!1,depthBuffer:!1}),this.renderTarget.texture.name="CopyPass.Target"),this.autoResize=t}get resize(){return this.autoResize}set resize(e){this.autoResize=e}get texture(){return this.renderTarget.texture}getTexture(){return this.renderTarget.texture}setAutoResizeEnabled(e){this.autoResize=e}render(e,t,s,i,n){this.fullscreenMaterial.inputBuffer=t.texture,e.setRenderTarget(this.renderToScreen?null:this.renderTarget),e.render(this.scene,this.camera)}setSize(e,t){this.autoResize&&this.renderTarget.setSize(e,t)}initialize(e,t,s){s!==void 0&&(this.renderTarget.texture.type=s,s!==y.UnsignedByteType?this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1":e.outputEncoding===y.sRGBEncoding&&(this.renderTarget.texture.encoding=y.sRGBEncoding))}};var N=class extends m{constructor(){super("ClearMaskPass",null,null),this.needsSwap=!1}render(e,t,s,i,n){let r=e.state.buffers.stencil;r.setLocked(!1),r.setTest(!1)}};var le=w("three");var oe=new le.Color,U=class extends m{constructor(e=!0,t=!0,s=!1){super("ClearPass",null,null),this.needsSwap=!1,this.color=e,this.depth=t,this.stencil=s,this.overrideClearColor=null,this.overrideClearAlpha=-1}setClearFlags(e,t,s){this.color=e,this.depth=t,this.stencil=s}getOverrideClearColor(){return this.overrideClearColor}setOverrideClearColor(e){this.overrideClearColor=e}getOverrideClearAlpha(){return this.overrideClearAlpha}setOverrideClearAlpha(e){this.overrideClearAlpha=e}render(e,t,s,i,n){let r=this.overrideClearColor,a=this.overrideClearAlpha,o=e.getClearAlpha(),h=r!==null,u=a>=0;h?(e.getClearColor(oe),e.setClearColor(r,u?a:o)):u&&e.setClearAlpha(a),e.setRenderTarget(this.renderToScreen?null:t),e.clear(this.color,this.depth,this.stencil),h?e.setClearColor(oe,o):u&&e.setClearAlpha(o)}};var I=w("three"),k=-1,z=class extends I.EventDispatcher{constructor(e,t=k,s=k,i=1){super(),this.resizable=e,this.baseSize=new I.Vector2(1,1),this.preferredSize=new I.Vector2(t,s),this.target=this.preferredSize,this.s=i,this.effectiveSize=new I.Vector2,this.addEventListener("change",()=>this.updateEffectiveSize()),this.updateEffectiveSize()}updateEffectiveSize(){let e=this.baseSize,t=this.preferredSize,s=this.effectiveSize,i=this.scale;t.width!==k?s.width=t.width:t.height!==k?s.width=Math.round(t.height*(e.width/Math.max(e.height,1))):s.width=Math.round(e.width*i),t.height!==k?s.height=t.height:t.width!==k?s.height=Math.round(t.width/Math.max(e.width/Math.max(e.height,1),1)):s.height=Math.round(e.height*i)}get width(){return this.effectiveSize.width}set width(e){this.preferredWidth=e}get height(){return this.effectiveSize.height}set height(e){this.preferredHeight=e}getWidth(){return this.width}getHeight(){return this.height}get scale(){return this.s}set scale(e){this.s!==e&&(this.s=e,this.preferredSize.setScalar(k),this.dispatchEvent({type:"change"}),this.resizable.setSize(this.baseSize.width,this.baseSize.height))}getScale(){return this.scale}setScale(e){this.scale=e}get baseWidth(){return this.baseSize.width}set baseWidth(e){this.baseSize.width!==e&&(this.baseSize.width=e,this.dispatchEvent({type:"change"}),this.resizable.setSize(this.baseSize.width,this.baseSize.height))}getBaseWidth(){return this.baseWidth}setBaseWidth(e){this.baseWidth=e}get baseHeight(){return this.baseSize.height}set baseHeight(e){this.baseSize.height!==e&&(this.baseSize.height=e,this.dispatchEvent({type:"change"}),this.resizable.setSize(this.baseSize.width,this.baseSize.height))}getBaseHeight(){return this.baseHeight}setBaseHeight(e){this.baseHeight=e}setBaseSize(e,t){(this.baseSize.width!==e||this.baseSize.height!==t)&&(this.baseSize.set(e,t),this.dispatchEvent({type:"change"}),this.resizable.setSize(this.baseSize.width,this.baseSize.height))}get preferredWidth(){return this.preferredSize.width}set preferredWidth(e){this.preferredSize.width!==e&&(this.preferredSize.width=e,this.dispatchEvent({type:"change"}),this.resizable.setSize(this.baseSize.width,this.baseSize.height))}getPreferredWidth(){return this.preferredWidth}setPreferredWidth(e){this.preferredWidth=e}get preferredHeight(){return this.preferredSize.height}set preferredHeight(e){this.preferredSize.height!==e&&(this.preferredSize.height=e,this.dispatchEvent({type:"change"}),this.resizable.setSize(this.baseSize.width,this.baseSize.height))}getPreferredHeight(){return this.preferredHeight}setPreferredHeight(e){this.preferredHeight=e}setPreferredSize(e,t){(this.preferredSize.width!==e||this.preferredSize.height!==t)&&(this.preferredSize.set(e,t),this.dispatchEvent({type:"change"}),this.resizable.setSize(this.baseSize.width,this.baseSize.height))}copy(e){this.s=e.scale,this.baseSize.set(e.baseWidth,e.baseHeight),this.preferredSize.set(e.preferredWidth,e.preferredHeight),this.dispatchEvent({type:"change"}),this.resizable.setSize(this.baseSize.width,this.baseSize.height)}static get AUTO_SIZE(){return k}};var b=w("three"),$=!1,_=class{constructor(e=null){this.originalMaterials=new Map,this.material=null,this.materials=null,this.materialsBackSide=null,this.materialsDoubleSide=null,this.materialsFlatShaded=null,this.materialsFlatShadedBackSide=null,this.materialsFlatShadedDoubleSide=null,this.setMaterial(e),this.meshCount=0,this.replaceMaterial=t=>{if(t.isMesh){let s;if(t.material.flatShading)switch(t.material.side){case b.DoubleSide:s=this.materialsFlatShadedDoubleSide;break;case b.BackSide:s=this.materialsFlatShadedBackSide;break;default:s=this.materialsFlatShaded;break}else switch(t.material.side){case b.DoubleSide:s=this.materialsDoubleSide;break;case b.BackSide:s=this.materialsBackSide;break;default:s=this.materials;break}this.originalMaterials.set(t,t.material),t.isSkinnedMesh?t.material=s[2]:t.isInstancedMesh?t.material=s[1]:t.material=s[0],++this.meshCount}}}setMaterial(e){if(this.disposeMaterials(),this.material=e,e!==null){let t=this.materials=[e.clone(),e.clone(),e.clone()];for(let s of t)s.uniforms=Object.assign({},e.uniforms),s.side=b.FrontSide;t[2].skinning=!0,this.materialsBackSide=t.map(s=>{let i=s.clone();return i.uniforms=Object.assign({},e.uniforms),i.side=b.BackSide,i}),this.materialsDoubleSide=t.map(s=>{let i=s.clone();return i.uniforms=Object.assign({},e.uniforms),i.side=b.DoubleSide,i}),this.materialsFlatShaded=t.map(s=>{let i=s.clone();return i.uniforms=Object.assign({},e.uniforms),i.flatShading=!0,i}),this.materialsFlatShadedBackSide=t.map(s=>{let i=s.clone();return i.uniforms=Object.assign({},e.uniforms),i.flatShading=!0,i.side=b.BackSide,i}),this.materialsFlatShadedDoubleSide=t.map(s=>{let i=s.clone();return i.uniforms=Object.assign({},e.uniforms),i.flatShading=!0,i.side=b.DoubleSide,i})}}render(e,t,s){let i=e.shadowMap.enabled;if(e.shadowMap.enabled=!1,$){let n=this.originalMaterials;this.meshCount=0,t.traverse(this.replaceMaterial),e.render(t,s);for(let r of n)r[0].material=r[1];this.meshCount!==n.size&&n.clear()}else{let n=t.overrideMaterial;t.overrideMaterial=this.material,e.render(t,s),t.overrideMaterial=n}e.shadowMap.enabled=i}disposeMaterials(){if(this.material!==null){let e=this.materials.concat(this.materialsBackSide).concat(this.materialsDoubleSide).concat(this.materialsFlatShaded).concat(this.materialsFlatShadedBackSide).concat(this.materialsFlatShadedDoubleSide);for(let t of e)t.dispose()}}dispose(){this.originalMaterials.clear(),this.disposeMaterials()}static get workaroundEnabled(){return $}static set workaroundEnabled(e){$=e}};var K=class extends m{constructor(e,t,s=null){super("RenderPass",e,t),this.needsSwap=!1,this.clearPass=new U,this.overrideMaterialManager=s===null?null:new _(s),this.ignoreBackground=!1,this.skipShadowMapUpdate=!1,this.selection=null}set mainScene(e){this.scene=e}set mainCamera(e){this.camera=e}get renderToScreen(){return super.renderToScreen}set renderToScreen(e){super.renderToScreen=e,this.clearPass.renderToScreen=e}get overrideMaterial(){let e=this.overrideMaterialManager;return e!==null?e.material:null}set overrideMaterial(e){let t=this.overrideMaterialManager;e!==null?t!==null?t.setMaterial(e):this.overrideMaterialManager=new _(e):t!==null&&(t.dispose(),this.overrideMaterialManager=null)}getOverrideMaterial(){return this.overrideMaterial}setOverrideMaterial(e){this.overrideMaterial=e}get clear(){return this.clearPass.enabled}set clear(e){this.clearPass.enabled=e}getSelection(){return this.selection}setSelection(e){this.selection=e}isBackgroundDisabled(){return this.ignoreBackground}setBackgroundDisabled(e){this.ignoreBackground=e}isShadowMapDisabled(){return this.skipShadowMapUpdate}setShadowMapDisabled(e){this.skipShadowMapUpdate=e}getClearPass(){return this.clearPass}render(e,t,s,i,n){let r=this.scene,a=this.camera,o=this.selection,h=a.layers.mask,u=r.background,v=e.shadowMap.autoUpdate,d=this.renderToScreen?null:t;o!==null&&a.layers.set(o.getLayer()),this.skipShadowMapUpdate&&(e.shadowMap.autoUpdate=!1),(this.ignoreBackground||this.clearPass.overrideClearColor!==null)&&(r.background=null),this.clearPass.enabled&&this.clearPass.render(e,t),e.setRenderTarget(d),this.overrideMaterialManager!==null?this.overrideMaterialManager.render(e,r,a):e.render(r,a),a.layers.mask=h,r.background=u,e.shadowMap.autoUpdate=v}};var R=w("three");var V=class extends m{constructor({kernelSize:e=35,iterations:t=1,resolutionScale:s=1,resolutionX:i=z.AUTO_SIZE,resolutionY:n=z.AUTO_SIZE}={}){super("GaussianBlurPass"),this.renderTargetA=new R.WebGLRenderTarget(1,1,{depthBuffer:!1}),this.renderTargetA.texture.name="Blur.Target.A",this.renderTargetB=this.renderTargetA.clone(),this.renderTargetB.texture.name="Blur.Target.B",this.blurMaterial=new H({kernelSize:e}),this.copyMaterial=new E,this.copyMaterial.inputBuffer=this.renderTargetB.texture;let r=this.resolution=new z(this,i,n,s);r.addEventListener("change",a=>this.setSize(r.baseWidth,r.baseHeight)),this.iterations=t}render(e,t,s,i,n){let r=this.scene,a=this.camera,o=this.renderTargetA,h=this.renderTargetB,u=this.blurMaterial;this.fullscreenMaterial=u;let v=t;for(let d=0,p=Math.max(this.iterations,1);d<p;++d)u.direction.set(1,0),u.inputBuffer=v.texture,e.setRenderTarget(o),e.render(r,a),u.direction.set(0,1),u.inputBuffer=o.texture,e.setRenderTarget(h),e.render(r,a),d===0&&p>1&&(v=h);this.fullscreenMaterial=this.copyMaterial,e.setRenderTarget(this.renderToScreen?null:s),e.render(r,a)}setSize(e,t){let s=this.resolution;s.setBaseSize(e,t);let i=s.width,n=s.height;this.renderTargetA.setSize(i,n),this.renderTargetB.setSize(i,n),this.blurMaterial.setSize(e,t)}initialize(e,t,s){s!==void 0&&(this.renderTargetA.texture.type=s,this.renderTargetB.texture.type=s,s!==R.UnsignedByteType?(this.blurMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1",this.copyMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1"):e.outputEncoding===R.sRGBEncoding&&(this.renderTargetA.texture.encoding=R.sRGBEncoding,this.renderTargetB.texture.encoding=R.sRGBEncoding))}};var P=w("three");var j=class extends m{constructor({kernelSize:e=D.MEDIUM,resolutionScale:t=.5,width:s=z.AUTO_SIZE,height:i=z.AUTO_SIZE,resolutionX:n=s,resolutionY:r=i}={}){super("KawaseBlurPass"),this.renderTargetA=new P.WebGLRenderTarget(1,1,{depthBuffer:!1}),this.renderTargetA.texture.name="Blur.Target.A",this.renderTargetB=this.renderTargetA.clone(),this.renderTargetB.texture.name="Blur.Target.B";let a=this.resolution=new z(this,n,r,t);a.addEventListener("change",o=>this.setSize(a.baseWidth,a.baseHeight)),this._blurMaterial=new L,this._blurMaterial.kernelSize=e,this.copyMaterial=new E}getResolution(){return this.resolution}get blurMaterial(){return this._blurMaterial}set blurMaterial(e){this._blurMaterial=e}get dithering(){return this.copyMaterial.dithering}set dithering(e){this.copyMaterial.dithering=e}get kernelSize(){return this.blurMaterial.kernelSize}set kernelSize(e){this.blurMaterial.kernelSize=e}get width(){return this.resolution.width}set width(e){this.resolution.preferredWidth=e}get height(){return this.resolution.height}set height(e){this.resolution.preferredHeight=e}get scale(){return this.blurMaterial.scale}set scale(e){this.blurMaterial.scale=e}getScale(){return this.blurMaterial.scale}setScale(e){this.blurMaterial.scale=e}getKernelSize(){return this.kernelSize}setKernelSize(e){this.kernelSize=e}getResolutionScale(){return this.resolution.scale}setResolutionScale(e){this.resolution.scale=e}render(e,t,s,i,n){let r=this.scene,a=this.camera,o=this.renderTargetA,h=this.renderTargetB,u=this.blurMaterial,v=u.kernelSequence,d=t;this.fullscreenMaterial=u;for(let p=0,B=v.length;p<B;++p){let M=p&1?h:o;u.kernel=v[p],u.inputBuffer=d.texture,e.setRenderTarget(M),e.render(r,a),d=M}this.fullscreenMaterial=this.copyMaterial,this.copyMaterial.inputBuffer=d.texture,e.setRenderTarget(this.renderToScreen?null:s),e.render(r,a)}setSize(e,t){let s=this.resolution;s.setBaseSize(e,t);let i=s.width,n=s.height;this.renderTargetA.setSize(i,n),this.renderTargetB.setSize(i,n),this.blurMaterial.setSize(e,t)}initialize(e,t,s){s!==void 0&&(this.renderTargetA.texture.type=s,this.renderTargetB.texture.type=s,s!==P.UnsignedByteType?(this.blurMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1",this.copyMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1"):e.outputEncoding===P.sRGBEncoding&&(this.renderTargetA.texture.encoding=P.sRGBEncoding,this.renderTargetB.texture.encoding=P.sRGBEncoding))}static get AUTO_SIZE(){return z.AUTO_SIZE}};var q=class extends m{constructor(e,t){super("MaskPass",e,t),this.needsSwap=!1,this.clearPass=new U(!1,!1,!0),this.inverse=!1}set mainScene(e){this.scene=e}set mainCamera(e){this.camera=e}get inverted(){return this.inverse}set inverted(e){this.inverse=e}get clear(){return this.clearPass.enabled}set clear(e){this.clearPass.enabled=e}getClearPass(){return this.clearPass}isInverted(){return this.inverted}setInverted(e){this.inverted=e}render(e,t,s,i,n){let r=e.getContext(),a=e.state.buffers,o=this.scene,h=this.camera,u=this.clearPass,v=this.inverted?0:1,d=1-v;a.color.setMask(!1),a.depth.setMask(!1),a.color.setLocked(!0),a.depth.setLocked(!0),a.stencil.setTest(!0),a.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),a.stencil.setFunc(r.ALWAYS,v,4294967295),a.stencil.setClear(d),a.stencil.setLocked(!0),this.clearPass.enabled&&(this.renderToScreen?u.render(e,null):(u.render(e,t),u.render(e,s))),this.renderToScreen?(e.setRenderTarget(null),e.render(o,h)):(e.setRenderTarget(t),e.render(o,h),e.setRenderTarget(s),e.render(o,h)),a.color.setLocked(!1),a.depth.setLocked(!1),a.stencil.setLocked(!1),a.stencil.setFunc(r.EQUAL,1,4294967295),a.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),a.stencil.setLocked(!0)}};var Z=class{constructor(){this.previousTime=0,this.currentTime=0,this._delta=0,this._elapsed=0,this._fixedDelta=1e3/60,this.timescale=1,this.useFixedDelta=!1,this._autoReset=!1}get autoReset(){return this._autoReset}set autoReset(e){typeof document!="undefined"&&document.hidden!==void 0&&(e?document.addEventListener("visibilitychange",this):document.removeEventListener("visibilitychange",this),this._autoReset=e)}get delta(){return this._delta*.001}get fixedDelta(){return this._fixedDelta*.001}set fixedDelta(e){this._fixedDelta=e*1e3}get elapsed(){return this._elapsed*.001}update(e){this.useFixedDelta?this._delta=this.fixedDelta:(this.previousTime=this.currentTime,this.currentTime=e!==void 0?e:performance.now(),this._delta=this.currentTime-this.previousTime),this._delta*=this.timescale,this._elapsed+=this._delta}reset(){this._delta=0,this._elapsed=0,this.currentTime=performance.now()}handleEvent(e){document.hidden||(this.currentTime=performance.now())}dispose(){this.autoReset=!1}};var Q=class{constructor(e=null,{depthBuffer:t=!0,stencilBuffer:s=!1,multisampling:i=0,frameBufferType:n}={}){this.renderer=null,this.inputBuffer=this.createBuffer(t,s,n,i),this.outputBuffer=this.inputBuffer.clone(),this.copyPass=new G,this.depthTexture=null,this.passes=[],this.timer=new Z,this.autoRenderToScreen=!0,this.setRenderer(e)}get multisampling(){return this.inputBuffer.samples||0}set multisampling(e){let t=this.inputBuffer,s=this.multisampling;s>0&&e>0?(this.inputBuffer.samples=e,this.outputBuffer.samples=e,this.inputBuffer.dispose(),this.outputBuffer.dispose()):s!==e&&(this.inputBuffer.dispose(),this.outputBuffer.dispose(),this.inputBuffer=this.createBuffer(t.depthBuffer,t.stencilBuffer,t.texture.type,e),this.inputBuffer.depthTexture=this.depthTexture,this.outputBuffer=this.inputBuffer.clone())}getTimer(){return this.timer}getRenderer(){return this.renderer}setRenderer(e){if(this.renderer=e,e!==null){let t=e.getSize(new f.Vector2),s=e.getContext().getContextAttributes().alpha,i=this.inputBuffer.texture.type;i===f.UnsignedByteType&&e.outputEncoding===f.sRGBEncoding&&(this.inputBuffer.texture.encoding=f.sRGBEncoding,this.outputBuffer.texture.encoding=f.sRGBEncoding,this.inputBuffer.dispose(),this.outputBuffer.dispose()),e.autoClear=!1,this.setSize(t.width,t.height);for(let n of this.passes)n.initialize(e,s,i)}}replaceRenderer(e,t=!0){let s=this.renderer,i=s.domElement.parentNode;return this.setRenderer(e),t&&i!==null&&(i.removeChild(s.domElement),i.appendChild(e.domElement)),s}createDepthTexture(){let e=this.depthTexture=new f.DepthTexture;return this.inputBuffer.depthTexture=e,this.inputBuffer.dispose(),this.inputBuffer.stencilBuffer?(e.format=f.DepthStencilFormat,e.type=f.UnsignedInt248Type):e.type=f.UnsignedIntType,e}deleteDepthTexture(){if(this.depthTexture!==null){this.depthTexture.dispose(),this.depthTexture=null,this.inputBuffer.depthTexture=null,this.inputBuffer.dispose();for(let e of this.passes)e.setDepthTexture(null)}}createBuffer(e,t,s,i){let n=this.renderer,r=n===null?new f.Vector2:n.getDrawingBufferSize(new f.Vector2),a={minFilter:f.LinearFilter,magFilter:f.LinearFilter,stencilBuffer:t,depthBuffer:e,type:s},o=new f.WebGLRenderTarget(r.width,r.height,a);return i>0&&(o.ignoreDepthForMultisampleCopy=!1,o.samples=i),s===f.UnsignedByteType&&n!==null&&n.outputEncoding===f.sRGBEncoding&&(o.texture.encoding=f.sRGBEncoding),o.texture.name="EffectComposer.Buffer",o.texture.generateMipmaps=!1,o}setMainScene(e){for(let t of this.passes)t.mainScene=e}setMainCamera(e){for(let t of this.passes)t.mainCamera=e}addPass(e,t){let s=this.passes,i=this.renderer,n=i.getDrawingBufferSize(new f.Vector2),r=i.getContext().getContextAttributes().alpha,a=this.inputBuffer.texture.type;if(e.setRenderer(i),e.setSize(n.width,n.height),e.initialize(i,r,a),this.autoRenderToScreen&&(s.length>0&&(s[s.length-1].renderToScreen=!1),e.renderToScreen&&(this.autoRenderToScreen=!1)),t!==void 0?s.splice(t,0,e):s.push(e),this.autoRenderToScreen&&(s[s.length-1].renderToScreen=!0),e.needsDepthTexture||this.depthTexture!==null)if(this.depthTexture===null){let o=this.createDepthTexture();for(e of s)e.setDepthTexture(o)}else e.setDepthTexture(this.depthTexture)}removePass(e){let t=this.passes,s=t.indexOf(e);if(s!==-1&&t.splice(s,1).length>0){if(this.depthTexture!==null){let r=(o,h)=>o||h.needsDepthTexture;t.reduce(r,!1)||(e.getDepthTexture()===this.depthTexture&&e.setDepthTexture(null),this.deleteDepthTexture())}this.autoRenderToScreen&&s===t.length&&(e.renderToScreen=!1,t.length>0&&(t[t.length-1].renderToScreen=!0))}}removeAllPasses(){let e=this.passes;this.deleteDepthTexture(),e.length>0&&(this.autoRenderToScreen&&(e[e.length-1].renderToScreen=!1),this.passes=[])}render(e){let t=this.renderer,s=this.copyPass,i=this.inputBuffer,n=this.outputBuffer,r=!1,a,o,h;e===void 0&&(this.timer.update(),e=this.timer.delta);for(let u of this.passes)u.enabled&&(u.render(t,i,n,e,r),u.needsSwap&&(r&&(s.renderToScreen=u.renderToScreen,a=t.getContext(),o=t.state.buffers.stencil,o.setFunc(a.NOTEQUAL,1,4294967295),s.render(t,i,n,e,r),o.setFunc(a.EQUAL,1,4294967295)),h=i,i=n,n=h),u instanceof q?r=!0:u instanceof N&&(r=!1))}setSize(e,t,s){let i=this.renderer,n=i.getSize(new f.Vector2);(e===void 0||t===void 0)&&(e=n.width,t=n.height),(n.width!==e||n.height!==t)&&i.setSize(e,t,s);let r=i.getDrawingBufferSize(new f.Vector2);this.inputBuffer.setSize(r.width,r.height),this.outputBuffer.setSize(r.width,r.height);for(let a of this.passes)a.setSize(r.width,r.height)}reset(){let e=this.timer.autoReset;this.dispose(),this.autoRenderToScreen=!0,this.timer.autoReset=e}dispose(){for(let e of this.passes)e.dispose();this.passes=[],this.inputBuffer!==null&&this.inputBuffer.dispose(),this.outputBuffer!==null&&this.outputBuffer.dispose(),this.deleteDepthTexture(),this.copyPass.dispose(),this.timer.dispose()}};function he(l){let e;if(l===0)e=new Float64Array(0);else if(l===1)e=new Float64Array([1]);else if(l>1){let t=new Float64Array(l),s=new Float64Array(l);for(let i=1;i<=l;++i){for(let n=0;n<i;++n)s[n]=n===0||n===i-1?1:t[n-1]+t[n];e=s,s=t,t=e}}return e}var W=class{constructor(e,t=2){this.weights=null,this.offsets=null,this.linearWeights=null,this.linearOffsets=null,this.generate(e,t)}get steps(){return this.offsets===null?0:this.offsets.length}get linearSteps(){return this.linearOffsets===null?0:this.linearOffsets.length}generate(e,t){if(e<3||e>1020)throw new Error("The kernel size must be in the range [3, 1020]");let s=e+t*2,i=t>0?he(s).slice(t,-t):he(s),n=Math.floor((i.length-1)/2),r=i.reduce((d,p)=>d+p,0),a=i.slice(n),o=[...Array(n+1).keys()],h=new Float64Array(Math.floor(o.length/2)),u=new Float64Array(h.length);h[0]=a[0]/r;for(let d=1,p=1,B=o.length-1;d<B;d+=2,++p){let M=o[d],A=o[d+1],J=a[d],X=a[d+1],ee=J+X,ge=(M*J+A*X)/ee;h[p]=ee/r,u[p]=ge}for(let d=0,p=a.length,B=1/r;d<p;++d)a[d]*=B;let v=(h.reduce((d,p)=>d+p,0)-h[0]*.5)*2;if(v!==0)for(let d=0,p=h.length,B=1/v;d<p;++d)h[d]*=B;this.offsets=o,this.weights=a,this.linearOffsets=u,this.linearWeights=h}};var pe=w("tweakpane"),Y=w("spatial-controls");var Be=Math.PI/180,ye=180/Math.PI;function ue(l,e=16/9){return Math.atan(Math.tan(l*Be*.5)/e)*ye*2}var O=class{constructor(){this.fps="0",this.timestamp=0,this.acc=0,this.frames=0}update(e){++this.frames,this.acc+=e-this.timestamp,this.timestamp=e,this.acc>=1e3&&(this.fps=this.frames.toFixed(0),this.acc=0,this.frames=0)}};var c=w("three");function ce(){let l=new c.AmbientLight(5390108),e=new c.PointLight(16704176,1,3);e.position.set(0,.93,0),e.castShadow=!0,e.shadow.bias=-.035,e.shadow.mapSize.width=1024,e.shadow.mapSize.height=1024,e.shadow.radius=4;let t=new c.DirectionalLight(16711680,.05);t.position.set(-1,0,0),t.target.position.set(0,0,0);let s=new c.DirectionalLight(65280,.05);s.position.set(1,0,0),s.target.position.set(0,0,0);let i=new c.Group;return i.add(e,t,s,l),i}function de(){let l=new c.PlaneGeometry,e=new c.MeshStandardMaterial({color:16777215}),t=new c.Mesh(l,e),s=new c.Mesh(l,e),i=new c.Mesh(l,e),n=new c.Mesh(l,e),r=new c.Mesh(l,e);t.position.y=-1,t.rotation.x=Math.PI*.5,t.scale.set(2,2,1),s.position.y=-1,s.rotation.x=Math.PI*-.5,s.scale.set(2,2,1),s.receiveShadow=!0,i.position.y=1,i.rotation.x=Math.PI*.5,i.scale.set(2,2,1),i.receiveShadow=!0,n.position.z=-1,n.scale.set(2,2,1),n.receiveShadow=!0,r.position.z=1,r.rotation.y=Math.PI,r.scale.set(2,2,1),r.receiveShadow=!0;let a=new c.Mesh(l,new c.MeshStandardMaterial({color:16711680})),o=new c.Mesh(l,new c.MeshStandardMaterial({color:65280})),h=new c.Mesh(l,new c.MeshStandardMaterial({color:16777215,emissive:16777215}));a.position.x=-1,a.rotation.y=Math.PI*.5,a.scale.set(2,2,1),a.receiveShadow=!0,o.position.x=1,o.rotation.y=Math.PI*-.5,o.scale.set(2,2,1),o.receiveShadow=!0,h.position.y=1-.001,h.rotation.x=Math.PI*.5,h.scale.set(.4,.4,1);let u=new c.Group;return u.add(t,s,i,n,r,a,o,h),u}function fe(){let l=new c.MeshStandardMaterial({color:16777215}),e=new c.Mesh(new c.BoxGeometry(1,1,1),l),t=new c.Mesh(new c.BoxGeometry(1,1,1),l),s=new c.Mesh(new c.SphereGeometry(1,32,32),l);e.position.set(-.35,-.4,-.3),e.rotation.y=Math.PI*.1,e.scale.set(.6,1.2,.6),e.castShadow=!0,t.position.set(.35,-.7,.3),t.rotation.y=Math.PI*-.1,t.scale.set(.6,.6,.6),t.castShadow=!0,s.position.set(-.5,-.7,.6),s.scale.set(.3,.3,.3),s.castShadow=!0;let i=new c.Group;return i.add(e,t,s),i}function Ce(){let l=new Map,e=new S.LoadingManager,t=new S.CubeTextureLoader(e),s=document.baseURI+"img/textures/skies/sunset/",i=".png",n=[s+"px"+i,s+"nx"+i,s+"py"+i,s+"ny"+i,s+"pz"+i,s+"nz"+i];return new Promise((r,a)=>{e.onLoad=()=>r(l),e.onError=o=>a(new Error(`Failed to load ${o}`)),t.load(n,o=>{o.encoding=S.sRGBEncoding,l.set("sky",o)})})}window.addEventListener("load",()=>Ce().then(l=>{S.ColorManagement.legacyMode=!1;let e=new S.WebGLRenderer({powerPreference:"high-performance",antialias:!1,stencil:!1,depth:!1});e.debug.checkShaderErrors=window.location.hostname==="localhost",e.physicallyCorrectLights=!0,e.outputEncoding=S.sRGBEncoding,e.shadowMap.type=S.VSMShadowMap,e.shadowMap.autoUpdate=!1,e.shadowMap.needsUpdate=!0,e.shadowMap.enabled=!0;let t=document.querySelector(".viewport");t.prepend(e.domElement);let s=new S.PerspectiveCamera,i=new Y.SpatialControls(s.position,s.quaternion,e.domElement),n=i.settings;n.general.setMode(Y.ControlMode.THIRD_PERSON),n.rotation.setSensitivity(2.2),n.rotation.setDamping(.05),n.zoom.setDamping(.1),n.translation.setEnabled(!1),i.setPosition(0,0,5);let r=new S.Scene;r.background=l.get("sky"),r.add(ce()),r.add(de()),r.add(fe());let a=new Q(e,{multisampling:Math.min(4,e.capabilities.maxSamples)}),o=new V({resolutionScale:.5,kernelSize:35}),h=new j({resolutionScale:.5,kernelSize:D.MEDIUM});o.renderToScreen=!0,h.renderToScreen=!0,h.enabled=!1,a.addPass(new K(r,s)),a.addPass(o),a.addPass(h);let u=new O,v=new pe.Pane({container:t.querySelector(".tp")});v.addMonitor(u,"fps",{label:"FPS"});let p=v.addFolder({title:"Settings"}).addTab({pages:[{title:"Gaussian"},{title:"Kawase"}]});p.on("select",M=>{o.enabled=M.index===0,h.enabled=M.index===1}),p.pages[0].addInput(o.blurMaterial,"kernelSize",{options:{"7x7":7,"15x15":15,"25x25":25,"35x35":35,"63x63":63,"127x127":127,"255x255":255}}),p.pages[0].addInput(o.blurMaterial,"scale",{min:0,max:2,step:.01}),p.pages[0].addInput(o.resolution,"scale",{label:"resolution",min:.5,max:1,step:.05}),p.pages[0].addInput(o,"iterations",{min:1,max:8,step:1}),p.pages[1].addInput(h.blurMaterial,"kernelSize",{options:D}),p.pages[1].addInput(h.blurMaterial,"scale",{min:0,max:2,step:.01}),p.pages[1].addInput(h.resolution,"scale",{label:"resolution",min:.5,max:1,step:.05});function B(){let M=t.clientWidth,A=t.clientHeight;s.aspect=M/A,s.fov=ue(90,Math.max(s.aspect,16/9)),s.updateProjectionMatrix(),a.setSize(M,A)}window.addEventListener("resize",B),B(),requestAnimationFrame(function M(A){u.update(A),i.update(A),a.render(),requestAnimationFrame(M)})}));})();
