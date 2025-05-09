
// Sound utility functions for notification alerts

// Cache for loaded sounds
const soundCache: { [key: string]: HTMLAudioElement } = {};

/**
 * Loads an audio file from a URL and caches it
 * @param url URL of the audio file
 * @returns HTMLAudioElement for the loaded sound
 */
export const loadSound = (url: string): HTMLAudioElement => {
  if (soundCache[url]) {
    return soundCache[url];
  }
  
  const audio = new Audio(url);
  soundCache[url] = audio;
  return audio;
};

/**
 * Plays a notification sound
 * @param sound URL of the sound to play or HTMLAudioElement
 * @param volume Optional volume level (0.0 to 1.0)
 */
export const playNotificationSound = (
  sound: string | HTMLAudioElement, 
  volume = 0.5
): void => {
  try {
    const audio = typeof sound === 'string' ? loadSound(sound) : sound;
    audio.volume = volume;
    
    // Reset the audio to the beginning if it's already playing
    audio.currentTime = 0;
    
    // Play the sound
    audio.play().catch(error => {
      console.error('Error playing notification sound:', error);
    });
  } catch (error) {
    console.error('Failed to play notification sound:', error);
  }
};

// Default notification sounds
export const NOTIFICATION_SOUNDS = {
  NEW_ORDER: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
  ORDER_CANCELLED: 'https://assets.mixkit.co/active_storage/sfx/952/952-preview.mp3',
  ORDER_DELIVERED: 'https://assets.mixkit.co/active_storage/sfx/2873/2873-preview.mp3',
  ORDER_PROCESSING: 'https://assets.mixkit.co/active_storage/sfx/612/612-preview.mp3',
};
