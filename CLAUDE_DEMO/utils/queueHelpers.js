// ═════════════════════════════════════════════════════════════════════════════════
// QUEUE HELPER UTILITIES
// ═════════════════════════════════════════════════════════════════════════════════

/**
 * Calculate estimated wait time based on position in queue and avg service time
 * @param {Object} shop - Shop object with avgServiceTime property
 * @param {number} position - Customer's position in queue (1-indexed)
 * @returns {number} Estimated wait time in minutes
 */
export const getWaitTime = (shop, position) =>
  Math.max(0, (position - 1) * shop.avgServiceTime);

/**
 * Get current user's queue entry in a specific shop
 * @param {Object} shop - Shop object with queue array
 * @param {string} userId - The user ID to search for
 * @returns {Object|undefined} Queue entry object or undefined if not found
 */
export const getUserQueueEntry = (shop, userId) =>
  shop.queue.find((c) => c.id === userId);

/**
 * Map category name to emoji for visual identification
 * @param {string} category - Shop category name
 * @returns {string} Emoji representation of the category
 */
export const getCategoryEmoji = (cat) => ({
  "Fruits & Veg": "🥕",
  "Meat": "🥩",
  "Fish": "🐟",
  "Bakery": "🥖",
  "Dairy": "🧀",
  "Spices": "🌶️",
  "Flowers": "🌸",
})[cat] || "🛒";
