import { Activity, ArrowRight, ArrowUpRight, ClipboardList, CreditCard, UsersRound } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { StatusBadge } from '../components/patterns'

const metrics = [
  { label: 'Customers', value: '1,284', change: '+12.8%', color: 'coral', icon: ClipboardList, points: '0,28 12,22 22,26 32,15 44,19 54,8 66,16 76,11 88,23 100,18 112,29' },
  { label: 'Interactions', value: '3,680', change: '+8.2%', color: 'orange', icon: Activity, points: '0,30 12,20 22,25 34,16 44,19 56,11 68,18 78,9 90,20 101,14 112,27' },
  { label: 'New customers', value: '280', change: '+18.4%', color: 'teal', icon: UsersRound, points: '0,31 12,22 22,26 32,13 42,24 54,10 64,20 75,8 87,15 99,11 112,27' },
  { label: 'Monthly value', value: '$12,860', change: '+6.5%', color: 'blue', icon: CreditCard, points: '0,29 12,21 22,25 32,9 42,15 52,6 62,17 73,10 83,25 94,13 103,18 112,29' },
]

const recentCustomers = [
  { initials: 'AS', name: 'Acme Studio', email: 'hello@acme.studio', date: '18 Oct 2026', status: 'Active', tone: 'success' as const },
  { initials: 'NL', name: 'Northstar Labs', email: 'team@northstar.io', date: '16 Oct 2026', status: 'Pending', tone: 'warning' as const },
  { initials: 'MC', name: 'Maple & Co.', email: 'contact@maple.co', date: '12 Oct 2026', status: 'Active', tone: 'success' as const },
  { initials: 'BH', name: 'Bright Harbor', email: 'team@brightharbor.io', date: '10 Oct 2026', status: 'Draft', tone: 'info' as const },
]

const channels = [
  { name: 'Direct', initials: 'DI', detail: 'Website and referrals', status: 'Growing', tone: 'success' as const },
  { name: 'Email', initials: 'EM', detail: 'Campaign responses', status: 'Growing', tone: 'success' as const },
  { name: 'Social', initials: 'SO', detail: 'Community activity', status: 'Steady', tone: 'info' as const },
  { name: 'Other', initials: 'OT', detail: 'Additional sources', status: 'Steady', tone: 'info' as const },
]

const weeklyBars = [[42, 17, 12], [57, 21, 15], [72, 22, 18], [50, 18, 13], [64, 19, 12], [58, 24, 16], [69, 17, 12]]
const monthlyBars = [[54, 19, 13], [67, 21, 14], [73, 20, 16], [61, 24, 13], [77, 18, 12], [70, 21, 17], [82, 17, 12]]

function TrendChart({ period }: { period: 'week' | 'month' }) {
  const first = period === 'week' ? '0,194 65,170 130,179 195,110 260,151 325,165 390,128 455,138 520,96 585,116 650,83' : '0,195 65,166 130,175 195,151 260,132 325,146 390,107 455,118 520,94 585,103 650,73'
  const second = period === 'week' ? '0,205 65,186 130,132 195,148 260,159 325,114 390,95 455,110 520,70 585,101 650,88' : '0,212 65,197 130,169 195,181 260,140 325,151 390,118 455,90 520,104 585,78 650,67'
  return <div className="chart-frame"><svg viewBox="0 0 700 250" role="img" aria-label="Two sample customer activity trends" preserveAspectRatio="none">
    {[35, 82, 129, 176, 223].map(y => <line key={y} x1="40" x2="690" y1={y} y2={y} stroke="#e6e8eb" strokeDasharray="4 5" />)}
    <polyline points={first.split(' ').map(pair => { const [x, y] = pair.split(',').map(Number); return `${x + 40},${y + 4}` }).join(' ')} fill="none" stroke="#7771ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points={second.split(' ').map(pair => { const [x, y] = pair.split(',').map(Number); return `${x + 40},${y + 4}` }).join(' ')} fill="none" stroke="#fb6577" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg><div className="chart-labels">{(period === 'week' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']).map(day => <span key={day}>{day}</span>)}</div></div>
}

