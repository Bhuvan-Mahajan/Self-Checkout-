/**
 * services/cart.service.js — Cart business rules (smart-cart core)
 * ------------------------------------------------
 * WHY THIS FILE EXISTS SEPARATELY:
 *   Smart-cart logic (merge same SKU, stock checks, price snapshots,
 *   totals) is multi-step and model-spanning. A dedicated service
 *   prevents duplicating that logic across controllers or routes.
 *
 * WHAT GOES HERE:
 *   - addItemToCart, updateItemQuantity, removeItem, getCartWithTotals
 *   - Coordinate Product + Cart models
 *   - Domain errors via AppError (e.g. insufficient stock)
 *
 * WHAT DOES NOT GO HERE:
 *   - Zod request validation     → middleware/validate.js
 *   - Setting HTTP status codes  → controllers/
 */

// // const Cart = require('../models/Cart');
// // const Product = require('../models/Product');
// // const AppError = require('../utils/AppError');

// // async function getCart(cartId) { /* ... */ }
// // async function createCart(owner) { /* ... */ }
// // async function addItem(cartId, { productId, quantity }) { /* ... */ }
// // async function updateItem(cartId, itemId, quantity) { /* ... */ }
// // async function removeItem(cartId, itemId) { /* ... */ }

// // module.exports = { getCart, createCart, addItem, updateItem, removeItem };
