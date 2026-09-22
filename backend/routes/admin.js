const express = require('express');
const adminController = require('../controllers/adminController');
const protect = require('../middleware/protect');
const restrictTo = require('../middleware/restrictTo');

const router = express.Router();

router.use(protect);
router.use(restrictTo('admin', 'staff'));

router.get('/alerts', adminController.getAlerts);
router.patch('/alerts/:id', adminController.resolveAlert);
router.get('/orders', adminController.getOrders);
router.get('/stats', adminController.getStats);
router.get('/products', adminController.getProducts);

module.exports = router;
