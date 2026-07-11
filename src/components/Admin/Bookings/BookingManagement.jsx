import React, { useState, useEffect } from 'react';
import { Calendar, User, Package, CheckCircle, Clock, XCircle } from 'lucide-react';
import { fetchAllBookings } from '../../../api/api';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBookings = async () => {
      try {
        const { data } = await fetchAllBookings();
        setBookings(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    getBookings();
  }, []);

  const getStatusStyle = (status) => {
    switch(status) {
      case 'booked': return 'bg-emerald-400/10 text-emerald-400';
      case 'pending': return 'bg-yellow-400/10 text-yellow-400';
      default: return 'bg-red-400/10 text-red-400';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">Booking Management</h1>
        <p className="text-white/70 text-sm mt-1">Monitor and manage all customer bookings.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-white/[0.06] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-6 py-4 text-[10px] font-bold text-white/60 uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-white/60 uppercase tracking-widest">Package</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-white/60 uppercase tracking-widest">Travel Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-white/60 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-white/60 uppercase tracking-widest text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><User size={16} /></div>
                        <div>
                          <div className="text-sm font-bold text-white">{b.user?.name || 'Unknown'}</div>
                          <div className="text-[10px] text-white/60">{b.user?.email || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/70">{b.package?.title || 'Removed'}</td>
                    <td className="px-6 py-4 text-sm text-white/80">{new Date(b.travelDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${getStatusStyle(b.status)}`}>{b.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-primary text-sm">₹{b.totalPrice?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {bookings.length === 0 && <div className="p-16 text-center text-white/50 text-sm">No bookings found</div>}
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
