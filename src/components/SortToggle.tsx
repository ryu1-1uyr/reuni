import type { SortMode } from "../core/types";

type Props = {
	value: SortMode;
	onChange: (mode: SortMode) => void;
};

const OPTIONS: { value: SortMode; label: string }[] = [
	{ value: "input", label: "入力順" },
	{ value: "lightness", label: "明度順" },
];

export function SortToggle({ value, onChange }: Props) {
	return (
		<div className="inline-flex rounded-md border border-neutral-300 bg-white p-0.5 text-sm">
			{OPTIONS.map((opt) => (
				<button
					key={opt.value}
					type="button"
					onClick={() => onChange(opt.value)}
					aria-pressed={value === opt.value}
					className={`rounded px-3 py-1 transition-colors ${
						value === opt.value
							? "bg-neutral-900 text-white"
							: "text-neutral-700 hover:bg-neutral-100"
					}`}
				>
					{opt.label}
				</button>
			))}
		</div>
	);
}
