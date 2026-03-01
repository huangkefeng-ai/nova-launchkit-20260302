import { Rocket, ShieldCheck, CreditCard, Wand2 } from 'lucide-react'

export default function Home() {
  const versions = {
    node: '24.14.0',
    npm: '11.9.0',
    next: '16.1.6',
    react: '19.2.4',
    ts: '5.9.3',
    supabase: '2.98.0',
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <h1 className="text-4xl font-bold">Nova LaunchKit</h1>
        <p className="text-zinc-300">新一代 SaaS 启动套件（Next.js + Supabase + Creem）。内置「AI Offer Copy Studio（营销文案生成）」模块。</p>

        <section className="grid md:grid-cols-2 gap-4">
          <Card icon={<Rocket size={18} />} title="现代架构" desc="Next.js App Router + React 19 + TypeScript 5.9" />
          <Card icon={<ShieldCheck size={18} />} title="鉴权基础" desc="Supabase SSR/Browser 客户端分层" />
          <Card icon={<CreditCard size={18} />} title="支付预留" desc="Creem webhook 与订阅积分流程预留" />
          <Card icon={<Wand2 size={18} />} title="AI模块" desc="Offer Copy 文案生成（可替换为你的垂直场景）" />
        </section>

        <section className="rounded-xl border border-zinc-800 p-4">
          <h2 className="font-semibold mb-3">当前使用最新版本（已检查）</h2>
          <ul className="grid md:grid-cols-2 gap-2 text-sm text-zinc-300">
            {Object.entries(versions).map(([k,v]) => <li key={k}><b>{k}</b>: {v}</li>)}
          </ul>
        </section>
      </div>
    </main>
  )
}

function Card({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 p-4 bg-zinc-900/40">
      <div className="flex items-center gap-2 font-semibold">{icon}{title}</div>
      <p className="text-sm text-zinc-300 mt-2">{desc}</p>
    </div>
  )
}
