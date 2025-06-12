import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, isLoading = false }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
      <div className="flex flex-col space-y-2">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h2>
        {isLoading ? (
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
        ) : (
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        )}
      </div>
      <div className="mt-4 h-1 w-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
    </div>
  );
};

export default StatCard;