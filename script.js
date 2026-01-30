/**
 * CONCEPT BUBBLE — Interactive Storytelling Experience
 * =====================================================
 * Based on Figma Design
 * A scroll-driven narrative about finding creative space
 * amidst digital friction and distraction.
 *
 * Design System (from Figma):
 * - Amber (#FFA500): Human / creativity / warmth
 * - Purple Accent (#A855F7): Tech tasks / accent
 * - Purple (#8F24F5): Deeper tech elements
 * - Bubbles: Friction contained
 * - Font: IBM Plex Sans
 */

// =============================================
// CONFIGURATION & STATE
// =============================================

const CONFIG = {
    colors: {
        amber: '#FFA500',
        purple: '#8F24F5',
        purpleAccent: '#A855F7',
        black: '#0D0D0D',
        white: '#FFFFFF'
    },
    // Tasks matching Figma design (no emoji icons - text only)
    tasks: [
        { label: 'meeting in 5 min' },
        { label: 'deadline tomorrow' },
        { label: 'analytics review' },
        { label: 'quarterly report' },
        { label: '47 unread' },
        { label: 'reply pending' }
    ],
    bubbleCount: 6,
    neuronCount: 40
};

const state = {
    currentScene: 1,
    scrollProgress: 0,
    isDrawing: false,
    isPainting: false,
    currentColor: CONFIG.colors.amber,
    brushSize: 12,
    capturedTasks: 0,
    totalTasks: CONFIG.tasks.length,
    mouseX: 0,
    mouseY: 0,
    draggedBubble: null,
    paintingHistory: []
};

// =============================================
// DOM ELEMENTS
// =============================================

const elements = {
    scrollContainer: null,
    scenes: null,
    cursorGlow: null,
    brushCursor: null,
    progressBar: null,
    previewCanvas: null,
    previewCtx: null,
    paintingCanvas: null,
    paintingCtx: null,
    neuronCanvas: null,
    neuronCtx: null,
    floatingTasks: null,
    bubblesContainer: null,
    detachedTasks: null,
    peacefulBubbles: null,
    paintingArea: null,
    colorBtns: null,
    finalPreview: null
};

// =============================================
// INITIALIZATION
// =============================================

document.addEventListener('DOMContentLoaded', init);

function init() {
    cacheElements();
    initScene1();
    initScene2();
    initScene3();
    initScene4();
    initScene5();
    setupGlobalListeners();
    requestAnimationFrame(animate);
    console.log('Concept Bubble initialized');
}

function cacheElements() {
    elements.scrollContainer = document.getElementById('scroll-container');
    elements.scenes = document.querySelectorAll('.scene');
    elements.cursorGlow = document.getElementById('cursor-glow');
    elements.brushCursor = document.getElementById('brush-cursor');
    elements.progressBar = document.getElementById('progress-bar');
    elements.previewCanvas = document.getElementById('preview-canvas');
    elements.paintingCanvas = document.getElementById('painting-canvas');
    elements.neuronCanvas = document.getElementById('neuron-canvas');
    elements.floatingTasks = document.getElementById('floating-tasks');
    elements.bubblesContainer = document.getElementById('bubbles-container');
    elements.detachedTasks = document.getElementById('detached-tasks');
    elements.peacefulBubbles = document.getElementById('peaceful-bubbles');
    elements.paintingArea = document.getElementById('painting-area');
    elements.colorBtns = document.querySelectorAll('.color-btn');
    elements.finalPreview = document.getElementById('final-preview');

    if (elements.previewCanvas) {
        elements.previewCtx = elements.previewCanvas.getContext('2d');
    }
    if (elements.paintingCanvas) {
        elements.paintingCtx = elements.paintingCanvas.getContext('2d');
        elements.paintingCtx.lineCap = 'round';
        elements.paintingCtx.lineJoin = 'round';
    }
    if (elements.neuronCanvas) {
        elements.neuronCtx = elements.neuronCanvas.getContext('2d');
        resizeNeuronCanvas();
    }
}

