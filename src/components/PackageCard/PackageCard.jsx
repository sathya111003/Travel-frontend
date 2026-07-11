import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fixMediaUrl } from '../../api/api';

const PackageCard = ({ pkg }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      whileHover={{ y: -10 }}
      onClick={() => navigate(`/package/${pkg._id}`)}
      className="glass rounded-2xl overflow-hidden group border border-primary/10 hover:border-primary/30 transition-all shadow-xl cursor-pointer"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={fixMediaUrl(pkg.images && pkg.images[0] ? pkg.images[0] : 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop')}
          alt={pkg.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop'; }}
        />
        <div className="absolute top-4 left-4 bg-primary text-background px-3 py-1 rounded-full text-xs font-bold">
          {pkg.category}
        </div>
        <div className="absolute top-4 right-4 bg-background/60 backdrop-blur-md text-text px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
          <Star className="w-3 h-3 text-primary fill-primary" />
          <span>4.9</span>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-center text-primary text-xs font-bold space-x-1">
          <MapPin className="w-3 h-3" />
          <span>{pkg.location?.city || 'Various Locations'}</span>
        </div>

        <h3 className="text-xl font-bold text-text group-hover:text-primary transition-colors line-clamp-1">
          {pkg.title}
        </h3>

        <div className="flex items-center justify-between text-text/60 text-sm">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{pkg.duration}</span>
          </div>
          <div className="text-primary font-bold text-lg">
            ₹{pkg.price ? pkg.price.toLocaleString() : 'N/A'}
          </div>
        </div>

        <div
          className="block w-full text-center bg-primary/10 group-hover:bg-primary text-primary group-hover:text-background py-3 rounded-xl font-bold transition-all border border-primary/20"
        >
          View Details
        </div>
      </div>
    </motion.div>
  );
};

export default PackageCard;
