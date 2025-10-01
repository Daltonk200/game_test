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
            break;
        case 'comb':
            if (audioElements.combSound) {
                audioElements.combSound.currentTime = 0;
                audioElements.combSound.loop = true;
                audioElements.combSound.play();
            }
            break;
        case 'shave':
            if (audioElements.shaveSound) {
                audioElements.shaveSound.currentTime = 0;
                audioElements.shaveSound.loop = true;
                audioElements.shaveSound.play();
            }
            break;
    }
    
    paint(pos.x, pos.y);
});

// Mouse move event - continue painting if mouse is down
canvas.addEventListener('mousemove', function(e) {
    if (isMouseDown) {
        const pos = getMousePos(canvas, e);
        paint(pos.x, pos.y);
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
    // Create a temporary canvas to combine all layers
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = 600;
    tempCanvas.height = 600;
    
    // Draw background image if it exists
    const bgImg = document.querySelector('.background-image');
    if (bgImg.complete) {
        tempCtx.drawImage(bgImg, 0, 0, 600, 600);
    }
    
    // Draw table image if it exists
    const tableImg = document.querySelector('.table-image');
    if (tableImg.complete) {
        const tableWidth = 320;
        const tableHeight = (tableImg.naturalHeight / tableImg.naturalWidth) * tableWidth;
        tempCtx.drawImage(tableImg, (600 - tableWidth) / 2, 600 - tableHeight - 4, tableWidth, tableHeight);
    }
    
    // Draw avatar image if it exists
    const avatarImg = document.querySelector('.avatar-image');
    if (avatarImg.complete) {
        const avatarWidth = 680;
        const avatarHeight = (avatarImg.naturalHeight / avatarImg.naturalWidth) * avatarWidth;
        tempCtx.drawImage(avatarImg, (600 - avatarWidth) / 2, 600 - avatarHeight - 120, avatarWidth, avatarHeight);
    }
    
    // Draw the hair canvas on top
    tempCtx.drawImage(canvas, 0, 0);
    
    // Convert to data URL and download
    const dataURL = tempCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'hair-salon-screenshot.png';
    link.href = dataURL;
    link.click();
}

// Function to generate initial hair
function generateInitialHair() {
    // Avatar head center (approximate position based on CSS styling)
    const headCenterX = 300; // Center of 600px canvas
    const headCenterY = 250; // Approximate head position
    const headRadius = 80;   // Approximate head radius
    
    // Hair colors array for variety
    const hairColors = ['#8B4513', '#654321', '#2F1B14', '#D2691E', '#A0522D', '#8B7355'];
    
    // Generate random hair blobs only on top and sides of head
    for (let i = 0; i < 60; i++) {
        // Generate random angle only for top half and sides of head (from -π to 0)
        const angle = Math.random() * Math.PI - Math.PI; // -180° to 0° (top half of circle)
        
        // Generate random distance from head center (slightly outside head radius)
        const distance = headRadius + Math.random() * 25;
        
        // Calculate position
        const x = headCenterX + Math.cos(angle) * distance;
        const y = headCenterY + Math.sin(angle) * distance;
        
        // Random hair color
        const hairColor = hairColors[Math.floor(Math.random() * hairColors.length)];
        
        // Random blob size
        const blobSize = 4 + Math.random() * 8;
        
        // Draw hair blob
        ctx.fillStyle = hairColor;
        ctx.beginPath();
        ctx.arc(x, y, blobSize, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    // Add some additional hair strands for more natural look (only on head area)
    for (let i = 0; i < 20; i++) {
        // Limit angle to top and sides of head
        const angle = Math.random() * Math.PI - Math.PI; // -180° to 0°
        const distance = headRadius + Math.random() * 35;
        const x = headCenterX + Math.cos(angle) * distance;
        const y = headCenterY + Math.sin(angle) * distance;
        
        const hairColor = hairColors[Math.floor(Math.random() * hairColors.length)];
        
        ctx.strokeStyle = hairColor;
        ctx.lineWidth = 2 + Math.random() * 3;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + (Math.random() - 0.5) * 20, y + (Math.random() - 0.5) * 20);
        ctx.stroke();
        ctx.globalAlpha = 1.0;
    }
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
    
    // Connect tool buttons
    document.getElementById('shaveBtn').addEventListener('click', () => setTool('shave'));
    document.getElementById('combBtn').addEventListener('click', () => setTool('comb'));
    document.getElementById('paintBtn').addEventListener('click', () => setTool('paint'));
    document.getElementById('screenshotBtn').addEventListener('click', takeScreenshot);
});
