import { clampChroma, converter, formatHex, parse } from "culori";
import type { Oklab, Oklch } from "culori";
import type { HexColor, OklchColor } from "./types";

const toOklch = converter("oklch");
const toOklab = converter("oklab");
const toRgb = converter("rgb");

export function hexToOklch(hex: HexColor): OklchColor {
	const parsed = parse(hex);
	if (!parsed) {
		throw new Error(`Invalid color string: ${hex}`);
	}
	const oklch = toOklch(parsed);
	return {
		l: oklch.l ?? 0,
		c: oklch.c ?? 0,
		h: Number.isFinite(oklch.h) ? (oklch.h as number) : 0,
	};
}

export function oklchToHex(oklch: OklchColor): HexColor {
	const culoriColor: Oklch = {
		mode: "oklch",
		l: oklch.l,
		c: oklch.c,
		h: oklch.h,
	};
	const clamped = clampChroma(culoriColor, "oklch");
	const rgb = toRgb(clamped);
	const hex = formatHex(rgb);
	if (!hex) {
		throw new Error(
			`Failed to format OKLCH to hex: ${JSON.stringify(oklch)}`,
		);
	}
	return hex;
}

export function hexToOklab(hex: HexColor): Oklab {
	const parsed = parse(hex);
	if (!parsed) {
		throw new Error(`Invalid color string: ${hex}`);
	}
	return toOklab(parsed);
}

export function oklabToHex(oklab: Oklab): HexColor {
	const rgb = toRgb(oklab);
	const hex = formatHex(rgb);
	if (!hex) {
		throw new Error(`Failed to format OKLab to hex: ${JSON.stringify(oklab)}`);
	}
	return hex;
}
