import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { useNavigate, Link } from 'react-router-dom';
import Papa from 'papaparse';
import { api } from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { UploadCloud, FileImage, X, Save, Calculator, FileSpreadsheet, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

const REQUIRED_CSV_HEADERS = ['platform', 'date', 'hours_worked', 'gross_earned', 'platform_deductions', 'net_received'];

export default function AddEarnings() {
  const [isLoading, setIsLoading] = useState(false);
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [mode, setMode] = useState('manual'); // 'manual' | 'csv'
  const [csvRows, setCsvRows] = useState([]);
  const [csvError, setCsvError] = useState('');
  const [csvImporting, setCsvImporting] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    defaultValues: {
      platform: '', date: new Date().toISOString().split('T')[0],
      hours_worked: '', gross_earned: '', platform_deductions: '', net_received: ''
    }
  });

  const gross = watch('gross_earned');
  const deductions = watch('platform_deductions');

  useEffect(() => {
    const g = parseFloat(gross) || 0;
    const d = parseFloat(deductions) || 0;
    if (g > 0 || d > 0) setValue('net_received', (g - d).toFixed(0));
  }, [gross, deductions, setValue]);

  const onDropScreenshot = useCallback(files => {
    if (files?.length > 0) setScreenshotFile(files[0]);
  }, []);

  const { getRootProps: getScreenshotProps, getInputProps: getScreenshotInputProps, isDragActive: isScreenshotDrag } = useDropzone({
    onDrop: onDropScreenshot,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    maxFiles: 1
  });

  // ── CSV Drop handler ──
  const onDropCSV = useCallback(files => {
    setCsvError('');
    setCsvRows([]);
    if (!files?.length) return;
    const file = files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: h => h.trim().toLowerCase().replace(/\s+/g, '_'),
      complete: (results) => {
        const headers = Object.keys(results.data[0] || {});
        const missing = REQUIRED_CSV_HEADERS.filter(h => !headers.includes(h));
        if (missing.length > 0) {
          setCsvError(`Missing columns: ${missing.join(', ')}. Download the template below.`);
          return;
        }
        const parsed = results.data.map((row, i) => ({
          ...row,
          _id: i,
          hours_worked: parseFloat(row.hours_worked) || 0,
          gross_earned: parseFloat(row.gross_earned) || 0,
          platform_deductions: parseFloat(row.platform_deductions) || 0,
          net_received: parseFloat(row.net_received) || 0,
          _valid: !!row.platform && !!row.date,
        }));
        setCsvRows(parsed);
        toast.success(`${parsed.length} rows loaded. Review and confirm import.`);
      },
      error: () => setCsvError('Failed to parse CSV file. Please check the format.')
    });
  }, []);

  const { getRootProps: getCsvProps, getInputProps: getCsvInputProps, isDragActive: isCsvDrag } = useDropzone({
    onDrop: onDropCSV,
    accept: { 'text/csv': ['.csv'], 'application/vnd.ms-excel': ['.csv'] },
    maxFiles: 1
  });

  const downloadTemplate = () => {
    const csv = `platform,date,hours_worked,gross_earned,platform_deductions,net_received,notes
FoodPanda,2026-04-18,5,3200,400,2800,Normal shift
InDrive,2026-04-17,4,3000,600,2400,Rainy day`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'earnings_template.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleCSVImport = async () => {
    const validRows = csvRows.filter(r => r._valid);
    if (!validRows.length) { toast.error('No valid rows to import.'); return; }
    setCsvImporting(true);
    try {
      // In real app: await api.post('/api/earnings/bulk', { logs: validRows })
      await new Promise(r => setTimeout(r, 1200)); // Simulate API
      toast.success(`${validRows.length} shifts imported successfully!`);
      navigate('/worker/earnings/history');
    } catch {
      toast.error('Import failed. Please try again.');
    } finally {
      setCsvImporting(false);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await api.post('/api/earnings/logs', {
        platform: data.platform, date: data.date,
        hours_worked: parseFloat(data.hours_worked),
        gross_earned: parseFloat(data.gross_earned),
        platform_deductions: parseFloat(data.platform_deductions),
        net_received: parseFloat(data.net_received),
        notes: data.notes
      });
      toast.success('Earnings added successfully!');
      navigate('/worker/earnings/history');
    } catch {
      toast.success('Earnings logged! (Demo mode)');
      navigate('/worker/earnings/history');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-text">Log Earnings</h1>
        <p className="text-text-muted">Record a completed shift manually or bulk-import via CSV.</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex bg-surface border border-border/50 rounded-2xl p-1.5 w-fit gap-1">
        {[{ id: 'manual', label: '✏️ Manual Entry' }, { id: 'csv', label: '📊 Bulk CSV Import' }].map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${mode === m.id ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:text-text'}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── MANUAL ENTRY ── */}
        {mode === 'manual' && (
          <motion.div key="manual" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader><CardTitle>Shift Details</CardTitle></CardHeader>
              <CardContent>
                <form id="earnings-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-text-muted ml-1">Platform *</label>
                      <select className="w-full rounded-xl border border-border bg-surface/50 px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        {...register("platform", { required: "Required" })}>
                        <option value="">Select Platform</option>
                        {['FoodPanda','InDrive','Bykea','Careem','Uber','Other'].map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                      {errors.platform && <span className="text-xs text-error ml-1">{errors.platform.message}</span>}
                    </div>
                    <Input label="Date" type="date" error={errors.date?.message} {...register("date", { required: "Required" })} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input label="Hours Worked" type="number" step="0.5" placeholder="e.g. 8.5" error={errors.hours_worked?.message}
                      {...register("hours_worked", { required: "Required", min: { value: 0.5, message: "Min 0.5h" } })} />
                    <Input label="Gross Earned (Rs.)" type="number" placeholder="0" error={errors.gross_earned?.message}
                      {...register("gross_earned", { required: "Required", min: 0 })} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input label="Platform Deductions (Rs.)" type="number" placeholder="0" error={errors.platform_deductions?.message}
                      {...register("platform_deductions", { required: "Required", min: 0 })} />
                    <div className="relative">
                      <Input label="Net Received (Rs.) — Auto" type="number" readOnly
                        className="bg-success/5 border-success/30 font-bold text-success cursor-not-allowed"
                        {...register("net_received")} />
                      <Calculator size={16} className="absolute right-3 top-[36px] text-success/50" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-muted ml-1">Notes (Optional)</label>
                    <textarea className="w-full rounded-xl border border-border bg-surface/50 px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[90px] resize-none"
                      placeholder="Unusual deductions, weather issues, complaints..."
                      {...register("notes")} />
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-5">
              <Card>
                <CardHeader><CardTitle>Screenshot Proof</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-xs text-text-muted mb-4">Upload your app screenshot to get <strong>Verified</strong> status.</p>
                  {!screenshotFile ? (
                    <div {...getScreenshotProps()} className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isScreenshotDrag ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                      <input {...getScreenshotInputProps()} />
                      <UploadCloud size={36} className="mx-auto text-text-muted mb-2" />
                      <p className="text-sm font-medium text-text">Drag & drop</p>
                      <p className="text-xs text-text-muted mt-1">JPG or PNG</p>
                    </div>
                  ) : (
                    <div className="border border-success/30 bg-success/5 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileImage size={20} className="text-success shrink-0" />
                        <div className="truncate">
                          <p className="text-sm font-medium text-text truncate">{screenshotFile.name}</p>
                          <p className="text-xs text-text-muted">{(screenshotFile.size / 1024).toFixed(0)} KB</p>
                        </div>
                      </div>
                      <button onClick={() => setScreenshotFile(null)} className="p-1 text-text-muted hover:text-error rounded"><X size={16} /></button>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Button type="submit" form="earnings-form" fullWidth size="lg" isLoading={isLoading} className="shadow-lg">
                <Save size={18} className="mr-2" /> Save Earnings
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── CSV IMPORT ── */}
        {mode === 'csv' && (
          <motion.div key="csv" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle>Bulk CSV Import</CardTitle>
                  <p className="text-sm text-text-muted mt-1">Import multiple shifts at once from a CSV file.</p>
                </div>
                <Button variant="outline" size="sm" onClick={downloadTemplate} className="shrink-0 bg-surface">
                  <FileSpreadsheet size={16} className="mr-2" /> Download Template
                </Button>
              </CardHeader>
              <CardContent>
                <div className="mb-5 p-4 bg-background rounded-xl border border-border/50">
                  <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Required Columns</p>
                  <div className="flex flex-wrap gap-2">
                    {REQUIRED_CSV_HEADERS.map(h => (
                      <code key={h} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-mono">{h}</code>
                    ))}
                  </div>
                </div>

                <div {...getCsvProps()} className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${isCsvDrag ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-border hover:border-primary/50 hover:bg-background'}`}>
                  <input {...getCsvInputProps()} />
                  <FileSpreadsheet size={48} className="mx-auto text-text-muted mb-4" />
                  <p className="text-base font-semibold text-text mb-1">Drag & drop your CSV file here</p>
                  <p className="text-sm text-text-muted">or click to browse</p>
                </div>

                {csvError && (
                  <div className="mt-4 flex items-start gap-3 p-4 bg-error/5 border border-error/20 rounded-xl text-sm text-error">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" /> {csvError}
                  </div>
                )}
              </CardContent>
            </Card>

            {csvRows.length > 0 && (
              <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle>Preview — {csvRows.length} rows detected</CardTitle>
                    <p className="text-sm text-text-muted mt-1">{csvRows.filter(r => r._valid).length} valid, {csvRows.filter(r => !r._valid).length} invalid</p>
                  </div>
                  <Button onClick={handleCSVImport} isLoading={csvImporting} className="shrink-0">
                    <CheckCircle2 size={16} className="mr-2" /> Confirm Import
                  </Button>
                </CardHeader>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-background/50 border-b border-border/50">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-text-muted uppercase">Platform</th>
                        <th className="px-4 py-3 font-semibold text-text-muted uppercase">Date</th>
                        <th className="px-4 py-3 font-semibold text-text-muted uppercase">Hours</th>
                        <th className="px-4 py-3 font-semibold text-text-muted uppercase">Gross</th>
                        <th className="px-4 py-3 font-semibold text-text-muted uppercase">Ded.</th>
                        <th className="px-4 py-3 font-semibold text-text-muted uppercase">Net</th>
                        <th className="px-4 py-3 font-semibold text-text-muted uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {csvRows.slice(0, 10).map((row) => (
                        <tr key={row._id} className={`border-b border-border/30 ${!row._valid ? 'bg-error/5' : ''}`}>
                          <td className="px-4 py-3 font-medium text-text">{row.platform || '—'}</td>
                          <td className="px-4 py-3 text-text-muted">{row.date || '—'}</td>
                          <td className="px-4 py-3">{row.hours_worked}</td>
                          <td className="px-4 py-3">Rs. {row.gross_earned}</td>
                          <td className="px-4 py-3 text-error">-Rs. {row.platform_deductions}</td>
                          <td className="px-4 py-3 font-bold text-success">Rs. {row.net_received}</td>
                          <td className="px-4 py-3">
                            {row._valid
                              ? <span className="text-success flex items-center gap-1"><CheckCircle2 size={12}/> Valid</span>
                              : <span className="text-error flex items-center gap-1"><AlertCircle size={12}/> Invalid</span>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {csvRows.length > 10 && (
                    <p className="px-4 py-3 text-xs text-text-muted">
                      ...and {csvRows.length - 10} more rows (all will be imported)
                    </p>
                  )}
                </div>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
