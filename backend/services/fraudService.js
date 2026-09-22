const { FraudAlert, User } = require('../models');

function getTolerance(cart) {
  const items = cart.items || [];
  if (!items.length) return 10;

  const tolerances = items
    .map((item) => item.weightTolerance)
    .filter((t) => t != null && !Number.isNaN(Number(t)));

  if (!tolerances.length) return 10;
  return Math.min(...tolerances);
}

function getSeverity(absDiff) {
  if (absDiff < 50) return 'low';
  if (absDiff < 200) return 'medium';
  return 'high';
}

/**
 * Compare BLE scale reading vs scanned expected weight.
 * @param {import('mongoose').Document} cart
 */
async function checkWeight(cart) {
  const difference = cart.sensorWeight - cart.expectedWeight;
  const absDiff = Math.abs(difference);
  const tolerance = getTolerance(cart);

  if (absDiff <= tolerance) {
    return { flagged: false, difference, severity: null };
  }

  const severity = getSeverity(absDiff);
  cart.isFlagged = true;

  await FraudAlert.create({
    cartId: cart._id,
    userId: cart.userId,
    storeId: cart.storeId,
    expectedWeight: cart.expectedWeight,
    sensorWeight: cart.sensorWeight,
    difference,
    severity,
  });

  await User.findByIdAndUpdate(cart.userId, { $inc: { fraudScore: 1 } });

  // Lazy require: app.js already imported this module at boot.
  // A top-level require('../app') would get an incomplete export.
  const { io } = require('../app');
  if (io) {
    io.emit('fraud-alert', {
      cartId: cart._id,
      userId: cart.userId,
      severity,
      difference,
    });
  }

  return { flagged: true, difference, severity };
}

module.exports = { checkWeight };
