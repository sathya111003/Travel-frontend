import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Music, Video as VideoIcon } from 'lucide-react';
import { fetchRecentTourById } from '../api/api';

const RecentTourDetails = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    const getTourDetails = async () => {
      try {
        const { data } = await fetchRecentTourById(id);
        setTour(data);
        setActiveImage(data.image || '');
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    getTourDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex justify-center items-center bg-background">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-background text-white">
        <h2 className="text-3xl font-bold mb-4">Tour Memory Not Found</h2>
        <Link to="/" className="text-primary hover:underline">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-background min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <Link to={-1} className="inline-flex items-center space-x-2 text-text/60 hover:text-primary transition-colors mb-8">
          <ArrowLeft size={20} />
          <span>Back to Memories</span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl"
        >
          {/* Main Image */}
          <div className="relative h-[40vh] md:h-[60vh] w-full bg-black/20">
            <img 
              src={activeImage || tour.image} 
              alt={tour.title} 
              className="w-full h-full object-cover transition-all duration-300"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent"></div>
            <div className="absolute bottom-10 left-10 right-10">
              <div className="flex items-center space-x-3 mb-4">
                <span className="bg-primary/20 backdrop-blur-md text-primary px-4 py-2 rounded-full font-bold text-sm flex items-center space-x-2 border border-primary/20">
                  <Clock size={16} />
                  <span>{tour.days}</span>
                </span>
                <span className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full font-bold text-sm uppercase tracking-widest border border-white/20">
                  Completed Adventure
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
                {tour.title}
              </h1>
            </div>
          </div>

          {/* Gallery Thumbnails */}
          {tour.images && tour.images.length > 1 && (
            <div className="flex gap-3 px-10 pt-6 overflow-x-auto scrollbar-thin scrollbar-thumb-white/10">
              {tour.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImage === img ? 'border-primary scale-105 shadow-lg shadow-primary/20' : 'border-white/5 hover:border-white/25'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=200&auto=format&fit=crop'; }} />
                </button>
              ))}
            </div>
          )}

          {/* Content & Media */}
          <div className="p-10 space-y-12">
            <div className="prose prose-invert max-w-none">
              <h3 className="text-2xl font-bold text-primary mb-4">The Experience</h3>
              <p className="text-lg text-text/80 leading-relaxed font-light">
                {tour.description}
              </p>
            </div>

            {/* Media Section */}
            {((tour.videoUrl || (tour.videoUrls && tour.videoUrls.length > 0)) || tour.audioUrl) && (
              <div className="border-t border-white/10 pt-12 space-y-8">
                <h3 className="text-2xl font-bold text-white flex items-center space-x-3">
                  <span>Tour Media</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Video Player(s) */}
                  {((tour.videoUrls && tour.videoUrls.length > 0) || tour.videoUrl) && (
                    <div className="space-y-4 md:col-span-2">
                      <div className="flex items-center space-x-2 text-primary">
                        <VideoIcon size={20} />
                        <h4 className="font-bold">Tour Videos</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(tour.videoUrls && tour.videoUrls.length > 0 ? tour.videoUrls : [tour.videoUrl]).map((videoUrl, vIdx) => {
                          if (!videoUrl) return null;
                          return (
                            <div key={vIdx} className="space-y-2">
                              <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black aspect-video relative">
                                {videoUrl.includes('youtube') || videoUrl.includes('vimeo') ? (
                                  <iframe 
                                    src={videoUrl} 
                                    className="w-full h-full"
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                  ></iframe>
                                ) : (
                                  <video 
                                    controls 
                                    playsInline
                                    preload="metadata"
                                    className="w-full h-full object-contain relative z-10 pointer-events-auto cursor-pointer"
                                  >
                                    <source src={videoUrl} />
                                    Your browser does not support the video tag.
                                  </video>
                                )}
                              </div>
                              {tour.videoUrls && tour.videoUrls.length > 1 && (
                                <p className="text-xs text-white/40 text-center">Video {vIdx + 1}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Audio Player */}
                  {tour.audioUrl && (
                    <div className="space-y-4 md:col-span-2">
                      <div className="flex items-center space-x-2 text-[#F97316]">
                        <Music size={20} />
                        <h4 className="font-bold">Client Audio Review</h4>
                      </div>
                      <div className="glass p-8 rounded-3xl border border-[#F97316]/20 flex flex-col items-center justify-center space-y-6">
                        <div className="w-20 h-20 bg-[#F97316]/10 rounded-full flex items-center justify-center">
                          <Music className="w-10 h-10 text-[#F97316]" />
                        </div>
                        <audio 
                          src={tour.audioUrl} 
                          controls 
                          className="w-full max-w-sm rounded-full"
                        ></audio>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RecentTourDetails;
