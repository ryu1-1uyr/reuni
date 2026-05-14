import { useEffect, useMemo, useReducer, useState } from "react";
import { ChainEditor } from "./components/ChainEditor";
import { ExportPanel } from "./components/ExportPanel";
import { PaletteDisplay } from "./components/PaletteDisplay";
import { PaletteInput } from "./components/PaletteInput";
import { PersistencePanel } from "./components/PersistencePanel";
import { SectionCard } from "./components/SectionCard";
import { SortToggle } from "./components/SortToggle";
import { SuggestionPanel } from "./components/SuggestionPanel";
import { applyChain } from "./core/index";
import type { Palette } from "./core/types";
import { INITIAL_STATE, type AppState, appReducer } from "./state/appState";
import {
	appendHistory,
	loadCurrent,
	loadHistory,
	removeFromHistory,
	saveCurrent,
} from "./storage/localStorage";

function initState(): AppState {
	return loadCurrent() ?? INITIAL_STATE;
}

function App() {
	const [state, dispatch] = useReducer(appReducer, undefined, initState);
	const [history, setHistory] = useState(() => loadHistory());

	useEffect(() => {
		saveCurrent(state);
	}, [state]);

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

	const handleSaveSnapshot = () => {
		const stamp = new Date().toLocaleString("ja-JP", {
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
		});
		const name = `${state.inputColors.length}色・${state.chain.length}ステップ (${stamp})`;
		setHistory((h) => appendHistory(h, state, name));
	};

	const handleRestore = (loaded: AppState) => {
		dispatch({ type: "loadState", state: loaded });
	};

	const handleDeleteSnapshot = (id: string) => {
		setHistory((h) => removeFromHistory(h, id));
	};

	return (
		<div className="min-h-screen bg-rose-50/60 text-neutral-900">
			<div className="mx-auto max-w-4xl space-y-5 px-4 py-6 sm:py-10">
				<header className="space-y-1 px-1">
					<h1 className="text-3xl font-bold tracking-tight text-rose-900">
						reuni
						<span
							className="ml-1.5 align-baseline text-base font-normal text-rose-400"
							aria-hidden="true"
						>
							🌸
						</span>
					</h1>
					<p className="text-sm text-rose-700/70">
						離れた色同士を再結合して馴染ませるツール
					</p>
				</header>

				<SectionCard>
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
				</SectionCard>

				<SectionCard>
					<SuggestionPanel
						inputColors={state.inputColors}
						onAdd={(hex) => dispatch({ type: "addColor", hex })}
					/>
				</SectionCard>

				<SectionCard>
					<section className="space-y-3">
						<div className="flex flex-wrap items-center justify-between gap-2">
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
				</SectionCard>

				<SectionCard>
					<ChainEditor
						chain={state.chain}
						inputColors={state.inputColors}
						onAddStep={(step) => dispatch({ type: "addStep", step })}
						onRemoveStep={(index) => dispatch({ type: "removeStep", index })}
						onUpdateStep={(index, step) =>
							dispatch({ type: "updateStep", index, step })
						}
						onMoveStep={(from, to) => dispatch({ type: "moveStep", from, to })}
						onReplaceChain={(chain) =>
							dispatch({ type: "setChain", chain })
						}
					/>
				</SectionCard>

				<SectionCard>
					<ExportPanel colors={outputPalette.colors} />
				</SectionCard>

				<SectionCard>
					<PersistencePanel
						state={state}
						history={history}
						onSaveSnapshot={handleSaveSnapshot}
						onRestore={handleRestore}
						onDeleteSnapshot={handleDeleteSnapshot}
					/>
				</SectionCard>

				<footer className="pt-2 text-center text-xs text-rose-700/40">
					reuni — palette blender
				</footer>
			</div>
		</div>
	);
}

export default App;
