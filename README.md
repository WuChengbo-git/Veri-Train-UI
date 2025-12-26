# Veri-Train UI

モデル迭代闭环工作台 (Model Iteration Workbench)

## 概要

Veri-Train UIは、機械学習モデルのトレーニング、評価、データセット管理を統合的に行うためのWebアプリケーションです。単なるトレーニングパネルではなく、「なぜ」「何を」「どう変わったか」を可視化し、意思決定をサポートするツールです。

## 主な機能

### 1️⃣ Dashboard (ダッシュボード)
- システム全体の状態を一目で把握
- 実験のステータス監視
- 最新のデータセットとモデルの動向
- システムアラートと推奨アクション

### 2️⃣ Models (モデル管理)
- ベースモデルとアダプター(LoRA)の管理
- ベースライン動作探査(Baseline Behavior Probe)
- モデルごとの評価履歴
- Prompt Contract管理

### 3️⃣ Datasets (データセット管理)
- Human/Synthetic/Mixedデータの統合管理
- Quality Gate(品質門禁)による自動品質検証
- データセット生成ウィザード
- バージョン管理

### 4️⃣ Experiments (実験管理)
- トレーニング実験の作成と実行
- リアルタイム進捗監視(WebSocket)
- 実験間の比較分析
- ハイパーパラメータ管理

### 5️⃣ Evaluation (評価)
- Spoken/Written両トラックの評価
- BLEU, ROUGE-L, RIBES等の自動メトリクス
- GPT評価(流暢性、適切性、MQM)
- エラー分析とサンプル表示

### 6️⃣ Reports (レポート)
- 実験結果の自動レポート生成
- 変更点と影響分析
- 次ステップの推奨
- PDF/HTMLエクスポート

### 7️⃣ Settings (設定)
- Prompt Contractテンプレート
- Quality Gate閾値設定
- Azure GPT Key管理
- ユーザー権限

## 技術スタック

### フロントエンド
- **React 18** - UIフレームワーク
- **TypeScript 5** - 型安全性
- **Vite 6** - 高速ビルドツール
- **Ant Design 5** - UIコンポーネントライブラリ
- **Zustand 4** - 軽量状態管理
- **React Router 6** - ルーティング
- **ECharts 5** - データ可視化
- **Axios** - HTTPクライアント
- **Socket.IO Client** - リアルタイム通信
- **TailwindCSS 3** - スタイリング

### バックエンド(想定)
- **FastAPI** - Pythonウェブフレームワーク
- **Celery** - 非同期タスクキュー
- **PostgreSQL** - リレーショナルデータベース
- **Redis** - キャッシュ&メッセージブローカー
- **WebSocket** - リアルタイム通信

## セットアップ

### 前提条件
- Node.js 18以上
- npm または pnpm

### インストール

```bash
# 依存関係のインストール
npm install

# または
pnpm install
```

### 環境変数の設定

