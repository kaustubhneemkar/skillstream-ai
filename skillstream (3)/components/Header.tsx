
import React from 'react';
import { Bell, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  onNavigate: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const { user } = useApp();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="relative w-96 hidden lg:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search learning assets..." 
          className="w-full bg-slate-50 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-slate-500 hover:text-indigo-600 transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full text-[10px] text-white flex items-center justify-center">2</span>
        </button>
        
        <div className="h-8 w-px bg-slate-200" />

        <button 
          onClick={() => onNavigate('profile')}
          className="flex items-center gap-3 hover:bg-slate-50 p-1.5 rounded-lg transition-all"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 leading-none">{user.name}</p>
            <p className="text-[10px] font-medium text-slate-500 mt-1 uppercase tracking-wider">{user.role}</p>
          </div>
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-9 h-9 rounded-full object-cover border-2 border-slate-100 shadow-sm"
          />
        </button>
      </div>
    </header>
  );
};

export default Header;
