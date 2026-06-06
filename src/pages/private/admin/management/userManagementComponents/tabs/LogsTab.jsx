import React from 'react';

const LogsTab = ({ logs }) => {
  const getTypeColor = (type) => {
    const colors = {
      SUCCESS: 'bg-green-100 text-green-700',
      INFO: 'bg-blue-100 text-blue-700',
      ERROR: 'bg-red-100 text-red-700',
      WARNING: 'bg-orange-100 text-orange-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
              Action
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
              Details
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-6 py-4">
                <span
                  className={`inline-flex rounded-md px-3 py-1 text-xs font-semibold ${getTypeColor(log.type)}`}
                >
                  {log.type}
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{log.action}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{log.details}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{log.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogsTab;
