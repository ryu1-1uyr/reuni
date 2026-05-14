import { DEFAULT_BLEND_COLORS } from "../core/constants";
import type {
	AnchorStep,
	BlendChain,
	BlendStep,
	ChromaStep,
	HexColor,
	LightnessStep,
	MixStep,
	SortMode,
	ToneStep,
} from "../core/types";

export type AppState = {
	inputColors: HexColor[];
	anchorIndex: number | undefined;
	chain: BlendChain;
	sortMode: SortMode;
};

export type Action =
	| { type: "addColor"; hex: HexColor }
	| { type: "updateColor"; index: number; hex: HexColor }
	| { type: "removeColor"; index: number }
	| { type: "setAnchor"; index: number | undefined }
	| { type: "addStep"; step: BlendStep }
	| { type: "removeStep"; index: number }
	| { type: "updateStep"; index: number; step: BlendStep }
	| { type: "moveStep"; from: number; to: number }
	| { type: "setSortMode"; mode: SortMode };

export const INITIAL_STATE: AppState = {
	inputColors: ["#ff6b6b", "#4ecdc4", "#ffe66d", "#95e1d3", "#6c5ce7"],
	anchorIndex: undefined,
	chain: [],
	sortMode: "input",
};

export function makeDefaultStep(type: BlendStep["type"]): BlendStep {
	switch (type) {
		case "chroma":
			return { type: "chroma", target: 0.1 } satisfies ChromaStep;
		case "lightness":
			return { type: "lightness", target: 0.65 } satisfies LightnessStep;
		case "tone":
			return {
				type: "tone",
				targetL: 0.65,
				targetC: 0.1,
			} satisfies ToneStep;
		case "mix":
			return {
				type: "mix",
				blendColor: DEFAULT_BLEND_COLORS.beige,
				ratio: 0.3,
			} satisfies MixStep;
		case "anchor":
			return {
				type: "anchor",
				anchorIndex: 0,
				strength: 0.5,
			} satisfies AnchorStep;
	}
}

function adjustAnchorIndexOnRemove(
	anchorIndex: number | undefined,
	removed: number,
): number | undefined {
	if (anchorIndex === undefined) return undefined;
	if (anchorIndex === removed) return undefined;
	if (anchorIndex > removed) return anchorIndex - 1;
	return anchorIndex;
}

function adjustChainOnColorRemove(
	chain: BlendChain,
	removed: number,
	remainingCount: number,
): BlendChain {
	return chain.map((step) => {
		if (step.type !== "anchor") return step;
		if (remainingCount === 0) {
			return { ...step, anchorIndex: 0 };
		}
		if (step.anchorIndex === removed) {
			return { ...step, anchorIndex: 0 };
		}
		if (step.anchorIndex > removed) {
			return { ...step, anchorIndex: step.anchorIndex - 1 };
		}
		return step;
	});
}

export function appReducer(state: AppState, action: Action): AppState {
	switch (action.type) {
		case "addColor":
			return { ...state, inputColors: [...state.inputColors, action.hex] };
		case "updateColor":
			return {
				...state,
				inputColors: state.inputColors.map((c, i) =>
					i === action.index ? action.hex : c,
				),
			};
		case "removeColor": {
			const inputColors = state.inputColors.filter(
				(_, i) => i !== action.index,
			);
			return {
				...state,
				inputColors,
				anchorIndex: adjustAnchorIndexOnRemove(
					state.anchorIndex,
					action.index,
				),
				chain: adjustChainOnColorRemove(
					state.chain,
					action.index,
					inputColors.length,
				),
			};
		}
		case "setAnchor":
			return { ...state, anchorIndex: action.index };
		case "addStep":
			return { ...state, chain: [...state.chain, action.step] };
		case "removeStep":
			return {
				...state,
				chain: state.chain.filter((_, i) => i !== action.index),
			};
		case "updateStep":
			return {
				...state,
				chain: state.chain.map((s, i) => (i === action.index ? action.step : s)),
			};
		case "moveStep": {
			const { from, to } = action;
			if (from === to || from < 0 || to < 0) return state;
			if (from >= state.chain.length || to >= state.chain.length) return state;
			const chain = [...state.chain];
			const [moved] = chain.splice(from, 1);
			chain.splice(to, 0, moved);
			return { ...state, chain };
		}
		case "setSortMode":
			return { ...state, sortMode: action.mode };
	}
}
