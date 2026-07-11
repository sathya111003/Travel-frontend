import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck, Wallet, PhoneCall, HeartHandshake,
  MapPin, Compass, Plane, Hotel, Car, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import RecentTours from '../components/RecentTours/RecentTours';
import logo from '../assets/logo.PNG';

const StatCard = ({ label, value }) => (
  <div className="glass-card p-6 rounded-2xl text-center">
    <h4 className="text-3xl font-black gradient-text mb-1">{value}</h4>
    <p className="text-xs font-bold text-white/70 uppercase tracking-widest">{label}</p>
  </div>
);

const FeatureCard = ({ icon: Icon, title }) => (
  <div className="glass-card p-6 rounded-2xl flex items-center space-x-4">
    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
      <Icon size={22} className="text-primary" />
    </div>
    <h4 className="font-bold text-white">{title}</h4>
  </div>
);

const ServiceTag = ({ icon: Icon, title }) => (
  <div className="flex items-center space-x-2 bg-white/[0.03] border border-white/[0.06] px-4 py-2.5 rounded-xl transition-all hover:border-primary/20">
    <Icon className="w-4 h-4 text-primary" />
    <span className="text-sm font-medium text-white/70">{title}</span>
  </div>
);

const About = () => {
  return (
    <div className="pt-28 pb-20 bg-background min-h-screen overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-28">
          {/* Image/Video */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-white/[0.06]"
          >
            <img
              src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1200"
              alt="Ravana Holidays travel experience - beautiful destination"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="glass-card px-5 py-3 rounded-xl inline-flex items-center space-x-2">
                <img src={logo} alt="Ravana Holidays" className="w-6 h-6" />
                <span className="text-xs font-bold text-white">Trusted by 10,000+ travelers</span>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="space-y-6"
          >
            <div className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-lg">
              <span className="text-primary text-[10px] font-black uppercase tracking-widest">About Us</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-white">
              Your Trusted{' '}
              <span className="gradient-text">Travel Partner</span>
            </h1>

            <div className="space-y-4 text-white/50 leading-relaxed">
              <p>
                We are a passionate and trusted travel company offering unforgettable domestic and international tour experiences. Our goal is to make every journey comfortable, exciting, and stress-free.
              </p>
              <p>
                From honeymoon packages and family vacations to adventure trips and luxury holidays, we provide complete travel planning including transport, accommodation, sightseeing, and personalized support.
              </p>
              <blockquote className="font-bold text-white/80 border-l-2 border-primary pl-4 py-2 bg-primary/5 rounded-r-lg text-sm">
                "Our mission is to make travel simple, affordable, and memorable for every traveler."
              </blockquote>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <StatCard label="Happy Travelers" value="10,000+" />
              <StatCard label="Destinations" value="150+" />
              <StatCard label="Tour Packages" value="500+" />
              <StatCard label="Years Experience" value="5+" />
            </div>

            <div className="pt-2 flex gap-3">
              <Link to="/packages" className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center space-x-2 hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]">
                <span>View Packages</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact" className="bg-white/[0.04] border border-white/[0.06] text-white/70 px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/[0.08] transition-all active:scale-[0.98]">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-28 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-black text-white mb-8">Services We Provide</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <ServiceTag icon={MapPin} title="Domestic Tours" />
            <ServiceTag icon={Compass} title="International Tours" />
            <ServiceTag icon={HeartHandshake} title="Honeymoon Packages" />
            <ServiceTag icon={Hotel} title="Family Trips" />
            <ServiceTag icon={Hotel} title="Hotel Booking" />
            <ServiceTag icon={Plane} title="Flight/Train Arrangements" />
            <ServiceTag icon={Car} title="Cab Services" />
          </div>
        </motion.div>

        {/* Why Choose Us */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-28"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Why Choose Us</h2>
            <p className="text-white/70 text-sm">We ensure the best quality service for your perfect trip.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard icon={ShieldCheck} title="Trusted Travel Partner" />
            <FeatureCard icon={Wallet} title="Affordable Packages" />
            <FeatureCard icon={PhoneCall} title="24/7 Support" />
            <FeatureCard icon={HeartHandshake} title="Safe & Comfortable Travel" />
            <FeatureCard icon={Compass} title="Experienced Guides" />
            <FeatureCard icon={MapPin} title="Custom Tour Planning" />
          </div>
        </motion.div>

        {/* Recent Tours */}
        <div className="-mx-4">
          <RecentTours title="Memories We Created" subtitle="Real glimpses of our tours and happy customers." />
        </div>
      </div>
    </div>
  );
};

export default About;
