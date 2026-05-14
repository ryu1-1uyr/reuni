# reuni

離れた色同士を再結合して馴染ませる、ブラウザで動くカラーパレット調整ツール。

赤・黄・緑のように色相が離れた色を組み合わせると、彩度や明度がバラついてケンカして見えがち。reuni はそれらを **OKLCH 色空間** で機械的に揃えて、絵やデザインで使えるまとまったパレットに整える。

## 特徴

- **5 つの馴染ませモード** をチェーン状に積み重ねて適用
  - 彩度統一・明度統一・トーン統一（L ＋ C 同時）
  - 共通色ブレンド（ベージュ等を全色に N% 混ぜる）
  - 入力色にあわせる（基準色の L/C に他を寄せる、色相は維持）
- **Before / After 並列表示** ＋ 入力順 / 明度順トグル
- **なんかいい感じにするボタン** ボタン：入力色から中央値 L・C のトーン統一とベージュ 15% ブレンドを自動生成
- **色サジェスト**：パレットに足りない色相を提案（既存色の hue ギャップから計算）
- **スポイト（EyeDropper API）** で画面上の任意ピクセルを取り込み（対応ブラウザのみ）
- **カラーピッカー**：HEX 手入力欄にネイティブのカラーサークル
- **エクスポート**：プレーン HEX / JSON / CSS 変数 / Tailwind v4 `@theme` 形式、ワンクリックコピー
- **保存と履歴**：LocalStorage に直近 5 件まで保存・JSON ファイル書き出し / 読み込み

## 技術スタック

| 層            | 採用                                                          |
| ------------- | ------------------------------------------------------------- |
| ビルド        | Vite 8                                                        |
| 言語          | TypeScript                                                    |
| UI            | React 19                                                      |
| 色計算        | [`culori`](https://culorijs.org/)（OKLCH ↔ sRGB、gamut clip） |
| スタイル      | Tailwind CSS v4（`@tailwindcss/vite`）                        |
| テスト        | Vitest 4（happy-dom）                                         |
| Lint / Format | Biome                                                         |

色計算は **OKLCH 色空間** で行うのがミソ。人間の知覚と線形に近いから、L や C を機械的に揃えても見た目で違和感が出にくいらしい。

## ディレクトリ構成

```
src/
├── core/                 # UI に依存しない純粋ロジック
│   ├── types.ts          # Palette / BlendStep などの型
│   ├── constants.ts      # OKLCH 範囲・ブレンド色プリセット
│   ├── colorspace.ts     # HEX ↔ OKLCH / OKLab 変換
│   ├── modes/            # 5 つの馴染ませモード（各純粋関数）
│   └── index.ts          # applyStep / applyChain
├── components/           # React コンポーネント
├── hooks/                # useEyeDropper
├── state/                # useReducer の state / action
├── storage/              # LocalStorage 永続化
├── utils/                # exportFormats / recommend / hex / file
└── types/                # window.EyeDropper の型補完
tests/                    # core/ の単体テスト
```

`core/` は UI に依存しない純粋関数。テストしやすく、後で CLI 化したい時もそのまま再利用できる作り。

## 開発コマンド

```bash
npm install        # 依存インストール

npm run dev        # 開発サーバー（localhost:5173/）
npm test           # テスト 1 回
npm run test:watch # ファイル監視テスト
npm run build      # 型チェック + 本番ビルド
npm run preview    # build した dist を確認
npm run lint       # Biome lint
npm run format     # Biome format
```

## デプロイ

`main` ブランチに push すると `.github/workflows/deploy.yml` が走って公開される

`public/CNAME` にカスタムドメインを記載しており、Vite が `dist/CNAME` として出力する。`vite.config.ts` の `base` はルートドメインで配信するので `'/'` 固定。サブパス配信に戻す場合は `'/<path>/'` に変更すること。

## ライセンス

MIT
