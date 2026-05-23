// backend/routes/wasteRoutes.js
const express = require('express');
const router = express.Router();
const { logWaste, getWasteLogs, getWasteSummary } = require('../controllers/wasteController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, adminOnly, logWaste);
router.get('/', protect, adminOnly, getWasteLogs);
router.get('/summary', protect, adminOnly, getWasteSummary);

module.exports = router;
