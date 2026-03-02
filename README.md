# Nova LaunchKit

现代化 SaaS 启动套件（2026 版），用于快速搭建可登录、可计费、可扩展 AI 能力的 Web 应用。

- 仓库: `huangkefeng-ai/nova-launchkit-20260302`
- 技术栈: Next.js + Supabase + Creem
- 当前 AI 模块: AI Offer Copy Studio（营销文案生成）

## 当前状态

- 项目阶段: 开发中（已完成 Phase-4 纵切片）
- 构建状态: `npm run build` 可通过
- 主规格文档: `docs/NOVA_LAUNCHKIT_MASTER_SPEC.md`
- 开发日志: `docs/DEVELOPMENT_LOG.md`

## 核心能力

1. Supabase 身份认证（邮箱密码）
2. Credits 账户与扣减链路（含幂等 requestId）
3. AI Offer Copy 生成接口
4. 生成历史查询与删除基线
5. 统一错误契约与请求追踪

## 快速开始

### 1) 安装依赖

```bash
npm i
```

### 2) 配置环境变量

```bash
cp .env.example .env.local
```

`.env.local` 需要至少包含：

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

CREEM_WEBHOOK_SECRET=
CREEM_API_KEY=
CREEM_API_URL=https://test-api.creem.io/v1

NEXT_PUBLIC_SITE_URL=http://localhost:3000
CREEM_SUCCESS_URL=http://localhost:3000/dashboard

OPENAI_API_KEY=
OPENAI_BASE_URL=https://openrouter.ai/api/v1
```

### 3) 启动开发服务

```bash
npm run dev
```

访问 `http://localhost:3000`

## API 错误契约

所有关键 API 失败时统一返回：

```json
{
  "errorCode": "STRING_ENUM",
  "message": "human-readable",
  "requestId": "uuid"
}
```

## Offer Copy Studio（Phase-4）

### Dashboard 模块

- 路径: `/dashboard`
- 输入项: `product`、`audience`、`valueProp`、`tone(专业/简洁/活泼/高级)`
- 输出项: `headline`、`subheadline`、`bullets`、`cta`
- 展示请求追踪: `requestId`

### Credits 链路

1. 生成前调用 `POST /api/credits`（`amount=1`, `reason=offer_copy_generate`）
2. 若生成失败，调用 rollback helper 进行补偿
3. 所有失败路径保持统一错误结构

### History 基线

- 读取: `GET /api/history?limit=12&offset=0`
- 删除: `DELETE /api/history/:id`
- 展示字段: `created_at` + `headline`

## 里程碑进度

- [x] Phase 1: Foundation（requestId / api-error / env / supabase client split）
- [x] Phase 2: Auth + Protected Dashboard
- [x] Phase 3: Credits consume API + DB function
- [x] Phase 4: Offer Copy Studio 纵切片（Dashboard + Credits consume/rollback + History CRUD baseline）
- [ ] Phase 5: Webhook 幂等与订阅状态机完善
- [ ] Phase 6: 回归测试矩阵 + CI + 部署文档

## 质量门禁

```bash
npm run build
```
