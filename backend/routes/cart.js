const express = require('express');
const cartController = require('../controllers/cartController');
const protect = require('../middleware/protect');

const router = express.Router();

router.use(protect);

router.get('/current', cartController.getCurrentCart);
router.post('/start', cartController.startCart);
router.post('/scan', cartController.scanItem);
router.delete('/item/:productId', cartController.removeItem);
router.post('/sensor-update', cartController.sensorUpdate);
router.post('/checkout', cartController.checkout);

module.exports = router;
