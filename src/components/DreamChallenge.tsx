
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DreamChallenge as DreamChallengeType } from "@/types/dream";
import { 
  getChallenges, 
  getActiveChallenge, 
  setActiveChallenge,
  getDreamsByChallenge
} from "@/utils/challengeStorage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Trophy, Star, Users, CheckCircle, Lightbulb, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const DreamChallenge = () => {
  const [challenges, setChallenges] = useState<DreamChallengeType[]>([]);
  const [activeChallenge, setActiveChallengeState] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Load challenges
    const loadedChallenges = getChallenges();
    setChallenges(loadedChallenges);
    
    // Get active challenge
    const active = getActiveChallenge();
    setActiveChallengeState(active);
  }, []);

  const handleJoinChallenge = (challenge: DreamChallengeType) => {
    // Set this challenge as active
    setActiveChallenge(challenge.id);
    setActiveChallengeState(challenge.id);
    
    // Update participants count
    const updatedChallenge = {
      ...challenge,
      participants: (challenge.participants || 0) + 1
    };
    
    // Update challenges in storage
    const updatedChallenges = challenges.map(c => 
      c.id === challenge.id ? updatedChallenge : c
    );
    setChallenges(updatedChallenges);
    
    toast({
      title: "Challenge Joined!",
      description: `You've joined the "${challenge.title}" challenge.`,
    });
  };

  const handleCreateDream = (challenge: DreamChallengeType) => {
    // Navigate to home page with challenge context
    navigate("/?challengeId=" + challenge.id);
  };

  const formatTimeRemaining = (endDate: string) => {
    return formatDistanceToNow(new Date(endDate), { addSuffix: true });
  };

  return (
    <div className="my-8 space-y-6">
      <div className="flex items-center mb-4">
        <Trophy className="text-dream-purple mr-2" size={24} />
        <h2 className="text-2xl font-semibold text-white">Dream Challenges</h2>
      </div>
      
      <Carousel className="w-full">
        <CarouselContent>
          {challenges.map((challenge) => {
            const isActive = challenge.id === activeChallenge;
            const challengeDreams = getDreamsByChallenge(challenge.id);
            const hasCompletedChallenge = challengeDreams.length > 0;
            
            return (
              <CarouselItem key={challenge.id} className="md:basis-1/2 lg:basis-1/3">
                <Card className="bg-gray-900/60 border-dream-purple/40 shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge variant={challenge.type === 'daily' ? 'default' : 'secondary'} className="mb-2">
                        {challenge.type === 'daily' ? 'Daily' : 'Weekly'} Challenge
                      </Badge>
                      <div className="flex items-center text-xs text-gray-400">
                        <Clock size={14} className="mr-1" />
                        <span>Ends {formatTimeRemaining(challenge.endDate)}</span>
                      </div>
                    </div>
                    <CardTitle className="text-dream-purple">{challenge.title}</CardTitle>
                    <CardDescription>{challenge.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="bg-gray-800/60 p-3 rounded-md border border-gray-700 mb-4">
                      <div className="flex items-start mb-2">
                        <Lightbulb size={16} className="text-yellow-400 mr-2 mt-1 shrink-0" />
                        <p className="text-sm italic text-gray-300">{challenge.prompt}</p>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                      <div className="flex items-center">
                        <Users size={14} className="mr-1" />
                        <span>{challenge.participants || 0} participants</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle size={14} className="mr-1" />
                        <span>{challenge.completions || 0} completions</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {isActive ? (
                      <Button 
                        variant="default" 
                        className="w-full bg-dream-gradient hover:opacity-90 transition-opacity"
                        onClick={() => handleCreateDream(challenge)}
                      >
                        {hasCompletedChallenge ? "Create Another Dream" : "Create Dream"}
                      </Button>
                    ) : (
                      <Button 
                        variant="outline"
                        className="w-full border-dream-purple text-dream-purple hover:bg-dream-purple/10"
                        onClick={() => handleJoinChallenge(challenge)}
                      >
                        Join Challenge
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <div className="flex justify-center mt-2">
          <CarouselPrevious className="relative -left-0 top-0 translate-x-0 -translate-y-0 mr-2" />
          <CarouselNext className="relative -right-0 top-0 translate-x-0 -translate-y-0" />
        </div>
      </Carousel>
    </div>
  );
};

export default DreamChallenge;
