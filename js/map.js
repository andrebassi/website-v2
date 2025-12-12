// ===== Office Map Definition =====
const MAP = {
    // Map layout using TILES constants
    // 0 = Empty, 1 = Floor, 2 = Wall, 3 = Door, etc.
    layout: [
        // Row 0 - Top wall
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        // Row 1
        [2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        // Row 2
        [2, 1, 8, 4, 1, 2, 1, 7, 7, 1, 2, 1, 6, 1, 1, 9, 9, 1, 6, 2],
        // Row 3
        [2, 1, 5, 1, 1, 3, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        // Row 4
        [2, 1, 1, 1, 1, 2, 1, 6, 1, 1, 2, 1, 1, 4, 8, 1, 4, 8, 1, 2],
        // Row 5 - Middle wall with doors
        [2, 2, 2, 3, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2],
        // Row 6
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        // Row 7 - Reception / Main Hall
        [2, 1, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 1, 2],
        // Row 8
        [2, 1, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 1, 2],
        // Row 9
        [2, 1, 1, 1, 1, 1, 1, 1, 11, 11, 11, 11, 1, 1, 1, 1, 1, 1, 1, 2],
        // Row 10
        [2, 6, 1, 4, 5, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 7, 7, 7, 6, 2],
        // Row 11
        [2, 1, 1, 8, 1, 1, 3, 1, 1, 6, 6, 1, 1, 3, 1, 1, 1, 1, 1, 2],
        // Row 12
        [2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 5, 4, 1, 2],
        // Row 13
        [2, 1, 6, 1, 6, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 8, 1, 2],
        // Row 14 - Bottom wall
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    ],

    // Room definitions with boundaries and metadata
    rooms: [
        {
            id: 'office',
            name: 'Meu Escritório',
            icon: '💼',
            bounds: { x1: 1, y1: 1, x2: 4, y2: 4 },
            doorTiles: [{ x: 5, y: 3 }],
            description: 'Sobre mim'
        },
        {
            id: 'library',
            name: 'Biblioteca',
            icon: '📚',
            bounds: { x1: 6, y1: 1, x2: 9, y2: 4 },
            doorTiles: [{ x: 8, y: 5 }],
            description: 'Artigos Técnicos'
        },
        {
            id: 'trophy',
            name: 'Sala de Troféus',
            icon: '🏆',
            bounds: { x1: 11, y1: 1, x2: 18, y2: 4 },
            doorTiles: [{ x: 10, y: 3 }],
            description: 'Experiência'
        },
        {
            id: 'reception',
            name: 'Recepção',
            icon: '🏠',
            bounds: { x1: 1, y1: 6, x2: 18, y2: 9 },
            doorTiles: [],
            description: 'Bem-vindo!'
        },
        {
            id: 'projects',
            name: 'Sala de Projetos',
            icon: '💻',
            bounds: { x1: 1, y1: 10, x2: 5, y2: 13 },
            doorTiles: [{ x: 6, y: 11 }],
            description: 'Projetos Open Source'
        },
        {
            id: 'meeting',
            name: 'Sala de Reuniões',
            icon: '🤝',
            bounds: { x1: 7, y1: 10, x2: 12, y2: 13 },
            doorTiles: [{ x: 13, y: 11 }],
            description: 'Contato'
        },
        {
            id: 'skills',
            name: 'Sala de Skills',
            icon: '⚡',
            bounds: { x1: 14, y1: 10, x2: 18, y2: 13 },
            doorTiles: [{ x: 15, y: 5 }],
            description: 'Tecnologias'
        }
    ],

    // Get tile at position
    getTile(x, y) {
        if (y < 0 || y >= this.layout.length || x < 0 || x >= this.layout[0].length) {
            return TILES.WALL;
        }
        return this.layout[y][x];
    },

    // Check if tile is walkable
    isWalkable(x, y) {
        const tile = this.getTile(x, y);
        // Walls and furniture are not walkable
        return tile !== TILES.WALL &&
               tile !== TILES.DESK &&
               tile !== TILES.BOOKSHELF &&
               tile !== TILES.TROPHY &&
               tile !== TILES.EMPTY;
    },

    // Get room at position
    getRoomAt(x, y) {
        for (const room of this.rooms) {
            if (x >= room.bounds.x1 && x <= room.bounds.x2 &&
                y >= room.bounds.y1 && y <= room.bounds.y2) {
                return room;
            }
        }
        return null;
    },

    // Check if position is near a door
    isNearDoor(x, y) {
        for (const room of this.rooms) {
            for (const door of room.doorTiles) {
                const dist = Math.abs(x - door.x) + Math.abs(y - door.y);
                if (dist <= 1) {
                    return room;
                }
            }
        }
        return null;
    },

    // Draw the map
    draw(ctx, tileSize, offsetX = 0, offsetY = 0) {
        for (let y = 0; y < this.layout.length; y++) {
            for (let x = 0; x < this.layout[y].length; x++) {
                const tile = this.layout[y][x];
                if (tile !== TILES.EMPTY) {
                    SPRITES.drawTile(ctx, tile, x + offsetX/tileSize, y + offsetY/tileSize, tileSize);
                }
            }
        }

        // Draw room labels
        for (const room of this.rooms) {
            const centerX = ((room.bounds.x1 + room.bounds.x2) / 2) * tileSize + offsetX;
            const centerY = room.bounds.y1 * tileSize + offsetY - 5;
            SPRITES.drawRoomLabel(ctx, room.name, centerX, centerY);
        }
    },

    // Draw minimap
    drawMinimap(ctx, playerX, playerY, width, height) {
        const scaleX = width / (this.layout[0].length * CONFIG.TILE_SIZE);
        const scaleY = height / (this.layout.length * CONFIG.TILE_SIZE);
        const scale = Math.min(scaleX, scaleY);

        ctx.clearRect(0, 0, width, height);

        // Draw tiles
        for (let y = 0; y < this.layout.length; y++) {
            for (let x = 0; x < this.layout[y].length; x++) {
                const tile = this.layout[y][x];
                const px = x * CONFIG.TILE_SIZE * scale;
                const py = y * CONFIG.TILE_SIZE * scale;
                const size = CONFIG.TILE_SIZE * scale;

                if (tile === TILES.WALL) {
                    ctx.fillStyle = '#1a1a2e';
                } else if (tile === TILES.DOOR) {
                    ctx.fillStyle = '#4fc3f7';
                } else if (tile !== TILES.EMPTY) {
                    ctx.fillStyle = '#2d2d44';
                } else {
                    continue;
                }
                ctx.fillRect(px, py, size, size);
            }
        }

        // Draw player position
        ctx.fillStyle = '#ff5722';
        const playerPx = playerX * scale;
        const playerPy = playerY * scale;
        ctx.beginPath();
        ctx.arc(playerPx + CONFIG.TILE_SIZE * scale / 2, playerPy + CONFIG.TILE_SIZE * scale / 2, 4, 0, Math.PI * 2);
        ctx.fill();
    }
};

window.MAP = MAP;
