
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Header from "@/components/Header";
import EmptyState from "@/components/EmptyState";
import DreamEntryForm from "@/components/DreamEntryForm";
import DreamList from "@/components/DreamList";
import { getDreams } from "@/utils/dreamStorage";
import { Dream } from "@/types/dream";

const Index = () => {
  const [isAddingDream, setIsAddingDream] = useState(false);
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load dreams from local storage
    loadDreams();
  }, []);

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

  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center py-12 text-white dream-text">Loading dreams...</div>;
    }

    if (isAddingDream) {
      return <DreamEntryForm onDreamSaved={handleDreamSaved} onCancel={handleCancel} />;
    }

    if (dreams.length === 0) {
      return <EmptyState onAddDream={handleAddDream} />;
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
        <DreamList dreams={dreams} onUpdate={loadDreams} />
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="background-pattern"></div>
      <div className="container py-8 px-4 max-w-6xl relative z-10">
        <div className="flex items-center justify-between">
          <Header />
        </div>
        <main className="pt-4 pb-16">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
