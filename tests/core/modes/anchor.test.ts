import { describe, expect, it } from "vitest";
import { applyAnchor } from "../../../src/core/modes/anchor";
import { chromaOf, hueOf, lightnessOf, mk } from "../helpers";

describe("applyAnchor", () => {
	it("strength=0 leaves the palette unchanged", () => {
		const colors = ["#ff0000", "#00ff00", "#0000ff"];
		const out = applyAnchor(mk(colors, 0), {
			type: "anchor",
			anchorIndex: 0,
			strength: 0,
		});
		expect(out.colors).toEqual(colors);
	});

	it("strength=1 aligns every non-anchor L and C to the anchor", () => {
		// Use low-chroma colors so every hue can reach the anchor's (L, C)
		// without sRGB gamut clipping.
		const palette = mk(["#c08080", "#80c080", "#8080c0"], 0);
		const out = applyAnchor(palette, {
			type: "anchor",
			anchorIndex: 0,
			strength: 1,
		});
		const anchorL = lightnessOf(out.colors[0]);
		const anchorC = chromaOf(out.colors[0]);
		for (const hex of out.colors) {
			expect(lightnessOf(hex)).toBeCloseTo(anchorL, 2);
			expect(chromaOf(hex)).toBeCloseTo(anchorC, 2);
		}
	});

	it("preserves hue of non-anchor colors", () => {
		const palette = mk(["#c08080", "#80c080", "#8080c0"], 0);
		const before = palette.colors.map(hueOf);
		const out = applyAnchor(palette, {
			type: "anchor",
			anchorIndex: 0,
			strength: 1,
		});
		const after = out.colors.map(hueOf);
		for (let i = 0; i < before.length; i++) {
			expect(Math.abs(after[i] - before[i])).toBeLessThan(1);
		}
	});

	it("anchor color itself stays untouched", () => {
		const palette = mk(["#ff0000", "#00ff00", "#0000ff"], 1);
		const out = applyAnchor(palette, {
			type: "anchor",
			anchorIndex: 1,
			strength: 1,
		});
		expect(out.colors[1]).toBe("#00ff00");
	});

	it("returns the palette unchanged on an out-of-range anchor index", () => {
		const palette = mk(["#ff0000", "#00ff00"]);
		const out = applyAnchor(palette, {
			type: "anchor",
			anchorIndex: 99,
			strength: 1,
		});
		expect(out).toBe(palette);
	});
});
