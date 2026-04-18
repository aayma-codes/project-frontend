import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import { AlertTriangle, TrendingDown, Clock, ShieldAlert } from 'lucide-react';

export default function Alerts() {
  // Mock data representing the Python FastAPI Anomaly Service response
  const [anomalies] = useState([
    {
      id: 1,
      type: 'high_deduction',
      platform: 'FoodPanda',
      date: '2026-04-18',
      description: 'Platform deductions were 35% of gross earnings, which is statistically unusual compared to the 15% average for this zone.',
      severity: 'high',
      status: 'new'
    },
    {
      id: 2,
      type: 'income_drop',
      platform: 'InDrive',
      date: '2026-04-10',
      description: 'Sudden 40% drop in hourly earnings compared to your 30-day moving average, despite working similar hours.',
      severity: 'medium',
      status: 'acknowledged'
    }
  ]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-bold text-text">Anomaly Alerts</h1>
        <p className="text-text-muted">AI-detected irregularities in your earnings and platform deductions.</p>
      </div>

      {anomalies.length === 0 ? (
        <Card className="bg-success/5 border-success/20">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
              <ShieldAlert className="text-success" size={32} />
            </div>
            <h2 className="text-xl font-bold text-success mb-2">No Anomalies Detected</h2>
            <p className="text-success/80 max-w-md">Your earnings patterns look normal. Our AI constantly monitors your logs to ensure platforms are treating you fairly.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {anomalies.map((anomaly) => (
            <Card key={anomaly.id} className={anomaly.severity === 'high' ? 'border-error/30' : 'border-accent/30'}>
              <div className="flex flex-col md:flex-row">
                {/* Icon Column */}
                <div className={`p-6 flex items-center justify-center md:border-r border-border/50 ${anomaly.severity === 'high' ? 'bg-error/5 text-error' : 'bg-accent/5 text-accent'}`}>
                  {anomaly.type === 'high_deduction' ? <AlertTriangle size={32} /> : <TrendingDown size={32} />}
                </div>
                
                {/* Content Column */}
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${anomaly.severity === 'high' ? 'bg-error/10 text-error' : 'bg-accent/10 text-accent'}`}>
                          {anomaly.severity} Severity
                        </span>
                        <span className="text-sm font-medium text-text-muted flex items-center gap-1">
                          <Clock size={14} /> {anomaly.date}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-text">
                        {anomaly.type === 'high_deduction' ? 'Unusual Platform Deduction' : 'Sudden Income Drop'} ({anomaly.platform})
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-text-muted mt-2 leading-relaxed">
                    <strong className="text-text">AI Analysis:</strong> {anomaly.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {anomaly.status === 'new' && (
                      <Button size="sm" variant="outline" className={anomaly.severity === 'high' ? 'border-error text-error hover:bg-error hover:text-white' : ''}>
                        Acknowledge
                      </Button>
                    )}
                    <Button size="sm" variant="secondary">
                      File Grievance
                    </Button>
                    <Button size="sm" variant="ghost">
                      View Shift Details
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
