# Veri-Train 后端架构设计文档

> 本文档为后端开发团队提供完整的架构设计和实现指南

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| **FastAPI** | 0.100+ | Web框架,提供REST API |
| **Celery** | 5.x | 异步任务队列(训练/评测/数据生成) |
| **PostgreSQL** | 15+ | 主数据库(元数据存储) |
| **Redis** | 7.x | Celery broker + 缓存 |
| **SQLAlchemy** | 2.x | ORM |
| **Pydantic** | 2.x | 数据验证 |
| **WebSocket** | - | 实时通信(FastAPI原生) |
| **Alembic** | - | 数据库迁移 |

## 系统架构图

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend (React)                      │
│              http://localhost:3000                      │
└───────────────────┬─────────────────────────────────────┘
                    │ HTTP/WebSocket
                    ▼
┌─────────────────────────────────────────────────────────┐
│              FastAPI Gateway                            │
│           http://localhost:8000                         │
│  ┌──────────────────────┐  ┌──────────────────────┐    │
│  │  REST API Endpoints  │  │  WebSocket Server    │    │
│  │  /api/v1/*          │  │  /ws                 │    │
│  └──────────────────────┘  └──────────────────────┘    │
└──────┬────────────────────────────┬─────────────────────┘
       │                            │
       ▼                            ▼
┌──────────────┐            ┌──────────────┐
│ PostgreSQL   │            │    Redis     │
│  Port: 5432  │            │  Port: 6379  │
│              │            │              │
│ - Models     │            │ - Task Queue │
│ - Datasets   │            │ - Cache      │
│ - Experiments│            │ - Sessions   │
│ - Evaluations│            │              │
└──────────────┘            └──────┬───────┘
                                   │
                                   ▼
                            ┌──────────────┐
                            │    Celery    │
                            │   Workers    │
                            └──────┬───────┘
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
              ┌─────────┐   ┌──────────┐   ┌──────────┐
              │Training │   │Data Gen  │   │Evaluation│
              │ Worker  │   │ Worker   │   │ Worker   │
              └─────────┘   └──────────┘   └──────────┘
                  GPU           GPT API      CPU/GPU
```

## 项目结构

```
veri-train-backend/
├── app/
│   ├── main.py                 # FastAPI应用入口
│   ├── config.py               # 配置管理
│   ├── database.py             # 数据库连接
│   │
│   ├── api/
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── router.py       # 路由聚合
│   │       ├── deps.py         # 依赖注入
│   │       └── endpoints/
│   │           ├── models.py
│   │           ├── datasets.py
│   │           ├── experiments.py
│   │           ├── evaluation.py
│   │           ├── reports.py
│   │           └── websocket.py
│   │
│   ├── models/                 # SQLAlchemy模型
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── model.py
│   │   ├── dataset.py
│   │   ├── experiment.py
│   │   ├── evaluation.py
│   │   └── report.py
│   │
│   ├── schemas/                # Pydantic模式
│   │   ├── __init__.py
│   │   ├── model.py
│   │   ├── dataset.py
│   │   ├── experiment.py
│   │   ├── evaluation.py
│   │   └── common.py
│   │
│   ├── services/               # 业务逻辑
│   │   ├── __init__.py
│   │   ├── model_service.py
│   │   ├── dataset_service.py
│   │   ├── experiment_service.py
│   │   └── evaluation_service.py
│   │
│   ├── tasks/                  # Celery任务
│   │   ├── __init__.py
│   │   ├── celery_app.py
│   │   ├── training.py
│   │   ├── generation.py
│   │   ├── evaluation.py
│   │   └── quality_gate.py
│   │
│   ├── core/                   # 核心功能
│   │   ├── __init__.py
│   │   ├── security.py         # 认证授权
│   │   ├── cache.py            # Redis缓存
│   │   └── websocket.py        # WebSocket管理
│   │
│   └── utils/                  # 工具函数
│       ├── __init__.py
│       ├── metrics.py          # 评测指标计算
│       ├── data_utils.py
│       └── model_utils.py
│
├── alembic/                    # 数据库迁移
│   ├── versions/
│   └── env.py
│
├── tests/                      # 测试
│   ├── api/
│   ├── services/
│   └── tasks/
│
├── scripts/                    # 脚本
│   ├── init_db.py
│   └── seed_data.py
│
├── requirements.txt
├── pyproject.toml
├── Dockerfile
└── docker-compose.yml
```

## 核心API设计

### 1. Models API

```python
# app/api/v1/endpoints/models.py

@router.get("/models", response_model=PaginatedResponse[Model])
async def get_models(
    page: int = 1,
    page_size: int = 20,
    status: Optional[str] = None,
    type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """获取模型列表"""
    ...

@router.get("/models/{model_id}", response_model=ModelDetail)
async def get_model_detail(
    model_id: str,
    db: Session = Depends(get_db)
):
    """获取模型详情"""
    ...

@router.post("/models/{model_id}/probe", response_model=BaselineProbe)
async def run_baseline_probe(
    model_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """运行基线行为探测"""
    # 这是关键功能!
    # 检测模型是否:
    # - 支持多候选输出
    # - 提供解释性输出
    # - 遵循输出契约
    ...

@router.get("/models/{model_id}/evaluations")
async def get_model_evaluations(
    model_id: str,
    db: Session = Depends(get_db)
):
    """获取模型评测历史"""
    ...
```

### 2. Datasets API

```python
# app/api/v1/endpoints/datasets.py

@router.post("/datasets", response_model=Dataset)
async def upload_dataset(
    file: UploadFile,
    metadata: str = Form(...),
    db: Session = Depends(get_db)
):
    """上传数据集"""
    # 1. 保存文件
    # 2. 解析元数据
    # 3. 触发Quality Gate检查(Celery任务)
    ...

@router.post("/datasets/generate/estimate", response_model=GenerateEstimate)
async def estimate_generation_cost(
    config: GenerateDatasetConfig,
    db: Session = Depends(get_db)
):
    """估算数据生成成本"""
    # 根据配置计算:
    # - Token数量
    # - GPT API成本
    # - 预估时间
    ...

@router.post("/datasets/generate", response_model=TaskResponse)
async def generate_dataset(
    config: GenerateDatasetConfig,
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks
):
    """生成数据集(异步)"""
    # 启动Celery任务
    task = tasks.generate_dataset.delay(config.dict())
    return {"task_id": task.id}

@router.get("/datasets/{dataset_id}/quality-gate", response_model=QualityGateResult)
async def get_quality_gate(
    dataset_id: str,
    db: Session = Depends(get_db)
):
    """获取质量门禁结果"""
    # 返回:
    # - 对齐率
    # - 重复率
    # - 语言一致性
    # - 抽样人工评审
    ...
```

### 3. Experiments API

```python
# app/api/v1/endpoints/experiments.py

@router.post("/experiments", response_model=Experiment)
async def create_experiment(
    experiment: ExperimentCreate,
    db: Session = Depends(get_db)
):
    """创建实验"""
    # 验证:
    # - Dataset是否passed质量门禁
    # - Model是否available
    # - Config是否合法
    ...

@router.post("/experiments/{experiment_id}/start", response_model=Experiment)
async def start_experiment(
    experiment_id: str,
    db: Session = Depends(get_db)
):
    """启动实验"""
    # 1. 更新状态为running
    # 2. 触发Celery训练任务
    # 3. 返回task_id
    task = tasks.train_model.delay(experiment_id)
    ...

@router.get("/experiments/{experiment_id}/logs")
async def get_experiment_logs(
    experiment_id: str,
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """获取实验日志"""
    ...

# WebSocket端点
@router.websocket("/experiments/{experiment_id}/stream")
async def experiment_stream(
    websocket: WebSocket,
    experiment_id: str
):
    """实验实时进度流"""
    await websocket.accept()

    # 订阅Redis Pub/Sub
    # Worker会发布进度到Redis
    # 这里从Redis读取并推送给前端
    async for message in redis_pubsub.listen():
        await websocket.send_json(message)
```

### 4. WebSocket API

```python
# app/api/v1/endpoints/websocket.py

class ConnectionManager:
    """WebSocket连接管理器"""

    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, client_id: str, websocket: WebSocket):
        await websocket.accept()
        if client_id not in self.active_connections:
            self.active_connections[client_id] = []
        self.active_connections[client_id].append(websocket)

    async def disconnect(self, client_id: str, websocket: WebSocket):
        self.active_connections[client_id].remove(websocket)

    async def broadcast_to_client(self, client_id: str, message: dict):
        if client_id in self.active_connections:
            for connection in self.active_connections[client_id]:
                await connection.send_json(message)

manager = ConnectionManager()

@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    token: str = Query(...)
):
    """WebSocket主端点"""
    # 1. 验证token
    user = await authenticate_ws_token(token)

    # 2. 建立连接
    await manager.connect(user.id, websocket)

    try:
        # 3. 监听客户端订阅请求
        async for message in websocket.iter_json():
            if message["type"] == "subscribe":
                # 订阅特定实验/数据集
                await handle_subscription(user.id, message)
    except WebSocketDisconnect:
        manager.disconnect(user.id, websocket)
```

## Celery任务设计

### 1. 训练任务

```python
# app/tasks/training.py

@celery_app.task(bind=True)
def train_model(self, experiment_id: str):
    """训练模型任务"""

    # 1. 加载实验配置
    experiment = db.query(Experiment).get(experiment_id)

    # 2. 准备数据
    dataset = prepare_dataset(experiment.dataset_id)

    # 3. 加载模型
    model = load_model(experiment.base_model_id)

    # 4. 训练循环
    for epoch in range(experiment.config.epochs):
        for step, batch in enumerate(dataloader):
            # 训练步骤
            loss = train_step(model, batch)

            # 发布进度到Redis
            progress = {
                "experiment_id": experiment_id,
                "epoch": epoch,
                "step": step,
                "loss": float(loss),
                "gpu_util": get_gpu_utilization(),
                "eta": calculate_eta()
            }
            redis_client.publish(
                f"experiment:{experiment_id}",
                json.dumps(progress)
            )

            # 更新Celery任务状态
            self.update_state(
                state='PROGRESS',
                meta=progress
            )

    # 5. 保存模型
    save_checkpoint(model, experiment_id)

    # 6. 触发评测
    evaluate_model.delay(experiment_id)

    return {"status": "completed"}
```

### 2. 数据生成任务

```python
# app/tasks/generation.py

@celery_app.task(bind=True)
def generate_dataset(self, config: dict):
    """生成数据集任务"""

    # 1. 加载seed数据
    seed_data = load_seed(config["seed_source"])

    # 2. 调用GPT API生成
    generated_samples = []

    for i, seed in enumerate(seed_data):
        # 根据策略生成prompt
        prompt = build_generation_prompt(seed, config["strategy"])

        # 调用GPT
        response = openai.ChatCompletion.create(
            model=config["strategy"]["model"],
            messages=[{"role": "user", "content": prompt}]
        )

        generated_samples.append(response.choices[0].message.content)

        # 更新进度
        progress = (i + 1) / len(seed_data) * 100
        self.update_state(
            state='PROGRESS',
            meta={"progress": progress}
        )

    # 3. 保存数据集
    dataset_id = save_generated_dataset(generated_samples, config)

    # 4. 触发质量门禁
    check_quality_gate.delay(dataset_id)

    return {"dataset_id": dataset_id}
```

### 3. 质量门禁任务

```python
# app/tasks/quality_gate.py

@celery_app.task
def check_quality_gate(dataset_id: str):
    """质量门禁检查任务"""

    dataset = db.query(Dataset).get(dataset_id)
    data = load_dataset_content(dataset)

    # 1. 对齐率检查
    alignment_rate = calculate_alignment_rate(data)

    # 2. 重复率检查
    duplicate_rate = calculate_duplicate_rate(data)

    # 3. 语言一致性检查
    language_consistency = check_language_consistency(data)

    # 4. 抽样GPT评分
    sample_scores = []
    for sample in random.sample(data, min(100, len(data))):
        score = gpt_evaluate_quality(sample)
        sample_scores.append(score)

    # 5. 判定
    result = QualityGateResult(
        alignment_rate=alignment_rate,
        duplicate_rate=duplicate_rate,
        language_consistency=language_consistency,
        avg_sample_score=np.mean(sample_scores)
    )

    # 阈值判定
    if (result.alignment_rate < 0.8 or
        result.duplicate_rate > 0.2 or
        result.language_consistency < 0.9):
        dataset.status = "blocked"
        result.status = "failed"
    else:
        dataset.status = "passed"
        result.status = "passed"

    # 6. 保存结果
    dataset.quality_gate_result = result.dict()
    db.commit()

    # 7. 通知前端
    redis_client.publish(
        f"dataset:{dataset_id}",
        json.dumps({
            "type": "quality_gate",
            "result": result.dict()
        })
    )

    return result.dict()
```

## 数据库模型设计

```python
# app/models/experiment.py

class Experiment(Base):
    __tablename__ = "experiments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)

    # 关联
    dataset_id = Column(UUID(as_uuid=True), ForeignKey("datasets.id"))
    base_model_id = Column(UUID(as_uuid=True), ForeignKey("models.id"))
    adapter_id = Column(UUID(as_uuid=True), ForeignKey("models.id"), nullable=True)
    prompt_contract_id = Column(UUID(as_uuid=True), ForeignKey("prompt_contracts.id"))

    # 配置(JSONB)
    config = Column(JSONB, nullable=False)

    # 状态
    status = Column(String(50), default="pending")

    # 结果
    metrics = Column(JSONB)
    best_checkpoint_path = Column(String(500))

    # 时间戳
    created_at = Column(DateTime, default=datetime.utcnow)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)

    # 关系
    dataset = relationship("Dataset", back_populates="experiments")
    base_model = relationship("Model", foreign_keys=[base_model_id])
    evaluations = relationship("Evaluation", back_populates="experiment")
```

## 配置管理

```python
# app/config.py

from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # API配置
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "Veri-Train API"

    # 数据库
    DATABASE_URL: str

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # Celery
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"

    # Azure OpenAI
    AZURE_OPENAI_KEY: str
    AZURE_OPENAI_ENDPOINT: str

    # 认证
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # 文件存储
    UPLOAD_DIR: str = "./uploads"
    CHECKPOINT_DIR: str = "./checkpoints"

    class Config:
        env_file = ".env"

settings = Settings()
```

## Docker部署

```yaml
# docker-compose.yml

version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: veritrain
      POSTGRES_USER: veritrain
      POSTGRES_PASSWORD: veritrain
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    ports:
      - "6379:6379"

  api:
    build: .
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    ports:
      - "8000:8000"
    depends_on:
      - postgres
      - redis
    environment:
      - DATABASE_URL=postgresql://veritrain:veritrain@postgres/veritrain
      - REDIS_URL=redis://redis:6379/0
    volumes:
      - ./app:/app/app
      - ./uploads:/app/uploads
      - ./checkpoints:/app/checkpoints

  celery_worker:
    build: .
    command: celery -A app.tasks.celery_app worker --loglevel=info
    depends_on:
      - postgres
      - redis
    environment:
      - DATABASE_URL=postgresql://veritrain:veritrain@postgres/veritrain
      - REDIS_URL=redis://redis:6379/0
    volumes:
      - ./app:/app/app
      - ./checkpoints:/app/checkpoints

  celery_beat:
    build: .
    command: celery -A app.tasks.celery_app beat --loglevel=info
    depends_on:
      - redis
    environment:
      - REDIS_URL=redis://redis:6379/0

volumes:
  postgres_data:
```

## 开发启动流程

```bash
# 1. 启动数据库和Redis
docker-compose up -d postgres redis

# 2. 创建数据库表
alembic upgrade head

# 3. 启动FastAPI
uvicorn app.main:app --reload

# 4. 启动Celery Worker
celery -A app.tasks.celery_app worker --loglevel=info

# 5. (可选)启动Flower监控
celery -A app.tasks.celery_app flower
```

## 关键实现要点

### 1. Baseline Probe实现

这是系统的核心创新功能,用于检测模型的基础能力:

```python
def run_baseline_probe(model_id: str) -> BaselineProbe:
    """
    检测模型的基线行为:
    1. 是否支持多候选输出(n>1)
    2. 是否提供解释性输出
    3. 是否遵循输出契约(格式约束)
    """

    # 测试用例
    test_cases = [
        {
            "input": "会議は明日開催されます。",
            "expected_behavior": "multi_candidate"
        },
        # ...
    ]

    results = {
        "is_multi_candidate": False,
        "has_explanation": False,
        "follows_output_contract": True
    }

    for case in test_cases:
        # 调用模型
        output = call_model(model_id, case["input"], n=3)

        # 分析结果
        if len(output.candidates) > 1:
            results["is_multi_candidate"] = True

        if "explanation" in output:
            results["has_explanation"] = True

        # ...

    return BaselineProbe(**results)
```

### 2. Quality Gate实现

```python
QUALITY_GATE_THRESHOLDS = {
    "alignment_rate": 0.8,      # 对齐率≥80%
    "duplicate_rate": 0.2,      # 重复率≤20%
    "language_consistency": 0.9 # 语言一致性≥90%
}

def check_quality_gate(dataset: Dataset) -> QualityGateResult:
    """
    数据质量门禁检查
    """
    # 计算指标...

    # 判定
    passed = all([
        metrics["alignment_rate"] >= QUALITY_GATE_THRESHOLDS["alignment_rate"],
        metrics["duplicate_rate"] <= QUALITY_GATE_THRESHOLDS["duplicate_rate"],
        metrics["language_consistency"] >= QUALITY_GATE_THRESHOLDS["language_consistency"]
    ])

    return QualityGateResult(
        status="passed" if passed else "failed",
        metrics=metrics
    )
```

## 监控和日志

```python
# 使用structlog进行结构化日志
import structlog

logger = structlog.get_logger()

@router.post("/experiments/{experiment_id}/start")
async def start_experiment(experiment_id: str):
    logger.info(
        "experiment_started",
        experiment_id=experiment_id,
        user_id=current_user.id
    )
    # ...
```

## 安全性

1. **JWT认证**: 所有API都需要Bearer Token
2. **CORS配置**: 限制允许的前端域名
3. **SQL注入防护**: 使用ORM参数化查询
4. **文件上传验证**: 限制文件类型和大小
5. **Rate Limiting**: 使用slowapi限制请求频率

---

**状态**: 📋 架构设计完成,等待实现

**优先级**:
1. FastAPI基础框架 + 数据库模型
2. Models/Datasets API
3. Celery训练任务
4. WebSocket实时通信
5. Quality Gate和Baseline Probe
