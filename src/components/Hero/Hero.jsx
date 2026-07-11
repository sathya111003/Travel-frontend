import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
  {
    type: 'domestic',
    badge: 'Incredible Domestic Wonders',
    title: 'Explore India’s Golden Gems',
    subtitle: 'From the serene backwaters of Kerala and tea gardens of Ooty, to the majestic peaks of Kashmir. Experience local guides, curated luxury stays, and seamless support.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2070&auto=format&fit=crop',
    link: '/packages'
  },
  {
    type: 'international',
    badge: 'Exotic International Escapes',
    title: 'Journey Beyond The Horizon',
    subtitle: 'Fly to your dream destination in Bali, Maldives, Thailand, or Europe. Premium custom itineraries featuring luxury resorts, flight assistance, and curated activities.',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2070&auto=format&fit=crop',
    link: '/packages'
  }
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background" aria-label="Hero">
      {/* Background Slides */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={slides[current].image}
              alt=""
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/60 to-background" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/50 to-transparent" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 text-center pt-24 pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/[0.06] backdrop-blur-md px-5 py-2 rounded-full mb-8 border border-white/[0.06]">
              <MapPin className="w-3.5 h-3.5 text-primary animate-pulse" />
              <span className="text-xs font-semibold text-white/80 tracking-wide">{slides[current].badge}</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight leading-[1.05] max-w-4xl">
              {slides[current].title.split(' ').map((word, i) => {
                if (i === 2 || i === 3) return <span key={i} className="gradient-text block sm:inline"> {word} </span>;
                return <span key={i}> {word} </span>;
              })}
            </h1>

            {/* Subheading */}
            <p className="text-base md:text-lg text-white/60 mb-12 max-w-2xl font-light leading-relaxed">
              {slides[current].subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={slides[current].link}
                className="group bg-primary hover:bg-primary/95 text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all flex items-center space-x-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98]"
              >
                <span>Explore Packages</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/80 px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all active:scale-[0.98]"
              >
                Plan My Trip
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Navigation Controls */}
      <div className="absolute bottom-10 left-10 right-10 z-30 flex items-center justify-between pointer-events-none">
        {/* Indicators */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                current === idx ? 'w-8 bg-primary' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex space-x-3 pointer-events-auto">
          <button
            onClick={prevSlide}
            className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08] text-white flex items-center justify-center hover:text-primary transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08] text-white flex items-center justify-center hover:text-primary transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