// =============================================
// GLOBAL EVENT LISTENERS
// =============================================

function setupGlobalListeners() {
    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
}

function handleMouseMove(e) {
    state.mouseX = e.clientX;
    state.mouseY = e.clientY;

    if (elements.cursorGlow) {
        elements.cursorGlow.style.left = e.clientX + 'px';
        elements.cursorGlow.style.top = e.clientY + 'px';
    }

    if (elements.brushCursor) {
        elements.brushCursor.style.left = e.clientX + 'px';
        elements.brushCursor.style.top = e.clientY + 'px';
    }
}

function handleScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    state.scrollProgress = scrollTop / docHeight;

    if (elements.progressBar) {
        elements.progressBar.style.width = (state.scrollProgress * 100) + '%';
    }

    updateCurrentScene();
}

function handleResize() {
    resizeNeuronCanvas();
}

function resizeNeuronCanvas() {
    if (elements.neuronCanvas) {
        elements.neuronCanvas.width = window.innerWidth;
        elements.neuronCanvas.height = window.innerHeight;
    }
}

// =============================================
// SCENE MANAGEMENT
// =============================================

function updateCurrentScene() {
    const scenes = elements.scenes;
    const viewportHeight = window.innerHeight;

    scenes.forEach((scene, index) => {
        const rect = scene.getBoundingClientRect();
        const sceneTop = rect.top;
        const sceneHeight = rect.height;

        if (sceneTop < viewportHeight * 0.5 && sceneTop > -sceneHeight * 0.5) {
            if (state.currentScene !== index + 1) {
                state.currentScene = index + 1;
                onSceneChange(state.currentScene);
            }
            scene.classList.add('active');
        } else {
            scene.classList.remove('active');
        }
    });
}

function onSceneChange(sceneNumber) {
    console.log('Scene changed to:', sceneNumber);

    switch (sceneNumber) {
        case 2:
            activateScene2();
            break;
        case 3:
            activateScene3();
            break;
        case 4:
            activateScene4();
            break;
        case 5:
            activateScene5();
            break;
    }
}

// =============================================
// SCENE 1: THE BLANK CANVAS (FRICTION)
// =============================================

const scene1State = {
    tasks: [],
    lastPaintTime: 0
};

function initScene1() {
    createFloatingTasks();
    setupPreviewCanvasDrawing();
}

function createFloatingTasks() {
    const container = elements.floatingTasks;
    if (!container) return;

    // Task positions matching Figma layout (scattered around canvas area)
    const taskPositions = [
        { x: '70%', y: '15%', rotate: '-8deg' },   // deadline tomorrow (top right)
        { x: '75%', y: '30%', rotate: '5deg' },    // reply pending
        { x: '80%', y: '45%', rotate: '-3deg' },   // meeting in 5 min
        { x: '55%', y: '60%', rotate: '6deg' },    // quarterly report
        { x: '65%', y: '75%', rotate: '-5deg' },   // 47 unread
        { x: '50%', y: '25%', rotate: '4deg' }     // analytics review
    ];

    CONFIG.tasks.forEach((task, index) => {
        const taskEl = document.createElement('div');
        taskEl.className = 'floating-task';
        taskEl.textContent = task.label;

        const pos = taskPositions[index] || { x: '60%', y: '40%', rotate: '0deg' };
        taskEl.style.left = pos.x;
        taskEl.style.top = pos.y;

        // Custom float animation properties
        taskEl.style.setProperty('--float-duration', (5 + Math.random() * 3) + 's');
        taskEl.style.setProperty('--float-delay', (-Math.random() * 4) + 's');
        taskEl.style.setProperty('--float-x1', (10 + Math.random() * 15) + 'px');
        taskEl.style.setProperty('--float-y1', (-8 - Math.random() * 12) + 'px');
        taskEl.style.setProperty('--float-x2', (Math.random() * 10 - 5) + 'px');
        taskEl.style.setProperty('--float-y2', (-15 - Math.random() * 10) + 'px');
        taskEl.style.setProperty('--float-x3', (-10 - Math.random() * 15) + 'px');
        taskEl.style.setProperty('--float-y3', (-5 - Math.random() * 10) + 'px');
        taskEl.style.setProperty('--rotate-start', pos.rotate);
        taskEl.style.setProperty('--rotate-mid', '0deg');
        taskEl.style.setProperty('--rotate-end', (parseInt(pos.rotate) * -1) + 'deg');

        container.appendChild(taskEl);
        scene1State.tasks.push({
            element: taskEl,
            data: task,
            captured: false
        });
    });
}

