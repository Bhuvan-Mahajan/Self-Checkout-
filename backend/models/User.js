const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const ROLES = ['customer', 'staff', 'admin'];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [80, 'Name must be at most 80 characters'],
    },

    phone: {
      type: String,
      required: [true, 'Phone is required'],
      unique: true,
      trim: true,
      // Adjust pattern to your market (E.164-ish / local formats)
      match: [/^\+?[0-9]{10,15}$/, 'Please provide a valid phone number'],
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      // Do NOT set unique here — explicit sparse index below.
      // Empty/missing email must not collide under a normal unique index.
      validate: {
        validator(value) {
          if (value == null || value === '') return true;
          return /^\S+@\S+\.\S+$/.test(value);
        },
        message: 'Please provide a valid email address',
      },
    },

    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      //minlength: [8, 'Password must be at least 8 characters'],
      select: false, // excluded from queries / JSON unless explicitly +passwordHash
    },

    role: {
      type: String,
      enum: {
        values: ROLES,
        message: 'Role must be customer, staff, or admin',
      },
      default: 'customer',
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    fraudScore: {
      type: Number,
      default: 0,
      min: [0, 'fraudScore cannot be negative'],
      max: [100, 'fraudScore cannot exceed 100'],
    },
  },
  {
    // provides createdAt (and updatedAt) automatically
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        // Belt-and-suspenders: never leak hash even if selected
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Unique only when email is present — many users can omit it
userSchema.index({ email: 1 }, { unique: true, sparse: true });

/**
 * Drop empty email so it is omitted from the document (not stored as null).
 */
userSchema.pre('validate', function () {
  if (this.email == null || this.email === '') {
    this.email = undefined;
    this.set('email', undefined);
  }
});

/**
 * Pre-save hook: hash plaintext password assigned to passwordHash.
 * Runs on user.save() / create() — NOT on findOneAndUpdate by default.
 * Skips re-hashing when passwordHash was not changed.
 */
userSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) {
    return;
  }

  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
});

/**
 * Compare a candidate plaintext password with the stored hash.
 * Caller must load the user with .select('+passwordHash').
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

const User = mongoose.model('User', userSchema);
User.ROLES = ROLES;
module.exports = User;
