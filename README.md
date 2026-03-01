# Nova LaunchKit

现代化 SaaS 启动套件（2026 版），用于快速搭建可登录、可订阅、可计费、可扩展 AI 能力的 Web 应用。

- 仓库：`huangkefeng-ai/nova-launchkit-20260302`
- 技术栈：Next.js + Supabase + Creem
- 当前 AI 模块：**AI Offer Copy Studio（营销文案生成）**

---

## 1. 当前状态（实时）

- 项目状态：开发中（Foundation 已完成，Auth/Billing/DB 继续推进）
- 构建状态：`npm run build` 可通过
- 开发规范：`docs/NOVA_LAUNCHKIT_MASTER_SPEC.md`
- 开发日志：`docs/DEVELOPMENT_LOG.md`

---

## 2. 核心目标

Nova LaunchKit 目标是把 SaaS MVP 的常见基础设施一次搭好：

1. 身份认证（邮箱登录 + OAuth 可扩展）
2. 订阅支付与积分系统（Creem + webhook）
3. 用户工作台（计划、额度、用量）
4. AI 业务模块（Offer Copy 生成）
5. 可上线工程质量（统一错误结构、测试、CI）

---

## 3. 技术栈（已锁定）

- Node.js: `24.14.0`
- npm: `11.9.0`
- Next.js: `16.1.6`
- React: `19.2.4`
- TypeScript: `5.9.3`
- `@supabase/supabase-js`: `2.98.0`
- `@supabase/ssr`: `0.8.0`
- TailwindCSS: `4.2.1`

---

## 4. 项目结构（当前）

```text
nova-launchkit/
├── docs/
│   ├── NOVA_LAUNCHKIT_MASTER_SPEC.md
│   └── DEVELOPMENT_LOG.md
├── public/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   └── ...
│   ├── features/
│   │   └── offer-copy/
│   │       ├── schema.ts
│   │       └── prompt.ts
│   ├── lib/
│   │   ├── env.ts
│   │   ├── core/request-id.ts
│   │   └── http/api-error.ts
│   └── utils/
│       └── supabase/
│           ├── client.ts
│           ├── server.ts
│           └── service-role.ts
├── .env.example
├── package.json
└── README.md
```

---

## 5. 快速开始

### 5.1 前置要求

- Node.js >= 24
- npm >= 11
- Supabase 账号
- Creem 账号

### 5.2 安装

```bash
npm i
```

### 5.3 环境变量

```bash
cp .env.example .env.local
```

在 `.env.local` 中填写：

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

### 5.4 启动开发

```bash
npm run dev
```

访问：`http://localhost:3000`

---

## 6. 质量门禁

### 6.1 本地构建检查

```bash
npm run build
```

### 6.2 后续测试目标（进行中）

- 鉴权保护回归
- 失败扣费回滚
- 历史分页契约
- webhook 幂等校验

---

## 7. API 设计约定

所有关键 API 失败时统一结构：

```json
{
  "errorCode": "STRING_ENUM",
  "message": "human-readable",
  "requestId": "uuid"
}
```

要求：
- 不泄露密钥
- 记录 requestId 便于追踪
- 写操作必须先校验

---

## 8. 模块规划（前后端+数据库）

### 8.1 前端

- Landing（Hero / Pricing / FAQ / CTA）
- Auth 页面
- Dashboard 页面
- Billing 页面
- Offer Copy Studio 页面
- History 页面

### 8.2 后端

- Auth session helpers
- Credits APIs
- Offer Copy generation API
- History APIs
- Creem webhook API
- Subscription sync API

### 8.3 数据库（Supabase）

计划表：
- `profiles`
- `subscriptions`
- `credit_accounts`
- `credit_transactions`
- `offer_copy_generations`
- `webhook_events`

并配套 RLS 策略。

---

## 9. 开发里程碑

### Phase 1（已完成）
- Foundation 基础层
- env + supabase client/server 分层
- requestId + api-error helper

### Phase 2（进行中）
- Auth 接入
- dashboard 保护路由

### Phase 3（待开发）
- Billing + Credits + Webhook

### Phase 4（待开发）
- Offer Copy Studio 全链路

### Phase 5（待开发）
- 回归测试 + CI + 部署文档

---

## 10. 交付完成标准（DoD）

满足以下全部条件才算“开发完成”：

1. 前端模块全部可用
2. 后端接口全部可用
3. 数据库结构 + RLS 完成
4. `npm run build` 通过
5. 关键回归测试通过
6. 文档完整（规范 + 日志 + 部署）
7. 所有改动已推送 `main`

---

## 11. 说明

本项目会持续迭代，优先保证：
- 正确性（扣费/鉴权/幂等）
- 可维护性（结构清晰、错误规范统一）
- 可上线性（测试与构建门禁）
