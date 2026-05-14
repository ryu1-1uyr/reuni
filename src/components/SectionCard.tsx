import type { ReactNode } from "react";

type Props = {
	children: ReactNode;
	className?: string;
};

export function SectionCard({ children, className }: Props) {
	return (
		<div
			className={`rounded-2xl bg-white p-4 shadow-sm ring-1 ring-rose-100/60 sm:p-5 ${
				className ?? ""
			}`}
		>
			{children}
		</div>
	);
}
