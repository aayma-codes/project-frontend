import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import {
  MessageSquareWarning, Plus, X, Tag, Clock,
  AlertTriangle, TrendingDown, Ban, Star, ChevronUp
} from 'lucide-react';
import { grievanceApi } from '../../services/api';
import toast from 'react-hot-toast';

// ... categories and platforms stay same ...

export default function Grievances() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterPlatform, setFilterPlatform] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [form, setForm] = useState({ platform: '', category: '', title: '', description: '', city: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      const response = await grievanceApi.get('/api/grievances/my');
      setPosts(response.data);
    } catch (error) {
      toast.error('Failed to load grievances');
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = (id) => {
    // Teammate didn't specify upvote endpoint, keeping local for UI feedback
    setPosts(posts.map(p =>
      p.id === id ? { ...p, upvotes: (p.upvotes || 0) + 1, upvoted: true } : p
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.platform || !form.category || !form.title || !form.description) {
      toast.error('Please fill all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      await grievanceApi.post('/api/grievances', {
        platform: form.platform,
        category: form.category,
        title: form.title,
        description: form.description,
        city: form.city
      });
      toast.success('Your grievance has been posted anonymously.');
      setShowModal(false);
      setForm({ platform: '', category: '', title: '', description: '', city: '' });
      fetchGrievances();
    } catch (error) {
      toast.error('Failed to post grievance');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = posts.filter(p => {
    const matchPlat = filterPlatform === 'All' || p.platform === filterPlatform;
    const matchCat = filterCategory === 'All' || p.category === filterCategory;
    return matchPlat && matchCat;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text flex items-center gap-3">
            <MessageSquareWarning className="text-primary" /> Grievance Board
          </h1>
          <p className="text-text-muted mt-1">Anonymous space to report unfair platform practices and share rate intelligence with fellow workers.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="shrink-0">
          <Plus size={18} className="mr-2" /> Post Grievance
        </Button>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 px-4 py-3 bg-primary/5 border border-primary/20 rounded-xl text-sm text-primary">
        <AlertTriangle size={18} className="mt-0.5 shrink-0" />
        <span>All posts are <strong>100% anonymous</strong>. Your name or account details are never stored with your post. Upvote posts to surface the most common issues to advocates.</span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filterPlatform}
          onChange={e => setFilterPlatform(e.target.value)}
          className="px-4 py-2 bg-surface border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="All">All Platforms</option>
          {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="px-4 py-2 bg-surface border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map(c => <option key={c.label} value={c.label}>{c.label}</option>)}
        </select>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        <AnimatePresence>
          {filtered.map(post => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Card hover className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    {/* Upvote Column */}
                    <div className="flex flex-col items-center gap-1 px-4 py-5 bg-background/40 border-r border-border/40 min-w-[60px]">
                      <button
                        onClick={() => handleUpvote(post.id)}
                        className={`p-1.5 rounded-lg transition-colors ${post.upvoted ? 'text-primary bg-primary/10' : 'text-text-muted hover:text-primary hover:bg-primary/10'}`}
                      >
                        <ChevronUp size={20} />
                      </button>
                      <span className={`font-bold text-sm ${post.upvoted ? 'text-primary' : 'text-text'}`}>{post.upvotes}</span>
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 p-5">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="font-bold text-xs px-2.5 py-1 rounded-full bg-background border border-border/60 text-text">{post.platform}</span>
                        <span className={`font-medium text-xs px-2.5 py-1 rounded-full flex items-center gap-1 ${post.categoryColor}`}>
                          <Tag size={10} /> {post.category}
                        </span>
                        <span className="text-xs text-text-muted ml-auto flex items-center gap-1"><Clock size={12} />{post.time}</span>
                      </div>

                      <h3 className="font-bold text-text text-base mb-2 leading-snug">{post.title}</h3>
                      <p className="text-sm text-text-muted leading-relaxed">{post.body}</p>

                      <div className="flex items-center gap-3 mt-4 text-xs text-text-muted">
                        <span>📍 {post.city}</span>
                        <span>·</span>
                        <span>Posted by <span className="font-mono text-text">{post.author}</span></span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-text-muted">
            <MessageSquareWarning size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-medium">No posts match the current filters.</p>
          </div>
        )}
      </div>

      {/* Post Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-text/60 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-surface rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 40 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div className="flex items-center justify-between p-6 border-b border-border/50">
                <h2 className="text-xl font-bold text-text">Post a Grievance</h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-xl text-text-muted hover:bg-background hover:text-error transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="p-3 rounded-xl bg-success/5 border border-success/20 text-xs text-success font-medium">
                  🔒 This post will be completely anonymous. No personal data is attached.
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-muted">Platform *</label>
                    <select required value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                      <option value="">Select...</option>
                      {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-muted">Category *</label>
                    <select required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                      <option value="">Select...</option>
                      {CATEGORIES.map(c => <option key={c.label} value={c.label}>{c.label}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-muted">Title *</label>
                  <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="Short, clear description of the issue..."
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-muted">Details *</label>
                  <textarea required value={form.body} onChange={e => setForm({ ...form, body: e.target.value })}
                    placeholder="Describe exactly what happened, when, and what data you have..."
                    rows={4}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-muted">City / Zone (optional)</label>
                  <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                    placeholder="e.g. Lahore — Gulberg"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>

                <div className="pt-2 flex gap-3">
                  <Button type="button" variant="ghost" fullWidth onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button type="submit" fullWidth isLoading={submitting}>Post Anonymously</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
