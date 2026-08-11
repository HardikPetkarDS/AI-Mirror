import React, { useState } from 'react';
import { Product } from '../types';
import { fetchOutfitRecommendations, trackAffiliateClick } from '../lib/api';

interface OutfitBuilderViewProps {
  outfitItems: Product[];
  onRemoveItem: (id: number) => void;
  onExploreProducts: () => void;
}

export const OutfitBuilderView: React.FC<OutfitBuilderViewProps> = ({
  outfitItems,
  onRemoveItem,
  onExploreProducts,
}) => {
  const [aiSuggestions, setAiSuggestions] = useState<Product[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const totalPrice = outfitItems.reduce((acc, curr) => acc + curr.price, 0);

  const handleCompleteLook = async () => {
    if (outfitItems.length === 0) return;
    setLoadingSuggestions(true);
    try {
      const recs = await fetchOutfitRecommendations(outfitItems[0].id);
      setAiSuggestions(recs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleBuyAll = async () => {
    for (const item of outfitItems) {
      const url = await trackAffiliateClick(item.id);
      window.open(url || item.affiliate_url || item.product_url, '_blank');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">Multi-Store Stylist</span>
          <h2 className="text-3xl font-extrabold text-white">Outfit Builder & Stylist</h2>
          <p className="text-xs text-slate-400 mt-1">
            Combine clothing items from Myntra, Nykaa, AJIO, Amazon, Zara & H&M into a complete look.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onExploreProducts}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold hover:border-slate-700 transition-colors"
          >
            + Add Products
          </button>
          {outfitItems.length > 0 && (
            <button
              onClick={handleCompleteLook}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-xs shadow-lg hover:scale-105 transition-all"
            >
              ✨ Complete My Look
            </button>
          )}
        </div>
      </div>

      {/* Outfit Canvas & Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Outfit Items List */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Current Outfit Selection</h3>

          {outfitItems.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-slate-800 rounded-3xl space-y-4">
              <span className="text-4xl">👔</span>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">Your Outfit Canvas is Empty</h4>
                <p className="text-xs text-slate-400">Select products from the catalog or AI Mirror to build an outfit.</p>
              </div>
              <button
                onClick={onExploreProducts}
                className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all"
              >
                Browse Fashion Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {outfitItems.map((item) => (
                <div key={item.id} className="flex bg-slate-900 border border-slate-800 rounded-2xl p-3 space-x-3 relative group">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-20 h-24 object-cover rounded-xl bg-slate-950"
                  />
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider">{item.retailer}</span>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{item.name}</h4>
                      <p className="text-[10px] text-slate-400">{item.category} • {item.fit_type}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-extrabold text-emerald-400">₹{item.price.toLocaleString()}</span>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* AI Outfit Recommendations ("Complete My Look") */}
          {aiSuggestions.length > 0 && (
            <div className="pt-6 space-y-4">
              <h3 className="text-sm font-bold text-indigo-300 flex items-center space-x-2">
                <span>✨</span>
                <span>AI Recommended Matching Items</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {aiSuggestions.map((rec) => (
                  <div key={rec.id} className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 space-y-2">
                    <img src={rec.images[0]} alt={rec.name} className="w-full aspect-square object-cover rounded-lg" />
                    <h5 className="text-[11px] font-bold text-white line-clamp-1">{rec.name}</h5>
                    <span className="text-xs font-bold text-emerald-400 block">₹{rec.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Checkout & Summary */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 h-fit">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Look Summary</h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Selected Products</span>
              <span className="font-mono text-white">{outfitItems.length} items</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Connected Retailers</span>
              <span className="font-mono text-indigo-300">
                {Array.from(new Set(outfitItems.map((i) => i.retailer))).join(', ') || 'None'}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Size Recommendation</span>
              <span className="text-emerald-400 font-semibold">Matched to Fit Profile</span>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
              <span className="text-sm font-bold text-white">Total Outfit Price</span>
              <span className="text-xl font-black text-emerald-400">₹{totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <button
            disabled={outfitItems.length === 0}
            onClick={handleBuyAll}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 disabled:opacity-50 text-white font-black text-sm shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
          >
            <span>Buy Complete Look</span>
            <span>↗</span>
          </button>
        </div>
      </div>
    </div>
  );
};
