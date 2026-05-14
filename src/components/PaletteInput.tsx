import { useState } from "react";
import type { HexColor } from "../core/types";
import { normalizeHex } from "../utils/hex";
import { generateRandomPalette } from "../utils/randomPalette";
import { ColorInput } from "./ColorInput";
import { ColorSwatch } from "./ColorSwatch";
import { EyeDropperButton } from "./EyeDropperButton";

type Props = {
	colors: HexColor[];
	anchorIndex: number | undefined;
	onAdd: (hex: HexColor) => void;
	onRemove: (index: number) => void;
	onToggleAnchor: (index: number) => void;
	onReplaceAll: (colors: HexColor[]) => void;
};

export function PaletteInput({
	colors,
	anchorIndex,
	onAdd,
	onRemove,
	onToggleAnchor,
	onReplaceAll,
}: Props) {
	const [input, setInput] = useState("");
	const [error, setError] = useState<string | null>(null);

	const handleAdd = () => {
		const normalized = normalizeHex(input);
		if (!normalized) {
			setError("HEX 形式じゃないかも（#RRGGBB / RGB）");
			return;
		}
		onAdd(normalized);
		setInput("");
		setError(null);
	};

	const handleRandom = () => {
		if (
			colors.length > 0 &&
			!window.confirm("入力パレットをランダム5色で置き換えるよ。いい？")
		) {
			return;
		}
		onReplaceAll(generateRandomPalette());
	};

	return (
		<section className="space-y-3">
			<h2 className="text-sm font-semibold text-neutral-700">
				入力パレット ({colors.length})
			</h2>

			{colors.length > 0 ? (
				<div className="flex flex-wrap gap-3">
					{colors.map((hex, i) => (
						<ColorSwatch
							key={`${hex}-${i}`}
							hex={hex}
							isAnchor={anchorIndex === i}
							onDelete={() => onRemove(i)}
							onToggleAnchor={() => onToggleAnchor(i)}
						/>
					))}
				</div>
			) : (
				<p className="text-sm text-neutral-500">
					まだ色が無いよ。下から追加してね
				</p>
			)}

			<div className="flex flex-wrap items-center gap-2">
				<ColorInput
					value={input}
					onChange={(next) => {
						setInput(next);
						if (error) setError(null);
					}}
					onEnter={handleAdd}
					placeholder="#RRGGBB"
					ariaLabel="HEX color input"
				/>
				<button
					type="button"
					onClick={handleAdd}
					className="rounded-lg bg-rose-700 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-rose-600 active:bg-rose-800"
				>
					追加
				</button>
				<EyeDropperButton onPick={onAdd} />
				<button
					type="button"
					onClick={handleRandom}
					title="それっぽい色をランダムに5個入れる"
					className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm font-medium text-rose-800 hover:border-rose-300 hover:bg-rose-100"
				>
					🎲 ランダム
				</button>
				{error && <span className="text-xs text-red-600">{error}</span>}
			</div>
		</section>
	);
}
