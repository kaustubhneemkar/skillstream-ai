
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Settings, 
  ShieldAlert,
  BarChart3,
  Users
} from 'lucide-react';
import { Difficulty, FormatType, SkillCategory } from '../types';

const Admin: React.FC = () => {
  const { assets, addAsset, deleteAsset } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAsset, setNewAsset] = useState({
    title: '',
    description: '',
    category: SkillCategory.SOFTWARE_ENG,
    difficulty: Difficulty.BEGINNER,
    format: FormatType.TEXT,
    estimatedTime: 30,
    content: ''
  });

  const heatmapData = [
    { cat: 'AI', engineering: 85, hr: 30, product: 65 },
    { cat: 'Cloud', engineering: 92, hr: 12, product: 45 },
    { cat: 'DevOps', engineering: 78, hr: 5, product: 30 },
  ];

  const handleAdd = () => {
    addAsset({
      ...newAsset,
      id: Math.random().toString(36).substr(2, 9)
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Governance Hub</h1>
          <p className="text-slate-500 font-medium">Enterprise skill liquidity and asset management.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-[2rem] font-black flex items-center gap-3 shadow-2xl shadow-indigo-600/30 transition-all"
        >
          <Plus size={22} />
          Append Learning Asset
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          {/* Skill Heatmap */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm">
             <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
                <BarChart3 size={24} className="text-indigo-600" />
                Departmental Skill Heatmap
             </h3>
             <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1" />
                <div className="text-[10px] font-black text-slate-400 uppercase text-center">Engineering</div>
                <div className="text-[10px] font-black text-slate-400 uppercase text-center">Product</div>
                <div className="text-[10px] font-black text-slate-400 uppercase text-center">HR/Ops</div>
                
                {heatmapData.map(row => (
                  <React.Fragment key={row.cat}>
                    <div className="text-xs font-black text-slate-900 flex items-center">{row.cat}</div>
                    <div className={`h-12 rounded-xl flex items-center justify-center font-black text-xs ${row.engineering > 80 ? 'bg-emerald-500 text-white' : 'bg-emerald-200 text-emerald-800'}`}>{row.engineering}%</div>
                    <div className={`h-12 rounded-xl flex items-center justify-center font-black text-xs ${row.product > 50 ? 'bg-amber-400 text-amber-900' : 'bg-amber-100 text-amber-800'}`}>{row.product}%</div>
                    <div className={`h-12 rounded-xl flex items-center justify-center font-black text-xs ${row.hr > 20 ? 'bg-rose-400 text-rose-900' : 'bg-rose-100 text-rose-800'}`}>{row.hr}%</div>
                  </React.Fragment>
                ))}
             </div>
             <p className="mt-8 text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center italic">
                Data generated from real-time employee assessment metrics.
             </p>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-slate-900">Asset Inventory ({assets.length})</h3>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" placeholder="Filter inventory..." className="bg-slate-50 border-none rounded-2xl pl-12 pr-6 py-3 text-sm focus:ring-2 focus:ring-indigo-500 w-80 font-medium" />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-black">
                  <tr>
                    <th className="px-8 py-6">Identity</th>
                    <th className="px-8 py-6">Discipline</th>
                    <th className="px-8 py-6">Complexity</th>
                    <th className="px-8 py-6">Format</th>
                    <th className="px-8 py-6 text-right">Ops</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="font-black text-slate-900 text-sm">{asset.title}</div>
                        <div className="text-[10px] text-slate-400 font-bold truncate max-w-xs">{asset.description}</div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-black text-slate-600 bg-slate-100 px-3 py-1 rounded-lg uppercase tracking-widest">{asset.category}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-[10px] font-black px-3 py-1 rounded-lg border uppercase tracking-widest ${
                          asset.difficulty === Difficulty.BEGINNER ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          asset.difficulty === Difficulty.INTERMEDIATE ? 'bg-amber-50 text-amber-700 border-amber-100' :
                          'bg-rose-50 text-rose-700 border-rose-100'
                        }`}>
                          {asset.difficulty}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">{asset.format}</td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl shadow-sm transition-all border border-transparent hover:border-slate-100"><Edit3 size={18} /></button>
                          <button onClick={() => deleteAsset(asset.id)} className="p-3 text-slate-400 hover:text-rose-500 hover:bg-white rounded-xl shadow-sm transition-all border border-transparent hover:border-slate-100"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl">
             <div className="flex items-center gap-3 text-amber-400 mb-6">
                <ShieldAlert size={24} />
                <h3 className="font-black text-lg">Logic Core</h3>
             </div>
             <div className="space-y-6">
               <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Completion ROI</p>
                  <p className="text-3xl font-black">74.2%</p>
               </div>
               <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <Users size={20} className="text-indigo-400" />
                     <span className="text-xs font-bold text-slate-300">Active Learners</span>
                  </div>
                  <span className="text-xl font-black">1.2k</span>
               </div>
             </div>
             <button className="w-full mt-10 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-[1.5rem] text-sm font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/30">
               Global Controls
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
