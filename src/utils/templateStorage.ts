
import { DreamTemplate, DreamReminder } from '@/types/dream';

const TEMPLATES_STORAGE_KEY = 'dream-whisperer-templates';
const REMINDERS_STORAGE_KEY = 'dream-whisperer-reminders';

// Template Management
export const getTemplates = (): DreamTemplate[] => {
  const storedTemplates = localStorage.getItem(TEMPLATES_STORAGE_KEY);
  if (!storedTemplates) {
    // Add default templates on first run
    const defaultTemplates: DreamTemplate[] = [
      {
        id: crypto.randomUUID(),
        name: "Flying Dream",
        description: "I was flying high above the ground...",
        mood: "excited",
        type: "lucid",
        category: "adventure",
        tags: ["flying", "freedom", "sky"]
      },
      {
        id: crypto.randomUUID(),
        name: "Childhood Home",
        description: "I was back in my childhood home...",
        mood: "peaceful",
        type: "normal",
        category: "childhood",
        tags: ["home", "childhood", "memories"]
      },
      {
        id: crypto.randomUUID(),
        name: "Being Chased",
        description: "Something was chasing me and I couldn't escape...",
        mood: "scared",
        type: "nightmare",
        category: "personal",
        tags: ["chase", "fear", "running"]
      }
    ];
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(defaultTemplates));
    return defaultTemplates;
  }
  return JSON.parse(storedTemplates);
};

export const saveTemplate = (template: DreamTemplate): void => {
  const templates = getTemplates();
  templates.push(template);
  localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
};

export const updateTemplate = (updatedTemplate: DreamTemplate): void => {
  const templates = getTemplates();
  const index = templates.findIndex((template) => template.id === updatedTemplate.id);
  
  if (index !== -1) {
    templates[index] = updatedTemplate;
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
  }
};

export const deleteTemplate = (id: string): void => {
  const templates = getTemplates();
  const filteredTemplates = templates.filter((template) => template.id !== id);
  localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(filteredTemplates));
};

// Reminder Management
export const getReminders = (): DreamReminder[] => {
  const storedReminders = localStorage.getItem(REMINDERS_STORAGE_KEY);
  if (!storedReminders) {
    // Add a default reminder on first run
    const defaultReminder: DreamReminder = {
      id: crypto.randomUUID(),
      time: "07:00",
      days: [1, 2, 3, 4, 5], // Monday to Friday
      enabled: false,
      sound: "gentle",
      volume: 50
    };
    localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify([defaultReminder]));
    return [defaultReminder];
  }
  return JSON.parse(storedReminders);
};

export const saveReminder = (reminder: DreamReminder): void => {
  const reminders = getReminders();
  reminders.push(reminder);
  localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders));
};

export const updateReminder = (updatedReminder: DreamReminder): void => {
  const reminders = getReminders();
  const index = reminders.findIndex((reminder) => reminder.id === updatedReminder.id);
  
  if (index !== -1) {
    reminders[index] = updatedReminder;
    localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders));
  }
};

export const deleteReminder = (id: string): void => {
  const reminders = getReminders();
  const filteredReminders = reminders.filter((reminder) => reminder.id !== id);
  localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(filteredReminders));
};

export const toggleReminderStatus = (id: string, enabled: boolean): void => {
  const reminders = getReminders();
  const index = reminders.findIndex((reminder) => reminder.id === id);
  
  if (index !== -1) {
    reminders[index].enabled = enabled;
    localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders));
  }
};
