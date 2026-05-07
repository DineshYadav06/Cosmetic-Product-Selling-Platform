"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, RefreshCw, X } from "lucide-react";
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

  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "user" } 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera access denied", err);
        setError("Camera access denied. Please ensure you have granted permission.");
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/jpeg");
        onCapture(imageData);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-lg aspect-[3/4] bg-black border border-[#d4af37]/30 overflow-hidden rounded-lg shadow-[0_0_50px_rgba(212,175,55,0.2)]">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <X size={48} className="text-red-500 mb-4" />
            <p className="text-white font-medium">{error}</p>
            <button 
              onClick={onClose}
              className="mt-6 text-[#d4af37] underline text-sm font-bold uppercase tracking-widest"
            >
              Go Back
            </button>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover grayscale"
            />
            
            {/* HUD Scan Line */}
            <motion.div 
              className="absolute top-0 left-0 w-full h-[2px] bg-[#d4af37] shadow-[0_0_15px_#d4af37] z-20"
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            {/* Corner Brackets */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
              <div className="flex justify-between">
                <div className="w-8 h-8 border-t-2 border-l-2 border-[#d4af37]" />
                <div className="w-8 h-8 border-t-2 border-r-2 border-[#d4af37]" />
              </div>
              <div className="flex justify-between">
                <div className="w-8 h-8 border-b-2 border-l-2 border-[#d4af37]" />
                <div className="w-8 h-8 border-b-2 border-r-2 border-[#d4af37]" />
              </div>
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <div className="absolute bottom-8 left-0 w-full flex justify-center gap-6 z-30">
              <button 
                onClick={captureImage}
                className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-4 border-[#d4af37] shadow-lg hover:scale-110 transition-transform"
                title="Capture"
              >
                <div className="w-12 h-12 bg-white rounded-full border-2 border-black" />
              </button>
            </div>
          </>
        )}

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors z-40 p-2"
        >
          <X size={24} />
        </button>
      </div>
      
      <p className="mt-8 text-[#d4af37] text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse">
        Position your face within the frame
      </p>
    </div>
  );
}
