// backend/controllers/bookingController.js
const Booking = require('../models/Booking');
const Meal    = require('../models/Meal');
const User    = require('../models/User');
const QRCode  = require('qrcode');

// Helper — today's date as "YYYY-MM-DD" in server local time
const todayStr = () => {
  const d = new Date();
  const y  = d.getFullYear();
  const m  = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
};

// ── POST /api/bookings  ─────────────────────────────────────────────────────
// Student orders a meal for a specific date + mealType
const createBooking = async (req, res) => {
  try {
    const { mealType, bookingDate, mealId } = req.body;

    if (!mealType || !bookingDate) {
      return res.status(400).json({ message: 'mealType and bookingDate are required' });
    }

    // Validate date format YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(bookingDate)) {
      return res.status(400).json({ message: 'bookingDate must be in YYYY-MM-DD format' });
    }

    // Cannot book for past dates
    if (bookingDate < todayStr()) {
      return res.status(400).json({ message: 'Cannot book for a past date' });
    }

    // Duplicate check — same student, same meal type, same date
    const existing = await Booking.findOne({
      studentId:   req.user._id,
      mealType,
      bookingDate,
      status:      { $ne: 'cancelled' },
    });
    if (existing) {
      return res.status(400).json({
        message: `You already have a ${mealType} booking on ${bookingDate}. Cancel it first to rebook.`
      });
    }

    // Create booking
    const booking = await Booking.create({
      studentId:   req.user._id,
      mealType,
      bookingDate,
      mealId:      mealId || null,
      status:      'booked',
      orderedAt:   new Date(),
    });

    // Generate QR code
    const qrPayload = JSON.stringify({
      bookingId: booking._id.toString(),
      student:   req.user.name,
      rollNo:    req.user.studentId || '',
      meal:      mealType,
      date:      bookingDate,
      time:      new Date().toLocaleTimeString('en-IN'),
    });
    const qrCode = await QRCode.toDataURL(qrPayload, { width: 250, margin: 2 });
    booking.qrCode = qrCode;
    await booking.save();

    // Populate for response
    await booking.populate('studentId', 'name email studentId');
    await booking.populate('mealId', 'mealName calories image');

    res.status(201).json({
      message: 'Meal booked successfully!',
      booking,
    });
  } catch (err) {
    console.error('createBooking error:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

// ── GET /api/bookings/my  ───────────────────────────────────────────────────
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ studentId: req.user._id })
      .populate('mealId', 'mealName calories image')
      .sort({ bookingDate: -1, orderedAt: -1 });
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ── GET /api/bookings/my/today  ─────────────────────────────────────────────
// Returns all of today's bookings for the student (for QR display)
const getMyTodayBookings = async (req, res) => {
  try {
    const today = todayStr();
    const bookings = await Booking.find({
      studentId:   req.user._id,
      bookingDate: today,
      status:      { $ne: 'cancelled' },
    }).populate('mealId', 'mealName');
    res.json({ bookings, today });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ── PUT /api/bookings/:id/cancel  ───────────────────────────────────────────
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id:       req.params.id,
      studentId: req.user._id,
    });
    if (!booking)                  return res.status(404).json({ message: 'Booking not found' });
    if (booking.status === 'used') return res.status(400).json({ message: 'Cannot cancel a used booking' });
    if (booking.bookingDate < todayStr()) {
      return res.status(400).json({ message: 'Cannot cancel a past booking' });
    }
    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ── GET /api/bookings/admin/all  ────────────────────────────────────────────
// Admin gets all bookings — supports filters: date, mealType, status
const getAllBookings = async (req, res) => {
  try {
    const filter = {};
    if (req.query.date)     filter.bookingDate = req.query.date;
    if (req.query.mealType) filter.mealType    = req.query.mealType;
    if (req.query.status)   filter.status      = req.query.status;

    const bookings = await Booking.find(filter)
      .populate('studentId', 'name email studentId')
      .populate('mealId',    'mealName image')
      .sort({ bookingDate: -1, orderedAt: -1 })
      .limit(200);

    res.json({ bookings, total: bookings.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ── GET /api/bookings/admin/stats  ──────────────────────────────────────────
const getBookingStats = async (req, res) => {
  try {
    const today = todayStr();

    const [todayTotal, todayUsed, todayCancelled, totalStudents] = await Promise.all([
      Booking.countDocuments({ bookingDate: today }),
      Booking.countDocuments({ bookingDate: today, status: 'used' }),
      Booking.countDocuments({ bookingDate: today, status: 'cancelled' }),
      User.countDocuments({ role: 'student' }),
    ]);

    // Last 7 days chart data
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const y  = d.getFullYear();
      const m  = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      days.push(`${y}-${m}-${dd}`);
    }

    const weeklyRaw = await Promise.all(
      days.map(async (dateStr) => {
        const count = await Booking.countDocuments({
          bookingDate: dateStr,
          status: { $ne: 'cancelled' },
        });
        // Short label like "Mon 25"
        const dt = new Date(dateStr + 'T00:00:00');
        const label = dt.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
        return { date: dateStr, label, count };
      })
    );

    // Meal type breakdown for today
    const mealBreakdown = await Booking.aggregate([
      { $match: { bookingDate: today, status: { $ne: 'cancelled' } } },
      { $group: { _id: '$mealType', count: { $sum: 1 } } },
    ]);

    res.json({
      todayTotal, todayUsed, todayCancelled,
      totalStudents, weeklyRaw, mealBreakdown,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ── PUT /api/bookings/:id/use  ──────────────────────────────────────────────
const markAsUsed = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('studentId', 'name studentId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status !== 'booked') {
      return res.status(400).json({ message: `Booking is already ${booking.status}` });
    }
    booking.status = 'used';
    await booking.save();
    res.json({ message: 'Booking marked as used', booking });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createBooking, getMyBookings, getMyTodayBookings,
  cancelBooking, getAllBookings, getBookingStats, markAsUsed,
};
