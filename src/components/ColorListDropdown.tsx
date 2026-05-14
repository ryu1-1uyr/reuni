import { useEffect, useRef, useState } from "react";
import type { HexColor } from "../core/types";

type Props = {
	colors: HexColor[];
	value: number;
	onChange: (index: number) => void;
	ariaLabel?: string;
};

export function ColorListDropdown({
	colors,
	value,
	onChange,
	ariaLabel,
}: Props) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;
		const onDocClick = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};
		document.addEventListener("mousedown", onDocClick);
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("mousedown", onDocClick);
			document.removeEventListener("keydown", onKey);
		};
	}, [open]);

	const selected = colors[value];
	const safeIndex = Math.max(0, Math.min(value, colors.length - 1));

	return (
		<div ref={ref} className="relative">
			<button
				type="button"
				onClick={() => setOpen((o) => !o)}
				aria-haspopup="listbox"
				aria-expanded={open}
				aria-label={ariaLabel}
				className="flex w-full items-center gap-2 rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-left text-xs hover:bg-neutral-50"
			>
				{selected ? (
					<>
						<span
							className="inline-block h-4 w-4 shrink-0 rounded-sm ring-1 ring-black/10"
							style={{ backgroundColor: selected }}
						/>
						<span className="font-mono">
							#{safeIndex + 1}: {selected.toLowerCase()}
						</span>
					</>
				) : (
					<span className="text-neutral-400">(色を選んで)</span>
				)}
				<span className="ml-auto text-neutral-400">▾</span>
			</button>
			{open && (
				<ul
					role="listbox"
					className="absolute left-0 right-0 top-full z-10 mt-1 max-h-56 overflow-auto rounded-md border border-neutral-200 bg-white py-1 shadow-lg"
				>
					{colors.map((hex, i) => (
						<li key={`${hex}-${i}`} role="option" aria-selected={i === value}>
							<button
								type="button"
								onClick={() => {
									onChange(i);
									setOpen(false);
								}}
								className={`flex w-full items-center gap-2 px-2 py-1.5 text-left text-xs hover:bg-neutral-100 ${
									i === value ? "bg-neutral-100" : ""
								}`}
							>
								<span
									className="inline-block h-4 w-4 shrink-0 rounded-sm ring-1 ring-black/10"
									style={{ backgroundColor: hex }}
								/>
								<span className="font-mono">
									#{i + 1}: {hex.toLowerCase()}
								</span>
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
