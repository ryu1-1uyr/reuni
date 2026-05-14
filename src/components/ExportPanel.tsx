import { useEffect, useState } from "react";
import type { HexColor } from "../core/types";
import {
	EXPORT_FORMAT_LABELS,
	type ExportFormat,
	formatExport,
} from "../utils/exportFormats";

type Props = {
	colors: HexColor[];
};

const FORMATS: ExportFormat[] = ["json", "css", "tailwind"];

export function ExportPanel({ colors }: Props) {
	const [format, setFormat] = useState<ExportFormat>("json");
	const [copied, setCopied] = useState(false);
	const code = formatExport(colors, format);

	useEffect(() => {
		if (!copied) return;
		const timer = setTimeout(() => setCopied(false), 1500);
		return () => clearTimeout(timer);
	}, [copied]);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
		} catch {
			setCopied(false);
		}
	};

	return (
		<section className="space-y-3">
			<div className="flex items-center justify-between">
				<h2 className="text-sm font-semibold text-neutral-700">エクスポート</h2>
				<button
					type="button"
					onClick={handleCopy}
					disabled={colors.length === 0}
					className="rounded-md border border-neutral-300 bg-white px-3 py-1 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-40"
				>
					{copied ? "コピーしたよ" : "コピー"}
				</button>
			</div>
			<div className="inline-flex rounded-md border border-neutral-300 bg-white p-0.5 text-sm">
				{FORMATS.map((f) => (
					<button
						key={f}
						type="button"
						onClick={() => setFormat(f)}
						aria-pressed={format === f}
						className={`rounded px-3 py-1 transition-colors ${
							format === f
								? "bg-neutral-900 text-white"
								: "text-neutral-700 hover:bg-neutral-100"
						}`}
					>
						{EXPORT_FORMAT_LABELS[f]}
					</button>
				))}
			</div>
			<pre className="max-h-64 overflow-auto rounded-lg border border-neutral-200 bg-neutral-900 p-3 font-mono text-xs leading-relaxed text-neutral-50">
				{code}
			</pre>
		</section>
	);
}
