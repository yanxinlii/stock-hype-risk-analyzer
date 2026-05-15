import { useMemo, useState } from 'react'
import {
  availableTickers,
  marketOverview,
  quickTickers,
  stockData,
  type PricePoint,
  type RiskLevel,
  type StockProfile,
} from './mockData'

const navItems = [
  { label: 'Overview', id: 'overview' },
  { label: 'Market Pulse', id: 'market-pulse' },
  { label: 'Watchlist', id: 'watchlist' },
  { label: 'Sentiment', id: 'sentiment' },
  { label: 'Risk Drivers', id: 'risk-drivers' },
  { label: 'Methodology', id: 'methodology' },
]

const chartWidth = 760
const chartHeight = 300

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value > 1000 ? 0 : 2,
  }).format(value)
}

function signedPercent(value: number) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
}

function riskKey(level: RiskLevel) {
  return level.toLowerCase()
}

function riskClass(level: RiskLevel) {
  return `risk-tag risk-tag--${riskKey(level)}`
}

function confidenceClass(confidence: StockProfile['confidence']) {
  if (confidence === 'High confidence') return 'quality-tag quality-tag--high'
  if (confidence === 'Medium confidence') return 'quality-tag quality-tag--medium'
  return 'quality-tag quality-tag--low'
}

function trendClass(value: number) {
  return value >= 0 ? 'trend trend--up' : 'trend trend--down'
}

function pointsFor(data: PricePoint[]) {
  const padding = 28
  const values = data.map((point) => point.price)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const spread = max - min || 1

  return data.map((point, index) => {
    const x = padding + (index / (data.length - 1 || 1)) * (chartWidth - padding * 2)
    const y = chartHeight - padding - ((point.price - min) / spread) * (chartHeight - padding * 2)
    return { ...point, x, y }
  })
}

function PriceTrendChart({ stock }: { stock: StockProfile }) {
  const points = pointsFor(stock.historicalPriceData)
  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(' ')
  const areaPath = `${linePath} L ${chartWidth - 28},${chartHeight - 28} L 28,${chartHeight - 28} Z`
  const first = stock.historicalPriceData[0].price
  const last = stock.historicalPriceData[stock.historicalPriceData.length - 1].price

  return (
    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="price-chart" role="img" aria-label={`${stock.symbol} historical price trend`}>
      <defs>
        <linearGradient id="price-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#2f6f63" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#2f6f63" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[52, 101, 150, 199, 248].map((y) => (
        <line key={y} x1="28" x2="732" y1={y} y2={y} className="chart-gridline" />
      ))}
      <path d={areaPath} fill="url(#price-area)" />
      <path d={linePath} className="chart-line" />
      {points.map((point, index) => (
        <circle key={point.date} cx={point.x} cy={point.y} r={index === points.length - 1 ? 4.8 : 3.2} className="chart-point" />
      ))}
      {points.filter((_, index) => index % 2 === 0).map((point) => (
        <text key={point.date} x={point.x - 14} y="290" className="chart-label">
          {point.date}
        </text>
      ))}
      <text x="28" y="26" className="chart-value">
        {formatCurrency(first)}
      </text>
      <text x="640" y="26" className={last >= first ? 'chart-value chart-value--up' : 'chart-value chart-value--down'}>
        {formatCurrency(last)}
      </text>
    </svg>
  )
}

function RiskGauge({ stock }: { stock: StockProfile }) {
  const score = Math.min(100, Math.max(0, stock.compositeRiskScore))

  return (
    <div className="risk-gauge" role="img" aria-label={`${stock.symbol} composite risk score ${score} out of 100`}>
      <div className="risk-gauge__header">
        <div>
          <p className="label">Composite Risk</p>
          <p className={riskClass(stock.riskLevel)}>{stock.riskLevel}</p>
        </div>
        <p className="risk-gauge__score">{score}<span>/100</span></p>
      </div>
      <div className="risk-meter">
        <span className="risk-meter__marker" style={{ left: `${score}%` }} />
      </div>
      <div className="risk-meter__labels">
        <span>Low</span>
        <span>Moderate</span>
        <span>Elevated</span>
        <span>Extreme</span>
      </div>
    </div>
  )
}

