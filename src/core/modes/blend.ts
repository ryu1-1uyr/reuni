import { hexToOklab, oklabToHex } from "../colorspace";
import type { MixStep, Palette } from "../types";

export function applyMix(palette: Palette, step: MixStep): Palette {
	const blend = hexToOklab(step.blendColor);
	const blendL = blend.l ?? 0;
	const blendA = blend.a ?? 0;
	const blendB = blend.b ?? 0;
	const ratio = step.ratio;

	return {
		...palette,
		colors: palette.colors.map((hex) => {
			const c = hexToOklab(hex);
			const cl = c.l ?? 0;
			const ca = c.a ?? 0;
			const cb = c.b ?? 0;
			return oklabToHex({
				mode: "oklab",
				l: cl + (blendL - cl) * ratio,
				a: ca + (blendA - ca) * ratio,
				b: cb + (blendB - cb) * ratio,
			});
		}),
	};
}
