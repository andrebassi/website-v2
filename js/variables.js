// ===== Feature Toggles =====
const CONFIG = {
    // ===== Background Mode =====
    // Options: 'video' or 'images'
    backgroundMode: 'video',

    // Video URLs (rotate through these when backgroundMode is 'video')
    // Source: Mixkit.co - Free stock videos
    backgroundVideos: [
        'https://assets.mixkit.co/videos/23219/23219-720.mp4',  // Long hallway in data center
        'https://assets.mixkit.co/videos/7887/7887-720.mp4',    // Datacenter racks
        'https://assets.mixkit.co/videos/23281/23281-720.mp4',  // Hands working with laptop in datacenter
        'https://assets.mixkit.co/videos/23282/23282-720.mp4',  // Bluish data center hallway
        'https://assets.mixkit.co/videos/23374/23374-720.mp4',  // Timelapse engineers in data center
        'https://assets.mixkit.co/videos/23218/23218-720.mp4',  // IT specialist in data center
        'https://assets.mixkit.co/videos/23162/23162-720.mp4',  // Engineer walking among server racks
        'https://assets.mixkit.co/videos/7888/7888-720.mp4',    // Large datacenter
        'https://assets.mixkit.co/videos/23380/23380-720.mp4',  // Time lapse engineers in data center
        'https://assets.mixkit.co/videos/23108/23108-720.mp4',  // Walking in server room
        'https://assets.mixkit.co/videos/23215/23215-720.mp4',  // Close up of server racks lights
        'https://assets.mixkit.co/videos/23216/23216-720.mp4',  // Long server rack hallway
        'https://assets.mixkit.co/videos/22981/22981-720.mp4',  // Young engineer walking through data center
    ],

    // Video rotation interval in milliseconds
    videoRotationInterval: 10000,  // 10 seconds

    // ===== Seasonal Effects =====
    // Christmas: Dec 24-26
    christmas: {
        startMonth: 12,  // December
        startDay: 24,
        endMonth: 12,
        endDay: 26,
        forceTest: false  // Set to true to test Christmas effects
    },

    // New Year: Dec 31 - Jan 7
    newYear: {
        startMonth: 12,  // December
        startDay: 31,
        endMonth: 1,     // January
        endDay: 7,
        forceTest: false  // Set to true to test New Year effects
    }
};
