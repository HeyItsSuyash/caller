import React from 'react';

interface AdminTableProps {
  title: string;
  headers: string[];
  data: any[];
  renderRow: (item: any, index: number) => React.ReactNode;
  loading?: boolean;
}

const AdminTable: React.FC<AdminTableProps> = ({ title, headers, data, renderRow, loading }) => {
  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-border bg-gray-50/50">
        <h3 className="text-sm font-bold uppercase tracking-widest text-secondary">{title}</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/30">
              {headers.map((header) => (
                <th key={header} className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-secondary/60">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={headers.length} className="px-6 py-12 text-center text-sm text-secondary animate-pulse">
                  Loading data...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="px-6 py-12 text-center text-sm text-secondary">
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((item, index) => renderRow(item, index))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTable;
