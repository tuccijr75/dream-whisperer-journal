
import React, { useEffect, useRef } from "react";
import { Brain } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface BrainwaveVisualizerProps {
  active: boolean;
  frequency?: "delta" | "theta" | "alpha" | "beta" | "gamma";
  volume: number;
}

const BrainwaveVisualizer = ({ 
  active, 
  frequency = "theta", 
  volume 
}: BrainwaveVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const getFrequencySettings = (freq: string) => {
    switch(freq) {
      case "delta": // 0.5-4 Hz (deep sleep)
        return { waveSpeed: 0.5, waveHeight: 15, color: "#6b21a8" };
      case "theta": // 4-8 Hz (meditation, drowsiness)
        return { waveSpeed: 1, waveHeight: 12, color: "#7c3aed" };
      case "alpha": // 8-13 Hz (relaxed awareness)
        return { waveSpeed: 1.5, waveHeight: 10, color: "#8b5cf6" };
      case "beta": // 13-30 Hz (active thinking)
        return { waveSpeed: 2.5, waveHeight: 7, color: "#a78bfa" };
      case "gamma": // 30-100 Hz (higher mental activity)
        return { waveSpeed: 4, waveHeight: 5, color: "#c4b5fd" };
      default:
        return { waveSpeed: 1, waveHeight: 12, color: "#7c3aed" };
    }
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Adjust for high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    // Scale back down using CSS
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    
    // Set line style
    const { waveSpeed, waveHeight, color } = getFrequencySettings(frequency);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Animation variables
    let phase = 0;
    
    // Draw function
    const draw = () => {
      if (!ctx || !canvas) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      
      if (!active) {
        // Draw a flat line when inactive
        ctx.beginPath();
        ctx.strokeStyle = "#94a3b8";
        ctx.moveTo(0, canvas.height / (2 * dpr));
        ctx.lineTo(canvas.width / dpr, canvas.height / (2 * dpr));
        ctx.stroke();
        return;
      }
      
      // Adjust settings based on volume
      const volumeMultiplier = volume / 100;
      const adjustedHeight = waveHeight * volumeMultiplier;
      
      // Draw wavy line
      ctx.beginPath();
      ctx.strokeStyle = color;
      
      // Starting point
      const centerY = canvas.height / (2 * dpr);
      
      // Draw sine wave
      for (let x = 0; x < canvas.width / dpr; x++) {
        // Use multiple sine waves with different frequencies for more realistic brainwaves
        const y = centerY + 
                 Math.sin(x * 0.02 + phase) * adjustedHeight +
                 Math.sin(x * 0.01 + phase * 0.5) * (adjustedHeight * 0.5) + 
                 Math.sin(x * 0.03 + phase * 0.7) * (adjustedHeight * 0.3);
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
      
      // Update phase for animation
      phase += waveSpeed * 0.02;
      
      // Continue animation
      animationRef.current = requestAnimationFrame(draw);
    };
    
    // Start animation
    draw();
    
    // Cleanup on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [active, frequency, volume]);

  return (
    <Card className="bg-white/50 backdrop-blur-sm border-dream-light-purple/30">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Brain className="text-dream-purple h-5 w-5" />
          <h4 className="text-sm font-medium text-dream-deep-purple">Neural Brainwaves</h4>
        </div>
        <div className="relative h-24 bg-gray-50/50 rounded-md overflow-hidden">
          <canvas 
            ref={canvasRef} 
            className="w-full h-full" 
          />
          <div className="absolute bottom-1 right-2 text-xs text-dream-purple opacity-70">
            {frequency.charAt(0).toUpperCase() + frequency.slice(1)} waves
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrainwaveVisualizer;
