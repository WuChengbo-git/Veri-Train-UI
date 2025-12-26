# API データフォーマット検証ガイド

## 🎯 目的

このドキュメントは、バックエンドが返すデータ形式とフロントエンドが期待する形式が一致しているかを確認するためのものです。

## 📋 現在の状況

### Reports API のテスト結果

```bash
curl http://10.36.94.98:8000/api/v1/reports
```

**現在のレスポンス:**
```
500 Internal Server Error
```

❌ **問題**: エンドポイントがエラーを返しています

---

## ✅ 正しいデータフォーマット

### 1. GET /api/v1/reports

#### フロントエンドが期待する形式

```json
{
  "items": [
    {
      "id": "report-001",
      "experimentId": "exp-001",
      "title": "モデル性能比較レポート",
      "description": "複数のモデルを比較した性能分析レポート",
      "type": "comparison",
      "status": "published",
      "createdAt": "2024-12-20T10:00:00Z",
      "publishedAt": "2024-12-21T15:30:00Z",
      "createdBy": "山田太郎",
      "tags": ["comparison", "performance"]
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 10,
  "totalPages": 1
}
```

#### 重要なポイント

1. **トップレベルのキー**
   - ✅ `items` (配列) - レポートのリスト
   - ✅ `total` (数値) - 総アイテム数
   - ✅ `page` (数値) - 現在のページ
   - ✅ `pageSize` (数値) - ページサイズ
   - ✅ `totalPages` (数値) - 総ページ数

2. **各レポートオブジェクト (items 配列の要素)**
   - ✅ `id` (文字列) - レポートID
   - ✅ `experimentId` (文字列) - 実験ID
   - ✅ `title` (文字列) - タイトル
   - ✅ `description` (文字列) - 説明
   - ✅ `type` (文字列) - タイプ: "performance" | "comparison" | "analysis" | "summary"
   - ✅ `status` (文字列) - ステータス: "draft" | "generating" | "published"
   - ✅ `createdAt` (文字列) - 作成日時 (ISO 8601形式)
   - ✅ `publishedAt` (文字列 | null) - 公開日時
   - ✅ `createdBy` (文字列) - 作成者
   - ✅ `tags` (配列) - タグ

3. **命名規則**
   - ⚠️ **camelCase を使用** (例: `experimentId`, `createdAt`)
   - ❌ snake_case は使わない (例: `experiment_id`, `created_at`)

---

### 2. GET /api/v1/settings/system

#### フロントエンドが期待する形式

```json
{
  "general": {
    "language": "ja",
    "timezone": "Asia/Tokyo",
    "theme": "light",
    "notifications_enabled": true
  },
  "training": {
    "default_epochs": 10,
    "default_batch_size": 32,
    "default_learning_rate": 0.001,
    "auto_save_checkpoints": true,
    "checkpoint_interval": 5,
    "early_stopping_enabled": true,
    "early_stopping_patience": 3
  },
  "evaluation": {
    "default_metrics": ["bleu", "rouge_l", "ribes"],
    "enable_gpt_eval": true,
    "gpt_model": "gpt-4-turbo",
    "enable_human_eval": false,
    "confidence_threshold": 0.8
  },
  "storage": {
    "data_retention_days": 90,
    "auto_cleanup_enabled": true,
    "max_storage_gb": 1000,
    "current_usage_gb": 456.78
  },
  "api": {
    "base_url": "http://10.36.94.98:8000/api/v1",
    "timeout_seconds": 30,
    "retry_attempts": 3,
    "rate_limit_per_minute": 100
  },
  "security": {
    "two_factor_enabled": false,
    "session_timeout_minutes": 30,
    "password_expiry_days": 90,
    "ip_whitelist": ["10.36.94.0/24"]
  }
}
```

#### 重要なポイント

- ネストされたオブジェクト構造
- 各セクション (general, training, evaluation, etc.) は必須
- snake_case のキー名を使用 (設定項目なので)

---

### 3. GET /api/v1/settings/preferences

#### フロントエンドが期待する形式

```json
{
  "user_id": "user-001",
  "email": "user@example.com",
  "display_name": "山田太郎",
  "avatar_url": "https://example.com/avatar.jpg",
  "email_notifications": true,
  "desktop_notifications": true,
  "weekly_summary": true,
  "preferred_language": "ja",
  "items_per_page": 20,
  "default_view": "table"
}
```

