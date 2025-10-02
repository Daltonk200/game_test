// Hair Salon Script
console.log('Welcome to the Hair Salon!');

// Get canvas and 2D context
const canvas = document.getElementById('hairCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size to match container
canvas.width = 600;
canvas.height = 600;

// Global variables for current tool and painting state
let tool = 'paint';
let isMouseDown = false;
let colorPicker;
let audioElements = {};

// Function to change current tool
function setTool(newTool) {
    tool = newTool;
    console.log('Tool changed to:', tool);
    
    // Remove all cursor classes
    canvas.classList.remove('cursor-paint', 'cursor-comb', 'cursor-shave');
    
    // Add appropriate cursor class
    switch(tool) {
        case 'paint':
            canvas.classList.add('cursor-paint');
            break;
        case 'comb':
            canvas.classList.add('cursor-comb');
            break;
        case 'shave':
            canvas.classList.add('cursor-shave');
            break;
    }
}

// Function to draw a hair strand
function drawHairStrand(x, y, angle, length, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    // Calculate end point using angle and length
    const endX = x + Math.cos(angle) * length;
    const endY = y + Math.sin(angle) * length;
    
    ctx.lineTo(endX, endY);
    ctx.stroke();
}

// Function to generate hair around the avatar's head
function generateHair() {
    const centerX = 305;  // Avatar head center X
    const centerY = 220;  // Avatar head center Y
    const maxRadius = 70; // Maximum hair radius (reduced by half)
    
    // Create structured hair in concentric circles for more control
    for (let radius = 0; radius <= maxRadius; radius += 3) {
        // Number of strands for this circle (even more strands for compact density)
        const strandsInCircle = Math.max(16, Math.floor(radius * 2.5));
        
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
            const length = 25;
            
            // Draw the hair strand
            drawHairStrand(baseX, baseY, strandAngle, length, "#000");
        }
    }
    
    // Add very dense center fill with controlled placement (semi-circle)
    for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI - Math.PI; // -180° to 0° (top half only)
        const distance = 1 + (Math.random() * 4);
        
        const baseX = centerX + Math.cos(angle) * distance;
        const baseY = centerY + Math.sin(angle) * distance;
        
        const strandAngle = angle + (Math.random() - 0.5) * 0.4;
        const length = 25;
        
        drawHairStrand(baseX, baseY, strandAngle, length, "#000");
    }
}

// Function to shave hair at a specific position
function shave(x, y) {
    ctx.clearRect(x - 15, y - 15, 30, 30);
}

// Function to paint hair at a specific position
function paintHair(x, y, color) {
    // Draw 5 hair strands at the position
    for (let i = 0; i < 5; i++) {
        // Random angle (0 to 360 degrees)
        const angle = Math.random() * 2 * Math.PI;
        
        // Random length between 20 and 30 pixels
        const length = 20 + Math.random() * 10;
        
        // Draw the hair strand
        drawHairStrand(x, y, angle, length, color);
    }
}

// Function to comb hair at a specific position
function comb(x, y) {
    ctx.strokeStyle = "rgba(0,0,0,0.1)";
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(x - 15, y);
    ctx.lineTo(x + 15, y);
    ctx.stroke();
}

// Get mouse position relative to canvas
function getMousePos(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

// Paint function for continuous painting
function paint(x, y) {
    const currentColor = colorPicker.value;
    
    switch(tool) {
        case 'paint':
            // Draw a colored circle at position
            ctx.fillStyle = currentColor;
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, 2 * Math.PI);
            ctx.fill();
            break;
            
        case 'shave':
            // Erase a square at position
            ctx.clearRect(x - 10, y - 10, 20, 20);
            break;
            
        case 'comb':
            // Draw a faint line to simulate combing
            ctx.strokeStyle = currentColor;
            ctx.globalAlpha = 0.3;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x - 15, y);
            ctx.lineTo(x + 15, y);
            ctx.stroke();
            ctx.globalAlpha = 1.0; // Reset alpha
            break;
    }
}

// Mouse down event - start painting
canvas.addEventListener('mousedown', function(e) {
    isMouseDown = true;
    const pos = getMousePos(canvas, e);
    
    // Play appropriate sound for the tool (loop it)
    switch(tool) {
        case 'paint':
            if (audioElements.paintSound) {
                audioElements.paintSound.currentTime = 0;
                audioElements.paintSound.loop = true;
                audioElements.paintSound.play();
            }
            // Use the dedicated paintHair function
            const currentColor = colorPicker.value;
            paintHair(e.offsetX, e.offsetY, currentColor);
            break;
        case 'comb':
            if (audioElements.combSound) {
                audioElements.combSound.currentTime = 0;
                audioElements.combSound.loop = true;
                audioElements.combSound.play();
            }
            comb(e.offsetX, e.offsetY);
            break;
        case 'shave':
            if (audioElements.shaveSound) {
                audioElements.shaveSound.currentTime = 0;
                audioElements.shaveSound.loop = true;
                audioElements.shaveSound.play();
            }
            // Use the dedicated shave function
            shave(e.offsetX, e.offsetY);
            break;
    }
});

