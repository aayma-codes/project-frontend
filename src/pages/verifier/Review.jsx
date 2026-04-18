import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import { CheckCircle2, XCircle, ArrowLeft, ZoomIn, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReviewSubmission() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isApproving, setIsApproving] = useState(false);
  const [isDisputing, setIsDisputing] = useState(false);

  // Mock data for the specific submission
  const submission = {
    id,
    worker: 'Ahmad Khan',
    platform: 'InDrive',
    date: '2026-04-17',
    hours: 4.5,
    gross: 3000,
    ded: 600,
    net: 2400,
    notes: 'Heavy traffic on Mall road, took longer.',
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // Placeholder for app screenshot
  };

  const handleApprove = () => {
    setIsApproving(true);
    setTimeout(() => {
      toast.success('Earnings verified successfully!');
      navigate('/verifier/dashboard');
    }, 1000);
  };

  const handleDispute = () => {
    setIsDisputing(true);
    setTimeout(() => {
      toast.error('Earnings marked as disputed. Worker notified.');
      navigate('/verifier/dashboard');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/verifier/dashboard" className="p-2 bg-surface border border-border/50 rounded-xl hover:bg-background transition-colors">
          <ArrowLeft size={20} className="text-text-muted" />
        </Link>
        <div>
          <h1 className="text-2xl font-display font-bold text-text">Review Submission #{id}</h1>
          <p className="text-text-muted">Compare the worker's logged data against the provided screenshot.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {/* Left Col - Data */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Claimed Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-background/50 rounded-xl border border-border/50">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                  {submission.worker.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-text">{submission.worker}</p>
                  <p className="text-sm text-text-muted">Worker ID: WK-8932</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-surface border border-border/50 rounded-xl">
                  <p className="text-xs text-text-muted font-bold uppercase mb-1">Platform</p>
                  <p className="font-medium text-text">{submission.platform}</p>
                </div>
                <div className="p-4 bg-surface border border-border/50 rounded-xl">
                  <p className="text-xs text-text-muted font-bold uppercase mb-1">Date</p>
                  <p className="font-medium text-text">{submission.date}</p>
                </div>
                <div className="p-4 bg-surface border border-border/50 rounded-xl">
                  <p className="text-xs text-text-muted font-bold uppercase mb-1">Hours</p>
                  <p className="font-medium text-text">{submission.hours}h</p>
                </div>
                <div className="p-4 bg-surface border border-border/50 rounded-xl">
                  <p className="text-xs text-text-muted font-bold uppercase mb-1">Gross Earned</p>
                  <p className="font-medium text-text">Rs. {submission.gross}</p>
                </div>
                <div className="p-4 bg-error/5 border border-error/20 rounded-xl">
                  <p className="text-xs text-error font-bold uppercase mb-1">Deductions</p>
                  <p className="font-medium text-error">-Rs. {submission.ded}</p>
                </div>
                <div className="p-4 bg-success/5 border border-success/20 rounded-xl">
                  <p className="text-xs text-success font-bold uppercase mb-1">Net Received</p>
                  <p className="font-bold text-success text-xl">Rs. {submission.net}</p>
                </div>
              </div>

              {submission.notes && (
                <div className="p-4 bg-background rounded-xl border border-border/50">
                  <p className="text-xs text-text-muted font-bold uppercase mb-1">Worker Notes</p>
                  <p className="text-sm text-text italic">"{submission.notes}"</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-primary">
            <CardContent className="p-6">
              <h3 className="font-bold text-text mb-4 text-lg">Verification Action</h3>
              <p className="text-sm text-text-muted mb-6">Carefully verify that the Net Received (Rs. {submission.net}) matches the final payout shown in the screenshot.</p>
              
              <div className="flex gap-4">
                <Button 
                  onClick={handleApprove} 
                  isLoading={isApproving} 
                  disabled={isDisputing}
                  className="flex-1 bg-success hover:bg-[#219653]"
                >
                  <CheckCircle2 size={20} className="mr-2" /> Approve
                </Button>
                <Button 
                  onClick={handleDispute} 
                  isLoading={isDisputing} 
                  disabled={isApproving}
                  variant="outline"
                  className="flex-1 border-error text-error hover:bg-error hover:text-white"
                >
                  <XCircle size={20} className="mr-2" /> Dispute
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col - Screenshot */}
        <div className="h-full">
          <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Platform Screenshot</CardTitle>
              <Button size="sm" variant="ghost">
                <ZoomIn size={18} />
              </Button>
            </CardHeader>
            <CardContent className="flex-1 p-0 bg-background/50 relative group overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <img 
                  src={submission.imageUrl} 
                  alt="Earnings Proof" 
                  className="max-h-[600px] object-contain rounded-xl shadow-lg border border-border/50 group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
