
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Moon, Volume2, VolumeX } from "lucide-react";
import MeditationVideoCard from "@/components/MeditationVideoCard";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";

interface MeditationVideo {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl: string;
}

const meditationVideos: MeditationVideo[] = [
  {
    id: "sleep-1",
    title: "Deep Sleep Meditation",
    description: "Guided meditation to help you fall into a deep, restful sleep.",
    duration: "30 min",
    thumbnailUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=500&auto=format",
    videoUrl: "https://www.youtube.com/embed/1vx8iUvfyCY"
  },
  {
    id: "sleep-2",
    title: "Sleep Hypnosis",
    description: "Fall asleep faster with this calming hypnosis session.",
    duration: "45 min",
    thumbnailUrl: "https://images.unsplash.com/photo-1531353826977-0941b4779a1c?q=80&w=500&auto=format",
    videoUrl: "https://www.youtube.com/embed/hvOgpzRJxJg"
  },
  {
    id: "sleep-3",
    title: "Peaceful Night Meditation",
    description: "Calm your mind and prepare for a peaceful night's sleep.",
    duration: "20 min",
    thumbnailUrl: "https://images.unsplash.com/photo-1566438480900-0609be27a4be?q=80&w=500&auto=format",
    videoUrl: "https://www.youtube.com/embed/p76Zf-H0yLM"
  },
  {
    id: "sleep-4",
    title: "Lucid Dream Meditation",
    description: "Guide your mind towards lucid dreaming as you fall asleep.",
    duration: "40 min",
    thumbnailUrl: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=500&auto=format",
    videoUrl: "https://www.youtube.com/embed/ehmk8dzNgPg"
  },
];

const Meditation = () => {
  const [selectedVideo, setSelectedVideo] = useState<MeditationVideo | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [timerDuration, setTimerDuration] = useState(10); // minutes
  const [timeRemaining, setTimeRemaining] = useState(10 * 60); // seconds
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handleSelectVideo = (video: MeditationVideo) => {
    setSelectedVideo(video);
    toast({
      title: "Now Playing",
      description: video.title,
    });
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  useEffect(() => {
    // Initialize audio
    if (!audioRef.current) {
      audioRef.current = new Audio("/ambient-meditation.mp3");
      audioRef.current.loop = true;
    }
    
    // Set volume
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
    
    // Clean up
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [volume, isMuted]);

  useEffect(() => {
    let interval: number | undefined;
    
    if (timerActive && timeRemaining > 0) {
      interval = window.setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && timerActive) {
      setTimerActive(false);
      // Play notification sound
      const notification = new Audio("/ambient-meditation.mp3"); // Change to a notification sound
      notification.play();
      
      toast({
        title: "Meditation Complete",
        description: `Your ${timerDuration} minute meditation session is complete.`,
      });
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeRemaining, timerDuration, toast]);

  const toggleTimer = () => {
    if (!timerActive) {
      // Starting timer
      setTimeRemaining(timerDuration * 60);
      
      // Play ambient sound
      if (audioRef.current && !isMuted) {
        audioRef.current.play();
      }
    } else {
      // Pause ambient sound when timer is stopped
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
    
    setTimerActive(!timerActive);
  };

  const handleDurationChange = (value: number[]) => {
    const newDuration = value[0];
    setTimerDuration(newDuration);
    
    // If timer is not active, update the time remaining as well
    if (!timerActive) {
      setTimeRemaining(newDuration * 60);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : newVolume / 100;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    if (audioRef.current) {
      audioRef.current.volume = !isMuted ? 0 : volume / 100;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Moon className="text-[#f0e6cf] h-6 w-6" />
            <h2 className="text-xl font-semibold text-white dream-text">Sleep Meditation</h2>
          </div>
        </div>
        
        {!selectedVideo && (
          <Card className="bg-white/50 backdrop-blur-sm border-dream-light-purple/30 mb-6">
            <CardContent className="p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-dream-purple">Meditation Timer</h3>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-4 flex-1">
                    <p className="text-sm text-dream-deep-purple mb-2">Duration: {timerDuration} minutes</p>
                    <Slider
                      value={[timerDuration]}
                      min={1}
                      max={60}
                      step={1}
                      onValueChange={handleDurationChange}
                      disabled={timerActive}
                      className="max-w-xs"
                    />
                    
                    <div className="flex items-center gap-3 mt-4">
                      <Button
                        onClick={toggleMute}
                        variant="outline"
                        size="icon"
                        className="border-dream-light-purple/30 h-8 w-8"
                      >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                      
                      <Slider
                        value={[volume]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={handleVolumeChange}
                        className="max-w-[120px]"
                      />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-semibold mb-4 text-dream-deep-purple">
                      {formatTime(timeRemaining)}
                    </div>
                    
                    <Button 
                      onClick={toggleTimer}
                      className="bg-dream-gradient hover:opacity-90 min-w-[120px]"
                    >
                      {timerActive ? (
                        <>
                          <Pause className="mr-2 h-4 w-4" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Start
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {selectedVideo ? (
          <div className="space-y-4 animate-fade-in">
            <div className="relative aspect-video w-full rounded-lg overflow-hidden">
              <iframe 
                className="absolute top-0 left-0 w-full h-full"
                src={selectedVideo.videoUrl} 
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-white">{selectedVideo.title}</h3>
                <p className="text-sm text-white/70">{selectedVideo.description}</p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleCloseVideo}
                className="border-dream-light-purple/50 text-white hover:bg-dream-light-purple/20"
              >
                Back to Videos
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meditationVideos.map((video) => (
              <MeditationVideoCard 
                key={video.id}
                video={video}
                onSelect={() => handleSelectVideo(video)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Meditation;
