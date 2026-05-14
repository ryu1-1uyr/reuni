import { type ReactNode, useState } from "react";

type Props = {
	title: string;
	defaultOpen?: boolean;
	children: ReactNode;
	rightSlot?: ReactNode;
};

export function CollapsibleSection({
	title,
	defaultOpen = false,
	children,
	rightSlot,
}: Props) {
	const [open, setOpen] = useState(defaultOpen);

	return (
		<section className="space-y-3">
			<div className="flex items-center justify-between gap-2">
				<button
					type="button"
					onClick={() => setOpen((o) => !o)}
					aria-expanded={open}
					className="group flex items-center gap-1.5 text-sm font-semibold text-neutral-700 hover:text-neutral-900"
				>
					<span
						className={`inline-block text-xs transition-transform ${
							open ? "rotate-90" : ""
						}`}
						aria-hidden="true"
					>
						▶
					</span>
					{title}
				</button>
				{open && rightSlot}
			</div>
			{open && children}
		</section>
	);
}
