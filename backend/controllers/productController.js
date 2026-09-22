const { Product } = require('../models');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * GET /api/products/:barcode
 * Hot path — barcode scan lookup
 */
exports.getByBarcode = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ barcode: req.params.barcode }).populate(
    'storeId',
    'name address'
  );

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  if (!product.inStock) {
    throw new AppError('Product out of stock', 400);
  }

  res.status(200).json({
    success: true,
    product,
  });
});

/**
 * GET /api/products/search?q=biscuit&storeId=xxx
 */
exports.search = asyncHandler(async (req, res) => {
  const { q, storeId } = req.query;

  if (!q || !storeId) {
    throw new AppError('Query params q and storeId are required', 400);
  }

  const products = await Product.find({
    $text: { $search: q },
    storeId,
  }).limit(10);

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});

/**
 * POST /api/products
 * Admin only — prices from frontend are in rupees → store as paise
 */
exports.createProduct = asyncHandler(async (req, res) => {
  const {
    barcode,
    name,
    brand,
    category,
    price,
    mrp,
    weightGrams,
    weightTolerance,
    imageUrl,
    storeId,
    taxPercent,
  } = req.body;

  if (barcode == null || name == null || category == null || price == null || weightGrams == null || storeId == null) {
    throw new AppError(
      'barcode, name, category, price, weightGrams, and storeId are required',
      400
    );
  }

  const existing = await Product.findOne({ barcode: String(barcode).trim() });
  if (existing) {
    throw new AppError('Product with this barcode already exists', 409);
  }

  const product = await Product.create({
    barcode: String(barcode).trim(),
    name,
    brand,
    category,
    price: Math.round(Number(price) * 100),
    mrp: mrp != null ? Math.round(Number(mrp) * 100) : undefined,
    weightGrams,
    weightTolerance,
    imageUrl,
    storeId,
    taxPercent,
  });

  res.status(201).json({
    success: true,
    product,
  });
});

/**
 * PATCH /api/products/:id
 * Admin only
 */
exports.updateProduct = asyncHandler(async (req, res) => {
  const updates = { ...req.body };

  if (updates.price != null) {
    updates.price = Math.round(Number(updates.price) * 100);
  }

  if (updates.mrp != null) {
    updates.mrp = Math.round(Number(updates.mrp) * 100);
  }

  const product = await Product.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  res.status(200).json({
    success: true,
    product,
  });
});

/**
 * PATCH /api/products/:id/stock
 * Admin / staff — flip inStock
 */
exports.toggleStock = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  product.inStock = !product.inStock;
  await product.save();

  res.status(200).json({
    success: true,
    inStock: product.inStock,
  });
});
