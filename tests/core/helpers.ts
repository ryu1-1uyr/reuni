import { hexToOklch } from "../../src/core/colorspace";
import type { HexColor, Palette } from "../../src/core/types";

export function mk(colors: HexColor[], anchorIndex?: number): Palette {
	return {
		id: "test",
		name: "test",
		colors,
		anchorIndex,
		createdAt: "2026-01-01T00:00:00.000Z",
	};
}

export function chromaOf(hex: HexColor): number {
	return hexToOklch(hex).c;
}

export function lightnessOf(hex: HexColor): number {
	return hexToOklch(hex).l;
}

export function hueOf(hex: HexColor): number {
	return hexToOklch(hex).h;
}
