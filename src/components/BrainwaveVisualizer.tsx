
import React, { useEffect, useRef, useState } from "react";
import { Brain, VolumeX, Volume2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import binauralBeatGenerator, { BrainwaveFrequency } from "@/utils/binauralBeats";

interface BrainwaveVisualizerProps {
  active: boolean;
  frequency: BrainwaveFrequency;
  volume: number;
}

const BrainwaveVisualizer = ({ 
  active, 
  frequency = "theta", 
  volume 
}: BrainwaveVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [binauralVolume, setBinauralVolume] = useState(20);
  const hasInteractedRef = useRef(false);
  
  const getFrequencySettings = (freq: BrainwaveFrequency) => {
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
  
  // Handle binaural beats audio
  useEffect(() => {
    if (!hasInteractedRef.current) return;
    
    const updateBinauralState = async () => {
      if (active && soundEnabled) {
        const success = await binauralBeatGenerator.start(frequency, binauralVolume / 100);
        if (!success) {
          toast.error("Could not start binaural beats", {
            description: "Please try again after interacting with the page",
            duration: 3000
          });
        }
      } else {
        binauralBeatGenerator.stop();
      }
    };
    
    updateBinauralState();
    
    return () => {
      binauralBeatGenerator.stop();
    };
  }, [active, soundEnabled, frequency, binauralVolume]);
  
  // Update binaural volume when it changes
  useEffect(() => {
    if (soundEnabled && binauralBeatGenerator.isActive()) {
      binauralBeatGenerator.setVolume(binauralVolume / 100);
    }
  }, [binauralVolume, soundEnabled]);
  
  // Canvas animation for wave visualization
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

  const toggleSound = async () => {
    hasInteractedRef.current = true;
    
    if (soundEnabled) {
      // Simply turn off the sound
      setSoundEnabled(false);
      binauralBeatGenerator.stop();
    } else {
      // Try to enable sound
      setSoundEnabled(true);
      const success = await binauralBeatGenerator.start(frequency, binauralVolume / 100);
      
      if (!success) {
        toast.error("Could not start binaural beats", {
          description: "Your browser may not support Web Audio API",
          duration: 3000
        });
        setSoundEnabled(false);
      } else {
        toast.success("Binaural beats enabled", {
          description: "Use headphones for best results",
          duration: 3000
        });
      }
    }
  };

  const handleVolumeChange = (values: number[]) => {
    setBinauralVolume(values[0]);
  };

  return (
    <Card className="bg-white/50 backdrop-blur-sm border-dream-light-purple/30">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="text-dream-purple h-5 w-5" />
            <h4 className="text-sm font-medium text-dream-deep-purple">Neural Brainwaves</h4>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSound}
              className={`h-8 w-8 ${soundEnabled && active ? 'text-dream-purple' : 'text-dream-purple/70'}`}
              title={soundEnabled ? "Disable binaural beats" : "Enable binaural beats"}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>
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
        
        {soundEnabled && (
          <div className="pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-dream-deep-purple/70">Binaural volume:</span>
              <Slider
                value={[binauralVolume]}
                min={0}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="flex-1"
              />
              <span className="text-xs w-7 text-right text-dream-deep-purple/70">{binauralVolume}%</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BrainwaveVisualizer;
