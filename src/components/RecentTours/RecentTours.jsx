import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchRecentTours } from '../../api/api';
import { Clock, Image as ImageIcon, Video, Music } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const RecentTours = ({ title = "Our Recent Tours", subtitle = "Take a look at some of our most recently completed adventures. Real memories from real travelers." }) => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getTours = async () => {
      try {
        const { data } = await fetchRecentTours();
        setTours(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    getTours();
  }, []);


  return (
    <section className="py-24 bg-background/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-text"
          >
            {title === "Our Recent Tours" ? (
              <>Our <span className="text-primary">Recent Tours</span></>
            ) : (
              title
            )}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-text/60 max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {tours.length === 0 ? (
              <div className="col-span-full text-center py-20 glass rounded-3xl border border-primary/10">
                <ImageIcon className="w-12 h-12 text-text/20 mx-auto mb-4" />
                <p className="text-text/40 italic">Coming soon: Memories of our latest explorations.</p>
              </div>
            ) : (
              tours.map((tour, index) => (
                <motion.div
                  key={tour._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  onClick={() => navigate(`/recent-tour/${tour._id}`)}
                  className="cursor-pointer glass rounded-[2.5rem] overflow-hidden group border border-primary/5 hover:border-primary/20 transition-all shadow-xl"
                >
                  <div className="relative h-72 overflow-hidden block">
                    <img 
                      src={tour.image} 
                      alt={tour.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80"></div>
                    {(tour.videoUrl || tour.audioUrl) && (
                      <div className="absolute top-4 right-4 flex gap-2">
                        {tour.videoUrl && (
                          <span className="bg-blue-500/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 border border-white/20">
                            <Video size={10} /> Video
                          </span>
                        )}
                        {tour.audioUrl && (
                          <span className="bg-[#F97316]/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 border border-white/20">
                            <Music size={10} /> Audio
                          </span>
                        )}
                      </div>
                    )}
                    <div className="absolute bottom-6 left-6">
                      <div className="flex items-center space-x-2 bg-primary/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary mb-2 border border-primary/20 w-max">
                        <Clock size={12} />
                        <span>{tour.days}</span>
                      </div>
                      <h4 className="text-2xl font-bold text-text group-hover:text-primary transition-colors">{tour.title}</h4>
                    </div>
                  </div>
                  <div className="p-8">
                    <p className="text-text/60 text-sm leading-relaxed line-clamp-3">
                      {tour.description}
                    </p>
                    <div className="mt-6 pt-6 border-t border-primary/10 flex justify-between items-center">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-text/30">Completed Adventure</span>
                      <div className="flex items-center space-x-3">
                        {tour.audioUrl && (
                          <button onClick={(e) => { e.stopPropagation(); window.open(tour.audioUrl, '_blank'); }} className="text-primary hover:text-[#F97316] transition-colors" title="Listen to Audio">
                            <Music size={18} />
                          </button>
                        )}
                        {tour.videoUrl && (
                          <button onClick={(e) => { e.stopPropagation(); window.open(tour.videoUrl, '_blank'); }} className="text-primary hover:text-[#F97316] transition-colors" title="Watch Video">
                            <Video size={18} />
                          </button>
                        )}
                        <span className="text-primary font-bold text-sm hover:underline">
                          View Memories
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentTours;
