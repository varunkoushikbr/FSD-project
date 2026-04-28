import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Send, Sparkles, CheckCircle, BrainCircuit, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import Navbar from '../components/Navbar';

const Recommendation = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    role: 'student',
    studyHours: '',
    focusArea: '',
    difficulty: 'medium',
    goal: ''
  });
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Update user profile first
      await api.put('/auth/profile', { role: formData.role });
      
      // Simulate AI recommendation logic
      setTimeout(() => {
        const recs = {
          student: [
            { title: `Deep Study: ${formData.focusArea || 'Core Subjects'}`, time: 120 },
            { title: "Review past notes & Active Recall", time: 30 },
            { title: "Feynman Technique: Explain difficult concepts", time: 45 },
            { title: "Practice problem sets / quizzes", time: 60 }
          ],
          professional: [
            { title: `Deep Work: ${formData.focusArea || 'Main Project'}`, time: 120 },
            { title: "Inbox Zero & Communication batching", time: 30 },
            { title: "Strategic planning for tomorrow", time: 15 },
            { title: "Skill development / Reading", time: 45 }
          ],
          other: [
            { title: `Focused Session: ${formData.focusArea || 'Primary Goal'}`, time: 90 },
            { title: "Review progress and adjust plan", time: 20 },
            { title: "Skill building", time: 45 }
          ]
        };
        
        setRecommendation(recs[formData.role] || recs.other);
        setLoading(false);
        setStep(6);
      }, 1500);
    } catch (err) {
      console.error('Failed to submit');
      setLoading(false);
    }
  };

  const handleAddAllToDashboard = async () => {
    setAdding(true);
    try {
        const localDateStr = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
        
        // Add each recommended task
        for (const task of recommendation) {
            await api.post('/tasks', {
                title: task.title,
                estimatedTime: task.time,
                date: localDateStr,
                days: 1
            });
        }
        
        navigate('/');
    } catch (err) {
        console.error('Failed to add tasks');
        setAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-sm transition-colors duration-300">
      <Navbar />
      <main className="max-w-2xl mx-auto p-6">
        <Link to="/" className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-8 font-black uppercase tracking-widest text-[10px]">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-12 shadow-sm border border-slate-100 dark:border-slate-800 min-h-[550px] flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100 dark:bg-slate-800">
            <motion.div 
              className="h-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]"
              initial={{ width: '0%' }}
              animate={{ width: `${(step / 6) * 100}%` }}
            />
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-3xl font-black mb-8 dark:text-white">What's your current path?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['student', 'professional', 'other'].map(role => (
                    <button 
                      key={role}
                      onClick={() => { setFormData({...formData, role}); handleNext(); }}
                      className={`p-8 rounded-3xl border-2 font-black capitalize transition-all text-lg ${formData.role === role ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'border-slate-100 dark:border-slate-800 dark:text-slate-300 hover:border-indigo-200 dark:hover:border-indigo-800'}`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-3xl font-black mb-8 dark:text-white">Daily dedication?</h2>
                <div className="relative">
                    <input 
                      type="number" 
                      placeholder="e.g. 4" 
                      className="w-full p-6 pr-24 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 text-2xl font-black focus:ring-4 focus:ring-indigo-500/10 outline-none dark:text-white placeholder:text-slate-400"
                      value={formData.studyHours}
                      onChange={(e) => setFormData({...formData, studyHours: e.target.value})}
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-slate-400 uppercase tracking-widest text-xs">Hours</span>
                </div>
                <button onClick={handleNext} className="mt-10 w-full bg-indigo-600 text-white p-5 rounded-3xl font-black text-lg shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all">Continue</button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-3xl font-black mb-8 dark:text-white">Main focus area?</h2>
                <input 
                  type="text" 
                  placeholder="e.g. Deep Learning, Physics" 
                  className="w-full p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 text-xl font-black focus:ring-4 focus:ring-indigo-500/10 outline-none dark:text-white placeholder:text-slate-400"
                  value={formData.focusArea}
                  onChange={(e) => setFormData({...formData, focusArea: e.target.value})}
                />
                <button onClick={handleNext} className="mt-10 w-full bg-indigo-600 text-white p-5 rounded-3xl font-black text-lg shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all">Next</button>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-3xl font-black mb-8 dark:text-white">Choose Intensity</h2>
                <div className="space-y-4">
                  {['low', 'medium', 'high'].map(d => (
                    <button 
                      key={d}
                      onClick={() => { setFormData({...formData, difficulty: d}); handleNext(); }}
                      className={`w-full p-5 rounded-3xl border-2 font-black capitalize transition-all text-lg ${formData.difficulty === d ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'border-slate-100 dark:border-slate-800 dark:text-slate-300 hover:border-indigo-200 dark:hover:border-indigo-800'}`}
                    >
                      {d} Intensity
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-3xl font-black mb-8 dark:text-white">Your ultimate goal?</h2>
                <textarea 
                  placeholder="e.g. Launching my first startup" 
                  className="w-full p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 text-lg font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none dark:text-white h-40 placeholder:text-slate-400"
                  value={formData.goal}
                  onChange={(e) => setFormData({...formData, goal: e.target.value})}
                />
                <button 
                  onClick={handleSubmit} 
                  disabled={loading}
                  className="mt-10 w-full bg-indigo-600 text-white p-5 rounded-3xl font-black text-lg shadow-xl shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-3 transition-all hover:bg-indigo-700"
                >
                  {loading ? 'Analyzing Profile...' : 'Generate My Action Plan'} <Sparkles size={22} />
                </button>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div key="step6" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="text-center mb-10">
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle size={40} />
                    </div>
                    <h2 className="text-4xl font-black dark:text-white">Your Action Plan</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">Customized for your {formData.role} path</p>
                </div>
                
                <div className="space-y-4 mb-10">
                    {recommendation?.map((rec, i) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={i} 
                            className="flex gap-5 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800"
                        >
                            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black shrink-0">
                                {i + 1}
                            </div>
                            <div className="flex flex-col justify-center">
                                <p className="font-bold text-slate-700 dark:text-slate-200 leading-relaxed">{rec.title}</p>
                                <p className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mt-1">{Math.floor(rec.time/60)}h {rec.time%60}m</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="flex gap-4">
                    <button 
                      onClick={() => navigate('/')} 
                      className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-5 rounded-3xl font-black text-lg shadow-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                    >
                      Maybe Later
                    </button>
                    <button 
                      onClick={handleAddAllToDashboard}
                      disabled={adding}
                      className="flex-[2] bg-indigo-600 text-white p-5 rounded-3xl font-black text-lg shadow-xl flex justify-center items-center gap-2 hover:bg-indigo-700 transition-all"
                    >
                      {adding ? 'Adding...' : 'Add All to Dashboard'} <Plus size={20} />
                    </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Recommendation;