import { useRef, useState } from "react";
import type { AppState } from "../state/appState";
import type { HistoryEntry } from "../storage/localStorage";
import { downloadJson, readJsonFile } from "../utils/file";
import { CollapsibleSection } from "./CollapsibleSection";

type Props = {
  state: AppState;
  history: HistoryEntry[];
  onSaveSnapshot: () => void;
  onRestore: (state: AppState) => void;
  onDeleteSnapshot: (id: string) => void;
  onCopyShareUrl: () => Promise<void>;
};

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function isAppStateLike(v: unknown): v is AppState {
  if (typeof v !== "object" || v === null) return false;
  const x = v as Record<string, unknown>;
  return (
    Array.isArray(x.inputColors) &&
    Array.isArray(x.chain) &&
    (x.sortMode === "input" || x.sortMode === "lightness")
  );
}

export function PersistencePanel({
  state,
  history,
  onSaveSnapshot,
  onRestore,
  onDeleteSnapshot,
  onCopyShareUrl,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle"
  );

  const handleShare = async () => {
    try {
      await onCopyShareUrl();
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
    setTimeout(() => setCopyState("idle"), 2000);
  };

  const handleDownload = () => {
    const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    downloadJson(`reuni-${stamp}.json`, state);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await readJsonFile(file);
      if (!isAppStateLike(data)) {
        setError("JSON の形が違うかも");
        return;
      }
      onRestore(data);
      setError(null);
    } catch {
      setError("ファイル読み込みに失敗したよ");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <CollapsibleSection title="保存と履歴とURL共有">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onSaveSnapshot}
          className="rounded-lg bg-rose-700 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-rose-600"
        >
          履歴に保存
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm font-medium text-rose-800 hover:border-rose-300 hover:bg-rose-100"
        >
          🔗 共有URLをコピー
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          JSON保存
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          JSON読み込み
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          onChange={handleUpload}
          className="hidden"
        />
        {copyState === "copied" && (
          <span className="self-center text-xs text-rose-700">
            コピーしたよ〜
          </span>
        )}
        {copyState === "failed" && (
          <span className="self-center text-xs text-red-600">コピー失敗</span>
        )}
        {error && (
          <span className="self-center text-xs text-red-600">{error}</span>
        )}
      </div>

      {history.length > 0 ? (
        <ul className="space-y-2">
          {history.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-2"
            >
              <div className="flex flex-1 items-center gap-2 overflow-hidden">
                <div className="flex gap-1">
                  {entry.state.inputColors.slice(0, 6).map((hex, i) => (
                    <span
                      key={`${entry.id}-${i}`}
                      className="inline-block h-5 w-5 rounded-sm ring-1 ring-black/10"
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
                <div className="min-w-0 flex-1 text-xs">
                  <div className="truncate font-medium text-neutral-800">
                    {entry.name}
                  </div>
                  <div className="text-neutral-500">
                    {formatTimestamp(entry.savedAt)} ・{" "}
                    {entry.state.inputColors.length}色 ・{" "}
                    {entry.state.chain.length}ステップ
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRestore(entry.state)}
                className="rounded border border-neutral-300 px-2 py-1 text-xs text-neutral-700 hover:bg-neutral-50"
              >
                復元
              </button>
              <button
                type="button"
                onClick={() => onDeleteSnapshot(entry.id)}
                aria-label="削除"
                className="rounded p-1 text-neutral-500 hover:bg-red-50 hover:text-red-600"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-neutral-500">
          履歴に保存するとここに直近5件まで出るよ
        </p>
      )}
    </CollapsibleSection>
  );
}
