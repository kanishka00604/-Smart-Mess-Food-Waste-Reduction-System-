// backend/routes/feedbackRoutes.js
const express = require('express');
const router = express.Router();
const { createFeedback, getMyFeedback, getAllFeedback } = require('../controllers/feedbackController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, createFeedback);
router.get('/my', protect, getMyFeedback);
router.get('/admin/all', protect, adminOnly, getAllFeedback);

module.exports = router;
