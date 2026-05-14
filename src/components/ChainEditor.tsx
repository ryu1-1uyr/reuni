import type { BlendChain, BlendStep, HexColor } from "../core/types";
import { makeDefaultStep } from "../state/appState";
import { recommendChain } from "../utils/recommend";
import { StepEditor, stepLabel } from "./StepEditor";

type Props = {
	chain: BlendChain;
	inputColors: HexColor[];
	onAddStep: (step: BlendStep) => void;
	onRemoveStep: (index: number) => void;
	onUpdateStep: (index: number, step: BlendStep) => void;
	onMoveStep: (from: number, to: number) => void;
	onReplaceChain: (chain: BlendChain) => void;
};

const STEP_TYPES: BlendStep["type"][] = [
	"chroma",
	"lightness",
	"tone",
	"mix",
	"anchor",
];

export function ChainEditor({
	chain,
	inputColors,
	onAddStep,
	onRemoveStep,
	onUpdateStep,
	onMoveStep,
	onReplaceChain,
}: Props) {
	return (
		<section className="space-y-3">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<h2 className="text-sm font-semibold text-neutral-700">
					馴染ませチェーン ({chain.length})
				</h2>
				<button
					type="button"
					onClick={() => onReplaceChain(recommendChain(inputColors))}
					disabled={inputColors.length === 0}
					title="入力色からトーン統一＋ベージュ15%のチェーンを自動生成"
					className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1 text-sm font-medium text-rose-800 hover:border-rose-300 hover:bg-rose-100 disabled:opacity-40"
				>
					<span aria-hidden="true">✨</span>
					おすすめチェーン
				</button>
			</div>

			{chain.length === 0 ? (
				<p className="text-sm text-neutral-500">
					まだステップが無いよ。下のボタンから追加してね
				</p>
			) : (
				<ol className="space-y-2">
					{chain.map((step, i) => (
						<li
							key={`${step.type}-${i}`}
							className="rounded-lg border border-neutral-200 bg-white p-3"
						>
							<div className="mb-2 flex items-center justify-between gap-2">
								<div className="flex items-center gap-2 text-sm">
									<span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 font-mono text-xs text-neutral-600">
										{i + 1}
									</span>
									<span className="font-medium text-neutral-800">
										{stepLabel(step.type)}
									</span>
								</div>
								<div className="flex items-center gap-1">
									<button
										type="button"
										onClick={() => onMoveStep(i, i - 1)}
										disabled={i === 0}
										aria-label="Move step up"
										className="rounded p-1 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent"
									>
										↑
									</button>
									<button
										type="button"
										onClick={() => onMoveStep(i, i + 1)}
										disabled={i === chain.length - 1}
										aria-label="Move step down"
										className="rounded p-1 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent"
									>
										↓
									</button>
									<button
										type="button"
										onClick={() => onRemoveStep(i)}
										aria-label="Remove step"
										className="rounded p-1 text-neutral-500 hover:bg-red-50 hover:text-red-600"
									>
										×
									</button>
								</div>
							</div>
							<StepEditor
								step={step}
								inputColors={inputColors}
								onChange={(updated) => onUpdateStep(i, updated)}
							/>
						</li>
					))}
				</ol>
			)}

			<div className="flex flex-wrap gap-2">
				{STEP_TYPES.map((type) => (
					<button
						key={type}
						type="button"
						onClick={() => onAddStep(makeDefaultStep(type))}
						className="rounded-md border border-dashed border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-700 hover:border-neutral-500 hover:bg-neutral-50"
					>
						+ {stepLabel(type)}
					</button>
				))}
			</div>
		</section>
	);
}
