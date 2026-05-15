export type RiskLevel = 'Low' | 'Moderate' | 'Elevated' | 'High' | 'Extreme'

export type PricePoint = {
  date: string
  price: number
}

export type SentimentSource = {
  source: string
  score: number
  mentions: string
  changePercent: number
}

export type SignalBreakdown = {
  signal: string
  score: number
  trend: 'Improving' | 'Stable' | 'Deteriorating' | 'Accelerating'
  interpretation: string
}

export type StockProfile = {
  symbol: string
  companyName: string
  sector: string
  currentPrice: number
  dailyChangePercent: number
  marketCap: string
  volume: string
  volatility30d: number
  hypeScore: number
  fundamentalsScore: number
  sentimentScore: number
  retailMentionGrowth: number
  compositeRiskScore: number
  sectorAverageVolatility: number
  highBetaPeerAverageVolatility: number
  confidence: 'High confidence' | 'Medium confidence' | 'Low confidence'
  riskLevel: RiskLevel
  riskSummary: string
  lastUpdated: string
  historicalPriceData: PricePoint[]
  socialSentimentData: SentimentSource[]
  signalBreakdown: SignalBreakdown[]
  topRiskDrivers: string[]
}

type StockSeed = Omit<
  StockProfile,
  | 'historicalPriceData'
  | 'socialSentimentData'
  | 'signalBreakdown'
  | 'topRiskDrivers'
  | 'riskSummary'
  | 'lastUpdated'
  | 'sectorAverageVolatility'
  | 'highBetaPeerAverageVolatility'
  | 'confidence'
>

export const quickTickers = ['AAPL', 'NVDA', 'TSLA', 'AMD', 'GME', 'META'] as const

export const marketOverview = [
  { label: 'S&P 500', value: '5,914.22', change: '+0.42%' },
  { label: 'Nasdaq 100', value: '20,641.10', change: '+0.71%' },
  { label: 'VIX', value: '14.9', change: '-2.18%' },
  { label: '10Y Yield', value: '4.38%', change: '+4 bps' },
  { label: 'WTI', value: '$78.34', change: '-0.6%' },
  { label: 'BTC', value: '$104.8K', change: '+1.9%' },
]

