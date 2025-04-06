
import { useState } from "react";
import { Dream } from "@/types/dream";
import { togglePublicDream } from "@/utils/dreamStorage";
import { useToast } from "@/hooks/use-toast";

export const useDreamSharing = (dream: Dream, onUpdate: () => void) => {
  const { toast } = useToast();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  const openShareModal = () => {
    setIsShareModalOpen(true);
  };
  
  const closeShareModal = () => {
    setIsShareModalOpen(false);
  };
  
  const togglePublic = (isPublic: boolean) => {
    togglePublicDream(dream.id, isPublic);
    
    toast({
      title: isPublic ? "Dream is now public" : "Dream is now private",
      description: isPublic 
        ? "This dream can now be shared with others" 
        : "This dream can no longer be shared",
    });
    
    onUpdate();
  };
  
  return {
    isShareModalOpen,
    openShareModal,
    closeShareModal,
    togglePublic
  };
};
