
import { useState, useEffect } from "react";
import MusicPlayer from "@/components/MusicPlayer";
import BrainwaveVisualizer from "@/components/BrainwaveVisualizer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import DreamChallenge from "@/components/DreamChallenge";
import { BrainwaveFrequency } from "@/utils/binauralBeats";
import { Brain, Info } from "lucide-react";

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
      </div>
    </div>
  );
};

export default Meditation;
