import { hexToOklch, oklchToHex } from "../core/colorspace";
import { DEFAULT_BLEND_COLORS } from "../core/constants";
import type { BlendChain, HexColor } from "../core/types";

const ACHROMATIC_CHROMA_THRESHOLD = 0.02;
const SUGGEST_COUNT = 3;
const SUGGEST_C_FLOOR = 0.05;

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

const PRESET_BUILDERS: ((colors: HexColor[]) => BlendChain)[] = [
  // 1. ベージュ馴染ませ：中央値 L/C でトーン統一 + ベージュ 15%
  (colors) => {
    const oklch = colors.map(hexToOklch);
    const targetL = median(oklch.map((c) => c.l));
    const targetC = Math.min(median(oklch.map((c) => c.c)), 0.12);
    return [
      { type: "tone", targetL, targetC },
      { type: "mix", blendColor: DEFAULT_BLEND_COLORS.beige, ratio: 0.15 },
    ];
  },
  // 2. パステル化：明るめ低彩度トーン + 暖白 10%
  () => [
    { type: "tone", targetL: 0.86, targetC: 0.08 },
    { type: "mix", blendColor: DEFAULT_BLEND_COLORS.warmWhite, ratio: 0.045 },
  ],
  // 3. シック：暗め低彩度トーン + 黒 8%
  () => [
    { type: "tone", targetL: 0.45, targetC: 0.1 },
    { type: "mix", blendColor: "#222222", ratio: 0.08 },
  ],
  // 4. ビビッド：中明度・高彩度トーン
  () => [{ type: "tone", targetL: 0.7, targetC: 0.14 }],
  // 5. なんか暗くするやつ
  () => [
    { type: "chroma", target: 0.03 },
    { type: "mix", blendColor: "#7580ae", ratio: 0.15 },
    { type: "tone", targetL: 0.56, targetC: 0.08 },
  ],
];

export const RECOMMEND_PRESET_COUNT = PRESET_BUILDERS.length;

export function recommendChain(
  colors: HexColor[],
  presetIndex: number
): BlendChain {
  if (colors.length === 0) return [];
  const i =
    ((presetIndex % RECOMMEND_PRESET_COUNT) + RECOMMEND_PRESET_COUNT) %
    RECOMMEND_PRESET_COUNT;
  return PRESET_BUILDERS[i](colors);
}

export function suggestColors(colors: HexColor[]): HexColor[] {
  if (colors.length === 0) {
    return [DEFAULT_BLEND_COLORS.beige, "#A9C5D4", "#D4A9C5"];
  }

  const oklch = colors.map(hexToOklch);
  const chromatic = oklch.filter((c) => c.c > ACHROMATIC_CHROMA_THRESHOLD);

  const targetL = median(oklch.map((c) => c.l));
  const targetC = Math.max(SUGGEST_C_FLOOR, median(oklch.map((c) => c.c)));

  if (chromatic.length === 0) {
    return [0, 120, 240].map((h) => oklchToHex({ l: targetL, c: targetC, h }));
  }

  if (chromatic.length === 1) {
    const baseH = chromatic[0].h;
    return [180, 90, -90].map((delta) =>
      oklchToHex({
        l: targetL,
        c: targetC,
        h: (baseH + delta + 360) % 360,
      })
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
    .map(({ mid }) => oklchToHex({ l: targetL, c: targetC, h: mid }));
}
