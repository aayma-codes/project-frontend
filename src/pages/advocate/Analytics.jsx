import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { BarChart3, MapPin } from 'lucide-react';
import Button from '../../components/common/Button';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const commissionData = [
  { month: 'Jan', foodpanda: 15, indrive: 10, bykea: 12 },
  { month: 'Feb', foodpanda: 15, indrive: 10, bykea: 12 },
  { month: 'Mar', foodpanda: 18, indrive: 12, bykea: 12 },
  { month: 'Apr', foodpanda: 20, indrive: 15, bykea: 14 },
];

// City zone data for map — Lahore zones
const zoneData = [
  { name: 'Gulberg', lat: 31.5204, lng: 74.3587, avgEarnings: 3800, workers: 142, incomeChange: -12, color: '#C0392B' },
  { name: 'DHA Phase 5', lat: 31.4697, lng: 74.4012, avgEarnings: 4200, workers: 98, incomeChange: +5, color: '#2D5016' },
  { name: 'Johar Town', lat: 31.4697, lng: 74.2728, avgEarnings: 2900, workers: 210, incomeChange: -22, color: '#C0392B' },
  { name: 'Model Town', lat: 31.4831, lng: 74.3368, avgEarnings: 3500, workers: 87, incomeChange: -3, color: '#8B6914' },
  { name: 'Bahria Town', lat: 31.3649, lng: 74.1980, avgEarnings: 4500, workers: 65, incomeChange: +8, color: '#2D5016' },
  { name: 'Iqbal Town', lat: 31.5133, lng: 74.2987, avgEarnings: 2600, workers: 175, incomeChange: -31, color: '#C0392B' },
];

export default function AdvocateAnalytics() {
  const [cityZone, setCityZone] = useState('All');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text">Analytics Panel</h1>
          <p className="text-text-muted">Platform commission trends and income distribution across city zones.</p>
        </div>
        <div className="flex gap-2">
          <select
            value={cityZone}
            onChange={(e) => setCityZone(e.target.value)}
            className="px-4 py-2 bg-surface border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="All">All Zones</option>
            <option value="Gulberg">Gulberg</option>
            <option value="DHA Phase 5">DHA Phase 5</option>
            <option value="Johar Town">Johar Town</option>
          </select>
          <Button variant="outline" className="bg-surface">Export</Button>
        </div>
      </div>

      {/* Commission Rate Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="text-primary" />
            <CardTitle>Platform Commission Rate Tracker (%)</CardTitle>
          </div>
          <p className="text-sm text-text-muted mt-1">Aggregated from worker-submitted gross vs net earnings across all zones.</p>
        </CardHeader>
        <CardContent>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={commissionData} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6B6B5A', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B6B5A', fontSize: 12 }} unit="%" />
                <RechartsTooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                  formatter={(v) => [`${v}%`]}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Line type="monotone" dataKey="foodpanda" name="FoodPanda" stroke="#2D5016" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="indrive" name="InDrive" stroke="#8B6914" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="bykea" name="Bykea" stroke="#6B6B5A" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* City Zone Map */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="text-primary" />
            <CardTitle>Income Volatility by City Zone</CardTitle>
          </div>
          <p className="text-sm text-text-muted mt-1">
            Circle size = number of workers. <span className="text-error font-medium">Red = income drop</span>, <span className="text-success font-medium">Green = growth</span>. Click a zone for details.
          </p>
        </CardHeader>
        <CardContent className="p-0 rounded-b-2xl overflow-hidden">
          <div className="h-[450px] w-full">
            <MapContainer
              center={[31.4833, 74.3209]}
              zoom={12}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {zoneData.map(zone => (
                <Circle
                  key={zone.name}
                  center={[zone.lat, zone.lng]}
                  radius={zone.workers * 12}
                  pathOptions={{
                    color: zone.color,
                    fillColor: zone.color,
                    fillOpacity: 0.45,
                    weight: 2,
                  }}
                >
                  <Popup>
                    <div className="text-sm min-w-[180px]">
                      <h3 className="font-bold text-base mb-2">{zone.name}</h3>
                      <div className="space-y-1">
                        <p><span className="font-medium">Avg. Earnings:</span> Rs. {zone.avgEarnings.toLocaleString()}</p>
                        <p><span className="font-medium">Workers:</span> {zone.workers}</p>
                        <p>
                          <span className="font-medium">MoM Change:</span>{' '}
                          <span style={{ color: zone.incomeChange < 0 ? '#C0392B' : '#27AE60', fontWeight: 700 }}>
                            {zone.incomeChange > 0 ? '+' : ''}{zone.incomeChange}%
                          </span>
                        </p>
                      </div>
                    </div>
                  </Popup>
                </Circle>
              ))}
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      {/* Zone Stats Table */}
      <Card>
        <CardHeader>
          <CardTitle>Zone Summary Table</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-muted uppercase bg-background/50 border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-medium">Zone</th>
                <th className="px-6 py-4 font-medium">Workers</th>
                <th className="px-6 py-4 font-medium">Avg. Earnings</th>
                <th className="px-6 py-4 font-medium">MoM Change</th>
                <th className="px-6 py-4 font-medium">Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {zoneData.map(zone => (
                <tr key={zone.name} className="border-b border-border/40 hover:bg-background/30 transition-colors">
                  <td className="px-6 py-3 font-semibold text-text flex items-center gap-2 mt-1">
                    <MapPin size={14} className="text-primary" /> {zone.name}
                  </td>
                  <td className="px-6 py-3 text-text-muted">{zone.workers}</td>
                  <td className="px-6 py-3 font-bold text-text">Rs. {zone.avgEarnings.toLocaleString()}</td>
                  <td className="px-6 py-3">
                    <span className={`font-bold ${zone.incomeChange < 0 ? 'text-error' : 'text-success'}`}>
                      {zone.incomeChange > 0 ? '+' : ''}{zone.incomeChange}%
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${zone.incomeChange <= -20 ? 'bg-error/10 text-error' : zone.incomeChange < 0 ? 'bg-accent/10 text-accent' : 'bg-success/10 text-success'}`}>
                      {zone.incomeChange <= -20 ? 'High Risk' : zone.incomeChange < 0 ? 'Moderate' : 'Stable'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
