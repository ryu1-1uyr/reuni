import { hexToOklch } from "../core/colorspace";
import type { HexColor, SortMode } from "../core/types";

export function sortPalette(
	colors: HexColor[],
	mode: SortMode,
): { hex: HexColor; originalIndex: number }[] {
	const indexed = colors.map((hex, originalIndex) => ({ hex, originalIndex }));
	if (mode === "input") return indexed;
	return indexed.sort((a, b) => hexToOklch(b.hex).l - hexToOklch(a.hex).l);
}
