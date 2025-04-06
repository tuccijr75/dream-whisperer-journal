
import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import AudioManager from "@/utils/audioManager";

// Free audio sources that should work without CORS issues
const AUDIO_ID = 'ambient-music-player';
const AUDIO_SOURCES = [
  '/gentle-wake.mp3', 
  '/crystal-bells.mp3',
  '/nature-sounds.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
];

// Storage key for user uploaded audio
const USER_AUDIO_KEY = 'dream-whisperer-user-audio';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(30);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const audioInitializedRef = useRef(false);
  const audioLoadAttemptedRef = useRef(false);
  const currentSourceIndexRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  
  // Function to handle custom audio upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if it's an audio file
    if (!file.type.startsWith('audio/')) {
      toast.error("Please upload an audio file (MP3, WAV, etc.)");
      return;
    }

    // Create a local URL for the file
    const objectUrl = URL.createObjectURL(file);
    
    // Save to localStorage so it persists between sessions
    try {
      localStorage.setItem(USER_AUDIO_KEY, objectUrl);
      
      // Reset audio player and use new source
      audioInitializedRef.current = false;
      AudioManager.disposeAudio(AUDIO_ID);
      
      currentSourceIndexRef.current = -1; // Custom audio
      initializeAudio(objectUrl);
      
      toast.success("Custom audio loaded successfully");
      
      if (isPlaying) {
        AudioManager.playAudio(AUDIO_ID);
      }
    } catch (err) {
      console.error("Failed to save custom audio:", err);
      toast.error("Failed to save custom audio");
    }
  };
  
  const tryNextAudioSource = () => {
    // Check if we have a custom audio first
    const customAudio = localStorage.getItem(USER_AUDIO_KEY);
    
    if (customAudio && currentSourceIndexRef.current !== -1) {
      // Try the custom audio first
      currentSourceIndexRef.current = -1;
      audioInitializedRef.current = false;
      audioLoadAttemptedRef.current = false;
      AudioManager.disposeAudio(AUDIO_ID);
      initializeAudio(customAudio);
      toast.info("Trying your custom audio");
      return;
    }
    
    // If no custom audio or it failed, try the next built-in source
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
    // Check if there's a custom audio source first
    const customAudio = localStorage.getItem(USER_AUDIO_KEY);
    
    if (customAudio) {
      initializeAudio(customAudio);
      currentSourceIndexRef.current = -1; // Mark as using custom audio
    } else {
      // Initialize audio with first source on component mount
      initializeAudio(AUDIO_SOURCES[currentSourceIndexRef.current]);
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

  const handleUploadClick = () => {
    fileInputRef.current?.click();
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
      
      <Button
        variant="ghost"
        size="icon"
        onClick={handleUploadClick}
        className="hover:bg-dream-light-purple/20"
        aria-label="Upload custom audio"
      >
        <Upload className="h-4 w-4 text-dream-purple" />
      </Button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default MusicPlayer;
