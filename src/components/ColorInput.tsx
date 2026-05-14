import { normalizeHex } from "../utils/hex";

type Props = {
	value: string;
	onChange: (next: string) => void;
	onEnter?: () => void;
	placeholder?: string;
	ariaLabel?: string;
};

const FALLBACK_SWATCH_COLOR = "#888888";

export function ColorInput({
	value,
	onChange,
	onEnter,
	placeholder,
	ariaLabel,
}: Props) {
	const validHex = normalizeHex(value) ?? FALLBACK_SWATCH_COLOR;

	return (
		<div className="inline-flex items-stretch overflow-hidden rounded-md border border-neutral-300 bg-white focus-within:border-neutral-500">
			<label
				className="relative flex h-8 w-8 cursor-pointer items-center justify-center border-r border-neutral-300"
				style={{ backgroundColor: validHex }}
				aria-label="カラーピッカーを開く"
				title="カラーピッカーを開く"
			>
				<input
					type="color"
					value={validHex}
					onChange={(e) => onChange(e.target.value)}
					className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
				/>
			</label>
			<input
				type="text"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter" && onEnter) onEnter();
				}}
				placeholder={placeholder}
				aria-label={ariaLabel}
				className="w-28 px-2 py-1 font-mono text-sm focus:outline-none"
			/>
		</div>
	);
}
