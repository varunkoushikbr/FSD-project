import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Plus, Flame, TrendingUp, Sparkles, Target, 
  CheckCircle2, Circle, Trash2, LogOut, User, 
  LayoutDashboard, Play, Square, Trophy, Lightbulb,
  Calendar as CalendarIcon, Repeat
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import confetti from 'canvas-confetti';
import api from '../services/api';

// Components
import Navbar from '../components/Navbar';
import ProductivityChart from '../components/ProductivityChart';
import MilestoneOverlay from '../components/MilestoneOverlay';

const TimerDisplay = ({ startTime }) => {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        if (!startTime) return;
        const calcElapsed = () => Math.floor((Date.now() - new Date(startTime).getTime()) / 1000);
        setElapsed(calcElapsed());
        const interval = setInterval(() => {
            setElapsed(calcElapsed());
        }, 1000);
        return () => clearInterval(interval);
    }, [startTime]);

    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    return <span className="text-rose-500 font-bold tabular-nums ml-1">{mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}</span>;
};

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [repeatDays, setRepeatDays] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [user, setUser] = useState(null);
  const [milestone, setMilestone] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [successMsg, setSuccessMsg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInitialData();
  }, [selectedDate]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const localDateStr = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000).toISOString().split('T')[0];
      const [tasksRes, allTasksRes, userRes] = await Promise.all([
        api.get(`/tasks?date=${localDateStr}`),
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
    // Productivity Chart (Last 7 Days Completed)
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
      const count = allTasks.filter(t => 
        t.completed && t.updatedAt && new Date(t.updatedAt).toISOString().split('T')[0] === dateStr
      ).length;
      return { date: d.toLocaleDateString(undefined, { weekday: 'short' }), completed: count };
    }).reverse();
    setChartData(last7Days);

    // Pie Chart Data (Status Distribution for all tasks)
    const completed = allTasks.filter(t => t.completed).length;
    const inProgress = allTasks.filter(t => !t.completed && t.status === 'in-progress').length;
    const pending = allTasks.filter(t => !t.completed && t.status === 'pending').length;
    setPieData([
        { name: 'Completed', value: completed, color: '#10b981' },
        { name: 'In Progress', value: inProgress, color: '#f59e0b' },
        { name: 'Pending', value: pending, color: '#6366f1' }
    ]);
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      const daysToRepeat = parseInt(repeatDays) || 1;
      const totalMins = (parseInt(estimatedHours) || 0) * 60 + (parseInt(estimatedTime) || 0);
      const localDateStr = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000).toISOString().split('T')[0];

      const res = await api.post('/tasks', { 
        title: newTask, 
        estimatedTime: totalMins,
        date: localDateStr,
        days: daysToRepeat
      });
      
      if (Array.isArray(res.data)) {
          const tasksForToday = res.data.filter(t => {
              const tDateStr = new Date(t.date).toISOString().split('T')[0];
              return tDateStr === localDateStr || t.date.split('T')[0] === localDateStr;
          });
          setTasks([...tasksForToday, ...tasks]);
      } else {
          setTasks([res.data, ...tasks]);
      }
      
      setNewTask('');
      setEstimatedHours('');
      setEstimatedTime('');
      setRepeatDays('');
    } catch (err) {
      setError('Task creation failed.');
    }
  };

  const showFeedback = (points) => {
    const messages = ['Good!', 'Great!', 'Marvelous!', 'Excellent!', 'Outstanding!', 'Bravo!'];
    const msg = messages[Math.floor(Math.random() * messages.length)];
    setSuccessMsg({ text: msg, points });
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4f46e5', '#10b981', '#fbbf24']
    });

    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const toggleComplete = async (id, completed) => {
    try {
      const res = await api.put(`/tasks/${id}`, { completed: !completed });
      const { task, streak, pointsAwarded } = res.data;
      setTasks(tasks.map(t => t._id === id ? task : t));
      
      const userRes = await api.get('/auth/me');
      setUser(userRes.data);

      if (!completed && pointsAwarded > 0) {
          showFeedback(pointsAwarded);
      }

      if (streak?.milestoneReached) setMilestone(streak.currentStreak);
    } catch (err) {
      setError('Update failed.');
    }
  };

  const startTimer = async (id) => {
    try {
      const res = await api.put(`/tasks/${id}/start`);
      setTasks(tasks.map(t => t._id === id ? res.data : t));
    } catch (err) {
      setError('Failed to start timer.');
    }
  };

  const stopTimer = async (id) => {
    try {
      const res = await api.put(`/tasks/${id}/stop`);
      setTasks(tasks.map(t => t._id === id ? res.data : t));
    } catch (err) {
      setError('Failed to stop timer.');
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 text-sm transition-colors duration-300">
      <Navbar />

      <main className="max-w-7xl mx-auto p-4">
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">Welcome back, {user?.name}!</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-base">You've earned <span className="text-indigo-600 dark:text-indigo-400 font-black">{user?.totalPoints || 0}</span> lifetime points.</p>
            </div>
            <div className="flex gap-3">
                <Link to="/leaderboard" className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-5 py-2.5 rounded-2xl font-bold hover:bg-amber-200 transition-all border border-amber-200 dark:border-amber-800/50">
                    <Trophy size={20} />
                    Leaderboard
                </Link>
                <Link to="/recommendation" className="flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-5 py-2.5 rounded-2xl font-bold hover:bg-indigo-200 transition-all border border-indigo-200 dark:border-indigo-800/50">
                    <Lightbulb size={20} />
                    Recommendations
                </Link>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: CALENDAR & STATS (4 cols) */}
          <section className="lg:col-span-4 space-y-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                        <CalendarIcon size={20} />
                    </div>
                    <h3 className="text-lg font-black tracking-tight dark:text-white">Pick a Date</h3>
                </div>
                <Calendar 
                    onChange={setSelectedDate} 
                    value={selectedDate}
                    className="border-none w-full custom-calendar dark:bg-slate-900 dark:text-slate-300"
                />
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200 dark:shadow-none relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <p className="text-indigo-100 font-black text-xs uppercase tracking-widest mb-1">Current Streak</p>
                        <h2 className="text-5xl font-black leading-none">{user?.currentStreak || 0} Days</h2>
                    </div>
                    <div className="bg-white/20 p-4 rounded-[1.5rem] backdrop-blur-md">
                        <Flame size={40} className="text-amber-300 fill-amber-300 animate-pulse" />
                    </div>
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black tracking-tight dark:text-white">Analytics</h3>
                    <TrendingUp size={20} className="text-emerald-500" />
                </div>
                <div className="h-64">
                    <ProductivityChart data={chartData} pieData={pieData} />
                </div>
            </motion.div>
          </section>

          {/* RIGHT COLUMN: TASKS SECTION (8 cols) */}
          <section className="lg:col-span-8 space-y-8">
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800 min-h-[700px] flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-2xl font-black tracking-tight dark:text-white">Daily Mission</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">
                        {selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
                  {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
                </span>
              </div>

              <form onSubmit={addTask} className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-10">
                <div className="md:col-span-5 relative group">
                    <input
                        type="text"
                        placeholder="What's your next win?"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all font-bold dark:text-white placeholder:text-slate-400"
                    />
                </div>
                <div className="md:col-span-3 relative flex gap-2">
                    <input
                        type="number"
                        min="0"
                        placeholder="Hrs"
                        value={estimatedHours}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || Number(val) >= 0) setEstimatedHours(val);
                        }}
                        className="w-full px-2 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold dark:text-white text-center"
                    />
                    <input
                        type="number"
                        min="0"
                        max="59"
                        placeholder="Mins"
                        value={estimatedTime}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || (Number(val) >= 0 && Number(val) <= 59)) setEstimatedTime(val);
                        }}
                        className="w-full px-2 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold dark:text-white text-center"
                    />
                </div>
                <div className="md:col-span-2 relative flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-3 group">
                    <Repeat size={16} className="text-slate-400 group-focus-within:text-indigo-500" />
                    <input
                        type="number"
                        min="1"
                        placeholder="Days"
                        value={repeatDays}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || Number(val) > 0) setRepeatDays(val);
                        }}
                        className="w-full bg-transparent border-none focus:ring-0 font-bold dark:text-white text-center p-0"
                        title="Repeat for how many days?"
                    />
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="md:col-span-2 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-2 transition-all hover:bg-indigo-700"
                >
                  <Plus size={20} />
                </motion.button>
              </form>

              <div className="space-y-4 flex-1 overflow-y-auto pr-3 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {tasks.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32 opacity-20 dark:opacity-10">
                      <Target size={64} className="mx-auto mb-6" />
                      <p className="font-black text-xl uppercase tracking-[0.2em]">Clear Horizon</p>
                    </motion.div>
                  ) : (
                    tasks.map(task => (
                      <motion.div 
                        key={task._id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`group flex items-center justify-between p-5 rounded-3xl border transition-all duration-300 ${
                            task.completed ? 
                            'bg-slate-50/50 dark:bg-slate-900/50 border-transparent opacity-60' : 
                            'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700/50 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none hover:border-indigo-100 dark:hover:border-indigo-500/30'
                        }`}
                      >
                        <div className="flex items-center gap-5 flex-1">
                          <motion.button 
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.8 }}
                            onClick={() => toggleComplete(task._id, task.completed)}
                          >
                            {task.completed ? 
                                <CheckCircle2 size={26} className="text-emerald-500" /> : 
                                <Circle size={26} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
                            }
                          </motion.button>
                          <div>
                            <span className={`text-base font-black block transition-all ${task.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100'}`}>
                                {task.title}
                            </span>
                            <div className="flex gap-4 text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500 mt-1.5 flex-wrap">
                                <span className="flex items-center gap-1.5"><CalendarIcon size={10} /> {new Date(task.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                <span className="flex items-center gap-1.5"><Target size={10} /> Est: {Math.floor(task.estimatedTime / 60)}h {task.estimatedTime % 60}m</span>
                                <span className="flex items-center gap-1.5 text-indigo-500 dark:text-indigo-400"><TrendingUp size={10} /> Act: {Math.floor(task.actualTime / 60)}h {task.actualTime % 60}m</span>
                                {task.points > 0 && <span className="text-amber-500 flex items-center gap-1.5"><Sparkles size={10} /> {task.points} pts</span>}
                                {task.status === 'in-progress' && task.startTime && (
                                    <span className="flex items-center gap-1.5"><TimerDisplay startTime={task.startTime} /></span>
                                )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {!task.completed && (
                                <div className="flex gap-2">
                                    {task.status === 'in-progress' ? (
                                        <motion.button 
                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: 1 }}
                                            onClick={() => stopTimer(task._id)}
                                            className="p-3 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl hover:bg-rose-200 transition-colors group/btn"
                                            title="Stop Timer"
                                        >
                                            <Square size={20} className="fill-current animate-pulse" />
                                        </motion.button>
                                    ) : (
                                        <motion.button 
                                            whileHover={{ scale: 1.1 }}
                                            onClick={() => startTimer(task._id)}
                                            className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl hover:bg-emerald-200 transition-colors"
                                            title="Start Timer"
                                        >
                                            <Play size={20} className="fill-current" />
                                        </motion.button>
                                    )}
                                </div>
                            )}
                            <button onClick={() => deleteTask(task._id)} className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all p-3">
                                <Trash2 size={20} />
                            </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </section>

        </div>
      </main>

      <AnimatePresence>
        {successMsg && (
            <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.5 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -100, scale: 1.5 }}
                className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center gap-2"
            >
                <div className="bg-indigo-600 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4 border-4 border-white dark:border-slate-800">
                    <Sparkles className="text-amber-300 fill-amber-300" />
                    <div>
                        <p className="text-2xl font-black italic">{successMsg.text}</p>
                        <p className="text-xs font-bold uppercase tracking-widest text-indigo-100">+{successMsg.points} Points Earned</p>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <MilestoneOverlay 
        milestone={milestone} 
        onClose={() => setMilestone(null)} 
      />
    </div>
  );
};

export default Dashboard;