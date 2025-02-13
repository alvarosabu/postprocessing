import { Color, PerspectiveCamera } from "three";
import { SpatialControls } from "spatial-controls";
import { calculateVerticalFoV } from "three-demo";
import { ProgressManager } from "../utils/ProgressManager";
import { PostProcessingDemo } from "./PostProcessingDemo";

import * as Sponza from "./objects/Sponza";

import {
	BlendFunction,
	ColorChannel,
	DepthDownsamplingPass,
	EdgeDetectionMode,
	EffectPass,
	NormalPass,
	SSAOEffect,
	SMAAEffect,
	SMAAImageLoader,
	SMAAPreset,
	TextureEffect
} from "../../../src";

/**
 * An SSAO demo.
 */

export class SSAODemo extends PostProcessingDemo {

	/**
	 * Constructs a new SSAO demo.
	 *
	 * @param {EffectComposer} composer - An effect composer.
	 */

	constructor(composer) {

		super("ssao", composer);

		/**
		 * An SSAO effect.
		 *
		 * @type {Effect}
		 * @private
		 */

		this.ssaoEffect = null;

		/**
		 * A texture effect.
		 *
		 * @type {Effect}
		 * @private
		 */

		this.textureEffect = null;

		/**
		 * A depth downsampling pass.
		 *
		 * @type {Pass}
		 * @private
		 */

		this.depthDownsamplingPass = null;

		/**
		 * An effect pass.
		 *
		 * @type {Pass}
		 * @private
		 */

		this.effectPass = null;

	}

	load() {

		const assets = this.assets;
		const loadingManager = this.loadingManager;
		const smaaImageLoader = new SMAAImageLoader(loadingManager);

		const anisotropy = Math.min(this.composer.getRenderer()
			.capabilities.getMaxAnisotropy(), 8);

		return new Promise((resolve, reject) => {

			if(assets.size === 0) {

				loadingManager.onLoad = () => setTimeout(resolve, 250);
				loadingManager.onProgress = ProgressManager.updateProgress;
				loadingManager.onError = url => console.error(`Failed to load ${url}`);

				Sponza.load(assets, loadingManager, anisotropy);

				smaaImageLoader.load(([search, area]) => {

					assets.set("smaa-search", search);
					assets.set("smaa-area", area);

				});

			} else {

				resolve();

			}

		});

	}

