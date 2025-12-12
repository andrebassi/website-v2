// ===== Pixel Art Sprite Definitions =====
const SPRITES = {
    // Draw a single tile
    drawTile(ctx, type, x, y, size) {
        const px = x * size;
        const py = y * size;

        switch(type) {
            case TILES.FLOOR:
                this.drawFloor(ctx, px, py, size);
                break;
            case TILES.WALL:
                this.drawWall(ctx, px, py, size);
                break;
            case TILES.DOOR:
                this.drawDoor(ctx, px, py, size);
                break;
            case TILES.DESK:
                this.drawDesk(ctx, px, py, size);
                break;
            case TILES.CHAIR:
                this.drawChair(ctx, px, py, size);
                break;
            case TILES.PLANT:
                this.drawPlant(ctx, px, py, size);
                break;
            case TILES.BOOKSHELF:
                this.drawBookshelf(ctx, px, py, size);
                break;
            case TILES.COMPUTER:
                this.drawComputer(ctx, px, py, size);
                break;
            case TILES.TROPHY:
                this.drawTrophy(ctx, px, py, size);
                break;
            case TILES.CARPET:
                this.drawCarpet(ctx, px, py, size);
                break;
            case TILES.ENTRANCE:
                this.drawEntrance(ctx, px, py, size);
                break;
        }
    },

    // Floor tile
    drawFloor(ctx, x, y, size) {
        ctx.fillStyle = '#2d2d44';
        ctx.fillRect(x, y, size, size);
        // Grid pattern
        ctx.strokeStyle = '#252538';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, size, size);
    },

    // Wall tile
    drawWall(ctx, x, y, size) {
        // Base wall
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(x, y, size, size);
        // Brick pattern
        ctx.fillStyle = '#16213e';
        ctx.fillRect(x + 2, y + 2, size/2 - 3, size/2 - 3);
        ctx.fillRect(x + size/2 + 1, y + size/2 + 1, size/2 - 3, size/2 - 3);
        ctx.fillRect(x + size/2 + 1, y + 2, size/2 - 3, size/2 - 3);
        ctx.fillRect(x + 2, y + size/2 + 1, size/2 - 3, size/2 - 3);
    },

    // Door/Entrance to room
    drawDoor(ctx, x, y, size) {
        // Floor under door
        this.drawFloor(ctx, x, y, size);
        // Door frame
        ctx.fillStyle = '#4fc3f7';
        ctx.fillRect(x + 4, y, size - 8, 4);
        // Glow effect
        ctx.fillStyle = 'rgba(79, 195, 247, 0.3)';
        ctx.fillRect(x + 2, y + 4, size - 4, size - 4);
    },

    // Desk
    drawDesk(ctx, x, y, size) {
        this.drawFloor(ctx, x, y, size);
        // Desk top
        ctx.fillStyle = '#5c4033';
        ctx.fillRect(x + 2, y + 8, size - 4, size - 12);
        // Desk legs
        ctx.fillStyle = '#3e2723';
        ctx.fillRect(x + 4, y + size - 6, 4, 4);
        ctx.fillRect(x + size - 8, y + size - 6, 4, 4);
    },

    // Chair
    drawChair(ctx, x, y, size) {
        this.drawFloor(ctx, x, y, size);
        // Seat
        ctx.fillStyle = '#424242';
        ctx.fillRect(x + 6, y + 10, size - 12, size - 14);
        // Back
        ctx.fillStyle = '#303030';
        ctx.fillRect(x + 8, y + 4, size - 16, 8);
    },

    // Plant
    drawPlant(ctx, x, y, size) {
        this.drawFloor(ctx, x, y, size);
        // Pot
        ctx.fillStyle = '#8d6e63';
        ctx.fillRect(x + 8, y + size - 10, size - 16, 8);
        // Plant leaves
        ctx.fillStyle = '#2e7d32';
        ctx.beginPath();
        ctx.arc(x + size/2, y + size/2 - 2, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#388e3c';
        ctx.beginPath();
        ctx.arc(x + size/2 - 4, y + size/2 - 6, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + size/2 + 4, y + size/2 - 4, 5, 0, Math.PI * 2);
        ctx.fill();
    },

    // Bookshelf
    drawBookshelf(ctx, x, y, size) {
        this.drawFloor(ctx, x, y, size);
        // Shelf frame
        ctx.fillStyle = '#5c4033';
        ctx.fillRect(x + 2, y + 2, size - 4, size - 4);
        // Books
        const bookColors = ['#e53935', '#1e88e5', '#43a047', '#fb8c00', '#8e24aa'];
        for (let i = 0; i < 5; i++) {
            ctx.fillStyle = bookColors[i];
            ctx.fillRect(x + 4 + i * 5, y + 4, 4, size - 10);
        }
    },

    // Computer
    drawComputer(ctx, x, y, size) {
        this.drawFloor(ctx, x, y, size);
        // Monitor
        ctx.fillStyle = '#212121';
        ctx.fillRect(x + 4, y + 4, size - 8, size - 14);
        // Screen
        ctx.fillStyle = '#4fc3f7';
        ctx.fillRect(x + 6, y + 6, size - 12, size - 20);
        // Stand
        ctx.fillStyle = '#424242';
        ctx.fillRect(x + size/2 - 3, y + size - 10, 6, 4);
        ctx.fillRect(x + size/2 - 6, y + size - 6, 12, 2);
    },

    // Trophy
    drawTrophy(ctx, x, y, size) {
        this.drawFloor(ctx, x, y, size);
        // Trophy cup
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(x + 8, y + 6, size - 16, size - 16);
        // Handles
        ctx.fillRect(x + 4, y + 8, 4, 8);
        ctx.fillRect(x + size - 8, y + 8, 4, 8);
        // Base
        ctx.fillStyle = '#5c4033';
        ctx.fillRect(x + 6, y + size - 8, size - 12, 6);
    },

    // Carpet
    drawCarpet(ctx, x, y, size) {
        ctx.fillStyle = '#3d3d5c';
        ctx.fillRect(x, y, size, size);
        // Pattern
        ctx.fillStyle = '#4a4a6a';
        ctx.fillRect(x + 4, y + 4, size - 8, size - 8);
    },

    // Entrance mat
    drawEntrance(ctx, x, y, size) {
        this.drawFloor(ctx, x, y, size);
        // Mat
        ctx.fillStyle = '#7c4dff';
        ctx.fillRect(x + 2, y + 2, size - 4, size - 4);
        ctx.fillStyle = '#9575cd';
        ctx.fillRect(x + 4, y + 4, size - 8, size - 8);
    },

    // Player avatar
    drawPlayer(ctx, x, y, size, direction) {
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(x + size/2, y + size - 4, size/3, size/6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.fillStyle = '#4fc3f7';
        ctx.fillRect(x + 8, y + 12, size - 16, size - 16);

        // Head
        ctx.fillStyle = '#ffcc80';
        ctx.fillRect(x + 10, y + 4, size - 20, 10);

        // Eyes based on direction
        ctx.fillStyle = '#212121';
        if (direction === 'down' || direction === 'idle') {
            ctx.fillRect(x + 12, y + 8, 3, 3);
            ctx.fillRect(x + size - 15, y + 8, 3, 3);
        } else if (direction === 'up') {
            // Back of head
        } else if (direction === 'left') {
            ctx.fillRect(x + 10, y + 8, 3, 3);
        } else if (direction === 'right') {
            ctx.fillRect(x + size - 13, y + 8, 3, 3);
        }

        // Hair
        ctx.fillStyle = '#5d4037';
        ctx.fillRect(x + 10, y + 2, size - 20, 4);
    },

    // Room label
    drawRoomLabel(ctx, text, x, y) {
        ctx.font = '10px "Press Start 2P"';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        const metrics = ctx.measureText(text);
        ctx.fillRect(x - metrics.width/2 - 6, y - 8, metrics.width + 12, 18);
        ctx.fillStyle = '#4fc3f7';
        ctx.textAlign = 'center';
        ctx.fillText(text, x, y + 4);
    }
};

window.SPRITES = SPRITES;
