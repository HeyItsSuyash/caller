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
    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden shadow-lg text-white">
      <div className="px-6 py-4 border-b border-white/5 bg-black/50">
        <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400 font-display">{title}</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/30">
              {headers.map((header) => (
                <th key={header} className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={headers.length} className="px-6 py-12 text-center text-sm text-neutral-500 animate-pulse">
                  Loading data...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="px-6 py-12 text-center text-sm text-neutral-500">
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
