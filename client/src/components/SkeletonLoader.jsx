import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm animate-pulse space-y-4">
    <div className="flex items-center gap-3">
      <div className="w-11 h-11 bg-slate-200 rounded-xl" />
      <div className="space-y-1.5 flex-1">
        <div className="h-3 bg-slate-200 rounded w-1/3" />
        <div className="h-4 bg-slate-200 rounded w-3/4" />
      </div>
    </div>
    <div className="flex gap-2">
      <div className="h-5 bg-slate-200 rounded w-20" />
      <div className="h-5 bg-slate-200 rounded w-16" />
      <div className="h-5 bg-slate-200 rounded w-24" />
    </div>
    <div className="flex gap-1.5">
      <div className="h-4 bg-slate-200 rounded w-12" />
      <div className="h-4 bg-slate-200 rounded w-16" />
      <div className="h-4 bg-slate-200 rounded w-14" />
    </div>
    <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
      <div className="h-4 bg-slate-200 rounded w-24" />
      <div className="h-6 bg-slate-200 rounded w-16" />
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="space-y-3 animate-pulse">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-12 bg-slate-100 rounded-xl w-full" />
    ))}
  </div>
);

export default CardSkeleton;
