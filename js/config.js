// ===== Game Configuration =====
const CONFIG = {
    // Tile size in pixels
    TILE_SIZE: 32,

    // Map dimensions in tiles
    MAP_WIDTH: 20,
    MAP_HEIGHT: 15,

    // Player settings
    PLAYER_SPEED: 3,

    // Colors
    COLORS: {
        floor: '#2d2d44',
        wall: '#1a1a2e',
        carpet: '#3d3d5c',
        desk: '#5c4033',
        plant: '#2e7d32',
        door: '#4fc3f7',
        highlight: '#7c4dff'
    },

    // Room types
    ROOM_TYPES: {
        RECEPTION: 'reception',
        OFFICE: 'office',
        PROJECTS: 'projects',
        MEETING: 'meeting',
        LIBRARY: 'library',
        TROPHY: 'trophy'
    }
};

// Tile types for the map
const TILES = {
    EMPTY: 0,
    FLOOR: 1,
    WALL: 2,
    DOOR: 3,
    DESK: 4,
    CHAIR: 5,
    PLANT: 6,
    BOOKSHELF: 7,
    COMPUTER: 8,
    TROPHY: 9,
    CARPET: 10,
    ENTRANCE: 11
};

// Make config globally available
window.CONFIG = CONFIG;
window.TILES = TILES;
