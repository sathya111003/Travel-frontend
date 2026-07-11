import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Trash2, Calendar, Image as ImageIcon, Utensils, Car, Hotel, 
  Star, Info, IndianRupee, ListChecks, ShieldX
} from 'lucide-react';
import { createPackage, updatePackage } from '../../../api/api';
import ImageUploadWidget from '../ImageUploadWidget';

const InputField = ({ label, children }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{label}</label>
    {children}
  </div>
);

const PackageForm = ({ onClose, onSuccess, initialData }) => {
  const [formData, setFormData] = useState({
    title: '', description: '', tourOverview: '', price: '', duration: '',
    category: 'honeymoon', type: 'domestic',
    location: { city: '', country: '', lat: '', lng: '' },
    images: [''], highlights: [''], exclusions: [''],
    rates: [{ pax: '', price: '' }],
    hotel: { name: '', rating: 5, image: '', description: '', amenities: [''] },
    itinerary: [{
      day: 1, title: '',
      activities: [{ time: '09:00 AM', description: '' }],
      places: [''],
      food: { breakfast: { name: 'Hotel Buffet', included: true }, lunch: { name: 'Local Restaurant', included: true }, dinner: { name: 'Hotel Dining', included: true } },
      travel: 'Private Car'
    }]
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        highlights: initialData.highlights || [''], exclusions: initialData.exclusions || [''],
        images: initialData.images || [''], rates: initialData.rates || [{ pax: '', price: '' }],
        location: initialData.location || { city: '', country: '', lat: '', lng: '' },
        hotel: initialData.hotel || { name: '', rating: 5, image: '', description: '', amenities: [''] },
        itinerary: initialData.itinerary || [{ day: 1, title: '', activities: [{ time: '09:00 AM', description: '' }], places: [''], food: { breakfast: { name: 'Hotel Buffet', included: true }, lunch: { name: 'Local Restaurant', included: true }, dinner: { name: 'Hotel Dining', included: true } }, travel: 'Private Car' }]
      });
    }
  }, [initialData]);

  const handleItineraryChange = (dayIdx, field, value, activityIdx = null) => {
    const n = [...formData.itinerary];
    if (activityIdx !== null) n[dayIdx].activities[activityIdx][field] = value;
    else if (field.includes('food.')) { const [, mt, sf] = field.split('.'); n[dayIdx].food[mt][sf] = value; }
    else n[dayIdx][field] = value;
    setFormData({ ...formData, itinerary: n });
  };

  const addActivity = (d) => { const n = [...formData.itinerary]; n[d].activities.push({ time: '', description: '' }); setFormData({ ...formData, itinerary: n }); };
  const removeActivity = (d, a) => { const n = [...formData.itinerary]; n[d].activities = n[d].activities.filter((_, i) => i !== a); setFormData({ ...formData, itinerary: n }); };
  
  const addDay = () => { setFormData({ ...formData, itinerary: [...formData.itinerary, { day: formData.itinerary.length + 1, title: '', activities: [{ time: '09:00 AM', description: '' }], places: [''], food: { breakfast: { name: 'Hotel Buffet', included: true }, lunch: { name: 'Local Restaurant', included: true }, dinner: { name: 'Hotel Dining', included: true } }, travel: 'Private Car' }] }); };
  const removeDay = (i) => { setFormData({ ...formData, itinerary: formData.itinerary.filter((_, idx) => idx !== i).map((d, idx) => ({ ...d, day: idx + 1 })) }); };

  const handleArrayChange = (field, index, value, subField = null) => {
    if (subField) { const o = { ...formData[field] }; o[subField][index] = value; setFormData({ ...formData, [field]: o }); }
    else { const a = [...formData[field]]; a[index] = value; setFormData({ ...formData, [field]: a }); }
  };
  const addArrayField = (field, subField = null) => {
    if (subField) { const o = { ...formData[field] }; o[subField].push(''); setFormData({ ...formData, [field]: o }); }
    else setFormData({ ...formData, [field]: [...formData[field], ''] });
  };
  const removeArrayField = (field, index, subField = null) => {
    if (subField) { const o = { ...formData[field] }; o[subField] = o[subField].filter((_, i) => i !== index); setFormData({ ...formData, [field]: o }); }
    else setFormData({ ...formData, [field]: formData[field].filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const c = { ...formData };
      c.price = c.price ? Number(c.price) : 0;
      if (c.location) { if (c.location.lat === '') delete c.location.lat; else if (c.location.lat) c.location.lat = Number(c.location.lat); if (c.location.lng === '') delete c.location.lng; else if (c.location.lng) c.location.lng = Number(c.location.lng); }
      if (c.hotel && c.hotel.rating === '') c.hotel.rating = 5; else if (c.hotel) c.hotel.rating = Number(c.hotel.rating);
      c.rates = c.rates.map(r => ({ ...r, price: r.price === '' ? 0 : Number(r.price) }));
      c.highlights = c.highlights.filter(h => h.trim() !== '');
      c.exclusions = c.exclusions.filter(e => e.trim() !== '');
      c.images = c.images.filter(i => i.trim() !== '');
      if (c.itinerary?.length > 0) c.itinerary = c.itinerary.map(d => ({ ...d, title: d.title.trim() === '' ? `Day ${d.day} Activities` : d.title }));

      if (initialData?._id) await updatePackage(initialData._id, c);
      else await createPackage(c);
      onSuccess();
      onClose();
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message || 'Unknown Error'}`);
    }
  };

  const inputCls = "w-full bg-background border border-white/[0.06] p-3 rounded-xl text-sm text-white outline-none focus:border-primary/40 transition-colors placeholder:text-white/20";
  const selectCls = "w-full bg-background border border-white/[0.06] p-3 rounded-xl text-sm text-white outline-none appearance-none cursor-pointer";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <motion.div initial={{ scale: 0.95, y: 30 }} animate={{ scale: 1, y: 0 }} className="bg-card max-w-5xl w-full p-6 md:p-10 rounded-2xl relative my-auto shadow-2xl border border-white/[0.06]">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/[0.06]">
          <div>
            <h2 className="text-xl font-black text-white">{initialData ? 'Update Package' : 'New Package'}</h2>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1">Package Builder</p>
          </div>
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-red-400/10 text-red-400 text-sm font-bold hover:bg-red-400/20 transition-all">Close</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10 pb-8">
          <section className="space-y-5">
            <h3 className="text-sm font-bold text-white/60 flex items-center gap-2"><Info size={16} className="text-primary" /> Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Package Title"><input required className={inputCls} value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></InputField>
              <InputField label="Price per person (₹)"><input required type="number" className={inputCls} value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} /></InputField>
              <InputField label="Duration"><input required className={inputCls} value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="e.g. 3D / 2N" /></InputField>
              <div className="grid grid-cols-2 gap-3">
                <InputField label="Category">
                  <select className={selectCls} value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                    <option value="honeymoon">Honeymoon</option><option value="family">Family</option><option value="adventure">Adventure</option><option value="international">International</option>
                  </select>
                </InputField>
                <InputField label="Type">
                  <select className={selectCls} value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                    <option value="domestic">Domestic</option><option value="international">International</option>
                  </select>
                </InputField>
              </div>
            </div>
            <InputField label="Description"><textarea required className={`${inputCls} h-20 resize-none`} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></InputField>
            <InputField label="Tour Overview"><textarea className={`${inputCls} h-24 resize-none`} value={formData.tourOverview} onChange={(e) => setFormData({ ...formData, tourOverview: e.target.value })} /></InputField>
            <InputField label="Gallery Images">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {formData.images.map((img, idx) => (
                  <ImageUploadWidget key={idx} label={`Image ${idx + 1}`} value={img} onChange={(val) => handleArrayChange('images', idx, val)} onRemove={() => removeArrayField('images', idx)} placeholder="Upload image or enter URL..." />
                ))}
              </div>
              <button type="button" onClick={() => addArrayField('images')} className="text-xs font-bold text-primary flex items-center gap-1 mt-2 hover:underline"><Plus size={12} /> Add Image</button>
            </InputField>
          </section>

          <section className="space-y-5">
            <h3 className="text-sm font-bold text-white/60 flex items-center gap-2"><IndianRupee size={16} className="text-primary" /> Group Rates & Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="City"><input required className={inputCls} value={formData.location.city} onChange={(e) => setFormData({ ...formData, location: { ...formData.location, city: e.target.value } })} /></InputField>
              <InputField label="Country"><input required className={inputCls} value={formData.location.country} onChange={(e) => setFormData({ ...formData, location: { ...formData.location, country: e.target.value } })} /></InputField>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Group Rates</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {formData.rates.map((rate, idx) => (
                  <div key={idx} className="flex gap-2 bg-white/[0.02] p-3 rounded-xl border border-white/[0.06]">
                    <input className="w-20 bg-background border border-white/[0.06] p-2 rounded-lg text-xs text-white outline-none" placeholder="12 Pax" value={rate.pax} onChange={(e) => { const r = [...formData.rates]; r[idx].pax = e.target.value; setFormData({ ...formData, rates: r }); }} />
                    <input type="number" className="flex-1 bg-background border border-white/[0.06] p-2 rounded-lg text-xs text-white outline-none" placeholder="Price" value={rate.price} onChange={(e) => { const r = [...formData.rates]; r[idx].price = e.target.value; setFormData({ ...formData, rates: r }); }} />
                    <button type="button" onClick={() => setFormData({ ...formData, rates: formData.rates.filter((_, i) => i !== idx) })} className="text-red-400 p-1"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => setFormData({ ...formData, rates: [...formData.rates, { pax: '', price: '' }] })} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"><Plus size={12} /> Add Rate</button>
            </div>
          </section>

          <section className="space-y-5 bg-primary/[0.03] p-6 rounded-2xl border border-white/[0.06]">
            <h3 className="text-sm font-bold text-white/60 flex items-center gap-2"><Hotel size={16} className="text-primary" /> Accommodation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Hotel Name"><input className={inputCls} value={formData.hotel.name} onChange={(e) => setFormData({ ...formData, hotel: { ...formData.hotel, name: e.target.value } })} /></InputField>
              <InputField label="Rating (1-5)"><input type="number" max="5" className={inputCls} value={formData.hotel.rating} onChange={(e) => setFormData({ ...formData, hotel: { ...formData.hotel, rating: e.target.value } })} /></InputField>
            </div>
            <ImageUploadWidget label="Hotel Image" value={formData.hotel.image} onChange={(val) => setFormData({ ...formData, hotel: { ...formData.hotel, image: val } })} placeholder="Upload hotel image..." />
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Amenities</label>
              {formData.hotel.amenities.map((amenity, idx) => (
                <div key={idx} className="flex gap-2">
                  <input className={`${inputCls} flex-1`} placeholder="e.g. Swimming Pool" value={amenity} onChange={(e) => handleArrayChange('hotel', idx, e.target.value, 'amenities')} />
                  <button type="button" onClick={() => removeArrayField('hotel', idx, 'amenities')} className="text-red-400 p-2"><Trash2 size={14} /></button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayField('hotel', 'amenities')} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"><Plus size={12} /> Add Amenity</button>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white/60 flex items-center gap-2"><ListChecks size={16} className="text-emerald-400" /> Inclusions</h3>
              {formData.highlights.map((h, idx) => (
                <div key={idx} className="flex gap-2">
                  <input className={`${inputCls} flex-1`} placeholder="e.g. 2 Breakfasts" value={h} onChange={(e) => handleArrayChange('highlights', idx, e.target.value)} />
                  <button type="button" onClick={() => removeArrayField('highlights', idx)} className="text-red-400 p-2"><Trash2 size={14} /></button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayField('highlights')} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"><Plus size={12} /> Add Inclusion</button>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white/60 flex items-center gap-2"><ShieldX size={16} className="text-red-400" /> Exclusions</h3>
              {formData.exclusions.map((e, idx) => (
                <div key={idx} className="flex gap-2">
                  <input className={`${inputCls} flex-1`} placeholder="e.g. Train Tickets" value={e} onChange={(e) => handleArrayChange('exclusions', idx, e.target.value)} />
                  <button type="button" onClick={() => removeArrayField('exclusions', idx)} className="text-red-400 p-2"><Trash2 size={14} /></button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayField('exclusions')} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"><Plus size={12} /> Add Exclusion</button>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-sm font-bold text-white/60 flex items-center gap-2"><Calendar size={16} className="text-primary" /> Daily Itinerary</h3>
            <div className="space-y-8">
              {formData.itinerary.map((day, dIdx) => (
                <div key={dIdx} className="bg-white/[0.02] p-6 rounded-2xl border border-white/[0.06] space-y-5">
                  <div className="flex justify-between items-center">
                    <span className="bg-primary text-white px-4 py-1.5 rounded-full font-bold text-xs">DAY {day.day}</span>
                    <button type="button" onClick={() => removeDay(dIdx)} className="text-red-400 hover:text-red-400/80"><Trash2 size={18} /></button>
                  </div>
                  <input required className={`${inputCls} text-lg font-bold`} placeholder="Day theme..." value={day.title} onChange={(e) => handleItineraryChange(dIdx, 'title', e.target.value)} />
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Activities</p>
                    {day.activities.map((act, aIdx) => (
                      <div key={aIdx} className="flex gap-3">
                        <input className="w-28 bg-background border border-white/[0.06] p-2 rounded-lg text-xs text-white outline-none" placeholder="9:00 AM" value={act.time} onChange={(e) => handleItineraryChange(dIdx, 'time', e.target.value, aIdx)} />
                        <input className={`${inputCls} flex-1`} placeholder="Activity description..." value={act.description} onChange={(e) => handleItineraryChange(dIdx, 'description', e.target.value, aIdx)} />
                        <button type="button" onClick={() => removeActivity(dIdx, aIdx)} className="text-red-400 p-2"><Trash2 size={14} /></button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addActivity(dIdx)} className="text-xs font-bold text-accent flex items-center gap-1 hover:underline"><Plus size={12} /> Add Activity</button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {['breakfast', 'lunch', 'dinner'].map((m) => (
                      <div key={m} className="space-y-1.5">
                        <label className="text-[10px] font-bold text-white/60 uppercase">{m}</label>
                        <input className="w-full bg-background border border-white/[0.06] p-2 rounded-lg text-xs text-white outline-none" value={day.food?.[m]?.name || ''} onChange={(e) => handleItineraryChange(dIdx, `food.${m}.name`, e.target.value)} />
                        <label className="flex items-center gap-2 text-[10px] text-white/70 cursor-pointer">
                          <input type="checkbox" checked={day.food?.[m]?.included || false} onChange={(e) => handleItineraryChange(dIdx, `food.${m}.included`, e.target.checked)} className="accent-primary" />
                          Included
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button type="button" onClick={addDay} className="w-full py-5 rounded-2xl border-2 border-dashed border-white/[0.06] text-white/60 text-sm font-bold hover:border-primary/30 hover:text-primary transition-all flex items-center justify-center gap-2">
                <Plus size={18} /> Add Day
              </button>
            </div>
          </section>

          <div className="pt-4 flex justify-end gap-3 border-t border-white/[0.06]">
            <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl bg-white/[0.04] text-white/60 text-sm font-bold hover:bg-white/[0.06] transition-all">Cancel</button>
            <button type="submit" className="px-8 py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all">
              {initialData ? 'Update Package' : 'Create Package'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default PackageForm;
