import type { HexColor } from "../core/types";

export type ExportFormat = "json" | "css" | "tailwind";

export const EXPORT_FORMAT_LABELS: Record<ExportFormat, string> = {
	json: "JSON",
	css: "CSS変数",
	tailwind: "Tailwind v4",
};

export function formatExport(
	colors: HexColor[],
	format: ExportFormat,
): string {
	switch (format) {
		case "json":
			return JSON.stringify(colors, null, 2);
		case "css": {
			const lines = colors.map((c, i) => `  --color-${i + 1}: ${c};`);
			return `:root {\n${lines.join("\n")}\n}`;
		}
		case "tailwind": {
			const lines = colors.map((c, i) => `  --color-palette-${i + 1}: ${c};`);
			return `@theme {\n${lines.join("\n")}\n}`;
		}
	}
}
