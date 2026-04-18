import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, ReferenceLine, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// ── Mock seeded data (represents aggregated DB data in prod) ──
const weeklyData = [
  { period: 'Mon', myEarnings: 3200, myHourlyRate: 640, cityMedian: 560 },
  { period: 'Tue', myEarnings: 2400, myHourlyRate: 600, cityMedian: 555 },
  { period: 'Wed', myEarnings: 1600, myHourlyRate: 533, cityMedian: 562 },
  { period: 'Thu', myEarnings: 2200, myHourlyRate: 629, cityMedian: 570 },
  { period: 'Fri', myEarnings: 1500, myHourlyRate: 500, cityMedian: 558 },
  { period: 'Sat', myEarnings: 4300, myHourlyRate: 717, cityMedian: 610 },
  { period: 'Sun', myEarnings: 5200, myHourlyRate: 743, cityMedian: 625 },
];

const monthlyData = [
  { period: 'Jan', myEarnings: 68000, myHourlyRate: 590, cityMedian: 540 },
  { period: 'Feb', myEarnings: 72000, myHourlyRate: 610, cityMedian: 548 },
  { period: 'Mar', myEarnings: 61000, myHourlyRate: 550, cityMedian: 545 },
  { period: 'Apr', myEarnings: 85000, myHourlyRate: 680, cityMedian: 560 },
];

const commissionData = [
  { month: 'Jan', myRate: 13.5, platformAvg: 12.0 },
  { month: 'Feb', myRate: 13.8, platformAvg: 12.5 },
  { month: 'Mar', myRate: 15.2, platformAvg: 13.0 },
  { month: 'Apr', myRate: 14.2, platformAvg: 12.8 },
];

const platformBreakdown = [
  { name: 'FoodPanda', myRate: 14.2, cityAvg: 12.8, diff: +1.4 },
  { name: 'InDrive', myRate: 18.0, cityAvg: 15.0, diff: +3.0 },
  { name: 'Bykea', myRate: 11.5, cityAvg: 12.0, diff: -0.5 },
];

