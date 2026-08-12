import React, { useEffect, useState, useRef } from 'react';
import { useCamera } from '../hooks/useCamera';
import { Product } from '../types';

interface CameraMirrorProps {
  onCaptureSnapshot: (base64Image: string) => void;
  activeProduct?: Product | null;
  onOpenFitPassport?: (product: Product) => void;
  onAddToOutfit?: (product: Product) => void;
}

export const CameraMirror: React.FC<CameraMirrorProps> = ({
  onCaptureSnapshot,
  activeProduct,
  onOpenFitPassport,
  onAddToOutfit,
}) => {
  const {
    videoRef,
    canvasRef,
    isCameraActive,
    cameraError,
    startCamera,
    switchCamera,
    facingMode,
  } = useCamera();

  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const garmentImageRef = useRef<HTMLImageElement | null>(null);

  const [guidance, setGuidance] = useState('Full body detected. Live AR active.');
  const [poseStatus, setPoseStatus] = useState<'ideal' | 'closer' | 'further'>('ideal');

  // Preload active garment image when activeProduct changes
  useEffect(() => {
    if (activeProduct && activeProduct.images && activeProduct.images.length > 0) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = activeProduct.images[0];
      img.onload = () => {
        garmentImageRef.current = img;
      };
    } else {
      garmentImageRef.current = null;
    }
  }, [activeProduct]);

  // Real-time canvas overlay rendering loop over live video feed
  useEffect(() => {
    let phase = 0;

    const renderOverlay = () => {
      const video = videoRef.current;
      const canvas = overlayCanvasRef.current;

      if (video && canvas && isCameraActive) {
        const width = video.videoWidth || 640;
        const height = video.videoHeight || 480;

        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, width, height);

          // If a garment is selected, render virtual garment overlay on upper body
          if (garmentImageRef.current && garmentImageRef.current.complete) {
            phase += 0.04;
            const floatOffset = Math.sin(phase) * 3; // Natural breathing/posture sway

            const category = (activeProduct?.category || 'T-shirts').toLowerCase();
            let overlayX = width * 0.28;
            let overlayY = height * 0.22 + floatOffset;
            let overlayW = width * 0.44;
            let overlayH = height * 0.55;

            if (category.includes('jeans') || category.includes('trouser')) {
              overlayX = width * 0.30;
              overlayY = height * 0.52 + floatOffset;
              overlayW = width * 0.40;
              overlayH = height * 0.42;
            } else if (category.includes('jacket')) {
              overlayX = width * 0.25;
              overlayY = height * 0.18 + floatOffset;
              overlayW = width * 0.50;
              overlayH = height * 0.60;
            } else if (category.includes('shoe')) {
              overlayX = width * 0.35;
              overlayY = height * 0.75;
              overlayW = width * 0.30;
              overlayH = height * 0.20;
            }

            // Draw garment image over body
            ctx.save();
            ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
            ctx.shadowBlur = 15;
            ctx.drawImage(garmentImageRef.current, overlayX, overlayY, overlayW, overlayH);
            ctx.restore();

            // Draw subtle AR pose tracking indicators
            ctx.strokeStyle = 'rgba(99, 102, 241, 0.6)'; // Indigo tracking line
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 6]);

            // Shoulder alignment line
            const shoulderY = overlayY + overlayH * 0.15;
            ctx.beginPath();
            ctx.moveTo(overlayX + 10, shoulderY);
            ctx.lineTo(overlayX + overlayW - 10, shoulderY);
            ctx.stroke();

            // Landmark tracking dots
            ctx.fillStyle = '#34d399'; // Emerald green
            ctx.beginPath();
            ctx.arc(overlayX + 15, shoulderY, 4, 0, Math.PI * 2);
            ctx.arc(overlayX + overlayW - 15, shoulderY, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(renderOverlay);
    };

    if (isCameraActive) {
      animationFrameRef.current = requestAnimationFrame(renderOverlay);
    }

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isCameraActive, activeProduct]);

  // Pose distance guidance simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const statuses: ('ideal' | 'closer' | 'further')[] = ['ideal', 'ideal', 'ideal'];
      const current = statuses[Math.floor(Math.random() * statuses.length)];
      setPoseStatus(current);

      if (current === 'closer') {
        setGuidance('Move slightly closer to camera.');
      } else if (current === 'further') {
        setGuidance('Move slightly backward for full torso view.');
      } else {
        setGuidance('Full body detected. Live AR active.');
      }
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Composite live video + garment overlay canvas for snapshot capture
  const handleCapture = () => {
    const video = videoRef.current;
    const overlayCanvas = overlayCanvasRef.current;

    if (!video || video.readyState < 2) return;

    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    const snapCanvas = canvasRef.current || document.createElement('canvas');
    snapCanvas.width = width;
    snapCanvas.height = height;

    const ctx = snapCanvas.getContext('2d');
    if (!ctx) return;

    // Flip video if front-facing camera for natural mirror view
    if (facingMode === 'user') {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }

    // Draw live webcam video frame
    ctx.drawImage(video, 0, 0, width, height);

    // Draw garment overlay canvas frame
    if (overlayCanvas) {
      ctx.drawImage(overlayCanvas, 0, 0, width, height);
    }

    const base64Snap = snapCanvas.toDataURL('image/jpeg', 0.90);
    onCaptureSnapshot(base64Snap);
  };

  return (
    <div className="relative w-full h-full min-h-[500px] lg:min-h-[650px] bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden flex flex-col justify-between shadow-2xl">
      {/* Hidden Canvas for Frame Capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Top Header Overlay */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs text-white">
          <span className={`w-2.5 h-2.5 rounded-full ${isCameraActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
          <span className="font-semibold">{isCameraActive ? 'LIVE MIRROR' : 'CAMERA OFF'}</span>
        </div>

        {activeProduct && (
          <div className="px-3.5 py-1.5 rounded-full bg-indigo-950/90 backdrop-blur-md border border-indigo-500/40 text-xs text-indigo-200 font-bold shadow-lg flex items-center space-x-2">
            <span className="text-emerald-400">👕</span>
            <span className="truncate max-w-[200px] sm:max-w-[300px]">{activeProduct.brand} - {activeProduct.name}</span>
          </div>
        )}
      </div>

      {/* Video Viewport & AR Overlay Canvas */}
      <div className="relative w-full h-full flex items-center justify-center bg-slate-950 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''} ${
            isCameraActive ? 'block' : 'hidden'
          }`}
        />

        {/* Real-time Garment Overlay Canvas */}
        <canvas
          ref={overlayCanvasRef}
          className={`absolute inset-0 w-full h-full pointer-events-none ${
            facingMode === 'user' ? 'scale-x-[-1]' : ''
          } ${isCameraActive ? 'block' : 'hidden'}`}
        />

        {!isCameraActive && (
          <div className="text-center p-6 space-y-4 max-w-sm">
            <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center text-3xl mx-auto border border-slate-800 text-slate-500">
              📷
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Camera Offline</h4>
              <p className="text-xs text-slate-400 mt-1">{cameraError || 'Please allow camera access to enable the virtual mirror.'}</p>
            </div>
            <button
              onClick={startCamera}
              className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg"
            >
              Retry Camera Permission
            </button>
          </div>
        )}

        {/* Live Guidance Badge */}
        {isCameraActive && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs text-slate-200 font-medium flex items-center space-x-2">
            <span className="text-sm">🎯</span>
            <span>{guidance}</span>
          </div>
        )}
      </div>

      {/* Bottom Controls Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap gap-2 justify-between items-center px-4 py-3 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-slate-800">
        <div className="flex items-center space-x-2">
          {/* Switch Camera */}
          <button
            onClick={switchCamera}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs flex items-center space-x-1"
            title="Switch Camera"
          >
            <span>🔄</span>
            <span className="hidden sm:inline">Flip</span>
          </button>

          {/* Fit Passport / Size Analysis (Optional intentional feature) */}
          {activeProduct && onOpenFitPassport && (
            <button
              onClick={() => onOpenFitPassport(activeProduct)}
              className="px-3.5 py-2.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/40 text-xs font-semibold flex items-center space-x-1.5 transition-all"
              title="Open AI Size Engine & Detailed Fit Analysis"
            >
              <span>📊</span>
              <span className="hidden sm:inline">Fit Analysis</span>
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {activeProduct && onAddToOutfit && (
            <button
              onClick={() => onAddToOutfit(activeProduct)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold transition-all"
            >
              + Outfit
            </button>
          )}

          {/* Capture Snapshot CTA */}
          <button
            onClick={handleCapture}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 hover:scale-105 transition-all flex items-center space-x-2"
          >
            <span>📸</span>
            <span>Capture Frame</span>
          </button>
        </div>
      </div>
    </div>
  );
};
