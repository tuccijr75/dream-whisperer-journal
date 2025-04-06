
// Enhanced dream interpretation engine
// This simulates a more sophisticated AI interpretation service

// Expanded dream symbols with more detailed interpretations
const dreamSymbols = {
  // Animals
  dog: "Loyalty, friendship, protection, or possibly a representation of someone loyal in your life",
  cat: "Independence, mystery, feminine aspects, or intuition that needs attention",
  bird: "Freedom, perspective, spiritual messages, or desire to escape constraints",
  snake: "Transformation, healing, hidden fears, or unconscious threats requiring attention",
  spider: "Creativity, feminine energy, feeling trapped, or complex situations being woven",
  wolf: "Instinct, freedom, social connection, or aspects of yourself you may fear",
  butterfly: "Transformation, change, rebirth, or a situation evolving in your life",
  
  // Objects
  house: "Your mind, self, personal life, or different aspects of your personality",
  car: "Direction in life, personal journey, control, or your ability to progress toward goals",
  water: "Emotions, unconscious mind, purification, or emotional depth requiring exploration",
  fire: "Transformation, passion, destruction, or intense emotions that need addressing",
  door: "Opportunity, transition, access to new paths, or choices that lie before you",
  mirror: "Self-reflection, identity, truth, or how you perceive yourself versus reality",
  clock: "Passage of time, pressure, mortality, or anxiety about deadlines or aging",
  
  // Actions
  falling: "Insecurity, anxiety, loss of control, or fear of failure in a situation",
  flying: "Freedom, transcending limitations, escape, or a new perspective on life",
  running: "Avoidance, ambition, feeling pursued, or trying to escape from problems",
  searching: "Seeking answers, identity questions, feeling lost, or pursuing something important",
  drowning: "Overwhelmed by emotions or circumstances, loss of control, or suppressed feelings",
  hiding: "Avoidance, secrets, shame, or aspects of yourself you're not ready to confront",
  climbing: "Ambition, overcoming obstacles, progress, or striving toward goals",
  
  // Places
  beach: "Boundary between consciousness and unconsciousness, transition, or relaxation needed",
  forest: "Unknown aspects of self, mystery, getting lost, or exploration of the subconscious",
  mountain: "Challenges, achievement, perspective, or obstacles you're working to overcome",
  school: "Learning, social anxiety, past issues, or lessons you need to master",
  hospital: "Healing, worry about health, vulnerability, or need for recovery",
  bridge: "Transition, connection between different aspects of life, or moving past difficulties",
  cave: "Unconscious mind, retreat, introspection, or hidden aspects of yourself",
  
  // People
  child: "Innocence, vulnerability, new beginnings, or your inner child seeking attention",
  stranger: "Unknown aspects of self, new opportunities, or unfamiliar situations",
  teacher: "Guidance, authority, knowledge, or seeking answers from your higher self",
  mother: "Nurturing, protection, origin, or need for maternal care or characteristics",
  father: "Authority, protection, discipline, or relationship with masculine energy",
  
  // Emotions
  fear: "Confronting challenges, avoiding situations, or issues requiring courage",
  joy: "Fulfillment, contentment, positive change, or alignment with your true path",
  sadness: "Processing loss, release, healing, or emotional cleansing in progress",
  anger: "Boundaries being crossed, repressed emotions, or need for self-assertion",
  love: "Connection, self-acceptance, healing relationships, or emotional fulfillment",
};

// Expanded keywords related to dream types
const dreamTypeKeywords = {
  lucid: ["control", "aware", "conscious", "realize", "knowing", "directed", "choice", "decide", "change", "manipulate"],
  nightmare: ["scary", "terrifying", "fear", "horror", "threat", "danger", "afraid", "monster", "dark", "chase", "trapped", "panic", "scream", "evil"],
  recurring: ["again", "always", "repeat", "same", "keeps happening", "once more", "familiar", "routine", "cycle", "pattern", "another time"],
};

// Psychological themes for deeper interpretation
const psychologicalThemes = {
  transformation: ["change", "different", "new", "emerge", "evolve", "grow", "caterpillar", "butterfly", "snake", "shed"],
  conflict: ["fight", "argue", "battle", "struggle", "against", "conflict", "tension", "oppose", "disagree", "war"],
  loss: ["gone", "missing", "lost", "disappear", "absence", "empty", "without", "nowhere", "forget", "left"],
  desire: ["want", "wish", "hope", "need", "passionate", "yearn", "crave", "attraction", "longing", "hunger"],
  connection: ["together", "bond", "relationship", "friend", "family", "love", "attachment", "close", "intimacy", "unite"],
  identity: ["who am I", "myself", "reflection", "mirror", "true self", "role", "identify", "persona", "character", "real me"],
  power: ["control", "strength", "force", "ability", "command", "dominance", "influence", "authority", "powerful", "strong"],
  security: ["safe", "protect", "guard", "shelter", "haven", "secure", "fortress", "defend", "shield", "refuge"],
};

// Generate a more detailed interpretation based on content analysis
const analyzeContent = (text: string) => {
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);
  
  // Identify major themes
  const themes = Object.entries(psychologicalThemes).filter(([theme, keywords]) => 
    keywords.some(keyword => lowerText.includes(keyword))
  ).map(([theme]) => theme);
  
  // Find emotional tone
  const emotions = ["fear", "joy", "sadness", "anger", "love", "confusion", "peace"]
    .filter(emotion => lowerText.includes(emotion));
  
  // Identify key symbols
  const foundSymbols: Record<string, string> = {};
  Object.keys(dreamSymbols).forEach(symbol => {
    if (lowerText.includes(symbol)) {
      foundSymbols[symbol] = dreamSymbols[symbol as keyof typeof dreamSymbols];
    }
  });
  
  return { themes, emotions, foundSymbols };
};

