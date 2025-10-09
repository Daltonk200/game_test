/**
 * UI Controller
 * Handles user interface interactions, button events, and tool switching
 */

class UIController {
    constructor(toolManager, audioManager, characterManager = null) {
        this.toolManager = toolManager;
        this.audioManager = audioManager;
        this.characterManager = characterManager;
        this.colorPicker = null;
        this.buttons = {};
        
        this.initialize();
    }

    /**
     * Initialize UI elements and event listeners
     */
    initialize() {
        this.setupElements();
        this.setupEventListeners();
        this.initializeSoundButton();
        console.log('UI Controller initialized');
    }

    /**
     * Initialize the sound button state
     */
    initializeSoundButton() {
        // Set initial sound button state (not muted by default)
        this.updateSoundToggleButton(false);
    }

    /**
     * Set up references to UI elements
     */
    setupElements() {
        // Get color picker
        this.colorPicker = document.getElementById('hairColor');
        if (this.colorPicker) {
            this.toolManager.setColorPicker(this.colorPicker);
        }
        
        // Get tool buttons
        this.buttons = {
            shave: document.getElementById('shaveBtn'),
            comb: document.getElementById('combBtn'),
            paint: document.getElementById('paintBtn'),
            addHair: document.getElementById('addHairBtn'),
            screenshot: document.getElementById('screenshotBtn'),
            soundToggle: document.getElementById('soundToggleBtn')
        };
        
        // Get sound toggle icons
        this.soundIcons = {
            on: document.getElementById('soundOnIcon'),
            off: document.getElementById('soundOffIcon')
        };
        
        // Validate all buttons exist
        Object.entries(this.buttons).forEach(([name, button]) => {
            if (!button) {
                console.warn(`Button not found: ${name}Btn`);
            }
        });
    }

    /**
     * Set up event listeners for UI elements
     */
    setupEventListeners() {
        // Tool button event listeners
        if (this.buttons.shave) {
            this.buttons.shave.addEventListener('click', () => this.handleToolClick('shave'));
        }
        
        if (this.buttons.comb) {
            this.buttons.comb.addEventListener('click', () => this.handleToolClick('comb'));
        }
        
        if (this.buttons.paint) {
            this.buttons.paint.addEventListener('click', () => this.handleToolClick('paint'));
        }
        
        if (this.buttons.addHair) {
            this.buttons.addHair.addEventListener('click', () => this.handleToolClick('addHair'));
        }
        
        // Screenshot button
        if (this.buttons.screenshot) {
            this.buttons.screenshot.addEventListener('click', () => this.takeScreenshot());
        }
        
        // Sound toggle button
        if (this.buttons.soundToggle) {
            this.buttons.soundToggle.addEventListener('click', () => this.toggleBackgroundMusic());
        }
        
        // Color picker change event
        if (this.colorPicker) {
            this.colorPicker.addEventListener('change', (e) => this.handleColorChange(e));
        }
        
        // Keyboard shortcuts (optional enhancement)
        this.setupKeyboardShortcuts();
    }

    /**
     * Handle tool button clicks
     * @param {string} toolName - Name of the tool to switch to
     */
    handleToolClick(toolName) {
        this.toolManager.setTool(toolName);
        this.updateButtonStates(toolName);
        
        // Optional: Play UI sound feedback
        this.playUISound('click');
    }

    /**
     * Update button visual states to show active tool
     * @param {string} activeTool - Name of the currently active tool
     */
    updateButtonStates(activeTool) {
        // Remove active class from all tool buttons
        Object.entries(this.buttons).forEach(([name, button]) => {
            if (button && name !== 'screenshot') {
                button.classList.remove('active-tool');
            }
        });
        
        // Add active class to current tool button
        const activeButton = this.buttons[activeTool];
        if (activeButton) {
            activeButton.classList.add('active-tool');
        }
    }

