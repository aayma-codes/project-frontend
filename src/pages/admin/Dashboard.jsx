import { Card, CardContent } from '../../components/common/Card';
import { ShieldCheck, Users, Activity, ServerCrash } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const serverHealth = [
  { time: '10:00', requests: 120 },
  { time: '11:00', requests: 250 },
  { time: '12:00', requests: 180 },
  { time: '13:00', requests: 300 },
  { time: '14:00', requests: 450 },
  { time: '15:00', requests: 210 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-text">Admin Dashboard</h1>
        <p className="text-text-muted">System overview and user management.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="text-primary" size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-text-muted mb-1">Total Users</p>
                <h3 className="text-2xl font-bold text-text">1,542</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <ShieldCheck className="text-success" size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-text-muted mb-1">Active Verifiers</p>
                <h3 className="text-2xl font-bold text-text">24</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Activity className="text-accent" size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-text-muted mb-1">API Requests (24h)</p>
                <h3 className="text-2xl font-bold text-text">12.4k</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover className="border-success/30 bg-success/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <ServerCrash className="text-success" size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-success mb-1">System Status</p>
                <h3 className="text-2xl font-bold text-success">Healthy</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="p-6 border-b border-border/50">
          <h3 className="text-lg font-bold text-text">API Traffic</h3>
        </div>
        <div className="h-[300px] w-full p-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={serverHealth}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#6B6B5A', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B6B5A', fontSize: 12 }} />
              <Area type="monotone" dataKey="requests" stroke="#2D5016" fillOpacity={0.1} fill="#2D5016" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