function setupPreviewCanvasDrawing() {
    const canvas = elements.previewCanvas;
    if (!canvas) return;

    const ctx = elements.previewCtx;
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    // Fill with light gray (matching Figma canvas color)
    ctx.fillStyle = '#E8E8E8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        lastX = (e.clientX - rect.left) * (canvas.width / rect.width);
        lastY = (e.clientY - rect.top) * (canvas.height / rect.height);
        elements.cursorGlow.classList.add('painting');
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;

        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);

        if (shouldInterfere()) {
            triggerInterference(e.clientX, e.clientY);
            drawDisruptedStroke(ctx, lastX, lastY, x, y);
        } else {
            drawSmoothStroke(ctx, lastX, lastY, x, y, state.currentColor, 6);
        }

        lastX = x;
        lastY = y;
    });

    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
        elements.cursorGlow.classList.remove('painting');
    });

    canvas.addEventListener('mouseleave', () => {
        isDrawing = false;
        elements.cursorGlow.classList.remove('painting');
    });
}

function shouldInterfere() {
    const now = Date.now();
    if (now - scene1State.lastPaintTime < 500) {
        return Math.random() < 0.45;
    }
    scene1State.lastPaintTime = now;
    return Math.random() < 0.25;
}

function triggerInterference(x, y) {
    const uncapturedTasks = scene1State.tasks.filter(t => !t.captured);
    if (uncapturedTasks.length > 0) {
        const task = uncapturedTasks[Math.floor(Math.random() * uncapturedTasks.length)];
        task.element.classList.add('interfering');
        setTimeout(() => task.element.classList.remove('interfering'), 500);
    }

    const flash = document.createElement('div');
    flash.className = 'interference-flash';
    flash.style.left = (x - 50) + 'px';
    flash.style.top = (y - 50) + 'px';
    document.getElementById('interference-layer').appendChild(flash);
    setTimeout(() => flash.remove(), 500);
}

function drawDisruptedStroke(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.strokeStyle = CONFIG.colors.purpleAccent;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    const jitterX = (Math.random() - 0.5) * 25;
    const jitterY = (Math.random() - 0.5) * 25;

    ctx.moveTo(x1 + jitterX, y1 + jitterY);
    ctx.lineTo(x2 - jitterX, y2 - jitterY);
    ctx.stroke();
}

function drawSmoothStroke(ctx, x1, y1, x2, y2, color, width) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(x1, y1);

    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    ctx.quadraticCurveTo(x1, y1, midX, midY);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

// =============================================
// SCENE 2: EMERGENCE OF BUBBLES
// =============================================

const scene2State = {
    bubbles: [],
    detachedTasks: [],
    activated: false
};

function initScene2() {
    // Will be activated on scene enter
}

function activateScene2() {
    if (scene2State.activated) return;
    scene2State.activated = true;

    createBubbles();
    moveTasksToScene2();
    createNeuronBackground();
}

