import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Flame, 
  Trophy, 
  CheckCircle, 
  PieChart, 
  Edit3,
  Rocket,
  Crown,
  Target,
  Save,
  X
} from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { Card, StatBox, Button, Badge } from '../components/ui';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [totalTasks, setTotalTasks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, tasksRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/tasks')
        ]);
        setUser(userRes.data);
        setEditForm({ name: userRes.data.name, email: userRes.data.email });
        setTotalTasks(tasksRes.data.filter(t => t.completed).length);
        setLoading(false);
      } catch (err) {
        navigate('/login');
      }
    };
    fetchData();
  }, [navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
        const res = await api.put('/auth/profile', editForm);
        setUser(res.data);
        setIsEditing(false);
    } catch (err) {
        console.error('Update failed', err);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  const milestones = [
    { days: 7, label: 'Week Warrior', icon: Flame, color: 'orange' },
    { days: 30, label: 'Monthly Master', icon: Trophy, color: 'amber' },
    { days: 100, label: 'Century Legend', icon: Crown, color: 'rose' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex flex-col pb-12 transition-colors duration-300">
      <Navbar />

      <div className="max-w-5xl mx-auto w-full px-6 space-y-8 mt-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-5xl font-black shadow-xl shadow-indigo-200 dark:shadow-none">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
          
          <div className="text-center md:text-left flex-1">
            <AnimatePresence mode="wait">
                {isEditing ? (
                    <motion.form 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        onSubmit={handleUpdateProfile} 
                        className="flex flex-col gap-4 max-w-sm"
                    >
                        <input 
                            type="text" 
                            value={editForm.name} 
                            onChange={e => setEditForm({...editForm, name: e.target.value})}
                            className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Your Name"
                            required
                        />
                        <input 
                            type="email" 
                            value={editForm.email} 
                            onChange={e => setEditForm({...editForm, email: e.target.value})}
                            className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Email Address"
                            required
                        />
                        <div className="flex gap-2">
                            <button type="submit" className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                                <Save size={16} /> Save
                            </button>
                            <button type="button" onClick={() => setIsEditing(false)} className="flex items-center gap-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                                <X size={16} /> Cancel
                            </button>
                        </div>
                    </motion.form>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-1">{user.name}</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium mb-4">{user.email}</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                           <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200 dark:border-emerald-800/50">Member since 2026</div>
                           <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-bold border border-amber-200 dark:border-amber-800/50">Pro Account</div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
          </div>

          {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Edit3 size={18} /> Edit Profile
              </button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
              <div className="p-4 bg-orange-100 dark:bg-orange-900/30 text-orange-500 rounded-2xl"><Flame size={24} /></div>
              <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Streak</p>
                  <p className="text-2xl font-black dark:text-white">{user.currentStreak}</p>
              </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
              <div className="p-4 bg-amber-100 dark:bg-amber-900/30 text-amber-500 rounded-2xl"><Trophy size={24} /></div>
              <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Longest Streak</p>
                  <p className="text-2xl font-black dark:text-white">{user.longestStreak}</p>
              </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
              <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-2xl"><CheckCircle size={24} /></div>
              <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Completed</p>
                  <p className="text-2xl font-black dark:text-white">{totalTasks}</p>
              </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
              <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 rounded-2xl"><PieChart size={24} /></div>
              <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Points</p>
                  <p className="text-2xl font-black dark:text-white">{user.totalPoints || 0}</p>
              </div>
          </div>
        </div>

        {/* Milestones Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Rocket className="text-indigo-600 dark:text-indigo-400" size={24} />
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">Streak Milestones</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {milestones.map((m) => {
              const isUnlocked = user.longestStreak >= m.days;
              const Icon = m.icon;
              
              return (
                <div 
                  key={m.days} 
                  className={`relative overflow-hidden transition-all duration-500 rounded-3xl p-8 border text-center ${isUnlocked ? 'bg-white dark:bg-slate-900 border-emerald-500 shadow-xl shadow-emerald-500/10' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 opacity-70 grayscale'}`}
                >
                  <div className="relative z-10 flex flex-col items-center">
                    <div className={`p-5 rounded-[2rem] mb-6 ${isUnlocked ? `bg-${m.color}-50 dark:bg-${m.color}-900/30 text-${m.color}-500` : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                      <Icon size={48} strokeWidth={2.5} />
                    </div>
                    <h4 className="text-2xl font-black text-slate-800 dark:text-white mb-2">{m.days} Days</h4>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-8">{m.label}</p>
                    
                    {isUnlocked ? (
                      <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-emerald-200 dark:border-emerald-800">Unlocked</span>
                    ) : (
                      <span className="bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-slate-300 dark:border-slate-700">Locked</span>
                    )}
                  </div>
                  
                  {isUnlocked && (
                    <div className="absolute top-4 right-4">
                       <div className="bg-emerald-500 text-white p-1.5 rounded-full shadow-sm">
                          <CheckCircle size={16} strokeWidth={4} />
                       </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;