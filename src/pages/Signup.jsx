import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../api/api';
import { User, Mail, Lock, Phone } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await signup(formData);
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 bg-background min-h-screen flex items-center justify-center px-4">
      <div className="glass max-w-md w-full p-10 rounded-3xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -ml-16 -mt-16"></div>
        
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Create Account</h2>
          <p className="text-text/60">Join us for premium travel experiences</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-xs font-bold text-text/60 flex items-center space-x-2">
              <User className="w-3 h-3" />
              <span>Full Name</span>
            </label>
            <input 
              type="text" required
              className="w-full bg-card border border-primary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-text/60 flex items-center space-x-2">
              <Mail className="w-3 h-3" />
              <span>Email Address</span>
            </label>
            <input 
              type="email" required
              className="w-full bg-card border border-primary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-text"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-text/60 flex items-center space-x-2">
              <Phone className="w-3 h-3" />
              <span>Phone Number</span>
            </label>
            <input 
              type="text" required
              className="w-full bg-card border border-primary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-text"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-text/60 flex items-center space-x-2">
              <Lock className="w-3 h-3" />
              <span>Password</span>
            </label>
            <input 
              type="password" required
              className="w-full bg-card border border-primary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-text"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-background font-bold py-4 rounded-2xl hover:bg-primary/90 transition-all disabled:opacity-50 mt-4"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-text/60 pt-2">
          Already have an account? <Link to="/login" className="text-primary hover:underline font-bold">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
