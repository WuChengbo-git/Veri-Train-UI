# Reports と Settings ページの実装について

このドキュメントは、Reports（レポート）と Settings（設定）ページの実装内容を説明します。

## 📁 実装されたファイル

### Types (型定義)
- `src/types/report.ts` - レポート関連の型定義
- `src/types/settings.ts` - 設定関連の型定義

### API Services
- `src/services/reportApi.ts` - レポート API クライアント
- `src/services/settingsApi.ts` - 設定 API クライアント

### Stores (状態管理)
- `src/stores/reportStore.ts` - レポートの状態管理（Zustand）
- `src/stores/settingsStore.ts` - 設定の状態管理（Zustand）

### Pages (ページコンポーネント)
- `src/pages/Reports/index.tsx` - レポート一覧ページ
- `src/pages/Settings/index.tsx` - 設定ページ

### ドキュメント
- `API_MOCK_DATA.md` - Mock API データフォーマット（後端開発者向け）
- `test-api.html` - API テストページ（更新版）

## 🎯 機能概要

### Reports ページ

#### 主要機能
1. **レポート一覧表示**
   - ページネーション対応
   - タイプ別フィルター（パフォーマンス、比較、分析、サマリー）
   - ステータス別フィルター（下書き、生成中、公開済み）
   - キーワード検索

2. **レポート操作**
   - 新規作成
   - 詳細表示
   - 編集（下書きのみ）
   - 公開
   - エクスポート（PDF、Word、HTML）
   - 削除

3. **統計情報表示**
   - 総レポート数
   - ステータス別集計

#### UI コンポーネント
- Ant Design の Table、Card、Modal、Dropdown などを使用
- レスポンシブデザイン対応
- 日本語ローカライゼーション

### Settings ページ

#### 主要機能
タブ形式で以下の設定セクションを提供：

1. **一般設定（General）**
   - 言語選択
   - タイムゾーン
   - テーマ（ライト/ダーク/自動）
   - 通知の有効化

2. **トレーニング設定（Training）**
   - デフォルトパラメータ（エポック数、バッチサイズ、学習率）
   - チェックポイント設定
   - 早期停止設定

3. **評価設定（Evaluation）**
   - デフォルト評価指標
   - GPT評価設定
   - 人間評価設定
   - 信頼度閾値

4. **ストレージ設定（Storage）**
   - 使用状況の可視化
   - データ保持期間
   - 自動クリーンアップ
   - 手動クリーンアップ機能

5. **API設定（API）**
   - ベースURL
   - タイムアウト
   - リトライ設定
   - レート制限
   - 接続テスト機能

6. **セキュリティ設定（Security）**
   - 二要素認証
   - セッションタイムアウト
   - パスワード有効期限
   - IPホワイトリスト

7. **ユーザー設定（User）**
   - プロフィール情報
   - 通知設定
   - 表示設定

## 🔌 API エンドポイント

詳細は [API_MOCK_DATA.md](./API_MOCK_DATA.md) を参照してください。

### Reports API
- `GET /api/v1/reports` - レポート一覧取得
- `GET /api/v1/reports/:id` - レポート詳細取得
- `POST /api/v1/reports` - 新規レポート作成
- `PUT /api/v1/reports/:id` - レポート更新
- `DELETE /api/v1/reports/:id` - レポート削除
- `POST /api/v1/reports/:id/publish` - レポート公開
- `GET /api/v1/reports/:id/export` - レポートエクスポート

### Settings API
- `GET /api/v1/settings/system` - システム設定取得
- `PUT /api/v1/settings/system` - システム設定更新
- `GET /api/v1/settings/preferences` - ユーザー設定取得
- `PUT /api/v1/settings/preferences` - ユーザー設定更新
- `POST /api/v1/settings/system/reset` - システム設定リセット
- `POST /api/v1/settings/test-connection` - API接続テスト
- `POST /api/v1/settings/cleanup-storage` - ストレージクリーンアップ

## 🚀 開発の進め方

### フロントエンド開発者向け

1. **既に実装済み**
   - すべてのコンポーネント、Store、API クライアントが実装されています
   - `npm run dev` でアプリケーションを起動して確認できます

2. **カスタマイズ**
   - 必要に応じてコンポーネントのスタイルや動作を調整
   - 新しい機能を追加する場合は、同じパターンに従ってください

### バックエンド開発者向け

1. **API実装の参考資料**
   - `API_MOCK_DATA.md` - データフォーマットとエンドポイント仕様
   - `test-api.html` - API テストページ

2. **実装の優先順位**
   - まず GET エンドポイントを実装（データ取得）
   - 次に POST/PUT エンドポイント（データ更新）
   - 最後に DELETE と特殊機能（エクスポート、クリーンアップなど）

3. **テスト方法**
   - `test-api.html` をブラウザで開いて各エンドポイントをテスト
   - フロントエンドアプリケーションを起動して統合テスト

## 📊 データフロー

```
User Interaction
    ↓
Page Component (Reports/Settings)
    ↓
Store (useReportStore/useSettingsStore)
    ↓
API Service (reportApi/settingsApi)
    ↓
API Client (axios)
    ↓
Backend API Server
```

## 🎨 UI/UX の特徴

1. **一貫性**
   - 他のページ（Datasets、Evaluation など）と同じデザインパターン
   - Ant Design コンポーネントの活用

2. **レスポンシブ**
   - テーブルの横スクロール対応
   - モバイルフレンドリーなレイアウト

3. **ユーザビリティ**
   - 確認ダイアログで誤操作防止
   - ローディング状態の表示
   - エラーハンドリング
   - 成功メッセージの表示

4. **多言語対応**
   - 日本語 UI
   - 言語切り替え機能（Settings で実装予定）

## 🔧 技術スタック

- **React** 18.x - UI フレームワーク
- **TypeScript** - 型安全性
- **Zustand** - 状態管理
- **Ant Design** - UI コンポーネント
- **Axios** - HTTP クライアント
- **React Router** - ルーティング

## 📝 今後の拡張性

以下の機能を追加する際の参考：

1. **Reports ページ**
   - レポートテンプレート機能
   - レポート共有機能
   - グラフ・チャートの埋め込み
   - PDF プレビュー

2. **Settings ページ**
   - 設定のインポート/エクスポート
   - 設定履歴の管理
   - ロールベースのアクセス制御
   - 監査ログ

## 🐛 既知の課題

現時点では、バックエンド API が未実装のため：

1. **データ取得エラー**
   - API エンドポイントにアクセスすると 404 エラーが発生します
   - これは正常な動作です（バックエンドが実装されていないため）

2. **解決方法**
   - バックエンド開発者が `API_MOCK_DATA.md` を参照して API を実装
   - または、開発用の Mock サーバーを起動（例: json-server）

## 📚 参考資料

- [Ant Design Components](https://ant.design/components/overview/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [React Router Documentation](https://reactrouter.com/)
- [Axios Documentation](https://axios-http.com/)

## ✅ 完了チェックリスト

- [x] Reports ページの実装
- [x] Settings ページの実装
- [x] 型定義の作成
- [x] API サービスの作成
- [x] Store の実装
- [x] ルーティングの設定
- [x] API ドキュメントの作成
- [x] テストページの更新
- [ ] バックエンド API の実装（後端開発者の作業）
- [ ] 統合テスト
- [ ] E2E テスト

---

**作成日**: 2024-12-26
**作成者**: AI Assistant
**バージョン**: 1.0
