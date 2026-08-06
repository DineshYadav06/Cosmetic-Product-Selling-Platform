"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, RefreshCw, X, Sparkles, Activity, ShieldAlert, Cpu } from "lucide-react";
import { motion } from "framer-motion";

interface CameraScannerProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

export default function CameraScanner({ onCapture, onClose }: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanMetric, setScanMetric] = useState({
    erythema: 12,
    porosity: 44,
    hydration: 78,
    collagen: 89
  });

  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } } 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera access denied", err);
        setError("Camera access denied. Please grant permission or upload a photo instead.");
      }
    }

    startCamera();

    // Live fluctuating diagnostic scan numbers effect
    const interval = setInterval(() => {
      setScanMetric({
        erythema: Math.floor(10 + Math.random() * 15),
        porosity: Math.floor(35 + Math.random() * 20),
        hydration: Math.floor(70 + Math.random() * 15),
        collagen: Math.floor(82 + Math.random() * 10)
      });
    }, 1200);

    return () => {
      clearInterval(interval);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/jpeg", 0.9);
        onCapture(imageData);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-xl aspect-[3/4] bg-black border-2 border-[#d4af37]/50 overflow-hidden rounded-2xl shadow-[0_0_80px_rgba(212,175,55,0.25)]">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-black/90">
            <ShieldAlert size={56} className="text-red-500 mb-4" />
            <p className="text-white font-medium text-sm mb-2">{error}</p>
            <button 
              onClick={onClose}
              className="mt-6 bg-[#d4af37] text-black px-6 py-2.5 text-xs font-extrabold uppercase tracking-widest rounded hover:bg-white transition-colors"
            >
              Close & Upload Photo
            </button>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover grayscale contrast-125 brightness-90"
            />
            
            {/* Holographic Laser Grid Scanner */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#d4af37_1px,transparent_1px),linear-gradient(to_bottom,#d4af37_1px,transparent_1px)] bg-[size:2rem_2rem]" />

            {/* Glowing HUD Laser Beam */}
            <motion.div 
              className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent shadow-[0_0_25px_#d4af37] z-20"
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            />

            {/* Face Mesh Target Ring */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-80 border-2 border-dashed border-[#d4af37]/60 rounded-[40%] flex items-center justify-center relative animate-pulse">
                <div className="w-56 h-72 border border-[#d4af37]/30 rounded-[40%]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#d4af37]/40 text-[9px] font-mono uppercase tracking-widest">
                  Target Skin Target Lock
                </div>
              </div>
            </div>

            {/* Live Diagnostic HUD telemetry stats */}
            <div className="absolute top-6 left-6 z-30 space-y-1 font-mono text-[9px] text-[#d4af37] bg-black/70 backdrop-blur-md p-3 rounded-lg border border-[#d4af37]/30">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider mb-1 text-white border-b border-[#d4af37]/20 pb-1">
                <Cpu size={12} className="text-[#d4af37] animate-spin" /> Live AI Vision Sensor
              </div>
              <p>ERYTHEMA / REDNESS: <span className="font-bold text-white">{scanMetric.erythema}%</span></p>
              <p>PORE DENSITY: <span className="font-bold text-white">{scanMetric.porosity}%</span></p>
              <p>TEWL HYDRATION: <span className="font-bold text-white">{scanMetric.hydration}%</span></p>
              <p>COLLAGEN ELASTICITY: <span className="font-bold text-white">{scanMetric.collagen}%</span></p>
            </div>

            {/* Corner Bracket Reticles */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none z-20">
              <div className="flex justify-between">
                <div className="w-10 h-10 border-t-2 border-l-2 border-[#d4af37]" />
                <div className="w-10 h-10 border-t-2 border-r-2 border-[#d4af37]" />
              </div>
              <div className="flex justify-between">
                <div className="w-10 h-10 border-b-2 border-l-2 border-[#d4af37]" />
                <div className="w-10 h-10 border-b-2 border-r-2 border-[#d4af37]" />
              </div>
            </div>

            <canvas ref={canvasRef} className="hidden" />

            {/* Capture Trigger Button */}
            <div className="absolute bottom-8 left-0 w-full flex flex-col items-center gap-3 z-30">
              <button 
                onClick={captureImage}
                className="w-20 h-20 bg-gradient-to-r from-[#d4af37] to-[#f5e6c8] rounded-full flex items-center justify-center border-4 border-black shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:scale-110 active:scale-95 transition-all group"
                title="Perform AI Skin Scan"
              >
                <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center text-[#d4af37]">
                  <Camera size={26} className="group-hover:scale-110 transition-transform" />
                </div>
              </button>
              <span className="text-white text-[10px] font-extrabold uppercase tracking-[0.25em] bg-black/80 px-3 py-1 rounded-full border border-[#d4af37]/40 shadow">
                Tap to Scan & Generate Rx Prescription
              </span>
            </div>
          </>
        )}

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/60 backdrop-blur-md rounded-full p-2.5 transition-colors z-40 border border-white/20"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
