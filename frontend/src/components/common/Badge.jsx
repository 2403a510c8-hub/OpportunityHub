import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'sm', className = '' }) => {
  const variantStyles = {
    // Opportunity Types
    Internship: 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/10',
    Hackathon: 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/10',
    Scholarship: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/10',
    'Full-Time': 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/10',
    Fellowship: 'bg-amber-50 text-amber-800 border-amber-200 ring-amber-500/10',

    // Work Mode
    Remote: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Hybrid: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    'On-site': 'bg-slate-100 text-slate-700 border-slate-200',

    // Application Statuses
    Submitted: 'bg-slate-100 text-slate-700 border-slate-200',
    'Under Review': 'bg-amber-50 text-amber-700 border-amber-200',
    Interviewing: 'bg-blue-50 text-blue-700 border-blue-200',
    Accepted: 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-emerald-500/20 font-semibold',
    Rejected: 'bg-rose-50 text-rose-700 border-rose-200',

    // Generic
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    featured: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-transparent font-semibold shadow-sm',
    primary: 'bg-indigo-600 text-white border-transparent',
  };

  const sizeStyles = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  const style = variantStyles[variant] || variantStyles.default;
  const sizeStyle = sizeStyles[size] || sizeStyles.sm;

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border transition-all ${style} ${sizeStyle} ${className}`}
    >
      {children}
    </span>
  );
};
