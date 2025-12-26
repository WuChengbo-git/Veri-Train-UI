# Veri-Train UI プロジェクト構造

最終更新: 2024-12-26

## 📁 ルートディレクトリ

```
Veri-Train-UI/
├── 📄 README.md                    # プロジェクトメインドキュメント
├── 📄 QUICKSTART.md                # クイックスタートガイド
├── 📄 test-api.html                # API テストページ
│
├── 📁 docs/                        # 詳細ドキュメント
│   ├── README.md                   # ドキュメント索引
│   ├── ARCHITECTURE.md             # フロントエンドアーキテクチャ
│   ├── BACKEND_ARCHITECTURE.md     # バックエンドアーキテクチャ
│   ├── PROJECT_SUMMARY.md          # プロジェクト総括
│   ├── REPORTS_AND_SETTINGS_IMPLEMENTATION.md  # 実装詳細
│   └── API_MOCK_DATA.md            # API モックデータ仕様
│
├── 📁 src/                         # ソースコード
│   ├── 📁 pages/                   # ページコンポーネント
│   │   ├── Dashboard/
│   │   ├── Models/
│   │   ├── Datasets/
│   │   ├── Experiments/
│   │   ├── Evaluation/
│   │   ├── Reports/               # レポートページ（新規実装）
│   │   └── Settings/              # 設定ページ（新規実装）
│   │
│   ├── 📁 components/              # 共通コンポーネント
│   │   ├── common/
│   │   ├── charts/
│   │   ├── layout/
│   │   └── business/
│   │
│   ├── 📁 stores/                  # Zustand 状態管理
│   │   ├── modelStore.ts
│   │   ├── datasetStore.ts
│   │   ├── experimentStore.ts
│   │   ├── evaluationStore.ts
│   │   ├── reportStore.ts         # 新規追加
│   │   └── settingsStore.ts       # 新規追加
│   │
│   ├── 📁 services/                # API サービス層
│   │   ├── api.ts
│   │   ├── reportApi.ts           # 新規追加
│   │   └── settingsApi.ts         # 新規追加
│   │
│   ├── 📁 types/                   # TypeScript 型定義
│   │   ├── model.ts
│   │   ├── dataset.ts
│   │   ├── experiment.ts
│   │   ├── evaluation.ts
│   │   ├── report.ts              # 新規追加
│   │   ├── settings.ts            # 新規追加
│   │   └── api.ts
│   │
│   ├── 📁 router/                  # ルーティング
│   ├── 📁 hooks/                   # カスタム Hooks
│   ├── 📁 utils/                   # ユーティリティ
│   ├── 📁 assets/                  # 静的リソース
│   ├── App.tsx
│   └── main.tsx
│
├── 📁 node_modules/                # 依存パッケージ（Git管理外）
├── 📁 dist/                        # ビルド出力（Git管理外）
│
├── 📄 package.json                 # パッケージ設定
├── 📄 package-lock.json            # 依存関係ロック
├── 📄 tsconfig.json                # TypeScript 設定
├── 📄 vite.config.ts               # Vite 設定
├── 📄 tailwind.config.js           # TailwindCSS 設定
├── 📄 postcss.config.js            # PostCSS 設定
├── 📄 .env.example                 # 環境変数テンプレート
├── 📄 .env                         # 環境変数（Git管理外）
└── 📄 .gitignore                   # Git 除外設定
```

## 🎯 整理したポイント

### ✅ 削除したファイル
- `dist/` - ビルド出力（`npm run build` で再生成可能）
- `tsconfig.tsbuildinfo` - TypeScript ビルドキャッシュ

### 📂 移動したドキュメント
以下のドキュメントを `docs/` ディレクトリに整理：
- ARCHITECTURE.md
- BACKEND_ARCHITECTURE.md
- PROJECT_SUMMARY.md
- REPORTS_AND_SETTINGS_IMPLEMENTATION.md
- API_MOCK_DATA.md

### 📝 更新したファイル
- **README.md** - ドキュメント索引セクションを追加
- **.gitignore** - `*.tsbuildinfo` を追加
- **docs/README.md** - ドキュメント索引ページを新規作成

## 🚀 使い方

### 開発開始時
```bash
npm install          # 依存関係インストール
npm run dev          # 開発サーバー起動
```

### ビルド時
```bash
npm run build        # プロダクションビルド
npm run preview      # ビルド結果プレビュー
```

### ドキュメント閲覧
1. **まず読む**: [README.md](./README.md)
2. **すぐ始める**: [QUICKSTART.md](./QUICKSTART.md)
3. **詳細確認**: [docs/](./docs/) ディレクトリ

### API テスト
ブラウザで [test-api.html](./test-api.html) を開く

## 📊 プロジェクト統計

- **総ページ数**: 7ページ（Dashboard, Models, Datasets, Experiments, Evaluation, Reports, Settings）
- **新規実装**: Reports, Settings ページ
- **ドキュメント数**: 6個（詳細ドキュメント）
- **技術スタック**: React 18 + TypeScript + Vite + Ant Design + Zustand

---

**メンテナンス担当者へ**: 新しいドキュメントを追加する場合は、`docs/` ディレクトリに配置し、README.md と docs/README.md を更新してください。
