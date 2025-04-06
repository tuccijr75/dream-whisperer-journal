
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { formatTime } from "@/utils/formatTime";

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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(audioSrc);
    audioRef.current = audio;
    
    // Set up event listeners
    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });
    
    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
    });
    
    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });
    
    // Set initial volume
    audio.volume = volume / 100;
    
    // Autoplay if enabled
    if (autoPlay) {
      playAudio();
    }
    
    // Cleanup
    return () => {
      audio.pause();
      audio.src = "";
      audio.removeEventListener("loadedmetadata", () => {});
      audio.removeEventListener("timeupdate", () => {});
      audio.removeEventListener("ended", () => {});
    };
  }, [audioSrc, autoPlay]);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.error("Error playing audio:", err);
      });
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const restartAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      if (!isPlaying) {
        playAudio();
      }
    }
  };

  const handleTimeChange = (values: number[]) => {
    const newTime = values[0];
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
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
            max={duration}
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
