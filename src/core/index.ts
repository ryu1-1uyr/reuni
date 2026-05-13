import { applyAnchor } from "./modes/anchor";
import { applyMix } from "./modes/blend";
import { applyChroma } from "./modes/chroma";
import { applyLightness } from "./modes/lightness";
import { applyTone } from "./modes/tone";
import type { BlendChain, BlendStep, Palette } from "./types";

export function applyStep(palette: Palette, step: BlendStep): Palette {
	switch (step.type) {
		case "chroma":
			return applyChroma(palette, step);
		case "lightness":
			return applyLightness(palette, step);
		case "tone":
			return applyTone(palette, step);
		case "mix":
			return applyMix(palette, step);
		case "anchor":
			return applyAnchor(palette, step);
	}
}

export function applyChain(palette: Palette, chain: BlendChain): Palette {
	return chain.reduce<Palette>(
		(acc, step) => applyStep(acc, step),
		palette,
	);
}

export { applyAnchor, applyChroma, applyLightness, applyMix, applyTone };
export { hexToOklab, hexToOklch, oklabToHex, oklchToHex } from "./colorspace";
export * from "./types";
export * from "./constants";
