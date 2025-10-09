# 🎨 Hair Salon Game - AI Development Guide

A sophisticated interactive hair styling game with advanced rendering, physics, and character switching capabilities.

## 🚀 Project Overview

This is a browser-based hair salon game where users can style virtual characters' hair using various tools. The game features advanced hair rendering with glossy effects, layered textures, smooth curves, and realistic physics.

## ✨ Key Features

- **Interactive Hair Styling**: Paint, cut, comb, and add hair with realistic tools
- **Character Switching**: Switch between male and female avatars with unique hair styles
- **Advanced Hair Rendering**: Glossy shading, layered depth, smooth bezier curves, and volume effects
- **Physics Engine**: Realistic falling hair animation when cutting
- **Audio System**: Background music and tool-specific sound effects
- **Professional UI**: Modern, salon-themed interface with smooth animations

## 🏗️ Project Architecture

The project uses a modular JavaScript architecture with the following structure:

```
├── index.html                 # Main game page
├── style.css                  # Complete styling and animations
├── js/
│   ├── config.js             # Game configuration and character settings
│   ├── utils.js              # Utility functions
│   ├── hair-system.js        # Advanced hair rendering and management
│   ├── physics.js            # Hair physics and falling animations
│   ├── audio-manager.js      # Sound system management
│   ├── character-manager.js  # Character switching and management
│   ├── tools.js              # Tool system (paint, cut, comb, add hair)
│   ├── ui-controls.js        # UI interaction handling
│   └── game.js               # Main game engine and initialization
└── assets/
    ├── avatar.png            # Male character avatar
    ├── avatar_female.png     # Female character avatar
    ├── background.png        # Game background
    ├── table.png            # Salon table
    └── *.mp3                # Audio files for background music and effects
```

---

## 🤖 AI Development Prompts

Use these prompts with your AI assistant to build each component of the game:

### 1. Project Setup & HTML Structure

```
Create an HTML file for a hair salon game with the following requirements:
- Canvas element (600x600px) for hair rendering
- Game container with layered images (background, table, avatar)
- Control panel with tool buttons (paint, comb, shave, add hair, screenshot)
- Sound toggle button in top left
- Character selector with male/female toggle
- Color picker for hair colors
- Professional salon-themed layout
- Use semantic HTML5 elements
- Include proper meta tags and viewport settings
```

### 2. CSS Styling & Animations

```
Create comprehensive CSS styling for a hair salon game with these features:
- Modern, professional salon aesthetic
- Gradient backgrounds and smooth animations
- Tool buttons with hover effects and active states
- Character-specific avatar positioning (.avatar-image.male and .avatar-image.female)
- Sound toggle button with muted state styling
- Character selector with color-coded themes (blue for male, pink for female)
- Custom cursor styles for different tools (paint, comb, shave, add hair)
- Responsive design elements
- Smooth transitions and micro-animations
- Glass morphism effects for panels
```

### 3. Game Configuration System

```
Create a comprehensive game configuration system (config.js) with:
- Canvas settings (width, height)
- Character definitions with hair styling properties:
  - Male: straight hair, brown color, basic volume
  - Female: curly hair, auburn color, high volume with glossy effects
- Hair rendering settings (length ranges, density, wave patterns)
- Physics settings for falling hair
- Tool configurations (brush sizes, effect radii)
- Audio settings (volume levels, file paths)
- UI settings (colors, animations, feedback)
- Advanced hair texture properties:
  - Glossiness levels and highlight colors
  - Layer depths for 3D volume effect
  - Wave patterns (straight, wavy, curly)
  - Volume variation settings
```

### 4. Advanced Hair Rendering System

