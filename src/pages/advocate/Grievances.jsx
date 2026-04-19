import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Layers, ChevronUp, Tag, Clock, CheckCircle2, Users, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { grievanceApi } from '../../services/api';

const STATUS_CONFIG = {
  open: { label: 'Open', color: 'bg-accent/10 text-accent border-accent/20', dot: 'bg-accent' },
  escalated: { label: 'Escalated', color: 'bg-error/10 text-error border-error/20', dot: 'bg-error' },
  resolved: { label: 'Resolved', color: 'bg-success/10 text-success border-success/20', dot: 'bg-success' },
};

const CAT_COLORS = {
  'Sudden Rate Cut': 'bg-error/10 text-error',
  'Unfair Deduction': 'bg-error/10 text-error',
  'Account Suspended': 'bg-accent/10 text-accent',
  'Rate Intelligence': 'bg-primary/10 text-primary',
};

const clusters = [
  { label: 'Rate Cuts', platform: 'FoodPanda + InDrive', count: 3, grievanceIds: [1, 2, 4], colorClass: 'border-l-red-500' },
  { label: 'Unjust Deductions', platform: 'FoodPanda + Bykea', count: 2, grievanceIds: [3, 6], colorClass: 'border-l-amber-500' },
  { label: 'Suspension Issues', platform: 'Careem', count: 1, grievanceIds: [5], colorClass: 'border-l-green-700' },
];

export default function AdvocateGrievances() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPlatform, setFilterPlatform] = useState('All');
  const [selectedCluster, setSelectedCluster] = useState(null);

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      const response = await grievanceApi.get('/api/grievances');
      setGrievances(response.data);
    } catch (error) {
      toast.error('Failed to load grievances');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      if (newStatus === 'escalated') {
        await grievanceApi.post(`/api/grievances/${id}/escalate`);
      } else if (newStatus === 'resolved') {
        await grievanceApi.put(`/api/grievances/${id}/resolve`, { resolution_notes: 'Issue resolved by advocate' });
      }
      toast.success(`Grievance marked as "${newStatus}"`);
      fetchGrievances();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleCluster = async () => {
    try {
      await grievanceApi.post('/api/grievances/cluster');
      toast.success('Grievances clustered successfully');
      fetchGrievances();
    } catch (error) {
      toast.error('Failed to cluster grievances');
    }
  };

  const filtered = grievances.filter(g => {
    const matchStatus = filterStatus === 'All' || g.status === filterStatus;
    const matchPlat = filterPlatform === 'All' || g.platform === filterPlatform;
    const matchCluster = !selectedCluster || selectedCluster.grievanceIds.includes(g.id);
    return matchStatus && matchPlat && matchCluster;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text flex items-center gap-3">
            <Layers className="text-primary" /> Grievance Management
          </h1>
          <p className="text-text-muted mt-1">Cluster, escalate, and resolve systemic issues reported by workers.</p>
        </div>
      </div>

      {/* Cluster Cards */}
      <div>
        <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-3">Systemic Clusters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {clusters.map(cluster => (
            <motion.button
              key={cluster.label}
              whileHover={{ y: -3 }}
              onClick={() => setSelectedCluster(selectedCluster?.label === cluster.label ? null : cluster)}
              className={`text-left p-5 rounded-2xl bg-surface border-2 border-l-4 transition-all ${cluster.colorClass} ${selectedCluster?.label === cluster.label ? 'ring-2 ring-primary bg-primary/5' : 'border-border/40 hover:border-primary/40'}`}
            >
              <p className="font-bold text-text text-base mb-1">{cluster.label}</p>
              <p className="text-xs text-text-muted mb-3">Platforms: {cluster.platform}</p>
              <div className="flex items-center gap-2">
                <Users size={14} className="text-primary" />
                <span className="text-sm font-bold text-primary">{cluster.count} linked grievances</span>
              </div>
            </motion.button>
          ))}
        </div>
        {selectedCluster && (
          <div className="mt-2 flex items-center gap-2 text-sm text-primary font-medium">
            <span>Filtering by cluster: <strong>{selectedCluster.label}</strong></span>
            <button className="underline text-text-muted ml-2" onClick={() => setSelectedCluster(null)}>Clear</button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <Filter size={16} className="text-text-muted" />
        {['All', 'open', 'escalated', 'resolved'].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize border transition-all ${filterStatus === s ? 'bg-primary text-white border-primary' : 'bg-surface text-text-muted border-border/50 hover:border-primary/50'}`}
          >
            {s === 'All' ? 'All Status' : s}
          </button>
        ))}
        <select
          value={filterPlatform}
          onChange={e => setFilterPlatform(e.target.value)}
          className="px-3 py-1.5 bg-surface border border-border/50 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 ml-2"
        >
          <option value="All">All Platforms</option>
          {['FoodPanda', 'InDrive', 'Careem', 'Bykea', 'Uber'].map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* Grievance List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map(g => {
            const statusConf = STATUS_CONFIG[g.status];
            return (
              <motion.div key={g.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Card hover className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex items-stretch">
                      <div className="flex flex-col items-center justify-center gap-1 px-4 bg-background/40 border-r border-border/30 min-w-[56px]">
                        <ChevronUp size={16} className="text-text-muted" />
                        <span className="font-bold text-sm text-text">{g.upvotes}</span>
                      </div>
                      <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className="text-xs font-bold text-text">{g.platform}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${CAT_COLORS[g.category] || 'bg-primary/10 text-primary'}`}>
                              <Tag size={9} /> {g.category}
                            </span>
                            <span className="text-xs text-text-muted">📍 {g.city}</span>
                          </div>
                          <h3 className="font-semibold text-text text-sm">{g.title}</h3>
                          <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
                            <Users size={11} /> {g.workers} workers reported this
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${statusConf.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusConf.dot}`} />
                            {statusConf.label}
                          </span>
                          {g.status === 'open' && (
                            <button onClick={() => updateStatus(g.id, 'escalated')}
                              className="text-xs px-3 py-1 rounded-lg border border-error/30 bg-error/10 text-error hover:bg-error hover:text-white transition-colors font-medium">
                              Escalate
                            </button>
                          )}
                          {g.status === 'escalated' && (
                            <button onClick={() => updateStatus(g.id, 'resolved')}
                              className="text-xs px-3 py-1 rounded-lg border border-success/30 bg-success/10 text-success hover:bg-success hover:text-white transition-colors font-medium flex items-center gap-1">
                              <CheckCircle2 size={12} /> Resolve
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-text-muted">
            <Layers size={44} className="mx-auto mb-4 opacity-20" />
            <p>No grievances match the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