	initialize() {

		const scene = this.scene;
		const assets = this.assets;
		const composer = this.composer;
		const renderer = composer.getRenderer();
		const domElement = renderer.domElement;
		const capabilities = renderer.capabilities;

		// Camera

		const aspect = window.innerWidth / window.innerHeight;
		const vFoV = calculateVerticalFoV(90, Math.max(aspect, 16 / 9));
		const camera = new PerspectiveCamera(vFoV, aspect, 0.3, 1000);
		this.camera = camera;

		// Controls

		const { position, quaternion } = camera;
		const controls = new SpatialControls(position, quaternion, domElement);
		const settings = controls.settings;
		settings.rotation.setSensitivity(2.2);
		settings.rotation.setDamping(0.05);
		settings.translation.setSensitivity(3.0);
		settings.translation.setDamping(0.1);
		controls.setPosition(9.5, 1.65, -0.25);
		controls.lookAt(8.5, 1.65, -0.25);
		this.controls = controls;

		// Sky

		scene.background = new Color(0xeeeeee);

		// Lights

		scene.add(...Sponza.createLights());

		// Objects

		scene.add(assets.get(Sponza.tag));

		// Passes

		const normalPass = new NormalPass(scene, camera);
		const depthDownsamplingPass = new DepthDownsamplingPass({
			normalBuffer: normalPass.texture,
			resolutionScale: 0.5
		});

		const normalDepthBuffer = capabilities.isWebGL2 ?
			depthDownsamplingPass.texture : null;

		const smaaEffect = new SMAAEffect(
			assets.get("smaa-search"),
			assets.get("smaa-area"),
			SMAAPreset.HIGH,
			EdgeDetectionMode.DEPTH
		);

		smaaEffect.edgeDetectionMaterial.setEdgeDetectionThreshold(0.01);

		// Note: Thresholds and falloff correspond to camera near/far.
		// Example: worldDistance = distanceThreshold * (camera.far - camera.near)
		const ssaoEffect = new SSAOEffect(camera, normalPass.texture, {
			blendFunction: BlendFunction.MULTIPLY,
			distanceScaling: true,
			depthAwareUpsampling: true,
			normalDepthBuffer,
			samples: 9,
			rings: 7,
			distanceThreshold: 0.02,	// Render up to a distance of ~20 world units
			distanceFalloff: 0.0025,	// with an additional ~2.5 units of falloff.
			rangeThreshold: 0.0003,		// Occlusion proximity of ~0.3 world units
			rangeFalloff: 0.0001,			// with ~0.1 units of falloff.
			luminanceInfluence: 0.7,
			minRadiusScale: 0.33,
			radius: 0.1,
			intensity: 1.33,
			bias: 0.025,
			fade: 0.01,
			color: null,
			resolutionScale: 0.5
		});

		const textureEffect = new TextureEffect({
			blendFunction: BlendFunction.SKIP,
			texture: depthDownsamplingPass.texture
		});

		const effectPass = new EffectPass(camera, smaaEffect, ssaoEffect, textureEffect);

		this.ssaoEffect = ssaoEffect;
		this.textureEffect = textureEffect;
		this.depthDownsamplingPass = depthDownsamplingPass;
		this.effectPass = effectPass;

		composer.addPass(normalPass);

		if(capabilities.isWebGL2) {

			composer.addPass(depthDownsamplingPass);

		} else {

			console.log("WebGL 2 not supported, falling back to naive depth downsampling");

		}

		composer.addPass(effectPass);

	}

