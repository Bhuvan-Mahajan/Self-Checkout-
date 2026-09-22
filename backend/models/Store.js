const mongoose = require('mongoose');

/**
 * Indian GSTIN: 15 chars
 * 2-digit state + PAN (5 letters + 4 digits + 1 letter) + entity + 'Z' + checksum
 */
const GSTIN_REGEX =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Store name is required'],
      trim: true,
    },

    address: {
      type: String,
      required: [true, 'Store address is required'],
      trim: true,
    },

    gstNumber: {
      type: String,
      trim: true,
      uppercase: true,
      validate: {
        validator(value) {
          if (value == null || value === '') return true;
          return GSTIN_REGEX.test(value);
        },
        message: 'Please provide a valid Indian GSTIN (15 characters)',
      },
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true, // common filter: only list active stores
    },

    contactPhone: {
      type: String,
      trim: true,
      validate: {
        validator(value) {
          if (value == null || value === '') return true;
          return /^\+?[0-9]{10,15}$/.test(value);
        },
        message: 'Please provide a valid contact phone number',
      },
    },
  },
  {
    timestamps: true, // createdAt + updatedAt
  }
);

// Avoid OverwriteModelError when nodemon reloads and re-evaluates this file
const Store = mongoose.models.Store || mongoose.model('Store', storeSchema);

module.exports = Store;
