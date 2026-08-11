import React from 'react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Open Camera Mirror',
      description: 'Grant camera access to activate your personal virtual fitting room mirror feed.',
      icon: '📷',
    },
    {
      number: '02',
      title: 'Browse Connected Stores',
      description: 'Search & filter real fashion products from Myntra, Nykaa, AJIO, Amazon, Zara & H&M.',
      icon: '🛍️',
    },
    {
      number: '03',
      title: 'AI Virtual Try-On',
      description: 'Click "Try On" to generate a realistic image of yourself wearing the selected garment.',
      icon: '✨',
    },
    {
      number: '04',
      title: 'Smart Size Engine & Buy',
      description: 'Receive multi-factor size recommendations with confidence breakdown and direct retailer buy link.',
      icon: '📐',
    },
  ];

  return (
    <section className="py-16 bg-slate-950 text-white border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-2">How It Works</h2>
          <h3 className="text-3xl font-extrabold text-white">Experience AI Shopping in 4 Simple Steps</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 hover:border-indigo-500/50 transition-all duration-300 group"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-3xl">{step.icon}</span>
                <span className="text-2xl font-black text-slate-800 group-hover:text-indigo-400/40 transition-colors">
                  {step.number}
                </span>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const PrivacyNotice: React.FC = () => {
  return (
    <div className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-4 sm:p-6 text-slate-300 max-w-3xl mx-auto my-8">
      <div className="flex items-start space-x-4">
        <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xl">
          🔒
        </div>
        <div>
          <h4 className="text-sm font-bold text-white mb-1">Privacy First Engineering Principle</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your live camera feed stays strictly in your browser using local MediaDevices WebRTC APIs. Image frames are only transmitted to the backend when you explicitly trigger an AI operation such as Virtual Try-On or Body Measurement.
          </p>
        </div>
      </div>
    </div>
  );
};
