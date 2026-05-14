import { useEffect, useMemo, useReducer, useState } from "react";
import { ChainEditor } from "./components/ChainEditor";
import { ExportPanel } from "./components/ExportPanel";
import { PaletteDisplay } from "./components/PaletteDisplay";
import { PaletteInput } from "./components/PaletteInput";
import { PersistencePanel } from "./components/PersistencePanel";
import { SortToggle } from "./components/SortToggle";
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
		<div className="min-h-screen bg-neutral-100 text-neutral-900">
			<div className="mx-auto max-w-4xl space-y-8 px-4 py-6 sm:py-8">
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

				<ExportPanel colors={outputPalette.colors} />

				<PersistencePanel
					state={state}
					history={history}
					onSaveSnapshot={handleSaveSnapshot}
					onRestore={handleRestore}
					onDeleteSnapshot={handleDeleteSnapshot}
				/>

				<footer className="pt-4 text-center text-xs text-neutral-400">
					reuni — palette blender
				</footer>
			</div>
		</div>
	);
}

export default App;
