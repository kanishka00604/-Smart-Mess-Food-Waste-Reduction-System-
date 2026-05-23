// backend/routes/bookingRoutes.js
const express = require('express');
const router  = express.Router();
const {
  createBooking, getMyBookings, getMyTodayBookings,
  cancelBooking, getAllBookings, getBookingStats, markAsUsed,
} = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Student routes
router.post('/',            protect, createBooking);
router.get('/my',           protect, getMyBookings);
router.get('/my/today',     protect, getMyTodayBookings);
router.put('/:id/cancel',   protect, cancelBooking);

// Admin routes
router.get('/admin/all',    protect, adminOnly, getAllBookings);
router.get('/admin/stats',  protect, adminOnly, getBookingStats);
router.put('/:id/use',      protect, adminOnly, markAsUsed);

module.exports = router;
