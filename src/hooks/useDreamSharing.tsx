
import { useState } from "react";
import { Dream, DreamComment } from "@/types/dream";
import { togglePublicDream, addDreamComment, deleteDreamComment } from "@/utils/dreamStorage";
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
  
  const addComment = (comment: DreamComment) => {
    addDreamComment(dream.id, comment);
    onUpdate();
  };
  
  const deleteComment = (commentId: string) => {
    deleteDreamComment(dream.id, commentId);
    onUpdate();
  };
  
  return {
    isShareModalOpen,
    openShareModal,
    closeShareModal,
    togglePublic,
    addComment,
    deleteComment
  };
};
