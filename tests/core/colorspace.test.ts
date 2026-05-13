import { describe, expect, it } from "vitest";
import { hexToOklch, oklchToHex } from "../../src/core/colorspace";

describe("colorspace", () => {
	describe("hexToOklch", () => {
		it("converts pure red", () => {
			const oklch = hexToOklch("#ff0000");
			expect(oklch.l).toBeCloseTo(0.628, 2);
			expect(oklch.c).toBeGreaterThan(0.2);
			expect(oklch.h).toBeGreaterThan(20);
			expect(oklch.h).toBeLessThan(40);
		});

		it("converts white", () => {
			const oklch = hexToOklch("#ffffff");
			expect(oklch.l).toBeCloseTo(1, 2);
			expect(oklch.c).toBeCloseTo(0, 2);
		});

		it("converts black", () => {
			const oklch = hexToOklch("#000000");
			expect(oklch.l).toBeCloseTo(0, 2);
			expect(oklch.c).toBeCloseTo(0, 2);
		});

		it("normalizes hue to 0 for achromatic colors", () => {
			const oklch = hexToOklch("#888888");
			expect(oklch.h).toBe(0);
			expect(Number.isFinite(oklch.h)).toBe(true);
		});

		it("throws on invalid input", () => {
			expect(() => hexToOklch("not-a-color")).toThrow();
		});
	});

	describe("oklchToHex round-trip", () => {
		it.each(["#ff0000", "#00ff00", "#888888", "#d4c5a9", "#ffffff", "#000000"])(
			"round-trips %s exactly",
			(hex) => {
				const back = oklchToHex(hexToOklch(hex));
				expect(back).toBe(hex);
			},
		);

		it("near-round-trips colors at the edge of the sRGB gamut", () => {
			// Pure blue sits on the boundary of sRGB, so culori's clampChroma may
			// shave a sliver off. The result should still be visually close.
			const before = hexToOklch("#0000ff");
			const back = oklchToHex(before);
			const after = hexToOklch(back);
			expect(after.l).toBeCloseTo(before.l, 2);
			expect(after.h).toBeCloseTo(before.h, 0);
		});

		it("clips out-of-gamut chroma to a valid sRGB hex", () => {
			const hex = oklchToHex({ l: 0.5, c: 1.0, h: 0 });
			expect(hex).toMatch(/^#[0-9a-f]{6}$/);
		});
	});
});
