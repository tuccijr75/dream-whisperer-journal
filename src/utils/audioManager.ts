/**
 * Audio Manager utility for consistent audio handling across the app
 */

interface AudioOptions {
  volume?: number;
  loop?: boolean;
  autoplay?: boolean;
}

class AudioManager {
  private static audioElements: Map<string, HTMLAudioElement> = new Map();

  /**
   * Creates or returns an existing audio element
   */
  public static getAudio(id: string, src: string, options: AudioOptions = {}): HTMLAudioElement {
    // If the audio element already exists, return it
    if (this.audioElements.has(id)) {
      return this.audioElements.get(id) as HTMLAudioElement;
    }

    // Create a new audio element
    const audio = document.createElement('audio');
    audio.id = id;
    audio.preload = 'auto';
    audio.loop = options.loop ?? false;
    
    // Use absolute path for mobile compatibility
    if (src.startsWith('/')) {
      audio.src = window.location.origin + src;
    } else {
      audio.src = src;
    }
    
    // Set volume (0-1)
    if (options.volume !== undefined) {
      audio.volume = Math.max(0, Math.min(1, options.volume));
    }
    
    // Hide element but keep in DOM for better iOS compatibility
    audio.style.display = 'none';
    document.body.appendChild(audio);
    
    // Store for later use
    this.audioElements.set(id, audio);
    
    // Auto-play if specified (will fail without user interaction on most browsers)
    if (options.autoplay) {
      this.playAudio(id).catch(err => console.error(`Failed to autoplay ${id}:`, err));
    }
    
    return audio;
  }

  /**
   * Play audio with error handling
   */
  public static async playAudio(id: string): Promise<void> {
    const audio = this.audioElements.get(id);
    if (!audio) return;
    
    try {
      await audio.play();
    } catch (error) {
      console.error(`Error playing audio ${id}:`, error);
      throw error;
    }
  }

  /**
   * Pause audio
   */
  public static pauseAudio(id: string): void {
    const audio = this.audioElements.get(id);
    if (audio) {
      audio.pause();
    }
  }

  /**
   * Set audio volume
   */
  public static setVolume(id: string, volume: number): void {
    const audio = this.audioElements.get(id);
    if (audio) {
      audio.volume = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Clean up audio element
   */
  public static disposeAudio(id: string): void {
    const audio = this.audioElements.get(id);
    if (audio) {
      audio.pause();
      audio.remove();
      this.audioElements.delete(id);
    }
  }

  /**
   * Clean up all audio elements
   */
  public static disposeAll(): void {
    this.audioElements.forEach(audio => {
      audio.pause();
      audio.remove();
    });
    this.audioElements.clear();
  }
}

export default AudioManager;
