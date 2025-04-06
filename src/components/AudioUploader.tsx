
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AudioUploaderProps {
  onAudioUploaded?: (audioUrl: string) => void;
}

const AudioUploader = ({ onAudioUploaded }: AudioUploaderProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    setIsUploading(true);
    
    // Create a local URL for the file
    const objectUrl = URL.createObjectURL(file);
    
    // Simulate a short delay to show the upload process
    setTimeout(() => {
      setUploadedFile(objectUrl);
      setIsUploading(false);
      
      if (onAudioUploaded) {
        onAudioUploaded(objectUrl);
      }
      
      toast({
        title: "Audio uploaded",
        description: `${file.name} is now available in your app`,
      });
    }, 1000);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearFile = () => {
    if (uploadedFile) {
      URL.revokeObjectURL(uploadedFile);
    }
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
        <div className="flex items-center p-2 rounded-md bg-muted/50 border border-dream-light-purple/30">
          <Check className="text-green-500 mr-2 h-4 w-4" />
          <p className="text-sm truncate flex-1">Audio ready for use</p>
          <audio controls className="w-full max-w-[200px] h-8">
            <source src={uploadedFile} />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
      
      <div className="text-xs text-muted-foreground">
        <p className="flex items-center">
          <AlertCircle className="mr-1 h-3 w-3" />
          Note: Uploaded audio is stored temporarily and will not persist after page refresh.
        </p>
      </div>
    </div>
  );
};

export default AudioUploader;
