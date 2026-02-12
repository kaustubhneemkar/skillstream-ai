
import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Mail, 
  Briefcase, 
  Target, 
  PlayCircle, 
  Settings, 
  ChevronRight,
  History,
  Dna,
  Rocket,
  Brain
} from 'lucide-react';
import { 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar
} from 'recharts';
import { Difficulty, FormatType, SkillCategory } from '../types';

const Profile: React.FC = () => {
  const { user, updateUser, assets } = useApp();

  const performanceData = useMemo(() => {
    return user.performanceHistory.map(p => {
      const asset = assets.find(a => a.id === p.assetId);
      return {
        name: asset ? (asset.title.length > 15 ? asset.title.substring(0, 15) + '...' : asset.title) : 'Deleted',
        fullName: asset ? asset.title : 'Deleted',
        score: p.score,
        timeSpent: p.timeSpent,
        date: new Date(p.completedAt).toLocaleDateString()
      };
    });
  }, [user.performanceHistory, assets]);

  const skillDNA = useMemo(() => {
    const avgScore = user.performanceHistory.length > 0 
      ? user.performanceHistory.reduce((a, b) => a + b.score, 0) / user.performanceHistory.length
      : 0;
    
    return [
      { subject: 'Velocity', A: 85, fullMark: 100 },
      { subject: 'Accuracy', A: avgScore || 20, fullMark: 100 },
      { subject: 'Persistence', A: 75, fullMark: 100 },
      { subject: 'Retention', A: 90, fullMark: 100 },
      { subject: 'Complexity', A: 65, fullMark: 100 },
    ];
  }, [user.performanceHistory]);

  const roles = [
    { title: 'AI Solutions Architect', progress: 42, color: 'bg-indigo-600' },
    { title: 'Machine Learning Engineer', progress: 68, color: 'bg-cyan-500' },
    { title: 'Full-Stack Developer (AI)', progress: 91, color: 'bg-emerald-500' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col md:flex-row gap-10 items-start md:items-center bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="relative group shrink-0">
          <img src={user.avatar} alt={user.name} className="w-40 h-40 rounded-[2.5rem] object-cover border-8 border-slate-50 shadow-2xl" />
          <button className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-3 rounded-2xl shadow-xl hover:scale-110 transition-transform"><Settings size={20} /></button>
        </div>
        
        <div className="space-y-4 flex-1">
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">{user.name}</h1>
            <span className="bg-indigo-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-indigo-600/20">L3 PROFICIENT</span>
          </div>
          <p className="text-slate-500 flex items-center gap-3 font-black uppercase text-xs tracking-widest">
            <Briefcase size={18} className="text-indigo-400" />
            {user.role} • {user.experienceLevel} Target
          </p>
          <div className="flex gap-3 pt-2">
            {['LLM Tuning', 'DevSecOps', 'Architecture'].map(tag => (
              <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-4 py-2 rounded-xl font-black uppercase tracking-widest border border-slate-200">#{tag}</span>
            ))}
          </div>
        </div>

        <div className="hidden lg:grid grid-cols-2 gap-6 w-80">
           <div className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 text-white">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Rank</p>
             <p className="text-4xl font-black">#12</p>
           </div>
           <div className="bg-indigo-600 p-6 rounded-[2rem] border border-indigo-500 text-white">
             <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-2">Points</p>
             <p className="text-4xl font-black">2.4k</p>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                <div>
                   <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                      <History size={28} className="text-indigo-600" />
                      Mastery & Retention Velocity
                   </h3>
                   <p className="text-sm text-slate-500 font-medium">Correlation of score accuracy vs time efficiency.</p>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-[1.5rem] border border-slate-100">
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-indigo-600 rounded-full" />
                      <span className="text-[10px] font-black text-slate-500 uppercase">Score</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                      <span className="text-[10px] font-black text-slate-500 uppercase">Efficiency</span>
                   </div>
                </div>
             </div>

             <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }} dy={10} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '2rem', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '24px' }} />
                    <Bar yAxisId="left" dataKey="score" fill="#4f46e5" radius={[10, 10, 0, 0]} barSize={48} />
                    <Line yAxisId="right" type="monotone" dataKey="timeSpent" stroke="#10b981" strokeWidth={5} dot={{ r: 8, fill: '#10b981', strokeWidth: 4, stroke: '#fff' }} />
                  </ComposedChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
             <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm">
                <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
                  <Dna size={24} className="text-indigo-600" />
                  Skill DNA Mapping
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillDNA}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                      <Radar name="DNA" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.5} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-8 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start gap-3">
                   <Brain size={18} className="text-indigo-600 mt-1 shrink-0" />
                   <p className="text-[10px] text-indigo-900 font-bold leading-relaxed">
                      AI INSIGHT: High 'Retention' scores suggest you should skip introductory modules and move directly to sandbox-based assessments.
                   </p>
                </div>
             </div>

             <div className="bg-slate-900 rounded-[3rem] p-10 shadow-2xl text-white">
                <h3 className="text-xl font-black mb-8 flex items-center gap-2">
                  <Rocket size={24} className="text-cyan-400" />
                  Readiness Index
                </h3>
                <div className="space-y-8">
                  {roles.map(role => (
                    <div key={role.title} className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-400">{role.title}</span>
                        <span className="text-white">{role.progress}% Match</span>
                      </div>
                      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full ${role.color} transition-all duration-1000`} style={{ width: `${role.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-10 py-5 bg-white text-slate-900 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                  Internal Marketplace Application
                </button>
             </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="bg-indigo-600 rounded-[3rem] p-10 shadow-2xl text-white relative overflow-hidden">
            <h3 className="text-2xl font-black mb-10 flex items-center gap-3 relative z-10">
              <Target size={28} />
              Upskilling Logic
            </h3>
            
            <div className="space-y-10 relative z-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Focus Sector</label>
                <select className="w-full bg-white/10 border border-white/20 rounded-[1.5rem] p-5 text-sm font-black focus:ring-4 focus:ring-white/20 transition-all outline-none appearance-none" value={user.targetCategory} onChange={(e) => updateUser({ targetCategory: e.target.value as SkillCategory })}>
                  {Object.values(SkillCategory).map(c => <option key={c} value={c} className="text-slate-900">{c}</option>)}
                </select>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Format Bias</label>
                <div className="grid grid-cols-1 gap-3">
                  {Object.values(FormatType).map((f) => (
                    <button key={f} onClick={() => updateUser({ preferredFormat: f })} className={`flex items-center gap-4 p-5 rounded-[1.5rem] text-sm font-black transition-all ${user.preferredFormat === f ? 'bg-white text-indigo-600 shadow-2xl scale-105' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'}`}>
                      <PlayCircle size={24} className={user.preferredFormat === f ? 'text-indigo-600' : 'text-indigo-300'} />
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full -mr-32 -mt-32" />
          </div>

          <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-2 uppercase tracking-widest text-xs">Access & Integrity</h3>
            <div className="space-y-6">
              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center gap-4">
                 <Mail size={24} className="text-slate-400" />
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Work Token</p>
                    <p className="text-sm font-black text-slate-900 truncate">{user.email}</p>
                 </div>
              </div>
              <button className="w-full flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] hover:bg-slate-100 transition-all group border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">🔔</div>
                  <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Notifications</span>
                </div>
                <ChevronRight size={20} className="text-slate-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
