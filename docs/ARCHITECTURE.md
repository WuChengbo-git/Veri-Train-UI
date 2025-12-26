# Veri-Train UI 技术架构文档

## 项目概述
Veri-Train UI 是一个「模型迭代闭环工作台」,不是简单的训练面板。其核心价值在于强制用户在每一步都清楚:
- 我改了什么
- 为什么改
- 带来了什么变化

## 技术栈选型

### 前端技术栈
| 技术 | 版本 | 用途 | 选择原因 |
|------|------|------|----------|
| **React** | 18.x | 前端框架 | 生态最成熟,组件库最丰富,团队熟悉度高 |
| **TypeScript** | 5.x | 类型系统 | 类型安全,IDE支持好,适合大型项目 |
| **Vite** | 5.x | 构建工具 | 开发体验好,构建速度快 |
| **Ant Design** | 5.x | UI组件库 | 企业级UI,表格/表单/步骤条等组件完善 |
| **ECharts** | 5.x | 数据可视化 | 功能强大,图表类型丰富,适合复杂数据展示 |
| **Zustand** | 4.x | 状态管理 | 轻量级,API简洁,性能好 |
| **React Router** | 6.x | 路由管理 | React官方推荐,功能完善 |
| **Axios** | 1.x | HTTP客户端 | 易用,支持拦截器,TypeScript支持好 |
| **Socket.IO** | 4.x | 实时通信 | 自动重连,降级支持,易于集成 |
| **TailwindCSS** | 3.x | 样式工具 | 配合Ant Design做定制化样式 |

### 后端技术栈 (架构规划)
| 技术 | 版本 | 用途 | 选择原因 |
|------|------|------|----------|
| **FastAPI** | 0.100+ | Web框架 | 高性能,自动文档,与ML工具链无缝集成 |
| **Celery** | 5.x | 异步任务队列 | 处理训练/评测等长运行任务,支持进度追踪 |
| **PostgreSQL** | 15+ | 关系数据库 | 存储元数据、配置、版本历史 |
| **Redis** | 7.x | 缓存&消息队列 | Celery broker,实时数据缓存 |
| **SQLAlchemy** | 2.x | ORM | Python最成熟的ORM,类型支持好 |
| **Pydantic** | 2.x | 数据验证 | FastAPI原生支持,类型安全 |
| **WebSocket** | - | 实时通信 | FastAPI原生支持,推送任务进度/日志 |

## 前端架构设计

### 项目结构
```
veri-train-ui/
├── src/
│   ├── assets/              # 静态资源
│   ├── components/          # 通用组件
│   │   ├── common/          # 基础组件(Button, Card等)
│   │   ├── charts/          # ECharts封装组件
│   │   ├── layout/          # 布局组件(Header, Sidebar等)
│   │   └── business/        # 业务组件(QualityGate, BaselineProbe等)
│   ├── pages/               # 页面组件
│   │   ├── Dashboard/
│   │   ├── Models/
│   │   ├── Datasets/
│   │   ├── Experiments/
│   │   ├── Evaluation/
│   │   ├── Reports/
│   │   └── Settings/
│   ├── stores/              # Zustand状态管理
│   │   ├── modelStore.ts
│   │   ├── datasetStore.ts
│   │   ├── experimentStore.ts
│   │   └── globalStore.ts
│   ├── services/            # API服务层
│   │   ├── api.ts           # Axios配置
│   │   ├── websocket.ts     # WebSocket配置
│   │   ├── modelService.ts
│   │   ├── datasetService.ts
│   │   └── experimentService.ts
│   ├── types/               # TypeScript类型定义
│   │   ├── model.ts
│   │   ├── dataset.ts
│   │   ├── experiment.ts
│   │   └── api.ts
│   ├── hooks/               # 自定义Hooks
│   │   ├── useWebSocket.ts
│   │   ├── useRealTimeUpdate.ts
│   │   └── usePagination.ts
│   ├── utils/               # 工具函数
│   │   ├── format.ts
│   │   ├── validation.ts
│   │   └── constants.ts
│   ├── router/              # 路由配置
│   │   └── index.tsx
│   ├── App.tsx
│   └── main.tsx
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

### 核心设计模式

#### 1. 页面组件设计原则
每个页面只回答一个核心问题:
- **Dashboard**: 现在系统里发生了什么?我该先看哪里?
- **Models**: 我现在能用什么模型?它们本质行为是什么?
- **Datasets**: 我有哪些数据?它们健康吗?从哪来的?
- **Experiments**: 我要验证一个假设,并且可对照
- **Evaluation**: 模型在'这个场景'下到底好不好?
- **Reports**: 这次迭代的结论是什么?下一步做什么?

#### 2. 状态管理策略
使用Zustand按领域拆分store:

```typescript
// 示例: modelStore.ts
interface ModelStore {
  models: Model[];
  selectedModel: Model | null;
  fetchModels: () => Promise<void>;
  selectModel: (id: string) => void;
}

