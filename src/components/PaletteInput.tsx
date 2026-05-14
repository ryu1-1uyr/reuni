import { useState } from "react";
import type { HexColor } from "../core/types";
import { normalizeHex } from "../utils/hex";
import { ColorInput } from "./ColorInput";
import { ColorSwatch } from "./ColorSwatch";
import { EyeDropperButton } from "./EyeDropperButton";

type Props = {
	colors: HexColor[];
	anchorIndex: number | undefined;
	onAdd: (hex: HexColor) => void;
	onRemove: (index: number) => void;
	onToggleAnchor: (index: number) => void;
};

export function PaletteInput({
	colors,
	anchorIndex,
	onAdd,
	onRemove,
	onToggleAnchor,
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
					className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-700 active:bg-neutral-800"
				>
					追加
				</button>
				<EyeDropperButton onPick={onAdd} />
				{error && <span className="text-xs text-red-600">{error}</span>}
			</div>
		</section>
	);
}
