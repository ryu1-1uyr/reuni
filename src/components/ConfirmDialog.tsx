import { useEffect, useRef } from "react";

type Props = {
	open: boolean;
	title?: string;
	message: string;
	confirmLabel?: string;
	cancelLabel?: string;
	onConfirm: () => void;
	onCancel: () => void;
};

export function ConfirmDialog({
	open,
	title,
	message,
	confirmLabel = "OK",
	cancelLabel = "キャンセル",
	onConfirm,
	onCancel,
}: Props) {
	const confirmRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onCancel();
		};
		document.addEventListener("keydown", onKey);
		confirmRef.current?.focus();
		return () => document.removeEventListener("keydown", onKey);
	}, [open, onCancel]);

	if (!open) return null;

	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby={title ? "confirm-dialog-title" : undefined}
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
		>
			<button
				type="button"
				aria-label="キャンセル"
				onClick={onCancel}
				className="absolute inset-0 bg-black/40"
			/>
			<div className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl ring-1 ring-rose-100">
				{title && (
					<h3
						id="confirm-dialog-title"
						className="mb-2 text-base font-semibold text-neutral-800"
					>
						{title}
					</h3>
				)}
				<p className="text-sm text-neutral-700">{message}</p>
				<div className="mt-5 flex justify-end gap-2">
					<button
						type="button"
						onClick={onCancel}
						className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
					>
						{cancelLabel}
					</button>
					<button
						ref={confirmRef}
						type="button"
						onClick={onConfirm}
						className="rounded-lg bg-rose-700 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-rose-600"
					>
						{confirmLabel}
					</button>
				</div>
			</div>
		</div>
	);
}
