import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, CalendarCheck, Users, MessageSquare,
  LogOut, Compass, Menu, ShieldCheck, X
} from 'lucide-react';
import logo from '../../../assets/logo.PNG';

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Packages', path: '/admin/packages', icon: <Package size={20} /> },
    { name: 'Bookings', path: '/admin/bookings', icon: <CalendarCheck size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Enquiries', path: '/admin/enquiries', icon: <MessageSquare size={20} /> },
    { name: 'Recent Tours', path: '/admin/recent-tours', icon: <Compass size={20} /> },
    { name: 'Mega Menu', path: '/admin/mega-menu', icon: <Menu size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/admin/login');
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />}

      <aside className={`fixed left-0 top-0 h-full w-64 bg-card border-r border-white/[0.06] flex flex-col z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="Ravana Holidays" className="h-10 w-auto object-contain" />
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="text-primary w-4 h-4" />
              <span className="text-xs font-bold tracking-widest uppercase text-white/60">Admin</span>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors text-white/70">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-white/50 hover:bg-white/[0.04] hover:text-white/80'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/[0.06]">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-red-400/80 hover:bg-red-400/10 hover:text-red-400 transition-all text-sm font-medium"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