```
Create a sophisticated hair rendering system (hair-system.js) with these advanced features:
- Glossy shading with highlights and shadows
- Multi-layer rendering (3 depth layers) for volume
- Smooth bezier curve rendering for natural hair flow
- Character-specific hair textures:
  - Straight hair for male character
  - Curly hair with complex wave patterns for female
- Volume zones with overlapping density areas
- Hair strand properties: position, angle, length, color, wave config, layer depth
- Methods for: generating hair, drawing strands, adding hair, redrawing with proper layer sorting
- Support for wavy and curly patterns using sine wave mathematics
- Realistic hair tapering and natural randomization
```

### 5. Physics Engine for Falling Hair

```
Build a physics engine (physics.js) for realistic falling hair animation:
- Falling hair particles with gravity, rotation, and horizontal drift
- Collision detection with canvas boundaries
- Particle cleanup system
- Smooth animation using requestAnimationFrame
- Realistic physics properties:
  - Variable fall speeds (2-4 pixels per frame)
  - Random rotation (-0.1 to 0.1 radians per frame)
  - Horizontal drift for natural movement
  - Opacity effects for falling hair
- Integration with hair system for seamless cutting effects
```

### 6. Audio Management System

```
Create an audio management system (audio-manager.js) with:
- Background music control (play, pause, volume)
- Tool-specific sound effects (cutting, painting, combing)
- Separate mute controls for background music vs sound effects
- Audio loading and error handling
- Volume controls and fade effects
- Sound effect queuing and overlapping management
- Integration with UI controls for mute/unmute functionality
```

### 7. Character Management System

```
Build a character management system (character-manager.js) for:
- Switching between male and female characters
- Character-specific avatar image loading
- Hair regeneration with character-specific styling
- CSS class management for character positioning
- UI updates (labels, button states, styling themes)
- Character data management and preloading
- Smooth transition animations between characters
- Integration with hair system for style-specific generation
```

### 8. Tool System & Interactions

```
Create a comprehensive tool system (tools.js) with these tools:
- Paint Tool: Change hair color with brush effect
- Comb Tool: Adjust hair strand angles with directional influence
- Shave Tool: Remove hair with physics-based falling animation
- Add Hair Tool: Add new strands with character-specific styling
- Mouse interaction handling (mousedown, mousemove, mouseup)
- Tool switching with visual feedback
- Invalid area detection and feedback
- Integration with audio system for tool sounds
- Custom cursor styles for each tool

Note: Screenshot functionality is implemented separately in ui-controls.js, not as a tool in the tools system.
```

### 9. UI Controls & User Interface

```
Build UI control system (ui-controls.js) for:
- Button event handling and state management
- Color picker integration
- Tool selection with visual active states
- Sound toggle functionality with mute/unmute states
- Character switching controls
- Screenshot functionality with multiple capture methods:
  * Manual canvas composition (creates temporary canvas, draws background image, table image, avatar image, then hair canvas)
  * HTML2Canvas library integration (if available as fallback)
  * Automatic file download with timestamped filenames
  * Visual feedback (pulse animation on success, shake on failure)
- Keyboard shortcuts (P=paint, C=comb, S=shave, A=add hair, Space=screenshot, M=mute, X=character switch)
- Loading states and error handling
- Responsive button layouts
- Accessibility features (keyboard navigation, screen reader support)
- Visual feedback animations (pulse, shake, glow effects)
```

### 10. Main Game Engine

```
Create the main game engine (game.js) that:
- Initializes all game systems in correct order
- Manages canvas setup and context
- Coordinates between all systems (hair, physics, audio, UI, characters)
- Handles game state management
- Provides error handling and recovery
- Manages game lifecycle (initialize, update, pause, reset, cleanup)
- Sets up initial game state and generates starting hair
- Provides debugging and development tools
- Handles browser compatibility and performance optimization
```

### 11. Utility Functions

```
Create utility functions (utils.js) for:
- Mathematical helpers (distance calculation, random number generation)
- Hair zone validation (check if coordinates are in valid styling area)
- Canvas utilities (coordinate conversion, boundary checking)
- Color manipulation functions
- Animation easing functions
- DOM manipulation helpers
- Event handling utilities
- Performance optimization helpers
```

### 12. Advanced Features Integration

