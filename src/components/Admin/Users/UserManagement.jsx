import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, ShieldCheck, AlertTriangle } from 'lucide-react';
import { fetchAllUsers } from '../../../api/api';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const { data } = await fetchAllUsers();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.status === 401 ? 'Session expired. Please re-login.' : 'Failed to load users.');
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;

  if (error) return (
    <div className="bg-card p-10 rounded-2xl border border-red-400/20 flex flex-col items-center space-y-4 text-center">
      <AlertTriangle size={32} className="text-red-400" />
      <div>
        <h3 className="text-lg font-bold text-red-400 mb-1">Error</h3>
        <p className="text-white/70 text-sm">{error}</p>
      </div>
      <button onClick={() => { localStorage.removeItem('userInfo'); navigate('/admin/login'); }} className="px-6 py-2.5 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-sm font-bold hover:bg-red-400/20 transition-all">Re-Login</button>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">User Management</h1>
        <p className="text-white/70 text-sm mt-1">All registered users on the platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((u) => (
          <div key={u._id} className="bg-card p-5 rounded-2xl border border-white/[0.06]">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary"><User size={22} /></div>
              {u.role === 'admin' && (
                <span className="flex items-center gap-1 bg-accent/10 text-accent px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">
                  <ShieldCheck size={10} /> Admin
                </span>
              )}
            </div>
            <h4 className="font-bold text-sm text-white mb-0.5">{u.name}</h4>
            <p className="text-white/60 text-xs flex items-center gap-1.5 mb-4"><Mail size={10} /> {u.email}</p>
            <div className="pt-3 border-t border-white/[0.04] space-y-2">
              <div className="flex items-center text-xs text-white/70"><Phone size={12} className="mr-2 text-primary/60" /> {u.phone || 'No phone'}</div>
              <div className="flex items-center text-xs text-white/70"><Calendar size={12} className="mr-2 text-primary/60" /> {new Date(u.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;