```bash
# .env.exampleをコピーして.envを作成
cp .env.example .env

# .envを編集してAPIエンドポイントを設定
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_WS_URL=ws://localhost:8000
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開きます。

### ビルド

```bash
npm run build
```

ビルド成果物は `dist/` ディレクトリに出力されます。

### プレビュー

```bash
npm run preview
```

## プロジェクト構造

```
src/
├── assets/              # 静的リソース
├── components/          # コンポーネント
│   ├── common/          # 共通コンポーネント
│   ├── charts/          # EChartsラッパー
│   ├── layout/          # レイアウトコンポーネント
│   └── business/        # ビジネスロジック組み込みコンポーネント
├── pages/               # ページコンポーネント
│   ├── Dashboard/       # ダッシュボード
│   ├── Models/          # モデル管理
│   ├── Datasets/        # データセット管理
│   ├── Experiments/     # 実験管理
│   ├── Evaluation/      # 評価
│   ├── Reports/         # レポート
│   └── Settings/        # 設定
├── stores/              # Zustand状態管理
│   ├── modelStore.ts
│   ├── datasetStore.ts
│   ├── experimentStore.ts
│   └── globalStore.ts
├── services/            # APIサービス層
│   ├── api.ts           # Axios設定
│   ├── websocket.ts     # WebSocket設定
│   ├── modelService.ts
│   ├── datasetService.ts
│   └── experimentService.ts
├── types/               # TypeScript型定義
│   ├── model.ts
│   ├── dataset.ts
│   ├── experiment.ts
│   ├── report.ts
│   └── api.ts
├── hooks/               # カスタムHooks
│   └── useWebSocket.ts
├── utils/               # ユーティリティ関数
├── router/              # ルーティング設定
│   └── index.tsx
├── App.tsx
└── main.tsx
```

## 設計原則

### UI設計の3原則

1. **UI ≠ 操作パネル、決策補助ツール**
   - 単にボタンを提供するのではなく、比較・対照を強制し、判断をサポート

2. **すべての重要な判断が可視化されている**
   - なぜトレーニングできないのか?
   - なぜスコアが下がったのか?
   - UI上で明示的に表示

3. **各ページは1つの質問に答える**
   - Dashboard: 今何が起きているか?
   - Models: このモデルは適しているか?
   - Datasets: このデータは価値があるか?
   - Experiments: 何を変更したのか?
   - Evaluation: どこが良く/悪くなったのか?
   - Reports: 次に何をすべきか?

## 開発ガイド

### 新しいページの追加

1. `src/pages/` に新しいディレクトリを作成
2. `index.tsx` でメインコンポーネントを実装
3. `src/router/index.tsx` にルートを追加
4. 必要に応じてStoreとServiceを追加

### 状態管理

Zustandを使用した簡潔な状態管理:

```typescript
// Store定義
export const useMyStore = create<State>()(
  immer((set, get) => ({
    data: [],
    fetchData: async () => {
      const result = await api.get('/data');
      set({ data: result });
    },
  }))
);

// コンポーネントで使用
const { data, fetchData } = useMyStore();
```

### API呼び出し

統一されたAPIクライアントを使用:

```typescript
import { apiClient } from '@/services';

// GET
const data = await apiClient.get<MyType>('/endpoint');

// POST
const result = await apiClient.post('/endpoint', payload);
```

### WebSocketの使用

カスタムHooksでWebSocket接続を管理:

```typescript
import { useExperimentWebSocket } from '@/hooks/useWebSocket';

useExperimentWebSocket(experimentId, (data) => {
  // リアルタイム更新を処理
  console.log('進捗:', data);
});
```

## 📚 ドキュメント

プロジェクトの詳細なドキュメントは `docs/` ディレクトリにあります：

### フロントエンド開発者向け
- **[QUICKSTART.md](./QUICKSTART.md)** - 5分で起動するクイックスタートガイド
- **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - フロントエンド技術アーキテクチャ
- **[docs/REPORTS_AND_SETTINGS_IMPLEMENTATION.md](./docs/REPORTS_AND_SETTINGS_IMPLEMENTATION.md)** - Reports/Settings ページ実装詳細
- **[docs/PROJECT_SUMMARY.md](./docs/PROJECT_SUMMARY.md)** - プロジェクト総括

### バックエンド開発者向け
- **[docs/BACKEND_ARCHITECTURE.md](./docs/BACKEND_ARCHITECTURE.md)** - バックエンドアーキテクチャ設計
- **[docs/API_MOCK_DATA.md](./docs/API_MOCK_DATA.md)** - API モックデータ仕様
- **[docs/CORS_SETUP.md](./docs/CORS_SETUP.md)** - CORS 設定ガイド ⚠️ **重要**

## 🧪 API テスト

`test-api.html` をブラウザで開くことで、バックエンド API のテストが可能です。

## ライセンス

MIT

## 貢献

プルリクエストを歓迎します。大きな変更の場合は、まずIssueを開いて変更内容を議論してください。

## お問い合わせ

質問や提案がある場合は、Issueを作成してください。
