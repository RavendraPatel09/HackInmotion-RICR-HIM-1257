import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import type { Issue, IssueStatus } from '../../types';

export const StatusPieChart: React.FC<{ issues: Issue[] }> = ({ issues }) => {
  const statusColors: Record<IssueStatus, string> = {
    Reported: '#3B82F6',
    Acknowledged: '#6366F1',
    'In Progress': '#F59E0B',
    Resolved: '#10B981',
    Verified: '#14B8A6',
    Reopened: '#F43F5E',
  };

  const statuses: IssueStatus[] = ['Reported', 'Acknowledged', 'In Progress', 'Resolved', 'Verified', 'Reopened'];

  const data = statuses
    .map((s) => ({
      name: s,
      value: issues.filter((i) => i.status === s).length,
      color: statusColors[s],
    }))
    .filter((d) => d.value > 0);

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
            itemStyle={{ color: '#e2e8f0', fontSize: '12px' }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
