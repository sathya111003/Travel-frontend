import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/api';
import { ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await login(formData);
      if (data.role !== 'admin') {
        alert('Access denied. Admin only.');
        setLoading(false);
        return;
      }
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/admin/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-4">
      <div className="glass max-w-md w-full p-10 rounded-[2.5rem] border border-primary/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        
        <div className="text-center space-y-4 mb-10">
          <div className="w-20 h-20 bg-primary/20 text-primary rounded-3xl flex items-center justify-center mx-auto border border-primary/20 shadow-lg shadow-primary/10">
            <ShieldCheck size={40} />
          </div>
          <h1 className="text-3xl font-bold">Admin Portal</h1>
          <p className="text-text/60">Secure access for travel administrators</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-text/50 uppercase ml-1">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50" size={20} />
              <input 
                required type="email" placeholder="admin@travelweb.com"
                className="w-full glass pl-12 pr-4 py-4 rounded-2xl border-primary/10 focus:border-primary transition-all"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-text/50 uppercase ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50" size={20} />
              <input 
                required type="password" placeholder="••••••••"
                className="w-full glass pl-12 pr-4 py-4 rounded-2xl border-primary/10 focus:border-primary transition-all"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-background font-bold py-5 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Enter Dashboard'}</span>
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-primary/10 text-center">
            <p className="text-sm text-text/40 italic">Unauthorized access is strictly monitored.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
