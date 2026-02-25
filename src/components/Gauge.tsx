import React from 'react';

interface GaugeProps {
  percentage: number;
  color: 'red' | 'yellow' | 'green';
}

const Gauge: React.FC<GaugeProps> = ({ percentage, color }) => {
  const rotation = (percentage / 100) * 180 - 90;
  const colorClasses = {
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
  };

  return (
    <div className="relative w-40 h-20 overflow-hidden mx-auto">
      <div className="absolute top-0 left-0 w-full h-full border-8 border-gray-200 rounded-t-full border-b-0"></div>
      <div
        className="absolute top-0 left-0 w-full h-full rounded-t-full border-b-0 border-8 transition-all duration-500"
        style={{
          borderColor: color === 'red' ? '#EF4444' : color === 'yellow' ? '#F59E0B' : '#22C55E',
          clipPath: `polygon(0% 0%, 100% 0%, 100% ${percentage > 50 ? 100 : 0}%, 50% 100%, 0% ${percentage < 50 ? 100 : 0}%)`
        }}
      ></div>
      <div
        className="absolute bottom-0 left-1/2 w-1 h-16 bg-gray-700 transition-transform duration-1000 ease-out origin-bottom transform -translate-x-1/2"
        style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
      ></div>
      <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-gray-700 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-2xl font-bold text-gray-800">
        {percentage}%
      </div>
    </div>
  );
};

export default Gauge;
