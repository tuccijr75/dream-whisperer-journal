
import { useState, useEffect } from "react";
import MusicPlayer from "@/components/MusicPlayer";
import BrainwaveVisualizer from "@/components/BrainwaveVisualizer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import DreamChallenge from "@/components/DreamChallenge";
import { BrainwaveFrequency } from "@/utils/binauralBeats";
import { Brain, Info, Clock, Moon } from "lucide-react";

const frequencyDescriptions = {
  delta: "0.5-4 Hz - Deep sleep and healing",
  theta: "4-8 Hz - REM sleep, meditation, creativity",
  alpha: "8-13 Hz - Relaxation, pre-sleep, calm alertness",
  beta: "13-30 Hz - Active thinking, focus, alertness",
  gamma: "30-100 Hz - Higher mental activity, insight"
};

const Meditation = () => {
  const [frequency, setFrequency] = useState<BrainwaveFrequency>("theta");
  const [volume, setVolume] = useState(50); 
  const [isActive, setIsActive] = useState(true);
  
  return (
    <div className="container">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Dream Meditation</h1>
          <p className="text-gray-400">Enhance your dream recall and lucid dreaming abilities with these tools</p>
        </div>
        
        <DreamChallenge />
        
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
                  className={`${frequency === "delta" ? 'bg-dream-purple/20 border-dream-purple' : ''} border-gray-700 flex flex-col items-center`}
                  onClick={() => setFrequency("delta")}
                >
                  <span>Delta</span>
                  <span className="text-xs block text-gray-400">0.5-4Hz</span>
                </Button>
                <Button 
                  variant="outline" 
                  className={`${frequency === "theta" ? 'bg-dream-purple/20 border-dream-purple' : ''} border-gray-700 flex flex-col items-center`}
                  onClick={() => setFrequency("theta")}
                >
                  <span>Theta</span>
                  <span className="text-xs block text-gray-400">4-8Hz</span>
                </Button>
                <Button 
                  variant="outline" 
                  className={`${frequency === "alpha" ? 'bg-dream-purple/20 border-dream-purple' : ''} border-gray-700 flex flex-col items-center`}
                  onClick={() => setFrequency("alpha")}
                >
                  <span>Alpha</span>
                  <span className="text-xs block text-gray-400">8-13Hz</span>
                </Button>
                <Button 
                  variant="outline" 
                  className={`${frequency === "beta" ? 'bg-dream-purple/20 border-dream-purple' : ''} border-gray-700 flex flex-col items-center`}
                  onClick={() => setFrequency("beta")}
                >
                  <span>Beta</span>
                  <span className="text-xs block text-gray-400">13-30Hz</span>
                </Button>
                <Button 
                  variant="outline" 
                  className={`${frequency === "gamma" ? 'bg-dream-purple/20 border-dream-purple' : ''} border-gray-700 flex flex-col items-center`}
                  onClick={() => setFrequency("gamma")}
                >
                  <span>Gamma</span>
                  <span className="text-xs block text-gray-400">30Hz+</span>
                </Button>
              </div>
              
              <Card className="bg-gray-900/40 border-gray-700/50 p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-dream-purple mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-white mb-1">{frequency.charAt(0).toUpperCase() + frequency.slice(1)} Waves</h4>
                    <p className="text-sm text-gray-300">{frequencyDescriptions[frequency]}</p>
                  </div>
                </div>
              </Card>
              
              <div className="py-3">
                <MusicPlayer />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Meditation Section */}
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
              <Card className="bg-gray-900/40 border-gray-700/50 overflow-hidden hover:border-dream-purple/50 transition-colors">
                <div className="aspect-video bg-gray-800 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button className="bg-dream-purple/90 hover:bg-dream-purple text-white rounded-full size-12">
                      <Brain className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-white">WILD Technique</h3>
                    <Badge variant="outline" className="bg-dream-purple/20 text-dream-purple border-dream-purple/50">
                      <Clock className="mr-1 h-3 w-3" /> 15:30
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-300">Wake Induced Lucid Dreaming technique for directly entering dream state</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900/40 border-gray-700/50 overflow-hidden hover:border-dream-purple/50 transition-colors">
                <div className="aspect-video bg-gray-800 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button className="bg-dream-purple/90 hover:bg-dream-purple text-white rounded-full size-12">
                      <Moon className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-white">MILD Technique</h3>
                    <Badge variant="outline" className="bg-dream-purple/20 text-dream-purple border-dream-purple/50">
                      <Clock className="mr-1 h-3 w-3" /> 22:45
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-300">Mnemonic Induction of Lucid Dreams - mental conditioning before sleep</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900/40 border-gray-700/50 overflow-hidden hover:border-dream-purple/50 transition-colors">
                <div className="aspect-video bg-gray-800 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button className="bg-dream-purple/90 hover:bg-dream-purple text-white rounded-full size-12">
                      <Brain className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-white">Dream Recall Meditation</h3>
                    <Badge variant="outline" className="bg-dream-purple/20 text-dream-purple border-dream-purple/50">
                      <Clock className="mr-1 h-3 w-3" /> 18:20
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-300">Improve your ability to remember dreams in vivid detail</p>
                </CardContent>
              </Card>
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
    </div>
  );
};

export default Meditation;
