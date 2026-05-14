import { hexToOklch, oklchToHex } from "../core/colorspace";
import { DEFAULT_BLEND_COLORS } from "../core/constants";
import type { BlendChain, HexColor } from "../core/types";

const ACHROMATIC_CHROMA_THRESHOLD = 0.02;
const RECOMMEND_MIX_RATIO = 0.15;
const SUGGEST_COUNT = 3;
const SUGGEST_C_FLOOR = 0.05;

function median(values: number[]): number {
	const sorted = [...values].sort((a, b) => a - b);
	return sorted[Math.floor(sorted.length / 2)];
}

export function recommendChain(colors: HexColor[]): BlendChain {
	if (colors.length === 0) return [];
	const oklch = colors.map(hexToOklch);
	const targetL = median(oklch.map((c) => c.l));
	const targetC = Math.min(median(oklch.map((c) => c.c)), 0.12);
	return [
		{ type: "tone", targetL, targetC },
		{
			type: "mix",
			blendColor: DEFAULT_BLEND_COLORS.beige,
			ratio: RECOMMEND_MIX_RATIO,
		},
	];
}

export function suggestColors(colors: HexColor[]): HexColor[] {
	if (colors.length === 0) {
		return [
			DEFAULT_BLEND_COLORS.beige,
			"#A9C5D4",
			"#D4A9C5",
		];
	}

	const oklch = colors.map(hexToOklch);
	const chromatic = oklch.filter((c) => c.c > ACHROMATIC_CHROMA_THRESHOLD);

	const targetL = median(oklch.map((c) => c.l));
	const targetC = Math.max(
		SUGGEST_C_FLOOR,
		median(oklch.map((c) => c.c)),
	);

	if (chromatic.length === 0) {
		return [0, 120, 240].map((h) =>
			oklchToHex({ l: targetL, c: targetC, h }),
		);
	}

	if (chromatic.length === 1) {
		const baseH = chromatic[0].h;
		return [180, 90, -90].map((delta) =>
			oklchToHex({
				l: targetL,
				c: targetC,
				h: (baseH + delta + 360) % 360,
			}),
		);
	}

	const hues = [...chromatic.map((c) => c.h)].sort((a, b) => a - b);
	const gaps: { mid: number; size: number }[] = [];
	for (let i = 0; i < hues.length; i++) {
		const a = hues[i];
		const isLast = i === hues.length - 1;
		const b = isLast ? hues[0] : hues[i + 1];
		const size = isLast ? 360 - a + b : b - a;
		const mid = isLast ? (a + size / 2) % 360 : (a + b) / 2;
		gaps.push({ mid, size });
	}
	gaps.sort((a, b) => b.size - a.size);

	return gaps
		.slice(0, SUGGEST_COUNT)
		.map(({ mid }) =>
			oklchToHex({ l: targetL, c: targetC, h: mid }),
		);
}
