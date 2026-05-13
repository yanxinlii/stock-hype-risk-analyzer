import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const historicalData = [
  { date: 'Apr 01', price: 168.1 },
  { date: 'Apr 05', price: 171.9 },
  { date: 'Apr 10', price: 166.2 },
  { date: 'Apr 14', price: 173.6 },
  { date: 'Apr 19', price: 179.3 },
  { date: 'Apr 23', price: 176.4 },
  { date: 'Apr 28', price: 183.8 },
  { date: 'May 03', price: 186.5 },
]

const sentimentData = [
  { source: 'X (Twitter)', score: 78, trend: '+11%' },
  { source: 'Reddit', score: 84, trend: '+18%' },
  { source: 'StockTwits', score: 72, trend: '+6%' },
]

const kpis = [
  { label: '24h Price Change', value: '+3.24%', tone: 'text-emerald-300' },
  { label: '30d Volatility', value: '27.9%', tone: 'text-amber-300' },
  { label: 'Hype Score', value: '81 / 100', tone: 'text-cyan-300' },
  { label: 'Risk Level', value: 'Elevated', tone: 'text-rose-300' },
]

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 md:px-8">
        <header className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-6 shadow-panel backdrop-blur">
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-cyan-300">Portfolio Project</p>
          <h1 className="text-2xl font-semibold md:text-3xl">Stock Hype Risk Analyzer</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-400">
            Analyze market momentum against social hype to surface overextended stocks and highlight potential downside risk.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <label htmlFor="ticker" className="text-sm text-slate-300">
              Stock Ticker
            </label>
            <input
              id="ticker"
              defaultValue="AAPL"
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2 text-sm outline-none ring-cyan-400 transition focus:ring-2 sm:w-72"
              placeholder="Search symbol (e.g. TSLA)"
            />
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => (
            <article
              key={kpi.label}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-panel transition hover:border-cyan-800"
            >
              <p className="text-xs uppercase tracking-[0.15em] text-slate-400">{kpi.label}</p>
              <p className={`mt-3 text-2xl font-semibold ${kpi.tone}`}>{kpi.value}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-panel">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Historical Price Trend</h2>
              <p className="text-xs text-slate-400">Mock data · Last 30 days</p>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} domain={['dataMin - 3', 'dataMax + 3']} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      borderRadius: '0.75rem',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#22d3ee"
                    strokeWidth={3}
                    dot={{ r: 3, stroke: '#22d3ee', fill: '#0f172a' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-panel">
            <h2 className="text-lg font-semibold">Social Sentiment Pulse</h2>
            <p className="mt-1 text-sm text-slate-400">Signal from social media channels (mock scoring).</p>
            <div className="mt-4 space-y-3">
              {sentimentData.map((item) => (
                <div key={item.source} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{item.source}</p>
                    <p className="text-sm text-emerald-300">{item.trend}</p>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-slate-800">
                    <div className="h-2 rounded-full bg-cyan-400" style={{ width: `${item.score}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-slate-400">Sentiment score: {item.score}/100</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="rounded-2xl border border-rose-900/40 bg-gradient-to-r from-rose-950/40 to-slate-900/80 p-5 shadow-panel">
          <h2 className="text-lg font-semibold text-rose-200">Risk Explanation</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Elevated risk is flagged because social sentiment is rising faster than price fundamentals, while volatility remains above the sector baseline.
            In a full production version, this panel would combine earnings revisions, options implied volatility, and NLP-driven anomaly detection to justify the risk score.
          </p>
        </section>
      </main>
    </div>
  )
}
