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
      const existingAudio = this.audioElements.get(id) as HTMLAudioElement;
      
      // If we're requesting with a new source, update it
      if (existingAudio.src !== src) {
        console.log(`Updating audio ${id} source to ${src}`);
        existingAudio.src = src;
        
        // Re-apply volume setting
        if (options.volume !== undefined) {
          existingAudio.volume = Math.max(0, Math.min(1, options.volume));
        }
      }
      
      return existingAudio;
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
        } else {
          console.log(`Audio file ${src} exists but had an error loading`);
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
    
    // Add specific event listeners for better debugging
    audio.addEventListener('canplaythrough', () => {
      console.log(`Audio ${id} is ready to play through without stopping`);
    });
    
    audio.addEventListener('loadeddata', () => {
      console.log(`Audio ${id} has loaded its data`);
    });
    
    audio.addEventListener('stalled', () => {
      console.warn(`Audio ${id} playback has stalled`);
    });
    
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
   * This helps diagnose if the issue is file availability
   */
  private static async checkAudioFileExists(src: string): Promise<boolean> {
    try {
      const fullUrl = src.startsWith('/') ? window.location.origin + src : src;
      const response = await fetch(fullUrl, { method: 'HEAD' });
      console.log(`Audio file existence check: ${fullUrl} - Status: ${response.status}`);
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
        // Allow a moment for the browser to process the new source
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // This is needed for iOS
      if (audio.paused) {
        // Create a user gesture context
        document.addEventListener('click', function resumeAudio() {
          document.removeEventListener('click', resumeAudio);
          audio.play().catch(err => console.error(`Failed to play audio ${id} after user click:`, err));
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
