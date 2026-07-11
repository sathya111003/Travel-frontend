import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, Mail, Phone, MapPin, MessageCircle, ArrowUpRight } from 'lucide-react';
import logo from '../../assets/logo.PNG';
import { subscribeNewsletter } from '../../api/api';
import JourneyBackground from './JourneyBackground';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const { data } = await subscribeNewsletter(email);
      setMessage(data.message || 'Subscribed! Check your email.');
      setEmail('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to subscribe. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-background border-t border-white/[0.04]">
      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-12">
        <div className="glass-card p-10 md:p-14 rounded-3xl text-center mb-16 relative overflow-hidden">
          <JourneyBackground />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mt-48" />
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3 relative z-10">Ready to Start Your Journey?</h2>
          <p className="text-white/70 mb-8 max-w-lg mx-auto relative z-10">Let us plan your perfect trip. Get exclusive deals and personalized itineraries.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
            <a href="https://wa.me/919361571902?text=Hi%20Ravana%20Holidays!%20I'm%20interested%20in%20booking%20a%20trip." target="_blank" rel="noopener noreferrer" className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold text-sm flex items-center space-x-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]">
              <MessageCircle size={16} />
              <span>WhatsApp Us</span>
            </a>
            <Link to="/packages" className="bg-white/[0.04] border border-white/[0.06] text-white/70 px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-white/[0.08] transition-all active:scale-[0.98]">
              Browse Packages
            </Link>
          </div>
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-5">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="Ravana Holidays" className="w-8 h-8 object-contain" />
              <span className="text-lg font-bold tracking-tight text-white uppercase">
                Ravana<span className="text-primary">Holidays</span>
              </span>
            </Link>
            <p className="text-white/35 text-sm leading-relaxed">
              Premium travel experiences tailored to your dreams. From snowy mountains to tropical beaches, we plan it all.
            </p>
            <div className="flex gap-2">
              <a href="https://www.instagram.com/_ravana_holidays_official_?igsh=ZjU3Z3JuZjF6ZDJ3&utm_source=qr" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/[0.04] rounded-lg flex items-center justify-center hover:bg-primary/10 hover:text-primary text-white/70 transition-all border border-white/[0.04]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://wa.me/919361571902" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/[0.04] rounded-lg flex items-center justify-center hover:bg-green-500/10 hover:text-green-400 text-white/70 transition-all border border-white/[0.04]">
                <MessageCircle size={16} />
              </a>
              <a href="mailto:ravanaholidaysofficial@gmail.com" className="w-9 h-9 bg-white/[0.04] rounded-lg flex items-center justify-center hover:bg-primary/10 hover:text-primary text-white/70 transition-all border border-white/[0.04]">
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', path: '/' },
                { label: 'Packages', path: '/packages' },
                { label: 'About Us', path: '/about' },
                { label: 'Contact', path: '/contact' },
                { label: 'My Bookings', path: '/dashboard' },
              ].map(({ label, path }) => (
                <li key={path}>
                  <Link to={path} className="text-sm text-white/70 hover:text-primary transition-colors flex items-center gap-1 group">
                    {label}
                    <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-5">Contact Us</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <MapPin size={14} className="text-primary/60 shrink-0 mt-0.5" />
                <span>Adventure City, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={14} className="text-primary/60 shrink-0" />
                <a href="tel:+919361571902" className="hover:text-primary transition-colors">+91 93615 71902</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={14} className="text-primary/60 shrink-0" />
                <a href="mailto:ravanaholidaysofficial@gmail.com" className="hover:text-primary transition-colors break-all">ravanaholidaysofficial@gmail.com</a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-5">Newsletter</h4>
            <p className="text-sm text-white/70 mb-4">Subscribe for latest deals and travel tips.</p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 text-white placeholder:text-white/50 transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary/10 hover:bg-primary/20 text-primary font-bold py-2.5 rounded-xl text-sm transition-all disabled:opacity-50 border border-primary/20"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {message && <p className="mt-2 text-xs text-primary/80">{message}</p>}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-6 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/25">
          <p>&copy; {new Date().getFullYear()} Ravana Holidays. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="https://wa.me/919361571902" target="_blank" rel="noopener noreferrer" className="hover:text-white/50 transition-colors">WhatsApp</a>
            <a href="https://www.instagram.com/_ravana_holidays_official_" target="_blank" rel="noopener noreferrer" className="hover:text-white/50 transition-colors">Instagram</a>
            <a href="mailto:ravanaholidaysofficial@gmail.com" className="hover:text-white/50 transition-colors">Email</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
