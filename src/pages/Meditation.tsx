
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
import { BrainwaveFrequency } from "@/utils/binauralBeats";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import MeditationPlayer from "@/components/MeditationPlayer";
import { Brain, Headphones, Moon } from "lucide-react";

const meditationVideos = [
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

const guidedMeditations = [
  {
    id: "lucid-dream-induction",
    title: "Lucid Dream Induction",
    description: "Train your mind to recognize when you're dreaming",
    duration: "15 minutes",
    audioSrc: "https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3",
    technique: "MILD (Mnemonic Induction of Lucid Dreams)",
    thumbnailUrl: "/placeholder.svg"
  },
  {
    id: "dream-recall",
    title: "Dream Recall Enhancement",
    description: "Improve your ability to remember dreams",
    duration: "12 minutes",
    audioSrc: "https://assets.mixkit.co/music/preview/mixkit-relaxing-in-nature-522.mp3",
    technique: "Memory Association",
    thumbnailUrl: "/placeholder.svg"
  },
  {
    id: "wake-back-to-bed",
    title: "Wake Back To Bed (WBTB)",
    description: "A powerful technique combining sleep interruption with intention",
    duration: "20 minutes",
    audioSrc: "https://assets.mixkit.co/music/preview/mixkit-spirit-rising-2.mp3",
    technique: "WBTB",
    thumbnailUrl: "/placeholder.svg"
  },
  {
    id: "reality-checks",
    title: "Reality Check Training",
    description: "Build the habit of questioning reality",
    duration: "10 minutes",
    audioSrc: "https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3",
    technique: "Reality Testing",
    thumbnailUrl: "/placeholder.svg"
  }
];

const Meditation = () => {
  const [frequency, setFrequency] = useState<BrainwaveFrequency>("theta");
  const [volume, setVolume] = useState(50); 
  const [isActive, setIsActive] = useState(true);
  const [selectedMeditation, setSelectedMeditation] = useState<string | null>(null);
  
  const handleSelectVideo = (videoId: string) => {
    console.log(`Selected video: ${videoId}`);
  };
  
  const handleSelectMeditation = (meditationId: string) => {
    setSelectedMeditation(meditationId);
  };
  
  const selectedMeditationData = guidedMeditations.find(
    meditation => meditation.id === selectedMeditation
  );
  
  return (
    <div className="container">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Dream Meditation</h1>
          <p className="text-gray-400">Enhance your dream recall and lucid dreaming abilities with these tools</p>
        </div>
        
        <DreamChallenge />
        
        <Tabs defaultValue="binaural">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="binaural">
              <Brain className="mr-2 h-4 w-4" />
              Binaural Beats
            </TabsTrigger>
            <TabsTrigger value="guided">
              <Headphones className="mr-2 h-4 w-4" />
              Guided Meditations
            </TabsTrigger>
            <TabsTrigger value="videos">
              <Moon className="mr-2 h-4 w-4" />
              Dream Videos
            </TabsTrigger>
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
                    {frequency}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <BrainwaveVisualizer 
                  active={isActive} 
                  frequency={frequency} 
                  volume={volume}
                />
                
                <div className="space-y-4 mt-6">
                  <Separator className="bg-gray-800" />
                  
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    <Button 
                      variant="outline" 
                      className={`${frequency === "delta" ? 'bg-dream-purple/20 border-dream-purple' : ''} border-gray-700`}
                      onClick={() => setFrequency("delta")}
                    >
                      Delta<span className="text-xs block text-gray-400">0.5Hz</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className={`${frequency === "theta" ? 'bg-dream-purple/20 border-dream-purple' : ''} border-gray-700`}
                      onClick={() => setFrequency("theta")}
                    >
                      Theta<span className="text-xs block text-gray-400">4Hz</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className={`${frequency === "alpha" ? 'bg-dream-purple/20 border-dream-purple' : ''} border-gray-700`}
                      onClick={() => setFrequency("alpha")}
                    >
                      Alpha<span className="text-xs block text-gray-400">8Hz</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className={`${frequency === "beta" ? 'bg-dream-purple/20 border-dream-purple' : ''} border-gray-700`}
                      onClick={() => setFrequency("beta")}
                    >
                      Beta<span className="text-xs block text-gray-400">14Hz</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className={`${frequency === "gamma" ? 'bg-dream-purple/20 border-dream-purple' : ''} border-gray-700`}
                      onClick={() => setFrequency("gamma")}
                    >
                      Gamma<span className="text-xs block text-gray-400">30Hz</span>
                    </Button>
                  </div>
                  
                  <div className="py-3">
                    <MusicPlayer />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="guided" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              {guidedMeditations.map((meditation) => (
                <Sheet key={meditation.id}>
                  <SheetTrigger asChild>
                    <div>
                      <MeditationVideoCard 
                        video={{
                          id: meditation.id,
                          title: meditation.title,
                          description: meditation.description,
                          duration: meditation.duration,
                          thumbnailUrl: meditation.thumbnailUrl,
                          videoUrl: "javascript:void(0)"
                        }} 
                        onSelect={() => handleSelectMeditation(meditation.id)}
                      />
                    </div>
                  </SheetTrigger>
                  <SheetContent className="w-full sm:max-w-md md:max-w-lg">
                    <SheetHeader>
                      <SheetTitle>{meditation.title}</SheetTitle>
                      <SheetDescription>
                        Technique: {meditation.technique}
                      </SheetDescription>
                    </SheetHeader>
                    
                    <div className="space-y-4 mt-6">
                      <p className="text-sm text-muted-foreground">{meditation.description}</p>
                      
                      <div className="mt-4">
                        <MeditationPlayer 
                          audioSrc={meditation.audioSrc}
                          title={meditation.title}
                        />
                      </div>
                      
                      <div className="mt-6 rounded-lg bg-muted p-4">
                        <h4 className="text-sm font-medium mb-2">How to use this meditation:</h4>
                        <ol className="text-sm space-y-2 list-decimal list-inside text-muted-foreground">
                          <li>Find a quiet, comfortable place where you won't be disturbed</li>
                          <li>Lie down or sit in a relaxed position</li>
                          <li>Use headphones for the best experience</li>
                          <li>Follow the guided instructions with an open mind</li>
                          <li>Practice regularly for best results</li>
                        </ol>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="videos" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              {meditationVideos.map((video) => (
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
