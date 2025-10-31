"use client";

import { useEffect, useRef, useState } from "react";

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  className?: string;
  responsive?: boolean;
}

export default function QRCodeGenerator({ 
  value, 
  size = 200, 
  className = "",
  responsive = false 
}: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [actualSize, setActualSize] = useState(size);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (responsive && typeof window !== 'undefined') {
      const updateSize = () => {
        const width = window.innerWidth;
        if (width < 640) {
          setActualSize(200); // Mobile
        } else if (width < 768) {
          setActualSize(250); // Tablet
        } else {
          setActualSize(280); // Desktop
        }
      };

      updateSize();
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    } else {
      setActualSize(size);
    }
  }, [responsive, size]);

  useEffect(() => {
    if (!canvasRef.current || !value) return;

    setIsLoading(true);

    // Use QR Code API service to generate QR code
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${actualSize}x${actualSize}&data=${encodeURIComponent(value)}&bgcolor=1a1a2e&color=00d4ff`;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // Set canvas size
    canvas.width = actualSize;
    canvas.height = actualSize;

    // Load and draw QR code image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.drawImage(img, 0, 0, actualSize, actualSize);
      setIsLoading(false);
    };
    img.onerror = () => {
      // Fallback: Draw a placeholder
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, actualSize, actualSize);
      ctx.fillStyle = '#00d4ff';
      ctx.font = '16px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('QR Code', actualSize / 2, actualSize / 2 - 10);
      ctx.font = '12px monospace';
      ctx.fillText('Unavailable', actualSize / 2, actualSize / 2 + 10);
      setIsLoading(false);
    };
    img.src = qrCodeUrl;
  }, [value, actualSize]);

  return (
    <div className="relative inline-block">
      {isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-lg"
          style={{ width: actualSize, height: actualSize }}
        >
          <i className="fas fa-spinner fa-spin text-neon-blue text-2xl"></i>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={`rounded-lg ${className}`}
        style={{ width: actualSize, height: actualSize }}
      />
    </div>
  );
}
