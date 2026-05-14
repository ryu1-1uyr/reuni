import { oklchToHex } from "../core/colorspace";
import type { HexColor } from "../core/types";

const PALETTE_SIZE = 5;
const GOLDEN_ANGLE = 137.508;

const BASE_L_MIN = 0.55;
const BASE_L_MAX = 0.8;
const BASE_C_MIN = 0.1;
const BASE_C_MAX = 0.16;

const L_JITTER = 0.05;
const C_JITTER = 0.03;

const L_MIN = 0.35;
const L_MAX = 0.92;
const C_MIN = 0.04;
const C_MAX = 0.22;

function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

function randomInRange(min: number, max: number): number {
	return min + Math.random() * (max - min);
}

export function generateRandomPalette(): HexColor[] {
	const baseH = Math.random() * 360;
	const baseL = randomInRange(BASE_L_MIN, BASE_L_MAX);
	const baseC = randomInRange(BASE_C_MIN, BASE_C_MAX);

	return Array.from({ length: PALETTE_SIZE }, (_, i) => {
		const h = (baseH + i * GOLDEN_ANGLE) % 360;
		const l = clamp(baseL + (Math.random() - 0.5) * 2 * L_JITTER, L_MIN, L_MAX);
		const c = clamp(baseC + (Math.random() - 0.5) * 2 * C_JITTER, C_MIN, C_MAX);
		return oklchToHex({ l, c, h });
	});
}

export function generateRandomColor(): HexColor {
	const h = Math.random() * 360;
	const l = randomInRange(BASE_L_MIN, BASE_L_MAX);
	const c = randomInRange(BASE_C_MIN, BASE_C_MAX);
	return oklchToHex({ l, c, h });
}
