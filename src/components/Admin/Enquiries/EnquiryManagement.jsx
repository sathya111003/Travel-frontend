import React, { useState, useEffect } from 'react';
import { Mail, Phone, User } from 'lucide-react';
import { fetchAllEnquiries } from '../../../api/api';

const EnquiryManagement = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEnquiries = async () => {
      try {
        const { data } = await fetchAllEnquiries();
        setEnquiries(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    getEnquiries();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">Enquiries</h1>
        <p className="text-white/70 text-sm mt-1">Messages from potential travelers.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map((e) => (
            <div key={e._id} className="bg-card p-6 rounded-2xl border border-white/[0.06]">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary"><User size={18} /></div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{e.name}</h4>
                      <p className="text-[10px] text-white/60">{new Date(e.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="bg-background/50 p-4 rounded-xl border border-white/[0.04]">
                    <p className="text-white/60 text-sm leading-relaxed">{e.message}</p>
                  </div>
                </div>
                <div className="md:w-56 space-y-2.5 md:border-l border-white/[0.06] md:pl-6">
                  <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-3">Contact</p>
                  <div className="flex items-center text-xs text-white/50"><Mail size={12} className="mr-2 text-primary/60" /> {e.email}</div>
                  <div className="flex items-center text-xs text-white/50"><Phone size={12} className="mr-2 text-primary/60" /> {e.phone || 'Not provided'}</div>
                </div>
              </div>
            </div>
          ))}
          {enquiries.length === 0 && <div className="bg-card p-16 rounded-2xl text-center text-white/50 text-sm">No enquiries yet</div>}
        </div>
      )}
    </div>
  );
};

export default EnquiryManagement;
