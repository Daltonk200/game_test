/**
 * Audio Manager
 * Handles all sound effects and background music
 */

class AudioManager {
    constructor() {
        this.audioElements = {};
        this.isInitialized = false;
        this.userInteracted = false;
        this.backgroundMusicMuted = false;
    }

    /**
     * Initialize audio elements
     */
    initialize() {
        // Get audio elements from DOM
        this.audioElements.paintSound = document.getElementById('paintSound');
        this.audioElements.combSound = document.getElementById('combSound');
        this.audioElements.shaveSound = document.getElementById('shaveSound');
        this.audioElements.backgroundMusic = document.getElementById('backgroundMusic');
        
        // Set audio volumes
        Object.values(this.audioElements).forEach(audio => {
            if (audio) {
                audio.volume = GameConfig.audio.volume;
            }
        });
        
        // Set background music volume separately if needed
        if (this.audioElements.backgroundMusic) {
            this.audioElements.backgroundMusic.volume = GameConfig.audio.backgroundMusicVolume;
        }
        
        // Set up user interaction listener for background music
        this.setupUserInteractionListener();
        
        this.isInitialized = true;
        console.log('Audio Manager initialized');
    }

    /**
     * Set up listener for first user interaction to enable background music
     */
    setupUserInteractionListener() {
        const startMusic = () => {
            if (!this.userInteracted) {
                this.userInteracted = true;
                this.playBackgroundMusic();
                // Remove this listener after first click
                document.removeEventListener('click', startMusic);
            }
        };
        
        document.addEventListener('click', startMusic, { once: true });
    }

    /**
     * Play background music
     */
    playBackgroundMusic() {
        if (this.audioElements.backgroundMusic && this.userInteracted && !this.backgroundMusicMuted) {
            this.audioElements.backgroundMusic.play().catch(e => {
                console.log('Background music play failed:', e);
            });
        }
    }

    /**
     * Stop background music
     */
    stopBackgroundMusic() {
        if (this.audioElements.backgroundMusic) {
            this.audioElements.backgroundMusic.pause();
        }
    }

    /**
     * Mute background music only
     */
    muteBackgroundMusic() {
        this.backgroundMusicMuted = true;
        this.stopBackgroundMusic();
        console.log('Background music muted');
    }

    /**
     * Unmute background music only
     */
    unmuteBackgroundMusic() {
        this.backgroundMusicMuted = false;
        if (this.userInteracted) {
            this.playBackgroundMusic();
        }
        console.log('Background music unmuted');
    }

    /**
     * Toggle background music mute state
     * @returns {boolean} New mute state (true = muted, false = unmuted)
     */
    toggleBackgroundMusic() {
        if (this.backgroundMusicMuted) {
            this.unmuteBackgroundMusic();
        } else {
            this.muteBackgroundMusic();
        }
        return this.backgroundMusicMuted;
    }

    /**
     * Check if background music is muted
     * @returns {boolean} True if background music is muted
     */
    isBackgroundMusicMuted() {
        return this.backgroundMusicMuted;
    }

    /**
     * Play a tool sound effect
     * @param {string} toolName - Name of the tool ('paint', 'comb', 'shave')
     * @param {boolean} loop - Whether to loop the sound
     */
    playToolSound(toolName, loop = false) {
        if (!this.isInitialized) {
            console.warn('Audio Manager not initialized');
            return;
        }
        
        let soundElement = null;
        
        switch(toolName) {
            case 'paint':
            case 'addHair': // Use paint sound for add hair tool
                soundElement = this.audioElements.paintSound;
                break;
            case 'comb':
                soundElement = this.audioElements.combSound;
                break;
            case 'shave':
                soundElement = this.audioElements.shaveSound;
                break;
            default:
                console.warn(`Unknown tool sound: ${toolName}`);
                return;
        }
        
        if (soundElement) {
            try {
                soundElement.currentTime = 0; // Reset to beginning
                soundElement.loop = loop;
                soundElement.play().catch(e => {
                    console.log(`${toolName} sound play failed:`, e);
                });
            } catch (error) {
                console.log(`Error playing ${toolName} sound:`, error);
            }
        }
    }

    /**
     * Stop a specific tool sound
     * @param {string} toolName - Name of the tool
     */
    stopToolSound(toolName) {
        if (!this.isInitialized) return;
        
        let soundElement = null;
        
        switch(toolName) {
            case 'paint':
            case 'addHair':
                soundElement = this.audioElements.paintSound;
                break;
            case 'comb':
                soundElement = this.audioElements.combSound;
                break;
            case 'shave':
                soundElement = this.audioElements.shaveSound;
                break;
        }
        
        if (soundElement) {
            soundElement.pause();
            soundElement.loop = false;
        }
    }

    /**
     * Stop all tool sounds
     */
    stopAllToolSounds() {
        if (!this.isInitialized) return;
        
        ['paint', 'comb', 'shave'].forEach(toolName => {
            this.stopToolSound(toolName);
        });
    }

    /**
     * Set volume for all audio elements
     * @param {number} volume - Volume level (0.0 to 1.0)
     */
    setGlobalVolume(volume) {
        volume = Utils.clamp(volume, 0, 1);
        
        Object.values(this.audioElements).forEach(audio => {
            if (audio && audio !== this.audioElements.backgroundMusic) {
                audio.volume = volume;
            }
        });
        
        // Update config
        GameConfig.audio.volume = volume;
    }

    /**
     * Set background music volume
     * @param {number} volume - Volume level (0.0 to 1.0)
     */
    setBackgroundMusicVolume(volume) {
        volume = Utils.clamp(volume, 0, 1);
        
        if (this.audioElements.backgroundMusic) {
            this.audioElements.backgroundMusic.volume = volume;
        }
        
        // Update config
        GameConfig.audio.backgroundMusicVolume = volume;
    }

    /**
     * Mute all audio
     */
    muteAll() {
        Object.values(this.audioElements).forEach(audio => {
            if (audio) {
                audio.muted = true;
            }
        });
    }

    /**
     * Unmute all audio
     */
    unmuteAll() {
        Object.values(this.audioElements).forEach(audio => {
            if (audio) {
                audio.muted = false;
            }
        });
    }

    /**
     * Check if audio is available and working
     * @returns {boolean} True if audio is available
     */
    isAudioAvailable() {
        return this.isInitialized && Object.values(this.audioElements).some(audio => audio !== null);
    }

    /**
     * Get current audio status
     * @returns {Object} Status object with audio information
     */
    getAudioStatus() {
        return {
            initialized: this.isInitialized,
            userInteracted: this.userInteracted,
            backgroundMusicPlaying: this.audioElements.backgroundMusic && !this.audioElements.backgroundMusic.paused,
            backgroundMusicMuted: this.backgroundMusicMuted,
            availableSounds: Object.keys(this.audioElements).filter(key => this.audioElements[key] !== null)
        };
    }

    /**
     * Preload all audio files (call this during game initialization)
     */
    preloadAudio() {
        Object.values(this.audioElements).forEach(audio => {
            if (audio) {
                audio.preload = 'auto';
                // Trigger loading
                audio.load();
            }
        });
    }

    /**
     * Clean up audio resources
     */
    cleanup() {
        this.stopAllToolSounds();
        this.stopBackgroundMusic();
        
        Object.values(this.audioElements).forEach(audio => {
            if (audio) {
                audio.removeEventListener('ended', null);
                audio.removeEventListener('error', null);
            }
        });
        
        this.audioElements = {};
        this.isInitialized = false;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
}