---

## 🧪 テスト方法

### 1. curl でテスト

```bash
# Reports API
curl -X GET http://10.36.94.98:8000/api/v1/reports \
  -H "Content-Type: application/json" \
  | python -m json.tool

# Settings System API
curl -X GET http://10.36.94.98:8000/api/v1/settings/system \
  -H "Content-Type: application/json" \
  | python -m json.tool

# Settings Preferences API
curl -X GET http://10.36.94.98:8000/api/v1/settings/preferences \
  -H "Content-Type: application/json" \
  | python -m json.tool
```

### 2. test-api.html でテスト

ブラウザで [test-api.html](./test-api.html) を開いて、各ボタンをクリック

### 3. フロントエンドから確認

```bash
# フロントエンドを起動
npm run dev

# ブラウザで開く
http://10.36.94.98:3000

# Reports ページに移動して、Network タブでレスポンスを確認
```

---

## ❌ よくある間違い

### 間違い 1: snake_case を使う (Reports API)

```json
// ❌ 間違い
{
  "items": [{
    "experiment_id": "exp-001",  // ← snake_case
    "created_at": "2024-12-20"   // ← snake_case
  }]
}

// ✅ 正しい
{
  "items": [{
    "experimentId": "exp-001",   // ← camelCase
    "createdAt": "2024-12-20"    // ← camelCase
  }]
}
```

### 間違い 2: data 配列を返す

```json
// ❌ 間違い
{
  "data": [...],    // ← "data" ではなく "items"
  "total": 10
}

// ✅ 正しい
{
  "items": [...],   // ← "items" を使う
  "total": 10
}
```

### 間違い 3: ページネーション情報がない

```json
// ❌ 間違い
[
  { "id": "report-001" },
  { "id": "report-002" }
]

// ✅ 正しい
{
  "items": [
    { "id": "report-001" },
    { "id": "report-002" }
  ],
  "total": 2,
  "page": 1,
  "pageSize": 10,
  "totalPages": 1
}
```

---

## 🔍 デバッグ用 FastAPI コード例

### Reports API の実装例

```python
from fastapi import FastAPI, Query
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

app = FastAPI()

class Report(BaseModel):
    id: str
    experimentId: str  # camelCase!
    title: str
    description: str
    type: str  # "performance" | "comparison" | "analysis" | "summary"
    status: str  # "draft" | "generating" | "published"
    createdAt: str  # ISO 8601
    publishedAt: Optional[str] = None
    createdBy: str
    tags: List[str] = []

class PaginatedReports(BaseModel):
    items: List[Report]
    total: int
    page: int
    pageSize: int
    totalPages: int

@app.get("/api/v1/reports", response_model=PaginatedReports)
async def get_reports(
    page: int = Query(1, ge=1),
    pageSize: int = Query(10, ge=1, le=100)
):
    # モックデータ
    mock_reports = [
        Report(
            id="report-001",
            experimentId="exp-001",
            title="モデル性能比較レポート",
            description="複数のモデルを比較した性能分析レポート",
            type="comparison",
            status="published",
            createdAt=datetime.now().isoformat(),
            publishedAt=datetime.now().isoformat(),
            createdBy="山田太郎",
            tags=["comparison", "performance"]
        )
    ]

    return PaginatedReports(
        items=mock_reports,
        total=len(mock_reports),
        page=page,
        pageSize=pageSize,
        totalPages=1
    )
```

---

## ✅ チェックリスト

バックエンド開発者用：

- [ ] CORS が設定されている
- [ ] `/api/v1/reports` が実装されている
- [ ] レスポンス形式が正しい (items, total, page, pageSize, totalPages)
- [ ] フィールド名が camelCase になっている
- [ ] `/api/v1/settings/system` が実装されている
- [ ] `/api/v1/settings/preferences` が実装されている
- [ ] すべてのエンドポイントが 200 OK を返す
- [ ] エラーハンドリングが適切

---

## 📞 サポート

問題が解決しない場合は、以下の情報を共有してください：

1. エンドポイントの URL
2. 実際のレスポンス (JSON)
3. エラーメッセージ
4. バックエンドのログ

詳細は [docs/API_MOCK_DATA.md](./docs/API_MOCK_DATA.md) を参照してください。
