import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import type { Issue } from '../../types';
import { CATEGORIES } from '../../data/categories';

export const CategoryBarChart: React.FC<{ issues: Issue[] }> = ({ issues }) => {
  const data = Object.values(CATEGORIES).map((cat) => {
    const count = issues.filter((i) => i.category === cat.id).length;
    return {
      name: cat.label.split('&')[0].trim(),
      fullLabel: cat.label,
      count,
      color: cat.color,
    };
  });

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
          <XAxis
            dataKey="name"
            stroke="#94a3b8"
            fontSize={11}
            tickLine={false}
            interval={0}
            angle={-15}
            textAnchor="end"
          />
          <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
            itemStyle={{ color: '#e2e8f0', fontSize: '12px' }}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
