
/**
 * Audio Manager utility for consistent audio handling across the app
 */

interface AudioOptions {
  volume?: number;
  loop?: boolean;
  autoplay?: boolean;
  fallbackMessage?: string;
}

class AudioManager {
  private static audioElements: Map<string, HTMLAudioElement> = new Map();
  private static errorListeners: Map<string, (() => void)[]> = new Map();

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
    
    // Add error handler to track loading issues
    audio.addEventListener('error', (e) => {
      console.error(`Error loading audio ${id} from ${src}:`, e);
      // Check if the audio file might be missing
      this.checkAudioFileExists(src).then(exists => {
        if (!exists) {
          console.error(`Audio file ${src} does not exist or is inaccessible`);
        }
      });
      // Notify all error listeners
      if (this.errorListeners.has(id)) {
        this.errorListeners.get(id)?.forEach(listener => listener());
      }
    });
    
    // Use absolute path for mobile compatibility
    if (src.startsWith('/')) {
      // Use window.location.origin to get the base URL including protocol and domain
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
   * Checks if an audio file exists by making a HEAD request
   */
  private static async checkAudioFileExists(src: string): Promise<boolean> {
    try {
      const fullUrl = src.startsWith('/') ? window.location.origin + src : src;
      const response = await fetch(fullUrl, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error('Error checking if audio file exists:', error);
      return false;
    }
  }

  /**
   * Add an error listener for an audio element
   */
  public static onError(id: string, callback: () => void): void {
    if (!this.errorListeners.has(id)) {
      this.errorListeners.set(id, []);
    }
    this.errorListeners.get(id)?.push(callback);

    // If the audio already exists and has an error, trigger immediately
    const audio = this.audioElements.get(id);
    if (audio && audio.error) {
      callback();
    }
  }

  /**
   * Play audio with error handling
   */
  public static async playAudio(id: string): Promise<void> {
    const audio = this.audioElements.get(id);
    if (!audio) return;
    
    try {
      // Reset src if previous error
      if (audio.error) {
        const originalSrc = audio.src;
        audio.src = originalSrc;
      }
      
      // This is needed for iOS
      if (audio.paused) {
        // Create a user gesture context
        document.addEventListener('click', function resumeAudio() {
          document.removeEventListener('click', resumeAudio);
          audio.play();
        }, { once: true });
      }
      
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
   * Check if audio has an error
   */
  public static hasError(id: string): boolean {
    const audio = this.audioElements.get(id);
    return audio ? audio.error !== null : false;
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
    // Clear any error listeners
    this.errorListeners.delete(id);
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
    this.errorListeners.clear();
  }
}

export default AudioManager;
