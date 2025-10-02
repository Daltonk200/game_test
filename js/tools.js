/**
 * Tool Manager
 * Handles all tool functionality and tool switching
 */

class ToolManager {
    constructor(canvas, ctx, hairSystem, physicsEngine, audioManager) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.hairSystem = hairSystem;
        this.physicsEngine = physicsEngine;
        this.audioManager = audioManager;
        
        this.currentTool = 'paint';
        this.isMouseDown = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.colorPicker = null;
        
        this.setupEventListeners();
    }

    /**
     * Set up mouse event listeners for the canvas
     */
    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('mouseleave', (e) => this.handleMouseLeave(e));
    }

    /**
     * Set the color picker reference
     * @param {HTMLInputElement} colorPicker - The color picker input element
     */
    setColorPicker(colorPicker) {
        this.colorPicker = colorPicker;
    }

    /**
     * Change the current tool
     * @param {string} toolName - Name of the tool to switch to
     */
    setTool(toolName) {
        // Clear any existing visual guides when switching tools
        if (this.currentTool === 'addHair') {
            this.clearHairZoneGuide();
        }
        
        this.currentTool = toolName;
        console.log('Tool changed to:', toolName);
        
        // Update cursor classes
        this.updateCursor();
    }

    /**
     * Update the cursor based on current tool
     */
    updateCursor() {
        // Remove all cursor classes
        this.canvas.classList.remove('cursor-paint', 'cursor-comb', 'cursor-shave', 'cursor-addhair');
        
        // Add appropriate cursor class
        switch(this.currentTool) {
            case 'paint':
                this.canvas.classList.add('cursor-paint');
                break;
            case 'comb':
                this.canvas.classList.add('cursor-comb');
                break;
            case 'shave':
                this.canvas.classList.add('cursor-shave');
                break;
            case 'addHair':
                this.canvas.classList.add('cursor-addhair');
                break;
        }
    }

    /**
     * Handle mouse down events
     * @param {MouseEvent} event - The mouse event
     */
    handleMouseDown(event) {
        this.isMouseDown = true;
        const pos = Utils.getMousePosition(this.canvas, event);
        const currentColor = this.colorPicker ? this.colorPicker.value : GameConfig.hair.defaultColor;
        
        // Execute tool action and play appropriate sound
        this.executeToolAction(pos.x, pos.y, currentColor, true);
        
        // Update mouse position
        this.lastMouseX = pos.x;
        this.lastMouseY = pos.y;
    }

    /**
     * Handle mouse move events
     * @param {MouseEvent} event - The mouse event
     */
    handleMouseMove(event) {
        const pos = Utils.getMousePosition(this.canvas, event);
        
        if (this.isMouseDown) {
            const currentColor = this.colorPicker ? this.colorPicker.value : GameConfig.hair.defaultColor;
            
            // For comb tool, calculate movement direction
            if (this.currentTool === 'comb') {
                const dx = pos.x - this.lastMouseX;
                const dy = pos.y - this.lastMouseY;
                
                // Use dynamic strand combing if there's movement
                if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
                    this.combHair(pos.x, pos.y, dx, dy);
                } else {
                    this.executeToolAction(pos.x, pos.y, currentColor, false);
                }
            } else {
                this.executeToolAction(pos.x, pos.y, currentColor, false);
            }
        }
        
        // Update mouse position
        this.lastMouseX = pos.x;
        this.lastMouseY = pos.y;
    }

    /**
     * Handle mouse up events
     * @param {MouseEvent} event - The mouse event
     */
    handleMouseUp(event) {
        this.isMouseDown = false;
        this.audioManager.stopAllToolSounds();
    }

    /**
     * Handle mouse leave events
     * @param {MouseEvent} event - The mouse event
     */
    handleMouseLeave(event) {
        this.isMouseDown = false;
        this.audioManager.stopAllToolSounds();
    }

    /**
     * Execute the current tool's action
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {string} color - Current color
     * @param {boolean} isInitialClick - Whether this is the initial mouse down
     */
    executeToolAction(x, y, color, isInitialClick) {
        switch(this.currentTool) {
            case 'paint':
                this.paintHair(x, y, color, isInitialClick);
                break;
            case 'addHair':
                this.addHair(x, y, color, isInitialClick);
                break;
            case 'comb':
                this.combHair(x, y, 0, 0, isInitialClick);
                break;
            case 'shave':
                this.shaveHair(x, y, isInitialClick);
                break;
        }
    }

    /**
     * Paint/recolor existing hair
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {string} color - Paint color
     * @param {boolean} playSound - Whether to start/continue sound
     */
    paintHair(x, y, color, playSound = false) {
        if (playSound) {
            this.audioManager.playToolSound('paint', true);
        }
        
        const hasAnimation = this.physicsEngine.isAnimationRunning();
        this.hairSystem.paintHairAtPosition(x, y, color, hasAnimation);
    }

    /**
     * Add new hair strands
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {string} color - Hair color
     * @param {boolean} playSound - Whether to start/continue sound
     */
    addHair(x, y, color, playSound = false) {
        const success = this.hairSystem.addHairAtPosition(x, y, color);
        
        if (success) {
            if (playSound) {
                this.audioManager.playToolSound('paint', true); // Use paint sound for add hair
            }
        } else {
            // Show invalid area feedback
            this.showInvalidAreaFeedback(x, y);
        }
    }

    /**
     * Comb/style hair
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} dx - X direction of movement
     * @param {number} dy - Y direction of movement
     * @param {boolean} playSound - Whether to start/continue sound
     */
    combHair(x, y, dx, dy, playSound = false) {
        if (playSound) {
            this.audioManager.playToolSound('comb', true);
        }
        
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
            // Dynamic combing with movement direction
            this.hairSystem.combHairAtPosition(x, y, dx, dy);
            
            // Clear and redraw if no animation is running
            if (!this.physicsEngine.isAnimationRunning()) {
                this.clearAndRedrawArea(x, y, GameConfig.tools.comb.effectRadius);
            }
        } else {
            // Static combing effect
            this.drawCombEffect(x, y);
        }
    }

    /**
     * Shave/remove hair
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {boolean} playSound - Whether to start/continue sound
     */
    shaveHair(x, y, playSound = false) {
        if (playSound) {
            this.audioManager.playToolSound('shave', true);
        }
        
        // Remove hair strands and get them for physics
        const removedHair = this.hairSystem.shaveHairAtPosition(x, y);
        
        // Create falling hair particles
        if (removedHair.length > 0) {
            this.physicsEngine.createMultipleFallingHair(removedHair);
            
            // Start animation with hair system redraw callback
            this.physicsEngine.initializeAnimation(() => this.hairSystem.redrawAllHair());
        }
        
        // If no falling hair animation, manually clear and redraw the area
        if (!this.physicsEngine.isAnimationRunning()) {
            this.clearAndRedrawArea(x, y, GameConfig.tools.shave.clearSize);
        }
    }

    /**
     * Draw visual comb effect
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
    drawCombEffect(x, y) {
        const currentColor = this.colorPicker ? this.colorPicker.value : GameConfig.hair.defaultColor;
        const visualLength = GameConfig.tools.comb.visualLength;
        
        this.ctx.strokeStyle = currentColor;
        this.ctx.globalAlpha = 0.3;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x - visualLength, y);
        this.ctx.lineTo(x + visualLength, y);
        this.ctx.stroke();
        this.ctx.globalAlpha = 1.0; // Reset alpha
    }

    /**
     * Clear area and redraw overlapping hair
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} radius - Clear radius
     */
    clearAndRedrawArea(x, y, radius) {
        // Clear the area
        this.ctx.clearRect(x - radius, y - radius, radius * 2, radius * 2);
        
        // Redraw hair strands that might overlap with the cleared area
        const hairStrands = this.hairSystem.getAllHairStrands();
        hairStrands.forEach(strand => {
            const distance = Utils.calculateDistance(strand.baseX, strand.baseY, x, y);
            if (distance <= radius * 1.5) { // Slightly larger redraw area
                this.hairSystem.drawHairStrand(
                    strand.baseX, strand.baseY, strand.angle, strand.length, strand.color
                );
            }
        });
    }

    /**
     * Show invalid area feedback when trying to add hair outside zone
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
    showInvalidAreaFeedback(x, y) {
        // Show blinking hair zone boundary
        this.showBlinkingHairZone();
        
        // Draw red X at attempted position
        this.ctx.strokeStyle = GameConfig.ui.invalidFeedback.color;
        this.ctx.lineWidth = GameConfig.ui.invalidFeedback.lineWidth;
        this.ctx.globalAlpha = GameConfig.ui.invalidFeedback.opacity;
        
        this.ctx.beginPath();
        // Draw X
        this.ctx.moveTo(x - 10, y - 10);
        this.ctx.lineTo(x + 10, y + 10);
        this.ctx.moveTo(x + 10, y - 10);
        this.ctx.lineTo(x - 10, y + 10);
        this.ctx.stroke();
        
        this.ctx.globalAlpha = 1.0; // Reset alpha
        
        // Remove the X after a delay
        setTimeout(() => {
            this.clearAndRedrawArea(x, y, 15);
        }, GameConfig.ui.invalidFeedback.duration);
    }

    /**
     * Show blinking hair zone boundary
     */
    showBlinkingHairZone() {
        let blinkCount = 0;
        const maxBlinks = GameConfig.ui.invalidFeedback.blinkCount;
        
        const blinkInterval = setInterval(() => {
            if (blinkCount % 2 === 0) {
                this.drawHairZoneGuide();
            } else {
                this.clearHairZoneGuide();
            }
            
            blinkCount++;
            
            if (blinkCount >= maxBlinks * 2) {
                clearInterval(blinkInterval);
                this.clearHairZoneGuide();
            }
        }, GameConfig.ui.invalidFeedback.blinkInterval);
    }

    /**
     * Draw hair zone guide (semi-circle)
     */
    drawHairZoneGuide() {
        const centerX = GameConfig.avatar.centerX;
        const centerY = GameConfig.avatar.centerY;
        const hairRadius = GameConfig.avatar.hairRadius;
        
        this.ctx.strokeStyle = GameConfig.ui.hairZone.strokeColor;
        this.ctx.lineWidth = GameConfig.ui.hairZone.lineWidth;
        this.ctx.setLineDash(GameConfig.ui.hairZone.dashPattern);
        
        this.ctx.beginPath();
        // Draw semi-circle: start from left (-π) to right (0), which is the top half
        this.ctx.arc(centerX, centerY, hairRadius, Math.PI, 2 * Math.PI);
        // Add a straight line across the bottom to close the semi-circle
        this.ctx.lineTo(centerX - hairRadius, centerY);
        this.ctx.stroke();
        
        this.ctx.setLineDash([]); // Reset line dash
    }

    /**
     * Clear hair zone guide
     */
    clearHairZoneGuide() {
        this.hairSystem.redrawAllHair();
    }

    /**
     * Get the current tool
     * @returns {string} Current tool name
     */
    getCurrentTool() {
        return this.currentTool;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ToolManager;
}
