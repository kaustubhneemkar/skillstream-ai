
import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Radar, RadarChart, PolarGrid, PolarAngleAxis 
} from 'recharts';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Award, 
  PlayCircle,
  TrendingUp,
  Brain,
  Zap,
  Coffee,
  Users,
  MessageSquare
} from 'lucide-react';
import { calculateFatigue } from '../services/adaptiveEngine';

interface DashboardProps {
  onNavigate: (page: string, params?: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user, learningPath } = useApp();

  const currentStep = learningPath.find(s => s.status === 'current');
  const completedSteps = learningPath.filter(s => s.status === 'completed');
  const progressPercent = Math.round((completedSteps.length / learningPath.length) * 100) || 0;
  
  const fatigue = useMemo(() => calculateFatigue(user), [user]);

  const peers = [
    { name: 'Sarah L.', role: 'AI Specialist', avatar: 'https://i.pravatar.cc/150?u=sarah', online: true },
    { name: 'Marcus K.', role: 'Cloud Lead', avatar: 'https://i.pravatar.cc/150?u=marcus', online: false },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            Skill Pulse: {user.name.split(' ')[0]} 
            <Zap size={24} className="text-amber-500 fill-amber-500" />
          </h1>
          <p className="text-slate-500 font-medium italic">"The best way to predict the future is to create it."</p>
        </div>
        
        {/* Fatigue Monitor */}
        <div className={`p-4 rounded-[2rem] border transition-all flex items-center gap-4 ${
          fatigue > 70 ? 'bg-rose-50 border-rose-100' : 'bg-white border-slate-200'
        }`}>
          <div className={`p-2 rounded-xl ${fatigue > 70 ? 'bg-rose-500 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
            <Coffee size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cognitive Load</p>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-black ${fatigue > 70 ? 'text-rose-600' : 'text-slate-900'}`}>{fatigue}%</span>
              <span className="text-[10px] text-slate-400 font-bold">{fatigue > 70 ? 'BREAK SUGGESTED' : 'OPTIMAL'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          {/* Active Module Card */}
          {currentStep ? (
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10 grid md:grid-cols-3 gap-8 items-center">
                <div className="md:col-span-2 space-y-6">
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-indigo-500 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                      Active Target
                    </span>
                    <span className="bg-white/10 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/10">
                      {currentStep.asset.difficulty}
                    </span>
                  </div>
                  <h2 className="text-4xl font-black tracking-tight leading-none">{currentStep.asset.title}</h2>
                  
                  {currentStep.recommendationReason && (
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-start gap-3">
                      <Brain size={18} className="text-indigo-400 shrink-0 mt-1" />
                      <p className="text-sm text-indigo-100 font-medium">
                        <span className="font-bold text-white">AI Logic:</span> {currentStep.recommendationReason}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button 
                      onClick={() => onNavigate('module', { id: currentStep.asset.id })}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 transition-all shadow-xl shadow-indigo-600/30 group"
                    >
                      <PlayCircle size={22} className="group-hover:scale-110 transition-transform" />
                      Resume Sprint
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center p-8 bg-white/5 rounded-[2rem] border border-white/10 text-center">
                  <div className="relative w-24 h-24 mb-4">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle className="text-white/10 stroke-current" strokeWidth="8" fill="transparent" r="40" cx="50" cy="50" />
                      <circle className="text-indigo-400 stroke-current" strokeWidth="8" strokeDasharray="180, 251" strokeLinecap="round" fill="transparent" r="40" cx="50" cy="50" transform="rotate(-90 50 50)" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-black">72%</span>
                    </div>
                  </div>
                  <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Readiness</p>
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-600/20 blur-[100px] rounded-full" />
            </div>
          ) : null}

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
              <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2">
                <Users size={20} className="text-indigo-600" />
                Collaborative Synergy
              </h3>
              <div className="space-y-4">
                {peers.map((peer, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-lg transition-all">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={peer.avatar} className="w-10 h-10 rounded-xl object-cover" />
                        {peer.online && <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{peer.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{peer.role}</p>
                      </div>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                      <MessageSquare size={18} />
                    </button>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-[10px] text-slate-400 font-bold uppercase leading-relaxed">
                Matched via Peer-to-Skill Algorithm
              </p>
            </div>

            <div className="bg-indigo-600 rounded-[2rem] p-8 shadow-xl text-white">
              <h3 className="font-black mb-6 flex items-center gap-2">
                <Award size={20} />
                Skill Velocity
              </h3>
              <div className="h-40 w-full bg-white/10 rounded-2xl flex items-center justify-center">
                 <div className="text-center">
                    <p className="text-4xl font-black">+12%</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-100">Weekly Proficiency</p>
                 </div>
              </div>
              <button className="w-full mt-6 py-3 bg-white text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg">
                View Deep Report
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
            <h3 className="font-black text-slate-900 mb-6 uppercase text-xs tracking-widest">Roadmap Status</h3>
            <div className="space-y-6">
              {learningPath.map((step, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    step.status === 'completed' ? 'bg-emerald-500' : 
                    step.status === 'current' ? 'bg-indigo-600 animate-pulse' : 'bg-slate-200'
                  }`} />
                  <div className="flex-1">
                    <p className={`text-xs font-bold truncate ${step.status === 'locked' ? 'text-slate-400' : 'text-slate-900'}`}>{step.asset.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
