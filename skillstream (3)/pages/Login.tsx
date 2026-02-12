
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Zap, Mail, Lock, ArrowRight } from 'lucide-react';

const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const { login } = useApp();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
    onLogin();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-indigo-600 p-3 rounded-2xl text-white mb-4 shadow-lg shadow-indigo-500/30">
            <Zap size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 mt-2">Sign in to your SkillStream account</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com" 
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl pl-12 pr-4 py-3.5 focus:bg-white focus:border-indigo-500 transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1 flex justify-between">
                Password
                <span className="text-xs text-indigo-600 hover:underline cursor-pointer">Forgot?</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl pl-12 pr-4 py-3.5 focus:bg-white focus:border-indigo-500 transition-all outline-none"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 group transition-all"
            >
              Sign In
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center text-sm text-slate-500">
            Don't have an account? <span className="text-indigo-600 font-bold hover:underline cursor-pointer">Contact your HR</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
           <p className="text-xs text-center text-slate-400 font-medium">DEMO LOGINS</p>
           <div className="flex justify-center gap-4">
              <button 
                onClick={() => setEmail('alex.rivera@skillstream.ai')}
                className="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded-md text-slate-500 hover:bg-slate-50"
              >
                Login as Alex (Employee)
              </button>
              <button 
                onClick={() => setEmail('sarah.chen@skillstream.ai')}
                className="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded-md text-slate-500 hover:bg-slate-50"
              >
                Login as Sarah (Admin)
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
