# トラブルシューティング

## 🔴 よくあるエラーと解決方法

### 1. CORS エラー

#### エラーメッセージ
```
Access to XMLHttpRequest at 'http://10.36.94.98:8000/api/v1/...'
from origin 'http://10.36.94.98:3000' has been blocked by CORS policy
```

#### 原因
バックエンドで CORS（Cross-Origin Resource Sharing）が設定されていません。

#### 解決方法
**👉 [BACKEND_QUICK_FIX.md](./BACKEND_QUICK_FIX.md) を参照してください**

バックエンド開発者が以下を追加する必要があります：

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://10.36.94.98:3000", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

### 2. 500 Internal Server Error

#### エラーメッセージ
```
GET http://10.36.94.98:8000/api/v1/reports net::ERR_FAILED 500
```

#### 原因
バックエンドで `/api/v1/reports` エンドポイントが実装されていないか、エラーが発生しています。

#### 解決方法

**オプション A: バックエンド実装を待つ**
- [docs/API_MOCK_DATA.md](./docs/API_MOCK_DATA.md) を参照してバックエンド開発者が実装

**オプション B: Mock サーバーを使用（開発用）**
```bash
# Mock サーバーを起動
node mock-server.js

# .env ファイルを更新
VITE_API_BASE_URL=http://localhost:8001/api/v1
```

---

### 3. TypeError: Cannot read properties of undefined

#### エラーメッセージ
```
TypeError: Cannot read properties of undefined (reading 'items')
```

#### 原因
API レスポンスが期待される形式と異なります。

#### 解決方法
✅ **既に修正済み**: evaluationStore.ts を更新しました。
- API エラー時も安全にハンドリングするようになりました
- 空配列をデフォルト値として設定

---

## 🛠️ デバッグ方法

### 1. ブラウザの開発者ツール

**F12** キーを押して開発者ツールを開く

#### Network タブ
- API リクエストの状態を確認
- レスポンスヘッダーを確認
- エラーの詳細を確認

#### Console タブ
- JavaScript エラーを確認
- console.log の出力を確認

### 2. API テストツール

ブラウザで [test-api.html](./test-api.html) を開いて、各エンドポイントをテスト

### 3. curl コマンド

```bash
# Reports API をテスト
curl http://10.36.94.98:8000/api/v1/reports

# Settings API をテスト
curl http://10.36.94.98:8000/api/v1/settings/system
```

---

## 📋 チェックリスト

開発環境を正しくセットアップするためのチェックリスト：

### フロントエンド

- [ ] Node.js 18+ がインストールされている
- [ ] `npm install` が完了している
- [ ] `.env` ファイルが存在し、正しい API URL が設定されている
- [ ] `npm run dev` でサーバーが起動している
- [ ] ブラウザで `http://10.36.94.98:3000` にアクセスできる

### バックエンド

- [ ] バックエンドサーバーが起動している
- [ ] `http://10.36.94.98:8000` でアクセス可能
- [ ] CORS が設定されている
- [ ] 以下のエンドポイントが実装されている：
  - [ ] `GET /api/v1/reports`
  - [ ] `GET /api/v1/settings/system`
  - [ ] `GET /api/v1/settings/preferences`
  - [ ] `GET /api/v1/evaluations`

---

## 🔍 よくある質問

### Q: ページが真っ白になる

**A:** ブラウザのコンソールでエラーを確認してください
- JavaScript のビルドエラーがある可能性
- `npm run build` を実行して TypeScript エラーをチェック

### Q: データが表示されない

**A:** 以下を確認してください：
1. バックエンド API が正しく動作しているか
2. CORS が設定されているか
3. API レスポンスの形式が正しいか（[docs/API_MOCK_DATA.md](./docs/API_MOCK_DATA.md) 参照）

### Q: ビルドが失敗する

**A:** 以下を試してください：
```bash
# node_modules を削除して再インストール
rm -rf node_modules package-lock.json
npm install

# キャッシュをクリア
rm -rf dist .vite
npm run build
```

---

## 📞 サポート

問題が解決しない場合：

1. GitHub Issues を確認
2. [README.md](./README.md) のドキュメントを確認
3. バックエンド開発者に [BACKEND_QUICK_FIX.md](./BACKEND_QUICK_FIX.md) を共有

---

## 🎯 現在の状態

### ✅ 動作している機能
- Dashboard
- Models
- Datasets
- Experiments
- Evaluation（フロントエンド）

### ⚠️ バックエンド実装待ち
- Reports API
- Settings API

これらの機能は、バックエンドで CORS 設定と API エンドポイントを実装すれば、すぐに動作します！
