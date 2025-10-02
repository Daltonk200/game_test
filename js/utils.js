/**
 * Utility Functions
 * Common helper functions used throughout the Hair Salon game
 */

class Utils {
    /**
     * Get mouse position relative to canvas
     * @param {HTMLCanvasElement} canvas - The canvas element
     * @param {MouseEvent} event - The mouse event
     * @returns {Object} Object with x and y coordinates
     */
    static getMousePosition(canvas, event) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    /**
     * Calculate distance between two points
     * @param {number} x1 - First point X coordinate
     * @param {number} y1 - First point Y coordinate
     * @param {number} x2 - Second point X coordinate
     * @param {number} y2 - Second point Y coordinate
     * @returns {number} Distance between the points
     */
    static calculateDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    /**
     * Check if a point is within the hair zone (semi-circle)
     * @param {number} x - X coordinate to check
     * @param {number} y - Y coordinate to check
     * @returns {boolean} True if point is in valid hair zone
     */
    static isInHairZone(x, y) {
        const centerX = GameConfig.avatar.centerX;
        const centerY = GameConfig.avatar.centerY;
        const hairRadius = GameConfig.avatar.hairRadius;
        
        // Calculate distance from center
        const distance = Utils.calculateDistance(x, y, centerX, centerY);
        
        // Check if within radius AND in the top half (y <= centerY)
        return distance <= hairRadius && y <= centerY;
    }

    /**
     * Generate a random number between min and max
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Random number between min and max
     */
    static randomBetween(min, max) {
        return min + Math.random() * (max - min);
    }

    /**
     * Generate a random integer between min and max (inclusive)
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Random integer between min and max
     */
    static randomIntBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Convert degrees to radians
     * @param {number} degrees - Angle in degrees
     * @returns {number} Angle in radians
     */
    static degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    /**
     * Convert radians to degrees
     * @param {number} radians - Angle in radians
     * @returns {number} Angle in degrees
     */
    static radiansToDegrees(radians) {
        return radians * (180 / Math.PI);
    }

    /**
     * Clamp a value between min and max
     * @param {number} value - Value to clamp
     * @param {number} min - Minimum allowed value
     * @param {number} max - Maximum allowed value
     * @returns {number} Clamped value
     */
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    /**
     * Linear interpolation between two values
     * @param {number} a - Start value
     * @param {number} b - End value
     * @param {number} t - Interpolation factor (0-1)
     * @returns {number} Interpolated value
     */
    static lerp(a, b, t) {
        return a + (b - a) * t;
    }

    /**
     * Find all hair strands within a certain radius of a point
     * @param {Array} hairStrands - Array of hair strand objects
     * @param {number} x - X coordinate of center point
     * @param {number} y - Y coordinate of center point
     * @param {number} radius - Search radius
     * @returns {Array} Array of hair strands within radius
     */
    static findHairStrandsInRadius(hairStrands, x, y, radius) {
        return hairStrands.filter(strand => {
            const distance = Utils.calculateDistance(strand.baseX, strand.baseY, x, y);
            return distance <= radius;
        });
    }

    /**
     * Debounce function to limit how often a function can be called
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
