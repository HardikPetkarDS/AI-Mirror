import React, { useState, useEffect } from 'react';
import { Product, TryOnResponse, SizeRecommendationResponse } from '../types';
import { getSizeRecommendation, generateVirtualTryOn, submitFitFeedback, trackAffiliateClick } from '../lib/api';

interface TryOnModalProps {
  product: Product;
  userImageBase64: string;
  onClose: () => void;
  onAddToOutfit?: (product: Product) => void;
}

export const TryOnModal: React.FC<TryOnModalProps> = ({
  product,
  userImageBase64,
  onClose,
  onAddToOutfit,
}) => {
  const [loading, setLoading] = useState(true);
  const [stepMessage, setStepMessage] = useState('Analyzing your body pose...');
  const [selectedSize, setSelectedSize] = useState(product.available_sizes[0] || 'M');
  const [tryOnResult, setTryOnResult] = useState<TryOnResponse | null>(null);
  const [sizeRec, setSizeRec] = useState<SizeRecommendationResponse | null>(null);
  const [showBefore, setShowBefore] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<string | null>(null);
  const [fitPref, setFitPref] = useState('Regular Fit');

  const executeTryOn = async () => {
    setLoading(true);
    setStepMessage('Analyzing body landmarks...');
    await new Promise((r) => setTimeout(r, 600));

    setStepMessage('Segmenting garment pattern & texture...');
    await new Promise((r) => setTimeout(r, 600));

    setStepMessage('Generating AI Virtual Try-On synthesis...');
    try {
      const [vton, size] = await Promise.all([
        generateVirtualTryOn(product.id, userImageBase64, selectedSize),
        getSizeRecommendation(product.id, { fit_preference: fitPref }),
      ]);
      setTryOnResult(vton);
      setSizeRec(size);
      if (size.recommended_size) {
        setSelectedSize(size.recommended_size);
      }
    } catch (err) {
      console.error('TryOn generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeTryOn();
  }, [product.id, fitPref]);

  const handleFeedback = async (feedback: 'too_tight' | 'fits_perfectly' | 'too_loose') => {
    setFeedbackSubmitted(feedback);
    await submitFitFeedback(product.id, selectedSize, feedback);
  };

  const handleBuyNow = async () => {
    const url = await trackAffiliateClick(product.id);
    window.open(url || product.affiliate_url || product.product_url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl my-8 text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <span className="text-xl">✨</span>
            <div>
              <h3 className="text-base font-bold text-white">AI Virtual Try-On Result</h3>
              <p className="text-xs text-slate-400">{product.brand} • {product.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="p-16 text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto">
              <div className="w-full h-full rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
              <span className="absolute inset-0 flex items-center justify-center text-2xl">✨</span>
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">{stepMessage}</h4>
              <p className="text-xs text-slate-400">Processing high-fidelity neural image composition</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
            {/* Left Image Viewport */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                <img
                  src={showBefore ? userImageBase64 : (tryOnResult?.result_image_url || userImageBase64)}
                  alt="Try-On Result"
                  className="w-full h-full object-cover"
                />

                {/* Before / After Switch */}
                <button
                  onClick={() => setShowBefore(!showBefore)}
                  className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs font-semibold text-indigo-300 hover:text-white transition-all shadow-lg"
                >
                  {showBefore ? 'Show Try-On' : 'Show Original'}
                </button>

                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[11px] font-mono text-emerald-400">
                  {tryOnResult?.model_name || 'IDM-VTON Neural Engine'}
                </div>
              </div>
            </div>

            {/* Right Size & Recommendation Controls */}
            <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
              {/* Size Recommendation Banner */}
              {sizeRec && (
                <div className="bg-gradient-to-br from-slate-950 to-indigo-950/40 p-4 rounded-2xl border border-indigo-500/30 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
                      AI Size Engine Recommendation
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                      {sizeRec.confidence_percentage}% Confidence
                    </span>
                  </div>

                  <div className="flex items-baseline space-x-3">
                    <span className="text-3xl font-black text-white">{sizeRec.recommended_size}</span>
                    <span className="text-xs text-slate-300 font-medium">{sizeRec.fit_type}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{sizeRec.explanation}</p>

                  {/* Fit Breakdown */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                    <div className="bg-slate-900/80 p-2 rounded-lg">
                      <span className="text-slate-500 block">Shoulder</span>
                      <span className="font-semibold text-slate-200">{sizeRec.fit_breakdown.shoulder}</span>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-lg">
                      <span className="text-slate-500 block">Chest</span>
                      <span className="font-semibold text-slate-200">{sizeRec.fit_breakdown.chest}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Fit Preference Choice */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Fit Preference</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['Slim Fit', 'Regular Fit', 'Relaxed Fit', 'Oversized'].map((pref) => (
                    <button
                      key={pref}
                      onClick={() => setFitPref(pref)}
                      className={`py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                        fitPref === pref ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {pref.replace(' Fit', '')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fit Feedback Section */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">How does this look & fit?</label>
                {feedbackSubmitted ? (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-300 text-xs font-semibold text-center border border-emerald-500/20">
                    ✓ Fit feedback logged! Next recommendations will adapt to this.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleFeedback('too_tight')}
                      className="py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-slate-300 hover:text-white transition-colors"
                    >
                      Too Tight
                    </button>
                    <button
                      onClick={() => handleFeedback('fits_perfectly')}
                      className="py-2 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/30 rounded-xl text-xs text-indigo-300 font-bold transition-colors"
                    >
                      Fits Perfectly
                    </button>
                    <button
                      onClick={() => handleFeedback('too_loose')}
                      className="py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-slate-300 hover:text-white transition-colors"
                    >
                      Too Loose
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-3">
                {onAddToOutfit && (
                  <button
                    onClick={() => onAddToOutfit(product)}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
                  >
                    + Add to Outfit Builder
                  </button>
                )}
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 text-white font-black text-sm shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
                >
                  <span>Buy Now on {product.retailer}</span>
                  <span>↗</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
