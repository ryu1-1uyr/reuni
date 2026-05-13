import { describe, expect, it } from "vitest";
import { applyLightness } from "../../../src/core/modes/lightness";
import { lightnessOf, mk } from "../helpers";

describe("applyLightness", () => {
	it("works on a single-color palette", () => {
		const out = applyLightness(mk(["#ff0000"]), {
			type: "lightness",
			target: 0.5,
		});
		expect(lightnessOf(out.colors[0])).toBeCloseTo(0.5, 2);
	});

	it("keeps an already-aligned palette near the target", () => {
		const palette = mk(["#ff0000", "#00ff00", "#0000ff"]);
		const aligned = applyLightness(palette, {
			type: "lightness",
			target: 0.6,
		});
		for (const hex of aligned.colors) {
			expect(lightnessOf(hex)).toBeCloseTo(0.6, 2);
		}
	});

	it("converges a bunched palette to the target lightness", () => {
		const out = applyLightness(mk(["#000000", "#ffffff", "#ff0000", "#0000ff"]), {
			type: "lightness",
			target: 0.5,
		});
		for (const hex of out.colors) {
			expect(lightnessOf(hex)).toBeCloseTo(0.5, 2);
		}
	});

	it("returns a new palette (immutability)", () => {
		const palette = mk(["#ff0000"]);
		const out = applyLightness(palette, { type: "lightness", target: 0.5 });
		expect(out).not.toBe(palette);
		expect(palette.colors[0]).toBe("#ff0000");
	});
});
