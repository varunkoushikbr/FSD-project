import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Flame, 
  Trophy, 
  CheckCircle, 
  PieChart, 
  ChevronLeft, 
  Edit3,
  Rocket,
  Crown,
  LayoutDashboard,
  LogOut,
  Target
} from 'lucide-react';
import api from '../services/api';
import { Card, StatBox, Button, Badge } from '../components/ui';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [totalTasks, setTotalTasks] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, tasksRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/tasks')
        ]);
        setUser(userRes.data);
        setTotalTasks(tasksRes.data.filter(t => t.completed).length);
        setLoading(false);
      } catch (err) {
        navigate('/login');
      }
    };
    fetchData();
  }, [navigate]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  );

  const milestones = [
    { days: 7, label: 'Week Warrior', icon: Flame, color: 'orange' },
    { days: 30, label: 'Monthly Master', icon: Trophy, color: 'amber' },
    { days: 100, label: 'Century Legend', icon: Crown, color: 'rose' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-12">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10 shadow-sm mb-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary-600 p-2 rounded-xl text-white">
              <Target size={24} />
            </div>
            <span className="text-xl font-black text-slate-800 tracking-tight">FocusUp</span>
          </div>
          
          <div className="flex items-center gap-6">
            <Link to="/" className="text-slate-600 hover:text-primary-600 font-medium flex items-center gap-2">
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link to="/profile" className="text-primary-600 font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-600 rounded-full" /> Profile
            </Link>
            <Button onClick={handleLogout} variant="ghost" icon={LogOut}>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto w-full px-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 bg-white p-8 rounded-3xl shadow-soft border border-slate-100">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-tr from-primary-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-5xl font-black shadow-lg">
              {user.name.charAt(0)}
            </div>
            <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border border-slate-100 text-slate-600">
              <Edit3 size={18} />
            </div>
          </div>
          
          <div className="text-center md:text-left flex-1">
            <h2 className="text-3xl font-black text-slate-800 mb-1">{user.name}</h2>
            <p className="text-slate-500 font-medium mb-4">{user.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
               <Badge type="success">Member since 2026</Badge>
               <Badge type="warning">Pro Account</Badge>
            </div>
          </div>

          <Button variant="secondary" icon={Edit3}>
            Edit Profile
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatBox label="Current Streak" value={user.currentStreak} icon={Flame} color="orange" />
          <StatBox label="Longest Streak" value={user.longestStreak} icon={Trophy} color="amber" />
          <StatBox label="Completed" value={totalTasks} icon={CheckCircle} color="emerald" />
          <StatBox label="Success Rate" value="92%" icon={PieChart} color="blue" />
        </div>

        {/* Milestones Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Rocket className="text-primary-600" size={24} />
            <h3 className="text-2xl font-black text-slate-800">Streak Milestones</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {milestones.map((m) => {
              const isUnlocked = user.longestStreak >= m.days;
              const Icon = m.icon;
              
              return (
                <Card 
                  key={m.days} 
                  className={`relative overflow-hidden transition-all duration-500 ${isUnlocked ? 'milestone-unlocked' : 'milestone-locked'}`}
                >
                  <div className="relative z-10 flex flex-col items-center py-4">
                    <div className={`p-4 rounded-2xl mb-4 ${isUnlocked ? `bg-${m.color}-50 text-${m.color}-600` : 'bg-slate-200 text-slate-400'}`}>
                      <Icon size={40} strokeWidth={2.5} />
                    </div>
                    <h4 className="text-xl font-black text-slate-800 mb-1">{m.days} Days</h4>
                    <p className="text-sm font-bold text-slate-500 mb-6">{m.label}</p>
                    
                    {isUnlocked ? (
                      <Badge type="success">Unlocked</Badge>
                    ) : (
                      <Badge type="locked">Locked</Badge>
                    )}
                  </div>
                  
                  {isUnlocked && (
                    <div className="absolute top-0 right-0 p-2">
                       <div className="bg-emerald-500 text-white p-1 rounded-full shadow-sm">
                          <CheckCircle size={14} strokeWidth={4} />
                       </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
