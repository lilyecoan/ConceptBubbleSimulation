/**
 * CONCEPT BUBBLE — Interactive Storytelling Experience
 * =====================================================
 * A scroll-driven narrative about finding creative space
 * amidst digital friction and distraction.
 *
 * Design System:
 * - Amber (#FFA500): Human / creativity / warmth
 * - Purple (#8F24F5): Tech / pressure / noise
 * - Bubbles: Friction contained
 * - Neurons: Thinking space
 */

// =============================================
// CONFIGURATION & STATE
// =============================================

const CONFIG = {
    colors: {
        amber: '#FFA500',
        purple: '#8F24F5',
        black: '#0D0D0D',
        white: '#FFFFFF'
    },
    tasks: [
        { icon: '📧', label: '47 unread' },
        { icon: '🕐', label: 'meeting in 5m' },
        { icon: '📋', label: 'quarterly report' },
        { icon: '🔔', label: '12 notifications' },
        { icon: '📱', label: 'slack ping' },
        { icon: '📊', label: 'analytics review' },
        { icon: '💬', label: 'reply pending' },
        { icon: '📅', label: 'deadline tomorrow' }
    ],
    bubbleCount: 8,
    neuronCount: 50
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
    brushSize: null,
    finalPreview: null
};

// =============================================
// INITIALIZATION
// =============================================

document.addEventListener('DOMContentLoaded', init);

function init() {
    // Cache DOM elements
    cacheElements();

    // Initialize scenes
    initScene1();
    initScene2();
    initScene3();
    initScene4();
    initScene5();

    // Set up global event listeners
    setupGlobalListeners();

    // Start animation loops
    requestAnimationFrame(animate);

    console.log('Concept Bubble initialized');
}

