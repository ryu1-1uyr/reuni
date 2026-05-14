import { useMemo, useReducer } from "react";
import { ChainEditor } from "./components/ChainEditor";
import { PaletteDisplay } from "./components/PaletteDisplay";
import { PaletteInput } from "./components/PaletteInput";
import { SortToggle } from "./components/SortToggle";
import { applyChain } from "./core/index";
import type { Palette } from "./core/types";
import { INITIAL_STATE, appReducer } from "./state/appState";

function App() {
	const [state, dispatch] = useReducer(appReducer, INITIAL_STATE);

	const inputPalette = useMemo<Palette>(
		() => ({
			id: "current",
			name: "current",
			colors: state.inputColors,
			anchorIndex: state.anchorIndex,
			createdAt: "",
		}),
		[state.inputColors, state.anchorIndex],
	);

	const outputPalette = useMemo(
		() => applyChain(inputPalette, state.chain),
		[inputPalette, state.chain],
	);

	return (
		<div className="min-h-screen bg-neutral-100 text-neutral-900">
			<div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
				<header className="space-y-1">
					<h1 className="text-2xl font-bold tracking-tight">reuni</h1>
					<p className="text-sm text-neutral-600">
						離れた色同士を再結合して馴染ませるツール
					</p>
				</header>

				<PaletteInput
					colors={state.inputColors}
					anchorIndex={state.anchorIndex}
					onAdd={(hex) => dispatch({ type: "addColor", hex })}
					onRemove={(index) => dispatch({ type: "removeColor", index })}
					onToggleAnchor={(index) =>
						dispatch({
							type: "setAnchor",
							index: state.anchorIndex === index ? undefined : index,
						})
					}
				/>

				<section className="space-y-3">
					<div className="flex items-center justify-between">
						<h2 className="text-sm font-semibold text-neutral-700">
							Before / After
						</h2>
						<SortToggle
							value={state.sortMode}
							onChange={(mode) => dispatch({ type: "setSortMode", mode })}
						/>
					</div>
					<PaletteDisplay
						beforeColors={inputPalette.colors}
						afterColors={outputPalette.colors}
						sortMode={state.sortMode}
					/>
				</section>

				<ChainEditor
					chain={state.chain}
					inputColors={state.inputColors}
					onAddStep={(step) => dispatch({ type: "addStep", step })}
					onRemoveStep={(index) => dispatch({ type: "removeStep", index })}
					onUpdateStep={(index, step) =>
						dispatch({ type: "updateStep", index, step })
					}
					onMoveStep={(from, to) => dispatch({ type: "moveStep", from, to })}
				/>
			</div>
		</div>
	);
}

export default App;
