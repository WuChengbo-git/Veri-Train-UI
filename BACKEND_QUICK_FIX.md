# バックエンド クイックフィックス

## 🚨 現在の問題

フロントエンドから以下のエラーが発生しています：

```
Access to XMLHttpRequest at 'http://10.36.94.98:8000/api/v1/reports'
from origin 'http://10.36.94.98:3000' has been blocked by CORS policy
```

## ✅ 解決方法（3ステップ）

### Step 1: CORS を有効にする

バックエンドのメインファイルに以下を追加してください：

```python
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# この部分を追加
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://10.36.94.98:3000",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Step 2: Reports API エンドポイントを実装

[docs/API_MOCK_DATA.md](docs/API_MOCK_DATA.md) を参照して実装してください。

最低限必要なエンドポイント：

```python
@app.get("/api/v1/reports")
async def get_reports(
    page: int = 1,
    pageSize: int = 10
):
    # モックデータを返す（実装例は API_MOCK_DATA.md を参照）
    return {
        "items": [],  # レポートのリスト
        "total": 0,
        "page": page,
        "pageSize": pageSize,
        "totalPages": 0
    }

@app.get("/api/v1/settings/system")
async def get_system_settings():
    # モックデータを返す（実装例は API_MOCK_DATA.md を参照）
    return {
        "general": {...},
        "training": {...},
        # ...
    }
```

### Step 3: サーバーを再起動

```bash
# FastAPI の場合
uvicorn main:app --reload --host 10.36.94.98 --port 8000
```

## 📖 詳細ドキュメント

- **[API_FORMAT_VALIDATION.md](API_FORMAT_VALIDATION.md)** - ⭐ **データフォーマット検証** (まずこれを確認)
- **[docs/CORS_SETUP.md](docs/CORS_SETUP.md)** - CORS 設定の詳細
- **[docs/API_MOCK_DATA.md](docs/API_MOCK_DATA.md)** - API データフォーマット仕様
- **[docs/BACKEND_ARCHITECTURE.md](docs/BACKEND_ARCHITECTURE.md)** - アーキテクチャ設計

## 🧪 テスト方法

1. **ブラウザでフロントエンドを開く**
   ```
   http://10.36.94.98:3000
   ```

2. **Reports または Settings ページに移動**

3. **エラーが消えることを確認**

---

**急ぎの場合は Step 1 だけでも実装してください。** CORS が有効になれば、フロントエンドからの API 呼び出しが成功します。
