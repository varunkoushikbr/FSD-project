import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trophy, ArrowLeft, Crown, Medal, User } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import Navbar from '../components/Navbar';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get('/tasks/leaderboard');
      setLeaderboard(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch leaderboard');
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-sm transition-colors duration-300">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <Link to="/" className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-8 font-black uppercase tracking-widest text-[10px]">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-6 mb-12">
            <div className="bg-amber-100 dark:bg-amber-900/30 p-4 rounded-2xl text-amber-600 dark:text-amber-400">
              <Trophy size={40} />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight dark:text-white">Hall of Fame</h1>
              <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">Global Top Performers</p>
            </div>
          </div>

          <div className="space-y-4">
            {leaderboard.map((player, index) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                key={player._id}
                className={`flex items-center justify-between p-6 rounded-3xl border transition-all ${
                  index === 0 ? 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30' : 
                  index === 1 ? 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800' : 
                  index === 2 ? 'bg-orange-50/50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900/30' : 'bg-white dark:bg-slate-900 border-slate-50 dark:border-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 text-center font-black text-2xl text-slate-300 dark:text-slate-700">
                    {index === 0 ? <Crown size={32} className="text-amber-500 mx-auto" /> : 
                     index === 1 ? <Medal size={32} className="text-slate-400 mx-auto" /> : 
                     index === 2 ? <Medal size={32} className="text-orange-400 mx-auto" /> : index + 1}
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                    <User size={24} className="text-slate-400 dark:text-slate-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-800 dark:text-white">{player.name}</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.15em]">{player.currentStreak} Day Streak</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{player.totalPoints}</span>
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase ml-2 tracking-widest">pts</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
