import { hexToOklch, oklchToHex } from "../colorspace";
import type { Palette, ToneStep } from "../types";

export function applyTone(palette: Palette, step: ToneStep): Palette {
	return {
		...palette,
		colors: palette.colors.map((hex) => {
			const { h } = hexToOklch(hex);
			return oklchToHex({ l: step.targetL, c: step.targetC, h });
		}),
	};
}
