# CORS 設定ガイド

## 問題

フロントエンド（http://10.36.94.98:3000）からバックエンド API（http://10.36.94.98:8000）にアクセスする際、以下のエラーが発生：

```
Access to XMLHttpRequest at 'http://10.36.94.98:8000/api/v1/reports'
from origin 'http://10.36.94.98:3000' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## 原因

バックエンドが CORS（Cross-Origin Resource Sharing）を許可していないため、異なるポート間の通信がブロックされています。

## 解決方法

### FastAPI の場合（推奨）

バックエンドのメインファイル（通常は `main.py`）に以下を追加：

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS設定を追加
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://10.36.94.98:3000",  # フロントエンドのURL
        "http://localhost:3000",     # ローカル開発用
    ],
    allow_credentials=True,
    allow_methods=["*"],  # すべてのHTTPメソッドを許可
    allow_headers=["*"],  # すべてのヘッダーを許可
)

# 既存のルート...
```

### 開発環境用（すべてのオリジンを許可）

開発中は、すべてのオリジンからのアクセスを許可することもできます：

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 開発環境のみ：すべてのオリジンを許可
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

⚠️ **警告**: 本番環境では `allow_origins=["*"]` は使用しないでください。セキュリティリスクになります。

### Django の場合

1. `django-cors-headers` をインストール：
```bash
pip install django-cors-headers
```

2. `settings.py` に設定を追加：
```python
INSTALLED_APPS = [
    ...
    'corsheaders',
    ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    ...
]

# 開発環境
CORS_ALLOWED_ORIGINS = [
    "http://10.36.94.98:3000",
    "http://localhost:3000",
]

# または開発中のみすべて許可
# CORS_ALLOW_ALL_ORIGINS = True
```

### Flask の場合

1. `flask-cors` をインストール：
```bash
pip install flask-cors
```

2. アプリケーションに設定を追加：
```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

# CORS設定
CORS(app, origins=[
    "http://10.36.94.98:3000",
    "http://localhost:3000"
])

# または開発中のみすべて許可
# CORS(app)
```

## 確認方法

### 1. ブラウザの開発者ツールで確認

設定後、ブラウザの開発者ツール（F12）の Network タブで、API リクエストのレスポンスヘッダーに以下が含まれていることを確認：

```
Access-Control-Allow-Origin: http://10.36.94.98:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

### 2. curl コマンドでテスト

```bash
curl -i -X OPTIONS http://10.36.94.98:8000/api/v1/reports \
  -H "Origin: http://10.36.94.98:3000" \
  -H "Access-Control-Request-Method: GET"
```

成功すると、レスポンスヘッダーに `Access-Control-Allow-Origin` が含まれます。

### 3. フロントエンドから確認

CORS設定後、フロントエンドアプリケーションを再読み込みして、エラーが消えることを確認してください。

## 新しいエンドポイントの追加

Reports と Settings のエンドポイントを実装する際は、[API_MOCK_DATA.md](./API_MOCK_DATA.md) を参照してください：

### 実装が必要なエンドポイント

#### Reports
- `GET /api/v1/reports` - レポート一覧
- `GET /api/v1/reports/:id` - レポート詳細
- `POST /api/v1/reports` - レポート作成
- `PUT /api/v1/reports/:id` - レポート更新
- `DELETE /api/v1/reports/:id` - レポート削除
- `POST /api/v1/reports/:id/publish` - レポート公開

#### Settings
- `GET /api/v1/settings/system` - システム設定取得
- `PUT /api/v1/settings/system` - システム設定更新
- `GET /api/v1/settings/preferences` - ユーザー設定取得
- `PUT /api/v1/settings/preferences` - ユーザー設定更新
- `POST /api/v1/settings/test-connection` - API接続テスト
- `POST /api/v1/settings/cleanup-storage` - ストレージクリーンアップ

## トラブルシューティング

### エラーが解決しない場合

1. **バックエンドサーバーを再起動**
   ```bash
   # サーバーを停止して再起動
   ```

2. **フロントエンドのキャッシュをクリア**
   - ブラウザで Ctrl+Shift+R（強制リロード）
   - またはブラウザのキャッシュをクリア

3. **ポート番号を確認**
   - フロントエンド: `http://10.36.94.98:3000`
   - バックエンド: `http://10.36.94.98:8000`

4. **ログを確認**
   バックエンドのログで CORS 関連のエラーメッセージをチェック

## 参考資料

- [FastAPI CORS ドキュメント](https://fastapi.tiangolo.com/tutorial/cors/)
- [MDN - CORS](https://developer.mozilla.org/ja/docs/Web/HTTP/CORS)
- [Django CORS Headers](https://pypi.org/project/django-cors-headers/)
- [Flask-CORS](https://flask-cors.readthedocs.io/)
