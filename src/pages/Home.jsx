import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero/Hero';
import Destinations from '../components/Destinations/Destinations';
import PackageCard from '../components/PackageCard/PackageCard';
import WhyChooseUs from '../components/WhyChooseUs/WhyChooseUs';
import RecentTours from '../components/RecentTours/RecentTours';
import Testimonials from '../components/Testimonials/Testimonials';
import { fetchPackages, createReview } from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { X, Star, Send, Heart, Compass, Users, Globe, Map, Calendar, ChevronRight, Sparkles, Shield, Clock } from 'lucide-react';

const CategoryCard = ({ title, icon: Icon, path, count, image }) => (
  <Link to={path} className="group relative overflow-hidden rounded-3xl h-60">
    <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
      <div>
        <div className="w-10 h-10 bg-primary/20 backdrop-blur-md rounded-xl flex items-center justify-center text-primary mb-3 border border-primary/20">
          <Icon size={20} />
        </div>
        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mt-1">{count} Packages</p>
      </div>
      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-all transform translate-x-3 group-hover:translate-x-0">
        <ChevronRight size={16} />
      </div>
    </div>
  </Link>
);

const Home = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({ packageId: '', rating: 5, comment: '' });
  const [recentPackages, setRecentPackages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await fetchPackages();
        setPackages(data);
        const sorted = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentPackages(sorted.slice(0, 4));
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    getData();
  }, []);

  const handleSearch = () => {
    if (searchKeyword.trim()) navigate(`/packages?keyword=${searchKeyword}`);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await createReview(reviewData);
      alert('Review submitted successfully!');
      setShowReviewModal(false);
      setReviewData({ packageId: '', rating: 5, comment: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit review. Please login.');
    }
  };

  const categories = [
    { title: 'Honeymoon', icon: Heart, path: '/packages?category=honeymoon', count: 12, image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80' },
    { title: 'Family Trips', icon: Users, path: '/packages?category=family', count: 24, image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80' },
    { title: 'Adventure', icon: Compass, path: '/packages?category=adventure', count: 18, image: 'https://images.unsplash.com/photo-1533240332313-0dbf2645396d?auto=format&fit=crop&q=80' },
    { title: 'International', icon: Globe, path: '/packages?category=international', count: 32, image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&q=80' },
  ];

  return (
    <div className="overflow-hidden bg-background">
      <Hero />

      {/* Search Bar */}
      <div className="max-w-5xl mx-auto px-4 -mt-14 relative z-30">
        <div className="glass-card p-6 md:p-8 rounded-3xl flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 space-y-1.5 w-full">
            <label className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
              <Map size={10} /> Where to next?
            </label>
            <input
              placeholder="Search destination..."
              className="bg-transparent text-lg font-bold outline-none w-full placeholder:text-white/50"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="hidden md:block w-px h-10 bg-white/[0.06]" />
          <div className="flex-1 space-y-1.5 w-full">
            <label className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
              <Calendar size={10} /> Travel Style
            </label>
            <select className="bg-transparent text-lg font-bold outline-none w-full appearance-none cursor-pointer" onChange={(e) => e.target.value !== 'Any Style' && navigate(`/packages?category=${e.target.value.toLowerCase()}`)}>
              <option className="bg-card">Any Style</option>
              <option className="bg-card">Honeymoon</option>
              <option className="bg-card">Family Trips</option>
              <option className="bg-card">Adventure</option>
            </select>
          </div>
          <button onClick={handleSearch} className="w-full md:w-auto bg-primary text-white px-8 py-4 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all">
            Search
          </button>
        </div>
      </div>

      {/* Trust Cards */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-center gap-4">
          {[
            { icon: Shield, text: '100% Safe & Secure', sub: 'Verified Partners' },
            { icon: Clock, text: '24/7 Support', sub: 'Always Available' },
            { icon: Star, text: '4.8 Rated', sub: '10k+ Happy Clients' },
          ].map(({ icon: Icon, text, sub }, i) => (
            <div
              key={i}
              className="bg-white/[0.04] backdrop-blur-md px-6 py-4 rounded-xl border border-white/[0.05] flex items-center space-x-3 flex-1 justify-center"
            >
              <Icon size={18} className="text-primary shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">{text}</p>
                <p className="text-[10px] text-white/70">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Latest Packages */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Discover Your <span className="gradient-text">Next Adventure</span></h2>
            <p className="text-white/70 text-sm">Recently added packages based on your favorite locations.</p>
          </div>
          <button onClick={() => navigate('/packages?sort=latest')} className="bg-white/[0.04] hover:bg-white/[0.08] px-6 py-3 rounded-xl text-sm font-bold transition-all border border-white/[0.06] text-white/60">
            View All
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentPackages.map((pkg) => <PackageCard key={pkg._id} pkg={pkg} />)}
          </div>
        )}
      </section>

      {/* Top Rated CTA */}
      <section className="py-20 bg-primary/5 relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6 relative z-10">
          <div className="flex justify-center space-x-1 text-primary">
            {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" size={18} />)}
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Top Rated Experiences</h2>
          <p className="text-white/70 text-sm">Your feedback helps us curate better journeys.</p>
          <button onClick={() => setShowReviewModal(true)} className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all">
            Add Your Review
          </button>
        </div>
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="" />
        </div>
      </section>

      <Destinations />

      {/* Categories */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48" />
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Travel <span className="gradient-text">Categories</span></h2>
              <p className="text-white/70 text-sm max-w-md">Tailored experiences for every kind of traveler.</p>
            </div>
            <Link to="/packages" className="mt-4 md:mt-0 flex items-center gap-1.5 text-primary font-bold text-sm group">
              View All <ChevronRight className="transition-transform group-hover:translate-x-1" size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => <CategoryCard key={idx} {...cat} />)}
          </div>
        </div>
      </section>

      {/* Premium Packages */}
      <section className="py-24 bg-white/[0.01] relative">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] -ml-48 -mb-48" />
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Premium <span className="gradient-text">Experiences</span></h2>
            <p className="text-white/70 text-sm max-w-lg mx-auto">Hand-picked packages offering the best of luxury and exploration.</p>
          </div>
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.slice(0, 3).map((pkg) => <PackageCard key={pkg._id} pkg={pkg} />)}
            </div>
          )}
          <div className="mt-14 text-center">
            <Link to="/packages" className="inline-flex items-center gap-3 glass-card px-8 py-4 rounded-2xl font-bold text-sm text-white/70 hover:text-primary transition-all group">
              <span>Explore More Destinations</span>
              <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary transition-all group-hover:text-white">
                <ChevronRight size={14} />
              </div>
            </Link>
          </div>
        </div>
      </section>

      <WhyChooseUs />
      <RecentTours />
      <Testimonials />

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowReviewModal(false)} className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.2 }} className="relative bg-card border border-white/[0.06] p-8 md:p-10 rounded-3xl w-full max-w-lg shadow-2xl">
              <button onClick={() => setShowReviewModal(false)} className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors"><X size={24} /></button>
              <div className="flex items-center gap-2 mb-6">
                <Sparkles size={16} className="text-primary" />
                <h3 className="text-xl font-bold text-white">Share Your Journey</h3>
              </div>

              <form onSubmit={submitReview} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Select Package</label>
                  <select required className="w-full bg-background border border-white/[0.06] p-3 rounded-xl outline-none focus:border-primary/50 transition-colors text-sm text-white" onChange={(e) => setReviewData({ ...reviewData, packageId: e.target.value })}>
                    <option value="">Choose a package you visited...</option>
                    {packages.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button key={num} type="button" onClick={() => setReviewData({ ...reviewData, rating: num })} className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${reviewData.rating >= num ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-background border-white/[0.06] hover:border-primary/30'}`}>
                        <Star size={14} fill={reviewData.rating >= num ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Review Comment</label>
                  <textarea placeholder="Tell us about your experience..." className="w-full bg-background border border-white/[0.06] p-3 rounded-xl outline-none focus:border-primary/50 transition-colors h-28 resize-none text-sm text-white" value={reviewData.comment} onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })} required />
                </div>

                <button type="submit" className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.99] transition-all shadow-lg shadow-primary/20">
                  <span>Submit Review</span>
                  <Send size={14} />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
