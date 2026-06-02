'use client';

import React from 'react';

export default function Loading({ text = 'Memuat...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-gray-200" />
        <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin absolute top-0 left-0" />
      </div>
      <p className="mt-4 text-sm text-gray-500">{text}</p>
    </div>
  );
}
