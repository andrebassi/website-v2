// ===== Main Game Controller =====
class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.minimapCanvas = document.getElementById('minimap-canvas');
        this.minimapCtx = this.minimapCanvas.getContext('2d');

        // UI Elements
        this.locationName = document.querySelector('.location-name');
        this.modalOverlay = document.getElementById('modal-overlay');
        this.modalTitle = document.getElementById('modal-title');
        this.modalIcon = document.getElementById('modal-icon');
        this.modalContent = document.getElementById('modal-content');
        this.modalClose = document.getElementById('modal-close');
        this.welcomeScreen = document.getElementById('welcome-screen');
        this.startBtn = document.getElementById('start-btn');

        // Game state
        this.isRunning = false;
        this.currentRoom = null;
        this.tileSize = CONFIG.TILE_SIZE;

        // Initialize
        this.setupCanvas();
        this.setupEventListeners();

        // Create interaction prompt element
        this.createInteractionPrompt();
    }

    setupCanvas() {
        // Set canvas size
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Set pixel-perfect rendering
        this.ctx.imageSmoothingEnabled = false;
        this.minimapCtx.imageSmoothingEnabled = false;
    }

    resize() {
        // Make canvas fill the window
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // Calculate tile size to fit map
        const mapPixelWidth = CONFIG.MAP_WIDTH * CONFIG.TILE_SIZE;
        const mapPixelHeight = CONFIG.MAP_HEIGHT * CONFIG.TILE_SIZE;

        // Scale to fit while maintaining aspect ratio
        const scaleX = this.canvas.width / mapPixelWidth;
        const scaleY = this.canvas.height / mapPixelHeight;
        this.scale = Math.min(scaleX, scaleY) * 0.9; // 90% of available space

        this.tileSize = CONFIG.TILE_SIZE * this.scale;

        // Center offset
        this.offsetX = (this.canvas.width - mapPixelWidth * this.scale) / 2;
        this.offsetY = (this.canvas.height - mapPixelHeight * this.scale) / 2;

        // Minimap size
        this.minimapCanvas.width = 150;
        this.minimapCanvas.height = 150;
    }

    setupEventListeners() {
        // Start button
        this.startBtn.addEventListener('click', () => this.start());

        // Modal close
        this.modalClose.addEventListener('click', () => this.closeModal());
        this.modalOverlay.addEventListener('click', (e) => {
            if (e.target === this.modalOverlay) this.closeModal();
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    createInteractionPrompt() {
        this.interactionPrompt = document.createElement('div');
        this.interactionPrompt.className = 'interaction-prompt';
        document.body.appendChild(this.interactionPrompt);
    }

    start() {
        // Hide welcome screen
        this.welcomeScreen.classList.add('hidden');

        // Create player in reception (center of map)
        this.player = new Player(10, 8, this.tileSize);

        // Start game loop
        this.isRunning = true;
        this.gameLoop();
    }

    gameLoop() {
        if (!this.isRunning) return;

        this.update();
        this.render();

        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        // Update player and get current room
        const room = this.player.update();

        // Update current room display
        if (room && room !== this.currentRoom) {
            this.currentRoom = room;
            this.locationName.textContent = room.name;
        }

        // Check for interaction
        const interactRoom = this.player.canInteract();
        if (interactRoom) {
            this.interactionPrompt.textContent = `Pressione ESPAÇO: ${interactRoom.name}`;
            this.interactionPrompt.classList.add('visible');

            // Check if interact key is pressed
            if (this.player.keys.interact) {
                this.player.keys.interact = false;
                this.openModal(interactRoom.id);
            }
        } else {
            this.interactionPrompt.classList.remove('visible');
        }
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = '#0a0a0f';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Save context and apply transformations
        this.ctx.save();
        this.ctx.translate(this.offsetX, this.offsetY);
        this.ctx.scale(this.scale, this.scale);

        // Draw map
        MAP.draw(this.ctx, CONFIG.TILE_SIZE, 0, 0);

        // Draw player
        this.player.draw(this.ctx);

        // Restore context
        this.ctx.restore();

        // Draw minimap
        MAP.drawMinimap(
            this.minimapCtx,
            this.player.tileX,
            this.player.tileY,
            this.minimapCanvas.width,
            this.minimapCanvas.height
        );
    }

    openModal(roomId) {
        const content = ROOM_CONTENT[roomId];
        if (!content) return;

        this.modalIcon.textContent = content.icon;
        this.modalTitle.textContent = content.title;
        this.modalContent.innerHTML = content.content;
        this.modalOverlay.classList.add('active');

        // Pause game input while modal is open
        this.isModalOpen = true;
    }

    closeModal() {
        this.modalOverlay.classList.remove('active');
        this.isModalOpen = false;
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});