export function DashboardPreviewPage() {
  const [trendPeriod, setTrendPeriod] = useState<'week' | 'month'>('week')
  const [channelPeriod, setChannelPeriod] = useState<'week' | 'month'>('week')
  const bars = channelPeriod === 'week' ? weeklyBars : monthlyBars
  return <main className="page dashboard-page">
    <div className="dashboard-intro"><div><p className="dashboard-kicker">OVERVIEW</p><h1>Dashboard</h1><p>A clear view of the work that matters most.</p></div><span className="sample-pill">Sample dashboard data</span></div>
    <section className="metric-grid" aria-label="Sample metrics">{metrics.map(metric => { const Icon = metric.icon; return <article className="metric-card" key={metric.label}>
      <span className={`metric-icon metric-${metric.color}`}><Icon size={22} strokeWidth={2.1} /></span>
      <div className="metric-bottom"><div><p>{metric.label}</p><strong>{metric.value}</strong></div><svg className="sparkline" viewBox="0 0 112 38" aria-hidden="true"><polyline points={metric.points} fill="none" stroke="#4d73f9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
      <span className="metric-change"><ArrowUpRight size={13} /> {metric.change} <span>vs last period</span></span>
    </article> })}</section>

    <div className="chart-grid">
      <section className="dashboard-panel"><div className="panel-heading"><div><h2>Customer activity</h2><div className="chart-legend"><span><i className="legend-dot legend-purple" /> New customers</span><span><i className="legend-dot legend-coral" /> Returning</span></div></div><select aria-label="Chart period" value={trendPeriod} onChange={event => setTrendPeriod(event.target.value as 'week' | 'month')}><option value="week">This week</option><option value="month">Last 7 months</option></select></div><TrendChart period={trendPeriod} /></section>
      <section className="dashboard-panel"><div className="panel-heading"><div><h2>Activity by channel</h2><div className="chart-legend"><span><i className="legend-dot legend-deep" /> Direct</span><span><i className="legend-dot legend-mid" /> Email</span><span><i className="legend-dot legend-light" /> Social</span></div></div><select aria-label="Channel period" value={channelPeriod} onChange={event => setChannelPeriod(event.target.value as 'week' | 'month')}><option value="week">This week</option><option value="month">Last 7 months</option></select></div><div className="bar-chart" role="img" aria-label="Sample activity across seven periods"><div className="bar-grid" />{bars.map((segments, index) => <div className="bar-column" key={index}><div className="bar-stack"><span style={{ height: `${segments[0]}%` }} /><span style={{ height: `${segments[1]}%` }} /><span style={{ height: `${segments[2]}%` }} /></div><small>{channelPeriod === 'week' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index] : ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'][index]}</small></div>)}</div></section>
    </div>

    <div className="dashboard-tables">
      <section className="dashboard-panel table-panel"><div className="panel-heading"><h2>Recent customers</h2><Link to="/customers" className="panel-link">Open customers <ArrowRight size={16} /></Link></div><div className="dashboard-table-scroll"><table><thead><tr><th>Customer</th><th>Email</th><th>Joined</th><th>Status</th></tr></thead><tbody>{recentCustomers.map(customer => <tr key={customer.name}><td><span className="table-person"><span className="table-avatar">{customer.initials}</span><strong>{customer.name}</strong></span></td><td>{customer.email}</td><td>{customer.date}</td><td><StatusBadge tone={customer.tone}>{customer.status}</StatusBadge></td></tr>)}</tbody></table></div></section>
      <section className="dashboard-panel table-panel"><div className="panel-heading"><h2>Channels</h2><Link to="/components" className="panel-link">View components <ArrowRight size={16} /></Link></div><div className="dashboard-table-scroll"><table><thead><tr><th>Channel</th><th>Status</th></tr></thead><tbody>{channels.map(channel => <tr key={channel.name}><td><span className="table-person"><span className="table-avatar channel-avatar">{channel.initials}</span><span><strong>{channel.name}</strong><small>{channel.detail}</small></span></span></td><td><StatusBadge tone={channel.tone}>{channel.status}</StatusBadge></td></tr>)}</tbody></table></div></section>
    </div>
    <p className="dashboard-disclaimer">This dashboard demonstrates the visual design with sample data. Customer management is connected to the API after sign in.</p>
  </main>
}
