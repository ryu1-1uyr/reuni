import { DEFAULT_BLEND_COLORS, OKLCH_C_MAX } from "../core/constants";
import type { BlendStep, HexColor } from "../core/types";
import { normalizeHex } from "../utils/hex";
import { Slider } from "./Slider";

type Props = {
	step: BlendStep;
	inputColors: HexColor[];
	onChange: (step: BlendStep) => void;
};

const STEP_LABELS: Record<BlendStep["type"], string> = {
	chroma: "彩度統一",
	lightness: "明度統一",
	tone: "トーン統一",
	mix: "共通色ブレンド",
	anchor: "基準色追従",
};

export function stepLabel(type: BlendStep["type"]): string {
	return STEP_LABELS[type];
}

export function StepEditor({ step, inputColors, onChange }: Props) {
	switch (step.type) {
		case "chroma":
			return (
				<Slider
					label="目標彩度 (C)"
					value={step.target}
					min={0}
					max={OKLCH_C_MAX}
					step={0.005}
					onChange={(target) => onChange({ ...step, target })}
				/>
			);
		case "lightness":
			return (
				<Slider
					label="目標明度 (L)"
					value={step.target}
					min={0}
					max={1}
					step={0.01}
					onChange={(target) => onChange({ ...step, target })}
				/>
			);
		case "tone":
			return (
				<div className="space-y-2">
					<Slider
						label="目標明度 (L)"
						value={step.targetL}
						min={0}
						max={1}
						step={0.01}
						onChange={(targetL) => onChange({ ...step, targetL })}
					/>
					<Slider
						label="目標彩度 (C)"
						value={step.targetC}
						min={0}
						max={OKLCH_C_MAX}
						step={0.005}
						onChange={(targetC) => onChange({ ...step, targetC })}
					/>
				</div>
			);
		case "mix":
			return (
				<div className="space-y-2">
					<div className="flex flex-wrap items-center gap-2">
						<span className="text-xs font-medium text-neutral-700">
							ブレンド色:
						</span>
						{Object.entries(DEFAULT_BLEND_COLORS).map(([name, hex]) => (
							<button
								key={name}
								type="button"
								onClick={() => onChange({ ...step, blendColor: hex })}
								aria-pressed={step.blendColor.toLowerCase() === hex.toLowerCase()}
								className={`flex items-center gap-1 rounded-md border px-2 py-1 text-xs transition-colors ${
									step.blendColor.toLowerCase() === hex.toLowerCase()
										? "border-neutral-900 bg-neutral-100"
										: "border-neutral-300 bg-white hover:bg-neutral-50"
								}`}
							>
								<span
									className="inline-block h-3 w-3 rounded-sm ring-1 ring-black/10"
									style={{ backgroundColor: hex }}
								/>
								{name}
							</button>
						))}
						<input
							type="text"
							value={step.blendColor}
							onChange={(e) => {
								const normalized = normalizeHex(e.target.value);
								if (normalized) onChange({ ...step, blendColor: normalized });
								else onChange({ ...step, blendColor: e.target.value as HexColor });
							}}
							className="w-24 rounded-md border border-neutral-300 bg-white px-2 py-1 font-mono text-xs"
							aria-label="Blend color hex"
						/>
					</div>
					<Slider
						label="混合率"
						value={step.ratio}
						min={0}
						max={0.5}
						step={0.01}
						onChange={(ratio) => onChange({ ...step, ratio })}
						format={(v) => `${Math.round(v * 100)}%`}
					/>
				</div>
			);
		case "anchor":
			return (
				<div className="space-y-2">
					<label className="block text-xs">
						<span className="mb-1 block font-medium text-neutral-700">
							基準色
						</span>
						{inputColors.length === 0 ? (
							<span className="text-neutral-500">
								(パレットが空 — 色を追加してね)
							</span>
						) : (
							<select
								value={step.anchorIndex}
								onChange={(e) =>
									onChange({ ...step, anchorIndex: Number(e.target.value) })
								}
								className="w-full rounded-md border border-neutral-300 bg-white px-2 py-1 font-mono text-xs"
							>
								{inputColors.map((hex, i) => (
									<option key={`${hex}-${i}`} value={i}>
										#{i + 1}: {hex.toLowerCase()}
									</option>
								))}
							</select>
						)}
					</label>
					<Slider
						label="寄せる強度"
						value={step.strength}
						min={0}
						max={1}
						step={0.01}
						onChange={(strength) => onChange({ ...step, strength })}
						format={(v) => `${Math.round(v * 100)}%`}
					/>
				</div>
			);
	}
}