// 示例: datasetStore.ts
interface DatasetStore {
  datasets: Dataset[];
  qualityGates: QualityGate[];
  validateDataset: (id: string) => Promise<QualityGateResult>;
}
```

#### 3. API服务层设计
统一封装所有API调用,支持:
- 请求/响应拦截器
- 错误处理
- Loading状态管理
- 类型安全

```typescript
// services/api.ts
class APIClient {
  private axios: AxiosInstance;

  async get<T>(url: string): Promise<T>;
  async post<T>(url: string, data: any): Promise<T>;
  // ...
}

// services/modelService.ts
class ModelService {
  async getModels(): Promise<Model[]>;
  async getModelDetail(id: string): Promise<ModelDetail>;
  async runBaselineProbe(id: string): Promise<ProbeResult>;
}
```

#### 4. 实时通信设计
WebSocket用于推送:
- Experiment实时进度(训练loss、GPU利用率)
- 任务状态变更(Running → Completed)
- 系统通知(质量门禁失败、成本异常)

```typescript
// hooks/useWebSocket.ts
function useWebSocket(experimentId: string) {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const ws = new WebSocket(`ws://api/experiments/${experimentId}/stream`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'progress') setProgress(data.value);
      if (data.type === 'log') setLogs(prev => [...prev, data.message]);
    };
    return () => ws.close();
  }, [experimentId]);

  return { progress, logs };
}
```

## 后端架构设计 (规划)

### 系统架构图
```
┌─────────────┐
│  Frontend   │
│  (React)    │
└──────┬──────┘
       │ HTTP/WebSocket
       ▼
┌─────────────────────────────────────┐
│         FastAPI Gateway             │
│  ┌──────────┐  ┌─────────────────┐ │
│  │ REST API │  │ WebSocket Server│ │
│  └──────────┘  └─────────────────┘ │
└──────┬──────────────────┬───────────┘
       │                  │
       ▼                  ▼
┌─────────────┐    ┌─────────────┐
│ PostgreSQL  │    │   Redis     │
│ (元数据)    │    │ (队列/缓存) │
└─────────────┘    └──────┬──────┘
                          │
                          ▼
                   ┌─────────────┐
                   │   Celery    │
                   │  Workers    │
                   └──────┬──────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
   [训练任务]        [数据生成]         [评测任务]
     (GPU)          (GPT API)         (计算密集)
```

### 核心模块设计

#### 1. API层 (FastAPI)
```python
# app/api/v1/
├── endpoints/
│   ├── models.py        # 模型管理API
│   ├── datasets.py      # 数据集管理API
│   ├── experiments.py   # 实验管理API
│   ├── evaluation.py    # 评测API
│   └── websocket.py     # WebSocket端点
├── deps.py              # 依赖注入
└── router.py            # 路由聚合
```

#### 2. 任务队列 (Celery)
```python
# app/tasks/
├── training.py          # 训练任务
│   └── train_model(experiment_id, config)
├── generation.py        # 数据生成任务
│   └── generate_dataset(seed_id, strategy)
├── evaluation.py        # 评测任务
│   └── evaluate_model(model_id, dataset_id)
└── quality_gate.py      # 质量门禁检查
    └── check_dataset_quality(dataset_id)
```

#### 3. 数据模型 (SQLAlchemy)
```python
# app/models/
├── base.py              # 基础模型
├── model.py             # Model实体
├── dataset.py           # Dataset实体
├── experiment.py        # Experiment实体
├── evaluation.py        # Evaluation实体
└── version.py           # 版本管理实体
```

### 核心功能流程

#### 实验执行流程
```
1. 用户在UI创建Experiment
   ↓
2. Frontend POST /api/experiments
   ↓
3. FastAPI验证配置,保存到PostgreSQL
   ↓
4. 触发Celery任务: tasks.training.train_model.delay(exp_id)
   ↓
5. Worker执行训练:
   - 定期推送进度到Redis
   - WebSocket从Redis读取并推送给Frontend
   ↓
6. 训练完成:
   - 保存Checkpoint
   - 自动触发Evaluation任务
   ↓
7. Evaluation完成:
   - 生成Report
   - WebSocket通知Frontend
```

#### 质量门禁流程
```
1. Dataset上传完成
   ↓
2. 自动触发: tasks.quality_gate.check_dataset_quality.delay(ds_id)
   ↓
3. Worker执行检查:
   - 计算对齐率、重复率、混语率
   - 抽样调用GPT评分
   ↓
4. 结果判定:
   - PASS → 状态设为Available
   - FAIL → 状态设为Blocked,UI高亮提示
   ↓
5. 通知用户(WebSocket)
```

## 数据库设计 (核心表)

### Models表
```sql
CREATE TABLE models (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50),  -- 'base' | 'adapter'
    base_model_id UUID REFERENCES models(id),
    status VARCHAR(50),  -- 'available' | 'deprecated'
    config JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Datasets表
```sql
CREATE TABLE datasets (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    version INT DEFAULT 1,
    type VARCHAR(50),  -- 'human' | 'synthetic' | 'mixed'
    language_direction VARCHAR(20),  -- 'ja-en', 'en-ja'
    scene VARCHAR(50),  -- 'meeting' | 'written'
    status VARCHAR(50),  -- 'draft' | 'passed' | 'blocked'
    quality_gate_result JSONB,
    parent_id UUID REFERENCES datasets(id),
    created_at TIMESTAMP
);
```

