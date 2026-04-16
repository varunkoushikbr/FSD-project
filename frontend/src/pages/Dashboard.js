import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Flame, TrendingUp, Sparkles, Target, CheckCircle2, Circle, Trash2, LogOut, User, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

// Components
import Navbar from '../components/Navbar';
import ProductivityChart from '../components/ProductivityChart';
import MilestoneOverlay from '../components/MilestoneOverlay';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartData, setChartData] = useState([]);
  const [user, setUser] = useState(null);
  const [milestone, setMilestone] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const [tasksRes, allTasksRes, userRes] = await Promise.all([
        api.get(`/tasks?date=${today}`),
        api.get('/tasks'),
        api.get('/auth/me')
      ]);
      
      setTasks(tasksRes.data);
      setUser(userRes.data);
      processChartData(allTasksRes.data);
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
      setError('Connection failed. Please refresh.');
      setLoading(false);
    }
  };

  const processChartData = (allTasks) => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = allTasks.filter(t => 
        t.completed && new Date(t.date).toISOString().split('T')[0] === dateStr
      ).length;
      return { date: d.toLocaleDateString(undefined, { weekday: 'short' }), completed: count };
    }).reverse();
    setChartData(last7Days);
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      const res = await api.post('/tasks', { title: newTask });
      setTasks([res.data, ...tasks]);
      setNewTask('');
    } catch (err) {
      setError('Task creation failed.');
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      const res = await api.put(`/tasks/${id}`, { completed: !completed });
      const { task, streak } = res.data;
      setTasks(tasks.map(t => t._id === id ? task : t));
      
      const userRes = await api.get('/auth/me');
      setUser(userRes.data);

      if (streak?.milestoneReached) setMilestone(streak.currentStreak);
    } catch (err) {
      setError('Update failed.');
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      setError('Delete failed.');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <Navbar />

      <main className="max-w-7xl mx-auto p-6">
        {/* STRICT 3-COLUMN GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* COLUMN 1: TASKS SECTION */}
          <section className="space-y-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black tracking-tight">Today's Tasks</h3>
                <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {tasks.length} Total
                </span>
              </div>

              <form onSubmit={addTask} className="flex gap-2 mb-8">
                <input
                  type="text"
                  placeholder="What's your focus?"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold placeholder:text-slate-300"
                />
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-indigo-600 text-white p-4 rounded-2xl shadow-lg shadow-indigo-100"
                >
                  <Plus size={20} />
                </motion.button>
              </form>

              <div className="space-y-3 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {tasks.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 opacity-40">
                      <Target size={48} className="mx-auto mb-4" />
                      <p className="font-bold text-sm uppercase tracking-widest">No tasks yet</p>
                    </motion.div>
                  ) : (
                    tasks.map(task => (
                      <motion.div 
                        key={task._id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="group flex items-center justify-between p-4 bg-slate-50 border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-md rounded-2xl transition-all"
                      >
                        <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => toggleComplete(task._id, task.completed)}>
                          {task.completed ? 
                            <CheckCircle2 size={22} className="text-emerald-500" /> : 
                            <Circle size={22} className="text-slate-300 group-hover:text-indigo-400" />
                          }
                          <span className={`font-bold text-sm ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                            {task.title}
                          </span>
                        </div>
                        <button onClick={() => deleteTask(task._id)} className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 size={18} />
                        </button>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </section>

          {/* COLUMN 2: GRAPH SECTION */}
          <section className="space-y-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 h-full flex flex-col">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-black tracking-tight">Productivity Graph</h3>
                  <div className="flex items-center gap-1.5 text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full font-black text-xs">
                    <TrendingUp size={14} /> +12%
                  </div>
                </div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Weekly Progress</p>
              </div>

              <div className="flex-1 bg-slate-50/50 rounded-3xl p-4 border border-slate-100 mb-6">
                <ProductivityChart data={chartData} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Success Rate</p>
                  <p className="text-lg font-black text-slate-800">84%</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Efficiency</p>
                  <p className="text-lg font-black text-slate-800">High</p>
                </div>
              </div>
            </div>
          </section>

          {/* COLUMN 3: STREAK SECTION */}
          <section className="space-y-6">
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden flex flex-col items-center text-center h-full min-h-[500px] justify-center"
             >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/20 rounded-full -ml-16 -mb-16 blur-2xl" />
                
                <div className="relative z-10 w-full">
                  <div className="bg-white/20 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-10 backdrop-blur-md shadow-inner">
                    <Flame size={48} className="text-amber-300 fill-amber-300 animate-pulse" />
                  </div>
                  
                  <h2 className="text-8xl font-black mb-2 tracking-tighter">{user?.currentStreak || 0}</h2>
                  <p className="text-2xl font-black text-indigo-100 mb-10 uppercase tracking-widest">Day Streak</p>
                  
                  <div className="bg-white/10 backdrop-blur-sm px-8 py-5 rounded-3xl border border-white/10 flex items-center gap-3 w-fit mx-auto">
                    <Sparkles size={24} className="text-indigo-200" />
                    <p className="text-sm font-bold text-indigo-50 leading-tight max-w-[150px]">
                      {user?.currentStreak > 0 ? "You're crushing it! Keep it up 🚀" : "Start your journey today 🚀"}
                    </p>
                  </div>
                </div>
             </motion.div>
          </section>

        </div>
      </main>

      <MilestoneOverlay 
        milestone={milestone} 
        onClose={() => setMilestone(null)} 
      />
    </div>
  );
};

export default Dashboard;
