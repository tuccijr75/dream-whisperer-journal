
/**
 * Utility for generating binaural beats and audio frequencies 
 * that correspond to different brainwave states
 */

import AudioManager from "./audioManager";

export type BrainwaveFrequency = "delta" | "theta" | "alpha" | "beta" | "gamma";

// Frequency ranges in Hz for each brainwave type
const frequencyRanges = {
  delta: { min: 0.5, max: 4 }, // Deep sleep
  theta: { min: 4, max: 8 },   // Meditation, drowsiness
  alpha: { min: 8, max: 13 },  // Relaxed awareness
  beta: { min: 13, max: 30 },  // Active thinking
  gamma: { min: 30, max: 100 } // Higher mental activity
};

class BinauralBeatGenerator {
  private audioContext: AudioContext | null = null;
  private leftOscillator: OscillatorNode | null = null;
  private rightOscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;
  private currentFrequency: BrainwaveFrequency = "theta";

  constructor() {
    this.initialize();
  }

  private initialize() {
    try {
      // Try to initialize only when needed (requires user interaction)
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    } catch (error) {
      console.error("Web Audio API not supported in this browser", error);
    }
  }

  public start(frequencyType: BrainwaveFrequency, volume: number = 0.1) {
    // If already playing, stop before restarting
    if (this.isPlaying) {
      this.stop();
    }

    try {
      // Initialize or resume audio context 
      if (!this.audioContext) {
        this.initialize();
      } else if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      if (!this.audioContext) {
        console.error("Audio context could not be initialized");
        return false;
      }
      
      // Create audio nodes
      this.leftOscillator = this.audioContext.createOscillator();
      this.rightOscillator = this.audioContext.createOscillator();
      this.gainNode = this.audioContext.createGain();

      // Get the frequency range
      const range = frequencyRanges[frequencyType];
      
      // Calculate base frequency and beat frequency
      const baseFreq = (range.min + range.max) / 2;
      // Create a subtle beat frequency difference
      const beatFreq = Math.min(5, (range.max - range.min) / 2);
      
      // Set frequencies for each ear
      this.leftOscillator.frequency.value = baseFreq;
      this.rightOscillator.frequency.value = baseFreq + beatFreq;
      
      // Set volume
      this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
      
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
      
      this.isPlaying = false;
    } catch (error) {
      console.error("Error stopping binaural beat generator:", error);
    }
  }

  public setVolume(volume: number) {
    if (this.gainNode) {
      // Ensure volume is between 0 and 1
      this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  public isActive() {
    return this.isPlaying;
  }

  public getCurrentFrequency() {
    return this.currentFrequency;
  }
}

// Create a singleton instance
const binauralBeatGenerator = new BinauralBeatGenerator();

export default binauralBeatGenerator;
