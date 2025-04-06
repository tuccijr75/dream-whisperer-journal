
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Moon } from "lucide-react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import MeditationVideoCard from "@/components/MeditationVideoCard";
import { useToast } from "@/hooks/use-toast";

interface MeditationVideo {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl: string;
}

const meditationVideos: MeditationVideo[] = [
  {
    id: "sleep-1",
    title: "Deep Sleep Meditation",
    description: "Guided meditation to help you fall into a deep, restful sleep.",
    duration: "30 min",
    thumbnailUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=500&auto=format",
    videoUrl: "https://www.youtube.com/embed/1vx8iUvfyCY"
  },
  {
    id: "sleep-2",
    title: "Sleep Hypnosis",
    description: "Fall asleep faster with this calming hypnosis session.",
    duration: "45 min",
    thumbnailUrl: "https://images.unsplash.com/photo-1531353826977-0941b4779a1c?q=80&w=500&auto=format",
    videoUrl: "https://www.youtube.com/embed/hvOgpzRJxJg"
  },
  {
    id: "sleep-3",
    title: "Peaceful Night Meditation",
    description: "Calm your mind and prepare for a peaceful night's sleep.",
    duration: "20 min",
    thumbnailUrl: "https://images.unsplash.com/photo-1566438480900-0609be27a4be?q=80&w=500&auto=format",
    videoUrl: "https://www.youtube.com/embed/p76Zf-H0yLM"
  },
  {
    id: "sleep-4",
    title: "Lucid Dream Meditation",
    description: "Guide your mind towards lucid dreaming as you fall asleep.",
    duration: "40 min",
    thumbnailUrl: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=500&auto=format",
    videoUrl: "https://www.youtube.com/embed/ehmk8dzNgPg"
  },
];

const Meditation = () => {
  const [selectedVideo, setSelectedVideo] = useState<MeditationVideo | null>(null);
  const { toast } = useToast();

  const handleSelectVideo = (video: MeditationVideo) => {
    setSelectedVideo(video);
    toast({
      title: "Now Playing",
      description: video.title,
    });
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  return (
    <>
      <div className="background-pattern"></div>
      <div className="min-h-screen">
        <div className="container py-8 px-4 max-w-6xl relative z-10">
          <div className="flex items-center justify-between">
            <Header />
            <Navigation />
          </div>
          <main className="pt-4 pb-16">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Moon className="text-[#f0e6cf] h-6 w-6" />
                  <h2 className="text-xl font-semibold text-white dream-text">Sleep Meditation</h2>
                </div>
              </div>
              
              {selectedVideo ? (
                <div className="space-y-4 animate-fade-in">
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden">
                    <iframe 
                      className="absolute top-0 left-0 w-full h-full"
                      src={selectedVideo.videoUrl} 
                      title={selectedVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium text-white">{selectedVideo.title}</h3>
                      <p className="text-sm text-white/70">{selectedVideo.description}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleCloseVideo}
                      className="border-dream-light-purple/50 text-white hover:bg-dream-light-purple/20"
                    >
                      Back to Videos
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {meditationVideos.map((video) => (
                    <MeditationVideoCard 
                      key={video.id}
                      video={video}
                      onSelect={() => handleSelectVideo(video)}
                    />
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Meditation;
