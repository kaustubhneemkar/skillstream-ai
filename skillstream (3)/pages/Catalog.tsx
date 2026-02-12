
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Filter, PlayCircle, FileText, Code, Clock, ChevronRight } from 'lucide-react';
import { SkillCategory, Difficulty, FormatType } from '../types';

interface CatalogProps {
  onNavigate: (page: string, params?: any) => void;
}

const Catalog: React.FC<CatalogProps> = ({ onNavigate }) => {
  const { assets } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'All'>('All');

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          asset.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || asset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getFormatIcon = (format: FormatType) => {
    switch (format) {
      case FormatType.VIDEO: return <PlayCircle size={18} />;
      case FormatType.TEXT: return <FileText size={18} />;
      case FormatType.INTERACTIVE: return <Code size={18} />;
    }
  };

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case Difficulty.BEGINNER: return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case Difficulty.INTERMEDIATE: return 'bg-amber-50 text-amber-700 border-amber-100';
      case Difficulty.ADVANCED: return 'bg-rose-50 text-rose-700 border-rose-100';
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Learning Catalog</h1>
          <p className="text-slate-500">Explore our full library of training assets.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Filter assets..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 w-64"
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-indigo-600 transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {['All', ...Object.values(SkillCategory)].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat as any)}
            className={`px-5 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all border ${
              selectedCategory === cat 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-500'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.map((asset) => (
          <div 
            key={asset.id} 
            className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="h-40 bg-slate-100 relative overflow-hidden">
               <img src={`https://picsum.photos/seed/${asset.id}/400/200`} alt={asset.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
               <div className="absolute top-4 left-4 flex gap-2">
                 <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${getDifficultyColor(asset.difficulty)}`}>
                   {asset.difficulty}
                 </span>
               </div>
               <div className="absolute bottom-4 left-4">
                  <span className="bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 uppercase">
                    {getFormatIcon(asset.format)}
                    {asset.format}
                  </span>
               </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{asset.category}</p>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{asset.title}</h3>
              </div>
              
              <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{asset.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                  <Clock size={14} />
                  <span>{asset.estimatedTime} mins</span>
                </div>
                
                <button 
                  onClick={() => onNavigate('module', { id: asset.id })}
                  className="flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-all"
                >
                  View Content
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAssets.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-500 font-medium">No assets found matching your criteria.</p>
          <button onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }} className="text-indigo-600 font-bold mt-2">Clear filters</button>
        </div>
      )}
    </div>
  );
};

export default Catalog;
