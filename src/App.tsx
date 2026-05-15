import { useMemo, useState } from 'react'
import { availableTickers, marketOverview, quickTickers, stockData, type PricePoint, type RiskLevel, type StockProfile } from './mockData'

const navItems = [
  { label: 'Overview', id: 'overview' },
  { label: 'Market Pulse', id: 'market-pulse' },
  { label: 'Watchlist', id: 'watchlist' },
  { label: 'Sentiment', id: 'sentiment' },
  { label: 'Risk Drivers', id: 'risk-drivers' },
  { label: 'Signal Breakdown', id: 'signal-breakdown' },
]

function money(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: value > 1000 ? 0 : 2 }).format(value)
}

function pct(value: number) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
}

function riskColor(level: RiskLevel) {
  const colors: Record<RiskLevel, string> = {
    Low: 'border-emerald-300/30 bg-emerald-300/10 text-emerald-200',
    Moderate: 'border-cyan-300/30 bg-cyan-300/10 text-cyan-200',
    Elevated: 'border-amber-300/30 bg-amber-300/10 text-amber-200',
    High: 'border-orange-300/30 bg-orange-300/10 text-orange-200',
    Extreme: 'border-rose-300/30 bg-rose-300/10 text-rose-200',
  }
  return colors[level]
}

function chartPath(data: PricePoint[]) {
  const width = 720
  const height = 300
  const pad = 28
  const values = data.map((point) => point.price)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const spread = max - min || 1
  const points = data.map((point, index) => {
    const x = pad + (index / (data.length - 1 || 1)) * (width - pad * 2)
    const y = height - pad - ((point.price - min) / spread) * (height - pad * 2)
    return { ...point, x, y }
  })
  const line = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(' ')
  const area = `${line} L ${width - pad},${height - pad} L ${pad},${height - pad} Z`
  return { area, line, points }
}

function PriceChart({ stock }: { stock: StockProfile }) {
  const { area, line, points } = chartPath(stock.historicalPriceData)
  const latest = stock.historicalPriceData[stock.historicalPriceData.length - 1]

  return (
    <svg viewBox='0 0 720 300' className='h-full w-full' role='img' aria-label={`${stock.symbol} 30 day price path`}>
      <defs>
        <linearGradient id='price-fill' x1='0' x2='0' y1='0' y2='1'>
          <stop offset='0%' stopColor='#22d3ee' stopOpacity='0.34' />
          <stop offset='100%' stopColor='#22d3ee' stopOpacity='0' />
        </linearGradient>
      </defs>
      {[54, 103, 152, 201, 250].map((y) => <line key={y} x1='28' x2='692' y1={y} y2={y} stroke='rgba(255,255,255,0.08)' />)}
      <path d={area} fill='url(#price-fill)' />
      <path d={line} fill='none' stroke='#a3e635' strokeLinecap='round' strokeLinejoin='round' strokeWidth='4' />
      {points.map((point) => <circle key={point.date} cx={point.x} cy={point.y} r='4' fill='#f8fafc' stroke='#07100e' strokeWidth='2' />)}
      <text x='28' y='28' fill='#d4d4d8' fontSize='13'>{money(stock.historicalPriceData[0].price)}</text>
      <text x='595' y='28' fill='#86efac' fontSize='13'>{money(latest.price)}</text>
    </svg>
  )
}

