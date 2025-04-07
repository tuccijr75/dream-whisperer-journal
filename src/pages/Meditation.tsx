
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DreamChallenge from "@/components/DreamChallenge";
import { Info } from "lucide-react";
import MeditationVideoCard from "@/components/MeditationVideoCard";
import MeditationVideoDetail from "@/MeditationVideoDetail";

const meditationVideos = [
  {
    id: "wild-technique",
    title: "WILD Technique",
    description: "Wake Induced Lucid Dreaming technique for directly entering dream state",
    duration: "15:30",
    thumbnailUrl: "/placeholder.svg",
    videoUrl: "https://www.youtube.com/embed/1R44xyuhw4Y"
  },
  {
    id: "mild-technique",
    title: "MILD Technique",
    description: "Mnemonic Induction of Lucid Dreams - mental conditioning before sleep",
    duration: "22:45",
    thumbnailUrl: "/placeholder.svg",
    videoUrl: "https://www.youtube.com/embed/nlpFhcCfM4c"
  },
  {
    id: "dream-recall",
    title: "Dream Recall Meditation",
    description: "Improve your ability to remember dreams in vivid detail",
    duration: "18:20",
    thumbnailUrl: "/placeholder.svg",
    videoUrl: "https://www.youtube.com/embed/qSh-kuRrFqg"
  }
];

const Meditation = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  
  const handleSelectVideo = (videoId: string) => {
    setSelectedVideo(videoId);
  };
  
  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };
  
  // Find the selected video object
  const selectedVideoData = meditationVideos.find(video => video.id === selectedVideo);
  
  return (
    <div className="container px-4 sm:px-6">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">Dream Meditation</h1>
          <p className="text-gray-400">Enhance your dream recall and lucid dreaming abilities with these tools</p>
        </div>
        
        <DreamChallenge />
        
        {/* Guided Meditation Section */}
        <Card className="bg-gray-900/60 border-dream-purple/40">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Guided Meditation</CardTitle>
                <CardDescription>Sleep meditation techniques for lucid dreaming</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {meditationVideos.map(video => (
                <MeditationVideoCard 
                  key={video.id}
                  video={video}
                  onSelect={() => handleSelectVideo(video.id)}
                />
              ))}
            </div>
            
            <Card className="bg-dream-purple/10 border-dream-purple/30 p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-dream-purple mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">Meditation Tips</h4>
                  <p className="text-sm text-gray-300">Use headphones for binaural beats and find a quiet, comfortable space for best results. Practice these techniques regularly to improve dream recall and lucidity.</p>
                </div>
              </div>
            </Card>
          </CardContent>
        </Card>
      </div>
      
      {/* Video Detail Modal */}
      {selectedVideo && selectedVideoData && (
        <MeditationVideoDetail 
          videoId={selectedVideoData.id}
          videoUrl={selectedVideoData.videoUrl}
          title={selectedVideoData.title}
          description={selectedVideoData.description}
          onClose={handleCloseVideo}
        />
      )}
    </div>
  );
};

export default Meditation;
