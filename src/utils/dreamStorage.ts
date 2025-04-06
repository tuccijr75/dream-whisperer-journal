
import { Dream, DreamComment } from '../types/dream';

const STORAGE_KEY = 'dream-whisperer-entries';

export const getDreams = (): Dream[] => {
  const storedDreams = localStorage.getItem(STORAGE_KEY);
  return storedDreams ? JSON.parse(storedDreams) : [];
};

export const saveDream = (dream: Dream): void => {
  const dreams = getDreams();
  dreams.push(dream);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dreams));
  
  // If this dream is part of a challenge, update challenge completion stats
  if (dream.challengeId) {
    // This will be handled by the challenge storage
    const event = new CustomEvent('dreamChallengeCompleted', { 
      detail: { dreamId: dream.id, challengeId: dream.challengeId } 
    });
    window.dispatchEvent(event);
  }
};

export const updateDream = (updatedDream: Dream): void => {
  const dreams = getDreams();
  const index = dreams.findIndex((dream) => dream.id === updatedDream.id);
  
  if (index !== -1) {
    dreams[index] = updatedDream;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dreams));
  }
};

export const deleteDream = (id: string): void => {
  const dreams = getDreams();
  const filteredDreams = dreams.filter((dream) => dream.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredDreams));
};

export const toggleStarDream = (id: string): void => {
  const dreams = getDreams();
  const index = dreams.findIndex((dream) => dream.id === id);
  
  if (index !== -1) {
    dreams[index].isStarred = !dreams[index].isStarred;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dreams));
  }
};

export const togglePublicDream = (id: string, isPublic: boolean): void => {
  const dreams = getDreams();
  const index = dreams.findIndex((dream) => dream.id === id);
  
  if (index !== -1) {
    dreams[index].isPublic = isPublic;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dreams));
  }
};

export const addDreamComment = (dreamId: string, comment: DreamComment): void => {
  const dreams = getDreams();
  const index = dreams.findIndex((dream) => dream.id === dreamId);
  
  if (index !== -1) {
    if (!dreams[index].comments) {
      dreams[index].comments = [];
    }
    dreams[index].comments.push(comment);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dreams));
  }
};

export const deleteDreamComment = (dreamId: string, commentId: string): void => {
  const dreams = getDreams();
  const dreamIndex = dreams.findIndex((dream) => dream.id === dreamId);
  
  if (dreamIndex !== -1 && dreams[dreamIndex].comments) {
    dreams[dreamIndex].comments = dreams[dreamIndex].comments!.filter(
      comment => comment.id !== commentId
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dreams));
  }
};

export const getDreamById = (id: string): Dream | undefined => {
  const dreams = getDreams();
  return dreams.find((dream) => dream.id === id);
};

export const getDreamsByCategory = (category: string): Dream[] => {
  const dreams = getDreams();
  return dreams.filter((dream) => dream.category === category);
};
