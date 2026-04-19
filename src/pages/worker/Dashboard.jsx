import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  Wallet, Clock, TrendingUp, AlertCircle, ArrowUpRight,
  ArrowDownRight, Plus, CheckCircle2, Clock3, ShieldAlert,
  FileText, Megaphone
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const earningsData = [
  { name: 'Mon', gross: 4000, net: 3200 },
  { name: 'Tue', gross: 3000, net: 2400 },
  { name: 'Wed', gross: 2000, net: 1600 },
  { name: 'Thu', gross: 2780, net: 2200 },
  { name: 'Fri', gross: 1890, net: 1500 },
  { name: 'Sat', gross: 5390, net: 4300 },
  { name: 'Sun', gross: 6490, net: 5200 },
];

const platformPie = [
  { name: 'FoodPanda', value: 12000, color: '#2D5016' },
  { name: 'InDrive', value: 9000, color: '#8B6914' },
  { name: 'Bykea', value: 2500, color: '#6B6B5A' },
];

const recentLogs = [
  { id: 1, platform: 'FoodPanda', date: '2026-04-18', hours: 5, net: 2800, status: 'verified' },
  { id: 2, platform: 'InDrive', date: '2026-04-17', hours: 4, net: 2400, status: 'pending' },
  { id: 3, platform: 'FoodPanda', date: '2026-04-16', hours: 6, net: 3100, status: 'verified' },
];

const quickLinks = [
  { label: 'Log New Shift', icon: Plus, path: '/worker/earnings/add', color: 'bg-primary text-white' },
  { label: 'Get Certificate', icon: FileText, path: '/worker/certificate', color: 'bg-accent text-white' },
  { label: 'View Alerts', icon: AlertCircle, path: '/worker/alerts', color: 'bg-error/10 text-error border border-error/20' },
  { label: 'Grievance Board', icon: Megaphone, path: '/worker/grievances', color: 'bg-primary/10 text-primary border border-primary/20' },
];

const cardVariants = {
  initial: { opacity: 0, y: 24 },
  animate: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

export default function WorkerDashboard() {
  const { user } = useAuthStore();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-text-muted text-sm font-medium mb-1">{greeting}, 👋</p>
          <h1 className="text-3xl font-display font-bold text-text">
            {user?.full_name || user?.name || 'Worker'}
          </h1>
          <p className="text-text-muted mt-1">Here's your earnings overview for this week.</p>
        </div>
        <Link to="/worker/earnings/add">
          <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/20 group">
            <Plus size={20} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Log New Shift
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            label: 'Total Net Earnings',
            value: 'Rs. 24,500',
            sub: '+12% vs last week',
            positive: true,
            icon: Wallet,
            iconBg: 'bg-success/10',
            iconColor: 'text-success',
            accent: 'border-l-success',
          },
          {
            label: 'Hours Worked',
            value: '40h 30m',
            sub: '-2% vs last week',
            positive: false,
            icon: Clock,
            iconBg: 'bg-primary/10',
            iconColor: 'text-primary',
            accent: 'border-l-primary',
          },
          {
            label: 'Avg. Hourly Rate',
            value: 'Rs. 605/hr',
            sub: '+Rs.20 above city median',
            positive: true,
            icon: TrendingUp,
            iconBg: 'bg-accent/10',
            iconColor: 'text-accent',
            accent: 'border-l-accent',
          },
          {
            label: 'Detected Anomalies',
            value: '1 Alert',
            sub: 'High deduction flagged',
            positive: false,
            icon: AlertCircle,
            iconBg: 'bg-error/10',
            iconColor: 'text-error',
            accent: 'border-l-error',
            link: '/worker/alerts',
          },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          const inner = (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              initial="initial"
              animate="animate"
            >
              <Card hover className={`border-l-4 ${kpi.accent} h-full`}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-sm font-medium text-text-muted">{kpi.label}</p>
                    <div className={`w-10 h-10 rounded-full ${kpi.iconBg} flex items-center justify-center shrink-0`}>
                      <Icon className={kpi.iconColor} size={20} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-text mb-2">{kpi.value}</h3>
                  <div className="flex items-center text-sm">
                    {kpi.positive
                      ? <ArrowUpRight size={15} className="text-success mr-1" />
                      : <ArrowDownRight size={15} className="text-error mr-1" />
                    }
                    <span className={kpi.positive ? 'text-success font-medium' : 'text-error font-medium'}>
                      {kpi.sub}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
          return kpi.link ? <Link to={kpi.link} key={i}>{inner}</Link> : inner;
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Earnings Area Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Earnings Trend — This Week</CardTitle>
            <div className="flex items-center gap-3 text-xs text-text-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1.5 rounded bg-accent inline-block" /> Gross
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1.5 rounded bg-primary inline-block" /> Net
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={earningsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2D5016" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2D5016" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="grossGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B6914" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#8B6914" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B6B5A', fontSize: 12 }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B6B5A', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: '12px' }}
                    itemStyle={{ fontWeight: 500 }}
                    formatter={(v) => [`Rs. ${v}`]}
                  />
                  <Area type="monotone" dataKey="gross" name="Gross" stroke="#8B6914" strokeWidth={2} strokeDasharray="4 2" fillOpacity={1} fill="url(#grossGrad)" />
                  <Area type="monotone" dataKey="net" name="Net Received" stroke="#2D5016" strokeWidth={3} fillOpacity={1} fill="url(#netGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Platform Pie */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Share</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {platformPie.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`Rs. ${v.toLocaleString()}`]} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2.5 mt-2">
              {platformPie.map((p, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="font-medium text-text">{p.name}</span>
                  </div>
                  <span className="text-text-muted text-xs">Rs. {p.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links + Recent Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Links */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider px-1">Quick Actions</h3>
          {quickLinks.map((ql, i) => {
            const Icon = ql.icon;
            return (
              <Link key={i} to={ql.path}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 px-5 py-4 rounded-xl font-semibold text-sm cursor-pointer transition-all ${ql.color}`}
                >
                  <Icon size={18} />
                  {ql.label}
                  <ArrowUpRight size={16} className="ml-auto" />
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Recent Shifts */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Shifts</CardTitle>
            <Link to="/worker/earnings/history" className="text-sm font-semibold text-primary hover:underline">
              View All →
            </Link>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-text-muted uppercase bg-background/40 border-b border-border/40">
                <tr>
                  <th className="px-5 py-3 font-medium">Platform</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Net</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentLogs.map((log) => (
                  <tr key={log.id} className="border-b border-border/30 hover:bg-background/20 transition-colors">
                    <td className="px-5 py-4 font-semibold text-text">{log.platform}</td>
                    <td className="px-5 py-4 text-text-muted text-xs">{log.date}</td>
                    <td className="px-5 py-4 font-bold text-success">Rs. {log.net.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      {log.status === 'verified' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                          <CheckCircle2 size={11} /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                          <Clock3 size={11} /> Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Commission Transparency Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border border-primary/20 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
            <ShieldAlert className="text-primary" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-text mb-1">Your Effective Commission Rate: <span className="text-accent">14.2%</span></h3>
            <p className="text-sm text-text-muted">
              Based on your verified logs, FoodPanda is deducting 14.2% on average — above the platform average of 12%. AI anomaly detected.
            </p>
          </div>
        </div>
        <Link to="/worker/alerts" className="shrink-0">
          <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary hover:text-white">
            View Alert
          </Button>
        </Link>
      </div>
    </div>
  );
}
