// backend/controllers/feedbackController.js
const Feedback = require('../models/Feedback');

// Simple keyword-based sentiment analysis
const analyzeSentiment = (comment, rating) => {
  const positive = ['amazing','great','love','excellent','delicious','best','perfect','fantastic','good','tasty','fresh','hot','nice'];
  const negative = ['bad','cold','hard','stale','terrible','worst','awful','disgusting','horrible','bland','undercooked','burnt','late'];
  const text = comment.toLowerCase();
  if (positive.some(w => text.includes(w)) || rating >= 4) return 'Positive';
  if (negative.some(w => text.includes(w)) || rating <= 2) return 'Negative';
  return 'Neutral';
};

// POST /api/feedback
const createFeedback = async (req, res) => {
  try {
    const { rating, comment, mealId } = req.body;
    if (!rating) return res.status(400).json({ message: 'Rating is required' });
    const sentiment = analyzeSentiment(comment || '', rating);
    const feedback = await Feedback.create({
      studentId: req.user._id,
      mealId: mealId || null,
      rating,
      comment: comment || '',
      sentiment,
    });
    res.status(201).json({ message: 'Feedback submitted', feedback });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/feedback/my
const getMyFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ studentId: req.user._id })
      .populate('mealId', 'mealName')
      .sort({ createdAt: -1 });
    res.json({ feedback });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/feedback/admin/all — admin
const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate('studentId', 'name')
      .populate('mealId', 'mealName')
      .sort({ createdAt: -1 })
      .limit(50);

    // Sentiment summary
    const summary = { Positive: 0, Negative: 0, Neutral: 0 };
    feedback.forEach(f => summary[f.sentiment]++);
    const avgRating = feedback.length
      ? (feedback.reduce((a, f) => a + f.rating, 0) / feedback.length).toFixed(1)
      : 0;

    res.json({ feedback, summary, avgRating });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createFeedback, getMyFeedback, getAllFeedback };