function createBubbles() {
    const container = elements.bubblesContainer;
    if (!container) return;

    // Bubble positions matching Figma (scattered with varying sizes)
    const bubbleConfigs = [
        { x: 15, y: 40, size: 180 },   // Large left bubble
        { x: 35, y: 55, size: 120 },   // Medium center-left
        { x: 70, y: 65, size: 160 },   // Large right (analytics review captured)
        { x: 55, y: 30, size: 100 },   // Small top center
        { x: 25, y: 70, size: 90 },    // Small bottom left
        { x: 80, y: 35, size: 110 }    // Medium top right
    ];

    bubbleConfigs.forEach((config, i) => {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';

        bubble.style.width = config.size + 'px';
        bubble.style.height = config.size + 'px';
        bubble.style.left = config.x + '%';
        bubble.style.top = config.y + '%';

        // Neuron dots inside bubble
        const neurons = document.createElement('div');
        neurons.className = 'bubble-neurons';
        createBubbleNeurons(neurons, config.size);
        bubble.appendChild(neurons);

        // Label container for captured tasks
        const label = document.createElement('div');
        label.className = 'captured-task-label';
        bubble.appendChild(label);

        container.appendChild(bubble);

        const bubbleData = {
            element: bubble,
            x: config.x,
            y: config.y,
            size: config.size,
            captured: null,
            labelEl: label
        };

        scene2State.bubbles.push(bubbleData);
        setupBubbleDrag(bubbleData);
    });
}

function createBubbleNeurons(container, bubbleSize) {
    const neuronCount = 4 + Math.floor(Math.random() * 4);

    for (let i = 0; i < neuronCount; i++) {
        const neuron = document.createElement('div');
        neuron.className = 'neuron-dot';

        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * (bubbleSize * 0.25);
        const x = bubbleSize / 2 + Math.cos(angle) * radius;
        const y = bubbleSize / 2 + Math.sin(angle) * radius;

        neuron.style.left = x + 'px';
        neuron.style.top = y + 'px';
        neuron.style.animationDelay = (Math.random() * 2) + 's';

        container.appendChild(neuron);
    }
}

function moveTasksToScene2() {
    const container = elements.detachedTasks;
    if (!container) return;

    // Positions for detached tasks in scene 2 (matching Figma)
    const taskPositions = [
        { x: 45, y: 25 },   // meeting in 5 min
        { x: 70, y: 18 },   // deadline tomorrow
        { x: 65, y: 38 },   // reply pending
        { x: 10, y: 65 },   // quarterly report
        { x: 35, y: 45 },   // 47 unread
        { x: 72, y: 58 }    // analytics review (will be captured in demo)
    ];

    scene1State.tasks.forEach((task, index) => {
        if (task.captured) return;

        const detached = document.createElement('div');
        detached.className = 'detached-task';
        detached.textContent = task.data.label;

        const pos = taskPositions[index] || { x: 50, y: 50 };
        detached.style.left = pos.x + '%';
        detached.style.top = pos.y + '%';
        detached.style.animationDelay = (Math.random() * 2) + 's';

        container.appendChild(detached);

        scene2State.detachedTasks.push({
            element: detached,
            data: task.data,
            captured: false
        });
    });
}

function createNeuronBackground() {
    const container = document.getElementById('neurons-scene2');
    if (!container) return;

    // Create subtle neuron dots in background
    for (let i = 0; i < 15; i++) {
        const dot = document.createElement('div');
        dot.className = 'neuron-bg-dot';
        dot.style.left = (Math.random() * 100) + '%';
        dot.style.top = (Math.random() * 100) + '%';
        dot.style.animationDelay = (Math.random() * 3) + 's';
        container.appendChild(dot);
    }
}

