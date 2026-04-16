import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Target, LayoutDashboard, User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1400px] mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-200">
            <Target size={24} />
          </div>
          <span className="text-2xl font-black text-slate-800 tracking-tight">FocusUp</span>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-slate-600 hover:text-indigo-600 font-semibold transition-colors flex items-center gap-2">
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link to="/profile" className="text-slate-600 hover:text-indigo-600 font-semibold transition-colors flex items-center gap-2">
              <User size={18} /> Profile
            </Link>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-100 transition-all"
          >
            <LogOut size={18} /> Logout
          </motion.button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
