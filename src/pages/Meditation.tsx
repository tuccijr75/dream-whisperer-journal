
import { useState, useEffect } from "react";
import MusicPlayer from "@/components/MusicPlayer";
import BrainwaveVisualizer from "@/components/BrainwaveVisualizer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MeditationVideoCard from "@/components/MeditationVideoCard";
import { Badge } from "@/components/ui/badge";
import DreamChallenge from "@/components/DreamChallenge";

const mediationVideos = [
  {
    id: "1",
    title: "Lucid Dream Induction",
    description: "A guided meditation to help induce lucid dreams",
    duration: "15 minutes",
    thumbnailUrl: "/placeholder.svg",
    videoUrl: "https://example.com/video1"
  },
  {
    id: "2",
    title: "Deep Dream Exploration",
    description: "Explore your subconscious and enhance dream recall",
    duration: "20 minutes",
    thumbnailUrl: "/placeholder.svg",
    videoUrl: "https://example.com/video2"
  },
  {
    id: "3",
    title: "Nightmare Transformation",
    description: "Transform recurring nightmares into positive experiences",
    duration: "18 minutes",
    thumbnailUrl: "/placeholder.svg",
    videoUrl: "https://example.com/video3"
  },
  {
    id: "4",
    title: "Pre-Sleep Relaxation",
    description: "Calm your mind and prepare for a peaceful sleep",
    duration: "10 minutes",
    thumbnailUrl: "/placeholder.svg",
    videoUrl: "https://example.com/video4"
  }
];

const Meditation = () => {
  const [frequency, setFrequency] = useState(7.83); // Default to Schumann resonance
  
  const handleSelectVideo = (videoId: string) => {
    // Handle video selection logic here
    console.log(`Selected video: ${videoId}`);
  };
  
  return (
    <div className="container">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Dream Meditation</h1>
          <p className="text-gray-400">Enhance your dream recall and lucid dreaming abilities with these tools</p>
        </div>
        
        {/* Dream Challenges */}
        <DreamChallenge />
        
        <Tabs defaultValue="binaural">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="binaural">Binaural Beats</TabsTrigger>
            <TabsTrigger value="guided">Guided Meditations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="binaural" className="space-y-6">
            <Card className="bg-gray-900/60 border-dream-purple/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Brainwave Entrainment</CardTitle>
                    <CardDescription>Binaural beats to induce different brain states</CardDescription>
                  </div>
                  <Badge variant="outline" className="ml-2 bg-dream-purple/20 text-dream-purple border-dream-purple/50">
                    {frequency}Hz
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <BrainwaveVisualizer frequency={frequency} height={200} />
                
                <div className="space-y-4 mt-6">
                  <Separator className="bg-gray-800" />
                  
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    <Button 
                      variant="outline" 
                      className={`${frequency === 0.5 ? 'bg-dream-purple/20 border-dream-purple' : ''} border-gray-700`}
                      onClick={() => setFrequency(0.5)}
                    >
                      Delta<span className="text-xs block text-gray-400">0.5Hz</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className={`${frequency === 4 ? 'bg-dream-purple/20 border-dream-purple' : ''} border-gray-700`}
                      onClick={() => setFrequency(4)}
                    >
                      Theta<span className="text-xs block text-gray-400">4Hz</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className={`${frequency === 7.83 ? 'bg-dream-purple/20 border-dream-purple' : ''} border-gray-700`}
                      onClick={() => setFrequency(7.83)}
                    >
                      Schumann<span className="text-xs block text-gray-400">7.83Hz</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className={`${frequency === 10 ? 'bg-dream-purple/20 border-dream-purple' : ''} border-gray-700`}
                      onClick={() => setFrequency(10)}
                    >
                      Alpha<span className="text-xs block text-gray-400">10Hz</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className={`${frequency === 16 ? 'bg-dream-purple/20 border-dream-purple' : ''} border-gray-700`}
                      onClick={() => setFrequency(16)}
                    >
                      Beta<span className="text-xs block text-gray-400">16Hz</span>
                    </Button>
                  </div>
                  
                  <div className="py-3">
                    <MusicPlayer audioSrc="/ambient-meditation.mp3" frequency={frequency.toString()} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="guided" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              {mediationVideos.map((video) => (
                <MeditationVideoCard 
                  key={video.id} 
                  video={video} 
                  onSelect={() => handleSelectVideo(video.id)} 
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Meditation;
