import { useEyeDropper } from "../hooks/useEyeDropper";
import type { HexColor } from "../core/types";

type Props = {
	onPick: (hex: HexColor) => void;
};

export function EyeDropperButton({ onPick }: Props) {
	const { isSupported, pick } = useEyeDropper();

	if (!isSupported) return null;

	return (
		<button
			type="button"
			onClick={async () => {
				const hex = await pick();
				if (hex) onPick(hex);
			}}
			className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100"
			aria-label="Pick a color from the screen"
		>
			<span aria-hidden="true">🎨</span>
			スポイト
		</button>
	);
}
