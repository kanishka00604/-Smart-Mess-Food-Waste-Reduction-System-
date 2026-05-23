// backend/models/Meal.js

const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema(
  {
    mealName: {
      type: String,
      required: [true, 'Meal name is required'],
      trim: true,
    },
    mealType: {
      type: String,
      enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks'],
      required: true,
    },
    category: {
      type: String,
      enum: ['Veg', 'Non-Veg', 'Vegan'],
      default: 'Veg',
    },
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fats: { type: Number, default: 0 },
    image: { type: String, default: '🍛' }, // emoji or image URL
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Meal', mealSchema);
