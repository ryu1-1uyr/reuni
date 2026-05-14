import { useMemo } from "react";
import type { HexColor } from "../core/types";
import { suggestColors } from "../utils/recommend";

type Props = {
	inputColors: HexColor[];
	onAdd: (hex: HexColor) => void;
};

export function SuggestionPanel({ inputColors, onAdd }: Props) {
	const suggestions = useMemo(
		() => suggestColors(inputColors),
		[inputColors],
	);

	if (suggestions.length === 0) return null;

	return (
		<section className="space-y-2">
			<div className="flex items-baseline gap-2">
				<h2 className="text-sm font-semibold text-neutral-700">
					こんな色も合うかも
				</h2>
				<span className="text-xs text-neutral-500">
					（パレットに足りない色相から提案）
				</span>
			</div>
			<div className="flex flex-wrap gap-2">
				{suggestions.map((hex, i) => (
					<button
						key={`${hex}-${i}`}
						type="button"
						onClick={() => onAdd(hex)}
						className="group flex items-center gap-2 rounded-md border border-neutral-200 bg-white p-1.5 hover:border-neutral-400 hover:bg-neutral-50"
						title="クリックでパレットに追加"
					>
						<span
							className="inline-block h-8 w-8 rounded-md ring-1 ring-black/10"
							style={{ backgroundColor: hex }}
						/>
						<span className="pr-1 font-mono text-xs text-neutral-700">
							{hex.toLowerCase()}
						</span>
						<span className="pr-1 text-xs text-neutral-400 group-hover:text-neutral-700">
							+
						</span>
					</button>
				))}
			</div>
		</section>
	);
}
