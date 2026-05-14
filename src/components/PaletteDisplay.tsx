import type { HexColor, SortMode } from "../core/types";
import { sortPalette } from "../utils/sortPalette";
import { ColorSwatch } from "./ColorSwatch";

type Props = {
	beforeColors: HexColor[];
	afterColors: HexColor[];
	sortMode: SortMode;
};

function Row({
	label,
	colors,
	sortMode,
}: {
	label: string;
	colors: HexColor[];
	sortMode: SortMode;
}) {
	const sorted = sortPalette(colors, sortMode);
	return (
		<div>
			<div className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
				{label}
			</div>
			{sorted.length === 0 ? (
				<div className="h-20 rounded-md border border-dashed border-neutral-300 px-3 py-6 text-center text-sm text-neutral-400">
					(空)
				</div>
			) : (
				<div className="flex flex-wrap gap-3">
					{sorted.map(({ hex, originalIndex }) => (
						<ColorSwatch key={`${hex}-${originalIndex}`} hex={hex} />
					))}
				</div>
			)}
		</div>
	);
}

export function PaletteDisplay({ beforeColors, afterColors, sortMode }: Props) {
	return (
		<div className="space-y-5 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
			<Row label="Before" colors={beforeColors} sortMode={sortMode} />
			<Row label="After" colors={afterColors} sortMode={sortMode} />
		</div>
	);
}
