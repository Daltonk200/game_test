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
let hairStrands = []; // Store all hair strands for combing
let lastMouseX = 0;
let lastMouseY = 0;

// Function to draw hair zone guide (semi-circle)
function drawHairZoneGuide() {
    const centerX = 305;  // Avatar head center X
    const centerY = 220;  // Avatar head center Y
    const hairRadius = 90; // Maximum hair radius
    
    ctx.strokeStyle = 'rgba(32, 201, 151, 0.3)'; // Teal color with transparency
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]); // Dashed line
    
    ctx.beginPath();
    // Draw semi-circle: start from left (-π) to right (0), which is the top half
    ctx.arc(centerX, centerY, hairRadius, Math.PI, 2 * Math.PI);
    // Add a straight line across the bottom to close the semi-circle
    ctx.lineTo(centerX - hairRadius, centerY);
    ctx.stroke();
    
    ctx.setLineDash([]); // Reset line dash
}

// Function to clear hair zone guide
function clearHairZoneGuide() {
    // Clear the canvas and redraw all hair strands
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Redraw all hair strands
    for (let i = 0; i < hairStrands.length; i++) {
        const strand = hairStrands[i];
        drawHairStrand(strand.baseX, strand.baseY, strand.angle, strand.length, strand.color);
    }
}

// Function to change current tool
function setTool(newTool) {
    // Clear any existing guide when switching tools
    if (tool === 'addHair') {
        clearHairZoneGuide();
    }
    
    tool = newTool;
    console.log('Tool changed to:', tool);
    
    // Remove all cursor classes
    canvas.classList.remove('cursor-paint', 'cursor-comb', 'cursor-shave', 'cursor-addhair');
    
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
        case 'addHair':
            canvas.classList.add('cursor-addhair');
            // No longer show guide automatically
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
            
            // Store the strand in the array
            hairStrands.push({
                baseX: baseX,
                baseY: baseY,
                angle: strandAngle,
                length: length,
                color: "#8B4513"
            });
            
            // Draw the hair strand
            drawHairStrand(baseX, baseY, strandAngle, length, "#8B4513");
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
        
        // Store the strand in the array
        hairStrands.push({
            baseX: baseX,
            baseY: baseY,
            angle: strandAngle,
            length: length,
            color: "#8B4513"
        });
        
        drawHairStrand(baseX, baseY, strandAngle, length, "#8B4513");
    }
}

// Function to shave hair at a specific position
function shave(x, y) {
    ctx.clearRect(x - 15, y - 15, 30, 30);
}

// Function to check if position is within the hair zone (semi-circle)
function isInHairZone(x, y) {
    const centerX = 305;  // Avatar head center X
    const centerY = 220;  // Avatar head center Y
    const hairRadius = 90; // Maximum hair radius
    
    // Calculate distance from center
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    
    // Check if within radius AND in the top half (y <= centerY)
    return distance <= hairRadius && y <= centerY;
}

// Function to add new hair strands at a specific position
function addHair(x, y, color) {
    // Check if position is within the hair zone
    if (!isInHairZone(x, y)) {
        // Show visual feedback for invalid area
        showInvalidAreaFeedback(x, y);
        return; // Don't add hair outside the zone
    }
    
    // Draw 5 hair strands at the position
    for (let i = 0; i < 5; i++) {
        // Random angle (0 to 360 degrees)
        const angle = Math.random() * 2 * Math.PI;
        
        // Random length between 20 and 30 pixels
        const length = 20 + Math.random() * 10;
        
        // Store the strand in the array
        hairStrands.push({
            baseX: x,
            baseY: y,
            angle: angle,
            length: length,
            color: color
        });
        
        // Draw the hair strand
        drawHairStrand(x, y, angle, length, color);
    }
}

// Function to show blinking hair zone boundary when invalid placement is attempted
function showBlinkingHairZone() {
    let blinkCount = 0;
    const maxBlinks = 4; // Number of times to blink (4 blinks = 8 total draws)
    
    const blinkInterval = setInterval(() => {
        if (blinkCount % 2 === 0) {
            // Draw the circle (visible)
            drawHairZoneGuide();
        } else {
            // Clear and redraw hair (invisible circle)
            clearHairZoneGuide();
        }
        
        blinkCount++;
        
        // Stop blinking after max blinks
        if (blinkCount >= maxBlinks * 2) {
            clearInterval(blinkInterval);
            // Ensure we end with the circle hidden
            clearHairZoneGuide();
        }
    }, 200); // Blink every 200ms
}

