// backend/seedMeals.js
// Run ONCE to add sample meals to MongoDB:
//   node seedMeals.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Meal = require('./models/Meal');

const meals = [
  { mealName: 'Idli Sambar', mealType: 'Breakfast', category: 'Veg', calories: 280, protein: 9, carbs: 52, fats: 4, image: '🥞' },
  { mealName: 'Poha', mealType: 'Breakfast', category: 'Vegan', calories: 250, protein: 5, carbs: 45, fats: 6, image: '🌾' },
  { mealName: 'Masala Dosa', mealType: 'Breakfast', category: 'Veg', calories: 340, protein: 8, carbs: 58, fats: 10, image: '🫓' },
  { mealName: 'Dal Tadka + Rice', mealType: 'Lunch', category: 'Veg', calories: 520, protein: 18, carbs: 88, fats: 12, image: '🍛' },
  { mealName: 'Chicken Curry + Rice', mealType: 'Lunch', category: 'Non-Veg', calories: 620, protein: 38, carbs: 40, fats: 22, image: '🍗' },
  { mealName: 'Paneer Butter Masala', mealType: 'Lunch', category: 'Veg', calories: 580, protein: 22, carbs: 45, fats: 28, image: '🧀' },
  { mealName: 'Rajma Chawal', mealType: 'Lunch', category: 'Vegan', calories: 490, protein: 20, carbs: 82, fats: 8, image: '🫘' },
  { mealName: 'Roti + Sabzi', mealType: 'Dinner', category: 'Veg', calories: 380, protein: 12, carbs: 65, fats: 9, image: '🫓' },
  { mealName: 'Egg Bhurji + Rice', mealType: 'Dinner', category: 'Non-Veg', calories: 440, protein: 24, carbs: 52, fats: 16, image: '🥚' },
  { mealName: 'Chole Bhature', mealType: 'Dinner', category: 'Veg', calories: 650, protein: 18, carbs: 90, fats: 22, image: '🫔' },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    await Meal.deleteMany({});
    await Meal.insertMany(meals);
    console.log(`✅ Seeded ${meals.length} meals successfully!`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
})();
