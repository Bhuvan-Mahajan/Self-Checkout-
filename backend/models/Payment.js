const mongoose = require('mongoose');

const PAYMENT_METHODS = ['upi', 'card', 'netbanking', 'wallet', 'unknown'];
const PAYMENT_STATUSES = ['created', 'captured', 'failed', 'refunded'];

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'Order is required'],
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },

    // Created via Razorpay Orders API — sent to frontend checkout
    razorpayOrderId: {
      type: String,
      required: [true, 'Razorpay order ID is required'],
      trim: true,
    },

    // Set when payment succeeds (webhook / verify callback)
    razorpayPaymentId: {
      type: String,
      default: null,
      trim: true,
    },

    // HMAC from Razorpay — verify before trusting the webhook
    razorpaySignature: {
      type: String,
      default: null,
      select: false,
    },

    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },

    method: {
      type: String,
      enum: {
        values: PAYMENT_METHODS,
        message: `Method must be one of: ${PAYMENT_METHODS.join(', ')}`,
      },
      default: 'unknown',
    },

    status: {
      type: String,
      enum: {
        values: PAYMENT_STATUSES,
        message: `Status must be one of: ${PAYMENT_STATUSES.join(', ')}`,
      },
      default: 'created',
    },

    // Client/server key so retries don't create duplicate charges
    idempotencyKey: {
      type: String,
      required: [true, 'Idempotency key is required'],
      unique: true,
      trim: true,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    // Raw webhook body for audit / debugging — never expose in APIs by default
    webhookPayload: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
      select: false,
    },

    failureReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Webhook handler: find payment by Razorpay order id
paymentSchema.index({ razorpayOrderId: 1 });

// Lookup after capture / refund flows
paymentSchema.index({ razorpayPaymentId: 1 });

// idempotencyKey unique index comes from `unique: true` on the field above

const Payment =
  mongoose.models.Payment || mongoose.model('Payment', paymentSchema);

module.exports = Payment;
module.exports.PAYMENT_METHODS = PAYMENT_METHODS;
module.exports.PAYMENT_STATUSES = PAYMENT_STATUSES;
