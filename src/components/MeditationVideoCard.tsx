
import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import MeditationVideoPlayer from "./MeditationVideoPlayer";

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
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSelect = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    onSelect();
    setIsOpen(true);
  };

  // Process YouTube URL to get the embed URL if it's a YouTube link
  const getVideoUrl = (url: string) => {
    if (url.includes('youtu.be') || url.includes('youtube.com')) {
      // Extract YouTube video ID
      let videoId = '';
      
      if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1];
      } else if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1];
        const ampersandPosition = videoId.indexOf('&');
        if (ampersandPosition !== -1) {
          videoId = videoId.substring(0, ampersandPosition);
        }
      }
      
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`;
      }
    }
    
    return url;
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Card className="border-dream-light-purple/30 bg-white/50 backdrop-blur-sm overflow-hidden hover:shadow-md transition-shadow group cursor-pointer" onClick={handleSelect}>
          <div className="relative">
            <img 
              src={video.thumbnailUrl} 
              alt={video.title} 
              className="w-full aspect-video object-cover group-hover:opacity-90 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                className="bg-dream-gradient hover:opacity-90 transition-opacity"
                onClick={handleSelect}
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
              onClick={handleSelect}
            >
              <Play className="mr-2 h-4 w-4" />
              Start Now
            </Button>
          </CardFooter>
        </Card>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
        <SheetHeader>
          <SheetTitle>{video.title}</SheetTitle>
          <SheetDescription>{video.description}</SheetDescription>
        </SheetHeader>
        
        <div className="mt-6">
          {video.videoUrl.includes('youtube.com') || video.videoUrl.includes('youtu.be') ? (
            <div className="relative w-full pb-[56.25%] overflow-hidden bg-black rounded-md">
              <iframe 
                src={getVideoUrl(video.videoUrl)}
                className="absolute top-0 left-0 w-full h-full"
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <MeditationVideoPlayer videoUrl={video.videoUrl} title={video.title} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MeditationVideoCard;
