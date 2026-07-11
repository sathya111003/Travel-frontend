import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createEnquiry } from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';

const ContactPage = () => {
  const { userInfo, openAuthModal } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const [errors, setErrors] = useState({});

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: '', message: '' }), 4000);
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Enter a valid email';
    if (!formData.phone.trim()) errs.phone = 'Phone is required';
    else if (!/^[+]?[\d\s-]{7,15}$/.test(formData.phone)) errs.phone = 'Enter a valid phone number';
    if (!formData.message.trim()) errs.message = 'Message is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      openAuthModal('login');
      return;
    }
    if (!validate()) return;

    setLoading(true);
    try {
      await createEnquiry(formData);
      showToast('success', 'Enquiry sent successfully! We will contact you soon.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setErrors({});
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Failed to send enquiry. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  return (
    <div className="pt-28 pb-20 bg-background min-h-screen">
      {/* Toast */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-24 right-4 z-[200] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border ${
              toast.type === 'success'
                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">Get In Touch</h1>
          <p className="text-white/70 max-w-lg mx-auto">Have questions? We're here to help you plan your perfect trip.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="glass-card p-8 rounded-3xl space-y-6">
              <h3 className="text-xl font-bold text-white">Contact Information</h3>

              {[
                { icon: Phone, label: 'Phone', value: '+91-9361571902', href: 'tel:+919361571902' },
                { icon: Mail, label: 'Email', value: 'ravanaholidaysofficial@gmail.com', href: 'mailto:ravanaholidaysofficial@gmail.com' },
                { icon: MapPin, label: 'Head Office', value: 'Adventure City, India' },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{label}</h4>
                    {href ? (
                      <a href={href} className="text-white/70 text-sm hover:text-primary transition-colors">{value}</a>
                    ) : (
                      <p className="text-white/70 text-sm">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="h-[280px] glass-card rounded-3xl overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                src="https://maps.google.com/maps?q=Ooty&hl=es&z=14&amp;output=embed"
                className="grayscale invert brightness-90 contrast-125"
                title="Ravana Holidays Office Location"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-card p-8 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -mr-24 -mt-24" />

            <h3 className="text-xl font-bold text-white mb-6">Send us a Message</h3>
            <form className="space-y-5" onSubmit={handleEnquirySubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/70 uppercase tracking-wider">Your Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={`w-full bg-background border ${errors.name ? 'border-red-400/50' : 'border-white/[0.06]'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 text-white transition-colors`}
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-red-400 text-xs">{errors.name}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/70 uppercase tracking-wider">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={`w-full bg-background border ${errors.email ? 'border-red-400/50' : 'border-white/[0.06]'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 text-white transition-colors`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/70 uppercase tracking-wider">Phone *</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className={`w-full bg-background border ${errors.phone ? 'border-red-400/50' : 'border-white/[0.06]'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 text-white transition-colors`}
                    placeholder="+91 9876543210"
                  />
                  {errors.phone && <p className="text-red-400 text-xs">{errors.phone}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/70 uppercase tracking-wider">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => handleChange('subject', e.target.value)}
                    className="w-full bg-background border border-white/[0.06] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 text-white transition-colors"
                    placeholder="Query about Packages"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/70 uppercase tracking-wider">Message *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  className={`w-full bg-background border ${errors.message ? 'border-red-400/50' : 'border-white/[0.06]'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 text-white h-32 resize-none transition-colors`}
                  placeholder="Tell us what you're looking for..."
                />
                {errors.message && <p className="text-red-400 text-xs">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.99]"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
