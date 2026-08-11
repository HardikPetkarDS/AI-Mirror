'use client';

import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { CameraMirror } from '../components/CameraMirror';
import { ProductDrawer } from '../components/ProductDrawer';
import { TryOnModal } from '../components/TryOnModal';
import { OutfitBuilderView } from '../components/OutfitBuilderView';
import { UserProfileView } from '../components/UserProfileView';
import { HowItWorks, PrivacyNotice } from '../components/HowItWorks';
import { Product } from '../types';

export default function Home() {
  const [currentTab, setCurrentTab] = useState<'home' | 'mirror' | 'outfits' | 'profile'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [tryOnModalProduct, setTryOnModalProduct] = useState<Product | null>(null);
  const [userCapturedImage, setUserCapturedImage] = useState<string | null>(null);
  const [outfitItems, setOutfitItems] = useState<Product[]>([]);

  const handleCaptureSnapshot = (base64Img: string) => {
    setUserCapturedImage(base64Img);
  };

  const handleTryOnProduct = (product: Product) => {
    // If no snapshot captured yet, use fallback sample avatar image
    if (!userCapturedImage) {
      const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop';
      setUserCapturedImage(defaultAvatar);
    }
    setTryOnModalProduct(product);
  };

  const handleAddToOutfit = (product: Product) => {
    if (!outfitItems.some((i) => i.id === product.id)) {
      setOutfitItems((prev) => [...prev, product]);
    }
    if (tryOnModalProduct) {
      setTryOnModalProduct(null);
    }
    setCurrentTab('outfits');
  };

  const handleRemoveFromOutfit = (id: number) => {
    setOutfitItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        savedCount={outfitItems.length}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <div className="space-y-12">
            <HeroSection
              onOpenMirror={() => setCurrentTab('mirror')}
              onExploreFashion={() => setCurrentTab('mirror')}
            />
            <HowItWorks />
            <PrivacyNotice />
          </div>
        )}

        {currentTab === 'mirror' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-6rem)]">
              {/* Left Column: Live Camera Mirror */}
              <div className="lg:col-span-7 h-full">
                <CameraMirror
                  onCaptureSnapshot={handleCaptureSnapshot}
                  activeGarmentName={tryOnModalProduct?.name}
                />
              </div>

              {/* Right Column: Interactive Product Drawer */}
              <div className="lg:col-span-5 h-full overflow-hidden rounded-3xl">
                <ProductDrawer
                  onTryOnProduct={handleTryOnProduct}
                  onSelectProduct={(p) => setSelectedProduct(p)}
                />
              </div>
            </div>
          </div>
        )}

        {currentTab === 'outfits' && (
          <OutfitBuilderView
            outfitItems={outfitItems}
            onRemoveItem={handleRemoveFromOutfit}
            onExploreProducts={() => setCurrentTab('mirror')}
          />
        )}

        {currentTab === 'profile' && <UserProfileView />}
      </main>

      {/* Try-On Modal */}
      {tryOnModalProduct && userCapturedImage && (
        <TryOnModal
          product={tryOnModalProduct}
          userImageBase64={userCapturedImage}
          onClose={() => setTryOnModalProduct(null)}
          onAddToOutfit={handleAddToOutfit}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-300">AI Mirror</span>
            <span>•</span>
            <span>Commercial Fashion-Tech Platform</span>
          </div>
          <div>
            Built with Next.js, FastAPI, OpenCV, MediaPipe & AI Size Recommendation Engine
          </div>
        </div>
      </footer>
    </div>
  );
}
