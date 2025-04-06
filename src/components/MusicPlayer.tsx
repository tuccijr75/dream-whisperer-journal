
import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import AudioManager from "@/utils/audioManager";

// More reliable audio sources that are less likely to be blocked by CORS
const AUDIO_ID = 'ambient-music-player';
const AUDIO_SOURCES = [
  'https://assets.mixkit.co/music/preview/mixkit-relaxing-in-nature-522.mp3',
  'https://assets.mixkit.co/music/preview/mixkit-spirit-rising-2.mp3',
  'https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3'
];

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(30);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioInitializedRef = useRef(false);
  const audioLoadAttemptedRef = useRef(false);
  const currentSourceIndexRef = useRef(0);
  const isMobile = useIsMobile();
  
  const tryNextAudioSource = () => {
    // Try the next audio source in our list
    currentSourceIndexRef.current = (currentSourceIndexRef.current + 1) % AUDIO_SOURCES.length;
    const nextSource = AUDIO_SOURCES[currentSourceIndexRef.current];
    
    console.log(`Trying next audio source: ${nextSource}`);
    
    // Reset initialization flags
    audioInitializedRef.current = false;
    audioLoadAttemptedRef.current = false;
    
    // Clean up previous audio element
    AudioManager.disposeAudio(AUDIO_ID);
    
    // Initialize with new source
    initializeAudio(nextSource);
    
    toast.info("Trying alternative audio source", {
      description: "Please wait while we connect to a different audio server"
    });
  };
  
  const initializeAudio = (audioSource) => {
    if (audioInitializedRef.current) return;
    
    try {
      console.log(`Initializing audio with source: ${audioSource}`);
      const audio = AudioManager.getAudio(AUDIO_ID, audioSource, {
        loop: true,
        volume: volume / 100
      });
      
      // Set up error handling
      AudioManager.onError(AUDIO_ID, () => {
        console.error("Error loading ambient meditation audio");
        setAudioError(true);
        
        if (!audioLoadAttemptedRef.current) {
          toast.error("Could not load ambient audio", {
            description: "Trying alternative audio source",
            action: {
              label: "Try Again",
              onClick: tryNextAudioSource
            }
          });
          audioLoadAttemptedRef.current = true;
        }
      });
      
      // Set up handling for successful load
      audio.addEventListener('canplaythrough', () => {
        setAudioError(false);
        setIsAudioInitialized(true);
        audioLoadAttemptedRef.current = false;
        console.log("Audio loaded successfully");
        
        if (isPlaying) {
          AudioManager.playAudio(AUDIO_ID).catch(err => {
            console.error("Failed to play audio after successful load:", err);
          });
        }
      });
      
      audioInitializedRef.current = true;
    } catch (err) {
      console.error("Failed to initialize audio:", err);
      setAudioError(true);
    }
  };

  useEffect(() => {
    // Initialize audio with first source on component mount
    initializeAudio(AUDIO_SOURCES[currentSourceIndexRef.current]);
    
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
          description: "Browser security requires user interaction to play audio",
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
      // Try the next audio source
      tryNextAudioSource();
      setIsPlaying(true);
      return;
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
