import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, AlertTriangle, TrendingDown, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdvocateDashboard() {
  const [summary, setSummary] = useState(null);
  const [topComplaints, setTopComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [summaryRes, complaintsRes] = await Promise.all([
        api.get('/api/analytics/dashboard-summary'),
        api.get('/api/analytics/top-complaints?days=30')
      ]);
      setSummary(summaryRes.data);
      setTopComplaints(complaintsRes.data || []);
    } catch (error) {
      toast.error('Failed to load advocate dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center font-display text-text-muted">Loading Advocate Dashboard...</div>;

  const grievanceData = [
    { name: 'Week 1', count: 12 },
    { name: 'Week 2', count: 18 },
    { name: 'Week 3', count: 14 },
    { name: 'Week 4', count: 28 },
  ];
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text">Advocate Dashboard</h1>
          <p className="text-text-muted">Monitor systemic unfairness and platform grievance trends.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hover>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-text-muted mb-1">Total Workers</p>
                <h3 className="text-2xl font-bold text-text">{summary?.total_workers || 0}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="text-primary" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-text-muted mb-1">Open Grievances</p>
                <h3 className="text-2xl font-bold text-text">{summary?.open_grievances || 0}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <AlertTriangle className="text-accent" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Link to="/advocate/vulnerable">
          <Card hover className="h-full border-error/30 bg-error/5 cursor-pointer">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-error mb-1">Vulnerable Workers</p>
                  <h3 className="text-2xl font-bold text-error">{summary?.vulnerable_count || '...'}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center">
                  <TrendingDown className="text-error" size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card hover>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-text-muted mb-1">Avg. Commission</p>
                <h3 className="text-2xl font-bold text-text">{summary?.average_commission_rate || 0}%</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                <FileText className="text-success" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Grievance Trend (Monthly)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={grievanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGrievance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C0392B" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#C0392B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B6B5A', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B6B5A', fontSize: 12 }} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                    itemStyle={{ fontWeight: 500 }}
                  />
                  <Area type="monotone" dataKey="count" name="Complaints" stroke="#C0392B" strokeWidth={3} fillOpacity={1} fill="url(#colorGrievance)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Complaint Categories</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topComplaints} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="category" type="category" width={100} axisLine={false} tickLine={false} tick={{ fill: '#1A1A0F', fontSize: 12, fontWeight: 500 }} />
                    <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 14px rgba(0,0,0,0.05)' }} />
                    <Bar dataKey="count" name="Complaints" fill="#2D5016" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