export const interpretDream = (dreamText: string, dreamType: string, dreamMood: string): string => {
  if (!dreamText || dreamText.trim() === '') {
    return "Please provide a dream description for interpretation.";
  }
  
  // Analyze content for themes, emotions, and symbols
  const { themes, emotions, foundSymbols } = analyzeContent(dreamText);
  
  // Generate introduction based on dream type
  let interpretation = "";
  switch (dreamType) {
    case "lucid":
      interpretation = "This lucid dream reveals your growing awareness of your unconscious mind. The control you experienced reflects your desire to take charge in your waking life. Lucid dreams often indicate a period of personal growth and deeper self-understanding.";
      break;
    case "nightmare":
      interpretation = "This nightmare is highlighting important fears or stresses that need your attention. Rather than something to avoid, consider this dream a powerful message from your subconscious about aspects of your life that require addressing. Nightmares often point to repressed emotions or unresolved conflicts.";
      break;
    case "recurring":
      interpretation = "This recurring dream suggests an unresolved issue or emotion that your mind is trying to process. The repetitive nature indicates something important that needs your conscious attention. Consider what lessons or messages you might be missing that cause this dream to repeat.";
      break;
    default:
      interpretation = "This dream offers a window into your current psychological state and contains messages from your unconscious mind. The symbols and feelings present can help you better understand your waking concerns and emotions.";
  }
  
  // Add mood-based analysis
  interpretation += "\n\n";
  switch (dreamMood) {
    case "happy":
      interpretation += "The joyful feeling in this dream suggests a period of fulfillment or anticipated positive changes in your life. It may reflect inner harmony or success in resolving past conflicts.";
      break;
    case "sad":
      interpretation += "The sadness present in this dream may indicate unprocessed grief or disappointment that needs acknowledgment. Sometimes sad dreams help us process emotions we're not fully expressing while awake.";
      break;
    case "scared":
      interpretation += "The fear experienced in this dream points to anxieties or uncertainties you may be facing. Consider what situations in your life might be triggering similar feelings of vulnerability or concern.";
      break;
    case "confused":
      interpretation += "The confusion in this dream reflects uncertainty or complexity in your waking life. Your mind may be working through complicated decisions or unclear situations that require more information or introspection.";
      break;
    case "peaceful":
      interpretation += "The peaceful atmosphere of this dream suggests inner harmony or a need for tranquility. It may represent a safe mental space you've created amid life's challenges or indicate recent resolution of conflicts.";
      break;
    case "excited":
      interpretation += "The excitement in this dream reveals anticipation or enthusiasm about potential changes or opportunities. Your subconscious may be celebrating possibilities that haven't fully manifested in your conscious awareness yet.";
      break;
  }
  
  // Add theme analysis if themes were found
  if (themes.length > 0) {
    interpretation += "\n\nYour dream contains powerful themes of " + themes.join(", ") + ", which suggests that these psychological currents are active in your life right now. ";
    
    // Add specific theme interpretations
    themes.forEach(theme => {
      switch (theme) {
        case "transformation":
          interpretation += "The transformation elements point to important changes occurring in your identity or life circumstances. ";
          break;
        case "conflict":
          interpretation += "The conflict aspects suggest inner or outer tensions that require resolution or acknowledgment. ";
          break;
        case "loss":
          interpretation += "The themes of loss may connect to processing endings or changes in your relationships or self-concept. ";
          break;
        case "desire":
          interpretation += "The elements of desire indicate unmet needs or aspirations that are seeking expression. ";
          break;
        case "connection":
          interpretation += "The connection patterns reveal important relationships or attachment dynamics currently active in your life. ";
          break;
        case "identity":
          interpretation += "The identity aspects suggest you're in a period of self-discovery or redefining who you are. ";
          break;
        case "power":
          interpretation += "The power elements relate to how you express your will and navigate control in various life situations. ";
          break;
        case "security":
          interpretation += "The security themes reflect concerns about stability or protection in some area of your life. ";
          break;
      }
    });
  }
  
  // Generate symbol interpretation
  if (Object.keys(foundSymbols).length > 0) {
    interpretation += "\n\nKey symbols in your dream:\n\n";
    interpretation += Object.entries(foundSymbols)
      .map(([symbol, meaning]) => `• ${symbol.charAt(0).toUpperCase() + symbol.slice(1)}: ${meaning}`)
      .join("\n");
  } else {
    interpretation += "\n\nWhile no common archetypal symbols were identified in your description, the emotional tone and narrative of your dream remain significant. Consider how the specific details resonate with your personal experiences and current life circumstances.";
  }
  
  // Generate personalized conclusion
  interpretation += "\n\nReflection questions:\n\n";
  interpretation += "• How do the emotions in this dream compare to your current waking feelings?\n";
  interpretation += "• What recent experiences might have influenced the content of this dream?\n";
  interpretation += "• If this dream were trying to deliver a message to you, what would it be saying?\n";
  interpretation += "• How might insights from this dream be applied to your current life challenges?";
  
  return interpretation;
};

// Enhanced AI interpretation function
export const getAIInterpretation = async (dream: { description: string; type: string; mood: string; }): Promise<string> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate the interpretation using our enhanced algorithm
  return interpretDream(dream.description, dream.type, dream.mood);
};
