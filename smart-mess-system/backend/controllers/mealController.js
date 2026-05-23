// backend/controllers/mealController.js
const Meal = require('../models/Meal');

// GET /api/meals  — supports ?mealType=Lunch filter
const getMeals = async (req, res) => {
  try {
    const filter = {};
    if (req.query.mealType) filter.mealType = req.query.mealType;
    // Students only see available meals; admin sees all
    if (req.user.role === 'student') filter.isAvailable = true;
    const meals = await Meal.find(filter).sort({ mealType: 1, createdAt: -1 });
    res.json({ meals });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/meals/:id
const getMealById = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);
    if (!meal) return res.status(404).json({ message: 'Meal not found' });
    res.json({ meal });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/meals  — admin adds a new dish
const createMeal = async (req, res) => {
  try {
    const { mealName, mealType, category, calories, protein, carbs, fats, image } = req.body;
    if (!mealName || !mealType) {
      return res.status(400).json({ message: 'mealName and mealType are required' });
    }
    const meal = await Meal.create({
      mealName: mealName.trim(),
      mealType,
      category: category || 'Veg',
      calories: Number(calories) || 0,
      protein:  Number(protein)  || 0,
      carbs:    Number(carbs)    || 0,
      fats:     Number(fats)     || 0,
      image:    image || '🍛',
      isAvailable: true,
    });
    res.status(201).json({ message: 'Meal added successfully', meal });
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

// PUT /api/meals/:id  — admin edits a dish
const updateMeal = async (req, res) => {
  try {
    const meal = await Meal.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!meal) return res.status(404).json({ message: 'Meal not found' });
    res.json({ message: 'Meal updated', meal });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/meals/:id  — admin deletes a dish
const deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findByIdAndDelete(req.params.id);
    if (!meal) return res.status(404).json({ message: 'Meal not found' });
    res.json({ message: 'Meal deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /api/meals/:id/toggle  — toggle availability
const toggleAvailability = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);
    if (!meal) return res.status(404).json({ message: 'Meal not found' });
    meal.isAvailable = !meal.isAvailable;
    await meal.save();
    res.json({ message: `Meal ${meal.isAvailable ? 'enabled' : 'disabled'}`, meal });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getMeals, getMealById, createMeal, updateMeal, deleteMeal, toggleAvailability };
