import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import { AlertTriangle, ArrowDownRight, MessageSquare, Phone } from 'lucide-react';

const vulnerableWorkers = [
  { id: 'WK-1042', name: 'Zeeshan Ahmed', drop: 35, primaryPlatform: 'InDrive', recentGrievances: 2, contact: '+92 300 1234567' },
  { id: 'WK-892', name: 'Ali Raza', drop: 28, primaryPlatform: 'FoodPanda', recentGrievances: 0, contact: '+92 333 9876543' },
  { id: 'WK-2051', name: 'Kamran Shah', drop: 22, primaryPlatform: 'Bykea', recentGrievances: 1, contact: '+92 321 4567890' },
];

export default function VulnerableWorkers() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-error/10 border border-error/20 rounded-2xl p-6 flex items-start gap-4">
        <div className="p-3 bg-error/20 text-error rounded-xl shrink-0">
          <AlertTriangle size={28} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-error mb-2">Vulnerability Flag active</h2>
          <p className="text-text">
            These workers have experienced an income drop of <strong>more than 20% month-on-month</strong> based on their verified earnings logs. Advocates should reach out to understand if this is due to unfair algorithm de-prioritization or systemic issues.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {vulnerableWorkers.map((worker) => (
          <Card key={worker.id} className="border-error/20 hover:border-error/40 transition-colors">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-error/10 flex items-center justify-center text-xl text-error font-bold">
                    {worker.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text flex items-center gap-2">
                      {worker.name}
                      <span className="text-xs font-bold px-2 py-0.5 bg-background border border-border/50 rounded-full text-text-muted">
                        {worker.id}
                      </span>
                    </h3>
                    <p className="text-sm text-text-muted mt-1">Primary: {worker.primaryPlatform}</p>
                  </div>
                </div>

                <div className="flex flex-col md:items-end gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-text-muted">MoM Drop:</span>
                    <span className="flex items-center text-lg font-bold text-error bg-error/10 px-3 py-1 rounded-lg">
                      <ArrowDownRight size={18} className="mr-1" /> {worker.drop}%
                    </span>
                  </div>
                  {worker.recentGrievances > 0 && (
                    <span className="text-xs font-medium text-accent">
                      Has {worker.recentGrievances} recent grievance(s)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Button variant="outline" className="flex-1 md:flex-none">
                    <MessageSquare size={16} className="mr-2" /> Message
                  </Button>
                  <Button variant="primary" className="flex-1 md:flex-none">
                    <Phone size={16} className="mr-2" /> Call
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