function RiskGauge({ stock }: { stock: StockProfile }) {
  const score = Math.max(0, Math.min(100, stock.compositeRiskScore))
  return (
    <div>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <p className='text-xs uppercase tracking-[0.18em] text-zinc-500'>Composite Risk</p>
          <p className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs ${riskColor(stock.riskLevel)}`}>{stock.riskLevel} Risk</p>
        </div>
        <div className='text-right'>
          <p className='text-2xl font-semibold tracking-tight text-white'>{score} / 100</p>
          <p className='mt-1 text-xs text-zinc-500'>demo methodology</p>
        </div>
      </div>
      <div className='mt-5 h-3 rounded-full bg-gradient-to-r from-emerald-400 via-yellow-300 via-orange-400 to-rose-500'>
        <div className='relative h-3'>
          <span className='absolute top-1/2 h-5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white ring-4 ring-black/45' style={{ left: `${score}%` }} />
        </div>
      </div>
      <div className='mt-3 grid grid-cols-4 text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500'>
        <span>Low</span><span className='text-center'>Moderate</span><span className='text-center'>Elevated</span><span className='text-right'>Extreme</span>
      </div>
    </div>
  )
}

function StockSearch({ selected, onSelect }: { selected: StockProfile; onSelect: (symbol: string) => void }) {
  const [query, setQuery] = useState('')
  const matches = useMemo(() => {
    const text = query.trim().toLowerCase()
    if (!text) return availableTickers
    return availableTickers.filter((symbol) => symbol.toLowerCase().includes(text) || stockData[symbol].companyName.toLowerCase().includes(text))
  }, [query])

  function choose(symbol: string) {
    onSelect(symbol)
    setQuery('')
  }

  return (
    <section id='compare' className='glass-panel rounded-xl p-5 sm:p-6'>
      <p className='text-xs uppercase tracking-[0.18em] text-cyan-200'>Compare Ticker</p>
      <h2 className='mt-2 text-xl font-semibold text-white'>Search or quick-select a market name</h2>
      <div className='mt-5 grid gap-4 lg:grid-cols-[1fr_430px] lg:items-start'>
        <div>
          <label htmlFor='ticker-search' className='mb-2 block text-xs uppercase tracking-[0.16em] text-zinc-500'>Symbol or company</label>
          <input
            id='ticker-search'
            value={query}
            onChange={(event) => setQuery(event.target.value.toUpperCase())}
            onKeyDown={(event) => { if (event.key === 'Enter' && matches[0]) choose(matches[0]) }}
            placeholder={`Try ${selected.symbol}, Microsoft, Coinbase, or Palantir`}
            className='w-full rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-medium text-white outline-none transition placeholder:text-zinc-500 focus:border-cyan-300/70 focus:bg-white/[0.09]'
          />
          {query && (
            <div className='mt-3 overflow-hidden rounded-lg border border-white/10 bg-[#101715]/95 shadow-2xl backdrop-blur-xl'>
              {matches.map((symbol) => (
                <button key={symbol} type='button' onClick={() => choose(symbol)} className='flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-white/[0.08]'>
                  <span className='min-w-0 truncate'><span className='font-semibold text-white'>{symbol}</span><span className='ml-3 text-sm text-zinc-400'>{stockData[symbol].companyName}</span></span>
                  <span className={`shrink-0 rounded-full border px-2 py-1 text-xs ${riskColor(stockData[symbol].riskLevel)}`}>{stockData[symbol].riskLevel}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className='grid grid-cols-3 gap-2 sm:grid-cols-6'>
          {quickTickers.map((symbol) => (
            <button key={symbol} type='button' onClick={() => choose(symbol)} className={`rounded-lg border px-3 py-3 text-sm font-semibold transition ${selected.symbol === symbol ? 'border-cyan-300/70 bg-cyan-300/[0.15] text-cyan-100' : 'border-white/10 bg-white/[0.05] text-zinc-300 hover:border-white/25 hover:bg-white/[0.08]'}`}>
              {symbol}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function KpiCard({ label, value, caption, tone }: { label: string; value: string; caption: string; tone: string }) {
  return (
    <article className='kpi-card glass-panel p-4'>
      <p className='text-xs uppercase tracking-[0.15em] text-zinc-500'>{label}</p>
      <p className={`mt-3 bg-gradient-to-r ${tone} bg-clip-text text-2xl font-semibold text-transparent`}>{value}</p>
      <p className='mt-2 min-h-10 text-sm leading-5 text-zinc-400'>{caption}</p>
    </article>
  )
}

export default function App() {
  const [selectedSymbol, setSelectedSymbol] = useState('NVDA')
  const [activeSection, setActiveSection] = useState('overview')
  const selected = stockData[selectedSymbol] ?? stockData.NVDA
  const kpis = [
    { label: 'Current Price', value: money(selected.currentPrice), caption: `${selected.volume} shares traded`, tone: 'from-zinc-50 to-cyan-200' },
    { label: '1D Price Return', value: pct(selected.dailyChangePercent), caption: 'Demo regular-session move', tone: selected.dailyChangePercent >= 0 ? 'from-emerald-200 to-lime-300' : 'from-rose-200 to-orange-300' },
    { label: '30D Realized Volatility', value: `${selected.volatility30d.toFixed(1)}%`, caption: `Sector benchmark ${selected.sectorAverageVolatility.toFixed(1)}%`, tone: 'from-amber-200 to-orange-300' },
    { label: 'Hype Score', value: `${selected.hypeScore}/100`, caption: 'Mention growth, news velocity, options proxy', tone: 'from-cyan-200 to-sky-300' },
    { label: 'Fundamentals Score', value: `${selected.fundamentalsScore}/100`, caption: 'Growth, revisions, margins, valuation', tone: 'from-lime-200 to-emerald-300' },
    { label: 'Composite Risk Level', value: selected.riskLevel, caption: `Composite score ${selected.compositeRiskScore}/100`, tone: 'from-rose-200 to-amber-200' },
  ]

  return (
    <div className='min-h-screen bg-[radial-gradient(circle_at_15%_10%,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_86%_4%,rgba(163,230,53,0.12),transparent_24%),linear-gradient(135deg,#07100e_0%,#0a0d12_48%,#10100b_100%)] text-zinc-50'>
      <div className='mx-auto grid min-h-screen w-full max-w-[1800px] lg:grid-cols-[240px_minmax(0,1fr)]'>
        <aside className='border-b border-white/10 bg-white/[0.045] px-4 py-4 backdrop-blur-2xl lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-b-0 lg:border-r lg:px-5 lg:py-6'>
          <div className='flex flex-wrap items-center justify-between gap-3 lg:block'>
            <div><p className='text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200'>Volterra</p><h1 className='mt-2 text-lg font-semibold tracking-tight'>Hype Risk Terminal</h1></div>
            <span className='rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-200 lg:mt-6 lg:inline-flex'>Demo model</span>
          </div>
          <nav className='mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:mt-10 lg:block lg:space-y-2'>
            {navItems.map((item) => (
              <a key={item.id} href={`#${item.id}`} aria-current={activeSection === item.id ? 'page' : undefined} onClick={() => setActiveSection(item.id)} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${activeSection === item.id ? 'bg-white/[0.12] text-white' : 'text-zinc-400 hover:bg-white/[0.08] hover:text-white'}`}>
                <span className='h-1.5 w-1.5 rounded-full bg-cyan-300' />{item.label}
              </a>
            ))}
          </nav>
        </aside>

        <main className='min-w-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-8'>
          <div className='mx-auto flex w-full max-w-7xl flex-col gap-6'>
            <header id='overview' className='glass-panel rounded-xl p-5 sm:p-6'>
              <div className='grid gap-5 xl:grid-cols-[1fr_360px] xl:items-start'>
                <div>
                  <div className='flex flex-wrap items-center gap-3'><span className={`rounded-full border px-3 py-1 text-xs ${riskColor(selected.riskLevel)}`}>{selected.riskLevel} risk</span><span className='text-sm text-zinc-500'>Demo snapshot {selected.lastUpdated}</span></div>
                  <h2 className='mt-4 text-3xl font-semibold tracking-tight md:text-5xl'>Market intelligence for {selected.symbol}</h2>
                  <p className='mt-3 max-w-3xl text-base leading-7 text-zinc-300'>Compare social acceleration, sentiment, benchmark volatility, and fundamentals to understand when crowd behavior is creating excess factor risk.</p>
                </div>
                <div className='rounded-lg border border-white/10 bg-black/20 p-4'><RiskGauge stock={selected} /></div>
              </div>
            </header>

            <section id='market-pulse' className='glass-panel rounded-xl px-4 py-4'>
              <div className='mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between'><div><p className='text-xs uppercase tracking-[0.18em] text-zinc-500'>Market Pulse</p><h2 className='mt-1 text-lg font-semibold'>Cross-asset overview</h2></div><p className='text-sm text-zinc-500'>Macro tape snapshot</p></div>
              <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-6'>{marketOverview.map((tick) => <div key={tick.label} className='rounded-md border border-white/[0.08] bg-black/[0.15] px-3 py-2'><p className='text-xs uppercase tracking-[0.12em] text-zinc-500'>{tick.label}</p><div className='mt-1 flex items-baseline justify-between gap-2'><span className='text-sm font-semibold text-zinc-100'>{tick.value}</span><span className={tick.change.startsWith('-') ? 'text-xs text-rose-300' : 'text-xs text-emerald-300'}>{tick.change}</span></div></div>)}</div>
            </section>

            <StockSearch selected={selected} onSelect={setSelectedSymbol} />

            <section id='watchlist' className='glass-panel rounded-xl p-5 sm:p-6'>
              <p className='text-xs uppercase tracking-[0.18em] text-zinc-500'>Watchlist</p><h2 className='mt-2 text-xl font-semibold'>Tracked hype-risk names</h2>
              <div className='mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3'>{quickTickers.map((symbol) => <button key={symbol} type='button' onClick={() => setSelectedSymbol(symbol)} className={`rounded-xl border p-4 text-left transition ${selected.symbol === symbol ? 'border-cyan-300/60 bg-cyan-300/[0.12]' : 'border-white/10 bg-black/[0.16] hover:border-white/25 hover:bg-white/[0.06]'}`}><div className='flex items-start justify-between gap-3'><div><p className='text-lg font-semibold text-white'>{symbol}</p><p className='mt-1 text-sm text-zinc-500'>{stockData[symbol].companyName}</p></div><span className={`rounded-full border px-2.5 py-1 text-xs ${riskColor(stockData[symbol].riskLevel)}`}>{stockData[symbol].riskLevel}</span></div><p className='mt-4 text-sm text-zinc-400'>{money(stockData[symbol].currentPrice)} / {pct(stockData[symbol].dailyChangePercent)}</p></button>)}</div>
            </section>

            <section className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>{kpis.map((kpi) => <KpiCard key={kpi.label} {...kpi} />)}</section>

            <section className='grid gap-5 xl:grid-cols-[1.35fr_0.65fr]'>
              <article className='glass-panel p-5 sm:p-6'><p className='text-xs uppercase tracking-[0.18em] text-zinc-500'>Historical Price Trend</p><h2 className='mt-2 text-xl font-semibold'>{selected.symbol} 30 day market path</h2><div className='mt-5 h-[280px] sm:h-[340px]'><PriceChart stock={selected} /></div></article>
              <article id='sentiment' className='glass-panel p-5 sm:p-6'><p className='text-xs uppercase tracking-[0.18em] text-zinc-500'>Sentiment Source Breakdown</p><h2 className='mt-2 text-xl font-semibold'>Where the crowd is leaning</h2><div className='mt-5 grid gap-3'>{selected.socialSentimentData.map((source) => <div key={source.source} className='rounded-lg border border-white/10 bg-white/[0.04] p-4'><div className='flex items-center justify-between'><p className='font-medium text-zinc-100'>{source.source}</p><span className='text-sm text-emerald-200'>+{source.changePercent}%</span></div><div className='mt-3 h-2 rounded-full bg-white/10'><div className='h-2 rounded-full bg-gradient-to-r from-cyan-300 to-lime-300' style={{ width: `${source.score}%` }} /></div><p className='mt-2 text-xs text-zinc-500'>{source.mentions} mentions / score {source.score}</p></div>)}</div></article>
            </section>

            <section id='signal-breakdown' className='glass-panel p-5 sm:p-6'><p className='text-xs uppercase tracking-[0.18em] text-zinc-500'>Signal Breakdown</p><h2 className='mt-2 text-xl font-semibold'>Model inputs</h2><div className='mt-5 space-y-3'>{selected.signalBreakdown.map((signal) => <div key={signal.signal} className='grid gap-3 rounded-lg border border-white/10 bg-black/[0.15] p-4 md:grid-cols-[150px_80px_110px_1fr] md:items-center'><p className='font-medium text-zinc-100'>{signal.signal}</p><p className='text-sm text-zinc-300'>{signal.score}/100</p><p className='text-sm text-cyan-200'>{signal.trend}</p><p className='text-sm leading-5 text-zinc-400'>{signal.interpretation}</p></div>)}</div></section>

            <section id='risk-drivers' className='glass-panel p-5 sm:p-6'><p className='text-xs uppercase tracking-[0.18em] text-zinc-500'>Why this risk level?</p><h2 className='mt-2 text-2xl font-semibold'>{selected.riskLevel} risk for {selected.symbol}</h2><div className='mt-5 grid gap-3'>{selected.topRiskDrivers.map((driver, index) => <div key={driver} className='rounded-lg border border-white/10 bg-white/[0.04] p-4'><p className='text-xs uppercase tracking-[0.14em] text-cyan-200'>Reason {index + 1}</p><p className='mt-2 text-sm leading-6 text-zinc-300'>{driver}</p></div>)}</div></section>

            <footer className='rounded-xl border border-white/10 bg-black/[0.18] p-5 text-sm leading-6 text-zinc-400'><p className='font-medium text-zinc-200'>Demo data only.</p><p className='mt-2'>Figures are structured mock values for portfolio demonstration and should not be interpreted as live or investment-grade data.</p></footer>
          </div>
        </main>
      </div>
    </div>
  )
}
