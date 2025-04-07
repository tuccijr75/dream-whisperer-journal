
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrainwaveFrequency } from "@/utils/binauralBeats";
import BrainwaveVisualizer from "@/components/BrainwaveVisualizer";

interface MeditationVideoDetailProps {
  videoId: string;
  videoUrl: string;
  title: string;
  description: string;
  onClose: () => void;
}

const MeditationVideoDetail = ({ 
  videoId, 
  videoUrl, 
  title, 
  description, 
  onClose 
}: MeditationVideoDetailProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [frequency, setFrequency] = useState<BrainwaveFrequency>("theta");
  const [volume, setVolume] = useState(30);
  const navigate = useNavigate();

  // Map video ID to appropriate brainwave frequency
  useEffect(() => {
    switch(videoId) {
      case "wild-technique":
        setFrequency("theta");
        break;
      case "mild-technique":
        setFrequency("alpha");
        break;
      case "dream-recall":
        setFrequency("delta");
        break;
      default:
        setFrequency("theta");
    }
  }, [videoId]);

  const handleVideoStateChange = (isVideoPlaying: boolean) => {
    setIsPlaying(isVideoPlaying);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="container py-6">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="mr-2 text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
        </div>

        <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-6">
          <iframe 
            src={`${videoUrl}?autoplay=0&controls=1&modestbranding=1&rel=0`}
            className="w-full h-full" 
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        <div className="space-y-4">
          <BrainwaveVisualizer 
            active={isPlaying} 
            frequency={frequency}
            volume={volume}
          />
        </div>
      </div>
    </div>
  );
};

export default MeditationVideoDetail;
