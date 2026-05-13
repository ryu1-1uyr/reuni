import { hexToOklch, oklchToHex } from "../colorspace";
import type { AnchorStep, Palette } from "../types";

export function applyAnchor(palette: Palette, step: AnchorStep): Palette {
	const { anchorIndex, strength } = step;
	if (anchorIndex < 0 || anchorIndex >= palette.colors.length) {
		return palette;
	}
	if (strength === 0) {
		return palette;
	}
	const anchor = hexToOklch(palette.colors[anchorIndex]);
	return {
		...palette,
		colors: palette.colors.map((hex, i) => {
			if (i === anchorIndex) return hex;
			const c = hexToOklch(hex);
			return oklchToHex({
				l: c.l + (anchor.l - c.l) * strength,
				c: c.c + (anchor.c - c.c) * strength,
				h: c.h,
			});
		}),
	};
}
