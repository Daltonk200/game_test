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
     * Draw a single hair strand with texture and glossy effects
     * @param {number} x - Starting X coordinate
     * @param {number} y - Starting Y coordinate
     * @param {number} angle - Angle of the hair strand
     * @param {number} length - Length of the hair strand
     * @param {string} color - Color of the hair strand
     * @param {Object} waveConfig - Wave configuration (amplitude, frequency, pattern)
     * @param {number} layerDepth - Depth of this hair layer (0-1, 1 being front)
     */
    drawHairStrand(x, y, angle, length, color, waveConfig = null, layerDepth = 1.0) {
        // Calculate strand properties based on layer depth
        const opacity = 0.6 + (layerDepth * 0.4); // Back layers are more transparent
        const lineWidth = GameConfig.hair.lineWidth * (0.8 + layerDepth * 0.4); // Vary thickness
        
        // Draw shadow first (if glossy)
        if (waveConfig && waveConfig.glossiness > 0) {
            this.drawStrandShadow(x, y, angle, length, waveConfig, layerDepth);
        }
        
        // Draw main strand
        this.ctx.globalAlpha = opacity;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.lineCap = 'round';
        
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        
        if (!waveConfig || waveConfig.wavePattern === 'straight') {
            // Straight hair with smooth bezier curves
            this.drawSmoothStrand(x, y, angle, length);
        } else {
            // Wavy or curly hair - draw curve
            this.drawWavyStrand(x, y, angle, length, waveConfig);
        }
        
        this.ctx.stroke();
        
        // Draw highlight (if glossy)
        if (waveConfig && waveConfig.glossiness > 0) {
            this.drawStrandHighlight(x, y, angle, length, waveConfig, layerDepth);
        }
        
        this.ctx.globalAlpha = 1.0; // Reset alpha
    }

    /**
     * Draw a smooth straight strand using bezier curves
     * @param {number} startX - Starting X coordinate
     * @param {number} startY - Starting Y coordinate
     * @param {number} angle - Angle of the hair strand
     * @param {number} length - Length of the hair strand
     */
    drawSmoothStrand(startX, startY, angle, length) {
        const endX = startX + Math.cos(angle) * length;
        const endY = startY + Math.sin(angle) * length;
        
        // Add slight curve for more natural look
        const midX = (startX + endX) / 2 + (Math.random() - 0.5) * 2;
        const midY = (startY + endY) / 2 + (Math.random() - 0.5) * 2;
        
        this.ctx.quadraticCurveTo(midX, midY, endX, endY);
    }

    /**
     * Draw strand shadow for glossy effect
     * @param {number} x - Starting X coordinate
     * @param {number} y - Starting Y coordinate
     * @param {number} angle - Angle of the hair strand
     * @param {number} length - Length of the hair strand
     * @param {Object} waveConfig - Wave configuration
     * @param {number} layerDepth - Depth of this hair layer
     */
    drawStrandShadow(x, y, angle, length, waveConfig, layerDepth) {
        const shadowOffset = 1 * layerDepth;
        const shadowOpacity = waveConfig.glossiness * 0.3 * layerDepth;
        
        this.ctx.save();
        this.ctx.globalAlpha = shadowOpacity;
        this.ctx.strokeStyle = waveConfig.shadowColor || '#000000';
        this.ctx.lineWidth = GameConfig.hair.lineWidth * (0.8 + layerDepth * 0.4);
        this.ctx.lineCap = 'round';
        
        this.ctx.beginPath();
        this.ctx.moveTo(x + shadowOffset, y + shadowOffset);
        
        if (waveConfig.wavePattern === 'straight') {
            this.drawSmoothStrand(x + shadowOffset, y + shadowOffset, angle, length);
        } else {
            this.drawWavyStrand(x + shadowOffset, y + shadowOffset, angle, length, waveConfig);
        }
        
        this.ctx.stroke();
        this.ctx.restore();
    }

    /**
     * Draw strand highlight for glossy effect
     * @param {number} x - Starting X coordinate
     * @param {number} y - Starting Y coordinate
     * @param {number} angle - Angle of the hair strand
     * @param {number} length - Length of the hair strand
     * @param {Object} waveConfig - Wave configuration
     * @param {number} layerDepth - Depth of this hair layer
     */
    drawStrandHighlight(x, y, angle, length, waveConfig, layerDepth) {
        const highlightOpacity = waveConfig.glossiness * 0.5 * layerDepth;
        const highlightWidth = GameConfig.hair.lineWidth * 0.3;
        
        this.ctx.save();
        this.ctx.globalAlpha = highlightOpacity;
        this.ctx.strokeStyle = waveConfig.highlightColor || '#FFFFFF';
        this.ctx.lineWidth = highlightWidth;
        this.ctx.lineCap = 'round';
        
        // Draw highlight slightly offset from main strand
        const highlightOffset = length * 0.3; // Highlight in middle third
        const highlightStart = highlightOffset;
        const highlightEnd = length - highlightOffset;
        
        this.ctx.beginPath();
        const startHighlightX = x + Math.cos(angle) * highlightStart;
        const startHighlightY = y + Math.sin(angle) * highlightStart;
        const endHighlightX = x + Math.cos(angle) * highlightEnd;
        const endHighlightY = y + Math.sin(angle) * highlightEnd;
        
        this.ctx.moveTo(startHighlightX, startHighlightY);
        this.ctx.lineTo(endHighlightX, endHighlightY);
        this.ctx.stroke();
        this.ctx.restore();
    }

    /**
     * Draw a wavy/curly hair strand with smooth bezier curves
     * @param {number} startX - Starting X coordinate
     * @param {number} startY - Starting Y coordinate
     * @param {number} angle - Base angle of the hair strand
     * @param {number} length - Length of the hair strand
     * @param {Object} waveConfig - Wave configuration
     */
    drawWavyStrand(startX, startY, angle, length, waveConfig) {
        const segments = Math.max(12, Math.floor(length / 2)); // More segments for ultra-smooth curves
        const points = [];
        
        // Calculate all points first
        for (let i = 0; i <= segments; i++) {
            const progress = i / segments;
            const distance = progress * length;
            
            // Calculate wave offset with more sophisticated patterns
            let waveOffset = 0;
            if (waveConfig.wavePattern === 'wavy') {
                // Sine wave with natural tapering
                waveOffset = Math.sin(progress * Math.PI * 2 * waveConfig.waveFrequency) * 
                           waveConfig.waveAmplitude * (1 - progress * 0.1); // Slight taper
            } else if (waveConfig.wavePattern === 'curly') {
                // Complex wave for curly hair with multiple harmonics
                const primary = Math.sin(progress * Math.PI * 4 * waveConfig.waveFrequency);
                const secondary = Math.sin(progress * Math.PI * 8 * waveConfig.waveFrequency) * 0.3;
                waveOffset = (primary + secondary) * waveConfig.waveAmplitude * (1 - progress * 0.3);
            }
            
            // Calculate position along the main direction
            const mainX = startX + Math.cos(angle) * distance;
            const mainY = startY + Math.sin(angle) * distance;
            
            // Add perpendicular wave offset
            const perpAngle = angle + Math.PI / 2;
            const waveX = mainX + Math.cos(perpAngle) * waveOffset;
            const waveY = mainY + Math.sin(perpAngle) * waveOffset;
            
            points.push({ x: waveX, y: waveY });
        }
        
        // Draw using smooth bezier curves
        this.ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
            if (i === 1) {
                // First curve
                const cp1x = points[0].x + (points[1].x - points[0].x) * 0.3;
                const cp1y = points[0].y + (points[1].y - points[0].y) * 0.3;
                this.ctx.quadraticCurveTo(cp1x, cp1y, points[1].x, points[1].y);
            } else if (i === points.length - 1) {
                // Last curve
                const cp1x = points[i-1].x + (points[i].x - points[i-1].x) * 0.7;
                const cp1y = points[i-1].y + (points[i].y - points[i-1].y) * 0.7;
                this.ctx.quadraticCurveTo(cp1x, cp1y, points[i].x, points[i].y);
            } else {
                // Middle curves using cubic bezier for maximum smoothness
                const cp1x = points[i-1].x + (points[i].x - points[i-2].x) * 0.3;
                const cp1y = points[i-1].y + (points[i].y - points[i-2].y) * 0.3;
                const cp2x = points[i].x - (points[i+1].x - points[i-1].x) * 0.3;
                const cp2y = points[i].y - (points[i+1].y - points[i-1].y) * 0.3;
                
                this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, points[i].x, points[i].y);
            }
        }
    }

    /**
     * Generate initial hair around the avatar's head with volume and dimension
     * @param {string} characterType - The character type ('male' or 'female')
     */
    generateHair(characterType = 'male') {
        const character = GameConfig.characters[characterType];
        const centerX = character.hairCenter.x;
        const centerY = character.hairCenter.y;
        const maxRadius = character.hairStyle.generationRadius.maxRadius;
        const step = character.hairStyle.generationRadius.step;
        
        // Clear existing hair
        this.hairStrands = [];
        
        // Create layered hair for volume and depth
        const layers = character.hairStyle.layerDepths || [1.0];
        
        // Add volume variation zones for more realistic density
        const volumeZones = [
            { centerOffset: { x: 0, y: 0 }, multiplier: 1.0 }, // Main area
            { centerOffset: { x: -10, y: -5 }, multiplier: 0.7 }, // Left side volume
            { centerOffset: { x: 10, y: -5 }, multiplier: 0.7 }, // Right side volume
            { centerOffset: { x: 0, y: -8 }, multiplier: 0.8 } // Top volume
        ];
        
        // Generate hair for each volume zone and layer combination
        volumeZones.forEach((zone, zoneIndex) => {
            layers.forEach((layerDepth, layerIndex) => {
                const zoneCenterX = centerX + zone.centerOffset.x;
                const zoneCenterY = centerY + zone.centerOffset.y;
                const zoneMultiplier = zone.multiplier * layerDepth;
                
                // Create structured hair in concentric circles for more control
                for (let radius = 0; radius <= maxRadius * zone.multiplier; radius += step) {
                    // Number of strands for this circle, varied by layer and zone
                    const baseStrandsInCircle = Math.max(
                        character.hairStyle.strandsPerCircle.base, 
                        Math.floor(radius * character.hairStyle.strandsPerCircle.multiplier * character.hairStyle.volumeMultiplier)
                    );
                    
                    // Reduce strand count for back layers and side zones
                    const strandsInCircle = Math.floor(baseStrandsInCircle * zoneMultiplier);
                    
                    for (let i = 0; i < strandsInCircle; i++) {
                        // Evenly distribute angles around semi-circle (top half only)
                        const baseAngle = (i / strandsInCircle) * Math.PI - Math.PI; // -180° to 0° (top half)
                        
                        // Add variation, more for back layers and side zones
                        const angleVariation = (Math.random() - 0.5) * (0.1 + (1 - layerDepth) * 0.2 + (1 - zone.multiplier) * 0.1);
                        const radiusVariation = (Math.random() - 0.5) * (2 + (1 - layerDepth) * 3);
                        
                        // Calculate position with layer and zone offset
                        const actualRadius = radius + radiusVariation;
                        const actualAngle = baseAngle + angleVariation;
                        
                        const baseX = zoneCenterX + Math.cos(actualAngle) * actualRadius;
                        const baseY = zoneCenterY + Math.sin(actualAngle) * actualRadius;
                        
                        // Hair strands point outward from center with character-specific curliness
                        const strandAngle = actualAngle + (Math.random() - 0.5) * (0.5 + character.hairStyle.curliness);
                        
                        // Character-specific length with layer variation
                        const baseLengthMin = character.hairStyle.strandLength.min;
                        const baseLengthMax = character.hairStyle.strandLength.max;
                        const layerLengthVariation = (1 - layerDepth) * 0.3; // Back layers can be longer
                        
                        const length = Utils.randomBetween(
                            baseLengthMin + baseLengthMin * layerLengthVariation,
                            baseLengthMax + baseLengthMax * layerLengthVariation
                        );
                        
                        // Add complex volume variation
                        const volumeOffset = (Math.random() - 0.5) * character.hairStyle.volumeVariation * 10;
                        const volumeX = baseX + volumeOffset + (Math.random() - 0.5) * (1 - zone.multiplier) * 5;
                        const volumeY = baseY + volumeOffset * 0.5 + (Math.random() - 0.5) * (1 - zone.multiplier) * 3;
                        
                        // Effective layer depth considering zone
                        const effectiveLayerDepth = layerDepth * (0.8 + zone.multiplier * 0.2);
                        
                        // Store and draw the strand with wave configuration and effective layer depth
                        this.addHairStrand(volumeX, volumeY, strandAngle, length, character.hairStyle.defaultColor, character.hairStyle, effectiveLayerDepth);
                    }
                }
            });
        });
        
        // Add very dense center fill with controlled placement and layering
        layers.forEach((layerDepth, layerIndex) => {
            const centerFillStrands = Math.floor(character.hairStyle.centerFillStrands * layerDepth);
            
            for (let i = 0; i < centerFillStrands; i++) {
                const angle = (i / centerFillStrands) * Math.PI - Math.PI; // -180° to 0° (top half only)
                const distance = 1 + (Math.random() * 4) + (1 - layerDepth) * 2; // Back layers slightly further
                
                const baseX = centerX + Math.cos(angle) * distance;
                const baseY = centerY + Math.sin(angle) * distance;
                
                const strandAngle = angle + (Math.random() - 0.5) * (0.4 + character.hairStyle.curliness);
                const length = character.hairStyle.strandLength.max + (1 - layerDepth) * 5; // Back layers longer
                
                // Add volume variation
                const volumeOffset = (Math.random() - 0.5) * character.hairStyle.volumeVariation * 8;
                const volumeX = baseX + volumeOffset;
                const volumeY = baseY + volumeOffset * 0.5;
                
                // Store and draw the strand with wave configuration and layer depth
                this.addHairStrand(volumeX, volumeY, strandAngle, length, character.hairStyle.defaultColor, character.hairStyle, layerDepth);
            }
        });
    }

    /**
     * Add a new hair strand to the system
     * @param {number} baseX - X coordinate of hair base
     * @param {number} baseY - Y coordinate of hair base
     * @param {number} angle - Angle of the hair strand
     * @param {number} length - Length of the hair strand
     * @param {string} color - Color of the hair strand
     * @param {Object} waveConfig - Wave configuration for texture
     * @param {number} layerDepth - Depth of this hair layer (0-1, 1 being front)
     */
    addHairStrand(baseX, baseY, angle, length, color, waveConfig = null, layerDepth = 1.0) {
        const strand = {
            baseX: baseX,
            baseY: baseY,
            angle: angle,
            length: length,
            color: color,
            waveConfig: waveConfig,
            layerDepth: layerDepth
        };
        
        this.hairStrands.push(strand);
        this.drawHairStrand(baseX, baseY, angle, length, color, waveConfig, layerDepth);
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
        
        // Draw multiple hair strands at the position with layering
        for (let i = 0; i < strandsToAdd; i++) {
            // Random angle (0 to 360 degrees) with character-specific curliness
            const baseAngle = Math.random() * 2 * Math.PI;
            const angle = baseAngle + (Math.random() - 0.5) * character.hairStyle.curliness;
            
            // Character-specific length
            const length = Utils.randomBetween(
                character.hairStyle.strandLength.min, 
                character.hairStyle.strandLength.max
            );
            
            // Random layer depth for new hair
            const layers = character.hairStyle.layerDepths || [1.0];
            const randomLayer = layers[Math.floor(Math.random() * layers.length)];
            
            // Add volume variation
            const volumeOffset = (Math.random() - 0.5) * character.hairStyle.volumeVariation * 5;
            const volumeX = x + volumeOffset;
            const volumeY = y + volumeOffset * 0.5;
            
            this.addHairStrand(volumeX, volumeY, angle, length, color, character.hairStyle, randomLayer);
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
     * Redraw all hair strands with proper layer ordering
     */
    redrawAllHair() {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Sort strands by layer depth (back to front)
        const sortedStrands = [...this.hairStrands].sort((a, b) => {
            const depthA = a.layerDepth || 1.0;
            const depthB = b.layerDepth || 1.0;
            return depthA - depthB; // Draw back layers first
        });
        
        // Redraw all hair strands with their wave configurations and layer depth
        for (let i = 0; i < sortedStrands.length; i++) {
            const strand = sortedStrands[i];
            this.drawHairStrand(
                strand.baseX, 
                strand.baseY, 
                strand.angle, 
                strand.length, 
                strand.color, 
                strand.waveConfig,
                strand.layerDepth || 1.0
            );
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
