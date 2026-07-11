import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchPackageDetails, fetchReviews, createReview } from '../api/api';
import Slider from 'react-slick';
const SlickSlider = Slider.default || Slider;
import { 
  Clock, MapPin, CheckCircle2, Utensils, Car, Star, 
  ShieldCheck, Send, User, Hotel, Calendar, ChevronDown, 
  Map as MapIcon, Coffee, Moon, Sun, ArrowRight, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { fixMediaUrl } from '../api/api';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PackageDetails = () => {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [activeDay, setActiveDay] = useState(0);
  const navigate = useNavigate();

  const { userInfo, openAuthModal } = useAuth();

  const getDetails = async () => {
    try {
      const { data } = await fetchPackageDetails(id);
      setPkg(data);
      const reviewsRes = await fetchReviews(id);
      setReviews(reviewsRes.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getDetails();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      return openAuthModal('login');
    }
    setSubmitting(true);
    try {
      await createReview({ packageId: id, ...newReview });
      setNewReview({ rating: 5, comment: '' });
      const reviewsRes = await fetchReviews(id);
      setReviews(reviewsRes.data);
    } catch (error) {
      alert('Failed to add review');
    } finally {
      setSubmitting(false);
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    fade: true
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
    </div>
  );

  if (!pkg) return <div className="h-screen flex items-center justify-center text-text">Package not found</div>;

  return (
    <div className="pt-24 pb-20 bg-background min-h-screen selection:bg-primary/30">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Breadcrumb & Quick Actions */}
        <div className="flex justify-between items-center mb-10 text-xs font-bold uppercase tracking-widest text-text/40">
          <div className="flex items-center space-x-2">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/packages" className="hover:text-primary transition-colors">Packages</Link>
            <span>/</span>
            <span className="text-primary">{pkg.title}</span>
          </div>
          <div className="flex space-x-6">
            <span className="flex items-center space-x-1"><Star size={12} className="text-primary" /> <span>4.9 / 5</span></span>
            <span className="flex items-center space-x-1"><MapPin size={12} className="text-primary" /> <span>{pkg.location?.city}, {pkg.location?.country}</span></span>
          </div>
        </div>

        {/* Hero Section - GT Inspired */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-24">
          {/* Images Slider */}
          <div className="lg:col-span-7">
            <div className="rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(239,68,68,0.2)] relative">
              <SlickSlider {...sliderSettings}>
                {pkg.images && pkg.images.length > 0 ? pkg.images.map((img, i) => (
                  <div key={i} className="h-[500px] md:h-[650px] relative">
                    <img src={fixMediaUrl(img)} alt={pkg.title} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop'; }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent"></div>
                  </div>
                )) : (
                  <div className="h-[650px] bg-card flex items-center justify-center">No images available</div>
                )}
              </SlickSlider>
              {/* Overlay Badges */}
              <div className="absolute top-8 left-8 flex flex-col space-y-3">
                 <span className="bg-primary text-background px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shadow-xl">{pkg.category}</span>
                 <span className="bg-background/40 backdrop-blur-md text-text px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border border-white/10">{pkg.type}</span>
              </div>
            </div>
          </div>

          {/* Intro & Booking Info */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-10">
            <div className="space-y-4">
               <h1 className="text-5xl md:text-6xl font-bold leading-[1.1] tracking-tighter">{pkg.title}</h1>
               <p className="text-text/60 text-lg italic font-medium leading-relaxed">"Discover the soul of {pkg.location?.city} with our premium curated experience."</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="glass p-6 rounded-[2.5rem] border border-primary/10">
                <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">Duration</p>
                <div className="flex items-center space-x-2">
                  <Clock size={20} className="text-text/80" />
                  <span className="text-xl font-bold">{pkg.duration}</span>
                </div>
              </div>
              <div className="glass p-6 rounded-[2.5rem] border border-primary/10">
                <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">Best Price</p>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold">₹{pkg.price.toLocaleString()}</span>
                  <span className="text-[10px] text-text/40 font-bold uppercase">/ Person</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-text/70 leading-relaxed">{pkg.description}</p>
              
              {pkg.tourOverview && (
                <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10">
                  <h4 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Tour Overview</h4>
                  <p className="text-text/80 text-sm leading-relaxed italic">{pkg.tourOverview}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {pkg.highlights?.map((h, i) => (
                  <span key={i} className="flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-bold border border-primary/20">
                    <CheckCircle2 size={14} />
                    <span>{h}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <button 
                onClick={() => {
                  if (!userInfo) {
                    openAuthModal('login');
                  } else {
                    navigate(`/booking/${pkg._id}`);
                  }
                }}
                className="w-full flex items-center justify-between bg-primary text-background p-6 rounded-[2.5rem] group hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_-10px_rgba(239,68,68,0.4)]"
              >
                <span className="text-xl font-bold px-4">Book This Experience</span>
                <div className="w-12 h-12 rounded-2xl bg-background/20 flex items-center justify-center transition-all group-hover:bg-background/40">
                  <ArrowRight size={24} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Details Tabs Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-24">
            
            {/* Itinerary - Detailed GT Style */}
            <section className="space-y-12">
              <div className="flex justify-between items-end border-b border-primary/10 pb-8">
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold flex items-center space-x-3">
                    <Calendar className="text-primary" size={28} />
                    <span>Experience Timeline</span>
                  </h3>
                  <p className="text-text/50 text-sm font-bold uppercase tracking-widest ml-10">Step by step journey details</p>
                </div>
                <div className="flex space-x-2">
                  {pkg.itinerary?.map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveDay(i)}
                      className={`w-10 h-10 rounded-xl font-bold transition-all ${activeDay === i ? 'bg-primary text-background scale-110 shadow-lg shadow-primary/20' : 'glass text-text/40 hover:text-primary'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-10">
                {pkg.itinerary?.map((day, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: activeDay === i ? 1 : 0, x: 0 }}
                    className={`glass p-10 md:p-14 rounded-[4rem] border border-primary/5 transition-all ${activeDay === i ? 'border-primary/30 ring-1 ring-primary/20 shadow-2xl scale-[1.02]' : 'hidden'}`}
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-8 mb-12">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                           <span className="text-5xl font-black text-primary/20">0{day.day}</span>
                           <h4 className="text-3xl font-bold">{day.title}</h4>
                        </div>
                        <div className="flex items-center space-x-4 ml-16">
                           <span className="flex items-center space-x-1 text-xs font-bold text-text/40 uppercase tracking-widest"><Car size={14} className="text-primary" /> <span>{day.travel}</span></span>
                           <span className="flex items-center space-x-1 text-xs font-bold text-text/40 uppercase tracking-widest"><MapPin size={14} className="text-primary" /> <span>{day.places?.length} Landmarks</span></span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      {/* Timeline List */}
                      <div className="space-y-8 relative">
                        <div className="absolute left-4 top-2 bottom-2 w-[2px] bg-primary/10"></div>
                        {day.activities?.map((act, idx) => (
                          <div key={idx} className="relative pl-12">
                            <div className="absolute left-[13px] top-1 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1 block">{act.time}</span>
                            <p className="text-text/80 text-sm leading-relaxed font-medium">{act.description}</p>
                          </div>
                        ))}
                      </div>

                      {/* Meals & Places */}
                      <div className="space-y-8">
                        <div className="bg-background/30 p-8 rounded-[3rem] border border-primary/5 space-y-6">
                           <h5 className="flex items-center space-x-2 text-primary font-bold text-sm uppercase tracking-wider">
                             <Utensils size={18} />
                             <span>Gastronomy Details</span>
                           </h5>
                           <div className="space-y-4">
                             {['breakfast', 'lunch', 'dinner'].map(m => (
                               <div key={m} className="flex justify-between items-center text-sm">
                                  <span className="capitalize text-text/40 font-bold">{m}</span>
                                  <span className="font-bold flex items-center space-x-2">
                                     <span>{day.food?.[m]?.name || 'Local Cuisine'}</span>
                                     {day.food?.[m]?.included && <CheckCircle2 size={14} className="text-accent" />}
                                  </span>
                               </div>
                             ))}
                           </div>
                        </div>
                        <div className="space-y-4">
                           <h5 className="font-bold text-xs uppercase tracking-widest text-text/30">Key Destinations</h5>
                           <div className="flex flex-wrap gap-2">
                             {day.places?.map((p, idx) => (
                               <span key={idx} className="glass px-4 py-2 rounded-xl text-xs font-bold text-text/60 border border-primary/5">{p}</span>
                             ))}
                           </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Your Stay - Day Wise */}
            <section className="space-y-10">
               <div className="space-y-2">
                  <h3 className="text-3xl font-bold flex items-center space-x-3">
                    <Hotel className="text-primary" size={28} />
                    <span>Your Stay</span>
                  </h3>
                  <p className="text-text/50 text-sm font-bold uppercase tracking-widest ml-10">Day wise accommodation</p>
               </div>
               
               <div className="space-y-6">
                 {pkg.itinerary?.map((day, i) => (
                   <div key={i} className="bg-card p-8 rounded-3xl border border-white/10 hover:border-primary/30 transition-all">
                     <div className="flex items-center gap-4 mb-4">
                       <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center shrink-0">
                         <span className="text-primary font-black text-lg">D{day.day}</span>
                       </div>
                       <div>
                         <h4 className="font-bold text-lg text-white">{day.title}</h4>
                         <p className="text-xs text-white/50 font-bold uppercase tracking-widest">{day.travel}</p>
                       </div>
                     </div>
                     {day.places && day.places.length > 0 && (
                       <div className="flex flex-wrap gap-2 ml-16">
                         {day.places.map((place, idx) => (
                           <span key={idx} className="bg-primary/10 px-3 py-1.5 rounded-lg text-xs font-bold text-primary border border-primary/20">{place}</span>
                         ))}
                       </div>
                     )}
                   </div>
                 ))}
               </div>
            </section>

            {/* Location Map - Day Wise */}
            <section className="space-y-10">
               <div className="space-y-2">
                  <h3 className="text-3xl font-bold flex items-center space-x-3">
                    <MapIcon className="text-primary" size={28} />
                    <span>Location Map</span>
                  </h3>
                  <p className="text-text/50 text-sm font-bold uppercase tracking-widest ml-10">Day wise locations</p>
               </div>
               
               <div className="space-y-4">
                 {pkg.itinerary?.map((day, i) => (
                   <div key={i} className="bg-card p-6 rounded-2xl border border-white/10 hover:border-primary/30 transition-all flex items-center gap-5">
                     <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center shrink-0">
                       <MapPin size={22} className="text-primary" />
                     </div>
                     <div className="flex-1">
                       <div className="flex items-center gap-3 mb-1">
                         <span className="bg-primary text-white px-3 py-1 rounded-lg text-xs font-black">Day {day.day}</span>
                         <h4 className="font-bold text-white">{day.title}</h4>
                       </div>
                       {day.places && day.places.length > 0 && (
                         <p className="text-sm text-white/60">{day.places.join(' → ')}</p>
                       )}
                     </div>
                   </div>
                 ))}
               </div>
            </section>

            {/* Reviews Section */}
            <section className="space-y-12">
               <div className="flex justify-between items-end border-b border-primary/10 pb-8">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold flex items-center space-x-3">
                      <Star className="text-primary" size={28} />
                      <span>Guest Stories</span>
                    </h3>
                    <p className="text-text/50 text-sm font-bold uppercase tracking-widest ml-10">Real feedback from {reviews.length} travelers</p>
                  </div>
               </div>
               
               {/* Add Review Form */}
               <div className="glass p-10 rounded-[3rem] border border-primary/10 mb-12">
                  <h4 className="text-xl font-bold mb-6">Write a Review</h4>
                  <form onSubmit={handleReviewSubmit} className="space-y-6">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-text/40 uppercase tracking-widest">Your Rating:</span>
                      <div className="flex gap-2">
                        {[1,2,3,4,5].map(num => (
                          <button 
                            key={num} 
                            type="button" 
                            onClick={() => setNewReview({...newReview, rating: num})}
                            className={`p-2 rounded-lg transition-all ${newReview.rating >= num ? 'text-primary' : 'text-text/20'}`}
                          >
                            <Star size={20} fill={newReview.rating >= num ? 'currentColor' : 'none'} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea 
                      placeholder="Tell others about your experience..." 
                      className="w-full bg-background/50 border border-white/5 rounded-2xl p-6 outline-none focus:border-primary/50 transition-all h-32 resize-none"
                      value={newReview.comment}
                      onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                      required
                    ></textarea>
                    <button 
                      type="submit" 
                      disabled={submitting}
                      className="bg-primary text-background px-10 py-4 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Post Review'}
                      <Send size={18} />
                    </button>
                  </form>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {reviews.map((rev) => (
                    <div key={rev._id} className="glass p-8 rounded-[3rem] border border-primary/5 space-y-4 hover:border-primary/20 transition-all group">
                       <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-3">
                             <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-background transition-colors">
                               <User size={20} />
                             </div>
                             <div>
                                <h5 className="font-bold text-sm">{rev.name}</h5>
                                <p className="text-[10px] text-text/40 uppercase font-bold tracking-widest">Verified Traveler</p>
                             </div>
                          </div>
                          <div className="flex items-center space-x-0.5 text-primary">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={10} className={i < rev.rating ? 'fill-primary' : 'text-text/20'} />
                            ))}
                          </div>
                       </div>
                       <p className="text-text/70 italic text-sm leading-relaxed px-2">"{rev.comment}"</p>
                    </div>
                  ))}
               </div>
            </section>
          </div>

          {/* Sticky Sidebar Info */}
          <div className="lg:col-span-4">
             <div className="sticky top-28 space-y-8">
                 {/* Pricing / Rates Table */}
                 {pkg.rates && pkg.rates.length > 0 && (
                   <div className="glass p-10 rounded-[4rem] border border-primary/10 relative overflow-hidden group shadow-xl bg-primary/5">
                      <h4 className="text-xl font-bold mb-8 text-primary uppercase tracking-widest flex items-center space-x-3">
                         <Star size={20} />
                         <span>Group Rates</span>
                      </h4>
                      <div className="space-y-4">
                        {pkg.rates.map((rate, idx) => (
                          <div key={idx} className="flex justify-between items-center border-b border-primary/5 pb-3">
                            <span className="text-sm font-bold text-text/60">{rate.pax}</span>
                            <span className="text-lg font-black text-primary">₹{rate.price.toLocaleString()}</span>
                          </div>
                        ))}
                        <p className="text-[10px] text-text/40 italic mt-4 font-bold uppercase">* Rates mentioned are per head</p>
                      </div>
                   </div>
                 )}

                 {/* Inclusion & Exclusion Box */}
                 <div className="space-y-8">
                   <div className="glass p-10 rounded-[4rem] border border-primary/10 relative overflow-hidden group shadow-xl">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>
                      <h4 className="text-xl font-bold mb-8 text-primary uppercase tracking-widest flex items-center space-x-3">
                         <ShieldCheck size={20} />
                         <span>Inclusions</span>
                      </h4>
                      <ul className="space-y-4">
                        {pkg.highlights?.map((item, i) => (
                          <li key={i} className="flex items-start space-x-3 text-sm font-medium text-text/80">
                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0"></div>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                   </div>

                   {pkg.exclusions && pkg.exclusions.length > 0 && (
                     <div className="glass p-10 rounded-[4rem] border border-white/5 relative overflow-hidden group shadow-xl">
                        <h4 className="text-xl font-bold mb-8 text-red-400 uppercase tracking-widest flex items-center space-x-3">
                           <X size={20} />
                           <span>Exclusions</span>
                        </h4>
                        <ul className="space-y-4">
                          {pkg.exclusions.map((item, i) => (
                            <li key={i} className="flex items-start space-x-3 text-sm font-medium text-text/60">
                              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400/30 shrink-0"></div>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                     </div>
                   )}
                 </div>

                {/* Contact Banner */}
                <div className="bg-primary/10 p-10 rounded-[4rem] border border-primary/20 text-center space-y-6">
                   <h5 className="font-bold text-lg leading-tight">Need a customized version of this trip?</h5>
                   <button 
                     onClick={() => {
                       if (!userInfo) openAuthModal('login');
                       else navigate('/contact');
                     }}
                     className="w-full bg-primary text-background py-5 rounded-3xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
                   >
                     Talk to Trip Architect
                   </button>
                   <p className="text-xs text-primary font-bold">Call us: +91 93615 71902</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;
