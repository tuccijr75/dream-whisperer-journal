
import { DreamChallenge } from '@/types/dream';
import { getDreams } from './dreamStorage';

const CHALLENGES_STORAGE_KEY = 'dream-whisperer-challenges';
const ACTIVE_CHALLENGE_KEY = 'dream-whisperer-active-challenge';

// Default challenges to show when first loading the app
const DEFAULT_CHALLENGES: DreamChallenge[] = [
  {
    id: crypto.randomUUID(),
    title: 'Lucid Dreaming Week',
    description: 'Try to achieve lucidity in your dreams over the next 7 days',
    prompt: 'Tonight, as you fall asleep, remind yourself that you want to recognize when you're dreaming. Look for dream signs - unusual events that hint you might be in a dream.',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    type: 'weekly',
    isActive: true,
    participants: 128,
    completions: 43
  },
  {
    id: crypto.randomUUID(),
    title: 'Childhood Memories',
    description: 'Reconnect with your childhood dreams and memories',
    prompt: 'Before sleep, look at old childhood photos or think about your favorite childhood places. Notice what feelings arise and carry them into your dreams.',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    type: 'daily',
    isActive: false,
    participants: 76,
    completions: 22
  },
  {
    id: crypto.randomUUID(),
    title: 'Flying Dreams',
    description: 'Experience the freedom of flight in your dreams',
    prompt: 'As you drift to sleep, imagine yourself floating and flying freely above your neighborhood. Feel the sensation of weightlessness.',
    startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    type: 'weekly',
    isActive: false,
    participants: 204,
    completions: 89
  }
];

export const getChallenges = (): DreamChallenge[] => {
  const storedChallenges = localStorage.getItem(CHALLENGES_STORAGE_KEY);
  if (!storedChallenges) {
    localStorage.setItem(CHALLENGES_STORAGE_KEY, JSON.stringify(DEFAULT_CHALLENGES));
    return DEFAULT_CHALLENGES;
  }
  return JSON.parse(storedChallenges);
};

export const saveChallenge = (challenge: DreamChallenge): void => {
  const challenges = getChallenges();
  challenges.push(challenge);
  localStorage.setItem(CHALLENGES_STORAGE_KEY, JSON.stringify(challenges));
};

export const updateChallenge = (updatedChallenge: DreamChallenge): void => {
  const challenges = getChallenges();
  const index = challenges.findIndex((challenge) => challenge.id === updatedChallenge.id);
  
  if (index !== -1) {
    challenges[index] = updatedChallenge;
    localStorage.setItem(CHALLENGES_STORAGE_KEY, JSON.stringify(challenges));
  }
};

export const deleteChallenge = (id: string): void => {
  const challenges = getChallenges();
  const filteredChallenges = challenges.filter((challenge) => challenge.id !== id);
  localStorage.setItem(CHALLENGES_STORAGE_KEY, JSON.stringify(filteredChallenges));
};

export const getActiveChallenge = (): string | null => {
  return localStorage.getItem(ACTIVE_CHALLENGE_KEY);
};

export const setActiveChallenge = (id: string | null): void => {
  if (id) {
    localStorage.setItem(ACTIVE_CHALLENGE_KEY, id);
  } else {
    localStorage.removeItem(ACTIVE_CHALLENGE_KEY);
  }
};

export const getChallengeById = (id: string): DreamChallenge | undefined => {
  const challenges = getChallenges();
  return challenges.find((challenge) => challenge.id === id);
};

export const getActiveChallenges = (): DreamChallenge[] => {
  const challenges = getChallenges();
  const now = new Date().toISOString();
  return challenges.filter(
    (challenge) => challenge.startDate <= now && challenge.endDate >= now
  );
};

export const getDreamsByChallenge = (challengeId: string) => {
  const dreams = getDreams();
  return dreams.filter(dream => dream.challengeId === challengeId);
};
