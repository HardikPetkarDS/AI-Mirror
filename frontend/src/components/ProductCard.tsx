import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isSelected?: boolean;
  onTryOn: (product: Product) => void;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSelected,
  onTryOn,
  onSelect,
}) => {
  const getRetailerColor = (retailer: string) => {
    switch (retailer.toLowerCase()) {
      case 'myntra':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/30';
      case 'zara':
        return 'bg-slate-100 text-slate-900 border-slate-300 font-black';
      case 'h&m':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'ajio':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'nykaa fashion':
      case 'nykaa':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'amazon fashion':
      case 'amazon':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      default:
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
    }
  };

  return (
    <div
      className={`group bg-slate-900/80 rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
        isSelected
          ? 'border-indigo-500 ring-2 ring-indigo-500/50 shadow-lg shadow-indigo-500/20'
          : 'border-slate-800 hover:border-indigo-500/40'
      }`}
    >
      {/* Product Image & Badges */}
      <div
        onClick={() => onSelect(product)}
        className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950 cursor-pointer"
      >
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-center pointer-events-none">
          <span className={`px-2.5 py-0.5 rounded-full border text-[10px] uppercase font-bold tracking-wider ${getRetailerColor(product.retailer)}`}>
            {product.retailer}
          </span>
          {product.discount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black">
              -{Math.round(product.discount)}%
            </span>
          )}
        </div>

        {/* Active Overlay Badge */}
        {isSelected && (
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold shadow-md">
            ✓ Active on Mirror
          </div>
        )}

        {/* Fit Type Pill */}
        <div className="absolute bottom-2.5 left-2.5">
          <span className="px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] text-slate-300 border border-slate-800 font-medium">
            {product.fit_type}
          </span>
        </div>
      </div>

      {/* Product Details & Actions */}
      <div className="p-3.5 space-y-2">
        <div>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{product.brand}</span>
          <h4
            onClick={() => onSelect(product)}
            className="text-xs font-bold text-white leading-snug line-clamp-1 cursor-pointer hover:text-indigo-300 transition-colors"
          >
            {product.name}
          </h4>
        </div>

        {/* Price & Rating */}
        <div className="flex items-baseline justify-between pt-1 border-t border-slate-800/80">
          <div className="flex items-baseline space-x-1.5">
            <span className="text-sm font-extrabold text-white">₹{product.price.toLocaleString()}</span>
            {product.discount > 0 && (
              <span className="text-[10px] text-slate-500 line-through">
                ₹{Math.round(product.price * (1 + product.discount / 100)).toLocaleString()}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1 text-[10px] text-amber-400 font-medium">
            <span>★</span>
            <span>{product.rating}</span>
          </div>
        </div>

        {/* Available Sizes preview */}
        <div className="flex items-center space-x-1 pt-1">
          <span className="text-[10px] text-slate-500">Sizes:</span>
          <div className="flex space-x-1 overflow-x-auto no-scrollbar">
            {product.available_sizes.slice(0, 4).map((s) => (
              <span key={s} className="px-1.5 py-0.2 rounded bg-slate-800 text-[9px] text-slate-300 font-mono">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Try On Button */}
        <button
          onClick={() => onTryOn(product)}
          className={`w-full py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center space-x-1.5 ${
            isSelected
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
              : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-md shadow-indigo-500/20'
          }`}
        >
          <span>{isSelected ? '✓ On Mirror' : '✨ Try On'}</span>
        </button>
      </div>
    </div>
  );
};
