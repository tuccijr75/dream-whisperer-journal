
import { Dream } from '../types/dream';

const STORAGE_KEY = 'dream-whisperer-entries';

export const getDreams = (): Dream[] => {
  const storedDreams = localStorage.getItem(STORAGE_KEY);
  return storedDreams ? JSON.parse(storedDreams) : [];
};

export const saveDream = (dream: Dream): void => {
  const dreams = getDreams();
  dreams.push(dream);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dreams));
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
