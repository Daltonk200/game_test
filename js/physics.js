/**
 * Physics Engine
 * Handles falling hair animations and particle system
 */

class PhysicsEngine {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.fallingHair = [];
        this.isAnimating = false;
        this.animationId = null;
    }

    /**
     * Create a falling hair particle from a hair strand
     * @param {Object} hairStrand - Hair strand object with baseX, baseY, angle, length, color
     */
    createFallingHair(hairStrand) {
        const fallingParticle = {
            x: hairStrand.baseX,
            y: hairStrand.baseY,
            angle: hairStrand.angle,
            length: hairStrand.length,
            color: hairStrand.color,
            rotation: hairStrand.angle, // Current rotation angle
            rotationSpeed: Utils.randomBetween(
                GameConfig.physics.rotationSpeed.min, 
                GameConfig.physics.rotationSpeed.max
            ),
            fallSpeed: Utils.randomBetween(
                GameConfig.physics.fallSpeed.min, 
                GameConfig.physics.fallSpeed.max
            ),
            horizontalDrift: Utils.randomBetween(
                GameConfig.physics.horizontalDrift.min, 
                GameConfig.physics.horizontalDrift.max
            )
        };

        this.fallingHair.push(fallingParticle);
        
        // Start animation if not already running
        if (!this.isAnimating) {
            this.startAnimation();
        }
    }

    /**
     * Create multiple falling hair particles
     * @param {Array} hairStrands - Array of hair strand objects
     */
    createMultipleFallingHair(hairStrands) {
        hairStrands.forEach(strand => this.createFallingHair(strand));
    }

    /**
     * Update positions and rotations of all falling hair particles
     */
    updateFallingHair() {
        for (let i = this.fallingHair.length - 1; i >= 0; i--) {
            const hair = this.fallingHair[i];
            
            // Update position and rotation
            hair.y += hair.fallSpeed;
            hair.x += hair.horizontalDrift;
            hair.rotation += hair.rotationSpeed;
            
            // Remove hair if it falls below the canvas
            if (hair.y > this.canvas.height + GameConfig.physics.cleanupDistance) {
                this.fallingHair.splice(i, 1);
            }
        }
    }

    /**
     * Draw all falling hair particles
     */
    drawFallingHair() {
        this.ctx.globalAlpha = GameConfig.physics.fallingHairOpacity;
        
        this.fallingHair.forEach(hair => {
            this.ctx.strokeStyle = hair.color;
            this.ctx.lineWidth = GameConfig.hair.lineWidth;
            
            this.ctx.beginPath();
            this.ctx.moveTo(hair.x, hair.y);
            
            // Calculate end point using current rotation and length
            const endX = hair.x + Math.cos(hair.rotation) * hair.length;
            const endY = hair.y + Math.sin(hair.rotation) * hair.length;
            
            this.ctx.lineTo(endX, endY);
            this.ctx.stroke();
        });
        
        this.ctx.globalAlpha = 1.0; // Reset alpha
    }

    /**
     * Main animation loop for falling hair
     * @param {Function} redrawStaticHair - Function to redraw static hair
     */
    animationLoop(redrawStaticHair) {
        // Only proceed if there's falling hair
        if (this.fallingHair.length === 0) {
            this.stopAnimation();
            return;
        }
        
        // Clear entire canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // First draw all static hair
        redrawStaticHair();
        
        // Update and draw falling hair
        this.updateFallingHair();
        this.drawFallingHair();
        
        // Continue the animation loop
        this.animationId = requestAnimationFrame(() => this.animationLoop(redrawStaticHair));
    }

    /**
     * Start the animation loop
     */
    startAnimation() {
        if (!this.isAnimating) {
            this.isAnimating = true;
            // The actual animation loop will be started when redrawStaticHair function is provided
        }
    }

    /**
     * Stop the animation loop
     */
    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.isAnimating = false;
    }

    /**
     * Initialize the animation with a callback for redrawing static hair
     * @param {Function} redrawStaticHair - Function to redraw static hair
     */
    initializeAnimation(redrawStaticHair) {
        if (this.isAnimating && this.fallingHair.length > 0) {
            this.animationLoop(redrawStaticHair);
        }
    }

    /**
     * Check if animation is currently running
     * @returns {boolean} True if animation is running
     */
    isAnimationRunning() {
        return this.isAnimating;
    }

    /**
     * Get the number of falling hair particles
     * @returns {number} Number of falling hair particles
     */
    getFallingHairCount() {
        return this.fallingHair.length;
    }

    /**
     * Clear all falling hair particles (emergency stop)
     */
    clearAllFallingHair() {
        this.fallingHair = [];
        this.stopAnimation();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PhysicsEngine;
}