const stockSeeds: StockSeed[] = [
  { symbol: 'AAPL', companyName: 'Apple Inc.', sector: 'Consumer Technology', currentPrice: 189.62, dailyChangePercent: 0.92, marketCap: '$2.91T', volume: '54.2M', volatility30d: 21.8, hypeScore: 58, fundamentalsScore: 78, sentimentScore: 64, retailMentionGrowth: 18, compositeRiskScore: 38, riskLevel: 'Moderate' },
  { symbol: 'MSFT', companyName: 'Microsoft Corporation', sector: 'Software and Cloud', currentPrice: 421.37, dailyChangePercent: 1.18, marketCap: '$3.13T', volume: '24.8M', volatility30d: 22.6, hypeScore: 66, fundamentalsScore: 86, sentimentScore: 72, retailMentionGrowth: 24, compositeRiskScore: 42, riskLevel: 'Moderate' },
  { symbol: 'NVDA', companyName: 'NVIDIA Corporation', sector: 'Semiconductors', currentPrice: 1128.41, dailyChangePercent: 3.24, marketCap: '$2.78T', volume: '49.7M', volatility30d: 38.6, hypeScore: 94, fundamentalsScore: 82, sentimentScore: 88, retailMentionGrowth: 64, compositeRiskScore: 73, riskLevel: 'High' },
  { symbol: 'TSLA', companyName: 'Tesla, Inc.', sector: 'Automotive and Energy', currentPrice: 184.7, dailyChangePercent: 5.82, marketCap: '$588B', volume: '128.3M', volatility30d: 52.4, hypeScore: 91, fundamentalsScore: 45, sentimentScore: 82, retailMentionGrowth: 77, compositeRiskScore: 88, riskLevel: 'Extreme' },
  { symbol: 'AMD', companyName: 'Advanced Micro Devices, Inc.', sector: 'Semiconductors', currentPrice: 164.31, dailyChangePercent: 2.14, marketCap: '$266B', volume: '67.9M', volatility30d: 41.2, hypeScore: 79, fundamentalsScore: 67, sentimentScore: 74, retailMentionGrowth: 46, compositeRiskScore: 66, riskLevel: 'Elevated' },
  { symbol: 'GME', companyName: 'GameStop Corp.', sector: 'Specialty Retail', currentPrice: 31.48, dailyChangePercent: 8.96, marketCap: '$13.6B', volume: '91.4M', volatility30d: 86.7, hypeScore: 98, fundamentalsScore: 24, sentimentScore: 90, retailMentionGrowth: 146, compositeRiskScore: 96, riskLevel: 'Extreme' },
  { symbol: 'META', companyName: 'Meta Platforms, Inc.', sector: 'Communication Services', currentPrice: 482.76, dailyChangePercent: -0.38, marketCap: '$1.22T', volume: '18.6M', volatility30d: 24.9, hypeScore: 61, fundamentalsScore: 84, sentimentScore: 68, retailMentionGrowth: 22, compositeRiskScore: 39, riskLevel: 'Moderate' },
  { symbol: 'AMZN', companyName: 'Amazon.com, Inc.', sector: 'E-commerce and Cloud', currentPrice: 184.22, dailyChangePercent: 1.44, marketCap: '$1.91T', volume: '42.5M', volatility30d: 27.4, hypeScore: 62, fundamentalsScore: 80, sentimentScore: 69, retailMentionGrowth: 26, compositeRiskScore: 43, riskLevel: 'Moderate' },
  { symbol: 'GOOG', companyName: 'Alphabet Inc.', sector: 'Internet Services', currentPrice: 176.13, dailyChangePercent: 0.66, marketCap: '$2.16T', volume: '22.1M', volatility30d: 25.1, hypeScore: 57, fundamentalsScore: 82, sentimentScore: 63, retailMentionGrowth: 19, compositeRiskScore: 36, riskLevel: 'Moderate' },
  { symbol: 'NFLX', companyName: 'Netflix, Inc.', sector: 'Streaming Media', currentPrice: 642.9, dailyChangePercent: -1.12, marketCap: '$278B', volume: '4.6M', volatility30d: 33.2, hypeScore: 52, fundamentalsScore: 74, sentimentScore: 58, retailMentionGrowth: 15, compositeRiskScore: 41, riskLevel: 'Moderate' },
  { symbol: 'JPM', companyName: 'JPMorgan Chase & Co.', sector: 'Banking', currentPrice: 198.44, dailyChangePercent: 0.31, marketCap: '$572B', volume: '9.8M', volatility30d: 18.2, hypeScore: 28, fundamentalsScore: 81, sentimentScore: 49, retailMentionGrowth: 7, compositeRiskScore: 22, riskLevel: 'Low' },
  { symbol: 'BAC', companyName: 'Bank of America Corporation', sector: 'Banking', currentPrice: 38.12, dailyChangePercent: -0.46, marketCap: '$296B', volume: '41.3M', volatility30d: 23.6, hypeScore: 31, fundamentalsScore: 68, sentimentScore: 45, retailMentionGrowth: 9, compositeRiskScore: 32, riskLevel: 'Moderate' },
  { symbol: 'GS', companyName: 'The Goldman Sachs Group, Inc.', sector: 'Capital Markets', currentPrice: 456.25, dailyChangePercent: 0.74, marketCap: '$146B', volume: '2.3M', volatility30d: 20.9, hypeScore: 26, fundamentalsScore: 76, sentimentScore: 48, retailMentionGrowth: 6, compositeRiskScore: 24, riskLevel: 'Low' },
  { symbol: 'MS', companyName: 'Morgan Stanley', sector: 'Capital Markets', currentPrice: 99.84, dailyChangePercent: 0.22, marketCap: '$162B', volume: '7.6M', volatility30d: 21.5, hypeScore: 25, fundamentalsScore: 73, sentimentScore: 46, retailMentionGrowth: 8, compositeRiskScore: 27, riskLevel: 'Low' },
  { symbol: 'V', companyName: 'Visa Inc.', sector: 'Payments', currentPrice: 281.32, dailyChangePercent: 0.58, marketCap: '$558B', volume: '6.9M', volatility30d: 17.6, hypeScore: 35, fundamentalsScore: 88, sentimentScore: 55, retailMentionGrowth: 10, compositeRiskScore: 25, riskLevel: 'Low' },
  { symbol: 'MA', companyName: 'Mastercard Incorporated', sector: 'Payments', currentPrice: 462.18, dailyChangePercent: 0.41, marketCap: '$429B', volume: '3.1M', volatility30d: 18.4, hypeScore: 33, fundamentalsScore: 87, sentimentScore: 54, retailMentionGrowth: 9, compositeRiskScore: 24, riskLevel: 'Low' },
  { symbol: 'COST', companyName: 'Costco Wholesale Corporation', sector: 'Consumer Staples', currentPrice: 786.43, dailyChangePercent: 0.28, marketCap: '$349B', volume: '1.9M', volatility30d: 19.8, hypeScore: 42, fundamentalsScore: 83, sentimentScore: 61, retailMentionGrowth: 13, compositeRiskScore: 31, riskLevel: 'Moderate' },
  { symbol: 'WMT', companyName: 'Walmart Inc.', sector: 'Consumer Staples', currentPrice: 67.84, dailyChangePercent: 0.19, marketCap: '$546B', volume: '16.7M', volatility30d: 16.2, hypeScore: 30, fundamentalsScore: 79, sentimentScore: 52, retailMentionGrowth: 8, compositeRiskScore: 23, riskLevel: 'Low' },
  { symbol: 'DIS', companyName: 'The Walt Disney Company', sector: 'Entertainment', currentPrice: 104.52, dailyChangePercent: -0.82, marketCap: '$191B', volume: '12.8M', volatility30d: 29.9, hypeScore: 48, fundamentalsScore: 59, sentimentScore: 51, retailMentionGrowth: 20, compositeRiskScore: 49, riskLevel: 'Moderate' },
  { symbol: 'NKE', companyName: 'NIKE, Inc.', sector: 'Apparel', currentPrice: 92.65, dailyChangePercent: -1.36, marketCap: '$139B', volume: '10.5M', volatility30d: 31.8, hypeScore: 43, fundamentalsScore: 55, sentimentScore: 46, retailMentionGrowth: 17, compositeRiskScore: 52, riskLevel: 'Elevated' },
  { symbol: 'LULU', companyName: 'Lululemon Athletica Inc.', sector: 'Apparel', currentPrice: 354.77, dailyChangePercent: 1.06, marketCap: '$44B', volume: '2.7M', volatility30d: 29.4, hypeScore: 39, fundamentalsScore: 66, sentimentScore: 54, retailMentionGrowth: 12, compositeRiskScore: 39, riskLevel: 'Moderate' },
  { symbol: 'SHOP', companyName: 'Shopify Inc.', sector: 'Commerce Software', currentPrice: 68.91, dailyChangePercent: 2.87, marketCap: '$89B', volume: '19.4M', volatility30d: 45.7, hypeScore: 72, fundamentalsScore: 61, sentimentScore: 70, retailMentionGrowth: 39, compositeRiskScore: 65, riskLevel: 'Elevated' },
  { symbol: 'SQ', companyName: 'Block, Inc.', sector: 'Fintech', currentPrice: 72.38, dailyChangePercent: 3.12, marketCap: '$45B', volume: '14.9M', volatility30d: 48.2, hypeScore: 69, fundamentalsScore: 52, sentimentScore: 66, retailMentionGrowth: 43, compositeRiskScore: 70, riskLevel: 'High' },
  { symbol: 'COIN', companyName: 'Coinbase Global, Inc.', sector: 'Crypto Infrastructure', currentPrice: 226.54, dailyChangePercent: 6.43, marketCap: '$56B', volume: '18.2M', volatility30d: 62.8, hypeScore: 88, fundamentalsScore: 50, sentimentScore: 84, retailMentionGrowth: 83, compositeRiskScore: 87, riskLevel: 'Extreme' },
  { symbol: 'PLTR', companyName: 'Palantir Technologies Inc.', sector: 'Data Analytics Software', currentPrice: 24.87, dailyChangePercent: -1.42, marketCap: '$55B', volume: '58.1M', volatility30d: 53.6, hypeScore: 86, fundamentalsScore: 57, sentimentScore: 80, retailMentionGrowth: 61, compositeRiskScore: 78, riskLevel: 'High' },
]

