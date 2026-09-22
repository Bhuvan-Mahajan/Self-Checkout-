const mongoose = require('mongoose');
const { Cart, Product, Order } = require('../models');
const fraudService = require('../services/fraudService');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

async function findActiveCart(userId) {
  return Cart.findOne({ userId, status: 'active' });
}

function recalculateCart(cart) {
  cart.totalAmount = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
  cart.expectedWeight = cart.items.reduce(
    (sum, item) => sum + item.unitWeight * item.quantity,
    0
  );
}

/**
 * POST /api/cart/start
 */
exports.startCart = asyncHandler(async (req, res) => {
  const { storeId } = req.body;

  if (!storeId) {
    throw new AppError('storeId is required', 400);
  }

  let cart = await findActiveCart(req.user._id);
  if (cart) {
    return res.status(200).json({ success: true, cart });
  }

  cart = await Cart.create({
    userId: req.user._id,
    storeId,
    status: 'active',
    items: [],
    totalAmount: 0,
    expectedWeight: 0,
    sensorWeight: 0,
  });

  res.status(201).json({ success: true, cart });
});

/**
 * POST /api/cart/scan
 */
exports.scanItem = asyncHandler(async (req, res) => {
  const { barcode, quantity = 1 } = req.body;
  const qty = Number(quantity) || 1;

  if (!barcode) {
    throw new AppError('barcode is required', 400);
  }

  if (qty < 1) {
    throw new AppError('quantity must be at least 1', 400);
  }

  const cart = await findActiveCart(req.user._id);
  if (!cart) {
    throw new AppError('Start a cart first', 400);
  }

  const product = await Product.findOne({ barcode: String(barcode).trim() });
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  if (!product.inStock) {
    throw new AppError('Product out of stock', 400);
  }

  const existing = cart.items.find((item) => item.productId.equals(product._id));

  if (existing) {
    existing.quantity += qty;
    existing.subtotal = existing.unitPrice * existing.quantity;
  } else {
    cart.items.push({
      productId: product._id,
      productName: product.name,
      quantity: qty,
      unitPrice: product.price,
      unitWeight: product.weightGrams,
      subtotal: product.price * qty,
    });
  }

  recalculateCart(cart);
  await cart.save();

  res.status(200).json({ success: true, cart });
});

/**
 * DELETE /api/cart/item/:productId
 */
exports.removeItem = asyncHandler(async (req, res) => {
  const cart = await findActiveCart(req.user._id);
  if (!cart) {
    throw new AppError('Start a cart first', 400);
  }

  const { productId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new AppError('Invalid ID format', 400);
  }

  const before = cart.items.length;
  cart.items = cart.items.filter(
    (item) => !item.productId.equals(productId)
  );

  if (cart.items.length === before) {
    throw new AppError('Item not found in cart', 404);
  }

  recalculateCart(cart);
  await cart.save();

  res.status(200).json({ success: true, cart });
});

/**
 * POST /api/cart/sensor-update
 */
exports.sensorUpdate = asyncHandler(async (req, res) => {
  const { weight } = req.body;

  if (weight == null || Number.isNaN(Number(weight))) {
    throw new AppError('weight is required', 400);
  }

  const cart = await findActiveCart(req.user._id);
  if (!cart) {
    throw new AppError('Start a cart first', 400);
  }

  cart.sensorWeight = Number(weight);
  const result = await fraudService.checkWeight(cart);
  await cart.save();

  res.status(200).json({
    success: true,
    sensorWeight: cart.sensorWeight,
    fraudCheck: result,
  });
});

/**
 * GET /api/cart/current
 */
exports.getCurrentCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({
    userId: req.user._id,
    status: 'active',
  }).populate('items.productId');

  res.status(200).json({
    success: true,
    cart: cart || null,
  });
});

/**
 * POST /api/cart/checkout
 */
exports.checkout = asyncHandler(async (req, res) => {
  const cart = await findActiveCart(req.user._id);
  if (!cart) {
    throw new AppError('Start a cart first', 400);
  }

  if (!cart.items.length) {
    throw new AppError('Cart is empty', 400);
  }

  if (cart.isFlagged) {
    throw new AppError('Cart has unresolved fraud alert', 400);
  }

  const order = await Order.create({
    userId: cart.userId,
    cartId: cart._id,
    storeId: cart.storeId,
    items: cart.items.map((i) => ({
      productId: i.productId,
      productName: i.productName,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      unitWeight: i.unitWeight,
      subtotal: i.subtotal,
    })),
    totalAmount: cart.totalAmount,
    status: 'pending',
  });

  cart.status = 'paid';
  cart.checkedOutAt = new Date();
  await cart.save();

  res.status(201).json({ success: true, order });
});
