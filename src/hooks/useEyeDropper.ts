import { useCallback, useMemo } from "react";

export function useEyeDropper() {
	const isSupported = useMemo(
		() => typeof window !== "undefined" && "EyeDropper" in window,
		[],
	);

	const pick = useCallback(async (): Promise<string | null> => {
		if (!isSupported || !window.EyeDropper) return null;
		try {
			const eyeDropper = new window.EyeDropper();
			const result = await eyeDropper.open();
			return result.sRGBHex;
		} catch {
			return null;
		}
	}, [isSupported]);

	return { isSupported, pick };
}
