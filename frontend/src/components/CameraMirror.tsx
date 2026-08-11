import React, { useEffect, useState } from 'react';
import { useCamera } from '../hooks/useCamera';

interface CameraMirrorProps {
  onCaptureSnapshot: (base64Image: string) => void;
  activeGarmentName?: string;
}

export const CameraMirror: React.FC<CameraMirrorProps> = ({ onCaptureSnapshot, activeGarmentName }) => {
  const {
    videoRef,
    canvasRef,
    isCameraActive,
    cameraError,
    startCamera,
    switchCamera,
    takeSnapshot,
    facingMode,
  } = useCamera();

  const [guidance, setGuidance] = useState('Full body detected. Good lighting.');
  const [poseStatus, setPoseStatus] = useState<'ideal' | 'closer' | 'further'>('ideal');

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
        setGuidance('Full body detected. Good lighting.');
      }
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleCapture = () => {
    const snap = takeSnapshot();
    if (snap) {
      onCaptureSnapshot(snap);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[500px] lg:min-h-[650px] bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden flex flex-col justify-between shadow-2xl">
      {/* Hidden Canvas for Frame Capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Top Header Overlay */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center pointer-events-none">
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs text-white">
          <span className={`w-2.5 h-2.5 rounded-full ${isCameraActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
          <span className="font-semibold">{isCameraActive ? 'LIVE MIRROR' : 'CAMERA OFF'}</span>
        </div>

        {activeGarmentName && (
          <div className="px-3.5 py-1.5 rounded-full bg-indigo-950/90 backdrop-blur-md border border-indigo-500/40 text-xs text-indigo-200 font-bold shadow-lg">
            Garment: {activeGarmentName}
          </div>
        )}
      </div>

      {/* Video Viewport */}
      <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
        {isCameraActive ? (
          <video
            ref={videoRef}
            playsInline
            muted
            className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
          />
        ) : (
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
      <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-center px-4 py-3 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-slate-800">
        {/* Switch Camera */}
        <button
          onClick={switchCamera}
          className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs flex items-center space-x-1"
          title="Switch Camera"
        >
          <span>🔄</span>
          <span className="hidden sm:inline">Flip</span>
        </button>

        {/* Capture Snapshot CTA */}
        <button
          onClick={handleCapture}
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 hover:scale-105 transition-all flex items-center space-x-2"
        >
          <span>📸</span>
          <span>Capture Frame</span>
        </button>

        {/* Privacy Note */}
        <div className="text-[10px] text-slate-500 hidden sm:block max-w-[150px] text-right">
          Stream processed locally in browser
        </div>
      </div>
    </div>
  );
};
