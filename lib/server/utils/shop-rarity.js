/**
 * Utility function to determine shop item rarity based on eventId
 * If item has eventId -> "exclusive" (limited time)
 * If item has no eventId -> "common" (permanent)
 * 
 * @param {string | null} eventId - Event ID from shop item
 * @returns {string} - Rarity level: "exclusive" or "common"
 */
export const determineItemRarity = (eventId) => {
  return eventId ? "exclusive" : "common";
};

/**
 * Helper to enrich shop item with computed rarity
 * @param {object} item - Shop item from database
 * @returns {object} - Shop item with rarity field
 */
export const enrichShopItemWithRarity = (item) => {
  return {
    ...item,
    rarity: determineItemRarity(item.eventId),
  };
};

/**
 * Helper to enrich multiple shop items
 * @param {array} items - Array of shop items
 * @returns {array} - Shop items with rarity enriched
 */
export const enrichShopItemsWithRarity = (items) => {
  return items.map(enrichShopItemWithRarity);
};
