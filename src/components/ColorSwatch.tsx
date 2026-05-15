import { hexToOklch } from "../core/colorspace";
import type { HexColor } from "../core/types";

type Props = {
	hex: HexColor;
	isAnchor?: boolean;
	onDelete?: () => void;
	onToggleAnchor?: () => void;
};

export function ColorSwatch({ hex, isAnchor, onDelete, onToggleAnchor }: Props) {
	const { l } = hexToOklch(hex);
	const textOnSwatch = l > 0.6 ? "text-neutral-900" : "text-neutral-50";

	return (
		<div className="group relative flex flex-col items-stretch w-20">
			<div
				className="relative h-20 w-20 rounded-xl shadow-sm ring-1 ring-black/5"
				style={{ backgroundColor: hex }}
			>
				{onDelete && (
					<button
						type="button"
						onClick={onDelete}
						aria-label={`Remove ${hex}`}
						className={`absolute top-1 right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/30 ${textOnSwatch} text-xs leading-none opacity-0 pointer-coarse:opacity-70 group-hover:opacity-100 transition-opacity hover:bg-black/50`}
					>
						×
					</button>
				)}
				{onToggleAnchor && (
					<button
						type="button"
						onClick={onToggleAnchor}
						aria-label={
							isAnchor ? `Clear anchor on ${hex}` : `Set ${hex} as anchor`
						}
						className={`absolute bottom-1 left-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-xs leading-none transition-opacity ${
							isAnchor
								? `${textOnSwatch} opacity-100`
								: `${textOnSwatch} opacity-0 pointer-coarse:opacity-50 group-hover:opacity-60 hover:opacity-100`
						}`}
					>
						{isAnchor ? "★" : "☆"}
					</button>
				)}
			</div>
			<span className="mt-1 text-center font-mono text-xs text-neutral-600">
				{hex.toLowerCase()}
			</span>
		</div>
	);
}
