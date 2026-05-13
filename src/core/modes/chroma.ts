import { hexToOklch, oklchToHex } from "../colorspace";
import type { ChromaStep, Palette } from "../types";

export function applyChroma(palette: Palette, step: ChromaStep): Palette {
	return {
		...palette,
		colors: palette.colors.map((hex) => {
			const { l, h } = hexToOklch(hex);
			return oklchToHex({ l, c: step.target, h });
		}),
	};
}
