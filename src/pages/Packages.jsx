import React, { useState, useEffect } from 'react';
import PackageCard from '../components/PackageCard/PackageCard';
import { fetchPackages } from '../api/api';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, MapPin, Globe, Compass, Heart } from 'lucide-react';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const getPackages = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(location.search);
        const keyword = params.get('keyword') || '';
        const category = params.get('category') || '';
        const type = params.get('type') || '';
        const city = params.get('city') || '';
        const sort = params.get('sort') || '';
        
        const { data } = await fetchPackages();
        let filtered = [...data];

        if (keyword) {
          filtered = filtered.filter(p => 
            p.title.toLowerCase().includes(keyword.toLowerCase()) || 
            p.location?.city?.toLowerCase().includes(keyword.toLowerCase()) ||
            p.location?.country?.toLowerCase().includes(keyword.toLowerCase())
          );
        }
        if (category) {
          filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
        }
        if (type) {
          filtered = filtered.filter(p => p.type.toLowerCase() === type.toLowerCase());
        }
        if (city) {
          filtered = filtered.filter(p => p.location?.city?.toLowerCase() === city.toLowerCase());
        }
        if (sort === 'latest') {
          filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        setPackages(filtered);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    getPackages();
  }, [location.search]);

  const params = new URLSearchParams(location.search);
  const currentCity = params.get('city');
  const currentType = params.get('type') || 'all';
  const currentCategory = params.get('category');

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
          <div className="space-y-4">
            <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs">Curated Collections</span>
            <h1 className="text-4xl md:text-6xl font-bold text-text tracking-tighter">
              {currentCity ? `Packages in ${currentCity}` : 'Explore Our Packages'}
            </h1>
            <p className="text-text/60 max-w-xl">
              Hand-picked travel experiences designed to create memories that last a lifetime. 
              {currentCity && ` Discover the best of ${currentCity} with Ravana Holidays.`}
            </p>
          </div>

          <div className="w-full lg:w-96 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text/30 group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search packages, cities..." 
              className="w-full bg-card/50 border border-white/5 rounded-2xl py-5 pl-16 pr-8 outline-none focus:border-primary/50 transition-all backdrop-blur-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && navigate(`/packages?keyword=${searchTerm}`)}
            />
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-12">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl font-bold text-sm">
            <SlidersHorizontal size={16} />
            Filters:
          </div>

          {[
            { id: 'all', label: 'All Experiences', icon: Compass },
            { id: 'domestic', label: 'Domestic', type: 'type', icon: MapPin },
            { id: 'international', label: 'International', type: 'type', icon: Globe },
            { id: 'honeymoon', label: 'Honeymoon', type: 'category', icon: Heart }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => {
                const newParams = new URLSearchParams();
                if (f.id !== 'all') {
                  newParams.set(f.type, f.id);
                }
                navigate({ search: newParams.toString() });
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all font-bold text-sm ${
                (f.id === 'all' && currentType === 'all' && !currentCategory) || 
                (f.type === 'type' && currentType === f.id) ||
                (f.type === 'category' && currentCategory === f.id)
                  ? 'bg-primary border-primary text-background shadow-lg shadow-primary/20' 
                  : 'bg-card/50 border-white/5 text-text/60 hover:border-primary/30 hover:text-primary'
              }`}
            >
              <f.icon size={16} />
              {f.label}
            </button>
          ))}
          
          {currentCity && (
            <button
              onClick={() => {
                const newParams = new URLSearchParams(location.search);
                newParams.delete('city');
                navigate({ search: newParams.toString() });
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-background font-bold text-sm shadow-lg"
            >
              <MapPin size={16} />
              {currentCity} <span className="opacity-50">×</span>
            </button>
          )}
        </div>

        {/* Packages Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-text/40 font-bold animate-pulse">Finding best packages for you...</p>
          </div>
        ) : (
          <>
            {packages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {packages.map((pkg) => (
                  <PackageCard key={pkg._id} pkg={pkg} />
                ))}
              </div>
            ) : (
              <div className="text-center py-40 space-y-6">
                <div className="w-24 h-24 bg-card rounded-[2.5rem] flex items-center justify-center text-text/20 mx-auto mb-8 border border-white/5">
                  <Search size={48} />
                </div>
                <h2 className="text-3xl font-bold text-text">No packages found</h2>
                <p className="text-text/50 max-w-md mx-auto">We couldn't find any packages matching your current filters. Try adjusting your search or explore other destinations.</p>
                <button 
                  onClick={() => navigate('/packages')}
                  className="bg-primary text-background px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Packages;
