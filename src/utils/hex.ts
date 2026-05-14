import type { HexColor } from "../core/types";

const HEX_PATTERN = /^#?([0-9a-fA-F]{6})$/;
const SHORT_HEX_PATTERN = /^#?([0-9a-fA-F]{3})$/;

export function normalizeHex(input: string): HexColor | null {
	const trimmed = input.trim();
	const longMatch = trimmed.match(HEX_PATTERN);
	if (longMatch) return `#${longMatch[1].toLowerCase()}`;
	const shortMatch = trimmed.match(SHORT_HEX_PATTERN);
	if (shortMatch) {
		const [r, g, b] = shortMatch[1].toLowerCase();
		return `#${r}${r}${g}${g}${b}${b}`;
	}
	return null;
}
