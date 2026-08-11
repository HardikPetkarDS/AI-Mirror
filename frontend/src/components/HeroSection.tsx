import React from 'react';

interface HeroSectionProps {
  onOpenMirror: () => void;
  onExploreFashion: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenMirror, onExploreFashion }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 text-white bg-slate-950">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column Text & CTAs */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-indigo-300">
              <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
              <span className="font-semibold uppercase tracking-wider">AI Fashion Tech 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
              Your AI-Powered <br />
              <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Virtual Fitting Room
              </span>
            </h1>

            <p className="text-slate-300 text-lg sm:text-xl max-w-2xl font-light leading-relaxed">
              See how clothes look on you before you buy. Browse products across connected stores like{' '}
              <strong className="text-white font-medium">Myntra, Nykaa, AJIO, Amazon, Zara & H&M</strong> with instant AI virtual try-on and intelligent size recommendations.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onOpenMirror}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-base shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>✨ Open AI Mirror</span>
              </button>
              <button
                onClick={onExploreFashion}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-base border border-slate-800 hover:border-slate-700 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>🛍️ Explore Catalog</span>
              </button>
            </div>

            {/* Stats row */}
            <div className="pt-6 grid grid-cols-3 gap-6 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0">
              <div>
                <p className="text-2xl font-bold text-white">94%+</p>
                <p className="text-xs text-slate-400 mt-1">Size Recommendation Score</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">50+</p>
                <p className="text-xs text-slate-400 mt-1">Normalized Fashion Products</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">6 Stores</p>
                <p className="text-xs text-slate-400 mt-1">Connected Retail Adapters</p>
              </div>
            </div>
          </div>

          {/* Right Column Interactive Demo Preview Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md bg-slate-900/90 rounded-3xl p-4 border border-slate-800 shadow-2xl shadow-indigo-950/50 backdrop-blur-xl group">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/80">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop"
                  alt="AI Virtual Mirror Preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />

                {/* Overlay Badges */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                  <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-emerald-500/30 text-[11px] text-emerald-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Live Pose Tracking</span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-indigo-950/80 backdrop-blur-md border border-indigo-500/30 text-[11px] text-indigo-300 font-semibold">
                    Size M (92%)
                  </div>
                </div>

                {/* Bottom Overlay Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">ZARA</span>
                      <h4 className="text-sm font-bold text-white leading-snug">Heavyweight Textured White Tee</h4>
                    </div>
                    <span className="text-sm font-extrabold text-emerald-400">₹1,490</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px] text-slate-400">
                    <span>Shoulder: Good</span>
                    <span>Chest: Perfect</span>
                    <span className="text-indigo-400 font-semibold">Virtual Try-On Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