function makeHistory(seed: StockSeed): PricePoint[] {
  const drift = seed.dailyChangePercent > 0 ? 1 : -1
  const volatility = seed.volatility30d / 100
  const factors = [-0.42, -0.28, -0.18, -0.1, 0.02, 0.11, 0.04, 0.18, 0.26, 0.2, 0]
  const dates = ['Apr 1', 'Apr 5', 'Apr 9', 'Apr 13', 'Apr 17', 'Apr 21', 'Apr 25', 'Apr 29', 'May 3', 'May 7', 'May 11']

  return dates.map((date, index) => {
    const wave = Math.sin(index * 1.7 + seed.symbol.length) * volatility * 0.12
    const trend = factors[index] * volatility * drift
    const price = seed.currentPrice * (1 + trend + wave)
    return { date, price: Number(price.toFixed(seed.currentPrice > 100 ? 2 : 3)) }
  })
}

function makeSentiment(seed: StockSeed): SentimentSource[] {
  const baseMentions = Math.max(1, Math.round(seed.hypeScore * seed.retailMentionGrowth * 0.006))
  return [
    { source: 'X', score: Math.min(99, seed.sentimentScore + 7), mentions: `${baseMentions * 5}K`, changePercent: Math.max(4, seed.retailMentionGrowth) },
    { source: 'Reddit', score: Math.min(99, seed.sentimentScore + (seed.hypeScore > 75 ? 10 : -3)), mentions: `${baseMentions * 2}K`, changePercent: Math.max(3, Math.round(seed.retailMentionGrowth * 1.25)) },
    { source: 'StockTwits', score: Math.min(99, seed.sentimentScore + 3), mentions: `${baseMentions}K`, changePercent: Math.max(2, Math.round(seed.retailMentionGrowth * 0.9)) },
    { source: 'News', score: Math.max(20, seed.sentimentScore - 8), mentions: `${Math.max(2, Math.round(baseMentions / 4))}.4K`, changePercent: Math.max(1, Math.round(seed.retailMentionGrowth * 0.35)) },
  ]
}

