/**
 * Hair Salon Game Engine
 * Main game coordinator that initializes and manages all game systems
 */

class HairSalonGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.isInitialized = false;
        
        // Game systems
        this.hairSystem = null;
        this.physicsEngine = null;
        this.audioManager = null;
        this.toolManager = null;
        this.uiController = null;
        
        console.log('Hair Salon Game created');
    }

    /**
     * Initialize the game
     */
    async initialize() {
        try {
            console.log('Initializing Hair Salon Game...');
            
            // Initialize canvas and context
            this.initializeCanvas();
            
            // Initialize all game systems in the correct order
            await this.initializeSystems();
            
            // Set initial game state
            this.setupInitialState();
            
            // Generate initial hair
            this.generateInitialHair();
            
            this.isInitialized = true;
            console.log('Hair Salon Game initialized successfully!');
            
        } catch (error) {
            console.error('Failed to initialize Hair Salon Game:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Initialize canvas and 2D context
     */
    initializeCanvas() {
        this.canvas = document.getElementById('hairCanvas');
        if (!this.canvas) {
            throw new Error('Canvas element not found');
        }
        
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            throw new Error('2D context not available');
        }
        
        // Set canvas size
        this.canvas.width = GameConfig.canvas.width;
        this.canvas.height = GameConfig.canvas.height;
        
        console.log(`Canvas initialized: ${this.canvas.width}x${this.canvas.height}`);
    }

    /**
     * Initialize all game systems
     */
    async initializeSystems() {
        // Initialize Audio Manager first (independent)
        this.audioManager = new AudioManager();
        this.audioManager.initialize();
        
        // Initialize Hair System
        this.hairSystem = new HairSystem(this.canvas, this.ctx);
        
        // Initialize Physics Engine
        this.physicsEngine = new PhysicsEngine(this.canvas, this.ctx);
        
        // Initialize Tool Manager (depends on other systems)
        this.toolManager = new ToolManager(
            this.canvas, 
            this.ctx, 
            this.hairSystem, 
            this.physicsEngine, 
            this.audioManager
        );
        
        // Initialize UI Controller (depends on tool manager and audio manager)
        this.uiController = new UIController(this.toolManager, this.audioManager);
        
        console.log('All game systems initialized');
    }

    /**
     * Set up initial game state
     */
    setupInitialState() {
        // Set initial tool
        this.toolManager.setTool('paint');
        
        // Update UI to reflect initial state
        this.uiController.updateButtonStates('paint');
        
        console.log('Initial game state configured');
    }

    /**
     * Generate initial hair on the avatar
     */
    generateInitialHair() {
        console.log('Generating initial hair...');
        this.hairSystem.generateHair();
        console.log(`Initial hair generated: ${this.hairSystem.getHairCount()} strands`);
    }

    /**
     * Handle initialization errors
     * @param {Error} error - The initialization error
     */
    handleInitializationError(error) {
        // Show user-friendly error message
        const errorMessage = document.createElement('div');
        errorMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ff4444;
            color: white;
            padding: 20px;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            z-index: 9999;
            text-align: center;
        `;
        errorMessage.innerHTML = `
            <h3>Game Initialization Failed</h3>
            <p>${error.message}</p>
            <p><small>Please refresh the page to try again.</small></p>
        `;
        document.body.appendChild(errorMessage);
    }

    /**
     * Get current game state information
     * @returns {Object} Game state object
     */
    getGameState() {
        if (!this.isInitialized) {
            return { initialized: false };
        }
        
        return {
            initialized: true,
            hairCount: this.hairSystem.getHairCount(),
            fallingHairCount: this.physicsEngine.getFallingHairCount(),
            currentTool: this.toolManager.getCurrentTool(),
            audioStatus: this.audioManager.getAudioStatus(),
            uiState: this.uiController.getUIState()
        };
    }

    /**
     * Update game state (called periodically if needed)
     */
    update() {
        if (!this.isInitialized) return;
        
        // Get current game state
        const gameState = this.getGameState();
        
        // Update UI with current state
        this.uiController.updateUI(gameState);
        
        // Optional: Add any periodic game logic here
    }

    /**
     * Pause the game
     */
    pause() {
        if (!this.isInitialized) return;
        
        console.log('Game paused');
        this.audioManager.stopAllToolSounds();
        this.audioManager.stopBackgroundMusic();
        this.uiController.setLoadingState(true);
    }

    /**
     * Resume the game
     */
    resume() {
        if (!this.isInitialized) return;
        
        console.log('Game resumed');
        this.audioManager.playBackgroundMusic();
        this.uiController.setLoadingState(false);
    }

    /**
     * Reset the game to initial state
     */
    reset() {
        if (!this.isInitialized) return;
        
        console.log('Resetting game...');
        
        // Stop all sounds and animations
        this.audioManager.stopAllToolSounds();
        this.physicsEngine.clearAllFallingHair();
        
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Reset hair system
        this.hairSystem = new HairSystem(this.canvas, this.ctx);
        this.generateInitialHair();
        
        // Reset tool to paint
        this.toolManager.setTool('paint');
        this.uiController.updateButtonStates('paint');
        
        console.log('Game reset complete');
    }

    /**
     * Clean up resources and event listeners
     */
    cleanup() {
        console.log('Cleaning up game resources...');
        
        if (this.audioManager) {
            this.audioManager.cleanup();
        }
        
        if (this.physicsEngine) {
            this.physicsEngine.clearAllFallingHair();
        }
        
        if (this.uiController) {
            this.uiController.cleanup();
        }
        
        // Clear canvas
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        
        this.isInitialized = false;
        console.log('Game cleanup complete');
    }

    /**
     * Get game version and information
     * @returns {Object} Game information
     */
    getGameInfo() {
        return {
            name: 'Hair Salon Game',
            version: '2.0.0',
            description: 'Interactive hair styling game with physics',
            features: [
                'Hair painting and coloring',
                'Hair addition with zone restrictions',
                'Dynamic hair combing',
                'Physics-based hair shaving',
                'Audio feedback',
                'Screenshot functionality'
            ],
            systems: {
                hairSystem: !!this.hairSystem,
                physicsEngine: !!this.physicsEngine,
                audioManager: !!this.audioManager,
                toolManager: !!this.toolManager,
                uiController: !!this.uiController
            }
        };
    }
}

/**
 * Global game instance and initialization
 */
let hairSalonGame = null;

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM loaded, starting Hair Salon Game...');
    
    try {
        // Create and initialize game
        hairSalonGame = new HairSalonGame();
        await hairSalonGame.initialize();
        
        // Add global reference for debugging
        window.hairSalonGame = hairSalonGame;
        
        // Log game info
        console.log('Game Info:', hairSalonGame.getGameInfo());
        
    } catch (error) {
        console.error('Failed to start Hair Salon Game:', error);
    }
});

// Handle page unload
window.addEventListener('beforeunload', function() {
    if (hairSalonGame) {
        hairSalonGame.cleanup();
    }
});

// Export for use in other modules or testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HairSalonGame;
}
