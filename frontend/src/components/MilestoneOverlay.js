import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, X } from 'lucide-react';

const MilestoneOverlay = ({ milestone, onClose }) => {
  useEffect(() => {
    if (milestone) {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#fbbf24', '#10b981']
      });
    }
  }, [milestone]);

  return (
    <AnimatePresence>
      {milestone && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 max-w-md w-full shadow-2xl text-center relative overflow-hidden border border-white/20"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-amber-500 to-emerald-500" />
            
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
            >
                <X size={24} />
            </button>

            <motion.div 
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-amber-600 dark:text-amber-400"
            >
                <Sparkles size={48} />
            </motion.div>

            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                {milestone} Day Streak!
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-lg mb-10 leading-relaxed">
                You're absolutely crushing it! Your dedication is inspiring.
            </p>

            <button 
                onClick={onClose}
                className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xl shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95"
            >
                Keep the Flame Alive!
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MilestoneOverlay;