function makeSignals(seed: StockSeed): SignalBreakdown[] {
  const attentionTrend = seed.retailMentionGrowth > 55 ? 'Accelerating' : seed.retailMentionGrowth > 20 ? 'Improving' : 'Stable'
  const revisionTrend = seed.fundamentalsScore > 75 ? 'Improving' : seed.fundamentalsScore < 55 ? 'Deteriorating' : 'Stable'
  const optionTrend = seed.volatility30d > 50 ? 'Accelerating' : seed.volatility30d > 32 ? 'Stable' : 'Improving'
  const valuationTrend = seed.compositeRiskScore > 70 ? 'Deteriorating' : seed.compositeRiskScore > 45 ? 'Stable' : 'Improving'

  return [
    { signal: 'Earnings revisions', score: seed.fundamentalsScore, trend: revisionTrend, interpretation: `${seed.companyName} fundamentals are ${seed.fundamentalsScore > 70 ? 'supporting factor quality through revisions and margin stability' : 'lagging recent narrative momentum'}.` },
    { signal: 'Retail crowding', score: seed.hypeScore, trend: attentionTrend, interpretation: `30-day retail traffic is ${seed.retailMentionGrowth > 40 ? 'accelerating faster than the sector baseline' : 'within a controlled historical range'}.` },
    { signal: 'Options activity proxy', score: Math.min(99, Math.round(seed.volatility30d + seed.hypeScore * 0.45)), trend: optionTrend, interpretation: `Short-dated positioning implies ${seed.volatility30d > 45 ? 'elevated event and gap-risk pressure' : 'orderly risk appetite'}.` },
    { signal: 'Valuation vs sector', score: seed.compositeRiskScore, trend: valuationTrend, interpretation: `Composite risk is ${seed.compositeRiskScore > 70 ? 'stretched versus benchmark fundamentals' : 'not yet in a disorderly divergence regime'}.` },
  ]
}

