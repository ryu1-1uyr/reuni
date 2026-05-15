import type { BlendChain, BlendStep, HexColor } from "../core/types";

export type SharedState = {
	inputColors: HexColor[];
	anchorIndex?: number;
	chain: BlendChain;
};

const STATE_KEY = "s";

function utf8ToBase64(s: string): string {
	const bytes = new TextEncoder().encode(s);
	let binary = "";
	for (const b of bytes) binary += String.fromCharCode(b);
	return btoa(binary);
}

function base64ToUtf8(b64: string): string {
	const binary = atob(b64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	return new TextDecoder().decode(bytes);
}

function toUrlSafe(b64: string): string {
	return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromUrlSafe(s: string): string {
	const restored = s.replace(/-/g, "+").replace(/_/g, "/");
	const padding = (4 - (restored.length % 4)) % 4;
	return restored + "=".repeat(padding);
}

const VALID_STEP_TYPES = new Set([
	"chroma",
	"lightness",
	"tone",
	"mix",
	"anchor",
]);

function isValidStep(step: unknown): step is BlendStep {
	if (typeof step !== "object" || step === null) return false;
	const s = step as Record<string, unknown>;
	return typeof s.type === "string" && VALID_STEP_TYPES.has(s.type);
}

function isHexColor(v: unknown): v is HexColor {
	return typeof v === "string" && /^#[0-9a-fA-F]{3,8}$/.test(v);
}

export function encodeSharedState(state: SharedState): string {
	return toUrlSafe(utf8ToBase64(JSON.stringify(state)));
}

export function decodeSharedState(encoded: string): SharedState | null {
	try {
		const json = base64ToUtf8(fromUrlSafe(encoded));
		const parsed: unknown = JSON.parse(json);
		if (typeof parsed !== "object" || parsed === null) return null;
		const obj = parsed as Record<string, unknown>;
		if (!Array.isArray(obj.inputColors) || !obj.inputColors.every(isHexColor)) {
			return null;
		}
		if (!Array.isArray(obj.chain) || !obj.chain.every(isValidStep)) return null;
		const anchorIndex =
			typeof obj.anchorIndex === "number" ? obj.anchorIndex : undefined;
		return {
			inputColors: obj.inputColors as HexColor[],
			anchorIndex,
			chain: obj.chain as BlendChain,
		};
	} catch {
		return null;
	}
}

export function readSharedStateFromHash(hash: string): SharedState | null {
	const params = new URLSearchParams(hash.replace(/^#/, ""));
	const encoded = params.get(STATE_KEY);
	if (!encoded) return null;
	return decodeSharedState(encoded);
}

export function buildShareUrl(state: SharedState): string {
	const url = new URL(window.location.href);
	url.hash = `${STATE_KEY}=${encodeSharedState(state)}`;
	return url.toString();
}
