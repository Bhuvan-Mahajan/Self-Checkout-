const mongoose = require('mongoose');

const CATEGORIES = [
  'snacks',
  'dairy',
  'beverages',
  'bakery',
  'personal-care',
  'household',
  'frozen',
  'produce',
  'other',
];

const GST_SLABS = [0, 5, 12, 18, 28];

const productSchema = new mongoose.Schema(
  {
    barcode: {
      type: String,
      required: [true, 'Barcode is required'],
      unique: true,
      trim: true,
      index: true,
    },

    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },

    brand: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: CATEGORIES,
        message: `Category must be one of: ${CATEGORIES.join(', ')}`,
      },
    },

    // Store money as integer paise (₹1.00 → 100) — never floats
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },

    mrp: {
      type: Number,
      min: [0, 'MRP cannot be negative'],
      validate: {
        validator(value) {
          if (value == null) return true;
          return value >= this.price;
        },
        message: 'MRP should be greater than or equal to selling price',
      },
    },

    weightGrams: {
      type: Number,
      required: [true, 'Weight in grams is required'],
      min: [1, 'Weight must be at least 1 gram'],
    },

    // Allowed scale variance (± grams) when comparing expected vs measured weight
    weightTolerance: {
      type: Number,
      default: 10,
      min: [0, 'Weight tolerance cannot be negative'],
    },

    imageUrl: {
      type: String,
      trim: true,
    },

    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: [true, 'Store is required'],
    },

    inStock: {
      type: Boolean,
      default: true,
    },

    taxPercent: {
      type: Number,
      default: 0,
      enum: {
        values: GST_SLABS,
        message: 'taxPercent must be a valid GST slab (0, 5, 12, 18, or 28)',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Text search on name, scoped by store (compound)
productSchema.index({ storeId: 1, name: 'text' });

// Admin / catalog queries filtered by store
productSchema.index({ storeId: 1 });

const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = Product;
module.exports.CATEGORIES = CATEGORIES;
module.exports.GST_SLABS = GST_SLABS;