function cacheElements() {
    elements.scrollContainer = document.getElementById('scroll-container');
    elements.scenes = document.querySelectorAll('.scene');
    elements.cursorGlow = document.getElementById('cursor-glow');
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
    elements.brushSize = document.getElementById('brush-size');
    elements.finalPreview = document.getElementById('final-preview');

    // Initialize canvas contexts
    if (elements.previewCanvas) {
        elements.previewCtx = elements.previewCanvas.getContext('2d');
    }
    if (elements.paintingCanvas) {
        elements.paintingCtx = elements.paintingCanvas.getContext('2d');
        // Set up for smooth lines
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
    // Mouse tracking for custom cursor
    document.addEventListener('mousemove', handleMouseMove);

    // Scroll handling for scene transitions
    window.addEventListener('scroll', handleScroll);

    // Window resize
    window.addEventListener('resize', handleResize);
}

function handleMouseMove(e) {
    state.mouseX = e.clientX;
    state.mouseY = e.clientY;

    // Update cursor glow position
    if (elements.cursorGlow) {
        elements.cursorGlow.style.left = e.clientX + 'px';
        elements.cursorGlow.style.top = e.clientY + 'px';
    }
}

function handleScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    state.scrollProgress = scrollTop / docHeight;

    // Update progress bar
    if (elements.progressBar) {
        elements.progressBar.style.width = (state.scrollProgress * 100) + '%';
    }

    // Determine current scene based on scroll position
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
    const scrollY = window.scrollY;

    scenes.forEach((scene, index) => {
        const rect = scene.getBoundingClientRect();
        const sceneTop = rect.top;
        const sceneHeight = rect.height;

        // Scene is active when it's mostly in view
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

    // Trigger scene-specific behaviors
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

/**
 * Scene 1 establishes the conflict:
 * - Girl wants to paint
 * - Tasks/distractions orbit around her
 * - User tries to paint but is interrupted
 */

const scene1State = {
    tasks: [],
    interferences: [],
    lastPaintTime: 0
};

function initScene1() {
    createFloatingTasks();
    setupPreviewCanvasDrawing();
}

function createFloatingTasks() {
    const container = elements.floatingTasks;
    if (!container) return;

    CONFIG.tasks.forEach((task, index) => {
        const taskEl = document.createElement('div');
        taskEl.className = 'floating-task';
        taskEl.innerHTML = `<span class="icon">${task.icon}</span><span>${task.label}</span>`;

        // Position tasks in an orbit around the girl
        const angle = (index / CONFIG.tasks.length) * Math.PI * 2;
        const radius = 150 + Math.random() * 100;
        const centerX = window.innerWidth * 0.35;
        const centerY = window.innerHeight * 0.5;

        taskEl.style.left = (centerX + Math.cos(angle) * radius) + 'px';
        taskEl.style.top = (centerY + Math.sin(angle) * radius) + 'px';

        // Custom orbit properties
        taskEl.style.setProperty('--orbit-duration', (6 + Math.random() * 4) + 's');
        taskEl.style.setProperty('--orbit-delay', (-Math.random() * 5) + 's');
        taskEl.style.setProperty('--orbit-x1', (20 + Math.random() * 30) + 'px');
        taskEl.style.setProperty('--orbit-y1', (-15 - Math.random() * 25) + 'px');
        taskEl.style.setProperty('--orbit-x2', (Math.random() * 20 - 10) + 'px');
        taskEl.style.setProperty('--orbit-y2', (-30 - Math.random() * 20) + 'px');
        taskEl.style.setProperty('--orbit-x3', (-20 - Math.random() * 30) + 'px');
        taskEl.style.setProperty('--orbit-y3', (-10 - Math.random() * 20) + 'px');

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

    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
        elements.cursorGlow.classList.add('painting');
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check for interference
        if (shouldInterfere()) {
            triggerInterference(e.clientX, e.clientY);
            // Still draw but with disruption
            drawDisruptedStroke(ctx, lastX, lastY, x, y);
        } else {
            drawSmoothStroke(ctx, lastX, lastY, x, y, state.currentColor, 8);
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

/**
 * Interference logic - tasks randomly disrupt painting
 * This should feel frustrating but playful
 */
function shouldInterfere() {
    const now = Date.now();
    if (now - scene1State.lastPaintTime < 500) {
        return Math.random() < 0.4; // 40% chance to interfere if painting quickly
    }
    scene1State.lastPaintTime = now;
    return Math.random() < 0.2; // 20% base chance
}

function triggerInterference(x, y) {
    // Flash a random task
    const uncapturedTasks = scene1State.tasks.filter(t => !t.captured);
    if (uncapturedTasks.length > 0) {
        const task = uncapturedTasks[Math.floor(Math.random() * uncapturedTasks.length)];
        task.element.classList.add('interfering');
        setTimeout(() => task.element.classList.remove('interfering'), 500);
    }

    // Create interference flash at cursor
    const flash = document.createElement('div');
    flash.className = 'interference-flash';
    flash.style.left = (x - 50) + 'px';
    flash.style.top = (y - 50) + 'px';
    document.getElementById('interference-layer').appendChild(flash);
    setTimeout(() => flash.remove(), 500);
}

function drawDisruptedStroke(ctx, x1, y1, x2, y2) {
    // Draw a disrupted, jittery stroke
    ctx.beginPath();
    ctx.strokeStyle = CONFIG.colors.purple;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    // Add jitter
    const jitterX = (Math.random() - 0.5) * 20;
    const jitterY = (Math.random() - 0.5) * 20;

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

    // Use quadratic curve for smoother lines
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    ctx.quadraticCurveTo(x1, y1, midX, midY);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

// =============================================
// SCENE 2: EMERGENCE OF BUBBLES
// =============================================

/**
 * Scene 2 introduces the solution:
 * - Bubbles appear that can capture tasks
 * - User drags bubbles onto tasks
 * - Tasks get contained, showing internal neurons
 */

const scene2State = {
    bubbles: [],
    detachedTasks: [],
    activated: false
};

function initScene2() {
    // Bubbles will be created when scene activates
}

function activateScene2() {
    if (scene2State.activated) return;
    scene2State.activated = true;

    createBubbles();
    moveTasksToScene2();
}

function createBubbles() {
    const container = elements.bubblesContainer;
    if (!container) return;

    for (let i = 0; i < CONFIG.bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';

        const size = 80 + Math.random() * 60;
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left = (Math.random() * 70 + 15) + '%';
        bubble.style.top = (Math.random() * 60 + 20) + '%';

        // Create neuron structure inside bubble
        const neurons = document.createElement('div');
        neurons.className = 'bubble-neurons';
        createBubbleNeurons(neurons, size);
        bubble.appendChild(neurons);

        // Add captured task container
        const taskContainer = document.createElement('div');
        taskContainer.className = 'captured-task-container';
        taskContainer.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            color: rgba(255,255,255,0.8);
            text-align: center;
            padding: 10px;
            opacity: 0;
            transition: opacity 0.5s;
        `;
        bubble.appendChild(taskContainer);

        container.appendChild(bubble);

        const bubbleData = {
            element: bubble,
            x: parseFloat(bubble.style.left),
            y: parseFloat(bubble.style.top),
            size: size,
            captured: null,
            taskContainer: taskContainer
        };

        scene2State.bubbles.push(bubbleData);
        setupBubbleDrag(bubbleData);
    }
}

function createBubbleNeurons(container, bubbleSize) {
    const neuronCount = 5 + Math.floor(Math.random() * 5);
    const neurons = [];

    for (let i = 0; i < neuronCount; i++) {
        const neuron = document.createElement('div');
        neuron.className = 'neuron-dot';

        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * (bubbleSize * 0.3);
        const x = bubbleSize / 2 + Math.cos(angle) * radius;
        const y = bubbleSize / 2 + Math.sin(angle) * radius;

        neuron.style.left = x + 'px';
        neuron.style.top = y + 'px';
        neuron.style.animationDelay = (Math.random() * 2) + 's';

        container.appendChild(neuron);
        neurons.push({ el: neuron, x, y });
    }

    // Connect neurons with lines
    for (let i = 0; i < neurons.length - 1; i++) {
        const line = document.createElement('div');
        line.className = 'neuron-line';

        const n1 = neurons[i];
        const n2 = neurons[i + 1];
        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        line.style.width = length + 'px';
        line.style.left = n1.x + 'px';
        line.style.top = n1.y + 'px';
        line.style.transform = `rotate(${angle}rad)`;

        container.appendChild(line);
    }
}

function moveTasksToScene2() {
    const container = elements.detachedTasks;
    if (!container) return;

    scene1State.tasks.forEach((task, index) => {
        if (task.captured) return;

        const detached = document.createElement('div');
        detached.className = 'detached-task';
        detached.innerHTML = `<span class="icon">${task.data.icon}</span> ${task.data.label}`;

        // Random position in scene 2
        detached.style.left = (20 + Math.random() * 60) + '%';
        detached.style.top = (20 + Math.random() * 60) + '%';
        detached.style.animationDelay = (Math.random() * 2) + 's';

        container.appendChild(detached);

        scene2State.detachedTasks.push({
            element: detached,
            data: task.data,
            captured: false
        });
    });
}

function setupBubbleDrag(bubbleData) {
    const bubble = bubbleData.element;
    let isDragging = false;
    let startX, startY, origX, origY;

    bubble.addEventListener('mousedown', (e) => {
        if (bubbleData.captured) return;

        isDragging = true;
        bubble.classList.add('dragging');
        elements.cursorGlow.classList.add('dragging');

        startX = e.clientX;
        startY = e.clientY;

        const rect = bubble.getBoundingClientRect();
        origX = rect.left;
        origY = rect.top;

        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        bubble.style.position = 'fixed';
        bubble.style.left = (origX + dx) + 'px';
        bubble.style.top = (origY + dy) + 'px';

        // Check for task overlap
        checkTaskCapture(bubbleData);
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;

        isDragging = false;
        bubble.classList.remove('dragging');
        elements.cursorGlow.classList.remove('dragging');

        // Return to percentage-based positioning
        const rect = bubble.getBoundingClientRect();
        bubble.style.position = 'absolute';
        bubble.style.left = (rect.left / window.innerWidth * 100) + '%';
        bubble.style.top = (rect.top / window.innerHeight * 100) + '%';
    });
}

function checkTaskCapture(bubbleData) {
    if (bubbleData.captured) return;

    const bubbleRect = bubbleData.element.getBoundingClientRect();

    scene2State.detachedTasks.forEach(task => {
        if (task.captured) return;

        const taskRect = task.element.getBoundingClientRect();

        // Check overlap
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
    // Mark as captured
    bubbleData.captured = taskData;
    taskData.captured = true;
    state.capturedTasks++;

    // Animate task being captured
    taskData.element.classList.add('being-captured');
    setTimeout(() => taskData.element.remove(), 500);

    // Update bubble appearance
    bubbleData.element.classList.add('captured');

    // Show task info inside bubble
    bubbleData.taskContainer.innerHTML = `${taskData.data.icon}<br>${taskData.data.label}`;
    bubbleData.taskContainer.style.opacity = '1';

    // Create capture particles
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

/**
 * Scene 3 shows the result:
 * - Background is calm
 * - Neurons animate peacefully
 * - Captured bubbles drift in background
 * - Girl has clear space
 */

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

    // Create neurons
    for (let i = 0; i < CONFIG.neuronCount; i++) {
        scene3State.neurons.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: 2 + Math.random() * 3,
            pulsePhase: Math.random() * Math.PI * 2
        });
    }
}

function drawNeuronBackground() {
    const ctx = elements.neuronCtx;
    const canvas = elements.neuronCanvas;
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw neurons
    scene3State.neurons.forEach((neuron, i) => {
        // Update position
        neuron.x += neuron.vx;
        neuron.y += neuron.vy;

        // Wrap around edges
        if (neuron.x < 0) neuron.x = canvas.width;
        if (neuron.x > canvas.width) neuron.x = 0;
        if (neuron.y < 0) neuron.y = canvas.height;
        if (neuron.y > canvas.height) neuron.y = 0;

        // Pulse effect
        neuron.pulsePhase += 0.02;
        const pulse = Math.sin(neuron.pulsePhase) * 0.5 + 0.5;

        // Draw neuron
        ctx.beginPath();
        ctx.arc(neuron.x, neuron.y, neuron.radius * (0.8 + pulse * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 165, 0, ${0.3 + pulse * 0.3})`;
        ctx.fill();

        // Draw connections to nearby neurons
        scene3State.neurons.slice(i + 1).forEach(other => {
            const dx = other.x - neuron.x;
            const dy = other.y - neuron.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150) {
                ctx.beginPath();
                ctx.moveTo(neuron.x, neuron.y);
                ctx.lineTo(other.x, other.y);
                ctx.strokeStyle = `rgba(255, 165, 0, ${(1 - dist / 150) * 0.2})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        });
    });
}

function createPeacefulBubbles() {
    const container = elements.peacefulBubbles;
    if (!container) return;

    // Create peaceful floating bubbles
    for (let i = 0; i < 6; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'peaceful-bubble';

        const size = 60 + Math.random() * 80;
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

/**
 * Scene 4 is the payoff:
 * - User clicks canvas to enter painting mode
 * - Full painting interface appears
 * - Smooth, organic brush strokes
 * - Limited but meaningful color palette
 */

const scene4State = {
    activated: false,
    paintingStarted: false,
    points: []
};

function initScene4() {
    setupCanvasTrigger();
    setupPaintingCanvas();
    setupColorPalette();
    setupBrushSize();
    setupClearButton();
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

        // Hide trigger, show painting area
        trigger.classList.add('hidden');
        document.getElementById('create-prompt').style.opacity = '0';
        elements.paintingArea.classList.remove('hidden');

        // Clear the painting canvas
        if (elements.paintingCtx) {
            elements.paintingCtx.fillStyle = CONFIG.colors.white;
            elements.paintingCtx.fillRect(0, 0, elements.paintingCanvas.width, elements.paintingCanvas.height);
        }
    });
}

function setupPaintingCanvas() {
    const canvas = elements.paintingCanvas;
    if (!canvas) return;

    const ctx = elements.paintingCtx;
    let isDrawing = false;

    // Initialize canvas with white background
    ctx.fillStyle = CONFIG.colors.white;
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

        // Draw smooth curve through points
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

/**
 * Draw smooth curves using quadratic bezier interpolation
 * This creates organic, flowing brush strokes
 */
function drawSmoothCurve(ctx, points, color, width) {
    if (points.length < 2) return;

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Start from the second-to-last point
    const len = points.length;
    if (len < 3) {
        ctx.moveTo(points[0].x, points[0].y);
        ctx.lineTo(points[1].x, points[1].y);
    } else {
        // Use the last 3 points for smoother drawing
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

function setupBrushSize() {
    if (!elements.brushSize) return;

    elements.brushSize.addEventListener('input', (e) => {
        state.brushSize = parseInt(e.target.value);
    });
}

function setupClearButton() {
    const clearBtn = document.getElementById('clear-canvas');
    if (!clearBtn) return;

    clearBtn.addEventListener('click', () => {
        if (elements.paintingCtx) {
            elements.paintingCtx.fillStyle = CONFIG.colors.white;
            elements.paintingCtx.fillRect(0, 0,
                elements.paintingCanvas.width,
                elements.paintingCanvas.height);
        }
    });
}

// =============================================
// SCENE 5: DOWNLOAD & SIGNATURE
// =============================================

/**
 * Scene 5 completes the journey:
 * - Preview of the creation
 * - Download with watermark
 * - Subtle branding
 */

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

    // Clone the painting canvas into preview
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

    // Create a new canvas with watermark
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = elements.paintingCanvas.width;
    canvas.height = elements.paintingCanvas.height + 50; // Extra space for watermark

    // Draw white background
    ctx.fillStyle = CONFIG.colors.white;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the painting
    ctx.drawImage(elements.paintingCanvas, 0, 0);

    // Add watermark
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.font = '16px "Segoe UI", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Concept Bubble', canvas.width / 2, canvas.height - 18);

    // Add subtle line above watermark
    ctx.strokeStyle = 'rgba(255, 165, 0, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 80, canvas.height - 40);
    ctx.lineTo(canvas.width / 2 + 80, canvas.height - 40);
    ctx.stroke();

    // Trigger download
    const link = document.createElement('a');
    link.download = 'concept-bubble-artwork.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// =============================================
// ANIMATION LOOP
// =============================================

function animate() {
    // Scene 3 neuron animation
    if (state.currentScene === 3 && scene3State.activated) {
        drawNeuronBackground();
    }

    // Update final preview when in scene 5
    if (state.currentScene === 5 && scene4State.paintingStarted) {
        updateFinalPreview();
    }

    requestAnimationFrame(animate);
}

// =============================================
// UTILITY FUNCTIONS
// =============================================

/**
 * Elastic easing for organic motion
 */
function elasticOut(t) {
    const p = 0.3;
    return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
}

/**
 * Smooth interpolation
 */
function lerp(start, end, t) {
    return start + (end - start) * t;
}

/**
 * Clamp a value between min and max
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// =============================================
// DEBUG (remove in production)
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