```
Integrate these advanced features across the system:
- Glossy hair rendering with realistic shine and shadow effects
- Multi-layer hair depth with proper opacity and thickness variation
- Ultra-smooth bezier curve rendering for professional hair appearance
- Complex volume effects with overlapping density zones
- Character-specific hair physics and styling
- Professional UI with smooth animations and micro-interactions
- Advanced audio system with contextual sound design
- Screenshot functionality with layered canvas composition:
  * Creates temporary canvas matching hair canvas dimensions
  * Draws background image first (full canvas size)
  * Draws table image with calculated positioning (320px width, proportional height, centered horizontally, bottom offset)
  * Draws avatar image with calculated dimensions (680px width, proportional height, centered horizontally, specific vertical offset)
  * Overlays hair canvas on top
  * Exports as PNG with timestamped filename and triggers automatic download
- Responsive design for different screen sizes
```

---

## 🎯 Development Guidelines

### Code Quality Standards
- Use modern ES6+ JavaScript features
- Implement modular architecture with clear separation of concerns
- Add comprehensive error handling and validation
- Include detailed comments and documentation
- Follow consistent naming conventions
- Optimize for performance and memory usage

### User Experience Focus
- Smooth, responsive interactions
- Visual feedback for all user actions
- Professional salon aesthetic
- Intuitive control layout
- Accessibility considerations

### Technical Requirements
- Browser compatibility (modern browsers)
- Canvas-based rendering for smooth graphics
- Modular JavaScript architecture
- CSS3 animations and transitions
- HTML5 audio integration
- Local storage for settings persistence

---

## 🚀 Getting Started

To build this project with an AI assistant:

1. **Start with the HTML structure** using prompt #1
2. **Add CSS styling** using prompt #2  
3. **Build the configuration system** using prompt #3
4. **Implement core systems** using prompts #4-11 in order
5. **Integrate advanced features** using prompt #12
6. **Test and refine** each component as you build

Each prompt is designed to be self-contained but works together to create a cohesive, professional hair salon game.

## 🎨 Final Result

The completed game will feature:
- Beautiful, glossy hair rendering with realistic textures
- Smooth character switching with unique hair styles
- Professional salon-themed interface
- Advanced physics and audio systems
- Responsive, accessible design
- Screenshot and sharing capabilities

Perfect for showcasing advanced web development skills and creating an engaging user experience!

---

## 📸 Screenshot System Implementation Details

Based on the current codebase, the screenshot functionality is implemented with the following specific approach:

### Core Implementation (ui-controls.js)

```javascript
takeScreenshot() {
    // 1. Get the hair canvas element
    const canvas = document.getElementById('hairCanvas');
    
    // 2. Create temporary canvas with same dimensions as hair canvas
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;  // 600px
    tempCanvas.height = canvas.height; // 600px
    
    // 3. Draw layers in order:
    //    a) Background image (full canvas size)
    //    b) Table image (320px width, proportional height, centered, bottom-aligned with 4px offset)
    //    c) Avatar image (680px width, proportional height, centered, 120px from bottom)
    //    d) Hair canvas (overlay on top)
    
    // 4. Export as PNG with timestamped filename
    const dataURL = tempCanvas.toDataURL('image/png');
    const filename = `hair-salon-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
    
    // 5. Trigger automatic download
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataURL;
    link.click();
}
```

### Key Features:
- **Layer Composition**: Manually composites all visual elements in correct z-order
- **Precise Positioning**: Each image layer positioned with specific calculations for natural appearance  
- **Auto-Download**: Creates temporary download link and triggers click for seamless user experience
- **Error Handling**: Try-catch with visual feedback (pulse animation on success, shake on failure)
- **Keyboard Support**: Spacebar hotkey for quick screenshot capture
- **Timestamped Files**: Automatic filename generation with ISO timestamp format

This implementation ensures the screenshot captures the complete game state including background, furniture, character, and styled hair exactly as displayed to the user.
