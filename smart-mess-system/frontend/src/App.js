// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth
import Login  from './pages/Login';
import Signup from './pages/Signup';

// Admin
import AdminDashboard  from './pages/admin/AdminDashboard';
import MenuManager     from './pages/admin/MenuManager';
import AllBookingsPage from './pages/admin/AllBookingsPage';
import WastePage       from './pages/admin/WastePage';
import AnalyticsPage   from './pages/admin/AnalyticsPage';
import AIPage          from './pages/admin/AIPage';

// Student
import StudentDashboard from './pages/student/StudentDashboard';
import BookingPage      from './pages/student/BookingPage';
import HistoryPage      from './pages/student/HistoryPage';
import QRPage           from './pages/student/QRPage';

// Shared
import MenuPage     from './pages/shared/MenuPage';
import FeedbackPage from './pages/shared/FeedbackPage';

const P  = ({ children })           => <ProtectedRoute>{children}</ProtectedRoute>;
const PA = ({ children })           => <ProtectedRoute adminOnly>{children}</ProtectedRoute>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/login"  element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Student */}
          <Route path="/student/dashboard" element={<P><StudentDashboard /></P>} />
          <Route path="/student/menu"      element={<P><MenuPage /></P>} />
          <Route path="/student/booking"   element={<P><BookingPage /></P>} />
          <Route path="/student/history"   element={<P><HistoryPage /></P>} />
          <Route path="/student/qr"        element={<P><QRPage /></P>} />
          <Route path="/student/feedback"  element={<P><FeedbackPage /></P>} />

          {/* Admin */}
          <Route path="/admin/dashboard"   element={<PA><AdminDashboard /></PA>} />
          <Route path="/admin/menu"        element={<PA><MenuManager /></PA>} />
          <Route path="/admin/bookings"    element={<PA><AllBookingsPage /></PA>} />
          <Route path="/admin/waste"       element={<PA><WastePage /></PA>} />
          <Route path="/admin/analytics"   element={<PA><AnalyticsPage /></PA>} />
          <Route path="/admin/ai"          element={<PA><AIPage /></PA>} />
          <Route path="/admin/feedback"    element={<PA><FeedbackPage /></PA>} />

          {/* Defaults */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