### Experiments表
```sql
CREATE TABLE experiments (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    dataset_id UUID REFERENCES datasets(id),
    model_id UUID REFERENCES models(id),
    prompt_contract_id UUID,
    config JSONB,  -- training recipe
    status VARCHAR(50),  -- 'pending' | 'running' | 'completed' | 'failed'
    metrics JSONB,
    created_at TIMESTAMP
);
```

### Evaluations表
```sql
CREATE TABLE evaluations (
    id UUID PRIMARY KEY,
    experiment_id UUID REFERENCES experiments(id),
    track VARCHAR(50),  -- 'spoken' | 'written'
    metrics JSONB,  -- BLEU, ROUGE-L, RIBES, GPT scores
    error_analysis JSONB,
    created_at TIMESTAMP
);
```

## API接口设计 (RESTful)

### Models
```
GET    /api/v1/models                    # 获取模型列表
GET    /api/v1/models/:id                # 获取模型详情
POST   /api/v1/models/:id/probe          # 运行基线行为探测
GET    /api/v1/models/:id/evaluations    # 获取模型评测历史
```

### Datasets
```
GET    /api/v1/datasets                  # 获取数据集列表
POST   /api/v1/datasets                  # 上传数据集
GET    /api/v1/datasets/:id              # 获取数据集详情
POST   /api/v1/datasets/generate         # 生成数据集
GET    /api/v1/datasets/:id/quality-gate # 获取质量门禁结果
POST   /api/v1/datasets/:id/review       # 提交人工审阅
```

### Experiments
```
GET    /api/v1/experiments               # 获取实验列表
POST   /api/v1/experiments               # 创建实验
GET    /api/v1/experiments/:id           # 获取实验详情
POST   /api/v1/experiments/:id/start     # 启动实验
POST   /api/v1/experiments/:id/stop      # 停止实验
GET    /api/v1/experiments/:id/logs      # 获取日志
WS     /api/v1/experiments/:id/stream    # 实时进度流
```

### Evaluations
```
GET    /api/v1/evaluations               # 获取评测列表
GET    /api/v1/evaluations/:id           # 获取评测详情
POST   /api/v1/evaluations/compare       # 对比评测
```

## WebSocket事件设计

### 客户端订阅
```javascript
// 订阅实验进度
socket.emit('subscribe', { type: 'experiment', id: 'exp-123' });

// 订阅全局通知
socket.emit('subscribe', { type: 'notifications' });
```

### 服务端推送
```javascript
// 训练进度更新
{
  type: 'experiment_progress',
  experimentId: 'exp-123',
  data: {
    epoch: 5,
    loss: 0.234,
    gpuUtil: 85,
    eta: '00:15:30'
  }
}

// 任务状态变更
{
  type: 'experiment_status',
  experimentId: 'exp-123',
  status: 'completed',
  metrics: { ... }
}

// 质量门禁结果
{
  type: 'quality_gate',
  datasetId: 'ds-456',
  result: 'failed',
  details: { ... }
}

// 系统通知
{
  type: 'notification',
  level: 'warning',
  message: '成本已超过预算的80%'
}
```

## 部署架构

### 开发环境
```
Frontend: npm run dev (Vite Dev Server)
Backend:  uvicorn app.main:app --reload
Celery:   celery -A app.tasks worker --loglevel=info
Redis:    docker run -p 6379:6379 redis
PG:       docker run -p 5432:5432 postgres
```

### 生产环境
```
Frontend: Nginx (静态资源)
Backend:  Uvicorn + Gunicorn (多进程)
Celery:   多个Worker进程 (按任务类型分组)
Redis:    持久化 + 哨兵模式
PG:       主从复制 + 连接池
```

## 安全考虑

1. **API鉴权**: JWT Token认证
2. **CORS配置**: 限制允许的域名
3. **SQL注入防护**: 使用ORM参数化查询
4. **XSS防护**: React自动转义 + CSP策略
5. **敏感数据**: Azure GPT Key等存环境变量
6. **文件上传**: 限制大小、类型、扫描恶意文件

## 性能优化

1. **前端**:
   - 路由懒加载
   - ECharts按需引入
   - 大列表虚拟滚动(Ant Design Table内置)
   - WebSocket自动重连 + 心跳

2. **后端**:
   - PostgreSQL索引优化
   - Redis缓存热点数据
   - Celery任务优先级队列
   - WebSocket连接池

## 监控与日志

1. **前端**: Sentry错误追踪
2. **后端**:
   - FastAPI日志 (structlog)
   - Celery任务监控 (Flower)
   - PostgreSQL慢查询日志
3. **基础设施**: Prometheus + Grafana

---

## 下一步行动

1. ✅ 确定技术栈
2. 🚧 初始化前端项目
3. 🚧 创建基础组件和Layout
4. 🚧 实现核心页面(Dashboard → Models → Datasets → Experiments)
5. ⏳ 后端API开发
6. ⏳ 集成测试
7. ⏳ 部署上线
