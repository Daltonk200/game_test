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
- Screenshot Tool: Capture and download game state
- Mouse interaction handling (mousedown, mousemove, mouseup)
- Tool switching with visual feedback
- Invalid area detection and feedback
- Integration with audio system for tool sounds
- Custom cursor styles for each tool
```

### 9. UI Controls & User Interface

```
Build UI control system (ui-controls.js) for:
- Button event handling and state management
- Color picker integration
- Tool selection with visual active states
- Sound toggle functionality
- Character switching controls
- Screenshot functionality with visual feedback
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

### 12. Advanced Features Integration & Debugging

```
Integrate these advanced features across the system:
- Glossy hair rendering with realistic shine and shadow effects
- Multi-layer hair depth with proper opacity and thickness variation
- Ultra-smooth bezier curve rendering for professional hair appearance
- Complex volume effects with overlapping density zones
- Character-specific hair physics and styling
- Professional UI with smooth animations and micro-interactions
- Advanced audio system with contextual sound design
- Screenshot functionality with color picker hidden during capture
- Responsive design for different screen sizes

CRITICAL DEBUGGING FIXES:
1. Screenshot Color Picker Issue:
   - Hide color picker with visibility: hidden during screenshot
   - Restore visibility after screenshot completes
   - Apply to both html2canvas and manual methods

2. Hair Layer Rendering:
   - Sort strands by layerDepth (back to front: 0.4, 0.7, 1.0)
   - Apply opacity based on layer (back layers more transparent)
   - Use volumeZones for realistic density variation

3. Character-Specific Hair Properties:
   - Male: straight hair, brown #8B4513, curliness: 0
   - Female: curly hair, auburn #D2691E, curliness: 0.3, glossiness: 0.6
   - Pass characterType to generateHair() and addHairAtPosition()

4. Audio Autoplay Handling:
   - Start audio only after user interaction
   - Implement separate background music and tool sound controls
   - Handle audio loading errors gracefully

5. Performance Optimization:
   - Limit hair strands to reasonable count (1500-2500)
   - Use requestAnimationFrame for physics animation
   - Clean up falling hair particles when off-screen
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

## � Debugging & Development Tips

### **Common Issues & Solutions:**

#### **Screenshot Problems:**
```
Issue: Color picker showing hex values in screenshots
Solution: Hide color picker during screenshot capture
- Use visibility: hidden instead of display: none
- Restore visibility after screenshot completes
- Apply to both html2canvas and manual screenshot methods
```

#### **Hair Rendering Issues:**
```
Issue: Hair not appearing or looking weird
Solution: Check layer depth and wave configuration
- Ensure layerDepth values are between 0-1
- Verify character hairStyle properties exist
- Check canvas context and drawing order
```

#### **Audio Problems:**
```
Issue: Sounds not playing or background music stuck
Solution: Handle browser autoplay restrictions
- Add user interaction before playing audio
- Check audio file paths and formats
- Implement proper error handling for audio loading
```

#### **Performance Issues:**
```
Issue: Game running slowly or lagging
Solution: Optimize hair rendering and physics
- Limit number of hair strands (max 1000-2000)
- Use requestAnimationFrame for smooth animations  
- Clean up falling hair particles regularly
```

### **Development Workflow:**
1. **Build incrementally** - Test each component as you add it
2. **Use browser dev tools** - Check console for errors
3. **Test on different browsers** - Ensure compatibility
4. **Validate file paths** - Check all asset references
5. **Monitor performance** - Watch for memory leaks

### **Debug Console Commands:**
```javascript
// Check game state
console.log(hairSalonGame.getGameState());

// Check hair count  
console.log(hairSalonGame.hairSystem.getHairCount());

// Test audio system
hairSalonGame.audioManager.playBackgroundMusic();

// Check character info
console.log(hairSalonGame.characterManager.getCurrentCharacter());
```

---

## 🚀 Step-by-Step Build Process

### **Phase 1: Foundation (Prompts 1-3)**
1. **HTML Structure** → Test basic layout loads
2. **CSS Styling** → Verify visual appearance  
3. **Configuration** → Check config object exists

### **Phase 2: Core Systems (Prompts 4-7)**
4. **Hair System** → Test hair generation works
5. **Physics Engine** → Verify falling hair animation
6. **Audio Manager** → Check sounds play correctly
7. **Character Manager** → Test character switching

### **Phase 3: Interaction (Prompts 8-10)**
8. **Tools System** → Test each tool individually
9. **UI Controls** → Verify all buttons work
10. **Game Engine** → Test complete integration

### **Phase 4: Polish (Prompts 11-12)**
11. **Utilities** → Add helper functions
12. **Advanced Features** → Final integration and optimization

### **Testing Checklist:**
- [ ] Page loads without errors
- [ ] All buttons respond to clicks
- [ ] Hair can be painted, cut, combed, and added
- [ ] Character switching works with different hair styles
- [ ] Audio plays (background music + tool sounds)
- [ ] Screenshot captures full game screen
- [ ] Color picker works without showing hex values
- [ ] Game works in different browsers
- [ ] No console errors during normal gameplay
- [ ] Performance is smooth (60fps)

---

## 🎯 Exact Project Structure

This README will help you build **exactly** this hair salon game:

```
hair-salon-game/
├── index.html                 # Main game page with all UI elements
├── style.css                  # Complete styling (395 lines)
├── README.md                  # This comprehensive guide
├── js/
│   ├── config.js             # Game config with character hair styles
│   ├── utils.js              # Helper functions and utilities  
│   ├── hair-system.js        # Advanced hair rendering with layers
│   ├── physics.js            # Falling hair animation system
│   ├── audio-manager.js      # Background music + tool sounds
│   ├── character-manager.js  # Male/female character switching
│   ├── tools.js              # Paint, cut, comb, add hair tools
│   ├── ui-controls.js        # Button handling + screenshot
│   └── game.js               # Main game engine coordination
└── assets/
    ├── avatar.png            # Male character image
    ├── avatar_female.png     # Female character image
    ├── background.png        # Salon background
    ├── table.png            # Salon table/furniture
    ├── *.mp3                # Audio files for effects
    └── background-music.mp3  # Looping background music
```

## 🎨 Final Result Features

The completed game will have **exactly** these features:
- **Glossy hair rendering** with highlights, shadows, and smooth curves
- **Male character**: Straight brown hair, moderate volume
- **Female character**: Curly auburn hair, high volume and shine  
- **4 tools**: Paint (change color), Cut (falling physics), Comb (adjust angles), Add Hair
- **Screenshot system** that captures full screen without color picker hex values
- **Audio system** with separate background music and tool sound controls
- **Professional UI** with gradient buttons, hover effects, and smooth animations
- **Character switching** with instant hair style changes
- **Keyboard shortcuts** for all major functions
- **Responsive design** that works on different screen sizes

Perfect for showcasing advanced HTML5 Canvas, JavaScript ES6+, CSS3, and game development skills!
