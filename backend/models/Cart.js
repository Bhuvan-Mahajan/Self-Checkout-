const mongoose = require('mongoose');

/**
 * CartItem — embedded subdocument (lives inside Cart.items[]).
 * Not registered as its own model/collection.
 */
const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product is required'],
    },

    // Snapshot at scan time — survives later catalog price/name changes
    productName: {
      type: String,
      required: [true, 'Product name snapshot is required'],
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      default: 1,
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

    scannedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true } // each line item gets its own ObjectId (update/remove by item id)
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },

    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: [true, 'Store is required'],
    },

    items: {
      type: [cartItemSchema],
      default: [],
    },

    status: {
      type: String,
      enum: {
        values: ['active', 'paid', 'abandoned'],
        message: 'Status must be active, paid, or abandoned',
      },
      default: 'active',
    },

    totalAmount: {
      type: Number,
      default: 0,
      min: [0, 'Total amount cannot be negative'],
    },

    // Σ (unitWeight × quantity) for fraud checks vs sensorWeight
    expectedWeight: {
      type: Number,
      default: 0,
      min: [0, 'Expected weight cannot be negative'],
    },

    sensorWeight: {
      type: Number,
      default: 0,
      min: [0, 'Sensor weight cannot be negative'],
    },

    isFlagged: {
      type: Boolean,
      default: false,
    },

    exitQrCode: {
      type: String,
      default: null,
    },

    checkedOutAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Supports: find active cart for a user → { userId, status: 'active' }
cartSchema.index({ userId: 1, status: 1 });

const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

module.exports = Cart;
