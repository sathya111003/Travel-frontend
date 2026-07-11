import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, LogIn, User, Phone, X, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { login, signup } from '../../api/api';

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, authMode, setAuthMode, login: authLogin } = useAuth();
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [useOTP, setUseOTP] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (useOTP) {
        if (!otpSent) {
          // Simulate sending OTP
          setTimeout(() => {
            setOtpSent(true);
            setLoading(false);
            alert(`Dummy OTP sent to ${formData.phone}. Use 123456 to verify.`);
          }, 1000);
          return;
        } else {
          // Simulate OTP verification
          setTimeout(() => {
            if (otpCode === '123456') {
              authLogin({ name: 'OTP User', email: 'user@example.com', role: 'user', token: 'dummy_token' });
              closeAuthModal();
            } else {
              alert('Invalid OTP');
            }
            setLoading(false);
          }, 1000);
          return;
        }
      }

      if (authMode === 'login') {
        const { data } = await login({ email: formData.email, password: formData.password });
        authLogin(data);
      } else {
        const { data } = await signup(formData);
        authLogin(data);
      }
    } catch (error) {
      alert(error.response?.data?.message || `${authMode === 'login' ? 'Login' : 'Signup'} failed`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    alert("Google authentication will be integrated here.");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
        {/* Background Blur Overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          className="glass max-w-md w-full p-8 md:p-10 rounded-3xl space-y-6 relative overflow-hidden z-10 border border-white/10 shadow-2xl bg-background/80"
        >
          {/* Close Button */}
          <button 
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="absolute top-0 left-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -ml-16 -mt-16"></div>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2 text-white">
              {useOTP ? 'Login with OTP' : authMode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-white/60">
              {useOTP ? 'Enter your mobile number to get an OTP' : authMode === 'login' ? 'Log in to manage your bookings' : 'Join us for premium travel experiences'}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {useOTP ? (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-white/60 flex items-center space-x-2">
                    <Phone className="w-3 h-3" />
                    <span>Phone Number</span>
                  </label>
                  <input 
                    type="text" required
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-white placeholder-white/30"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={otpSent}
                  />
                </div>
                {otpSent && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/60 flex items-center space-x-2">
                      <MessageSquare className="w-3 h-3" />
                      <span>OTP Code</span>
                    </label>
                    <input 
                      type="text" required
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-white placeholder-white/30 text-center tracking-widest font-bold"
                      placeholder="• • • • • •"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                {authMode === 'signup' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-white/60 flex items-center space-x-2">
                        <User className="w-3 h-3" />
                        <span>Full Name</span>
                      </label>
                      <input 
                        type="text" required
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-white placeholder-white/30"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-white/60 flex items-center space-x-2">
                        <Phone className="w-3 h-3" />
                        <span>Phone Number</span>
                      </label>
                      <input 
                        type="text" required
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-white placeholder-white/30"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-white/60 flex items-center space-x-2">
                    <Mail className="w-3 h-3" />
                    <span>Email Address</span>
                  </label>
                  <input 
                    type="email" required
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-white placeholder-white/30"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-white/60 flex items-center space-x-2">
                    <Lock className="w-3 h-3" />
                    <span>Password</span>
                  </label>
                  <input 
                    type="password" required
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-white placeholder-white/30"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-background font-bold py-4 rounded-2xl hover:bg-primary/90 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-4 shadow-xl shadow-primary/20"
            >
              {loading ? (
                <span>{useOTP && !otpSent ? 'Sending...' : 'Processing...'}</span>
              ) : (
                <>
                  {!useOTP && authMode === 'login' && <LogIn className="w-5 h-5" />}
                  <span>{useOTP ? (otpSent ? 'Verify OTP' : 'Send OTP') : authMode === 'login' ? 'Login' : 'Sign Up'}</span>
                </>
              )}
            </button>
          </form>



          <p className="text-center text-white/60 pt-2 text-sm flex flex-col space-y-2">
            {useOTP ? (
               <button onClick={() => { setUseOTP(false); setOtpSent(false); }} className="text-primary hover:underline font-bold">Back to Email Login</button>
            ) : (
              <span>
                {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                <button 
                  type="button"
                  onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                  className="text-primary hover:underline font-bold"
                >
                  {authMode === 'login' ? 'Sign Up' : 'Login'}
                </button>
              </span>
            )}
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;
