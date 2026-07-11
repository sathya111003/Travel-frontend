import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane } from 'lucide-react';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import Packages from './pages/Packages';
import PackageDetails from './pages/PackageDetails';
import Booking from './pages/Booking';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ContactPage from './pages/ContactPage';
import About from './pages/About';
import RecentTourDetails from './pages/RecentTourDetails';
import WhatsAppWidget from './components/WhatsAppWidget/WhatsAppWidget';
import AuthModal from './components/Auth/AuthModal';

// Admin Imports
import AdminLayout from './components/Admin/AdminLayout';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './components/Admin/Dashboard/AdminDashboard';
import PackageManagement from './components/Admin/Packages/PackageManagement';
import BookingManagement from './components/Admin/Bookings/BookingManagement';
import UserManagement from './components/Admin/Users/UserManagement';
import EnquiryManagement from './components/Admin/Enquiries/EnquiryManagement';
import RecentTourManagement from './components/Admin/RecentTours/RecentTourManagement';
import DestinationManagement from './components/Admin/Destinations/DestinationManagement';

const Preloader = () => (
  <motion.div 
    className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center"
    exit={{ opacity: 0, scale: 1.05 }}
    transition={{ duration: 0.5, ease: "easeInOut" }}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center"
    >
      {/* Brand Logo */}
      <img src="/logo.png" alt="Ravana Holidays" className="w-32 h-32 object-contain mb-8 animate-pulse" />
      
      {/* Elegant Progress Bar */}
      <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-primary to-[#F97316] rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        />
      </div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-white/70 text-xs font-bold tracking-[0.3em] uppercase mt-6"
      >
        Preparing your journey
      </motion.p>
    </motion.div>
  </motion.div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  
  return (
    <>
      {!isAdminPage && <Navbar />}
      <div className={!isAdminPage ? "min-h-screen pt-[36px]" : ""}>
        {children}
      </div>
      {!isAdminPage && <Footer />}
      {!isAdminPage && <WhatsAppWidget />}
      <AuthModal />
    </>
  );
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <AnimatePresence>
        {loading && <Preloader key="preloader" />}
      </AnimatePresence>
      <div className={loading ? 'hidden' : 'block'}>
        <LayoutWrapper>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/package/:id" element={<PackageDetails />} />
            <Route path="/recent-tour/:id" element={<RecentTourDetails />} />
            <Route path="/booking/:id" element={<Booking />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/signup" element={<Navigate to="/" replace />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="packages" element={<PackageManagement />} />
              <Route path="bookings" element={<BookingManagement />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="enquiries" element={<EnquiryManagement />} />
              <Route path="recent-tours" element={<RecentTourManagement />} />
              <Route path="mega-menu" element={<DestinationManagement />} />
            </Route>
          </Routes>
        </LayoutWrapper>
      </div>
    </Router>
  );
}

export default App;
