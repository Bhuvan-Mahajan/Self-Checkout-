const { FraudAlert, Cart, Order, Product } = require('../models');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

function dayRange(dateInput) {
  const base = dateInput ? new Date(dateInput) : new Date();
  const start = new Date(base);
  start.setHours(0, 0, 0, 0);
  const end = new Date(base);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

function parsePageLimit(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.max(1, parseInt(query.limit, 10) || 20);
  return { page, limit, skip: (page - 1) * limit };
}

/**
 * GET /api/admin/alerts
 */
exports.getAlerts = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePageLimit(req.query);

  const query = {
    resolved: req.query.resolved === undefined ? false : req.query.resolved === 'true',
  };

  if (req.query.severity) {
    query.severity = req.query.severity;
  }

  const alerts = await FraudAlert.find(query)
    .populate('userId', 'name phone')
    .populate('cartId', 'totalAmount status')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: alerts.length,
    page,
    alerts,
  });
});

/**
 * PATCH /api/admin/alerts/:id
 */
exports.resolveAlert = asyncHandler(async (req, res) => {
  const { resolutionNote } = req.body;

  const alert = await FraudAlert.findById(req.params.id);
  if (!alert) {
    throw new AppError('Alert not found', 404);
  }

  if (alert.resolved) {
    throw new AppError('Already resolved', 400);
  }

  alert.resolved = true;
  alert.resolvedBy = req.user._id;
  alert.resolvedAt = new Date();
  alert.resolutionNote = resolutionNote || null;
  await alert.save();

  await Cart.findByIdAndUpdate(alert.cartId, { isFlagged: false });

  // Lazy require — app.js already imported this controller at boot
  const { io } = require('../app');
  if (io) {
    io.emit('alert-resolved', { alertId: alert._id });
  }

  res.status(200).json({ success: true, alert });
});

/**
 * GET /api/admin/orders
 */
exports.getOrders = asyncHandler(async (req, res) => {
  const { date, status } = req.query;
  const { page, limit, skip } = parsePageLimit(req.query);
  const { start, end } = dayRange(date);

  const query = {
    createdAt: { $gte: start, $lte: end },
  };

  if (status) {
    query.status = status;
  }

  const orders = await Order.find(query)
    .populate('userId', 'name phone')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});

/**
 * GET /api/admin/stats
 */
exports.getStats = asyncHandler(async (req, res) => {
  const { start, end } = dayRange();
  const today = { $gte: start, $lte: end };

  const [totalOrders, revenueAgg, activeCarts, fraudAlerts, topProducts] =
    await Promise.all([
      Order.countDocuments({ status: 'paid', createdAt: today }),
      Order.aggregate([
        { $match: { status: 'paid', createdAt: today } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Cart.countDocuments({ status: 'active' }),
      FraudAlert.countDocuments({ resolved: false, createdAt: today }),
      Order.aggregate([
        { $match: { status: 'paid', createdAt: today } },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.productName',
            totalQuantity: { $sum: '$items.quantity' },
          },
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 5 },
        {
          $project: {
            _id: 0,
            productName: '$_id',
            totalQuantity: 1,
          },
        },
      ]),
    ]);

  res.status(200).json({
    success: true,
    stats: {
      totalOrders,
      totalRevenue: revenueAgg[0]?.total || 0,
      activeCarts,
      fraudAlerts,
      topProducts,
    },
  });
});

/**
 * GET /api/admin/products
 */
exports.getProducts = asyncHandler(async (req, res) => {
  const { storeId, category, inStock } = req.query;

  if (!storeId) {
    throw new AppError('storeId is required', 400);
  }

  const { page, limit, skip } = parsePageLimit(req.query);
  const query = { storeId };

  if (category) query.category = category;
  if (inStock !== undefined) {
    query.inStock = inStock === 'true';
  }

  const products = await Product.find(query)
    .sort({ name: 1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});