	registerOptions(menu) {

		const color = new Color();
		const capabilities = this.composer.getRenderer().capabilities;

		const effectPass = this.effectPass;
		const depthDownsamplingPass = this.depthDownsamplingPass;

		const ssaoEffect = this.ssaoEffect;
		const textureEffect = this.textureEffect;
		const blendMode = ssaoEffect.blendMode;
		const uniforms = ssaoEffect.ssaoMaterial.uniforms;

		const RenderMode = {
			DEFAULT: 0,
			NORMALS: 1,
			DEPTH: 2
		};

		const params = {
			"distance": {
				"threshold": uniforms.distanceCutoff.value.x,
				"falloff": (uniforms.distanceCutoff.value.y -
					uniforms.distanceCutoff.value.x)
			},
			"proximity": {
				"threshold": uniforms.proximityCutoff.value.x,
				"falloff": (uniforms.proximityCutoff.value.y -
					uniforms.proximityCutoff.value.x)
			},
			"upsampling": {
				"enabled": ssaoEffect.defines.has("DEPTH_AWARE_UPSAMPLING"),
				"threshold": Number(ssaoEffect.defines.get("THRESHOLD"))
			},
			"distanceScaling": {
				"enabled": ssaoEffect.distanceScaling,
				"min scale": uniforms.minRadiusScale.value
			},
			"lum influence": ssaoEffect.uniforms.get("luminanceInfluence").value,
			"intensity": uniforms.intensity.value,
			"bias": uniforms.bias.value,
			"fade": uniforms.fade.value,
			"render mode": RenderMode.DEFAULT,
			"resolution": ssaoEffect.resolution.scale,
			"color": 0x000000,
			"opacity": blendMode.opacity.value,
			"blend mode": blendMode.blendFunction
		};

		function toggleRenderMode() {

			const mode = Number(params["render mode"]);

			if(mode === RenderMode.DEPTH) {

				textureEffect.setTextureSwizzleRGBA(ColorChannel.ALPHA);

			} else if(mode === RenderMode.NORMALS) {

				textureEffect.setTextureSwizzleRGBA(
					ColorChannel.RED,
					ColorChannel.GREEN,
					ColorChannel.BLUE,
					ColorChannel.ALPHA
				);

			}

			textureEffect.blendMode.setBlendFunction((mode !== RenderMode.DEFAULT) ?
				BlendFunction.NORMAL : BlendFunction.SKIP);

			effectPass.encodeOutput = (mode === RenderMode.DEFAULT);

		}

		if(capabilities.isWebGL2) {

			menu.add(params, "render mode", RenderMode).onChange(toggleRenderMode);

		}

		menu.add(params, "resolution", 0.25, 1.0, 0.25).onChange((value) => {

			ssaoEffect.resolution.scale = value;
			depthDownsamplingPass.resolution.scale = value;

		});

		menu.add(ssaoEffect, "samples", 1, 32, 1);
		menu.add(ssaoEffect, "rings", 1, 16, 1);
		menu.add(ssaoEffect, "radius", 1e-6, 1.0, 0.001);

		let f = menu.addFolder("Distance Scaling");

		f.add(params.distanceScaling, "enabled").onChange((value) => {

			ssaoEffect.distanceScaling = value;

		});

		f.add(params.distanceScaling, "min scale", 0.0, 1.0, 0.001)
			.onChange((value) => {

				uniforms.minRadiusScale.value = value;

			});

		if(capabilities.isWebGL2) {

			f = menu.addFolder("Depth-Aware Upsampling");

			f.add(params.upsampling, "enabled").onChange((value) => {

				ssaoEffect.depthAwareUpsampling = value;

			});

			f.add(params.upsampling, "threshold", 0.0, 1.0, 0.001)
				.onChange((value) => {

					// Note: This threshold is not really supposed to be changed.
					ssaoEffect.defines.set("THRESHOLD", value.toFixed(3));
					effectPass.recompile();

				});

		}

		f = menu.addFolder("Distance Cutoff");

		f.add(params.distance, "threshold", 0.0, 1.0, 0.0001).onChange((value) => {

			ssaoEffect.setDistanceCutoff(value, params.distance.falloff);

		});

		f.add(params.distance, "falloff", 0.0, 1.0, 0.0001).onChange((value) => {

			ssaoEffect.setDistanceCutoff(params.distance.threshold, value);

		});

		f = menu.addFolder("Proximity Cutoff");

		f.add(params.proximity, "threshold", 0.0, 0.01, 0.0001)
			.onChange((value) => {

				ssaoEffect.setProximityCutoff(value, params.proximity.falloff);

			});

		f.add(params.proximity, "falloff", 0.0, 0.01, 0.0001).onChange((value) => {

			ssaoEffect.setProximityCutoff(params.proximity.threshold, value);

		});

		menu.add(params, "bias", 0.0, 1.0, 0.001).onChange((value) => {

			uniforms.bias.value = value;

		});

		menu.add(params, "fade", 0.0, 1.0, 0.001).onChange((value) => {

			uniforms.fade.value = value;

		});

		menu.add(params, "lum influence", 0.0, 1.0, 0.001).onChange((value) => {

			ssaoEffect.uniforms.get("luminanceInfluence").value = value;

		});

		menu.add(params, "intensity", 1.0, 4.0, 0.01).onChange((value) => {

			ssaoEffect.ssaoMaterial.intensity = value;

		});

		menu.addColor(params, "color").onChange((value) => {

			ssaoEffect.color = (value === 0x000000) ? null :
				color.setHex(value).convertSRGBToLinear();

		});

		menu.add(params, "opacity", 0.0, 1.0, 0.001).onChange((value) => {

			blendMode.opacity.value = value;

		});

		menu.add(params, "blend mode", BlendFunction).onChange((value) => {

			blendMode.setBlendFunction(Number(value));

		});

		if(window.innerWidth < 720) {

			menu.close();

		}

	}

}
