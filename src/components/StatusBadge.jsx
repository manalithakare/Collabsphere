import React from 'react';

export function StatusBadge({ status, type = 'collaboration' }) {
  let colorClasses = 'bg-zinc-800/80 text-zinc-300 border-zinc-700/60';
  let dotColor = 'bg-zinc-400';

  const s = String(status || '').toLowerCase();

  if (s === 'pending') {
    colorClasses = 'bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.15)]';
    dotColor = 'bg-amber-400';
  } else if (s === 'accepted') {
    colorClasses = 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.15)]';
    dotColor = 'bg-cyan-400';
  } else if (s === 'in progress') {
    colorClasses = 'bg-purple-500/20 text-purple-200 border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.25)]';
    dotColor = 'bg-pink-400 animate-pulse';
  } else if (s === 'completed' || s === 'paid' || s === 'active') {
    colorClasses = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-[0_0_10px_rgba(52,211,153,0.18)]';
    dotColor = 'bg-emerald-400';
  } else if (s === 'rejected' || s === 'cancelled') {
    colorClasses = 'bg-rose-500/15 text-rose-300 border-rose-500/30 shadow-[0_0_8px_rgba(244,63,94,0.15)]';
    dotColor = 'bg-rose-400';
  } else if (s === 'draft') {
    colorClasses = 'bg-zinc-800/70 text-zinc-400 border-white/10';
    dotColor = 'bg-zinc-500';
  } else if (s === 'barter') {
    colorClasses = 'bg-pink-500/15 text-pink-300 border-pink-500/30 shadow-[0_0_8px_rgba(236,72,153,0.2)]';
    dotColor = 'bg-pink-400';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border whitespace-nowrap backdrop-blur-md ${colorClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {status}
    </span>
  );
}

export default StatusBadge;
