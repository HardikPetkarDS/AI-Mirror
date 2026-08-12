import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { fetchProducts } from '../lib/api';

interface ProductDrawerProps {
  selectedProductId?: number;
  onTryOnProduct: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

const RETAILERS = ['All Stores', 'Myntra', 'Zara', 'H&M', 'AJIO', 'Nykaa', 'Amazon'];
const CATEGORIES = ['All Categories', 'T-shirts', 'Shirts', 'Jackets', 'Dresses', 'Jeans', 'Trousers', 'Shoes'];
const FITS = ['All Fits', 'Regular Fit', 'Slim Fit', 'Relaxed Fit', 'Oversized'];

export const ProductDrawer: React.FC<ProductDrawerProps> = ({
  selectedProductId,
  onTryOnProduct,
  onSelectProduct,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRetailer, setSelectedRetailer] = useState('All Stores');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedFit, setSelectedFit] = useState('All Fits');

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts({
        query: searchQuery || undefined,
        retailer: selectedRetailer !== 'All Stores' ? selectedRetailer : undefined,
        category: selectedCategory !== 'All Categories' ? selectedCategory : undefined,
        fit_type: selectedFit !== 'All Fits' ? selectedFit : undefined,
      });
      setProducts(data);
    } catch (err) {
      console.error('Error loading catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedRetailer, selectedCategory, selectedFit]);

  return (
    <div className="h-full flex flex-col bg-slate-900/90 border-l border-slate-800 text-white p-4 overflow-y-auto no-scrollbar space-y-4">
      {/* Search Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <span>🛍️</span>
            <span>Fashion Catalog</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">{products.length} Products</span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search 'black shirt', 'blue jeans'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <span className="absolute left-3 top-3 text-xs text-slate-500">🔍</span>
        </div>
      </div>

      {/* Retailer Filters */}
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Connected Stores</label>
        <div className="flex space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
          {RETAILERS.map((ret) => (
            <button
              key={ret}
              onClick={() => setSelectedRetailer(ret)}
              className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${
                selectedRetailer === ret
                  ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {ret}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills */}
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Category</label>
        <div className="flex space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Fit Pills */}
      <div className="flex items-center space-x-2">
        <span className="text-[10px] text-slate-400 uppercase font-semibold">Fit:</span>
        <div className="flex space-x-1 overflow-x-auto no-scrollbar">
          {FITS.map((fit) => (
            <button
              key={fit}
              onClick={() => setSelectedFit(fit)}
              className={`px-2 py-0.5 rounded text-[9px] ${
                selectedFit === fit ? 'bg-pink-600 text-white font-bold' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              {fit}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3 py-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[3/4] rounded-2xl bg-slate-800/50 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 space-y-2">
          <span className="text-3xl">🔍</span>
          <p className="text-xs text-slate-400">No fashion products match your filter.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedRetailer('All Stores');
              setSelectedCategory('All Categories');
              setSelectedFit('All Fits');
            }}
            className="text-xs text-indigo-400 font-semibold hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 pb-6">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              isSelected={selectedProductId === p.id}
              onTryOn={onTryOnProduct}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};
