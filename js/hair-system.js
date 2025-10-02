/**
 * Hair System
 * Manages hair generation, drawing, and hair strand management
 */

class HairSystem {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.hairStrands = [];
    }

    /**
     * Draw a single hair strand
     * @param {number} x - Starting X coordinate
     * @param {number} y - Starting Y coordinate
     * @param {number} angle - Angle of the hair strand
     * @param {number} length - Length of the hair strand
     * @param {string} color - Color of the hair strand
     */
    drawHairStrand(x, y, angle, length, color) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = GameConfig.hair.lineWidth;
        
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        
        // Calculate end point using angle and length
        const endX = x + Math.cos(angle) * length;
        const endY = y + Math.sin(angle) * length;
        
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
    }

    /**
     * Generate initial hair around the avatar's head
     */
    generateHair() {
        const centerX = GameConfig.avatar.centerX;
        const centerY = GameConfig.avatar.centerY;
        const maxRadius = GameConfig.hair.generationRadius.maxRadius;
        const step = GameConfig.hair.generationRadius.step;
        
        // Create structured hair in concentric circles for more control
        for (let radius = 0; radius <= maxRadius; radius += step) {
            // Number of strands for this circle
            const strandsInCircle = Math.max(
                GameConfig.hair.strandsPerCircle.base, 
                Math.floor(radius * GameConfig.hair.strandsPerCircle.multiplier)
            );
            
            for (let i = 0; i < strandsInCircle; i++) {
                // Evenly distribute angles around semi-circle (top half only)
                const baseAngle = (i / strandsInCircle) * Math.PI - Math.PI; // -180° to 0° (top half)
                
                // Add small variation to avoid perfect grid
                const angleVariation = (Math.random() - 0.5) * 0.1;
                const radiusVariation = (Math.random() - 0.5) * 2;
                
                // Calculate position
                const actualRadius = radius + radiusVariation;
                const actualAngle = baseAngle + angleVariation;
                
                const baseX = centerX + Math.cos(actualAngle) * actualRadius;
                const baseY = centerY + Math.sin(actualAngle) * actualRadius;
                
                // Hair strands point outward from center
                const strandAngle = actualAngle + (Math.random() - 0.5) * 0.5;
                
                // Consistent length
                const length = GameConfig.hair.strandLength.max;
                
                // Store and draw the strand
                this.addHairStrand(baseX, baseY, strandAngle, length, GameConfig.hair.defaultColor);
            }
        }
        
        // Add very dense center fill with controlled placement (semi-circle)
        const centerFillStrands = GameConfig.hair.centerFillStrands;
        for (let i = 0; i < centerFillStrands; i++) {
            const angle = (i / centerFillStrands) * Math.PI - Math.PI; // -180° to 0° (top half only)
            const distance = 1 + (Math.random() * 4);
            
            const baseX = centerX + Math.cos(angle) * distance;
            const baseY = centerY + Math.sin(angle) * distance;
            
            const strandAngle = angle + (Math.random() - 0.5) * 0.4;
            const length = GameConfig.hair.strandLength.max;
            
            // Store and draw the strand
            this.addHairStrand(baseX, baseY, strandAngle, length, GameConfig.hair.defaultColor);
        }
    }

    /**
     * Add a new hair strand to the system
     * @param {number} baseX - X coordinate of hair base
     * @param {number} baseY - Y coordinate of hair base
     * @param {number} angle - Angle of the hair strand
     * @param {number} length - Length of the hair strand
     * @param {string} color - Color of the hair strand
     */
    addHairStrand(baseX, baseY, angle, length, color) {
        const strand = {
            baseX: baseX,
            baseY: baseY,
            angle: angle,
            length: length,
            color: color
        };
        
        this.hairStrands.push(strand);
        this.drawHairStrand(baseX, baseY, angle, length, color);
    }

    /**
     * Add multiple hair strands at a specific position
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {string} color - Color of the hair strands
     */
    addHairAtPosition(x, y, color) {
        // Check if position is within the hair zone
        if (!Utils.isInHairZone(x, y)) {
            return false; // Return false if outside valid area
        }
        
        const strandsToAdd = GameConfig.tools.addHair.strandsPerClick;
        
        // Draw multiple hair strands at the position
        for (let i = 0; i < strandsToAdd; i++) {
            // Random angle (0 to 360 degrees)
            const angle = Math.random() * 2 * Math.PI;
            
            // Random length
            const length = Utils.randomBetween(
                GameConfig.hair.strandLength.min, 
                GameConfig.hair.strandLength.max
            );
            
            this.addHairStrand(x, y, angle, length, color);
        }
        
        return true; // Return true if hair was successfully added
    }

    /**
     * Change color of existing hair strands within a radius
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {string} color - New color
     * @param {boolean} hasAnimation - Whether falling hair animation is active
     */
    paintHairAtPosition(x, y, color, hasAnimation = false) {
        let foundHair = false;
        const paintRadius = GameConfig.tools.paint.effectRadius;
        
        // Look for existing hair strands within radius
        for (let i = 0; i < this.hairStrands.length; i++) {
            const strand = this.hairStrands[i];
            const distance = Utils.calculateDistance(strand.baseX, strand.baseY, x, y);
            
            // If strand is within range, change its color
            if (distance <= paintRadius) {
                strand.color = color;
                foundHair = true;
            }
        }
        
        // If we found hair to recolor and no falling hair animation, redraw manually
        if (foundHair && !hasAnimation) {
            this.redrawAllHair();
        }
        
        return foundHair;
    }

    /**
     * Remove hair strands within a radius and return them for physics
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {Array} Array of removed hair strands
     */
    shaveHairAtPosition(x, y) {
        const shaveRadius = GameConfig.tools.shave.effectRadius;
        const removedHair = [];
        
        // Find hair strands within shaving area
        for (let i = this.hairStrands.length - 1; i >= 0; i--) {
            const strand = this.hairStrands[i];
            const distance = Utils.calculateDistance(strand.baseX, strand.baseY, x, y);
            
            // If strand is within shaving range, remove it
            if (distance <= shaveRadius) {
                removedHair.push({...strand}); // Copy strand data
                this.hairStrands.splice(i, 1); // Remove from array
            }
        }
        
        return removedHair;
    }

    /**
     * Adjust hair strand angles for combing effect
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} dx - X direction of comb movement
     * @param {number} dy - Y direction of comb movement
     */
    combHairAtPosition(x, y, dx, dy) {
        const combRadius = GameConfig.tools.comb.effectRadius;
        const influence = GameConfig.tools.comb.influence;
        
        // Calculate the combing direction
        const combAngle = Math.atan2(dy, dx);
        
        // Loop through all hair strands
        for (let i = 0; i < this.hairStrands.length; i++) {
            const strand = this.hairStrands[i];
            const distance = Utils.calculateDistance(strand.baseX, strand.baseY, x, y);
            
            if (distance <= combRadius) {
                // Adjust the strand angle slightly toward the comb direction
                const angleDiff = combAngle - strand.angle;
                strand.angle += angleDiff * influence;
            }
        }
    }

    /**
     * Redraw all hair strands
     */
    redrawAllHair() {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Redraw all hair strands
        for (let i = 0; i < this.hairStrands.length; i++) {
            const strand = this.hairStrands[i];
            this.drawHairStrand(strand.baseX, strand.baseY, strand.angle, strand.length, strand.color);
        }
    }

    /**
     * Get all hair strands (for external access)
     * @returns {Array} Array of hair strand objects
     */
    getAllHairStrands() {
        return this.hairStrands;
    }

    /**
     * Get the number of hair strands
     * @returns {number} Number of hair strands
     */
    getHairCount() {
        return this.hairStrands.length;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HairSystem;
}
