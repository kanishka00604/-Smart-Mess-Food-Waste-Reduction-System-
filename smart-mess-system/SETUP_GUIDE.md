# 🍱 Smart Mess System — Module 1 Setup Guide

---

## 📁 Final Folder Structure

```
smart-mess-system/
├── README.md
├── frontend/
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── index.js
│       ├── index.css
│       ├── App.js
│       ├── components/
│       │   └── ProtectedRoute.js
│       ├── context/
│       │   └── AuthContext.js
│       ├── pages/
│       │   ├── Login.js
│       │   ├── Signup.js
│       │   ├── StudentDashboard.js
│       │   └── AdminDashboard.js
│       └── services/
│           └── api.js
├── backend/
│   ├── package.json
│   ├── .env.example          ← copy to .env
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Meal.js
│   │   ├── Booking.js
│   │   ├── Feedback.js
│   │   └── WasteData.js
│   ├── controllers/
│   │   └── authController.js
│   ├── routes/
│   │   └── authRoutes.js
│   └── middleware/
│       └── authMiddleware.js
└── ai-service/
    ├── requirements.txt
    └── app.py
```

---

## ⚡ STEP 1 — MongoDB Setup

### Option A: Local MongoDB
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Install and start it
3. Use URI: `mongodb://localhost:27017/smart-mess`

### Option B: MongoDB Atlas (Free Cloud — Recommended for beginners)
1. Go to https://cloud.mongodb.com → sign up free
2. Create a free cluster (M0)
3. Click "Connect" → "Drivers"
4. Copy the URI like: `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/smart-mess`

---

## ⚡ STEP 2 — Backend Setup

```bash
# 1. Open terminal in VS Code and navigate to backend folder
cd smart-mess-system/backend

# 2. Create your .env file (copy from example)
# On Windows:
copy .env.example .env
# On Mac/Linux:
cp .env.example .env

# 3. Open .env and set your MONGO_URI:
#    MONGO_URI=mongodb://localhost:27017/smart-mess

# 4. Install dependencies
npm install

# 5. Start the backend
npm run dev
```

✅ You should see:
```
🚀 Server running on http://localhost:5000
✅ MongoDB Connected: localhost
```

**Test it:** Open browser → http://localhost:5000/api/health
You should see: `{"status":"OK","message":"Smart Mess API is running 🚀"}`

---

## ⚡ STEP 3 — Frontend Setup

```bash
# Open a NEW terminal tab in VS Code

# 1. Navigate to frontend
cd smart-mess-system/frontend

# 2. Install dependencies (this takes 2-3 minutes)
npm install

# 3. Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer

# 4. Start React
npm start
```

✅ Browser opens at http://localhost:3000
You'll see the **Login page** with the dark green design.

---

## ⚡ STEP 4 — Test Authentication

### Test Signup:
1. Go to http://localhost:3000/signup
2. Fill in name, email, password, role
3. Click "Create Account"
4. You'll be redirected to the dashboard

### Test Login:
1. Go to http://localhost:3000/login
2. Enter the email/password you just registered
3. Admin role → goes to /admin/dashboard
4. Student role → goes to /student/dashboard

### Test with Postman or Thunder Client (VS Code extension):
```
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "name": "Dr. Amit Sharma",
  "email": "admin@mess.com",
  "password": "admin123",
  "role": "admin"
}
```

```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@mess.com",
  "password": "admin123"
}
```

---

## 📦 All npm Packages Used

### Backend:
| Package | Purpose |
|---------|---------|
| express | Web server framework |
| mongoose | MongoDB object modeling |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT auth tokens |
| cors | Allow frontend to call backend |
| dotenv | Load .env variables |
| qrcode | Generate QR codes (later) |
| nodemon | Auto-restart server on changes |

### Frontend:
| Package | Purpose |
|---------|---------|
| react-router-dom | Page routing |
| axios | HTTP requests to backend |
| lucide-react | Icons |
| recharts | Charts for dashboard |
| tailwindcss | Utility CSS framework |

---

## 🔧 VS Code Extensions (Recommended)
- **Thunder Client** — test API endpoints without Postman
- **MongoDB for VS Code** — view your database
- **ES7+ React Snippets** — React shortcuts
- **Tailwind CSS IntelliSense** — autocomplete Tailwind classes
- **Prettier** — code formatting

---

## 🚀 What's Working After Module 1

- ✅ Project structure created
- ✅ Backend Express server running
- ✅ MongoDB connected
- ✅ User model with password hashing
- ✅ All 5 database models ready
- ✅ Signup endpoint (POST /api/auth/signup)
- ✅ Login endpoint (POST /api/auth/login)
- ✅ JWT token generation
- ✅ Protected route middleware
- ✅ Admin-only middleware
- ✅ React app with React Router
- ✅ Auth Context (global state)
- ✅ Login page (dark green glassmorphism design)
- ✅ Signup page
- ✅ Protected routes
- ✅ Role-based redirect (admin vs student)
- ✅ Auto token attachment via Axios interceptor

---

## ▶️ Next Module (Prompt me for Module 2)

Module 2 will include:
- Full Admin Dashboard with sidebar, stats, charts
- Full Student Dashboard
- Meal management pages
- Booking system with QR code generation
- The complete UI matching your design
