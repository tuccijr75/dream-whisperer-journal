
import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import AudioManager from "@/utils/audioManager";

const AUDIO_ID = 'ambient-music-player';
const AUDIO_SRC = '/ambient-meditation.mp3';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(30);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioInitializedRef = useRef(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Initialize audio with AudioManager
    if (!audioInitializedRef.current) {
      const audio = AudioManager.getAudio(AUDIO_ID, AUDIO_SRC, {
        loop: true,
        volume: volume / 100
      });
      
      // Set up error handling
      AudioManager.onError(AUDIO_ID, () => {
        setAudioError(true);
        toast.error("Could not load meditation audio", {
          description: "Please check that the audio file exists in the public folder"
        });
      });
      
      audioInitializedRef.current = true;
    }
    
    // Cleanup on unmount
    return () => {
      if (isPlaying) {
        AudioManager.pauseAudio(AUDIO_ID);
      }
      AudioManager.disposeAudio(AUDIO_ID);
    };
  }, []);

  useEffect(() => {
    if (audioError) return;
    
    if (isPlaying) {
      AudioManager.playAudio(AUDIO_ID).then(() => {
        setIsAudioInitialized(true);
      }).catch(err => {
        console.error("Failed to play audio:", err);
        setIsPlaying(false);
        
        // Show helpful toast for user interaction requirement
        toast.info("Click the sound icon to start ambient music", {
          duration: 5000
        });
      });
    } else {
      AudioManager.pauseAudio(AUDIO_ID);
    }
  }, [isPlaying, audioError]);

  useEffect(() => {
    AudioManager.setVolume(AUDIO_ID, volume / 100);
  }, [volume]);

  const togglePlay = () => {
    if (audioError) {
      // Attempt to reload the audio
      audioInitializedRef.current = false;
      setAudioError(false);
      
      // Initialize audio again
      const audio = AudioManager.getAudio(AUDIO_ID, AUDIO_SRC, {
        loop: true,
        volume: volume / 100
      });
      
      toast.info("Trying to reload ambient music", {
        duration: 3000
      });
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