function ScoreBars({ stock }: { stock: StockProfile }) {
  const rows = [
    { label: 'Hype', value: stock.hypeScore, tone: 'var(--accent)' },
    { label: 'Fundamentals', value: stock.fundamentalsScore, tone: 'var(--forest)' },
    { label: 'Sentiment', value: stock.sentimentScore, tone: 'var(--amber)' },
  ]

  return (
    <div className="score-list">
      {rows.map((row) => (
        <div key={row.label} className="score-row">
          <span>{row.label}</span>
          <div className="score-track">
            <span className="score-fill" style={{ width: `${row.value}%`, backgroundColor: row.tone }} />
          </div>
          <strong>{row.value}</strong>
        </div>
      ))}
    </div>
  )
}

function SentimentBreakdown({ stock }: { stock: StockProfile }) {
  return (
    <div className="source-grid">
      {stock.socialSentimentData.map((source) => (
        <article key={source.source} className="source-card">
          <div className="source-card__top">
            <div>
              <h3>{source.source}</h3>
              <p>{source.mentions} mentions</p>
            </div>
            <span className={source.changePercent > 40 ? 'trend trend--risk' : 'trend trend--up'}>+{source.changePercent}%</span>
          </div>
          <div className="source-meter">
            <span style={{ width: `${source.score}%` }} />
          </div>
          <p className="source-card__score">Sentiment score {source.score}/100</p>
        </article>
      ))}
    </div>
  )
}

