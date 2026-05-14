type Props = {
	label: string;
	value: number;
	min: number;
	max: number;
	step: number;
	onChange: (value: number) => void;
	format?: (value: number) => string;
};

export function Slider({
	label,
	value,
	min,
	max,
	step,
	onChange,
	format,
}: Props) {
	const formatted = format ? format(value) : value.toFixed(3);
	return (
		<label className="block">
			<div className="mb-1 flex items-baseline justify-between text-xs">
				<span className="font-medium text-neutral-700">{label}</span>
				<span className="font-mono text-neutral-500">{formatted}</span>
			</div>
			<input
				type="range"
				value={value}
				min={min}
				max={max}
				step={step}
				onChange={(e) => onChange(Number(e.target.value))}
				className="w-full accent-neutral-900"
			/>
		</label>
	);
}