export default function WorkerAnalytics() {
  const [period, setPeriod] = useState('weekly');
  const data = period === 'weekly' ? weeklyData : monthlyData;

  // Compute averages
  const myAvgHourly = Math.round(data.reduce((s, d) => s + d.myHourlyRate, 0) / data.length);
  const cityAvgHourly = Math.round(data.reduce((s, d) => s + d.cityMedian, 0) / data.length);
  const diffPercent = (((myAvgHourly - cityAvgHourly) / cityAvgHourly) * 100).toFixed(1);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header + Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text">Income Analytics</h1>
          <p className="text-text-muted">Your earnings trends, hourly rates, and commission transparency.</p>
        </div>
        <div className="flex bg-surface border border-border/50 rounded-xl p-1 gap-1">
          {['weekly', 'monthly'].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${period === p ? 'bg-primary text-white' : 'text-text-muted hover:text-text'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* City Median Comparison — KEY REQUIREMENT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card hover className="border-l-4 border-l-primary md:col-span-1">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-text-muted mb-1">Your Avg. Hourly Rate</p>
            <h3 className="text-3xl font-display font-bold text-text mb-2">Rs. {myAvgHourly}</h3>
            <div className={`flex items-center gap-1 text-sm font-semibold ${parseFloat(diffPercent) >= 0 ? 'text-success' : 'text-error'}`}>
              {parseFloat(diffPercent) >= 0 ? <ArrowUpRight size={16}/> : <ArrowDownRight size={16}/>}
              {Math.abs(diffPercent)}% {parseFloat(diffPercent) >= 0 ? 'above' : 'below'} city median
            </div>
          </CardContent>
        </Card>

        <Card hover className="md:col-span-1">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-text-muted mb-1">Anonymised City Median</p>
            <h3 className="text-3xl font-display font-bold text-text-muted mb-2">Rs. {cityAvgHourly}</h3>
            <div className="flex items-center gap-1 text-sm text-text-muted">
              <Users size={14}/> Based on {period === 'weekly' ? '1,248' : '1,248'} workers in your category
            </div>
          </CardContent>
        </Card>

        <Card hover className={`md:col-span-1 ${parseFloat(diffPercent) >= 0 ? 'border-success/30 bg-success/5' : 'border-error/30 bg-error/5'}`}>
          <CardContent className="p-6">
            <p className={`text-sm font-medium mb-1 ${parseFloat(diffPercent) >= 0 ? 'text-success' : 'text-error'}`}>Your Position</p>
            <h3 className={`text-3xl font-display font-bold mb-2 ${parseFloat(diffPercent) >= 0 ? 'text-success' : 'text-error'}`}>
              {parseFloat(diffPercent) >= 0 ? 'Above Average' : 'Below Average'}
            </h3>
            <p className={`text-xs ${parseFloat(diffPercent) >= 0 ? 'text-success/80' : 'text-error/80'}`}>
              {parseFloat(diffPercent) >= 0
                ? 'Great! You\'re earning more than most workers in your category.'
                : 'You may be experiencing higher deductions than peers.'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Trend */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Net Earnings Trend ({period})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2D5016" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#2D5016" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB"/>
                <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: '#6B6B5A', fontSize: 12 }} dy={8}/>
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B6B5A', fontSize: 12 }}/>
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} formatter={v => [`Rs. ${v}`]}/>
                <Area type="monotone" dataKey="myEarnings" name="Net Earnings" stroke="#2D5016" strokeWidth={3} fillOpacity={1} fill="url(#earningsGrad)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Hourly Rate vs City Median */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="text-primary" size={20}/>
            <CardTitle>Effective Hourly Rate vs City Median</CardTitle>
          </div>
          <p className="text-sm text-text-muted mt-1">Your hourly rate compared to the anonymised median for delivery workers in your city.</p>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB"/>
                <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: '#6B6B5A', fontSize: 12 }} dy={8}/>
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B6B5A', fontSize: 12 }} domain={['auto', 'auto']}/>
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} formatter={v => [`Rs. ${v}/hr`]}/>
                <Legend verticalAlign="top" height={36} iconType="circle"/>
                <Line type="monotone" dataKey="myHourlyRate" name="My Hourly Rate" stroke="#2D5016" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }}/>
                <Line type="monotone" dataKey="cityMedian" name="City Median" stroke="#8B6914" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3 }}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Platform Commission Rate Tracker */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="text-accent" size={20}/>
            <CardTitle>Platform Commission Rate Tracker</CardTitle>
          </div>
          <p className="text-sm text-text-muted mt-1">Your effective deduction rate vs. reported city average. Flag discrepancies to advocates.</p>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Trend Chart */}
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={commissionData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB"/>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6B6B5A', fontSize: 12 }} dy={8}/>
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B6B5A', fontSize: 12 }} unit="%"/>
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} formatter={v => [`${v}%`]}/>
                <Legend verticalAlign="top" height={36} iconType="circle"/>
                <ReferenceLine y={15} stroke="#C0392B" strokeDasharray="4 2" label={{ value: 'Concern threshold', fill: '#C0392B', fontSize: 11 }}/>
                <Line type="monotone" dataKey="myRate" name="My Commission Rate" stroke="#C0392B" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }}/>
                <Line type="monotone" dataKey="platformAvg" name="Platform Avg." stroke="#8B6914" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3 }}/>
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Per-Platform Breakdown Table */}
          <div>
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Per-Platform Breakdown (This Month)</p>
            <div className="space-y-3">
              {platformBreakdown.map((p) => (
                <div key={p.name} className="flex items-center justify-between p-4 bg-background rounded-xl border border-border/40">
                  <span className="font-semibold text-text">{p.name}</span>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-right">
                      <p className="text-xs text-text-muted">My Rate</p>
                      <p className={`font-bold ${p.diff > 0 ? 'text-error' : 'text-success'}`}>{p.myRate}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-text-muted">City Avg</p>
                      <p className="font-semibold text-text">{p.cityAvg}%</p>
                    </div>
                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${p.diff > 0 ? 'bg-error/10 text-error' : 'bg-success/10 text-success'}`}>
                      {p.diff > 0 ? <TrendingDown size={12}/> : <TrendingUp size={12}/>}
                      {p.diff > 0 ? '+' : ''}{p.diff.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
