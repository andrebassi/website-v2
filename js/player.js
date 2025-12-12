// ===== Player Controller =====
class Player {
    constructor(x, y, tileSize) {
        this.tileX = x;
        this.tileY = y;
        this.x = x * tileSize;
        this.y = y * tileSize;
        this.targetX = this.x;
        this.targetY = this.y;
        this.tileSize = tileSize;
        this.speed = CONFIG.PLAYER_SPEED;
        this.direction = 'down';
        this.isMoving = false;

        // Input state
        this.keys = {
            up: false,
            down: false,
            left: false,
            right: false,
            interact: false
        };

        this.setupControls();
    }

    setupControls() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.handleKeyDown(e);
        });

        document.addEventListener('keyup', (e) => {
            this.handleKeyUp(e);
        });

        // Touch/Click controls for mobile
        document.addEventListener('click', (e) => {
            this.handleClick(e);
        });
    }

    handleKeyDown(e) {
        switch(e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                this.keys.up = true;
                e.preventDefault();
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                this.keys.down = true;
                e.preventDefault();
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                this.keys.left = true;
                e.preventDefault();
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                this.keys.right = true;
                e.preventDefault();
                break;
            case ' ':
            case 'Enter':
                this.keys.interact = true;
                e.preventDefault();
                break;
        }
    }

    handleKeyUp(e) {
        switch(e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                this.keys.up = false;
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                this.keys.down = false;
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                this.keys.left = false;
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                this.keys.right = false;
                break;
            case ' ':
            case 'Enter':
                this.keys.interact = false;
                break;
        }
    }

    handleClick(e) {
        // Only handle clicks on canvas
        if (e.target.id !== 'game-canvas') return;

        const canvas = e.target;
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // Calculate target tile
        const targetTileX = Math.floor(clickX / this.tileSize);
        const targetTileY = Math.floor(clickY / this.tileSize);

        // Simple pathfinding - just move towards clicked tile
        if (MAP.isWalkable(targetTileX, targetTileY)) {
            this.moveTowardsTile(targetTileX, targetTileY);
        }
    }

    moveTowardsTile(targetTileX, targetTileY) {
        // Calculate direction to move
        const dx = targetTileX - this.tileX;
        const dy = targetTileY - this.tileY;

        if (Math.abs(dx) > Math.abs(dy)) {
            // Move horizontally first
            if (dx > 0) this.keys.right = true;
            else if (dx < 0) this.keys.left = true;
        } else {
            // Move vertically first
            if (dy > 0) this.keys.down = true;
            else if (dy < 0) this.keys.up = true;
        }

        // Reset key after a short delay
        setTimeout(() => {
            this.keys.up = false;
            this.keys.down = false;
            this.keys.left = false;
            this.keys.right = false;
        }, 100);
    }

    update() {
        // If not currently moving to a target, check for input
        if (!this.isMoving) {
            let newTileX = this.tileX;
            let newTileY = this.tileY;

            if (this.keys.up) {
                newTileY--;
                this.direction = 'up';
            } else if (this.keys.down) {
                newTileY++;
                this.direction = 'down';
            } else if (this.keys.left) {
                newTileX--;
                this.direction = 'left';
            } else if (this.keys.right) {
                newTileX++;
                this.direction = 'right';
            }

            // Check if new position is valid
            if ((newTileX !== this.tileX || newTileY !== this.tileY) && MAP.isWalkable(newTileX, newTileY)) {
                this.tileX = newTileX;
                this.tileY = newTileY;
                this.targetX = newTileX * this.tileSize;
                this.targetY = newTileY * this.tileSize;
                this.isMoving = true;
            }
        }

        // Smooth movement towards target
        if (this.isMoving) {
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < this.speed) {
                this.x = this.targetX;
                this.y = this.targetY;
                this.isMoving = false;
            } else {
                this.x += (dx / dist) * this.speed;
                this.y += (dy / dist) * this.speed;
            }
        }

        // Return current room for UI update
        return MAP.getRoomAt(this.tileX, this.tileY);
    }

    draw(ctx) {
        SPRITES.drawPlayer(ctx, this.x, this.y, this.tileSize, this.direction);
    }

    // Check if player can interact with something
    canInteract() {
        const room = MAP.getRoomAt(this.tileX, this.tileY);
        if (room && room.id !== 'reception') {
            return room;
        }
        return null;
    }

    // Get interaction prompt
    getInteractionPrompt() {
        const room = this.canInteract();
        if (room) {
            return `Pressione ESPAÇO para ver: ${room.name}`;
        }
        return null;
    }
}

window.Player = Player;
