import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Search, MapPin } from 'lucide-react';
import { fetchAllPackagesAdmin, deletePackage } from '../../../api/api';
import { fixMediaUrl } from '../../../api/api';
import PackageForm from './PackageForm';

const PackageManagement = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const getPackages = async () => {
    try {
      const { data } = await fetchAllPackagesAdmin();
      setPackages(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => { getPackages(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await deletePackage(id);
        getPackages();
      } catch (error) {
        alert('Error deleting package');
      }
    }
  };

  const filteredPackages = packages.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.location?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Package Management</h1>
          <p className="text-white/70 text-sm mt-1">Add, update, or remove travel packages.</p>
        </div>
        <button onClick={() => { setEditingPackage(null); setShowForm(true); }} className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all">
          <Plus size={18} /> Add Package
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
        <input 
          type="text" placeholder="Search by title or location..."
          className="w-full bg-card pl-11 pr-4 py-3 rounded-xl border border-white/[0.06] focus:border-primary/40 transition-all text-sm text-white placeholder:text-white/50 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-white/[0.06] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-6 py-4 text-[10px] font-bold text-white/60 uppercase tracking-widest">Image</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-white/60 uppercase tracking-widest">Details</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-white/60 uppercase tracking-widest">Category</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-white/60 uppercase tracking-widest">Price</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-white/60 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredPackages.map((pkg) => (
                  <tr key={pkg._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-16 h-12 rounded-lg overflow-hidden border border-white/[0.06]">
                        <img src={fixMediaUrl(pkg.images?.[0])} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=200&auto=format&fit=crop'; }} />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white text-sm">{pkg.title}</div>
                      <div className="text-xs text-white/60 flex items-center mt-0.5">
                        <MapPin size={10} className="mr-1" /> {pkg.location?.city} &bull; {pkg.duration}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-white/[0.04] text-white/50 border border-white/[0.06]">{pkg.category}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-primary text-sm">₹{pkg.price?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => { setEditingPackage(pkg); setShowForm(true); }} className="p-2 rounded-lg bg-white/[0.04] text-white/70 hover:text-primary hover:bg-primary/10 transition-all">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(pkg._id)} className="p-2 rounded-lg bg-white/[0.04] text-white/70 hover:text-red-400 hover:bg-red-400/10 transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredPackages.length === 0 && (
            <div className="p-16 text-center text-white/50 text-sm">No packages found</div>
          )}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <PackageForm 
            onClose={() => setShowForm(false)} 
            initialData={editingPackage}
            onSuccess={() => {
              getPackages();
              alert(`Package ${editingPackage ? 'updated' : 'created'} successfully!`);
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PackageManagement;