function setupBubbleDrag(bubbleData) {
    const bubble = bubbleData.element;
    let isDragging = false;
    let startX, startY, origX, origY;

    function startDrag(clientX, clientY) {
        if (bubbleData.captured) return;

        isDragging = true;
        bubble.classList.add('dragging');
        if (elements.cursorGlow) elements.cursorGlow.classList.add('dragging');

        startX = clientX;
        startY = clientY;

        const rect = bubble.getBoundingClientRect();
        origX = rect.left;
        origY = rect.top;
    }

    function moveDrag(clientX, clientY) {
        if (!isDragging) return;

        const dx = clientX - startX;
        const dy = clientY - startY;

        bubble.style.position = 'fixed';
        bubble.style.left = (origX + dx) + 'px';
        bubble.style.top = (origY + dy) + 'px';

        checkTaskCapture(bubbleData);
    }

    function endDrag() {
        if (!isDragging) return;

        isDragging = false;
        bubble.classList.remove('dragging');
        if (elements.cursorGlow) elements.cursorGlow.classList.remove('dragging');

        const rect = bubble.getBoundingClientRect();
        bubble.style.position = 'absolute';
        bubble.style.left = (rect.left / window.innerWidth * 100) + '%';
        bubble.style.top = (rect.top / window.innerHeight * 100) + '%';
    }

    // Mouse events
    bubble.addEventListener('mousedown', (e) => {
        startDrag(e.clientX, e.clientY);
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        moveDrag(e.clientX, e.clientY);
    });

    document.addEventListener('mouseup', endDrag);

    // Touch events
    bubble.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        startDrag(touch.clientX, touch.clientY);
        e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        moveDrag(touch.clientX, touch.clientY);
        e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchend', endDrag);
}

function checkTaskCapture(bubbleData) {
    if (bubbleData.captured) return;

    const bubbleRect = bubbleData.element.getBoundingClientRect();

    scene2State.detachedTasks.forEach(task => {
        if (task.captured) return;

        const taskRect = task.element.getBoundingClientRect();

        if (rectsOverlap(bubbleRect, taskRect)) {
            captureTask(bubbleData, task);
        }
    });
}

function rectsOverlap(r1, r2) {
    return !(r1.right < r2.left ||
        r1.left > r2.right ||
        r1.bottom < r2.top ||
        r1.top > r2.bottom);
}

function captureTask(bubbleData, taskData) {
    bubbleData.captured = taskData;
    taskData.captured = true;
    state.capturedTasks++;

    taskData.element.classList.add('being-captured');
    setTimeout(() => taskData.element.remove(), 500);

    bubbleData.element.classList.add('captured');
    bubbleData.labelEl.textContent = taskData.data.label;

    createCaptureParticles(bubbleData.element);

    console.log(`Captured: ${taskData.data.label} (${state.capturedTasks}/${state.totalTasks})`);
}

function createCaptureParticles(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const angle = (i / 8) * Math.PI * 2;
        const distance = 30 + Math.random() * 20;

        particle.style.left = (centerX + Math.cos(angle) * distance) + 'px';
        particle.style.top = (centerY + Math.sin(angle) * distance) + 'px';
        particle.style.background = CONFIG.colors.amber;

        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
    }
}

// =============================================
// SCENE 3: CALM FIELD (CLARITY)
// =============================================

const scene3State = {
    neurons: [],
    activated: false
};

function initScene3() {
    // Will be activated on scene enter
}

function activateScene3() {
    if (scene3State.activated) return;
    scene3State.activated = true;

    initNeuronBackground();
    createPeacefulBubbles();
}

function initNeuronBackground() {
    const canvas = elements.neuronCanvas;
    if (!canvas) return;

    for (let i = 0; i < CONFIG.neuronCount; i++) {
        scene3State.neurons.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            radius: 2 + Math.random() * 2,
            pulsePhase: Math.random() * Math.PI * 2
        });
    }
}

function drawNeuronBackground() {
    const ctx = elements.neuronCtx;
    const canvas = elements.neuronCanvas;
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    scene3State.neurons.forEach((neuron, i) => {
        neuron.x += neuron.vx;
        neuron.y += neuron.vy;

        if (neuron.x < 0) neuron.x = canvas.width;
        if (neuron.x > canvas.width) neuron.x = 0;
        if (neuron.y < 0) neuron.y = canvas.height;
        if (neuron.y > canvas.height) neuron.y = 0;

        neuron.pulsePhase += 0.02;
        const pulse = Math.sin(neuron.pulsePhase) * 0.5 + 0.5;

        ctx.beginPath();
        ctx.arc(neuron.x, neuron.y, neuron.radius * (0.8 + pulse * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 165, 0, ${0.2 + pulse * 0.3})`;
        ctx.fill();

        scene3State.neurons.slice(i + 1).forEach(other => {
            const dx = other.x - neuron.x;
            const dy = other.y - neuron.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(neuron.x, neuron.y);
                ctx.lineTo(other.x, other.y);
                ctx.strokeStyle = `rgba(255, 165, 0, ${(1 - dist / 120) * 0.15})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        });
    });
}

