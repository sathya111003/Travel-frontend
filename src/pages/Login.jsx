import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/api';
import { Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await login(formData);
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 bg-background min-h-screen flex items-center justify-center px-4">
      <div className="glass max-w-md w-full p-10 rounded-3xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -ml-16 -mt-16"></div>
        
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
          <p className="text-text/60">Log in to manage your bookings</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-bold text-text/60 flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Email Address</span>
            </label>
            <input 
              type="email" 
              required
              className="w-full bg-card border border-primary/20 rounded-xl px-4 py-4 focus:outline-none focus:border-primary text-text"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-text/60 flex items-center space-x-2">
              <Lock className="w-4 h-4" />
              <span>Password</span>
            </label>
            <input 
              type="password" 
              required
              className="w-full bg-card border border-primary/20 rounded-xl px-4 py-4 focus:outline-none focus:border-primary text-text"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-background font-bold py-4 rounded-2xl hover:bg-primary/90 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center text-text/60 pt-4">
          Don't have an account? <Link to="/signup" className="text-primary hover:underline font-bold">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