// Mouse move event - continue painting if mouse is down
canvas.addEventListener('mousemove', function(e) {
    if (isMouseDown) {
        const pos = getMousePos(canvas, e);
        
        switch(tool) {
            case 'paint':
                const currentColor = colorPicker.value;
                paintHair(e.offsetX, e.offsetY, currentColor);
                break;
            case 'comb':
                comb(e.offsetX, e.offsetY);
                break;
            case 'shave':
                shave(e.offsetX, e.offsetY);
                break;
        }
    }
});

// Function to stop all tool sounds
function stopAllToolSounds() {
    if (audioElements.paintSound) {
        audioElements.paintSound.pause();
        audioElements.paintSound.loop = false;
    }
    if (audioElements.combSound) {
        audioElements.combSound.pause();
        audioElements.combSound.loop = false;
    }
    if (audioElements.shaveSound) {
        audioElements.shaveSound.pause();
        audioElements.shaveSound.loop = false;
    }
}

// Mouse up event - stop painting
canvas.addEventListener('mouseup', function(e) {
    isMouseDown = false;
    stopAllToolSounds();
});

// Mouse leave event - stop painting when cursor leaves canvas
canvas.addEventListener('mouseleave', function(e) {
    isMouseDown = false;
    stopAllToolSounds();
});

// Function to take screenshot
function takeScreenshot() {
    // Create a temporary canvas with the same size as the main canvas
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');

    // Draw background image
    const bgImg = document.querySelector('.background-image');
    if (bgImg && bgImg.complete) {
        tempCtx.drawImage(bgImg, 0, 0, tempCanvas.width, tempCanvas.height);
    }

    // Draw table image
    const tableImg = document.querySelector('.table-image');
    if (tableImg && tableImg.complete) {
        const tableWidth = 320;
        const tableHeight = (tableImg.naturalHeight / tableImg.naturalWidth) * tableWidth;
        tempCtx.drawImage(tableImg, (tempCanvas.width - tableWidth) / 2, tempCanvas.height - tableHeight - 4, tableWidth, tableHeight);
    }

    // Draw avatar image
    const avatarImg = document.querySelector('.avatar-image');
    if (avatarImg && avatarImg.complete) {
        const avatarWidth = 680;
        const avatarHeight = (avatarImg.naturalHeight / avatarImg.naturalWidth) * avatarWidth;
        tempCtx.drawImage(avatarImg, (tempCanvas.width - avatarWidth) / 2, tempCanvas.height - avatarHeight - 120, avatarWidth, avatarHeight);
    }

    // Draw the hair canvas on top
    tempCtx.drawImage(canvas, 0, 0);

    // Export as PNG and trigger download
    const dataURL = tempCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'hair-salon-screenshot.png';
    link.href = dataURL;
    link.click();
}

// Function to generate initial hair (removed - using generateHair() instead)
function generateInitialHair() {
    // This function is now empty - hair generation handled by generateHair()
}

// Connect buttons to functions
document.addEventListener('DOMContentLoaded', function() {
    // Initialize color picker reference
    colorPicker = document.getElementById('hairColor');
    
    // Initialize audio elements
    audioElements.paintSound = document.getElementById('paintSound');
    audioElements.combSound = document.getElementById('combSound');
    audioElements.shaveSound = document.getElementById('shaveSound');
    audioElements.backgroundMusic = document.getElementById('backgroundMusic');
    
    // Set audio volume
    Object.values(audioElements).forEach(audio => {
        if (audio) {
            audio.volume = 0.3; // Set volume to 30%
        }
    });
    
    // Start background music (user interaction required first)
    document.addEventListener('click', function startMusic() {
        if (audioElements.backgroundMusic) {
            audioElements.backgroundMusic.play().catch(e => {
                console.log('Background music play failed:', e);
            });
        }
        // Remove this listener after first click
        document.removeEventListener('click', startMusic);
    }, { once: true });
    
    // Set initial cursor for paint tool
    setTool('paint');
    
    // Generate initial hair on page load
    generateInitialHair();
    
    // Generate hair strands
    generateHair();
    
    // Connect tool buttons
    document.getElementById('shaveBtn').addEventListener('click', () => setTool('shave'));
    document.getElementById('combBtn').addEventListener('click', () => setTool('comb'));
    document.getElementById('paintBtn').addEventListener('click', () => setTool('paint'));
    document.getElementById('screenshotBtn').addEventListener('click', takeScreenshot);
});
