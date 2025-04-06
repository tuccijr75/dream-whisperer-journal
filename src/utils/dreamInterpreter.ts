
// Basic dream interpretation engine
// This simulates an AI interpretation service

// Common dream symbols and their interpretations
const dreamSymbols = {
  // Animals
  dog: "Loyalty, friendship, or protection",
  cat: "Independence, mystery, or feminine aspects",
  bird: "Freedom, perspective, or messages",
  snake: "Transformation, healing, or hidden fears",
  spider: "Creativity, feminine energy, or feeling trapped",
  
  // Objects
  house: "Your mind, self, or personal life",
  car: "Direction in life, personal journey, or control",
  water: "Emotions, unconscious, or purification",
  fire: "Transformation, passion, or destruction",
  door: "Opportunity, transition, or access to new paths",
  
  // Actions
  falling: "Insecurity, anxiety, or loss of control",
  flying: "Freedom, transcending limitations, or escape",
  running: "Avoidance, ambition, or feeling pursued",
  searching: "Seeking answers, identity questions, or feeling lost",
  drowning: "Overwhelmed by emotions or circumstances",
  
  // Places
  beach: "Boundary between consciousness and unconsciousness",
  forest: "Unknown aspects of self, mystery, or getting lost",
  mountain: "Challenges, achievement, or perspective",
  school: "Learning, social anxiety, or past issues",
  
  // Emotions
  fear: "Confronting challenges or avoiding situations",
  joy: "Fulfillment, contentment, or positive change",
  sadness: "Processing loss, release, or healing",
};

// Keywords related to dream types
const dreamTypeKeywords = {
  lucid: ["control", "aware", "conscious", "realize", "knowing"],
  nightmare: ["scary", "terrifying", "fear", "horror", "threat", "danger", "afraid", "monster"],
  recurring: ["again", "always", "repeat", "same", "keeps happening", "once more"],
};

export const interpretDream = (dreamText: string, dreamType: string): string => {
  if (!dreamText || dreamText.trim() === '') {
    return "Please provide a dream description for interpretation.";
  }
  
  // Convert to lowercase for matching
  const text = dreamText.toLowerCase();
  
  // Split into words for analysis
  const words = text.split(/\s+/);
  
  // Find matching symbols
  const foundSymbols: Record<string, string> = {};
  Object.keys(dreamSymbols).forEach(symbol => {
    if (text.includes(symbol)) {
      foundSymbols[symbol] = dreamSymbols[symbol as keyof typeof dreamSymbols];
    }
  });
  
  // Create interpretation based on dream type
  let typeAnalysis = "";
  switch (dreamType) {
    case "lucid":
      typeAnalysis = "Since this was a lucid dream, it suggests you're developing greater awareness of your unconscious mind. The control you experienced may reflect your desire to take charge in your waking life.";
      break;
    case "nightmare":
      typeAnalysis = "This nightmare may be highlighting fears or stresses you need to address. Consider what aspects of your waking life might be causing anxiety.";
      break;
    case "recurring":
      typeAnalysis = "Recurring dreams often point to unresolved issues. Your mind may be trying to process something important that you haven't fully acknowledged.";
      break;
    default:
      typeAnalysis = "This dream reflects your current psychological state and may contain messages from your unconscious mind.";
  }
  
  // Generate symbol interpretation
  let symbolInterpretation = "";
  if (Object.keys(foundSymbols).length > 0) {
    symbolInterpretation = "Key symbols in your dream:\n\n" + 
      Object.entries(foundSymbols)
        .map(([symbol, meaning]) => `• ${symbol.charAt(0).toUpperCase() + symbol.slice(1)}: ${meaning}`)
        .join("\n");
  } else {
    symbolInterpretation = "No common dream symbols were detected. Consider the emotional tone and overall narrative of your dream for meaning.";
  }
  
  // Generate overall interpretation
  const overallMood = dreamType === "nightmare" ? "challenging" : "revealing";
  const conclusion = `Overall, this ${overallMood} dream invites you to reflect on your current life circumstances and inner emotional state. Dreams often connect to our daily experiences and unresolved feelings.`;
  
  return `${typeAnalysis}\n\n${symbolInterpretation}\n\n${conclusion}`;
};

// This function would connect to an external AI service in a real implementation
export const getAIInterpretation = async (dream: { description: string; type: string; }): Promise<string> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return interpretDream(dream.description, dream.type);
};
