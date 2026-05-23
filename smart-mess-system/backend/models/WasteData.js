// backend/models/WasteData.js

const mongoose = require('mongoose');

const wasteDataSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    mealType: {
      type: String,
      enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks'],
      required: true,
    },
    preparedQuantity: { type: Number, required: true }, // in plates/servings
    consumedQuantity: { type: Number, required: true },
    wastePercentage: { type: Number }, // auto-calculated
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Auto-calculate waste percentage before saving
wasteDataSchema.pre('save', function (next) {
  if (this.preparedQuantity > 0) {
    const wasted = this.preparedQuantity - this.consumedQuantity;
    this.wastePercentage = parseFloat(((wasted / this.preparedQuantity) * 100).toFixed(2));
  } else {
    this.wastePercentage = 0;
  }
  next();
});

module.exports = mongoose.model('WasteData', wasteDataSchema);