function createPeacefulBubbles() {
    const container = elements.peacefulBubbles;
    if (!container) return;

    for (let i = 0; i < 5; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'peaceful-bubble';

        const size = 50 + Math.random() * 80;
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left = (Math.random() * 80 + 10) + '%';
        bubble.style.top = (Math.random() * 70 + 15) + '%';
        bubble.style.animationDelay = (Math.random() * 5) + 's';

        container.appendChild(bubble);
    }
}

// =============================================
// SCENE 4: THE MOMENT TO CREATE
// =============================================

const scene4State = {
    activated: false,
    paintingStarted: false,
    points: []
};

function initScene4() {
    setupCanvasTrigger();
    setupPaintingCanvas();
    setupColorPalette();
    setupDownloadBtnPaint();
    setupClosePainting();
}

function activateScene4() {
    if (scene4State.activated) return;
    scene4State.activated = true;
}

function setupCanvasTrigger() {
    const trigger = document.getElementById('floating-canvas-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
        if (scene4State.paintingStarted) return;
        scene4State.paintingStarted = true;

        trigger.classList.add('hidden');
        document.getElementById('create-prompt').style.opacity = '0';
        elements.paintingArea.classList.remove('hidden');

        // Initialize canvas with light gray
        if (elements.paintingCtx) {
            elements.paintingCtx.fillStyle = '#E8E8E8';
            elements.paintingCtx.fillRect(0, 0, elements.paintingCanvas.width, elements.paintingCanvas.height);
        }
    });
}

function setupPaintingCanvas() {
    const canvas = elements.paintingCanvas;
    if (!canvas) return;

    const ctx = elements.paintingCtx;
    let isDrawing = false;

    ctx.fillStyle = '#E8E8E8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        state.isPainting = true;
        elements.cursorGlow.classList.add('painting');

        scene4State.points = [];
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);
        scene4State.points.push({ x, y });
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;

        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);

        scene4State.points.push({ x, y });

        if (scene4State.points.length >= 3) {
            drawSmoothCurve(ctx, scene4State.points, state.currentColor, state.brushSize);
        }
    });

    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
        state.isPainting = false;
        elements.cursorGlow.classList.remove('painting');
        scene4State.points = [];
    });

    canvas.addEventListener('mouseleave', () => {
        isDrawing = false;
        state.isPainting = false;
        elements.cursorGlow.classList.remove('painting');
        scene4State.points = [];
    });

    // Touch support
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    });

    canvas.addEventListener('touchend', () => {
        const mouseEvent = new MouseEvent('mouseup', {});
        canvas.dispatchEvent(mouseEvent);
    });
}

function drawSmoothCurve(ctx, points, color, width) {
    if (points.length < 2) return;

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const len = points.length;
    if (len < 3) {
        ctx.moveTo(points[0].x, points[0].y);
        ctx.lineTo(points[1].x, points[1].y);
    } else {
        const p1 = points[len - 3];
        const p2 = points[len - 2];
        const p3 = points[len - 1];

        ctx.moveTo(p1.x, p1.y);
        ctx.quadraticCurveTo(p2.x, p2.y, (p2.x + p3.x) / 2, (p2.y + p3.y) / 2);
    }

    ctx.stroke();
}

function setupColorPalette() {
    elements.colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.colorBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.currentColor = btn.dataset.color;
        });
    });
}

function setupDownloadBtnPaint() {
    const downloadBtn = document.getElementById('download-btn-paint');
    if (!downloadBtn) return;

    downloadBtn.addEventListener('click', downloadArtwork);
}

