import React from 'react';

export const SeverityBadge = ({ severity, size = 'md' }) => {
  const s = severity?.toUpperCase() || 'LOW';

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1 font-semibold',
  };

  const config = {
    CRITICAL: {
      bg: 'bg-red-50',
      text: 'text-red-800',
      border: 'border-red-300',
      dot: 'bg-red-700',
    },
    HIGH: {
      bg: 'bg-orange-50',
      text: 'text-orange-900',
      border: 'border-orange-300',
      dot: 'bg-orange-600',
    },
    MEDIUM: {
      bg: 'bg-amber-50',
      text: 'text-amber-900',
      border: 'border-amber-300',
      dot: 'bg-amber-600',
    },
    LOW: {
      bg: 'bg-slate-100',
      text: 'text-slate-800',
      border: 'border-slate-300',
      dot: 'bg-slate-500',
    },
  };

  const style = config[s] || config.LOW;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${style.bg} ${style.text} ${style.border} ${sizeClasses[size]} font-semibold uppercase tracking-wider`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {s}
    </span>
  );
};

export const StatusBadge = ({ status, size = 'md' }) => {
  const st = status?.toUpperCase() || 'SUBMITTED';

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  const statusConfig = {
    SUBMITTED: {
      bg: 'bg-sky-50',
      text: 'text-sky-900',
      border: 'border-sky-300',
      label: 'Submitted',
    },
    UNDER_REVIEW: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-900',
      border: 'border-indigo-300',
      label: 'Under Review',
    },
    REVIEWED: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-900',
      border: 'border-indigo-300',
      label: 'Reviewed',
    },
    ASSIGNED: {
      bg: 'bg-purple-50',
      text: 'text-purple-900',
      border: 'border-purple-300',
      label: 'Assigned',
    },
    ACCEPTED: {
      bg: 'bg-blue-50',
      text: 'text-blue-900',
      border: 'border-blue-300',
      label: 'Accepted',
    },
    ON_THE_WAY: {
      bg: 'bg-amber-50',
      text: 'text-amber-900',
      border: 'border-amber-300',
      label: 'En Route',
    },
    ARRIVED: {
      bg: 'bg-amber-50',
      text: 'text-amber-900',
      border: 'border-amber-300',
      label: 'On Scene',
    },
    IN_PROGRESS: {
      bg: 'bg-amber-50',
      text: 'text-amber-900',
      border: 'border-amber-300',
      label: 'In Progress',
    },
    RESOLVED: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-900',
      border: 'border-emerald-300',
      label: 'Resolved',
    },
    COMPLETED: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-900',
      border: 'border-emerald-300',
      label: 'Completed',
    },
    CLOSED: {
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-300',
      label: 'Closed',
    },
    INVALID: {
      bg: 'bg-rose-50',
      text: 'text-rose-900',
      border: 'border-rose-300',
      label: 'Dismissed',
    },
    DUPLICATE: {
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-300',
      label: 'Duplicate',
    },
  };

  const style = statusConfig[st] || {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-300',
    label: st.replace(/_/g, ' '),
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border font-medium ${style.bg} ${style.text} ${style.border} ${sizeClasses[size]}`}
    >
      {style.label}
    </span>
  );
};
