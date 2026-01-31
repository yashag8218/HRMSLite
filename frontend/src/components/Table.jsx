import { HiOutlineInbox } from 'react-icons/hi';

export default function Table({ columns, data, loading, emptyMessage = 'No data available', emptyIcon: EmptyIcon = HiOutlineInbox }) {
  if (loading) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-100 overflow-hidden">
        <div className="animate-pulse">
          <div className="h-14 bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 border-b border-slate-50 last:border-0">
              <div className="flex items-center px-6 py-4 gap-4">
                <div className="h-10 w-10 skeleton rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 skeleton rounded-full w-3/4" />
                  <div className="h-2 skeleton rounded-full w-1/2" />
                </div>
                <div className="h-8 skeleton rounded-lg w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-100 p-16 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl mb-6">
          <EmptyIcon className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">No Data Found</h3>
        <p className="text-slate-400 max-w-sm mx-auto">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100">
              {columns.map((column, idx) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider ${idx === 0 ? 'pl-6' : ''}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className="hover:bg-teal-50/30 transition-all duration-200 group"
              >
                {columns.map((column, colIdx) => (
                  <td
                    key={column.key}
                    className={`px-6 py-4 ${colIdx === 0 ? 'pl-6' : ''}`}
                  >
                    <div className="text-sm text-slate-700 font-medium">
                      {column.render ? column.render(row) : row[column.key]}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Table Footer */}
      <div className="px-6 py-3 bg-gradient-to-r from-slate-50 to-transparent border-t border-slate-100">
        <p className="text-xs text-slate-500">
          Showing <span className="font-semibold text-teal-600">{data.length}</span> {data.length === 1 ? 'record' : 'records'}
        </p>
      </div>
    </div>
  );
}
