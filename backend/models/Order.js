const mongoose = require('mongoose');

/**
 * OrderItem — embedded snapshot of a purchased line.
 * _id: false — line items are not updated individually after checkout.
 */
const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },

    productName: {
      type: String,
      required: [true, 'Product name snapshot is required'],
      trim: true,
    },

    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },

    unitPrice: {
      type: Number,
      required: [true, 'Unit price snapshot is required'],
      min: [0, 'Unit price cannot be negative'],
    },

    unitWeight: {
      type: Number,
      required: [true, 'Unit weight snapshot is required'],
      min: [0, 'Unit weight cannot be negative'],
    },

    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required'],
      min: [0, 'Subtotal cannot be negative'],
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },

    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cart',
      required: [true, 'Cart is required'],
    },

    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: [true, 'Store is required'],
    },

    items: {
      type: [orderItemSchema],
      default: [],
      validate: {
        validator(items) {
          return Array.isArray(items) && items.length > 0;
        },
        message: 'Order must contain at least one item',
      },
    },

    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative'],
    },

    status: {
      type: String,
      enum: {
        values: ['pending', 'paid', 'failed', 'refunded'],
        message: 'Status must be pending, paid, failed, or refunded',
      },
      default: 'pending',
    },

    // Human-readable id; auto-set in pre-save if missing (SC-YYYY-NNNNN)
    orderNumber: {
      type: String,
      unique: true,
      trim: true,
      uppercase: true,
    },

    receiptUrl: {
      type: String,
      default: null,
    },

    taxAmount: {
      type: Number,
      default: 0,
      min: [0, 'Tax amount cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// User order history — newest first
orderSchema.index({ userId: 1, createdAt: -1 });

// Store daily sales / admin dashboards — newest first
orderSchema.index({ storeId: 1, createdAt: -1 });

/**
 * Auto-generate orderNumber: SC-YYYY-NNNNN (e.g. SC-2026-00042)
 * Runs only when orderNumber is not already set.
 *
 * Note: countDocuments + concurrent inserts can race; unique index on
 * orderNumber will reject duplicates — caller may retry on 11000.
 */
orderSchema.pre('save', async function () {
  if (this.orderNumber) {
    return;
  }

  const year = new Date().getFullYear();
  const prefix = `SC-${year}-`;

  const count = await this.constructor.countDocuments({
    orderNumber: new RegExp(`^${prefix}`),
  });

  this.orderNumber = `${prefix}${String(count + 1).padStart(5, '0')}`;
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

module.exports = Order;
