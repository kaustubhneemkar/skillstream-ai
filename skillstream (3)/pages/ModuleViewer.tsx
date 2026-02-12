
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Play, 
  Award, 
  BrainCircuit,
  MessageCircle,
  X,
  Send,
  Monitor,
  FileText,
  PlayCircle
} from 'lucide-react';
import { FormatType } from '../types';

interface ModuleViewerProps {
  id: string;
  onBack: () => void;
}

const ModuleViewer: React.FC<ModuleViewerProps> = ({ id, onBack }) => {
  const { assets, addPerformance } = useApp();
  const [activeStep, setActiveStep] = useState<'learning' | 'assessment' | 'feedback'>('learning');
  const [activeFormat, setActiveFormat] = useState<FormatType>(FormatType.VIDEO);
  const [showCoach, setShowCoach] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());

  const asset = assets.find(a => a.id === id);

  useEffect(() => {
    if (asset) setActiveFormat(asset.format);
  }, [asset]);

  if (!asset) return <div>Asset not found</div>;

  const handleComplete = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000 / 60);
    const simulatedScore = Math.floor(Math.random() * 41) + 60;
    setScore(simulatedScore);
    
    addPerformance({
      assetId: asset.id,
      score: simulatedScore,
      timeSpent,
      completedAt: new Date().toISOString(),
      retries: 0
    });
    
    setActiveStep('feedback');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-indigo-600 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{asset.title}</h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{asset.category} • {asset.difficulty}</p>
          </div>
        </div>

        {/* Multi-Modal Switcher */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
           {[FormatType.VIDEO, FormatType.TEXT, FormatType.INTERACTIVE].map(fmt => (
             <button
              key={fmt}
              onClick={() => setActiveFormat(fmt)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeFormat === fmt ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
             >
               {fmt === FormatType.VIDEO ? <PlayCircle size={14} /> : fmt === FormatType.TEXT ? <FileText size={14} /> : <Monitor size={14} />}
               <span className="hidden sm:inline">{fmt}</span>
             </button>
           ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          {activeStep === 'learning' && (
            <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-2xl min-h-[600px] flex flex-col">
              <div className="flex-1 p-0">
                {activeFormat === FormatType.VIDEO ? (
                  <div className="aspect-video bg-black flex items-center justify-center">
                    <iframe className="w-full h-full" src={asset.content.includes('http') ? asset.content : 'https://www.youtube.com/embed/dQw4w9WgXcQ'} frameBorder="0" allowFullScreen />
                  </div>
                ) : activeFormat === FormatType.INTERACTIVE ? (
                  <div className="h-[500px] bg-slate-900 p-10 font-mono text-emerald-400 flex flex-col">
                     <div className="flex items-center justify-between mb-8 border-b border-slate-700 pb-4">
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-sans font-black">Secure Shell Sandbox</span>
                        <div className="flex gap-2">
                           <div className="w-3 h-3 bg-rose-500 rounded-full" />
                           <div className="w-3 h-3 bg-amber-500 rounded-full" />
                           <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                        </div>
                     </div>
                     <p className="mb-2 text-indigo-400">$ skillstream --init --module={asset.id}</p>
                     <p className="mb-2 text-slate-400 italic">>> Authenticating corporate identity...</p>
                     <p className="mb-4 text-emerald-500">>> Connection established. Running terminal-L4.</p>
                     <div className="mt-8 space-y-4">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white">
                           Analyze the stack trace below and identify the memory leak.
                        </div>
                     </div>
                  </div>
                ) : (
                  <div className="p-16 prose prose-slate max-w-none">
                    <h2 className="text-4xl font-black mb-8 text-slate-900 tracking-tight">{asset.title}</h2>
                    <div className="text-slate-600 leading-relaxed text-lg space-y-6">
                      <p>Corporate upskilling requires more than passive consumption. In this module, we dive deep into the fundamental architectures that drive modern enterprise solutions.</p>
                      <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100">
                        <h4 className="font-black text-indigo-900 mb-2">Key Learning Point</h4>
                        <p className="text-indigo-700">Efficiency is measured not by hours spent, but by retention of core logic patterns. Focus on the *why* of the architecture.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 p-8 flex items-center justify-between border-t border-slate-200">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                  <Clock size={16} />
                  <span>Module Time Remaining: 12:44</span>
                </div>
                <button 
                  onClick={() => setActiveStep('assessment')}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-[1.5rem] font-black shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-3"
                >
                  Confirm Mastery
                  <CheckCircle2 size={20} />
                </button>
              </div>
            </div>
          )}

          {activeStep === 'assessment' && (
            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-16 shadow-2xl animate-in slide-in-from-bottom-8 duration-700">
               <div className="max-w-2xl mx-auto space-y-12">
                  <div className="text-center space-y-4">
                    <BrainCircuit size={64} className="mx-auto text-indigo-600 mb-4" />
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Adaptive Knowledge Check</h2>
                    <p className="text-slate-500 font-medium">Demonstrate your understanding of the core concepts.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-6">
                       <p className="font-black text-slate-900 text-xl leading-tight">Based on the module's logic, which architectural decision best minimizes latency in high-traffic scenarios?</p>
                       <div className="space-y-3">
                          {['Horizontal Scaling', 'Event-Driven Bus', 'Synchronous Calls', 'Manual Indexing'].map((opt, i) => (
                            <label key={i} className="flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:border-indigo-600 hover:bg-indigo-50/30 transition-all">
                               <input type="radio" name="check" className="w-5 h-5 text-indigo-600 ring-offset-2" />
                               <span className="text-slate-700 font-black text-sm">{opt}</span>
                            </label>
                          ))}
                       </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleComplete}
                    className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-xl hover:bg-black transition-all shadow-2xl"
                  >
                    Lock In Answers
                  </button>
               </div>
            </div>
          )}

          {activeStep === 'feedback' && (
             <div className="bg-white rounded-[3rem] border border-slate-200 p-16 shadow-2xl text-center space-y-10 animate-in zoom-in duration-500">
                <div className="w-32 h-32 bg-emerald-500 text-white rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20 rotate-12">
                   <Award size={64} />
                </div>
                <div className="space-y-4">
                   <h2 className="text-5xl font-black text-slate-900 tracking-tight">Certification Earned!</h2>
                   <p className="text-slate-500 font-medium text-xl">You've reached the 'Proficient' milestone for this asset.</p>
                </div>
                <div className="flex justify-center gap-8 py-8 border-y border-slate-100">
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Score</p>
                      <p className="text-4xl font-black text-slate-900">{score}%</p>
                   </div>
                   <div className="w-px h-12 bg-slate-100" />
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Retention</p>
                      <p className="text-4xl font-black text-indigo-600">High</p>
                   </div>
                </div>
                <button onClick={onBack} className="bg-indigo-600 text-white px-12 py-5 rounded-[2rem] font-black text-xl hover:bg-indigo-500 shadow-xl shadow-indigo-600/30">
                  Continue Roadmap
                </button>
             </div>
          )}
        </div>

        {/* Sidebar info */}
        <div className="space-y-8">
          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl">
             <h3 className="font-black text-lg mb-6 flex items-center gap-2">
                <Award size={22} className="text-indigo-200" />
                Proof of Learning
             </h3>
             <div className="space-y-4 text-sm font-medium text-indigo-100">
                <p>This module provides verifiable credits toward the <span className="text-white font-bold">L2 AI Architect</span> certification.</p>
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                   <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">Blockchain Hash</p>
                   <p className="font-mono text-[9px] break-all opacity-60">0x7f4e2a...b9c1d0f</p>
                </div>
             </div>
          </div>

          <button 
            onClick={() => setShowCoach(true)}
            className="w-full p-6 bg-white border-2 border-dashed border-indigo-200 rounded-[2rem] text-indigo-600 font-black text-sm flex items-center justify-center gap-3 hover:bg-indigo-50 transition-all"
          >
             <MessageCircle size={24} />
             Invoke AI Coach
          </button>
        </div>
      </div>

      {/* AI Coach Sidebar Overlay */}
      {showCoach && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
              <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500 rounded-xl">
                       <BrainCircuit size={24} />
                    </div>
                    <div>
                       <h4 className="font-black text-lg leading-tight">AI Learning Coach</h4>
                       <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">Real-time Context Engine</p>
                    </div>
                 </div>
                 <button onClick={() => setShowCoach(false)} className="text-slate-400 hover:text-white"><X size={24} /></button>
              </div>

              <div className="flex-1 p-8 overflow-y-auto space-y-8">
                 <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">🤖</div>
                    <div className="bg-slate-50 p-6 rounded-3xl rounded-tl-none border border-slate-100">
                       <p className="text-sm text-slate-800 leading-relaxed">
                          Hi {useApp().user.name.split(' ')[0]}! I'm your contextual tutor. I've analyzed this module on <span className="font-bold">{asset.title}</span>. 
                          <br /><br />
                          How can I help you master this concept faster?
                       </p>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mastery Accelerators</p>
                    <div className="grid grid-cols-1 gap-2">
                       {['Explain this to me like I\'m 5', 'Give me a real-world analogy', 'Why is this important for my role?', 'Test my knowledge now'].map(p => (
                         <button key={p} className="text-left p-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 hover:border-indigo-600 hover:bg-indigo-50 transition-all">
                           {p}
                         </button>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="p-8 border-t border-slate-100 bg-slate-50">
                 <div className="relative">
                    <input className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-6 pr-14 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="Ask the coach anything..." />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-2 rounded-xl">
                       <Send size={20} />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ModuleViewer;
