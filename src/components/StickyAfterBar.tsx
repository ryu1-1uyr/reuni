import type { HexColor } from "../core/types";

type Props = { afterColors: HexColor[] };

export function StickyAfterBar({ afterColors }: Props) {
	if (afterColors.length === 0) return null;
	return (
		<div className="sticky top-0 z-30 -mx-4 sm:hidden">
			<div className="border-b border-rose-100 bg-white/85 px-4 py-2 backdrop-blur-sm">
				<div className="mb-1 text-[10px] font-medium tracking-wide text-rose-700/70">
					AFTER
				</div>
				<div className="flex gap-1">
					{afterColors.map((hex, i) => (
						<div
							key={`${hex}-${i}`}
							className="h-7 flex-1 rounded-md ring-1 ring-black/5"
							style={{ backgroundColor: hex }}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
