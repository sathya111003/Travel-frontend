import React, { useState, useEffect } from 'react';
import { Package, CalendarCheck, Users, IndianRupee } from 'lucide-react';
import { fetchAllPackagesAdmin, fetchAllBookings, fetchAllUsers } from '../../../api/api';

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-card p-6 rounded-2xl border border-white/[0.06] relative overflow-hidden">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white/70 font-bold uppercase text-[10px] tracking-widest mb-2">{title}</p>
        <h3 className="text-2xl font-black text-white">{value}</h3>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    packages: 0,
    bookings: 0,
    users: 0,
    revenue: 0
  });

  useEffect(() => {
    const getStats = async () => {
      try {
        const [pkgs, bks, usrs] = await Promise.all([
          fetchAllPackagesAdmin(),
          fetchAllBookings(),
          fetchAllUsers()
        ]);
        setStats({
          packages: pkgs.data.length,
          bookings: bks.data.length,
          users: usrs.data.length,
          revenue: bks.data.reduce((acc, b) => acc + (b.totalPrice || 0), 0)
        });
      } catch (error) {
        console.error(error);
      }
    };
    getStats();
  }, []);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Welcome Back, Admin</h1>
          <p className="text-white/70 text-sm mt-1">Here's what's happening with your travel platform today.</p>
        </div>
        <p className="text-xs font-bold text-primary">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Packages" value={stats.packages} icon={<Package size={20} className="text-primary" />} color="bg-primary/10" />
        <StatCard title="Total Bookings" value={stats.bookings} icon={<CalendarCheck size={20} className="text-accent" />} color="bg-accent/10" />
        <StatCard title="Total Users" value={stats.users} icon={<Users size={20} className="text-blue-400" />} color="bg-blue-400/10" />
        <StatCard title="Revenue" value={`₹${stats.revenue.toLocaleString()}`} icon={<IndianRupee size={20} className="text-emerald-400" />} color="bg-emerald-400/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-8 rounded-2xl h-64 flex items-center justify-center border border-white/[0.06]">
          <p className="text-white/50 text-sm">Revenue Chart</p>
        </div>
        <div className="bg-card p-8 rounded-2xl h-64 flex items-center justify-center border border-white/[0.06]">
          <p className="text-white/50 text-sm">Booking Trends</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
