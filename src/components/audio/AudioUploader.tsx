
import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AudioUploaderProps {
  onFileSelected: (objectUrl: string) => void;
  isActive: boolean;
  onToggle: () => void;
}

const AudioUploader = ({ onFileSelected, isActive, onToggle }: AudioUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if it's an audio file
    if (!file.type.startsWith('audio/')) {
      toast.error("Please upload an audio file (MP3, WAV, etc.)");
      return;
    }

    console.log(`Processing audio file: ${file.name}, type: ${file.type}`);

    // Create a local URL for the file
    const objectUrl = URL.createObjectURL(file);
    onFileSelected(objectUrl);
    
    // Reset the input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-end">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className={`hover:bg-dream-light-purple/20 ${isActive ? 'bg-dream-light-purple/20' : ''}`}
        aria-label="Upload custom audio"
        title="Upload custom audio"
      >
        <Upload className="h-4 w-4 text-dream-purple" />
      </Button>
      
      {isActive && (
        <div className="mt-2 p-3 bg-white/90 backdrop-blur-sm shadow-md rounded-lg border border-dream-light-purple/30 w-64">
          <div className="text-sm font-medium mb-2">Upload Music</div>
          <p className="text-xs text-muted-foreground mb-3">
            Select an audio file to use as background music
          </p>
          <Button
            size="sm"
            className="w-full bg-dream-gradient hover:opacity-90"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mr-2 h-3 w-3" />
            Choose Audio File
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Supported: MP3, WAV, OGG (max 10MB)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};

export default AudioUploader;
