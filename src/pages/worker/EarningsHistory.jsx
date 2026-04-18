import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, getFilteredRowModel } from '@tanstack/react-table';
import { FileDown, Search, Filter, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

// Mock Data
const mockData = [
  { id: '101', platform: 'FoodPanda', date: '2026-04-18', hours: 5, gross: 3200, ded: 400, net: 2800, status: 'verified' },
  { id: '102', platform: 'InDrive', date: '2026-04-17', hours: 4, gross: 3000, ded: 600, net: 2400, status: 'pending' },
  { id: '103', platform: 'FoodPanda', date: '2026-04-16', hours: 6, gross: 3500, ded: 400, net: 3100, status: 'verified' },
  { id: '104', platform: 'Bykea', date: '2026-04-15', hours: 3, gross: 1800, ded: 300, net: 1500, status: 'disputed' },
  { id: '105', platform: 'Uber', date: '2026-04-14', hours: 8, gross: 5000, ded: 1200, net: 3800, status: 'verified' },
  { id: '106', platform: 'FoodPanda', date: '2026-04-13', hours: 5, gross: 3100, ded: 400, net: 2700, status: 'verified' },
  { id: '107', platform: 'Careem', date: '2026-04-12', hours: 4, gross: 2500, ded: 500, net: 2000, status: 'pending' },
];

export default function EarningsHistory() {
  const [globalFilter, setGlobalFilter] = useState('');

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
      accessorKey: 'hours',
      header: 'Hours',
      cell: (info) => `${info.getValue()}h`
    },
    {
      accessorKey: 'gross',
      header: 'Gross (Rs.)',
    },
    {
      accessorKey: 'ded',
      header: 'Ded. (Rs.)',
      cell: (info) => <span className="text-error font-medium">-{info.getValue()}</span>
    },
    {
      accessorKey: 'net',
      header: 'Net (Rs.)',
      cell: (info) => <span className="text-success font-bold">{info.getValue()}</span>
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (info) => {
        const val = info.getValue();
        if (val === 'verified') return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-success/10 text-success"><CheckCircle2 size={12}/> Verified</span>;
        if (val === 'pending') return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent"><Clock size={12}/> Pending</span>;
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-error/10 text-error"><AlertCircle size={12}/> Disputed</span>;
      }
    },
    {
      id: 'actions',
      header: '',
      cell: (info) => {
        const status = info.row.original.status;
        return status === 'pending' ? (
          <button className="text-xs font-medium text-primary hover:text-primary-dark underline">Upload Proof</button>
        ) : (
          <button className="text-xs font-medium text-text-muted hover:text-text">Details</button>
        );
      }
    }
  ], []);

  const table = useReactTable({
    data: mockData,
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
        <Button variant="outline" className="w-full sm:w-auto bg-surface">
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
