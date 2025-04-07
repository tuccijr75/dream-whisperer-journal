
import { useState, useEffect, useRef } from "react";
import AudioManager from "@/utils/audioManager";
import { toast } from "sonner";
import { AMBIENT_AUDIO_ID, AUDIO_SOURCES, USER_AUDIO_KEY } from "./constants";

export const useMusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  
  const audioInitializedRef = useRef(false);
  const audioLoadAttemptedRef = useRef(false);
  const currentSourceIndexRef = useRef(0);

  const tryNextAudioSource = () => {
    // Check if we have a custom audio first
    const customAudio = localStorage.getItem(USER_AUDIO_KEY);
    
    if (customAudio && currentSourceIndexRef.current !== -1) {
      // Try the custom audio first
      currentSourceIndexRef.current = -1;
      audioInitializedRef.current = false;
      audioLoadAttemptedRef.current = false;
      AudioManager.disposeAudio(AMBIENT_AUDIO_ID);
      initializeAudio(customAudio);
      toast.info("Playing your custom audio");
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
    AudioManager.disposeAudio(AMBIENT_AUDIO_ID);
    
    // Initialize with new source
    initializeAudio(nextSource);
    
    toast.info("Trying alternative audio source", {
      description: "Please wait while we connect to a different audio server"
    });
  };
  
  const initializeAudio = (audioSource: string) => {
    if (audioInitializedRef.current) return;
    
    try {
      console.log(`Initializing audio with source: ${audioSource}`);
      const audio = AudioManager.getAudio(AMBIENT_AUDIO_ID, audioSource, {
        loop: true,
        volume: 30 / 100
      });
      
      // Set up error handling
      AudioManager.onError(AMBIENT_AUDIO_ID, () => {
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
          AudioManager.playAudio(AMBIENT_AUDIO_ID).catch(err => {
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

  const handleCustomAudioUpload = (objectUrl: string) => {
    // Save to localStorage so it persists between sessions
    try {
      localStorage.setItem(USER_AUDIO_KEY, objectUrl);
      
      // Reset audio player and use new source
      audioInitializedRef.current = false;
      AudioManager.disposeAudio(AMBIENT_AUDIO_ID);
      
      currentSourceIndexRef.current = -1; // Custom audio
      initializeAudio(objectUrl);
      
      toast.success("Custom audio loaded successfully");
      setShowUploader(false);
      
      if (isPlaying) {
        AudioManager.playAudio(AMBIENT_AUDIO_ID);
      }
    } catch (err) {
      console.error("Failed to save custom audio:", err);
      toast.error("Failed to save custom audio");
    }
  };

  // Initialize audio with the correct source (custom or default)
  useEffect(() => {
    // Check if there's a custom audio source first
    const customAudio = localStorage.getItem(USER_AUDIO_KEY);
    
    if (customAudio) {
      try {
        // Make sure the blob URL is still valid
        fetch(customAudio, { method: 'HEAD' })
          .then(response => {
            if (response.ok) {
              initializeAudio(customAudio);
              currentSourceIndexRef.current = -1; // Mark as using custom audio
            } else {
              throw new Error("Blob URL no longer valid");
            }
          })
          .catch(err => {
            console.warn("Custom audio URL no longer valid:", err);
            localStorage.removeItem(USER_AUDIO_KEY);
            initializeAudio(AUDIO_SOURCES[currentSourceIndexRef.current]);
          });
      } catch (err) {
        console.warn("Error checking custom audio:", err);
        initializeAudio(AUDIO_SOURCES[currentSourceIndexRef.current]);
      }
    } else {
      // Initialize audio with first source on component mount
      initializeAudio(AUDIO_SOURCES[currentSourceIndexRef.current]);
    }
    
    // Cleanup on unmount
    return () => {
      if (isPlaying) {
        AudioManager.pauseAudio(AMBIENT_AUDIO_ID);
      }
      AudioManager.disposeAudio(AMBIENT_AUDIO_ID);
    };
  }, []);

  // Handle play/pause state changes
  useEffect(() => {
    if (audioError) return;
    
    if (isPlaying) {
      AudioManager.playAudio(AMBIENT_AUDIO_ID).then(() => {
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
      AudioManager.pauseAudio(AMBIENT_AUDIO_ID);
    }
  }, [isPlaying, audioError]);

  const togglePlay = () => {
    if (audioError) {
      // Try the next audio source
      tryNextAudioSource();
      setIsPlaying(true);
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const toggleUploader = () => {
    setShowUploader(!showUploader);
  };

  return {
    isPlaying,
    isAudioInitialized,
    showUploader,
    togglePlay,
    toggleUploader,
    handleCustomAudioUpload,
  };
};
