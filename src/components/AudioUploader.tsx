
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Check, AlertCircle, PlayCircle, PauseCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AudioManager from "@/utils/audioManager";

interface AudioUploaderProps {
  onAudioUploaded?: (audioUrl: string) => void;
}

const AudioUploader = ({ onAudioUploaded }: AudioUploaderProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const TEST_AUDIO_ID = 'test-uploaded-audio';

  // Check for existing audio in localStorage when component mounts
  useState(() => {
    try {
      const savedAudio = localStorage.getItem('dream-whisperer-user-audio');
      if (savedAudio && savedAudio.startsWith('blob:')) {
        setUploadedFile(savedAudio);
        setFileName("Previously uploaded audio");
      }
    } catch (err) {
      console.warn("Could not retrieve saved audio:", err);
    }
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if it's an audio file
    if (!file.type.startsWith('audio/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an audio file (MP3, WAV, etc.)",
        variant: "destructive",
      });
      return;
    }

    console.log(`Processing audio file: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);
    
    setIsUploading(true);
    setFileName(file.name);
    setFileSize((file.size / (1024 * 1024)).toFixed(2) + " MB");
    
    // Create a local URL for the file
    const objectUrl = URL.createObjectURL(file);
    console.log(`Created object URL: ${objectUrl}`);
    
    // Test if audio can be played
    try {
      // Clean up previous test audio if it exists
      AudioManager.disposeAudio(TEST_AUDIO_ID);
      
      // Create test audio and set up error handling
      const audio = new Audio(objectUrl);
      
      // Set up error handling
      audio.onerror = (e) => {
        console.error("Error loading uploaded audio file:", e);
        setIsUploading(false);
        toast({
          title: "Audio file cannot be played",
          description: "The file might be corrupted or in an unsupported format.",
          variant: "destructive",
        });
        URL.revokeObjectURL(objectUrl);
      };
      
      // Set up success handler
      audio.oncanplaythrough = () => {
        // Audio is playable
        setUploadedFile(objectUrl);
        setIsUploading(false);
        
        if (onAudioUploaded) {
          onAudioUploaded(objectUrl);
        }
        
        toast({
          title: "Audio uploaded",
          description: `${file.name} is now available in your app`,
        });
        
        // Store in localStorage for persistence
        try {
          localStorage.setItem('dream-whisperer-user-audio', objectUrl);
        } catch (err) {
          console.warn("Could not store audio URL in localStorage", err);
        }
      };
      
      // Force the loading of audio
      audio.load();
      
      // Set a timeout to handle files that neither succeed nor fail
      setTimeout(() => {
        if (isUploading) {
          setIsUploading(false);
          toast({
            title: "Upload complete",
            description: "Your audio file is now available.",
          });
          setUploadedFile(objectUrl);
          
          try {
            localStorage.setItem('dream-whisperer-user-audio', objectUrl);
          } catch (err) {
            console.warn("Could not store audio URL in localStorage", err);
          }
          
          if (onAudioUploaded) {
            onAudioUploaded(objectUrl);
          }
        }
      }, 3000); // 3 second timeout
      
    } catch (err) {
      console.error("Failed to test audio playability:", err);
      setIsUploading(false);
      toast({
        title: "Error uploading audio",
        description: "Could not process the audio file",
        variant: "destructive",
      });
      URL.revokeObjectURL(objectUrl);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearFile = () => {
    if (uploadedFile) {
      URL.revokeObjectURL(uploadedFile);
      // Cleanup test audio if it exists
      AudioManager.disposeAudio(TEST_AUDIO_ID);
      // Remove from localStorage
      localStorage.removeItem('dream-whisperer-user-audio');
    }
    setUploadedFile(null);
    setFileName("");
    setFileSize("");
    setIsPlaying(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const togglePlayback = () => {
    if (!uploadedFile || !audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.error("Failed to play audio:", err);
        toast({
          title: "Playback failed",
          description: "Could not play the audio file",
          variant: "destructive",
        });
      });
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Handle audio element events
  const handleAudioPlay = () => setIsPlaying(true);
  const handleAudioPause = () => setIsPlaying(false);
  const handleAudioEnded = () => setIsPlaying(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button
          onClick={handleButtonClick}
          disabled={isUploading}
          className="bg-dream-gradient hover:opacity-90 transition-opacity"
        >
          <Upload className="mr-2 h-4 w-4" />
          {isUploading ? "Uploading..." : "Upload Audio"}
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
        />
        
        {uploadedFile && (
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleClearFile}
            className="border-dream-light-purple/30"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {uploadedFile && (
        <div className="flex flex-col p-3 rounded-md bg-muted/50 border border-dream-light-purple/30">
          <div className="flex items-center mb-2">
            <Check className="text-green-500 mr-2 h-4 w-4 flex-shrink-0" />
            <div className="flex flex-col flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{fileName}</p>
              <p className="text-xs text-muted-foreground">{fileSize}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlayback}
              className="flex-shrink-0 h-8 w-8"
            >
              {isPlaying ? (
                <PauseCircle className="h-5 w-5 text-dream-purple" />
              ) : (
                <PlayCircle className="h-5 w-5 text-dream-purple" />
              )}
            </Button>
          </div>
          
          <audio 
            ref={audioRef}
            src={uploadedFile}
            onPlay={handleAudioPlay}
            onPause={handleAudioPause}
            onEnded={handleAudioEnded}
            className="w-full h-8"
            controls
          >
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
      
      <div className="text-xs text-muted-foreground">
        <p className="flex items-center">
          <AlertCircle className="mr-1 h-3 w-3" />
          Supported formats: MP3, WAV, OGG, AAC (max 10MB)
        </p>
        <p className="flex items-center mt-1">
          <AlertCircle className="mr-1 h-3 w-3" />
          Note: Uploaded audio is stored in your browser and may not persist after closing the app.
        </p>
      </div>
    </div>
  );
};

export default AudioUploader;
