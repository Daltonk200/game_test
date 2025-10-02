/**
 * Game Configuration
 * All constants and settings for the Hair Salon game
 */

const GameConfig = {
    // Canvas Settings
    canvas: {
        width: 600,
        height: 600
    },

    // Avatar Head Settings
    avatar: {
        centerX: 305,
        centerY: 220,
        hairRadius: 90  // Semi-circle radius for hair zone
    },

    // Hair Generation Settings
    hair: {
        defaultColor: "#8B4513",
        strandLength: {
            min: 20,
            max: 30
        },
        generationRadius: {
            step: 3,
            maxRadius: 70
        },
        strandsPerCircle: {
            base: 16,
            multiplier: 2.5
        },
        centerFillStrands: 24,
        lineWidth: 2
    },

    // Physics Settings (Falling Hair)
    physics: {
        fallSpeed: {
            min: 2,
            max: 4
        },
        rotationSpeed: {
            min: -0.1,
            max: 0.1
        },
        horizontalDrift: {
            min: -0.5,
            max: 0.5
        },
        fallingHairOpacity: 0.8,
        cleanupDistance: 50  // Remove fallen hair this far below canvas
    },

    // Tool Settings
    tools: {
        paint: {
            effectRadius: 30,
            brushSize: 8
        },
        addHair: {
            strandsPerClick: 5,
            effectRadius: 15
        },
        comb: {
            effectRadius: 50,
            influence: 0.3,  // 30% influence on hair direction
            visualLength: 15
        },
        shave: {
            effectRadius: 15,
            clearSize: 30
        }
    },

    // UI Settings
    ui: {
        hairZone: {
            strokeColor: 'rgba(32, 201, 151, 0.3)',
            lineWidth: 2,
            dashPattern: [5, 5]
        },
        invalidFeedback: {
            color: '#ff4444',
            lineWidth: 3,
            opacity: 0.8,
            duration: 500,
            blinkCount: 4,
            blinkInterval: 200
        },
        controls: {
            panelOpacity: 0.95
        }
    },

    // Audio Settings
    audio: {
        volume: 0.3,
        backgroundMusicVolume: 0.3
    },

    // Animation Settings
    animation: {
        fps: 60  // Using requestAnimationFrame, but good to document target
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameConfig;
}
