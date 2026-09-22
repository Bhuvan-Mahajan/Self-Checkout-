const express = require('express');
const productController = require('../controllers/productController');
const protect = require('../middleware/protect');
const restrictTo = require('../middleware/restrictTo');

const router = express.Router();

/**
 * IMPORTANT: define /search BEFORE /:barcode
 *
 * Express matches routes in declaration order. /:barcode is a wildcard
 * segment — it would treat the literal path "search" as a barcode value
 * (Product.findOne({ barcode: 'search' })) and never reach the search
 * handler if /:barcode were registered first.
 */
router.get('/search', productController.search);

router.get('/:barcode', productController.getByBarcode);

router.post(
  '/',
  protect,
  restrictTo('admin'),
  productController.createProduct
);

// /:id/stock before /:id — same idea: more specific path first
router.patch(
  '/:id/stock',
  protect,
  restrictTo('admin', 'staff'),
  productController.toggleStock
);

router.patch(
  '/:id',
  protect,
  restrictTo('admin'),
  productController.updateProduct
);

module.exports = router;
