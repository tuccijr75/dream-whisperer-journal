
import { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useIsMobile } from "@/hooks/use-mobile";
import AudioManager from "@/utils/audioManager";

interface VolumeControlProps {
  audioId: string;
  isPlaying: boolean;
  initialVolume?: number;
  onPlayStateChange: (isPlaying: boolean) => void;
}

const VolumeControl = ({ 
  audioId, 
  isPlaying, 
  initialVolume = 30,
  onPlayStateChange 
}: VolumeControlProps) => {
  const [volume, setVolume] = useState(initialVolume);
  const isMobile = useIsMobile();

  useEffect(() => {
    AudioManager.setVolume(audioId, volume / 100);
  }, [volume, audioId]);

  const togglePlay = () => {
    onPlayStateChange(!isPlaying);
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
      
      {isPlaying && (
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

export default VolumeControl;
