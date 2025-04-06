
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, Music } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import DreamEntryForm from "@/components/DreamEntryForm";
import DreamList from "@/components/DreamList";
import { getDreams } from "@/utils/dreamStorage";
import { Dream } from "@/types/dream";
import Onboarding from "@/components/Onboarding";
import SearchSuggestions from "@/components/SearchSuggestions";
import { getChallengeById } from "@/utils/challengeStorage";
import { useToast } from "@/hooks/use-toast";
import AudioUploader from "@/components/AudioUploader";

const Index = () => {
  const [isAddingDream, setIsAddingDream] = useState(false);
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [showAudioUploader, setShowAudioUploader] = useState(true); // Default to shown
  
  // Get challenge ID from URL if it exists
  const challengeId = searchParams.get('challengeId');

  useEffect(() => {
    // Load dreams from local storage
    loadDreams();
    
    // Check if coming from a challenge
    if (challengeId) {
      const challenge = getChallengeById(challengeId);
      if (challenge) {
        setIsAddingDream(true);
        toast({
          title: "Challenge Active",
          description: `Creating a dream for the "${challenge.title}" challenge`,
        });
      }
    }
  }, [challengeId]);

  const loadDreams = () => {
    setLoading(true);
    try {
      const loadedDreams = getDreams();
      // Sort by date (newest first)
      loadedDreams.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setDreams(loadedDreams);
    } catch (error) {
      console.error("Error loading dreams:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDream = () => {
    setIsAddingDream(true);
  };

  const handleDreamSaved = () => {
    setIsAddingDream(false);
    loadDreams();
  };

  const handleCancel = () => {
    setIsAddingDream(false);
  };

  const handleSearchSelect = (query: string) => {
    setSearchQuery(query);
  };

  const handleAudioUploaded = (audioUrl: string) => {
    console.log("Audio uploaded successfully:", audioUrl);
    toast({
      title: "Audio Ready",
      description: "Your audio is now available for meditation sessions and can be played in the Music Player",
    });
  };

  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center py-12 text-white dream-text">Loading dreams...</div>;
    }

    if (isAddingDream) {
      return <DreamEntryForm 
               onDreamSaved={handleDreamSaved} 
               onCancel={handleCancel}
               challengeId={challengeId || undefined} 
             />;
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white dream-text">Your Dream Journal</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAudioUploader(!showAudioUploader)}
              className="bg-dream-gradient hover:opacity-90 transition-opacity text-white"
            >
              <Music className="mr-2 h-4 w-4" />
              {showAudioUploader ? "Hide Audio Upload" : "Show Audio Upload"}
            </Button>
            <Button 
              onClick={handleAddDream}
              className="bg-dream-gradient hover:opacity-90 transition-opacity"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New Dream
            </Button>
          </div>
        </div>
        
        {showAudioUploader && (
          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-dream-light-purple/30 shadow-lg">
            <h3 className="text-lg font-medium mb-3 text-dream-dark-purple">Upload Custom Audio</h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload your own audio files to use with Dream Whisperer for meditation and sleep.
              We support MP3, WAV, and other common audio formats.
            </p>
            <AudioUploader onAudioUploaded={handleAudioUploaded} />
          </div>
        )}
        
        <div className="mb-4">
          <SearchSuggestions dreams={dreams} onSelect={handleSearchSelect} />
        </div>
        
        <DreamList dreams={dreams} onUpdate={loadDreams} />
      </div>
    );
  };

  return (
    <>
      <Onboarding />
      {renderContent()}
    </>
  );
};

export default Index;
