// backend/routes/mealRoutes.js
const express = require('express');
const router = express.Router();
const {
  getMeals, getMealById, createMeal,
  updateMeal, deleteMeal, toggleAvailability
} = require('../controllers/mealController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/',            protect, getMeals);
router.get('/:id',         protect, getMealById);
router.post('/',           protect, adminOnly, createMeal);
router.put('/:id',         protect, adminOnly, updateMeal);
router.delete('/:id',      protect, adminOnly, deleteMeal);
router.patch('/:id/toggle',protect, adminOnly, toggleAvailability);

module.exports = router;
