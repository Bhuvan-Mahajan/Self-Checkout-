const express = require('express');
const paymentController = require('../controllers/paymentController');
const protect = require('../middleware/protect');

const router = express.Router();

router.post('/create', protect, paymentController.createPayment);

// Razorpay is the caller — no JWT. Body is a Buffer from express.raw() in app.js
router.post('/webhook', paymentController.webhook);

router.get('/:orderId', protect, paymentController.getPaymentStatus);

module.exports = router;
