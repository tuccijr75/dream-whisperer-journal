
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import DreamEntryForm from "@/components/DreamEntryForm";
import DreamList from "@/components/DreamList";
import { getDreams } from "@/utils/dreamStorage";
import { Dream } from "@/types/dream";
import Onboarding from "@/components/Onboarding";
import SearchSuggestions from "@/components/SearchSuggestions";
import { getChallengeById } from "@/utils/challengeStorage";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isAddingDream, setIsAddingDream] = useState(false);
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
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
          <Button 
            onClick={handleAddDream}
            className="bg-dream-gradient hover:opacity-90 transition-opacity"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Dream
          </Button>
        </div>
        
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
