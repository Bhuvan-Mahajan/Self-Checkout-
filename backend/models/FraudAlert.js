const mongoose = require('mongoose');

const SEVERITIES = ['low', 'medium', 'high'];

/**
 * Derive severity from absolute weight mismatch (grams).
 * low < 50 | medium 50–200 | high > 200
 */
function severityFromDifference(difference) {
  const abs = Math.abs(difference);
  if (abs < 50) return 'low';
  if (abs < 200) return 'medium';
  return 'high';
}

const fraudAlertSchema = new mongoose.Schema(
  {
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cart',
      required: [true, 'Cart is required'],
    },

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

    expectedWeight: {
      type: Number,
      required: [true, 'Expected weight is required'],
    },

    sensorWeight: {
      type: Number,
      required: [true, 'Sensor weight is required'],
    },

    // sensorWeight - expectedWeight (may be negative)
    difference: {
      type: Number,
      required: [true, 'Difference is required'],
    },

    severity: {
      type: String,
      enum: {
        values: SEVERITIES,
        message: 'Severity must be low, medium, or high',
      },
      required: [true, 'Severity is required'],
    },

    resolved: {
      type: Boolean,
      default: false,
    },

    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    resolvedAt: {
      type: Date,
      default: null,
    },

    resolutionNote: {
      type: String,
      default: null,
      trim: true,
    },

    rescanRequested: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Keep severity in sync with |difference| before validation.
 * Staff/API cannot accidentally set severity that doesn't match the gap.
 */
fraudAlertSchema.pre('validate', function () {
  if (this.difference != null) {
    this.severity = severityFromDifference(this.difference);
  }
});

// Staff dashboard: unresolved alerts for a store, newest first
fraudAlertSchema.index({ storeId: 1, resolved: 1, createdAt: -1 });

// User fraud history timeline
fraudAlertSchema.index({ userId: 1, createdAt: -1 });

const FraudAlert =
  mongoose.models.FraudAlert ||
  mongoose.model('FraudAlert', fraudAlertSchema);

module.exports = FraudAlert;
module.exports.SEVERITIES = SEVERITIES;
module.exports.severityFromDifference = severityFromDifference;
