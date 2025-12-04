import React from 'react';
import { Citizen } from '../types';

interface TableProps {
  data: Citizen[];
  highlightIds?: number[];
}

export const Table: React.FC<TableProps> = ({ data, highlightIds = [] }) => {
  if (data.length === 0) return <div className="text-crt-green-dim italic">No records found.</div>;

  const headers = Object.keys(data[0]) as (keyof Citizen)[];

  return (
    <div className="w-full overflow-x-auto border border-crt-green-dim/50 p-1">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-crt-green-dim text-crt-green uppercase tracking-wider">
            {headers.map(h => (
              <th key={h} className="p-2">{h.replace('_', ' ')}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr 
              key={row.id} 
              className={`border-b border-crt-green-dim/30 transition-colors ${
                highlightIds.includes(row.id) ? 'bg-crt-green/20' : 'hover:bg-crt-green/10'
              }`}
            >
              {headers.map((col) => (
                <td key={`${row.id}-${col}`} className="p-2 text-crt-green/90 font-mono">
                  {col === 'status' ? (
                    <span className={`px-1 rounded ${
                      row[col] === 'active' ? 'bg-crt-green-dim/30 text-crt-green' : 'bg-red-900/50 text-red-400'
                    }`}>
                      {row[col]}
                    </span>
                  ) : (
                    row[col]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};