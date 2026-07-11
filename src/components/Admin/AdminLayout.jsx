import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import AdminSidebar from './Sidebar/AdminSidebar';
import { Menu, X } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(userInfo);
    if (user.role !== 'admin') {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="bg-background text-text min-h-screen">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-64 min-h-screen">
        <div className="lg:hidden sticky top-0 z-30 glass-nav px-4 py-3 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] transition-colors">
            <Menu size={20} />
          </button>
          <span className="font-bold text-sm">Admin Console</span>
        </div>

        <main className="p-6 md:p-10 lg:p-12">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