    /**
     * Handle color picker changes
     * @param {Event} event - The color change event
     */
    handleColorChange(event) {
        const newColor = event.target.value;
        console.log('Color changed to:', newColor);
        
        // Optional: Show color feedback or validation
        this.showColorPreview(newColor);
    }

    /**
     * Show color preview (optional visual enhancement)
     * @param {string} color - The selected color
     */
    showColorPreview(color) {
        // Could add a visual preview or confirmation here
        // For now, just update the color picker's border or add a subtle effect
        if (this.colorPicker) {
            this.colorPicker.style.borderColor = color;
        }
    }

    /**
     * Take a screenshot of the current canvas state
     */
    takeScreenshot() {
        try {
            // Get canvas element
            const canvas = document.getElementById('hairCanvas');
            if (!canvas) {
                console.error('Canvas not found for screenshot');
                return;
            }

            // Create a temporary canvas with the same size as the main canvas
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempCtx = tempCanvas.getContext('2d');

            // Draw background image
            const bgImg = document.querySelector('.background-image');
            if (bgImg && bgImg.complete) {
                tempCtx.drawImage(bgImg, 0, 0, tempCanvas.width, tempCanvas.height);
            }

            // Draw table image
            const tableImg = document.querySelector('.table-image');
            if (tableImg && tableImg.complete) {
                const tableWidth = 320;
                const tableHeight = (tableImg.naturalHeight / tableImg.naturalWidth) * tableWidth;
                tempCtx.drawImage(tableImg, (tempCanvas.width - tableWidth) / 2, tempCanvas.height - tableHeight - 4, tableWidth, tableHeight);
            }

            // Draw avatar image
            const avatarImg = document.querySelector('.avatar-image');
            if (avatarImg && avatarImg.complete) {
                const avatarWidth = 680;
                const avatarHeight = (avatarImg.naturalHeight / avatarImg.naturalWidth) * avatarWidth;
                tempCtx.drawImage(avatarImg, (tempCanvas.width - avatarWidth) / 2, tempCanvas.height - avatarHeight - 120, avatarWidth, avatarHeight);
            }

            // Draw the hair canvas on top
            tempCtx.drawImage(canvas, 0, 0);

            // Export as PNG and trigger download
            const dataURL = tempCanvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `hair-salon-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
            link.href = dataURL;
            link.click();

            // Show success feedback
            this.showScreenshotFeedback(true);
            
        } catch (error) {
            console.error('Screenshot failed:', error);
            this.showScreenshotFeedback(false);
        }
    }

    /**
     * Show screenshot feedback to user
     * @param {boolean} success - Whether screenshot was successful
     */
    showScreenshotFeedback(success) {
        const button = this.buttons.screenshot;
        if (!button) return;
        
        const originalTitle = button.title;
        
        if (success) {
            button.title = 'Screenshot saved!';
            button.style.animation = 'pulse 0.3s ease-in-out';
        } else {
            button.title = 'Screenshot failed';
            button.style.animation = 'shake 0.3s ease-in-out';
        }
        
        // Reset after animation
        setTimeout(() => {
            button.title = originalTitle;
            button.style.animation = '';
        }, 1000);
    }

    /**
     * Toggle background music on/off
     */
    toggleBackgroundMusic() {
        const isMuted = this.audioManager.toggleBackgroundMusic();
        this.updateSoundToggleButton(isMuted);
        
        // Show feedback
        this.showSoundToggleFeedback(isMuted);
    }

    /**
     * Update the sound toggle button appearance
     * @param {boolean} isMuted - Whether background music is muted
     */
    updateSoundToggleButton(isMuted) {
        const button = this.buttons.soundToggle;
        const soundOnIcon = this.soundIcons.on;
        const soundOffIcon = this.soundIcons.off;
        
        if (!button || !soundOnIcon || !soundOffIcon) return;
        
        if (isMuted) {
            // Show muted state
            button.classList.add('muted');
            button.title = 'Unmute Background Music';
            soundOnIcon.style.display = 'none';
            soundOffIcon.style.display = 'block';
        } else {
            // Show unmuted state
            button.classList.remove('muted');
            button.title = 'Mute Background Music';
            soundOnIcon.style.display = 'block';
            soundOffIcon.style.display = 'none';
        }
    }

    /**
     * Show sound toggle feedback
     * @param {boolean} isMuted - Whether background music is now muted
     */
    showSoundToggleFeedback(isMuted) {
        const button = this.buttons.soundToggle;
        if (!button) return;
        
        // Add a subtle animation to show the action was registered
        button.style.animation = 'pulse 0.2s ease-in-out';
        
        // Reset animation
        setTimeout(() => {
            button.style.animation = '';
        }, 200);
        
        console.log(isMuted ? 'Background music muted' : 'Background music unmuted');
    }

    /**
     * Set up keyboard shortcuts for tools
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // Only handle shortcuts if not typing in an input
            if (event.target.tagName === 'INPUT') return;
            
            switch(event.key.toLowerCase()) {
                case 'p':
                    event.preventDefault();
                    this.handleToolClick('paint');
                    break;
                case 'a':
                    event.preventDefault();
                    this.handleToolClick('addHair');
                    break;
                case 'c':
                    event.preventDefault();
                    this.handleToolClick('comb');
                    break;
                case 's':
                    event.preventDefault();
                    this.handleToolClick('shave');
                    break;
                case ' ': // Spacebar for screenshot
                    event.preventDefault();
                    this.takeScreenshot();
                    break;
                case 'm': // M for mute/unmute background music
                    event.preventDefault();
                    this.toggleBackgroundMusic();
                    break;
                case 'x': // X for character switch
                    event.preventDefault();
                    if (this.characterManager) {
                        this.characterManager.toggleCharacter();
                    }
                    break;
            }
        });
    }

    /**
     * Play UI sound effect (optional)
     * @param {string} soundType - Type of UI sound to play
     */
    playUISound(soundType) {
        // Could add UI sounds here if desired
        // For now, this is a placeholder for future enhancement
        switch(soundType) {
            case 'click':
                // Could play a subtle click sound
                break;
            case 'error':
                // Could play an error sound
                break;
        }
    }

    /**
     * Update UI based on game state (optional)
     * @param {Object} gameState - Current game state information
     */
    updateUI(gameState) {
        // Could update UI elements based on game state
        // Examples: hair count, tool usage statistics, etc.
        
        if (gameState.hairCount !== undefined) {
            // Could show hair count in UI
            console.log(`Hair strands: ${gameState.hairCount}`);
        }
        
        if (gameState.fallingHairCount !== undefined) {
            // Could show falling hair animation status
            console.log(`Falling hair particles: ${gameState.fallingHairCount}`);
        }
    }

    /**
     * Show or hide loading state
     * @param {boolean} isLoading - Whether to show loading state
     */
    setLoadingState(isLoading) {
        Object.values(this.buttons).forEach(button => {
            if (button) {
                button.disabled = isLoading;
                if (isLoading) {
                    button.style.opacity = '0.5';
                } else {
                    button.style.opacity = '';
                }
            }
        });
        
        if (this.colorPicker) {
            this.colorPicker.disabled = isLoading;
        }
    }

    /**
     * Get current UI state
     * @returns {Object} Current UI state
     */
    getUIState() {
        return {
            currentTool: this.toolManager.getCurrentTool(),
            currentColor: this.colorPicker ? this.colorPicker.value : GameConfig.hair.defaultColor,
            buttonsDisabled: this.buttons.paint ? this.buttons.paint.disabled : false
        };
    }

    /**
     * Clean up UI event listeners
     */
    cleanup() {
        // Remove event listeners to prevent memory leaks
        Object.values(this.buttons).forEach(button => {
            if (button) {
                button.removeEventListener('click', null);
            }
        });
        
        if (this.colorPicker) {
            this.colorPicker.removeEventListener('change', null);
        }
        
        document.removeEventListener('keydown', null);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIController;
}
