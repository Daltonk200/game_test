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
     * Draw a single hair strand with texture support
     * @param {number} x - Starting X coordinate
     * @param {number} y - Starting Y coordinate
     * @param {number} angle - Angle of the hair strand
     * @param {number} length - Length of the hair strand
     * @param {string} color - Color of the hair strand
     * @param {Object} waveConfig - Wave configuration (amplitude, frequency, pattern)
     */
    drawHairStrand(x, y, angle, length, color, waveConfig = null) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = GameConfig.hair.lineWidth;
        
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        
        if (!waveConfig || waveConfig.wavePattern === 'straight') {
            // Straight hair - simple line
            const endX = x + Math.cos(angle) * length;
            const endY = y + Math.sin(angle) * length;
            this.ctx.lineTo(endX, endY);
        } else {
            // Wavy or curly hair - draw curve
            this.drawWavyStrand(x, y, angle, length, waveConfig);
        }
        
        this.ctx.stroke();
    }

    /**
     * Draw a wavy/curly hair strand
     * @param {number} startX - Starting X coordinate
     * @param {number} startY - Starting Y coordinate
     * @param {number} angle - Base angle of the hair strand
     * @param {number} length - Length of the hair strand
     * @param {Object} waveConfig - Wave configuration
     */
    drawWavyStrand(startX, startY, angle, length, waveConfig) {
        const segments = Math.max(8, Math.floor(length / 3)); // More segments for smoother curves
        const segmentLength = length / segments;
        
        let currentX = startX;
        let currentY = startY;
        
        for (let i = 0; i <= segments; i++) {
            const progress = i / segments;
            const distance = progress * length;
            
            // Calculate wave offset
            let waveOffset = 0;
            if (waveConfig.wavePattern === 'wavy') {
                // Sine wave for wavy hair
                waveOffset = Math.sin(progress * Math.PI * 2 * waveConfig.waveFrequency) * waveConfig.waveAmplitude;
            } else if (waveConfig.wavePattern === 'curly') {
                // More complex wave for curly hair
                waveOffset = Math.sin(progress * Math.PI * 4 * waveConfig.waveFrequency) * waveConfig.waveAmplitude * (1 - progress * 0.5);
            }
            
            // Calculate position along the main direction
            const mainX = startX + Math.cos(angle) * distance;
            const mainY = startY + Math.sin(angle) * distance;
            
            // Add perpendicular wave offset
            const perpAngle = angle + Math.PI / 2;
            const waveX = mainX + Math.cos(perpAngle) * waveOffset;
            const waveY = mainY + Math.sin(perpAngle) * waveOffset;
            
            if (i === 0) {
                this.ctx.moveTo(waveX, waveY);
            } else {
                // Use quadratic curves for smoother appearance
                const prevProgress = (i - 1) / segments;
                const prevDistance = prevProgress * length;
                const prevMainX = startX + Math.cos(angle) * prevDistance;
                const prevMainY = startY + Math.sin(angle) * prevDistance;
                
                let prevWaveOffset = 0;
                if (waveConfig.wavePattern === 'wavy') {
                    prevWaveOffset = Math.sin(prevProgress * Math.PI * 2 * waveConfig.waveFrequency) * waveConfig.waveAmplitude;
                } else if (waveConfig.wavePattern === 'curly') {
                    prevWaveOffset = Math.sin(prevProgress * Math.PI * 4 * waveConfig.waveFrequency) * waveConfig.waveAmplitude * (1 - prevProgress * 0.5);
                }
                
                const prevWaveX = prevMainX + Math.cos(perpAngle) * prevWaveOffset;
                const prevWaveY = prevMainY + Math.sin(perpAngle) * prevWaveOffset;
                
                // Control point for smooth curve
                const controlX = (prevWaveX + waveX) / 2;
                const controlY = (prevWaveY + waveY) / 2;
                
                this.ctx.quadraticCurveTo(controlX, controlY, waveX, waveY);
            }
        }
    }

    /**
     * Generate initial hair around the avatar's head
     * @param {string} characterType - The character type ('male' or 'female')
     */
    generateHair(characterType = 'male') {
        const character = GameConfig.characters[characterType];
        const centerX = character.hairCenter.x;
        const centerY = character.hairCenter.y;
        const maxRadius = character.hairStyle.generationRadius.maxRadius;
        const step = character.hairStyle.generationRadius.step;
        
        // Create structured hair in concentric circles for more control
        for (let radius = 0; radius <= maxRadius; radius += step) {
            // Number of strands for this circle
            const strandsInCircle = Math.max(
                character.hairStyle.strandsPerCircle.base, 
                Math.floor(radius * character.hairStyle.strandsPerCircle.multiplier * character.hairStyle.volumeMultiplier)
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
                
                // Hair strands point outward from center with character-specific curliness
                const strandAngle = actualAngle + (Math.random() - 0.5) * (0.5 + character.hairStyle.curliness);
                
                // Character-specific length
                const length = Utils.randomBetween(
                    character.hairStyle.strandLength.min,
                    character.hairStyle.strandLength.max
                );
                
                // Store and draw the strand with wave configuration
                this.addHairStrand(baseX, baseY, strandAngle, length, character.hairStyle.defaultColor, character.hairStyle);
            }
        }
        
        // Add very dense center fill with controlled placement (semi-circle)
        const centerFillStrands = character.hairStyle.centerFillStrands;
        for (let i = 0; i < centerFillStrands; i++) {
            const angle = (i / centerFillStrands) * Math.PI - Math.PI; // -180° to 0° (top half only)
            const distance = 1 + (Math.random() * 4);
            
            const baseX = centerX + Math.cos(angle) * distance;
            const baseY = centerY + Math.sin(angle) * distance;
            
            const strandAngle = angle + (Math.random() - 0.5) * (0.4 + character.hairStyle.curliness);
            const length = character.hairStyle.strandLength.max;
            
            // Store and draw the strand with wave configuration
            this.addHairStrand(baseX, baseY, strandAngle, length, character.hairStyle.defaultColor, character.hairStyle);
        }
    }

    /**
     * Add a new hair strand to the system
     * @param {number} baseX - X coordinate of hair base
     * @param {number} baseY - Y coordinate of hair base
     * @param {number} angle - Angle of the hair strand
     * @param {number} length - Length of the hair strand
     * @param {string} color - Color of the hair strand
     * @param {Object} waveConfig - Wave configuration for texture
     */
    addHairStrand(baseX, baseY, angle, length, color, waveConfig = null) {
        const strand = {
            baseX: baseX,
            baseY: baseY,
            angle: angle,
            length: length,
            color: color,
            waveConfig: waveConfig
        };
        
        this.hairStrands.push(strand);
        this.drawHairStrand(baseX, baseY, angle, length, color, waveConfig);
    }

    /**
     * Add multiple hair strands at a specific position
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {string} color - Color of the hair strands
     * @param {string} characterType - The character type for styling
     */
    addHairAtPosition(x, y, color, characterType = 'male') {
        // Check if position is within the hair zone
        if (!Utils.isInHairZone(x, y)) {
            return false; // Return false if outside valid area
        }
        
        const character = GameConfig.characters[characterType];
        const strandsToAdd = GameConfig.tools.addHair.strandsPerClick;
        
        // Draw multiple hair strands at the position
        for (let i = 0; i < strandsToAdd; i++) {
            // Random angle (0 to 360 degrees) with character-specific curliness
            const baseAngle = Math.random() * 2 * Math.PI;
            const angle = baseAngle + (Math.random() - 0.5) * character.hairStyle.curliness;
            
            // Character-specific length
            const length = Utils.randomBetween(
                character.hairStyle.strandLength.min, 
                character.hairStyle.strandLength.max
            );
            
            this.addHairStrand(x, y, angle, length, color, character.hairStyle);
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
        
        // Redraw all hair strands with their wave configurations
        for (let i = 0; i < this.hairStrands.length; i++) {
            const strand = this.hairStrands[i];
            this.drawHairStrand(strand.baseX, strand.baseY, strand.angle, strand.length, strand.color, strand.waveConfig);
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
