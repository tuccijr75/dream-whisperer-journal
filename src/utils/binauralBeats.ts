
/**
 * Utility for generating binaural beats and audio frequencies 
 * that correspond to different brainwave states
 */

export type BrainwaveFrequency = "delta" | "theta" | "alpha" | "beta" | "gamma";

// Frequency ranges in Hz for each brainwave type
const frequencyRanges = {
  delta: { min: 0.5, max: 4, recommendedVolume: 0.1 }, // Deep sleep
  theta: { min: 4, max: 8, recommendedVolume: 0.15 },   // Meditation, drowsiness
  alpha: { min: 8, max: 13, recommendedVolume: 0.2 },  // Relaxed awareness
  beta: { min: 13, max: 30, recommendedVolume: 0.15 },  // Active thinking
  gamma: { min: 30, max: 100, recommendedVolume: 0.1 } // Higher mental activity
};

class BinauralBeatGenerator {
  private audioContext: AudioContext | null = null;
  private leftOscillator: OscillatorNode | null = null;
  private rightOscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;
  private currentFrequency: BrainwaveFrequency = "theta";
  private initialized: boolean = false;

  constructor() {
    // Don't auto-initialize to avoid autoplay restrictions
    // Will initialize on first user interaction
  }

  private async initialize() {
    if (this.initialized) return true;
    
    try {
      // Create AudioContext only when needed (requires user interaction)
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Resume context (important for Safari)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      this.initialized = true;
      return true;
    } catch (error) {
      console.error("Failed to initialize Web Audio API:", error);
      return false;
    }
  }

  public async start(frequencyType: BrainwaveFrequency, volume: number = 0.1): Promise<boolean> {
    // If already playing, stop first
    if (this.isPlaying) {
      this.stop();
    }

    try {
      // Initialize or ensure audio context is running
      const initialized = await this.initialize();
      if (!initialized || !this.audioContext) {
        console.error("Could not initialize audio context");
        return false;
      }
      
      // Create audio nodes
      this.leftOscillator = this.audioContext.createOscillator();
      this.rightOscillator = this.audioContext.createOscillator();
      this.gainNode = this.audioContext.createGain();

      // Get the frequency range and set a safe volume
      const range = frequencyRanges[frequencyType];
      const safeVolume = Math.min(volume, range.recommendedVolume * 2);
      
      // Calculate base frequency and beat frequency
      const baseFreq = (range.min + range.max) / 2;
      // Create a subtle beat frequency difference
      const beatFreq = Math.min(5, (range.max - range.min) / 2);
      
      // Use sine waves for smoother sound
      this.leftOscillator.type = 'sine';
      this.rightOscillator.type = 'sine';
      
      // Set frequencies for each ear
      this.leftOscillator.frequency.value = baseFreq;
      this.rightOscillator.frequency.value = baseFreq + beatFreq;
      
      // Ramp volumes to avoid clicks and pops
      this.gainNode.gain.value = 0;
      this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      this.gainNode.gain.linearRampToValueAtTime(
        safeVolume, 
        this.audioContext.currentTime + 1
      );
      
      // Create stereo channel splitter
      const merger = this.audioContext.createChannelMerger(2);
      
      // Connect nodes
      this.leftOscillator.connect(merger, 0, 0);
      this.rightOscillator.connect(merger, 0, 1);
      merger.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);
      
      // Start oscillators
      this.leftOscillator.start();
      this.rightOscillator.start();
      
      this.isPlaying = true;
      this.currentFrequency = frequencyType;
      
      return true;
    } catch (error) {
      console.error("Error starting binaural beat generator:", error);
      this.stop();
      return false;
    }
  }

  public stop() {
    try {
      // Graceful cleanup
      if (this.gainNode && this.audioContext) {
        // Fade out to avoid clicks
        const now = this.audioContext.currentTime;
        this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
        this.gainNode.gain.linearRampToValueAtTime(0, now + 0.1);
        
        // Schedule actual stopping after fade-out
        setTimeout(() => {
          this.cleanupAudioNodes();
        }, 120);
      } else {
        this.cleanupAudioNodes();
      }
      
      this.isPlaying = false;
    } catch (error) {
      console.error("Error stopping binaural beat generator:", error);
      // Force cleanup on error
      this.cleanupAudioNodes();
    }
  }
  
  private cleanupAudioNodes() {
    try {
      if (this.leftOscillator) {
        this.leftOscillator.stop();
        this.leftOscillator.disconnect();
        this.leftOscillator = null;
      }
      
      if (this.rightOscillator) {
        this.rightOscillator.stop();
        this.rightOscillator.disconnect();
        this.rightOscillator = null;
      }
      
      if (this.gainNode) {
        this.gainNode.disconnect();
        this.gainNode = null;
      }
    } catch (error) {
      console.error("Error cleaning up audio nodes:", error);
    }
  }

  public setVolume(volume: number) {
    if (this.gainNode && this.audioContext) {
      // Safe volume between 0 and 1
      const safeVolume = Math.max(0, Math.min(0.3, volume));
      
      // Smooth transition
      const now = this.audioContext.currentTime;
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
      this.gainNode.gain.linearRampToValueAtTime(safeVolume, now + 0.1);
    }
  }
  
  public async togglePlay(frequencyType: BrainwaveFrequency, volume: number = 0.1): Promise<boolean> {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      return await this.start(frequencyType, volume);
    }
  }

  public isActive() {
    return this.isPlaying;
  }

  public getCurrentFrequency() {
    return this.currentFrequency;
  }
  
  public dispose() {
    this.stop();
    if (this.audioContext) {
      if (this.audioContext.state !== 'closed') {
        this.audioContext.close();
      }
      this.audioContext = null;
    }
    this.initialized = false;
  }
}

// Create a singleton instance
const binauralBeatGenerator = new BinauralBeatGenerator();

export default binauralBeatGenerator;
