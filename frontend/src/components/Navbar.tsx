import React from 'react';

interface NavbarProps {
  currentTab: 'home' | 'mirror' | 'outfits' | 'profile';
  setCurrentTab: (tab: 'home' | 'mirror' | 'outfits' | 'profile') => void;
  savedCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, savedCount = 0 }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentTab('home')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[1.5px]">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="text-xl">✨</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent group-hover:from-indigo-300 group-hover:to-pink-300 transition-all">
              AI MIRROR
            </span>
            <span className="text-[10px] font-medium tracking-widest text-indigo-400 uppercase -mt-1">
              Virtual Fitting Room
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-900/90 p-1.5 rounded-full border border-slate-800">
          <button
            onClick={() => setCurrentTab('home')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentTab === 'home'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentTab('mirror')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              currentTab === 'mirror'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI Mirror</span>
          </button>
          <button
            onClick={() => setCurrentTab('outfits')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentTab === 'outfits'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Outfit Builder
          </button>
          <button
            onClick={() => setCurrentTab('profile')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentTab === 'profile'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Fit Passport
          </button>
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCurrentTab('mirror')}
            className="relative px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-200"
          >
            Launch Mirror
          </button>
        </div>
      </div>
    </header>
  );
};
