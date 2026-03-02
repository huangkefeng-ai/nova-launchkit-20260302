import Link from 'next/link'
import { ArrowRight, BadgeCheck, Bot, Gauge, Layers3, ShieldCheck, Sparkles, type LucideIcon } from 'lucide-react'

const featureItems: Array<{ icon: LucideIcon; title: string; desc: string }> = [
  {
    icon: Bot,
    title: 'AI Offer Copy Studio',
    desc: '输入产品、受众与核心价值，快速得到可上线的中文营销文案结构。',
  },
  {
    icon: ShieldCheck,
    title: '认证与权限就绪',
    desc: 'Supabase SSR 会话与受保护路由已集成，登录后直接进入业务面板。',
  },
  {
    icon: Gauge,
    title: '增长流程可量化',
    desc: '每次生成自动扣减积分并保留历史，便于追踪效果与团队复盘。',
  },
  {
    icon: Layers3,
    title: '可扩展业务骨架',
    desc: '基于 Next.js App Router，可平滑扩展支付、订阅、Webhook 与多模块能力。',
  },
]

const pricingPlans = [
  {
    name: '启动版',
    price: '¥0',
    unit: '/月',
    summary: '适合验证 MVP 与首轮种子用户。',
    cta: '免费注册',
    href: '/sign-up',
    featured: false,
    features: ['每月 60 次文案生成', '基础历史记录', '社区支持'],
  },
  {
    name: '增长版',
    price: '¥199',
    unit: '/月',
    summary: '面向稳定增长期产品团队的主力方案。',
    cta: '升级增长版',
    href: '/sign-up',
    featured: true,
    features: ['每月 1,000 次文案生成', '优先模型队列', '增长指标看板'],
  },
  {
    name: '规模版',
    price: '¥699',
    unit: '/月',
    summary: '支持多角色协作和更高并发需求。',
    cta: '联系团队',
    href: '/sign-up',
    featured: false,
    features: ['不限成员席位', '私有化策略支持', '专属客户成功经理'],
  },
]

const faqItems = [
  {
    question: 'Nova LaunchKit 适合谁？',
    answer: '适合要在短周期内上线 SaaS 或 Web3 产品的创业团队、独立开发者和增长负责人。',
  },
  {
    question: 'AI Offer Copy Studio 的结果可以直接使用吗？',
    answer: '可以。输出包含主标题、副标题、3 条卖点与 CTA，可直接用于落地页、广告和邮件草稿。',
  },
  {
    question: '如何开始体验？',
    answer: '点击“免费注册”创建账号，登录后进入 Dashboard 即可开始生成第一版 Offer Copy。',
  },
  {
    question: '后续能否扩展到自己的业务模块？',
    answer: '可以。LaunchKit 保留了标准化 API 和模块边界，方便接入你的支付、CRM、埋点与自动化流程。',
  },
]

export default function Home() {
  const currentYear = new Date().getFullYear()

  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col px-6 pb-14 pt-8 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/60 px-4 py-3 backdrop-blur-sm sm:px-6">
          <Link className="text-base font-semibold tracking-tight text-zinc-100 sm:text-lg" href="/">
            Nova LaunchKit
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              className="rounded-lg border border-zinc-700 px-3 py-2 text-sm font-medium text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800/70"
              href="/sign-in"
            >
              登录
            </Link>
            <Link
              className="rounded-lg bg-emerald-400 px-3 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
              href="/sign-up"
            >
              免费注册
            </Link>
          </nav>
        </header>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-400/50 bg-cyan-400/10 px-3 py-1 text-xs font-medium tracking-wide text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              生产级启动套件
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              用一套工程化模板，快速上线你的增长型产品
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
              Nova LaunchKit 把认证、积分、AI 文案与历史追踪整合到同一工作流里，帮你更快验证市场并持续迭代转化。
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
                href="/sign-up"
              >
                立即注册并开始
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-5 py-3 text-sm font-medium text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800/70"
                href="/sign-in"
              >
                已有账号，去登录
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-zinc-300">
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck className="h-4 w-4 text-emerald-300" />
                登录后直达 Dashboard
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck className="h-4 w-4 text-emerald-300" />
                默认内置中文文案流程
              </span>
            </div>
          </div>

          <aside className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl shadow-zinc-950/40">
            <p className="text-sm font-medium text-zinc-300">本周上线节奏建议</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="rounded-xl border border-zinc-800/90 bg-zinc-950/70 p-3 text-zinc-200">
                D1-D2：配置认证与基础数据模型
              </li>
              <li className="rounded-xl border border-zinc-800/90 bg-zinc-950/70 p-3 text-zinc-200">
                D3-D4：打磨 Offer Copy 表单与生成策略
              </li>
              <li className="rounded-xl border border-zinc-800/90 bg-zinc-950/70 p-3 text-zinc-200">
                D5-D7：接入付费与数据回放，进入投放测试
              </li>
            </ul>
            <div className="mt-5 rounded-xl border border-cyan-400/30 bg-cyan-400/10 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-cyan-200">核心承诺</p>
              <p className="mt-2 text-sm text-zinc-100">把“写文案”从一次性创作，升级为可复用、可追踪、可迭代的产品能力。</p>
            </div>
          </aside>
        </section>

        <section className="mt-16">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">核心能力</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">为增长团队设计的高效模块</h2>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {featureItems.map((item) => (
              <FeatureCard key={item.title} {...item} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">定价方案</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">按增长阶段选择计划</h2>
            </div>
            <p className="text-sm text-zinc-300">所有计划均可随时切换，默认支持团队协作。</p>
          </div>
          <div className="mt-7 grid gap-4 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.name} {...plan} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">常见问题</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">FAQ</h2>
          <div className="mt-6 space-y-3">
            {faqItems.map((item) => (
              <details className="group rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5" key={item.question}>
                <summary className="cursor-pointer list-none text-base font-medium text-zinc-100">{item.question}</summary>
                <p className="mt-3 text-sm leading-6 text-zinc-300">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <footer className="mt-16 rounded-3xl border border-zinc-800 bg-zinc-900/65 px-6 py-8 sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xl font-semibold tracking-tight text-zinc-100">Nova LaunchKit</p>
              <p className="mt-2 text-sm text-zinc-300">把启动速度和增长质量都拉满的中文 SaaS Launch 基建。</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800/70"
                href="/sign-in"
              >
                登录
              </Link>
              <Link
                className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
                href="/sign-up"
              >
                现在注册
              </Link>
            </div>
          </div>
          <p className="mt-6 border-t border-zinc-800 pt-4 text-xs text-zinc-400">© {currentYear} Nova LaunchKit. All rights reserved.</p>
        </footer>
      </div>
    </main>
  )
}

function FeatureCard({ icon: Icon, title, desc }: { icon: LucideIcon; title: string; desc: string }) {
  return (
    <article className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950">
        <Icon className="h-5 w-5 text-emerald-300" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-zinc-100">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-300">{desc}</p>
    </article>
  )
}

function PricingCard({
  name,
  price,
  unit,
  summary,
  cta,
  href,
  featured,
  features,
}: {
  name: string
  price: string
  unit: string
  summary: string
  cta: string
  href: string
  featured: boolean
  features: string[]
}) {
  return (
    <article
      className={`rounded-2xl border p-6 ${
        featured
          ? 'border-emerald-400/60 bg-emerald-400/10 shadow-lg shadow-emerald-500/10'
          : 'border-zinc-800 bg-zinc-900/60'
      }`}
    >
      <p className="text-sm font-medium text-zinc-200">{name}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-100">
        {price}
        <span className="ml-1 text-base font-medium text-zinc-400">{unit}</span>
      </p>
      <p className="mt-3 min-h-10 text-sm leading-6 text-zinc-300">{summary}</p>
      <ul className="mt-4 space-y-2 text-sm text-zinc-200">
        {features.map((item) => (
          <li className="flex items-start gap-2" key={item}>
            <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
            {item}
          </li>
        ))}
      </ul>
      <Link
        className={`mt-6 inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
          featured
            ? 'bg-emerald-400 text-emerald-950 hover:bg-emerald-300'
            : 'border border-zinc-700 text-zinc-100 hover:border-zinc-500 hover:bg-zinc-800/70'
        }`}
        href={href}
      >
        {cta}
      </Link>
    </article>
  )
}
