// backend/controllers/wasteController.js
const WasteData = require('../models/WasteData');

// POST /api/waste — admin logs waste
const logWaste = async (req, res) => {
  try {
    const { date, mealType, preparedQuantity, consumedQuantity } = req.body;
    if (!date || !mealType || !preparedQuantity || !consumedQuantity) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const waste = await WasteData.create({
      date: new Date(date),
      mealType,
      preparedQuantity: Number(preparedQuantity),
      consumedQuantity: Number(consumedQuantity),
      recordedBy: req.user._id,
    });
    res.status(201).json({ message: 'Waste logged', waste });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/waste — admin gets all waste logs
const getWasteLogs = async (req, res) => {
  try {
    const logs = await WasteData.find()
      .populate('recordedBy', 'name')
      .sort({ date: -1 })
      .limit(30);
    res.json({ logs });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/waste/summary — weekly waste summary for charts
const getWasteSummary = async (req, res) => {
  try {
    const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const logs = await WasteData.find({ date: { $gte: sevenDaysAgo } }).sort({ date: 1 });
    const avgWaste = logs.length
      ? (logs.reduce((a, l) => a + l.wastePercentage, 0) / logs.length).toFixed(1)
      : 0;
    res.json({ logs, avgWaste });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { logWaste, getWasteLogs, getWasteSummary };
