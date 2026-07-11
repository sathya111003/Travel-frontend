import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import { fetchAllReviews } from '../../api/api';
import { Quote, Star, Sparkles } from 'lucide-react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SlickSlider = Slider.default || Slider;

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: false,
  };

  useEffect(() => {
    const getReviews = async () => {
      try {
        const { data } = await fetchAllReviews();
        setReviews(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    getReviews();
  }, []);

  if (loading || reviews.length === 0) return null;

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg px-4 py-1.5 mb-5">
          <Sparkles size={12} className="text-primary" />
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Testimonials</span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-black text-white mb-14 tracking-tight"
        >
          What Our <span className="gradient-text">Travelers Say</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-10 md:p-14 rounded-3xl relative"
        >
          <Quote className="w-14 h-14 text-primary/10 absolute top-6 left-6" />
          <SlickSlider {...settings}>
            {reviews.map((rev, i) => (
              <div key={i} className="space-y-6 outline-none px-4">
                <div className="flex justify-center space-x-1 text-primary">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} size={16} className={idx < rev.rating ? 'fill-primary' : 'text-white/50'} />
                  ))}
                </div>

                <p className="text-lg md:text-xl text-white/70 italic leading-relaxed">
                  "{rev.comment}"
                </p>

                <div className="pt-2">
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider">{rev.name}</h4>
                  <p className="text-[10px] text-white/60 mt-0.5">Verified Traveler</p>
                </div>
              </div>
            ))}
          </SlickSlider>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
