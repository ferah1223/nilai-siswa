'use client';

import React from 'react';

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  subtitle?: string;
}

export default function StatsCard({
  icon,
  label,
  value,
  color = 'blue',
  subtitle,
}: StatsCardProps) {
  const colors: Record<string, { bg: string; icon: string; border: string }> = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      border: 'border-blue-100',
    },
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      border: 'border-green-100',
    },
    red: {
      bg: 'bg-red-50',
      icon: 'text-red-600',
      border: 'border-red-100',
    },
    yellow: {
      bg: 'bg-yellow-50',
      icon: 'text-yellow-600',
      border: 'border-yellow-100',
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      border: 'border-purple-100',
    },
  };

  const c = colors[color];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-white border ${c.border} p-6 shadow-sm hover:shadow-md transition-all duration-300 group`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div
          className={`${c.bg} ${c.icon} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
      </div>
      <div
        className={`absolute -bottom-6 -right-6 w-24 h-24 ${c.bg} rounded-full opacity-50`}
      />
    </div>
  );
}
