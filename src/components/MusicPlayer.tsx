
import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(30);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Create audio element dynamically
    if (!audioRef.current) {
      // Create a visible audio element in the DOM for more consistent behavior
      const audio = document.createElement('audio');
      audio.id = 'ambient-music-player';
      audio.preload = 'auto';
      audio.loop = true;
      audio.style.display = 'none';
      
      // Use an absolute path for mobile apps
      audio.src = window.location.origin + "/ambient-meditation.mp3";
      
      // Add error handling
      audio.addEventListener('error', (e) => {
        console.error('Audio loading error:', e);
        setAudioError(true);
        toast.error("Could not load meditation audio", {
          description: "Please check that the audio file exists"
        });
      });
      
      // Add to document to ensure iOS compatibility
      document.body.appendChild(audio);
      audioRef.current = audio;
      
      // Set initial volume
      audio.volume = volume / 100;
    }
    
    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        if (document.getElementById('ambient-music-player')) {
          document.getElementById('ambient-music-player')?.remove();
        }
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current || audioError) return;
    
    if (isPlaying) {
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.error("Failed to play audio:", err);
          setIsPlaying(false);
          
          // Show helpful toast for user interaction requirement
          toast.info("Click the sound icon to start ambient music", {
            duration: 5000
          });
        }).then(() => {
          if (playPromise) {
            setIsAudioInitialized(true);
          }
        });
      }
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, audioError]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioError) {
      // Attempt to reload the audio
      if (audioRef.current) {
        audioRef.current.load();
        setAudioError(false);
      }
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={togglePlay}
        className="hover:bg-dream-light-purple/20 relative"
        aria-label={isPlaying ? "Mute music" : "Play music"}
      >
        {isPlaying ? (
          <Volume2 className="h-5 w-5 text-dream-purple" />
        ) : (
          <VolumeX className="h-5 w-5 text-dream-purple/70" />
        )}
      </Button>
      {(isPlaying || isAudioInitialized) && (
        <div className={`${isMobile ? 'w-16' : 'w-24'}`}>
          <Slider
            value={[volume]}
            max={100}
            step={1}
            onValueChange={(values) => setVolume(values[0])}
            className="cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
