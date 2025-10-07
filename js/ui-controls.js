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
     * Take a screenshot of the entire game screen
     */
    takeScreenshot() {
        try {
            // Use html2canvas if available, otherwise fall back to manual method
            if (typeof html2canvas !== 'undefined') {
                this.takeScreenshotWithHtml2Canvas();
            } else {
                this.takeScreenshotManual();
            }
        } catch (error) {
            console.error('Screenshot failed:', error);
            this.showScreenshotFeedback(false);
        }
    }

    /**
     * Take screenshot using html2canvas library (if available)
     */
    takeScreenshotWithHtml2Canvas() {
        const gameContainer = document.querySelector('.game-container');
        if (!gameContainer) {
            console.error('Game container not found for screenshot');
            return;
        }

        html2canvas(gameContainer, {
            allowTaint: true,
            useCORS: true,
            backgroundColor: '#f5f5f5',
            scale: 1
        }).then(canvas => {
            // Export as PNG and trigger download
            const dataURL = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `hair-salon-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
            link.href = dataURL;
            link.click();

            // Show success feedback
            this.showScreenshotFeedback(true);
        }).catch(error => {
            console.error('html2canvas screenshot failed:', error);
            // Fall back to manual method
            this.takeScreenshotManual();
        });
    }

    /**
     * Take screenshot manually by drawing elements to canvas
     */
    takeScreenshotManual() {
        // Get the entire game container
        const gameContainer = document.querySelector('.game-container');
        if (!gameContainer) {
            console.error('Game container not found for screenshot');
            return;
        }

        // Get the computed dimensions of the game container
        const containerRect = gameContainer.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;

        // Create a temporary canvas with the same size as the game container
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = containerWidth;
        tempCanvas.height = containerHeight;
        const tempCtx = tempCanvas.getContext('2d');

        // Add roundRect polyfill if not available
        this.addRoundRectPolyfill(tempCtx);

        // Set background color
        tempCtx.fillStyle = '#f5f5f5'; // Match body background
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        // Draw background image
        const bgImg = document.querySelector('.background-image');
        if (bgImg && bgImg.complete) {
            tempCtx.drawImage(bgImg, 0, 0, containerWidth, containerHeight);
        }

        // Draw table image with proper positioning
        const tableImg = document.querySelector('.table-image');
        if (tableImg && tableImg.complete) {
            const tableRect = tableImg.getBoundingClientRect();
            const containerTopLeft = gameContainer.getBoundingClientRect();
            
            const tableX = tableRect.left - containerTopLeft.left;
            const tableY = tableRect.top - containerTopLeft.top;
            const tableWidth = tableRect.width;
            const tableHeight = tableRect.height;
            
            tempCtx.drawImage(tableImg, tableX, tableY, tableWidth, tableHeight);
        }

        // Draw avatar image with proper positioning
        const avatarImg = document.querySelector('.avatar-image');
        if (avatarImg && avatarImg.complete) {
            const avatarRect = avatarImg.getBoundingClientRect();
            const containerTopLeft = gameContainer.getBoundingClientRect();
            
            const avatarX = avatarRect.left - containerTopLeft.left;
            const avatarY = avatarRect.top - containerTopLeft.top;
            const avatarWidth = avatarRect.width;
            const avatarHeight = avatarRect.height;
            
            tempCtx.drawImage(avatarImg, avatarX, avatarY, avatarWidth, avatarHeight);
        }

        // Draw the hair canvas on top
        const hairCanvas = document.getElementById('hairCanvas');
        if (hairCanvas) {
            const canvasRect = hairCanvas.getBoundingClientRect();
            const containerTopLeft = gameContainer.getBoundingClientRect();
            
            const canvasX = canvasRect.left - containerTopLeft.left;
            const canvasY = canvasRect.top - containerTopLeft.top;
            
            tempCtx.drawImage(hairCanvas, canvasX, canvasY);
        }

        // Draw UI elements (controls panel, sound button, character selector)
        this.drawUIElements(tempCtx, gameContainer);

        // Export as PNG and trigger download
        const dataURL = tempCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `hair-salon-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
        link.href = dataURL;
        link.click();

        // Show success feedback
        this.showScreenshotFeedback(true);
    }

    /**
     * Add roundRect polyfill for older browsers
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    addRoundRectPolyfill(ctx) {
        if (!ctx.roundRect) {
            ctx.roundRect = function(x, y, width, height, radius) {
                if (width < 2 * radius) radius = width / 2;
                if (height < 2 * radius) radius = height / 2;
                
                this.beginPath();
                this.moveTo(x + radius, y);
                this.arcTo(x + width, y, x + width, y + height, radius);
                this.arcTo(x + width, y + height, x, y + height, radius);
                this.arcTo(x, y + height, x, y, radius);
                this.arcTo(x, y, x + width, y, radius);
                this.closePath();
            };
        }
    }

    /**
     * Draw UI elements onto the screenshot canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {HTMLElement} gameContainer - Game container element
     */
    drawUIElements(ctx, gameContainer) {
        const containerRect = gameContainer.getBoundingClientRect();

        // Draw controls panel background
        const controlsPanel = document.querySelector('.controls-panel');
        if (controlsPanel) {
            const panelRect = controlsPanel.getBoundingClientRect();
            
            const panelX = panelRect.left - containerRect.left;
            const panelY = panelRect.top - containerRect.top;
            const panelWidth = panelRect.width;
            const panelHeight = panelRect.height;
            
            // Save context
            ctx.save();
            
            // Draw panel shadow
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 2;
            
            // Draw panel background
            ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.roundRect(panelX, panelY, panelWidth, panelHeight, 8);
            ctx.fill();
            
            // Reset shadow and draw border
            ctx.shadowColor = 'transparent';
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.lineWidth = 1;
            ctx.roundRect(panelX, panelY, panelWidth, panelHeight, 8);
            ctx.stroke();
            
            // Restore context
            ctx.restore();
        }

        // Draw sound toggle button
        const soundButton = document.querySelector('.sound-toggle-btn');
        if (soundButton) {
            const buttonRect = soundButton.getBoundingClientRect();
            
            const buttonX = buttonRect.left - containerRect.left;
            const buttonY = buttonRect.top - containerRect.top;
            const buttonSize = Math.min(buttonRect.width, buttonRect.height);
            
            // Save context
            ctx.save();
            
            // Draw button shadow
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 4;
            
            // Draw button background
            const isMuted = soundButton.classList.contains('muted');
            ctx.fillStyle = isMuted ? '#dc3545' : '#6c757d';
            ctx.beginPath();
            ctx.arc(buttonX + buttonSize/2, buttonY + buttonSize/2, buttonSize/2, 0, 2 * Math.PI);
            ctx.fill();
            
            // Restore context
            ctx.restore();
        }

        // Draw character selector
        const characterSelector = document.querySelector('.character-selector');
        if (characterSelector) {
            const selectorRect = characterSelector.getBoundingClientRect();
            
            const selectorX = selectorRect.left - containerRect.left;
            const selectorY = selectorRect.top - containerRect.top;
            const selectorWidth = selectorRect.width;
            const selectorHeight = selectorRect.height;
            
            // Save context
            ctx.save();
            
            // Draw selector shadow
            ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 2;
            
            // Draw selector background
            ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.roundRect(selectorX, selectorY, selectorWidth, selectorHeight, 25);
            ctx.fill();
            
            // Draw character toggle button
            const characterButton = document.querySelector('.character-toggle-btn');
            if (characterButton) {
                const charButtonRect = characterButton.getBoundingClientRect();
                const charButtonX = charButtonRect.left - containerRect.left;
                const charButtonY = charButtonRect.top - containerRect.top;
                const charButtonSize = Math.min(charButtonRect.width, charButtonRect.height);
                
                // Determine button color based on character
                const isFemale = characterSelector.classList.contains('female');
                ctx.fillStyle = isFemale ? '#e91e63' : '#007bff';
                ctx.beginPath();
                ctx.arc(charButtonX + charButtonSize/2, charButtonY + charButtonSize/2, charButtonSize/2, 0, 2 * Math.PI);
                ctx.fill();
            }
            
            // Restore context
            ctx.restore();
        }

        // Add text overlay for UI labels
        this.drawUIText(ctx, gameContainer);
    }

    /**
     * Draw UI text elements
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {HTMLElement} gameContainer - Game container element
     */
    drawUIText(ctx, gameContainer) {
        const containerRect = gameContainer.getBoundingClientRect();
        
        // Draw character label
        const characterLabel = document.getElementById('characterLabel');
        if (characterLabel) {
            const labelRect = characterLabel.getBoundingClientRect();
            const labelX = labelRect.left - containerRect.left;
            const labelY = labelRect.top - containerRect.top;
            
            ctx.save();
            ctx.fillStyle = '#333';
            ctx.font = '14px Arial, sans-serif';
            ctx.fontWeight = '600';
            ctx.textAlign = 'center';
            ctx.fillText(characterLabel.textContent, labelX + labelRect.width/2, labelY + labelRect.height/2 + 4);
            ctx.restore();
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
