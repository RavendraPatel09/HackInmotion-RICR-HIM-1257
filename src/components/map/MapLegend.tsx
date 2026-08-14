import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const MapLegend: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const legendItems = [
    { label: 'Reported', color: '#73827D' },
    { label: 'Acknowledged', color: '#C78A20' },
    { label: 'In Progress', color: '#2878A8' },
    { label: 'Resolved', color: '#16845B' },
    { label: 'Verified', color: '#053229' },
    { label: 'Critical', color: '#C94B4B' },
  ];

  return (
    <div className="absolute bottom-6 left-6 z-[1000] bg-white rounded-lg shadow-md border border-[#D6E2DE] overflow-hidden">
      <div 
        className="px-3 py-2 bg-[#F1F7F5] border-b border-[#D6E2DE] flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-xs font-semibold text-[#10201C]">Legend</span>
        {isExpanded ? <ChevronDown className="w-4 h-4 text-[#536761]" /> : <ChevronUp className="w-4 h-4 text-[#536761]" />}
      </div>
      
      {isExpanded && (
        <div className="p-3 flex flex-col gap-2">
          {legendItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-[#536761]">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
