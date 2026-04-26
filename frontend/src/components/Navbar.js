import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Target, LayoutDashboard, User, LogOut, Sun, Moon, HelpCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-4 sticky top-0 z-50 shadow-sm transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
          <motion.div 
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20"
          >
            <Target size={24} />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tight leading-none">FocusUp</span>
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">Master Your Time, Own Your Life</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6 mr-4">
            <Link to="/" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors flex items-center gap-2">
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link to="/profile" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors flex items-center gap-2">
              <User size={18} /> Profile
            </Link>
          </div>

          <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-6">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowHelp(true)}
                className="p-2.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
                <HelpCircle size={22} />
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-2.5 text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
            >
                {isDark ? <Sun size={22} /> : <Moon size={22} />}
            </motion.button>
            
            <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
            >
                <LogOut size={18} /> Logout
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showHelp && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl relative overflow-hidden"
                >
                    <button onClick={() => setShowHelp(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-rose-500 transition-colors">
                        <X size={24} />
                    </button>

                    <div className="bg-indigo-100 dark:bg-indigo-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400">
                        <HelpCircle size={32} />
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">How to use FocusUp?</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">
                        Become the most productive version of yourself with these simple steps:
                    </p>

                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black shrink-0">1</div>
                            <p className="text-slate-700 dark:text-slate-200 font-bold">Add tasks with estimated time. You can even set them to repeat for multiple days!</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 font-black shrink-0">2</div>
                            <p className="text-slate-700 dark:text-slate-200 font-bold">Use the built-in timer. Start working, and stop when you're done or need a break.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black shrink-0">3</div>
                            <p className="text-slate-700 dark:text-slate-200 font-bold">Earn points! Get more points for longer focus sessions and double points for being efficient.</p>
                        </div>
                    </div>

                    <button 
                        onClick={() => setShowHelp(false)}
                        className="mt-10 w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-colors"
                    >
                        Got it, let's crush it!
                    </button>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
