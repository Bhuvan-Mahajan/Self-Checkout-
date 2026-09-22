const { Order, Payment } = require('../models');
const paymentService = require('../services/paymentService');
const env = require('../config/env');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

function paymentPublicView(payment) {
  return {
    razorpayOrderId: payment.razorpayOrderId,
    amount: payment.amount,
    currency: 'INR',
    paymentId: payment._id,
    status: payment.status,
    key: env.RAZORPAY_KEY_ID,
  };
}

/**
 * POST /api/payments/create
 */
exports.createPayment = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    throw new AppError('orderId is required', 400);
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (!order.userId.equals(req.user._id)) {
    throw new AppError('Order not found', 404);
  }

  if (order.status !== 'pending') {
    throw new AppError('Order already paid or failed', 400);
  }

  const existing = await Payment.findOne({
    orderId,
    status: { $ne: 'failed' },
  });

  if (existing) {
    return res.status(200).json({
      success: true,
      payment: paymentPublicView(existing),
    });
  }

  const result = await paymentService.createRazorpayOrder(order, req.user);

  res.status(201).json({
    success: true,
    payment: result,
  });
});

/**
 * POST /api/payments/webhook
 *
 * Do NOT wrap with asyncHandler:
 * Razorpay retries the webhook on non-2xx. asyncHandler would send every
 * throw (DB blip, missing payment) through the global errorHandler as 500,
 * causing retry storms. This handler always returns 200 after a valid
 * signature (or 400 for a bad signature) so Razorpay can stop retrying.
 *
 * Also: this route is not authenticated — Razorpay is the caller, not req.user.
 */
exports.webhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    paymentService.verifyWebhook(req.body, signature);

    let payload = req.body;
    if (Buffer.isBuffer(payload)) {
      payload = JSON.parse(payload.toString('utf8'));
    }

    if (payload.event === 'payment.captured') {
      await paymentService.handlePaymentCaptured(payload);
    } else if (payload.event === 'payment.failed') {
      await paymentService.handlePaymentFailed(payload);
    }
    // other events: acknowledge and ignore

    return res.status(200).json({ success: true });
  } catch (err) {
    return next(err);
  }
};

/**
 * GET /api/payments/:orderId
 */
exports.getPaymentStatus = asyncHandler(async (req, res) => {
  const payment = await Payment.findOne({ orderId: req.params.orderId });

  if (!payment) {
    throw new AppError('Payment not found', 404);
  }

  if (!payment.userId.equals(req.user._id)) {
    throw new AppError('Payment not found', 404);
  }

  res.status(200).json({
    success: true,
    payment,
  });
});
