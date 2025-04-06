
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { formatTime } from "@/utils/formatTime";
import AudioManager from "@/utils/audioManager";
import { toast } from "sonner";

interface MeditationPlayerProps {
  audioSrc: string;
  title: string;
  autoPlay?: boolean;
}

const MeditationPlayer = ({ audioSrc, title, autoPlay = false }: MeditationPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(70);
  const audioId = useRef(`meditation-${title.replace(/\s+/g, '-').toLowerCase()}`);
  const updateIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Initialize audio
    const audio = AudioManager.getAudio(audioId.current, audioSrc, {
      volume: volume / 100,
      loop: false
    });
    
    // Set up event listeners
    const handleMetadata = () => {
      setDuration(audio.duration);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      clearUpdateInterval();
    };
    
    if (isNaN(audio.duration)) {
      audio.addEventListener("loadedmetadata", handleMetadata);
    } else {
      setDuration(audio.duration);
    }
    
    audio.addEventListener("ended", handleEnded);
    
    // Autoplay if enabled (will likely fail without user interaction)
    if (autoPlay) {
      playAudio();
    }
    
    // Clean up event listeners
    return () => {
      audio.removeEventListener("loadedmetadata", handleMetadata);
      audio.removeEventListener("ended", handleEnded);
      clearUpdateInterval();
    };
  }, [audioSrc, autoPlay]);
  
  useEffect(() => {
    AudioManager.setVolume(audioId.current, volume / 100);
  }, [volume]);

  // Start time update interval when playing
  const startUpdateInterval = () => {
    if (updateIntervalRef.current) return;
    
    updateIntervalRef.current = window.setInterval(() => {
      const audio = AudioManager.getAudio(audioId.current, audioSrc);
      setCurrentTime(audio.currentTime);
    }, 100);
  };
  
  // Clear time update interval when paused
  const clearUpdateInterval = () => {
    if (updateIntervalRef.current) {
      window.clearInterval(updateIntervalRef.current);
      updateIntervalRef.current = null;
    }
  };

  const playAudio = () => {
    AudioManager.playAudio(audioId.current).then(() => {
      setIsPlaying(true);
      startUpdateInterval();
    }).catch(err => {
      console.error("Error playing audio:", err);
      toast.error("Could not play meditation audio", {
        description: "Try interacting with the page first"
      });
    });
  };

  const pauseAudio = () => {
    AudioManager.pauseAudio(audioId.current);
    setIsPlaying(false);
    clearUpdateInterval();
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const restartAudio = () => {
    const audio = AudioManager.getAudio(audioId.current, audioSrc);
    audio.currentTime = 0;
    setCurrentTime(0);
    if (!isPlaying) {
      playAudio();
    }
  };

  const handleTimeChange = (values: number[]) => {
    const newTime = values[0];
    setCurrentTime(newTime);
    const audio = AudioManager.getAudio(audioId.current, audioSrc);
    audio.currentTime = newTime;
  };

  const handleVolumeChange = (values: number[]) => {
    setVolume(values[0]);
  };

  return (
    <Card className="border-dream-light-purple/30 bg-white/50 backdrop-blur-sm">
      <CardContent className="p-4 space-y-3">
        <div className="text-base font-medium text-center">{title}</div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {formatTime(currentTime)}
          </span>
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            className="mx-2 flex-1"
            onValueChange={handleTimeChange}
          />
          <span className="text-xs text-muted-foreground">
            {formatTime(duration)}
          </span>
        </div>
        
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={restartAudio}
            className="h-8 w-8"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button
            variant="default"
            size="icon"
            onClick={togglePlayPause}
            className="h-10 w-10 bg-dream-gradient hover:opacity-90"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            disabled
            className="h-8 w-8 opacity-50"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <Slider
            value={[volume]}
            max={100}
            step={1}
            className="flex-1"
            onValueChange={handleVolumeChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MeditationPlayer;
