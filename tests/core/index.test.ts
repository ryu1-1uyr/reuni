import { describe, expect, it } from "vitest";
import { applyChain, applyStep } from "../../src/core/index";
import { chromaOf, lightnessOf, mk } from "./helpers";

describe("applyStep", () => {
	it("dispatches to the correct mode (chroma)", () => {
		const out = applyStep(mk(["#ff0000"]), { type: "chroma", target: 0.1 });
		expect(chromaOf(out.colors[0])).toBeCloseTo(0.1, 2);
	});
});

describe("applyChain", () => {
	it("empty chain returns an equivalent palette", () => {
		const palette = mk(["#ff0000", "#00ff00"]);
		const out = applyChain(palette, []);
		expect(out.colors).toEqual(palette.colors);
	});

	it("chroma + lightness equals tone (both axes converge)", () => {
		const palette = mk(["#ff0000", "#00ff00", "#0000ff"]);
		const chained = applyChain(palette, [
			{ type: "chroma", target: 0.1 },
			{ type: "lightness", target: 0.6 },
		]);
		const toned = applyChain(palette, [
			{ type: "tone", targetL: 0.6, targetC: 0.1 },
		]);
		for (let i = 0; i < palette.colors.length; i++) {
			expect(lightnessOf(chained.colors[i])).toBeCloseTo(
				lightnessOf(toned.colors[i]),
				2,
			);
			expect(chromaOf(chained.colors[i])).toBeCloseTo(
				chromaOf(toned.colors[i]),
				2,
			);
		}
	});

	it("respects step order (mix then chroma != chroma then mix)", () => {
		const palette = mk(["#ff0000", "#0000ff"]);
		const a = applyChain(palette, [
			{ type: "mix", blendColor: "#d4c5a9", ratio: 0.5 },
			{ type: "chroma", target: 0.05 },
		]);
		const b = applyChain(palette, [
			{ type: "chroma", target: 0.05 },
			{ type: "mix", blendColor: "#d4c5a9", ratio: 0.5 },
		]);
		expect(a.colors).not.toEqual(b.colors);
	});

	it("chain of [chroma, lightness] converges all colors on both axes", () => {
		const out = applyChain(mk(["#000000", "#ffffff", "#ff0000"]), [
			{ type: "chroma", target: 0.08 },
			{ type: "lightness", target: 0.55 },
		]);
		for (const hex of out.colors) {
			expect(lightnessOf(hex)).toBeCloseTo(0.55, 2);
		}
	});
});
