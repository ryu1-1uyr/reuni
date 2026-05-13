import { describe, expect, it } from "vitest";
import { hexToOklab } from "../../../src/core/colorspace";
import { applyMix } from "../../../src/core/modes/blend";
import { mk } from "../helpers";

describe("applyMix", () => {
	it("ratio=0 leaves the palette unchanged", () => {
		const colors = ["#ff0000", "#00ff00", "#0000ff"];
		const out = applyMix(mk(colors), {
			type: "mix",
			blendColor: "#d4c5a9",
			ratio: 0,
		});
		expect(out.colors).toEqual(colors);
	});

	it("ratio=1 collapses every color toward the blend color", () => {
		const out = applyMix(mk(["#ff0000", "#00ff00", "#0000ff"]), {
			type: "mix",
			blendColor: "#d4c5a9",
			ratio: 1,
		});
		const target = hexToOklab("#d4c5a9");
		for (const hex of out.colors) {
			const lab = hexToOklab(hex);
			expect(lab.l ?? 0).toBeCloseTo(target.l ?? 0, 2);
			expect(lab.a ?? 0).toBeCloseTo(target.a ?? 0, 2);
			expect(lab.b ?? 0).toBeCloseTo(target.b ?? 0, 2);
		}
	});

	it("ratio=0.5 puts each color halfway in OKLab space", () => {
		const palette = mk(["#ff0000", "#0000ff"]);
		const blend = "#d4c5a9";
		const out = applyMix(palette, {
			type: "mix",
			blendColor: blend,
			ratio: 0.5,
		});
		const blendLab = hexToOklab(blend);
		for (let i = 0; i < palette.colors.length; i++) {
			const origLab = hexToOklab(palette.colors[i]);
			const resultLab = hexToOklab(out.colors[i]);
			const expectedL = ((origLab.l ?? 0) + (blendLab.l ?? 0)) / 2;
			const expectedA = ((origLab.a ?? 0) + (blendLab.a ?? 0)) / 2;
			const expectedB = ((origLab.b ?? 0) + (blendLab.b ?? 0)) / 2;
			expect(resultLab.l ?? 0).toBeCloseTo(expectedL, 2);
			expect(resultLab.a ?? 0).toBeCloseTo(expectedA, 2);
			expect(resultLab.b ?? 0).toBeCloseTo(expectedB, 2);
		}
	});
});
