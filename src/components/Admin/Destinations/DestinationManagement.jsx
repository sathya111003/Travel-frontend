import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';
import { fetchDestinations, createDestination, updateDestination, deleteDestination } from '../../../api/api';
import ImageUploadWidget from '../ImageUploadWidget';

const DestinationManagement = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ region: '', type: 'domestic', cities: [{ name: '', image: '' }] });

  const getDestinations = async () => { try { const { data } = await fetchDestinations(); setDestinations(data); } catch (e) { console.error(e); } setLoading(false); };
  useEffect(() => { getDestinations(); }, []);

  const handleCityChange = (idx, value) => {
    const c = [...formData.cities];
    c[idx] = { ...c[idx], name: value };
    setFormData({ ...formData, cities: c });
  };

  const handleCityImageChange = (idx, value) => {
    const c = [...formData.cities];
    c[idx] = { ...c[idx], image: value };
    setFormData({ ...formData, cities: c });
  };

  const addCity = () => {
    setFormData({ ...formData, cities: [...formData.cities, { name: '', image: '' }] });
  };

  const removeCity = (idx) => {
    setFormData({ ...formData, cities: formData.cities.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cleaned = {
        ...formData,
        cities: formData.cities
          .filter(c => c.name?.trim())
          .map(c => ({ name: c.name.trim(), image: c.image || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=600&auto=format&fit=crop' }))
      };
      if (editingId) await updateDestination(editingId, cleaned);
      else await createDestination(cleaned);
      setFormData({ region: '', type: 'domestic', cities: [{ name: '', image: '' }] });
      setEditingId(null); setShowForm(false); getDestinations();
    } catch (err) { alert(`Error: ${err.response?.data?.message || err.message}`); }
  };

  const handleEdit = (d) => {
    const cities = d.cities.map(c => ({
      name: typeof c === 'string' ? c : c.name || '',
      image: typeof c === 'object' ? (c.image || '') : ''
    }));
    setFormData({ region: d.region, type: d.type, cities });
    setEditingId(d._id); setShowForm(true);
  };

  const handleDelete = async (id) => { if (window.confirm('Delete this region?')) { try { await deleteDestination(id); getDestinations(); } catch { alert('Error'); } } };

  const inputCls = "w-full bg-background border border-white/[0.06] p-3 rounded-xl text-sm text-white outline-none focus:border-primary/40 transition-colors";

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Mega Menu</h1>
          <p className="text-white/70 text-sm mt-1">Manage regions & cities in the navbar menus.</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditingId(null); setFormData({ region: '', type: 'domestic', cities: [{ name: '', image: '' }] }); }} className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all">
          <Plus size={18} /> Add Region
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-card p-6 rounded-2xl border border-white/[0.06]">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Region Name</label>
                  <input required className={inputCls} value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})} placeholder="e.g. Kerala" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Menu Category</label>
                  <select className={`${inputCls} appearance-none cursor-pointer`} value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                    <option value="domestic">Domestic</option>
                    <option value="international">International</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Cities</label>
                <div className="space-y-4">
                  {formData.cities.map((city, idx) => (
                    <div key={idx} className="bg-white/[0.02] p-4 rounded-xl border border-white/[0.04] space-y-3">
                      <div className="flex gap-2 items-start">
                        <input required className={`${inputCls} flex-1`} placeholder="City Name" value={city.name} onChange={(e) => handleCityChange(idx, e.target.value)} />
                        {formData.cities.length > 1 && <button type="button" onClick={() => removeCity(idx)} className="text-red-400 p-2 mt-1"><Trash2 size={14} /></button>}
                      </div>
                      <ImageUploadWidget label="City Photo" value={city.image} onChange={(url) => handleCityImageChange(idx, url)} />
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addCity} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"><Plus size={12} /> Add City</button>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.06]">
                <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl bg-white/[0.04] text-white/60 text-sm font-bold hover:bg-white/[0.06] transition-all">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-primary/20 transition-all"><Save size={16} /> {editingId ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {destinations.map((d) => (
          <div key={d._id} className="bg-card p-5 rounded-2xl border border-white/[0.06]">
            <div className="flex justify-between items-start mb-3">
              <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${d.type === 'domestic' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'}`}>{d.type}</span>
              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 hover:!opacity-100 transition-opacity" onMouseEnter={(e) => e.currentTarget.parentElement.classList.add('opacity-100')} onMouseLeave={(e) => e.currentTarget.parentElement.classList.remove('opacity-100')}>
                <button onClick={() => handleEdit(d)} className="p-1.5 rounded-lg bg-white/[0.04] text-white/60 hover:text-primary hover:bg-primary/10 transition-all"><Edit size={14} /></button>
                <button onClick={() => handleDelete(d._id)} className="p-1.5 rounded-lg bg-white/[0.04] text-white/60 hover:text-red-400 hover:bg-red-400/10 transition-all"><Trash2 size={14} /></button>
              </div>
            </div>
            <h3 className="font-bold text-lg text-white mb-3">{d.region}</h3>
            <div className="space-y-2">
              {d.cities.map((c, i) => {
                const cityName = typeof c === 'object' ? c.name : c;
                const cityImage = typeof c === 'object' ? c.image : '';
                return (
                  <div key={i} className="flex items-center gap-2 bg-white/[0.04] px-3 py-2 rounded-lg border border-white/[0.04]">
                    {cityImage && <img src={cityImage} alt={cityName} className="w-8 h-8 rounded-lg object-cover shrink-0" />}
                    <span className="text-xs text-white/70">{cityName}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DestinationManagement;
