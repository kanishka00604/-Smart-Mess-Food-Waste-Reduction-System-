// backend/models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mealType: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks'],
    required: true,
  },
  mealId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meal',
    default: null,
  },
  // Store as plain date string "YYYY-MM-DD" to avoid all timezone issues
  bookingDate: {
    type: String,
    required: true,
  },
  qrCode: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ['booked', 'used', 'cancelled'],
    default: 'booked',
  },
  orderedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
