import { hexToOklch, oklchToHex } from "../colorspace";
import type { LightnessStep, Palette } from "../types";

export function applyLightness(
	palette: Palette,
	step: LightnessStep,
): Palette {
	return {
		...palette,
		colors: palette.colors.map((hex) => {
			const { c, h } = hexToOklch(hex);
			return oklchToHex({ l: step.target, c, h });
		}),
	};
}
