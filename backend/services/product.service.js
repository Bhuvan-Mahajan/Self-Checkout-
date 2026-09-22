/**
 * services/product.service.js — Product business / data operations
 * ------------------------------------------------
 * WHY THIS FILE EXISTS SEPARATELY:
 *   Services own domain logic and Mongoose calls. Controllers stay
 *   HTTP-only; models stay schema-only. This layer is what you unit-test
 *   hardest (create product, enforce unique SKU, etc.).
 *
 * WHAT GOES HERE:
 *   - Pure async functions: listProducts, getProductById, createProduct, ...
 *   - Throw AppError for not-found / conflict cases
 *   - Import Product model; never touch req/res
 *
 * WHAT DOES NOT GO HERE:
 *   - express.Router / res.json → routes/ + controllers/
 */

// // const Product = require('../models/Product');
// // const AppError = require('../utils/AppError');

// // async function listProducts(filters) { /* Product.find(...) */ }
// // async function getProductById(id) { /* ... */ }
// // async function createProduct(payload) { /* ... */ }

// // module.exports = { listProducts, getProductById, createProduct };
