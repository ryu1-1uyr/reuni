import type { AppState } from "../state/appState";

const CURRENT_KEY = "reuni:current";
const HISTORY_KEY = "reuni:history";
export const HISTORY_LIMIT = 5;

export type HistoryEntry = {
	id: string;
	name: string;
	savedAt: string;
	state: AppState;
};

function isAppStateShape(value: unknown): value is AppState {
	if (typeof value !== "object" || value === null) return false;
	const v = value as Record<string, unknown>;
	return (
		Array.isArray(v.inputColors) &&
		v.inputColors.every((c) => typeof c === "string") &&
		Array.isArray(v.chain) &&
		(v.sortMode === "input" || v.sortMode === "lightness") &&
		(v.anchorIndex === undefined || typeof v.anchorIndex === "number")
	);
}

function safeParse<T>(raw: string | null, validator: (v: unknown) => v is T): T | null {
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw);
		return validator(parsed) ? parsed : null;
	} catch {
		return null;
	}
}

export function loadCurrent(): AppState | null {
	if (typeof window === "undefined") return null;
	return safeParse(window.localStorage.getItem(CURRENT_KEY), isAppStateShape);
}

export function saveCurrent(state: AppState): void {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(CURRENT_KEY, JSON.stringify(state));
	} catch {
		// Storage full or unavailable — silently skip.
	}
}

function isHistoryEntry(value: unknown): value is HistoryEntry {
	if (typeof value !== "object" || value === null) return false;
	const v = value as Record<string, unknown>;
	return (
		typeof v.id === "string" &&
		typeof v.name === "string" &&
		typeof v.savedAt === "string" &&
		isAppStateShape(v.state)
	);
}

function isHistoryArray(value: unknown): value is HistoryEntry[] {
	return Array.isArray(value) && value.every(isHistoryEntry);
}

export function loadHistory(): HistoryEntry[] {
	if (typeof window === "undefined") return [];
	return (
		safeParse(window.localStorage.getItem(HISTORY_KEY), isHistoryArray) ?? []
	);
}

function persistHistory(history: HistoryEntry[]): void {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
	} catch {
		// ignore
	}
}

function generateId(): string {
	if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
		return crypto.randomUUID();
	}
	return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function appendHistory(
	history: HistoryEntry[],
	state: AppState,
	name: string,
): HistoryEntry[] {
	const entry: HistoryEntry = {
		id: generateId(),
		name,
		savedAt: new Date().toISOString(),
		state,
	};
	const next = [entry, ...history].slice(0, HISTORY_LIMIT);
	persistHistory(next);
	return next;
}

export function removeFromHistory(
	history: HistoryEntry[],
	id: string,
): HistoryEntry[] {
	const next = history.filter((e) => e.id !== id);
	persistHistory(next);
	return next;
}
