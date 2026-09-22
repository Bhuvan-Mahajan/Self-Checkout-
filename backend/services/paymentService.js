const crypto = require('crypto');
const Razorpay = require('razorpay');
const { v4: uuidv4 } = require('uuid');

const env = require('../config/env');
const { Payment, Order, Cart } = require('../models');
const AppError = require('../utils/AppError');

const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET,
});

const ALLOWED_METHODS = ['upi', 'card', 'netbanking', 'wallet', 'unknown'];

function normalizeMethod(method) {
  return ALLOWED_METHODS.includes(method) ? method : 'unknown';
}

/**
 * Create a Razorpay order + local Payment row for checkout.
 */
async function createRazorpayOrder(order, user) {
  const razorpayOrder = await razorpay.orders.create({
    amount: order.totalAmount, // paise
    currency: 'INR',
    receipt: order.orderNumber,
    notes: {
      orderId: order._id.toString(),
      userId: user._id.toString(),
    },
  });

  const idempotencyKey = uuidv4();

  const payment = await Payment.create({
    orderId: order._id,
    userId: user._id,
    razorpayOrderId: razorpayOrder.id,
    amount: order.totalAmount,
    status: 'created',
    idempotencyKey,
  });

  return {
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    paymentId: payment._id,
    key: env.RAZORPAY_KEY_ID,
  };
}

/**
 * Verify Razorpay webhook HMAC.
 * Anyone can POST a fake body to /webhooks; the signature proves Razorpay signed it.
 */
function verifyWebhook(body, signature) {
  // Razorpay signs the exact raw bytes. Re-stringifying parsed JSON can
  // change key order/spacing and fail verification — prefer Buffer/string.
  const payload = Buffer.isBuffer(body)
    ? body
    : typeof body === 'string'
      ? body
      : JSON.stringify(body);

  const expectedSignature = crypto
    .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
    .update(payload)
    .digest('hex');

  const expected = Buffer.from(expectedSignature, 'utf8');
  const received = Buffer.from(String(signature || ''), 'utf8');

  // timingSafeEqual resists timing attacks (=== can leak how far strings match).
  // Lengths must be equal or timingSafeEqual throws.
  if (expected.length !== received.length) {
    throw new AppError('Invalid webhook signature', 400);
  }

  const matches = crypto.timingSafeEqual(expected, received);
  if (!matches) {
    throw new AppError('Invalid webhook signature', 400);
  }

  return true;
}

/**
 * payment.captured webhook — mark payment + order paid, issue exit QR.
 */
async function handlePaymentCaptured(payload) {
  const entity = payload?.payment?.entity;
  if (!entity) {
    throw new AppError('Invalid payment payload', 400);
  }

  const razorpayPaymentId = entity.id;
  const razorpayOrderId = entity.order_id;

  const payment = await Payment.findOne({ razorpayOrderId });
  if (!payment) {
    throw new AppError('Payment not found', 404);
  }

  payment.status = 'captured';
  payment.razorpayPaymentId = razorpayPaymentId;
  payment.method = normalizeMethod(entity.method);
  payment.paidAt = new Date();
  payment.webhookPayload = payload;
  await payment.save();

  const order = await Order.findById(payment.orderId);
  if (!order) {
    throw new AppError('Order not found', 404);
  }

  order.status = 'paid';
  await order.save();

  const exitQrCode = uuidv4();

  await Cart.findOneAndUpdate(
    { _id: order.cartId },
    { exitQrCode, checkedOutAt: new Date() }
  );

  return { order, exitQrCode };
}

/**
 * payment.failed webhook
 */
async function handlePaymentFailed(payload) {
  const entity = payload?.payment?.entity;
  const razorpayOrderId = entity?.order_id || payload?.razorpayOrderId;

  const payment = await Payment.findOne({ razorpayOrderId });
  if (!payment) {
    throw new AppError('Payment not found', 404);
  }

  payment.status = 'failed';
  payment.failureReason = entity?.error_description || 'Payment failed';
  payment.webhookPayload = payload;
  await payment.save();

  await Order.findByIdAndUpdate(payment.orderId, { status: 'failed' });

  return { success: true };
}

module.exports = {
  createRazorpayOrder,
  verifyWebhook,
  handlePaymentCaptured,
  handlePaymentFailed,
};
