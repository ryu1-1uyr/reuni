import { describe, expect, it } from "vitest";
import { applyTone } from "../../../src/core/modes/tone";
import { chromaOf, lightnessOf, mk } from "../helpers";

describe("applyTone", () => {
	it("aligns both L and C on a single-color palette", () => {
		const out = applyTone(mk(["#ff0000"]), {
			type: "tone",
			targetL: 0.6,
			targetC: 0.1,
		});
		expect(lightnessOf(out.colors[0])).toBeCloseTo(0.6, 2);
		expect(chromaOf(out.colors[0])).toBeCloseTo(0.1, 2);
	});

	it("keeps an already-aligned palette near the target", () => {
		const palette = mk(["#ff0000", "#00ff00", "#0000ff"]);
		const aligned = applyTone(palette, {
			type: "tone",
			targetL: 0.6,
			targetC: 0.1,
		});
		for (const hex of aligned.colors) {
			expect(lightnessOf(hex)).toBeCloseTo(0.6, 2);
			expect(chromaOf(hex)).toBeCloseTo(0.1, 2);
		}
	});

	it("converges a bunched palette on both axes", () => {
		const out = applyTone(mk(["#000000", "#ffffff", "#ff0000", "#0000ff"]), {
			type: "tone",
			targetL: 0.55,
			targetC: 0.08,
		});
		for (const hex of out.colors) {
			expect(lightnessOf(hex)).toBeCloseTo(0.55, 2);
			expect(chromaOf(hex)).toBeCloseTo(0.08, 2);
		}
	});
});
