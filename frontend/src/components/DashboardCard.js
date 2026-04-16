import React from 'react';
import { motion } from 'framer-motion';

const DashboardCard = ({ title, children, className = "", subtitle }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full ${className}`}
  >
    <div className="mb-6">
      <h3 className="text-xl font-black text-slate-800 tracking-tight">{title}</h3>
      {subtitle && <p className="text-sm font-semibold text-slate-400 mt-1 uppercase tracking-wider">{subtitle}</p>}
    </div>
    {children}
  </motion.div>
);

export default DashboardCard;