function makeDrivers(seed: StockSeed): string[] {
  if (seed.compositeRiskScore >= 80) {
    return [
      'Factor divergence is extreme: social acceleration and options activity are running well ahead of fundamental support.',
      '30-day realized volatility is above both sector and high-beta peer benchmarks, increasing gap-risk sensitivity.',
      'Retail crowding is unusually concentrated across 30-day social mention aggregates, raising reflexive unwind risk.',
    ]
  }

  if (seed.compositeRiskScore >= 60) {
    return [
      'Hype/fundamental divergence is positive, making the setup sensitive to narrative disappointment.',
      'Volatility pressure is above the sector benchmark as positioning becomes more crowded.',
      'Retail mention growth is outpacing the broader peer group on a 30-day aggregated basis.',
    ]
  }

  if (seed.compositeRiskScore >= 35) {
    return [
      'Social acceleration is visible, but fundamentals still provide partial factor support.',
      'Realized volatility remains manageable relative to high-beta peers.',
      'Retail mention growth is positive without reaching an extreme crowding regime.',
    ]
  }

  return [
    'Fundamentals are stronger than social hype, reducing narrative-driven downside risk.',
    'Realized volatility is close to or below sector benchmark levels.',
    'Retail mentions are stable and do not suggest abnormal crowding.',
  ]
}

function makeSummary(seed: StockSeed) {
  const direction = seed.hypeScore > seed.fundamentalsScore ? 'hype is leading fundamentals' : 'fundamentals are leading hype'
  return `${seed.companyName} carries ${seed.riskLevel.toLowerCase()} demo risk: ${direction}, with ${seed.volatility30d.toFixed(1)}% annualized 30-day realized volatility and ${seed.retailMentionGrowth}% 30-day retail mention growth.`
}

function sectorAverageVolatility(seed: StockSeed) {
  const sectorMap: Record<string, number> = {
    'Automotive and Energy': 41,
    Apparel: 27,
    Banking: 21,
    'Capital Markets': 22,
    'Commerce Software': 38,
    'Communication Services': 27,
    'Consumer Staples': 18,
    'Consumer Technology': 24,
    'Crypto Infrastructure': 58,
    'Data Analytics Software': 43,
    'E-commerce and Cloud': 29,
    Entertainment: 30,
    Fintech: 42,
    'Internet Services': 27,
    Payments: 19,
    Semiconductors: 39,
    'Software and Cloud': 27,
    'Specialty Retail': 34,
    'Streaming Media': 33,
  }
  return sectorMap[seed.sector] ?? 30
}

function highBetaPeerAverageVolatility(seed: StockSeed) {
  return Math.round((sectorAverageVolatility(seed) + Math.max(seed.volatility30d, sectorAverageVolatility(seed)) + 18) * 10 / 3) / 10
}

function confidence(seed: StockSeed): StockProfile['confidence'] {
  if (seed.volume.endsWith('M') && Number(seed.volume.replace('M', '')) > 15 && seed.marketCap.includes('T')) return 'High confidence'
  if (seed.volume.endsWith('M') && Number(seed.volume.replace('M', '')) > 5) return 'Medium confidence'
  return 'Low confidence'
}

function hydrateStock(seed: StockSeed): StockProfile {
  return {
    ...seed,
    lastUpdated: 'May 14, 2026, 2:32 PM ET',
    sectorAverageVolatility: sectorAverageVolatility(seed),
    highBetaPeerAverageVolatility: highBetaPeerAverageVolatility(seed),
    confidence: confidence(seed),
    riskSummary: makeSummary(seed),
    historicalPriceData: makeHistory(seed),
    socialSentimentData: makeSentiment(seed),
    signalBreakdown: makeSignals(seed),
    topRiskDrivers: makeDrivers(seed),
  }
}

export const stockData: Record<string, StockProfile> = Object.fromEntries(stockSeeds.map((seed) => [seed.symbol, hydrateStock(seed)]))
export const availableTickers = stockSeeds.map((seed) => seed.symbol)