// Function to show visual feedback for invalid hair placement
function showInvalidAreaFeedback(x, y) {
    // Show blinking hair zone boundary
    showBlinkingHairZone();
    
    // Also draw a red X at the attempted position
    ctx.strokeStyle = '#ff4444';
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.8;
    
    ctx.beginPath();
    // Draw X
    ctx.moveTo(x - 10, y - 10);
    ctx.lineTo(x + 10, y + 10);
    ctx.moveTo(x + 10, y - 10);
    ctx.lineTo(x - 10, y + 10);
    ctx.stroke();
    
    ctx.globalAlpha = 1.0; // Reset alpha
    
    // Remove the X after a short delay
    setTimeout(() => {
        // Clear the area around the X
        ctx.clearRect(x - 15, y - 15, 30, 30);
        
        // Redraw any hair strands that might have been in that area
        for (let i = 0; i < hairStrands.length; i++) {
            const strand = hairStrands[i];
            const distance = Math.sqrt(Math.pow(strand.baseX - x, 2) + Math.pow(strand.baseY - y, 2));
            if (distance <= 20) {
                drawHairStrand(strand.baseX, strand.baseY, strand.angle, strand.length, strand.color);
            }
        }
    }, 800); // Keep X visible a bit longer than the blinking
}

// Function to paint/recolor existing hair strands at a specific position
function paintHair(x, y, color) {
    let foundHair = false;
    
    // Look for existing hair strands within 30px of the cursor
    for (let i = 0; i < hairStrands.length; i++) {
        const strand = hairStrands[i];
        const distance = Math.sqrt(
            Math.pow(strand.baseX - x, 2) + Math.pow(strand.baseY - y, 2)
        );
        
        // If strand is within range, change its color
        if (distance <= 30) {
            strand.color = color;
            foundHair = true;
        }
    }
    
    // If we found hair to recolor, redraw the entire canvas
    if (foundHair) {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Redraw all hair strands with updated colors
        for (let i = 0; i < hairStrands.length; i++) {
            const strand = hairStrands[i];
            drawHairStrand(strand.baseX, strand.baseY, strand.angle, strand.length, strand.color);
        }
    }
}

// Function to comb hair strands dynamically
function combStrands(x, y, dx, dy) {
    // Calculate the combing direction
    const combAngle = Math.atan2(dy, dx);
    
    // Clear the canvas area around the comb position
    ctx.clearRect(x - 30, y - 30, 60, 60);
    
    // Loop through all hair strands
    for (let i = 0; i < hairStrands.length; i++) {
        const strand = hairStrands[i];
        
        // Check if strand is within 50px of comb position
        const distance = Math.sqrt(
            Math.pow(strand.baseX - x, 2) + Math.pow(strand.baseY - y, 2)
        );
        
        if (distance <= 50) {
            // Adjust the strand angle slightly toward the comb direction
            const angleDiff = combAngle - strand.angle;
            strand.angle += angleDiff * 0.3; // 30% influence
        }
        
        // Redraw the strand with potentially updated angle
        drawHairStrand(strand.baseX, strand.baseY, strand.angle, strand.length, strand.color);
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
            // Use the dedicated paintHair function to recolor existing hair
            const currentColor = colorPicker.value;
            paintHair(e.offsetX, e.offsetY, currentColor);
            break;
        case 'addHair':
            // Use the dedicated addHair function to add new hair strands
            const addColor = colorPicker.value;
            addHair(e.offsetX, e.offsetY, addColor);
            
            // Only play sound if hair was actually added (inside the zone)
            if (isInHairZone(e.offsetX, e.offsetY)) {
                if (audioElements.paintSound) {
                    audioElements.paintSound.currentTime = 0;
                    audioElements.paintSound.loop = true;
                    audioElements.paintSound.play();
                }
            }
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
            case 'addHair':
                const addColor = colorPicker.value;
                addHair(e.offsetX, e.offsetY, addColor);
                break;
            case 'comb':
                // Calculate mouse movement direction
                const dx = e.offsetX - lastMouseX;
                const dy = e.offsetY - lastMouseY;
                
                // Use dynamic strand combing if there's movement
                if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
                    combStrands(e.offsetX, e.offsetY, dx, dy);
                } else {
                    comb(e.offsetX, e.offsetY);
                }
                break;
            case 'shave':
                shave(e.offsetX, e.offsetY);
                break;
        }
    }
    
    // Update last mouse position
    lastMouseX = e.offsetX;
    lastMouseY = e.offsetY;
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
    document.getElementById('addHairBtn').addEventListener('click', () => setTool('addHair'));
    document.getElementById('screenshotBtn').addEventListener('click', takeScreenshot);
});
