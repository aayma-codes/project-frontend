import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import SignIn from './pages/public/SignIn';
import SignUp from './pages/public/SignUp';
import ForgotPassword from './pages/public/ForgotPassword';
import ResetPassword from './pages/public/ResetPassword';
import VerifyEmail from './pages/public/VerifyEmail';

// Worker Pages
import WorkerDashboard from './pages/worker/Dashboard';
import AddEarnings from './pages/worker/AddEarnings';
import EarningsHistory from './pages/worker/EarningsHistory';
import Certificate from './pages/worker/Certificate';
import Alerts from './pages/worker/Alerts';
import Profile from './pages/worker/Profile';
import Grievances from './pages/worker/Grievances';
import Analytics from './pages/worker/Analytics';

// Verifier Pages
import VerifierDashboard from './pages/verifier/Dashboard';
import ReviewSubmission from './pages/verifier/Review';

// Advocate Pages
import AdvocateDashboard from './pages/advocate/Dashboard';
import AdvocateAnalytics from './pages/advocate/Analytics';
import VulnerableWorkers from './pages/advocate/Vulnerable';
import AdvocateGrievances from './pages/advocate/Grievances';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/Users';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) return null; // Wait for checkAuth

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

function App() {
  const { checkAuth, isLoading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-slow flex flex-col items-center">
           <div className="w-16 h-16 border-4 border-primary border-t-accent rounded-full animate-spin"></div>
           <p className="mt-4 text-primary font-medium">Loading KamaiKitab...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes with Main Navbar/Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        {/* Auth Routes with Split Screen Layout */}
        <Route element={<AuthLayout />}>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          
          {/* Worker Routes */}
          <Route path="/worker/dashboard" element={<ProtectedRoute allowedRoles={['WORKER', 'ADMIN']}><WorkerDashboard /></ProtectedRoute>} />
          <Route path="/worker/earnings/add" element={<ProtectedRoute allowedRoles={['WORKER', 'ADMIN']}><AddEarnings /></ProtectedRoute>} />
          <Route path="/worker/earnings/history" element={<ProtectedRoute allowedRoles={['WORKER', 'ADMIN']}><EarningsHistory /></ProtectedRoute>} />
          <Route path="/worker/certificate" element={<ProtectedRoute allowedRoles={['WORKER', 'ADMIN']}><Certificate /></ProtectedRoute>} />
          <Route path="/worker/alerts" element={<ProtectedRoute allowedRoles={['WORKER', 'ADMIN']}><Alerts /></ProtectedRoute>} />
          <Route path="/worker/profile" element={<ProtectedRoute allowedRoles={['WORKER', 'ADMIN']}><Profile /></ProtectedRoute>} />
          <Route path="/worker/grievances" element={<ProtectedRoute allowedRoles={['WORKER', 'ADMIN']}><Grievances /></ProtectedRoute>} />
          <Route path="/worker/analytics" element={<ProtectedRoute allowedRoles={['WORKER', 'ADMIN']}><Analytics /></ProtectedRoute>} />

          {/* Verifier Routes */}
          <Route path="/verifier/dashboard" element={<ProtectedRoute allowedRoles={['VERIFIER', 'ADMIN']}><VerifierDashboard /></ProtectedRoute>} />
          <Route path="/verifier/review/:id" element={<ProtectedRoute allowedRoles={['VERIFIER', 'ADMIN']}><ReviewSubmission /></ProtectedRoute>} />

          {/* Advocate Routes */}
          <Route path="/advocate/dashboard" element={<ProtectedRoute allowedRoles={['ADVOCATE', 'ADMIN']}><AdvocateDashboard /></ProtectedRoute>} />
          <Route path="/advocate/analytics" element={<ProtectedRoute allowedRoles={['ADVOCATE', 'ADMIN']}><AdvocateAnalytics /></ProtectedRoute>} />
          <Route path="/advocate/vulnerable" element={<ProtectedRoute allowedRoles={['ADVOCATE', 'ADMIN']}><VulnerableWorkers /></ProtectedRoute>} />
          <Route path="/advocate/grievances" element={<ProtectedRoute allowedRoles={['ADVOCATE', 'ADMIN']}><AdvocateGrievances /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><UserManagement /></ProtectedRoute>} />
        </Route>

        {/* Fallback */}
        <Route path="/unauthorized" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl text-error">Unauthorized Access</h1></div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
