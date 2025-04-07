
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";
import { formatTime } from "@/utils/formatTime";
import { toast } from "sonner";

interface MeditationVideoPlayerProps {
  videoUrl: string;
  title: string;
}

const MeditationVideoPlayer = ({ videoUrl, title }: MeditationVideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Auto-play attempt when component mounts
  useEffect(() => {
    if (videoRef.current) {
      // Set up event listeners first
      const video = videoRef.current;
      
      const handleCanPlay = () => {
        setIsVideoLoaded(true);
        console.log("Video can play now");
      };
      
      video.addEventListener('canplay', handleCanPlay);
      
      // Try to load the video
      video.load();
      
      return () => {
        video.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, [videoUrl]);

  // Try autoplay after video is loaded
  useEffect(() => {
    if (isVideoLoaded && videoRef.current) {
      const playVideo = async () => {
        try {
          await videoRef.current?.play();
          setIsPlaying(true);
          console.log("Video playing automatically");
        } catch (error) {
          console.error("Failed to auto-play video:", error);
          // Auto-play was prevented, user needs to click play button
        }
      };
      
      // Small delay to ensure everything is ready
      const timer = setTimeout(() => {
        playVideo();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isVideoLoaded]);

  const togglePlay = () => {
    if (videoRef.current) {
      console.log("Toggle play clicked, current state:", isPlaying);
      
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        console.log("Video paused");
      } else {
        // Create a promise to track play success
        videoRef.current.play()
          .then(() => {
            setIsPlaying(true);
            console.log("Video playing");
          })
          .catch(error => {
            console.error("Failed to play video:", error);
            toast.error("Failed to play video", {
              description: "Please try again or check if the video source is valid."
            });
          });
      }
    } else {
      console.error("Video element not found");
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100;
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsVideoLoaded(true);
      console.log("Video metadata loaded, duration:", videoRef.current.duration);
    }
  };

  const handleTimeSeek = (values: number[]) => {
    const newTime = values[0];
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && playerRef.current) {
      playerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else if (document.fullscreenElement) {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
      });
    }
  };

  return (
    <Card className="border-dream-light-purple/30 bg-white/10 backdrop-blur-sm overflow-hidden">
      <div ref={playerRef} className="relative">
        <video
          ref={videoRef}
          className="w-full aspect-video object-contain bg-black"
          src={videoUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          poster="/placeholder.svg"
          preload="metadata"
          playsInline
        />
        
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              className="mx-2 flex-1"
              onValueChange={handleTimeSeek}
            />
            <span className="text-xs text-muted-foreground">
              {formatTime(duration)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                size="icon"
                onClick={togglePlay}
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
                onClick={toggleMute}
                className="h-8 w-8"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              
              <div className="w-24 hidden sm:block">
                <Slider
                  value={[volume]}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="cursor-pointer"
                />
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="h-8 w-8"
            >
              {isFullscreen ? (
                <Minimize className="h-4 w-4" />
              ) : (
                <Maximize className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default MeditationVideoPlayer;
