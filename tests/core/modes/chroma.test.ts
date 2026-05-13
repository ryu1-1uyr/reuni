import { describe, expect, it } from "vitest";
import { applyChroma } from "../../../src/core/modes/chroma";
import { chromaOf, mk } from "../helpers";

describe("applyChroma", () => {
	it("works on a single-color palette", () => {
		const out = applyChroma(mk(["#ff0000"]), { type: "chroma", target: 0.1 });
		expect(chromaOf(out.colors[0])).toBeCloseTo(0.1, 2);
	});

	it("leaves an already-aligned palette nearly unchanged", () => {
		const palette = mk(["#ff0000", "#00ff00", "#0000ff"]);
		const aligned = applyChroma(palette, { type: "chroma", target: 0.1 });
		const reapplied = applyChroma(aligned, { type: "chroma", target: 0.1 });
		for (let i = 0; i < aligned.colors.length; i++) {
			expect(chromaOf(reapplied.colors[i])).toBeCloseTo(
				chromaOf(aligned.colors[i]),
				2,
			);
		}
	});

	it("converges a bunched palette to the target chroma", () => {
		const out = applyChroma(mk(["#ff0000", "#00ff00", "#0000ff", "#888888"]), {
			type: "chroma",
			target: 0.08,
		});
		for (const hex of out.colors) {
			expect(chromaOf(hex)).toBeCloseTo(0.08, 2);
		}
	});

	it("returns a new palette (immutability)", () => {
		const palette = mk(["#ff0000"]);
		const out = applyChroma(palette, { type: "chroma", target: 0.1 });
		expect(out).not.toBe(palette);
		expect(palette.colors[0]).toBe("#ff0000");
	});
});
