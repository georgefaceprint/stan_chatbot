import React, { useState } from 'react';
import { Icons, COMPANY_DETAILS } from '../constants';

interface LoginViewProps {
  onLogin: (email: string, pass: string) => void;
  onCancel: () => void;
  customLogo?: string | null;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, onCancel, customLogo }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    onLogin(email, password);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in duration-300 border border-white/20">
        <div className="bg-slate-900 p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white p-5 rounded-3xl shadow-2xl mb-6 scale-110">
              <Icons.Logo className="scale-110" customSrc={customLogo} />
            </div>
            <h2 className="text-white text-2xl font-black uppercase tracking-tighter">Authorized Access</h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Internal Admin Portal</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8 bg-white">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-black rounded-2xl text-center uppercase tracking-widest animate-in fade-in">
              {error}
            </div>
          )}
          
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Secure Identifier</label>
            <input 
              type="email" 
              value={email}
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl outline-none transition-all text-sm font-bold placeholder-slate-300"
              placeholder="admin@expressprint.co.za"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Access Key</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl outline-none transition-all text-sm font-bold placeholder-slate-300 tracking-widest"
              placeholder="••••••••••••"
            />
          </div>

          <div className="pt-4 flex flex-col gap-4">
            <button 
              type="submit"
              className="w-full py-5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-rose-200 active:scale-95 uppercase tracking-[0.2em] text-xs"
            >
              Sign In to System
            </button>
            <button 
              type="button"
              onClick={onCancel}
              className="w-full py-2 text-slate-400 hover:text-slate-600 font-black text-[10px] uppercase tracking-[0.3em] transition-colors"
            >
              Cancel Access Request
            </button>
          </div>
        </form>

        <div className="px-10 py-6 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.4em] leading-relaxed">
            Express Print SA • Proprietary Admin Interface
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginView;