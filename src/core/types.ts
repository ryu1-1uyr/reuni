export type HexColor = string;

export type OklchColor = {
	l: number;
	c: number;
	h: number;
};

export type Palette = {
	id: string;
	name: string;
	colors: HexColor[];
	anchorIndex?: number;
	createdAt: string;
};

export type ChromaStep = { type: "chroma"; target: number };
export type LightnessStep = { type: "lightness"; target: number };
export type ToneStep = { type: "tone"; targetL: number; targetC: number };
export type MixStep = { type: "mix"; blendColor: HexColor; ratio: number };
export type AnchorStep = {
	type: "anchor";
	anchorIndex: number;
	strength: number;
};

export type BlendStep =
	| ChromaStep
	| LightnessStep
	| ToneStep
	| MixStep
	| AnchorStep;

export type BlendChain = BlendStep[];

export type SortMode = "input" | "lightness";
