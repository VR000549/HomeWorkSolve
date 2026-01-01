
import React, { useRef, useEffect, useState, useCallback } from 'react';

interface CameraViewProps {
  onCapture: (imageData: string) => void;
  onCancel: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError("Impossible d'accéder à la caméra. Vérifiez les permissions.");
      console.error(err);
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(dataUrl);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {error ? (
          <div className="text-white p-6 text-center">
            <i className="fas fa-exclamation-triangle text-4xl mb-4 text-yellow-500"></i>
            <p>{error}</p>
            <button 
              onClick={onCancel}
              className="mt-4 px-6 py-2 bg-white text-black rounded-full font-bold"
            >
              Retour
            </button>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        )}
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Overlays */}
        <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
            <div className="w-full h-full border-2 border-dashed border-white/50 rounded-lg"></div>
        </div>
      </div>

      <div className="bg-black p-8 flex justify-between items-center px-12">
        <button 
          onClick={onCancel}
          className="text-white text-lg w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/10"
        >
          <i className="fas fa-times"></i>
        </button>
        
        <button 
          onClick={handleCapture}
          className="w-20 h-20 bg-white rounded-full border-4 border-gray-400 flex items-center justify-center active:scale-95 transition-transform"
        >
          <div className="w-16 h-16 rounded-full border-2 border-black/20"></div>
        </button>

        <div className="w-12"></div> {/* Spacer */}
      </div>
    </div>
  );
};

export default CameraView;
