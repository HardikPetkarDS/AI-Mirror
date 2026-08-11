import React, { useState } from 'react';

export const UserProfileView: React.FC = () => {
  const [heightCm, setHeightCm] = useState(175);
  const [usualSize, setUsualSize] = useState('M');
  const [preferredFit, setPreferredFit] = useState('Regular Fit');
  const [chestCm, setChestCm] = useState(100);
  const [shoulderCm, setShoulderCm] = useState(46.5);
  const [waistCm, setWaistCm] = useState(84);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white space-y-8">
      <div>
        <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">Personalization Passport</span>
        <h2 className="text-3xl font-extrabold text-white">Your AI Fit Passport</h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure body measurements & fit preferences to train the Size Recommendation Engine for your exact proportions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Form */}
        <form onSubmit={handleSave} className="md:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Body Dimensions & Preferences</h3>

          {saved && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-bold text-center">
              ✓ Fit Passport updated successfully!
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Height (cm)</label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Usual Brand Size</label>
              <select
                value={usualSize}
                onChange={(e) => setUsualSize(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              >
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-medium">Default Fit Silhouette Preference</label>
            <div className="grid grid-cols-4 gap-2">
              {['Slim Fit', 'Regular Fit', 'Relaxed Fit', 'Oversized'].map((fit) => (
                <button
                  type="button"
                  key={fit}
                  onClick={() => setPreferredFit(fit)}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                    preferredFit === fit
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {fit}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-800">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Chest (cm)</label>
              <input
                type="number"
                value={chestCm}
                onChange={(e) => setChestCm(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Shoulders (cm)</label>
              <input
                type="number"
                value={shoulderCm}
                onChange={(e) => setShoulderCm(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Waist (cm)</label>
              <input
                type="number"
                value={waistCm}
                onChange={(e) => setWaistCm(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 hover:scale-[1.01] transition-all"
          >
            Save Fit Passport
          </button>
        </form>

        {/* Right Feedback Learning History Card */}
        <div className="md:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <span>🧠</span>
            <span>Brand Fit Learning Engine</span>
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed">
            The AI learns from your personal feedback history to adjust size recommendation algorithms for specific brands & categories.
          </p>

          <div className="space-y-2.5 pt-2">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between items-center font-bold">
                <span className="text-white">Roadster</span>
                <span className="text-rose-400 font-mono">Too Tight</span>
              </div>
              <p className="text-[11px] text-slate-400">Category: T-shirts • Size M</p>
              <span className="text-[10px] text-indigo-400 block pt-1 border-t border-slate-900">
                → Auto-upsizes Roadster tops to L
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between items-center font-bold">
                <span className="text-white">Zara</span>
                <span className="text-emerald-400 font-mono">Fits Perfectly</span>
              </div>
              <p className="text-[11px] text-slate-400">Category: Jackets • Size M</p>
              <span className="text-[10px] text-indigo-400 block pt-1 border-t border-slate-900">
                → High confidence match on M
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
