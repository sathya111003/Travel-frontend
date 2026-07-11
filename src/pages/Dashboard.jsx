import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMyBookings } from '../api/api';
import { Package, Calendar, Clock, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo: user, logout, openAuthModal } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/'); openAuthModal('login'); return; }
    const getBookings = async () => {
      try { const { data } = await fetchMyBookings(); setBookings(data); } catch (e) { console.error(e); }
      setLoading(false);
    };
    getBookings();
  }, [navigate]);

  const handleLogout = () => { logout(); navigate('/'); };

  if (loading) return <div className="h-screen flex items-center justify-center bg-background"><div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="pt-32 pb-20 bg-background min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-card p-8 rounded-2xl border border-white/[0.06] mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
              <UserIcon className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">{user?.name}</h1>
              <p className="text-white/60 text-sm">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] text-white/70 hover:text-red-400 hover:bg-red-400/10 transition-all text-sm font-medium border border-white/[0.06]">
            <LogOut size={16} /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="bg-card p-5 rounded-2xl border border-l-4 border-l-primary border-white/[0.06]">
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">Total Bookings</p>
              <p className="text-3xl font-black text-white">{bookings.length}</p>
            </div>
            <div className="bg-card p-5 rounded-2xl border border-l-4 border-l-accent border-white/[0.06]">
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">Upcoming Trips</p>
              <p className="text-3xl font-black text-white">{bookings.filter(b => new Date(b.travelDate) > new Date()).length}</p>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-black text-white">My Bookings</h2>
            {bookings.length === 0 ? (
              <div className="bg-card p-12 rounded-2xl text-center border border-white/[0.06]">
                <Package className="w-10 h-10 text-white/30 mx-auto mb-3" />
                <p className="text-white/60 text-sm">No bookings yet. Start your first adventure!</p>
              </div>
            ) : (
              bookings.map((b) => (
                <div key={b._id} className="bg-card p-5 rounded-2xl border border-white/[0.06] hover:border-white/[0.1] transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/[0.06]">
                        <img src={b.package?.images?.[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">{b.package?.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-white/60 mt-1">
                          <span className="flex items-center gap-1"><Calendar size={10} /> {new Date(b.travelDate).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><Clock size={10} /> {b.package?.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary text-sm">₹{b.totalPrice?.toLocaleString()}</p>
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${b.status === 'booked' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-primary/10 text-primary'}`}>{b.status}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
