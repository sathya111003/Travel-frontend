import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchDestinations } from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronRight, ArrowLeft, Globe, Map } from 'lucide-react';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getDestinations = async () => {
      try {
        const { data } = await fetchDestinations();
        setDestinations(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    getDestinations();
  }, []);

  const domesticRegions = destinations.filter(d => d.type === 'domestic');
  const internationalRegions = destinations.filter(d => d.type === 'international');

  const RegionCard = ({ region }) => (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={() => setSelectedRegion(region)}
      className="group relative bg-card/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 cursor-pointer transition-all hover:bg-primary/10 hover:border-primary/20"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-4">
            {region.type === 'domestic' ? <Map size={24} /> : <Globe size={24} />}
          </div>
          <h3 className="text-2xl font-bold text-text">{region.region}</h3>
          <p className="text-text/50 text-sm font-medium">{region.cities.length} Cities to Explore</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-text/30 group-hover:bg-primary group-hover:text-background transition-all">
          <ChevronRight size={24} />
        </div>
      </div>
    </motion.div>
  );

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -ml-48 -mt-48"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {loading ? (
          <div className="flex justify-center py-40">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
        <AnimatePresence mode="wait">
          {!selectedRegion ? (
            <motion.div
              key="regions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                <div className="space-y-4">
                  <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs">Explore Destinations</span>
                  <h2 className="text-4xl md:text-5xl font-bold text-text tracking-tighter">Where do you <span className="text-primary italic">want to go?</span></h2>
                </div>
              </div>

              <div className="space-y-16">
                <div>
                  <h3 className="text-xl font-bold text-text/40 mb-8 flex items-center gap-3">
                    <span className="w-8 h-[2px] bg-primary/30"></span>
                    Domestic Getaways
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {domesticRegions.map((region, idx) => <RegionCard key={idx} region={region} />)}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-text/40 mb-8 flex items-center gap-3">
                    <span className="w-8 h-[2px] bg-primary/30"></span>
                    International Wonders
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {internationalRegions.map((region, idx) => <RegionCard key={idx} region={region} />)}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="cities"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <button 
                onClick={() => setSelectedRegion(null)}
                className="flex items-center gap-2 text-text/50 hover:text-primary font-bold mb-12 transition-colors group"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Back to Regions
              </button>

              <div className="mb-16">
                <h2 className="text-4xl md:text-6xl font-bold text-text tracking-tighter mb-4">{selectedRegion.region}</h2>
                <p className="text-text/60 text-lg">Pick a city to see available travel packages.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {selectedRegion.cities.map((city, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    onClick={() => navigate(`/packages?city=${city.name}`)}
                    className="relative h-[28rem] rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-2xl"
                  >
                    <img 
                      src={city.image} 
                      alt={city.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                    <div className="absolute bottom-8 left-8 right-8">
                      <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-2">
                        <MapPin size={14} />
                        {selectedRegion.type}
                      </div>
                      <h3 className="text-3xl font-bold text-text group-hover:text-primary transition-colors">{city.name}</h3>
                      <p className="text-text/50 text-sm mt-2 line-clamp-2">{city.description}</p>
                      
                      <div className="mt-6 flex items-center gap-2 text-primary font-bold text-sm opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                        View Packages <ChevronRight size={16} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        )}
      </div>
    </section>
  );
};

export default Destinations;
