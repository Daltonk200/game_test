/**
 * Character Manager
 * Handles character selection and switching between different avatars
 */

class CharacterManager {
    constructor(hairSystem, physicsEngine) {
        this.hairSystem = hairSystem;
        this.physicsEngine = physicsEngine;
        this.currentCharacter = GameConfig.characters.default;
        this.avatarImage = null;
        this.characterSelector = null;
        this.characterLabel = null;
        this.characterButton = null;
    }

    /**
     * Initialize character manager
     */
    initialize() {
        this.setupElements();
        this.setupEventListeners();
        this.setCharacter(this.currentCharacter, false); // Set initial character without regenerating hair
        
        // Ensure initial character class is applied
        if (this.avatarImage) {
            this.avatarImage.classList.add(this.currentCharacter);
        }
        
        console.log('Character Manager initialized');
    }

    /**
     * Set up DOM element references
     */
    setupElements() {
        this.avatarImage = document.getElementById('avatarImage');
        this.characterSelector = document.querySelector('.character-selector');
        this.characterLabel = document.getElementById('characterLabel');
        this.characterButton = document.getElementById('characterToggleBtn');

        if (!this.avatarImage) {
            console.error('Avatar image element not found');
        }
        if (!this.characterSelector) {
            console.error('Character selector element not found');
        }
        if (!this.characterLabel) {
            console.error('Character label element not found');
        }
        if (!this.characterButton) {
            console.error('Character button element not found');
        }
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        if (this.characterButton) {
            this.characterButton.addEventListener('click', () => this.toggleCharacter());
        }
    }

    /**
     * Switch to a specific character
     * @param {string} characterId - ID of the character to switch to ('male' or 'female')
     * @param {boolean} regenerateHair - Whether to regenerate hair for the new character
     */
    setCharacter(characterId, regenerateHair = true) {
        if (!GameConfig.characters[characterId]) {
            console.error(`Character not found: ${characterId}`);
            return false;
        }

        const character = GameConfig.characters[characterId];
        this.currentCharacter = characterId;

        // Update avatar image
        if (this.avatarImage) {
            this.avatarImage.src = character.image;
            this.avatarImage.alt = `${character.name} Avatar`;
            
            // Update avatar CSS class for character-specific positioning
            this.avatarImage.classList.remove('male', 'female');
            this.avatarImage.classList.add(characterId);
        }

        // Update UI elements
        this.updateUI(character);

        // Update avatar configuration in GameConfig for hair generation
        GameConfig.avatar.centerX = character.hairCenter.x;
        GameConfig.avatar.centerY = character.hairCenter.y;
        GameConfig.avatar.hairRadius = character.hairRadius;

        // Clear existing hair and falling hair
        if (regenerateHair) {
            this.clearAllHair();
            
            // Wait a frame for the clear to complete, then regenerate with character-specific styling
            setTimeout(() => {
                this.hairSystem.generateHair(characterId);
            }, 16); // Wait one frame
        }

        console.log(`Switched to ${character.name} character`);
        return true;
    }

    /**
     * Toggle between male and female characters
     */
    toggleCharacter() {
        const nextCharacter = this.currentCharacter === 'male' ? 'female' : 'male';
        this.setCharacter(nextCharacter);
        
        // Add visual feedback
        this.showToggleFeedback();
    }

    /**
     * Update UI elements for the current character
     * @param {Object} character - Character configuration object
     */
    updateUI(character) {
        // Update character label
        if (this.characterLabel) {
            this.characterLabel.textContent = character.name;
        }

        // Update character selector styling
        if (this.characterSelector) {
            this.characterSelector.classList.remove('male', 'female');
            this.characterSelector.classList.add(this.currentCharacter);
        }

        // Update button title
        if (this.characterButton) {
            const nextCharacter = this.currentCharacter === 'male' ? 'Female' : 'Male';
            this.characterButton.title = `Switch to ${nextCharacter}`;
        }
    }

    /**
     * Clear all hair (both static and falling)
     */
    clearAllHair() {
        // Stop any falling hair animation
        this.physicsEngine.clearAllFallingHair();
        
        // Clear the canvas
        const canvas = this.hairSystem.canvas;
        const ctx = this.hairSystem.ctx;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Reset hair system
        this.hairSystem.hairStrands = [];
    }

    /**
     * Show visual feedback when toggling characters
     */
    showToggleFeedback() {
        if (this.characterButton) {
            this.characterButton.style.animation = 'pulse 0.3s ease-in-out';
            setTimeout(() => {
                this.characterButton.style.animation = '';
            }, 300);
        }
    }

    /**
     * Get current character information
     * @returns {Object} Current character data
     */
    getCurrentCharacter() {
        return {
            id: this.currentCharacter,
            name: GameConfig.characters[this.currentCharacter].name,
            image: GameConfig.characters[this.currentCharacter].image,
            hairCenter: GameConfig.characters[this.currentCharacter].hairCenter,
            hairRadius: GameConfig.characters[this.currentCharacter].hairRadius
        };
    }

    /**
     * Get all available characters
     * @returns {Array} Array of character objects
     */
    getAvailableCharacters() {
        return Object.keys(GameConfig.characters)
            .filter(key => key !== 'default')
            .map(key => ({
                id: key,
                name: GameConfig.characters[key].name,
                image: GameConfig.characters[key].image
            }));
    }

    /**
     * Preload character images
     */
    preloadCharacterImages() {
        Object.values(GameConfig.characters).forEach(character => {
            if (character.image) {
                const img = new Image();
                img.src = character.image;
                console.log(`Preloading character image: ${character.image}`);
            }
        });
    }

    /**
     * Reset to default character
     */
    resetToDefault() {
        this.setCharacter(GameConfig.characters.default);
    }

    /**
     * Clean up character manager
     */
    cleanup() {
        if (this.characterButton) {
            this.characterButton.removeEventListener('click', null);
        }
        
        this.avatarImage = null;
        this.characterSelector = null;
        this.characterLabel = null;
        this.characterButton = null;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CharacterManager;
}
