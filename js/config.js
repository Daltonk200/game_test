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
    },

    // Character Settings
    characters: {
        male: {
            name: 'Male',
            image: 'assets/avatar.png',
            hairCenter: { x: 305, y: 220 },
            hairRadius: 90,
            hairStyle: {
                defaultColor: "#8B4513", // Brown
                strandLength: { min: 20, max: 30 },
                generationRadius: { step: 3, maxRadius: 70 },
                strandsPerCircle: { base: 16, multiplier: 2.5 },
                centerFillStrands: 24,
                curliness: 0, // Straight hair
                volumeMultiplier: 1.0,
                wavePattern: 'straight', // straight, wavy, curly
                waveAmplitude: 0, // How pronounced the waves are
                waveFrequency: 0, // How often waves occur
                layering: 1.0 // Hair layering effect
            }
        },
        female: {
            name: 'Female',
            image: 'assets/avatar_female.png',
            hairCenter: { x: 305, y: 210 },
            hairRadius: 85,
            hairStyle: {
                defaultColor: "#D2691E", // Lighter brown/auburn
                strandLength: { min: 25, max: 40 }, // Longer hair
                generationRadius: { step: 3, maxRadius: 75 }, // Slightly wider
                strandsPerCircle: { base: 20, multiplier: 3.0 }, // More density
                centerFillStrands: 30, // More center strands
                curliness: 0.3, // More pronounced wave
                volumeMultiplier: 1.2, // More volume
                wavePattern: 'curly', // straight, wavy, curly
                waveAmplitude: 6, // How pronounced the waves are (pixels)
                waveFrequency: 0.8, // How often waves occur along strand
                layering: 1.3 // More layered look
            }
        },
        default: 'male'
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameConfig;
}
