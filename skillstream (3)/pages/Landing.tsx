
import React from 'react';
import { Zap, Target, TrendingUp, Users, ArrowRight } from 'lucide-react';

const Landing: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className="bg-slate-900 min-h-screen text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-4 py-1.5 rounded-full text-sm font-medium">
              <Zap size={16} />
              <span>Next-Gen Enterprise Learning</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Upskill at the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Speed of Change</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
              SkillStream is a smart, adaptive workforce engine that personalizes professional training based on real-time performance and behavior. No more one-size-fits-all training.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={onStart}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 transition-all shadow-xl shadow-indigo-600/20 group"
              >
                Launch Experience
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-2xl font-semibold border border-slate-700 transition-all">
                View Enterprise Demo
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-3xl blur opacity-25" />
            <div className="relative bg-slate-800 rounded-3xl border border-slate-700 p-2 shadow-2xl">
              <img 
                src="https://picsum.photos/seed/dashboard/800/600" 
                alt="Dashboard Preview" 
                className="rounded-2xl opacity-90"
              />
            </div>
          </div>
        </div>
        
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full -mr-64 -mt-32" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 blur-[120px] rounded-full -ml-64 -mb-32" />
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-slate-800/50">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Built for the Modern Workforce</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Dynamic paths that adjust automatically as your employees grow.</p>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { 
              icon: Target, 
              title: 'Adaptive Logic', 
              desc: 'Our engine identifies knowledge gaps and performance peaks to reorder learning paths instantly.' 
            },
            { 
              icon: TrendingUp, 
              title: 'Progress Insights', 
              desc: 'Granular tracking of skill proficiency, speed, and accuracy across multiple technology domains.' 
            },
            { 
              icon: Users, 
              title: 'Collaborative Growth', 
              desc: 'Align individual learning goals with company-wide strategic objectives and skill gaps.' 
            }
          ].map((f, i) => (
            <div key={i} className="bg-slate-800 p-8 rounded-3xl border border-slate-700 hover:border-indigo-500/50 transition-all group">
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 flex items-center justify-center rounded-2xl mb-6 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                <f.icon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;
