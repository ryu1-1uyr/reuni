interface ColorSelectionResult {
	sRGBHex: string;
}

interface EyeDropper {
	open(options?: { signal?: AbortSignal }): Promise<ColorSelectionResult>;
}

interface EyeDropperConstructor {
	new (): EyeDropper;
}

interface Window {
	EyeDropper?: EyeDropperConstructor;
}
