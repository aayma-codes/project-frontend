import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, getFilteredRowModel } from '@tanstack/react-table';
import { FileDown, Search, Filter, CheckCircle2, AlertCircle, Clock, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

export default function EarningsHistory() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');

  const fallbackData = [
    { id: 101, date: '2026-04-18', platform: 'FoodPanda', hours_worked: 5.5, gross_earned: 3500, platform_deductions: 400, net_received: 3100, status: 'verified' },
    { id: 102, date: '2026-04-17', platform: 'InDrive', hours_worked: 4.0, gross_earned: 3000, platform_deductions: 600, net_received: 2400, status: 'pending' },
    { id: 103, date: '2026-04-16', platform: 'Bykea', hours_worked: 6.0, gross_earned: 2800, platform_deductions: 280, net_received: 2520, status: 'verified' },
    { id: 104, date: '2026-04-15', platform: 'FoodPanda', hours_worked: 4.5, gross_earned: 2900, platform_deductions: 350, net_received: 2550, status: 'discrepancy' },
  ];

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await api.get('/api/earnings/logs');
      setData(response.data?.length > 0 ? response.data : fallbackData);
    } catch (error) {
      setData(fallbackData);
      toast.error('Connect backend for live logs. Showing demo data.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!data.length) return;
    const headers = ['Date', 'Platform', 'Hours', 'Gross', 'Deductions', 'Net', 'Status'];
    const rows = data.map(r => [r.date, r.platform, r.hours_worked, r.gross_earned, r.platform_deductions, r.net_received, r.status]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "KamaiKitab_Earnings_History.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV exported successfully!');
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'date',
      header: 'Date',
    },
    {
      accessorKey: 'platform',
      header: 'Platform',
      cell: (info) => <span className="font-medium text-text">{info.getValue()}</span>
    },
    {
      accessorKey: 'hours_worked',
      header: 'Hours',
      cell: (info) => `${info.getValue()}h`
    },
    {
      accessorKey: 'gross_earned',
      header: 'Gross (Rs.)',
    },
    {
      accessorKey: 'platform_deductions',
      header: 'Ded. (Rs.)',
      cell: (info) => <span className="text-error font-medium">-{info.getValue()}</span>
    },
    {
      accessorKey: 'net_received',
      header: 'Net (Rs.)',
      cell: (info) => <span className="text-success font-bold">{info.getValue()}</span>
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (info) => {
        const val = info.getValue()?.toLowerCase();
        if (val === 'confirmed' || val === 'verified') return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-success/10 text-success"><CheckCircle2 size={12}/> Confirmed</span>;
        if (val === 'pending') return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent"><Clock size={12}/> Pending</span>;
        if (val === 'discrepancy') return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-error/10 text-error"><AlertCircle size={12}/> Discrepancy</span>;
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-text-muted/10 text-text-muted"><HelpCircle size={12}/> Unverifiable</span>;
      }
    },
    {
      id: 'actions',
      header: '',
      cell: (info) => {
        const status = info.row.original.status;
        return status === 'pending' ? (
          <Link to={`/worker/earnings/${info.row.original.id}/screenshot`} className="text-xs font-medium text-primary hover:text-primary-dark underline">Upload Proof</Link>
        ) : (
          <Link to={`/worker/earnings/${info.row.original.id}`} className="text-xs font-medium text-text-muted hover:text-text">Details</Link>
        );
      }
    }
  ], []);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text">Earnings History</h1>
          <p className="text-text-muted">A complete record of all your logged shifts.</p>
        </div>
        <Button onClick={handleExportCSV} variant="outline" className="w-full sm:w-auto bg-surface">
          <FileDown size={18} className="mr-2" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="Search platform or date..."
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-text-muted">
              <Filter size={16} className="mr-2" /> Filter
            </Button>
          </div>
        </CardHeader>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-muted uppercase bg-background/30 border-b border-border/50">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-6 py-4 font-semibold whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="border-b border-border/30 hover:bg-background/20 transition-colors">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex items-center justify-between px-6 py-4 bg-background/20 border-t border-border/50 text-sm text-text-muted">
          <span>Showing Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 rounded-md border border-border/50 disabled:opacity-50 hover:bg-surface transition-colors"
            >
              Previous
            </button>
            <button 
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 rounded-md border border-border/50 disabled:opacity-50 hover:bg-surface transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
