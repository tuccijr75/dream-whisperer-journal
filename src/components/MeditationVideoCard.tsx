
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface MeditationVideo {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl: string;
}

interface MeditationVideoCardProps {
  video: MeditationVideo;
  onSelect: () => void;
}

const MeditationVideoCard = ({ video, onSelect }: MeditationVideoCardProps) => {
  return (
    <Card className="border-dream-light-purple/30 bg-white/50 backdrop-blur-sm overflow-hidden hover:shadow-md transition-shadow group">
      <div className="relative">
        <img 
          src={video.thumbnailUrl} 
          alt={video.title} 
          className="w-full aspect-video object-cover group-hover:opacity-90 transition-opacity"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            className="bg-dream-gradient hover:opacity-90 transition-opacity"
            onClick={onSelect}
          >
            <Play className="mr-2 h-4 w-4" />
            Play
          </Button>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded-md">
          <span className="text-xs text-white">{video.duration}</span>
        </div>
      </div>
      <CardContent className="pt-3 pb-2">
        <h3 className="text-base font-medium truncate">{video.title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 h-10">{video.description}</p>
      </CardContent>
      <CardFooter className="pt-0 pb-3">
        <Button 
          variant="ghost" 
          className="w-full text-dream-purple hover:text-dream-deep-purple hover:bg-dream-light-purple/20"
          onClick={onSelect}
        >
          <Play className="mr-2 h-4 w-4" />
          Watch Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MeditationVideoCard;