function setupClosePainting() {
    const closeBtn = document.getElementById('close-painting');
    if (!closeBtn) return;

    closeBtn.addEventListener('click', () => {
        elements.paintingArea.classList.add('hidden');

        // Show the canvas trigger again
        const trigger = document.getElementById('floating-canvas-trigger');
        if (trigger) {
            trigger.classList.remove('hidden');
        }
        document.getElementById('create-prompt').style.opacity = '1';
    });
}

// =============================================
// SCENE 5: DOWNLOAD & SIGNATURE
// =============================================

const scene5State = {
    activated: false
};

function initScene5() {
    setupDownloadButton();
}

function activateScene5() {
    if (scene5State.activated) return;
    scene5State.activated = true;

    updateFinalPreview();
}

function updateFinalPreview() {
    const container = elements.finalPreview;
    if (!container || !elements.paintingCanvas) return;

    const previewCanvas = document.createElement('canvas');
    previewCanvas.width = elements.paintingCanvas.width;
    previewCanvas.height = elements.paintingCanvas.height;

    const ctx = previewCanvas.getContext('2d');
    ctx.drawImage(elements.paintingCanvas, 0, 0);

    container.innerHTML = '';
    container.appendChild(previewCanvas);
}

function setupDownloadButton() {
    const downloadBtn = document.getElementById('download-btn');
    if (!downloadBtn) return;

    downloadBtn.addEventListener('click', downloadArtwork);
}

function downloadArtwork() {
    if (!elements.paintingCanvas) return;

    // Load the watermark image
    const watermarkImg = new Image();
    watermarkImg.crossOrigin = 'anonymous';
    watermarkImg.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = elements.paintingCanvas.width;
        canvas.height = elements.paintingCanvas.height;

        // Draw the painting
        ctx.drawImage(elements.paintingCanvas, 0, 0);

        // Calculate watermark size - scale to reasonable size
        const maxWidth = 180;
        const scale = maxWidth / watermarkImg.width;
        const watermarkWidth = watermarkImg.width * scale;
        const watermarkHeight = watermarkImg.height * scale;

        // Position in bottom right with padding
        const watermarkX = canvas.width - watermarkWidth - 15;
        const watermarkY = canvas.height - watermarkHeight - 12;

        // Draw the signature
        ctx.drawImage(watermarkImg, watermarkX, watermarkY, watermarkWidth, watermarkHeight);

        // Trigger download
        const link = document.createElement('a');
        link.download = 'concept-bubble-artwork.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    watermarkImg.onerror = function() {
        // Fallback to text watermark if image fails to load
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = elements.paintingCanvas.width;
        canvas.height = elements.paintingCanvas.height;

        ctx.drawImage(elements.paintingCanvas, 0, 0);

        // Draw text watermark in bottom right
        ctx.fillStyle = 'rgba(80, 80, 80, 0.6)';
        ctx.font = 'italic 500 18px "IBM Plex Sans", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('Concept ', canvas.width - 85, canvas.height - 20);

        // "Bubble" in amber
        ctx.fillStyle = 'rgba(255, 165, 0, 0.7)';
        ctx.fillText('Bubble', canvas.width - 15, canvas.height - 20);

        const link = document.createElement('a');
        link.download = 'concept-bubble-artwork.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    watermarkImg.src = 'assets/signature.png';
}

// =============================================
// ANIMATION LOOP
// =============================================

function animate() {
    if (state.currentScene === 3 && scene3State.activated) {
        drawNeuronBackground();
    }

    if (state.currentScene === 5 && scene4State.paintingStarted) {
        updateFinalPreview();
    }

    requestAnimationFrame(animate);
}

// =============================================
// DEBUG
// =============================================

if (window.location.search.includes('debug')) {
    window.conceptBubble = {
        state,
        scene1State,
        scene2State,
        scene3State,
        scene4State,
        scene5State,
        CONFIG
    };
    console.log('Debug mode enabled. Access state via window.conceptBubble');
}
