// ===== Feature Toggles =====
const CONFIG = {
    // Set to false when you find a new opportunity
    availableForWork: false,

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