function VolatilityPressure({ stock }: { stock: StockProfile }) {
  const rows = [
    { label: stock.symbol, value: stock.volatility30d },
    { label: 'Sector average', value: stock.sectorAverageVolatility },
    { label: 'High-beta peer average', value: stock.highBetaPeerAverageVolatility },
  ]

  return (
    <div className="volatility-block">
      <div className="section-heading section-heading--compact">
        <div>
          <p className="eyebrow">Volatility Benchmark</p>
          <h2>{stock.volatility30d.toFixed(1)}%</h2>
        </div>
        <p className={stock.volatility30d > 45 ? 'risk-tag risk-tag--high' : 'risk-tag risk-tag--moderate'}>
          {stock.volatility30d > 45 ? 'Crowded' : 'Orderly'}
        </p>
      </div>
      <div className="volatility-list">
        {rows.map((row) => (
          <div key={row.label} className="benchmark-row">
            <div>
              <span>{row.label}</span>
              <strong>{row.value.toFixed(1)}%</strong>
            </div>
            <div className="benchmark-track">
              <span style={{ width: `${Math.min(100, row.value * 1.45)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StockSearch({
  selected,
  onSelect,
}: {
  selected: StockProfile
  onSelect: (symbol: string) => void
}) {
  const [query, setQuery] = useState('')
  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return availableTickers
    return availableTickers.filter((symbol) => {
      const stock = stockData[symbol]
      return symbol.toLowerCase().includes(normalized) || stock.companyName.toLowerCase().includes(normalized)
    })
  }, [query])

  function selectSymbol(symbol: string) {
    onSelect(symbol)
    setQuery('')
  }

  return (
    <section id="compare" className="panel control-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Compare Ticker</p>
          <h2>Search the demo universe</h2>
        </div>
        <p>Current selection: {selected.symbol}</p>
      </div>
      <div className="control-grid">
        <div className="search-field">
          <label htmlFor="ticker-search">Symbol or company</label>
          <input
            id="ticker-search"
            value={query}
            onChange={(event) => setQuery(event.target.value.toUpperCase())}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && matches[0]) selectSymbol(matches[0])
            }}
            placeholder="Try Microsoft, Coinbase, Palantir"
          />
          {query && (
            <div className="search-results">
              {matches.length === 0 && <p>No demo ticker matched that query.</p>}
              {matches.map((symbol) => {
                const stock = stockData[symbol]
                return (
                  <button key={symbol} type="button" onClick={() => selectSymbol(symbol)}>
                    <span>
                      <strong>{symbol}</strong>
                      {stock.companyName}
                    </span>
                    <span className={riskClass(stock.riskLevel)}>{stock.riskLevel}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
        <div className="quick-tickers" aria-label="Quick ticker selection">
          {quickTickers.map((symbol) => (
            <button
              key={symbol}
              type="button"
              onClick={() => selectSymbol(symbol)}
              className={selected.symbol === symbol ? 'is-active' : ''}
            >
              {symbol}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function MetricCard({ label, value, caption }: { label: string; value: string; caption: string }) {
  return (
    <article className="metric-card">
      <p className="label">{label}</p>
      <strong>{value}</strong>
      <span>{caption}</span>
    </article>
  )
}

function WatchlistPanel({
  selectedSymbol,
  onSelect,
}: {
  selectedSymbol: string
  onSelect: (symbol: string) => void
}) {
  return (
    <section id="watchlist" className="panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Watchlist</p>
          <h2>Tracked hype-risk names</h2>
        </div>
        <p>Select a row to update the workspace.</p>
      </div>
      <div className="watchlist-grid">
        {quickTickers.map((symbol) => {
          const stock = stockData[symbol]
          const active = selectedSymbol === symbol
          return (
            <button key={symbol} type="button" onClick={() => onSelect(symbol)} className={active ? 'watch-card is-active' : 'watch-card'}>
              <span>
                <strong>{symbol}</strong>
                <small>{stock.companyName}</small>
              </span>
              <span>
                <strong>{formatCurrency(stock.currentPrice)}</strong>
                <small className={trendClass(stock.dailyChangePercent)}>{signedPercent(stock.dailyChangePercent)}</small>
              </span>
              <span className={riskClass(stock.riskLevel)}>{stock.riskLevel}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function MethodologyPanel() {
  const methods = [
    ['Hype Score', 'Mention growth, source breadth, news velocity, and options activity proxy.'],
    ['Fundamentals Score', 'Growth, revisions, margin quality, and valuation versus sector peers.'],
    ['Sentiment Score', 'Source-weighted polarity across social, news, and community signals.'],
    ['Composite Risk', 'Volatility pressure, hype divergence, sentiment dispersion, and retail crowding.'],
  ]

  return (
    <section id="methodology" className="panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Methodology</p>
          <h2>Transparent demo scoring</h2>
        </div>
        <p>Portfolio model framework</p>
      </div>
      <div className="method-grid">
        {methods.map(([title, detail]) => (
          <article key={title} className="method-card">
            <h3>{title}</h3>
            <p>{detail}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default function App() {
  const [selectedSymbol, setSelectedSymbol] = useState('NVDA')
  const [activeSection, setActiveSection] = useState('overview')
  const selected = stockData[selectedSymbol]
  const metrics = [
    { label: 'Current Price', value: formatCurrency(selected.currentPrice), caption: `${selected.volume} shares traded` },
    { label: '1D Return', value: signedPercent(selected.dailyChangePercent), caption: 'Demo regular-session move' },
    { label: '30D Volatility', value: `${selected.volatility30d.toFixed(1)}%`, caption: `Sector benchmark ${selected.sectorAverageVolatility.toFixed(1)}%` },
    { label: 'Hype Score', value: `${selected.hypeScore}/100`, caption: 'Crowd attention proxy' },
    { label: 'Fundamentals', value: `${selected.fundamentalsScore}/100`, caption: 'Quality support score' },
    { label: 'Retail Growth', value: `+${selected.retailMentionGrowth}%`, caption: '30-day mention growth' },
  ]

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <p>Stock Hype</p>
          <h1>Risk Analyzer</h1>
          <span>Research workspace</span>
        </div>

        <nav className="side-nav" aria-label="Dashboard sections">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={activeSection === item.id ? 'page' : undefined}
              onClick={() => setActiveSection(item.id)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="sidebar-watch">
          <p className="label">Active Universe</p>
          {quickTickers.map((symbol) => {
            const stock = stockData[symbol]
            return (
              <button key={symbol} type="button" onClick={() => setSelectedSymbol(symbol)} className={selected.symbol === symbol ? 'is-active' : ''}>
                <span>{symbol}</span>
                <small className={riskClass(stock.riskLevel)}>{stock.riskLevel}</small>
              </button>
            )
          })}
        </div>
      </aside>

      <main className="workspace">
        <div className="workspace-inner">
          <header id="overview" className="hero-panel">
            <div className="hero-copy">
              <div className="tag-row">
                <span className={riskClass(selected.riskLevel)}>{selected.riskLevel} risk</span>
                <span className={confidenceClass(selected.confidence)}>{selected.confidence}</span>
                <span className="timestamp">{selected.lastUpdated}</span>
              </div>
              <p className="eyebrow">Selected Equity</p>
              <h2>{selected.symbol}</h2>
              <p className="company-name">{selected.companyName}</p>
              <p className="hero-summary">{selected.riskSummary}</p>
            </div>
            <div className="hero-context">
              <RiskGauge stock={selected} />
              <div className="context-grid">
                <div>
                  <span>Sector</span>
                  <strong>{selected.sector}</strong>
                </div>
                <div>
                  <span>Market Cap</span>
                  <strong>{selected.marketCap}</strong>
                </div>
                <div>
                  <span>Volume</span>
                  <strong>{selected.volume}</strong>
                </div>
              </div>
            </div>
          </header>

          <section id="market-pulse" className="market-strip" aria-label="Market pulse">
            {marketOverview.map((tick) => (
              <article key={tick.label}>
                <p>{tick.label}</p>
                <strong>{tick.value}</strong>
                <span className={tick.change.startsWith('-') ? 'trend trend--down' : 'trend trend--up'}>{tick.change}</span>
              </article>
            ))}
          </section>

          <StockSearch selected={selected} onSelect={setSelectedSymbol} />
          <WatchlistPanel selectedSymbol={selected.symbol} onSelect={setSelectedSymbol} />

          <section className="metric-grid">
            {metrics.map((metric) => (
              <MetricCard key={metric.label} {...metric} />
            ))}
          </section>

          <section className="analysis-grid">
            <article className="panel panel--large">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Historical Price Trend</p>
                  <h2>{selected.symbol} 30-day market path</h2>
                </div>
                <p className={trendClass(selected.dailyChangePercent)}>{signedPercent(selected.dailyChangePercent)} today</p>
              </div>
              <div className="chart-frame">
                <PriceTrendChart key={selected.symbol} stock={selected} />
              </div>
            </article>

            <article className="panel">
              <div className="section-heading section-heading--compact">
                <div>
                  <p className="eyebrow">Hype vs Fundamentals</p>
                  <h2>Signal balance</h2>
                </div>
              </div>
              <ScoreBars stock={selected} />
              <VolatilityPressure stock={selected} />
            </article>
          </section>

          <section className="detail-grid">
            <article id="sentiment" className="panel">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Sentiment Source Breakdown</p>
                  <h2>Where the crowd is leaning</h2>
                </div>
              </div>
              <SentimentBreakdown stock={selected} />
            </article>

            <article id="risk-drivers" className="panel">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Risk Drivers</p>
                  <h2>Why {selected.symbol} is flagged</h2>
                </div>
              </div>
              <div className="driver-list">
                {selected.topRiskDrivers.map((driver, index) => (
                  <article key={driver}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <p>{driver}</p>
                  </article>
                ))}
              </div>
            </article>
          </section>

          <section id="signal-breakdown" className="panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Signal Breakdown</p>
                <h2>Model inputs</h2>
              </div>
              <p>Scores are mock values for portfolio demonstration.</p>
            </div>
            <div className="signal-table">
              {selected.signalBreakdown.map((signal) => (
                <article key={signal.signal}>
                  <strong>{signal.signal}</strong>
                  <span>{signal.score}/100</span>
                  <small>{signal.trend}</small>
                  <p>{signal.interpretation}</p>
                </article>
              ))}
            </div>
          </section>

          <MethodologyPanel />

          <footer className="site-footer">
            <strong>Demo data only.</strong>
            <span>Designed to simulate future integrations with market, social, news, and options data providers.</span>
          </footer>
        </div>
      </main>
    </div>
  )
}
