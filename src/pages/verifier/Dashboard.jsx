import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import { ShieldCheck, Clock, FileImage, Search, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock Data
const pendingReviews = [
  { id: '102', worker: 'Ahmad Khan', platform: 'InDrive', date: '2026-04-17', gross: 3000, ded: 600, net: 2400, submitted: '2 hours ago' },
  { id: '107', worker: 'Bilal Ahmed', platform: 'Careem', date: '2026-04-12', gross: 2500, ded: 500, net: 2000, submitted: '5 hours ago' },
  { id: '109', worker: 'Zainab Ali', platform: 'FoodPanda', date: '2026-04-18', gross: 4200, ded: 420, net: 3780, submitted: '1 day ago' },
];

export default function VerifierDashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text">Verifier Dashboard</h1>
          <p className="text-text-muted">Review submitted earnings and verify screenshots.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary text-white border-none">
          <CardContent className="p-6">
            <ShieldCheck size={32} className="mb-4 opacity-80" />
            <h3 className="text-3xl font-bold mb-1">2,450</h3>
            <p className="text-white/80 font-medium">Total Logs Verified</p>
          </CardContent>
        </Card>
        <Card className="bg-accent text-white border-none">
          <CardContent className="p-6">
            <Clock size={32} className="mb-4 opacity-80" />
            <h3 className="text-3xl font-bold mb-1">3</h3>
            <p className="text-white/80 font-medium">Pending Reviews</p>
          </CardContent>
        </Card>
        <Card className="bg-error text-white border-none">
          <CardContent className="p-6">
            <AlertCircle size={32} className="mb-4 opacity-80" />
            <h3 className="text-3xl font-bold mb-1">12</h3>
            <p className="text-white/80 font-medium">Disputed This Week</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>Verification Queue</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Search by worker..."
            />
          </div>
        </CardHeader>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-muted uppercase bg-background/50 border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-medium">Worker</th>
                <th className="px-6 py-4 font-medium">Platform & Date</th>
                <th className="px-6 py-4 font-medium">Claimed Net</th>
                <th className="px-6 py-4 font-medium">Submitted</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingReviews.filter(r => r.worker.toLowerCase().includes(searchTerm.toLowerCase())).map((review) => (
                <tr key={review.id} className="border-b border-border/50 hover:bg-background/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-text">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {review.worker.charAt(0)}
                      </div>
                      {review.worker}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-text">{review.platform}</div>
                    <div className="text-xs text-text-muted">{review.date}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-success">Rs. {review.net}</td>
                  <td className="px-6 py-4 text-text-muted text-xs flex items-center gap-1 mt-2">
                    <FileImage size={14} className="text-accent" /> {review.submitted}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/verifier/review/${review.id}`}>
                      <Button size="sm">
                        Review <ArrowRight size={16} className="ml-1" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
              {pendingReviews.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-text-muted">
                    <ShieldCheck size={40} className="mx-auto mb-3 opacity-30" />
                    No pending reviews in the queue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
