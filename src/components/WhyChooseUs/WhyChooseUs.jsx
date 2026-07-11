import React from 'react';
import { ShieldCheck, Headphones, DollarSign, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: DollarSign,
    title: 'Best Price Guarantee',
    desc: 'We offer the most competitive prices for luxury travel experiences.',
  },
  {
    icon: Headphones,
    title: '24/7 Customer Support',
    desc: 'Our travel experts are always available to help you during your trip.',
  },
  {
    icon: ShieldCheck,
    title: 'Trusted & Secure',
    desc: '100% secure payments and verified travel partners worldwide.',
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg px-4 py-1.5 mb-5">
            <Sparkles size={12} className="text-primary" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Why Us</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">Why Choose Us?</h2>
          <p className="text-white/70 text-sm max-w-md mx-auto">We make your travel planning stress-free and exciting.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="glass-card p-8 rounded-3xl text-center group"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all group-hover:bg-primary/15">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
              <p className="text-white/70 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
