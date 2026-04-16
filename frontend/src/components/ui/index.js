import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ children, className = '', title }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white rounded-2xl shadow-soft p-6 border border-slate-100 ${className}`}
  >
    {title && <h3 className="text-lg font-bold text-slate-800 mb-4">{title}</h3>}
    {children}
  </motion.div>
);

export const Button = ({ children, onClick, className = '', variant = 'primary', icon: Icon }) => {
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-md',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50',
    ghost: 'bg-transparent text-slate-500 hover:bg-slate-50',
    danger: 'bg-rose-500 text-white hover:bg-rose-600',
  };

  return (
    <button 
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium transition-all active:scale-95 ${variants[variant]} ${className}`}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

export const StatBox = ({ label, value, icon: Icon, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    orange: 'bg-orange-50 text-orange-600',
    rose: 'bg-rose-50 text-rose-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <Card className="flex flex-col items-center text-center">
      <div className={`p-3 rounded-2xl mb-3 ${colors[color]}`}>
        {Icon && <Icon size={24} />}
      </div>
      <h4 className="text-3xl font-black text-slate-800">{value}</h4>
      <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wider">{label}</p>
    </Card>
  );
};

export const Badge = ({ children, type = 'success' }) => {
  const types = {
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    locked: 'bg-slate-100 text-slate-500',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${types[type]}`}>
      {children}
    </span>
  );
};
