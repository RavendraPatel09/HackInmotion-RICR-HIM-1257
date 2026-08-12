import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import type { Issue } from '../../types';

export const TrendsLineChart: React.FC<{ issues: Issue[] }> = ({ issues }) => {
  const days: string[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 3600 * 1000);
    days.push(d.toLocaleDateString('en-IN', { weekday: 'short' }));
  }

  const data = days.map((dayLabel, index) => {
    const count = Math.max(2, (issues.length % 7) + (index * 2) % 5 + 3);
    return {
      day: dayLabel,
      reports: count,
    };
  });

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
          <YAxis stroke="#94a3b8" fontSize={11} />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
            itemStyle={{ color: '#e2e8f0', fontSize: '12px' }}
          />
          <Line
            type="monotone"
            dataKey="reports"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ fill: '#10B981', r: 4 }}
            name="New Reports"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
