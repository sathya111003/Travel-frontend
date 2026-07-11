import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Trash2, Clock, Type, FileText, Video, Music, Upload, X, Play, Edit2 } from 'lucide-react';
import { fetchRecentTours, createRecentTour, updateRecentTour, deleteRecentTour, uploadVideo, uploadAudio, fetchPackages, fixMediaUrl } from '../../../api/api';
import ImageUploadWidget from '../ImageUploadWidget';

const MediaUploadWidget = ({ label, value, onChange, accept, icon: Icon, color, uploadFn, placeholder }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const maxSize = accept === 'video/*' ? 250 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) { setError(`Max ${accept === 'video/*' ? '250MB' : '10MB'}`); return; }
    const data = new FormData();
    data.append(accept === 'video/*' ? 'video' : 'audio', file);
    setFileName(file.name);
    setUploading(true);
    setError('');
    try { const r = await uploadFn(data); onChange(r.data.url); }
    catch (err) { console.error('Upload failed details:', err); setError(err.response?.data?.message || err.message || 'Upload failed'); setFileName(''); }
    finally { setUploading(false); }
  };

  return (
    <div className="space-y-1.5 w-full">
      <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest flex items-center gap-1.5">
        <Icon size={10} className={color} /> {label}
      </label>
      <div className="flex items-center gap-3 bg-white/[0.02] p-3 rounded-xl border border-white/[0.06]">
        {value ? (
          <div className="flex-1 flex items-center gap-2 bg-emerald-400/10 px-3 py-2.5 rounded-lg border border-emerald-400/20">
            <Play size={12} className="text-emerald-400" />
            <span className="text-xs text-emerald-400 truncate flex-1">{fileName || 'Uploaded'}</span>
            <button type="button" onClick={() => { onChange(''); setFileName(''); }} className="text-red-400 p-1"><X size={12} /></button>
          </div>
        ) : (
          <>
            <span className="text-xs text-white/50 flex-1 truncate">{placeholder}</span>
            <label className="cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary px-3 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all">
              {uploading ? <span className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" /> : <><Upload size={12} /> Upload</>}
              <input type="file" accept={accept} className="hidden" onChange={handleFileChange} disabled={uploading} />
            </label>
          </>
        )}
      </div>
      {value && accept === 'video/*' && (
        <div className="mt-2 rounded-xl overflow-hidden border border-white/[0.06] bg-black max-w-xs">
          <video src={value} controls className="w-full h-auto max-h-36 object-contain" onError={(e) => { e.target.poster = ''; }} />
        </div>
      )}
      {value && accept === 'audio/*' && (
        <div className="mt-2">
          <audio src={value} controls className="w-full max-w-xs scale-90 origin-left" />
        </div>
      )}
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
};

const RecentTourManagement = () => {
  const [tours, setTours] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    packageId: '',
    image: '',
    images: [''],
    days: '',
    description: '',
    videoUrl: '',
    videoUrls: [''],
    audioUrl: '',
    audioUrls: ['']
  });

  const getTours = async () => { try { const { data } = await fetchRecentTours(); setTours(data); } catch (e) { console.error(e); } setLoading(false); };
  const getPackages = async () => { try { const { data } = await fetchPackages(); setPackages(data); } catch (e) { console.error(e); } };
  useEffect(() => { getTours(); getPackages(); }, []);

  const handleEditClick = (tour) => {
    setEditId(tour._id);
    setFormData({
      title: tour.title,
      packageId: tour.packageId || '',
      image: tour.image || '',
      images: tour.images && tour.images.length > 0 ? tour.images : [tour.image || ''],
      days: tour.days,
      description: tour.description,
      videoUrl: tour.videoUrl || '',
      videoUrls: tour.videoUrls && tour.videoUrls.length > 0 ? tour.videoUrls : (tour.videoUrl ? [tour.videoUrl] : ['']),
      audioUrl: tour.audioUrl || '',
      audioUrls: tour.audioUrls && tour.audioUrls.length > 0 ? tour.audioUrls : (tour.audioUrl ? [tour.audioUrl] : [''])
    });
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      packageId: '',
      image: '',
      images: [''],
      days: '',
      description: '',
      videoUrl: '',
      videoUrls: [''],
      audioUrl: '',
      audioUrls: ['']
    });
    setEditId(null);
    setShowAddForm(false);
  };

  const handleArrayChange = (field, index, value) => {
    const a = [...formData[field]];
    a[index] = value;
    setFormData({ ...formData, [field]: a });
  };

  const addArrayField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayField = (field, index) => {
    if (formData[field].length > 1) {
      setFormData({ ...formData, [field]: formData[field].filter((_, i) => i !== index) });
    } else {
      const a = [...formData[field]];
      a[0] = '';
      setFormData({ ...formData, [field]: a });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cleanedImages = formData.images.filter(img => img.trim() !== '');
      const cleanedVideos = formData.videoUrls.filter(vid => vid.trim() !== '');
      const cleanedAudios = formData.audioUrls.filter(aud => aud.trim() !== '');

      if (cleanedImages.length === 0) {
        alert('Please upload or enter at least one tour image.');
        return;
      }

      const submitData = {
        ...formData,
        images: cleanedImages,
        image: cleanedImages[0] || '',
        videoUrls: cleanedVideos,
        videoUrl: cleanedVideos[0] || '',
        audioUrls: cleanedAudios,
        audioUrl: cleanedAudios[0] || ''
      };

      if (editId) {
        await updateRecentTour(editId, submitData);
      } else {
        await createRecentTour(submitData);
      }
      handleCancel();
      getTours();
    }
    catch (err) {
      console.error(err);
      alert(editId ? 'Failed to update tour' : 'Failed to add tour');
    }
  };

  const handleDelete = async (id) => { if (window.confirm('Delete this tour memory?')) { try { await deleteRecentTour(id); getTours(); } catch { alert('Failed'); } } };

  const inputCls = "w-full bg-background border border-white/[0.06] p-3 rounded-xl text-sm text-white outline-none focus:border-primary/40 transition-colors placeholder:text-white/50";

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Recent Tours</h1>
          <p className="text-white/70 text-sm mt-1">Manage the homepage tour memories section.</p>
        </div>
        <button onClick={() => setShowAddForm(true)} className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all">
          <Plus size={18} /> Add Memory
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-card p-6 rounded-2xl border border-white/[0.06]">
            <h3 className="text-lg font-bold text-white mb-4">{editId ? 'Edit Tour Memory' : 'Add Tour Memory'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Title</label>
                  <input required className={inputCls} placeholder="e.g. Ooty Trip" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Package</label>
                  <select className={inputCls} value={formData.packageId} onChange={(e) => setFormData({...formData, packageId: e.target.value})}>
                    <option value="">Select package...</option>
                    {packages.map((p) => (
                      <option key={p._id} value={p._id}>{p.title}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Duration</label>
                  <input required className={inputCls} placeholder="e.g. 3 Days" value={formData.days} onChange={(e) => setFormData({...formData, days: e.target.value})} />
                </div>
              </div>
              <div className="space-y-3 bg-white/[0.01] p-4 rounded-xl border border-white/[0.03]">
                <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest block">Tour Images (Multiple)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {formData.images.map((img, idx) => (
                    <ImageUploadWidget key={idx} label={`Image ${idx + 1}`} value={img} onChange={(val) => handleArrayChange('images', idx, val)} onRemove={() => removeArrayField('images', idx)} placeholder="Upload or enter URL..." />
                  ))}
                </div>
                <button type="button" onClick={() => addArrayField('images')} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline mt-1.5"><Plus size={12} /> Add Image</button>
              </div>

              <div className="space-y-3 bg-white/[0.01] p-4 rounded-xl border border-white/[0.03]">
                <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest block">Tour Videos (Multiple)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {formData.videoUrls.map((vid, idx) => (
                    <div key={idx} className="relative group">
                      <MediaUploadWidget label={`Video ${idx + 1}`} value={vid} onChange={(val) => handleArrayChange('videoUrls', idx, val)} accept="video/*" icon={Video} color="text-blue-400" uploadFn={uploadVideo} placeholder="MP4, WebM..." />
                      {formData.videoUrls.length > 1 && (
                        <button type="button" onClick={() => removeArrayField('videoUrls', idx)} className="absolute top-0 right-0 text-red-400 p-1 text-xs hover:underline bg-red-400/10 rounded">Remove Video</button>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => addArrayField('videoUrls')} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline mt-1.5"><Plus size={12} /> Add Video</button>
              </div>

              <div className="space-y-3 bg-white/[0.01] p-4 rounded-xl border border-white/[0.03]">
                <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest block">Tour Audio (Multiple)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {formData.audioUrls.map((aud, idx) => (
                    <div key={idx} className="relative group">
                      <MediaUploadWidget label={`Audio ${idx + 1}`} value={aud} onChange={(val) => handleArrayChange('audioUrls', idx, val)} accept="audio/*" icon={Music} color="text-accent" uploadFn={uploadAudio} placeholder="MP3, WAV..." />
                      {formData.audioUrls.length > 1 && (
                        <button type="button" onClick={() => removeArrayField('audioUrls', idx)} className="absolute top-0 right-0 text-red-400 p-1 text-xs hover:underline bg-red-400/10 rounded">Remove Audio</button>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => addArrayField('audioUrls')} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline mt-1.5"><Plus size={12} /> Add Audio</button>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Description</label>
                <textarea required className={`${inputCls} h-24 resize-none`} placeholder="Tour experience..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={handleCancel} className="px-5 py-2.5 rounded-xl bg-white/[0.04] text-white/60 text-sm font-bold hover:bg-white/[0.06] transition-all">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">{editId ? 'Save Changes' : 'Save'}</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tours.map((t) => (
            <div key={t._id} className="bg-card p-5 rounded-2xl border border-white/[0.06] flex gap-4">
              <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-white/[0.06]">
                <img src={fixMediaUrl(t.image)} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-bold text-sm text-white truncate">{t.title}</h4>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => handleEditClick(t)} className="text-white/50 hover:text-primary transition-colors"><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(t._id)} className="text-white/50 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
                <p className="text-[10px] font-bold text-primary uppercase mt-0.5">{t.days}</p>
                <p className="text-xs text-white/70 mt-1.5 line-clamp-2">{t.description}</p>
                <div className="flex gap-1.5 mt-2">
                  {((t.videoUrls && t.videoUrls.length > 0) || t.videoUrl) && <span className="inline-flex items-center gap-1 text-[9px] font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full"><Video size={8} /> {t.videoUrls?.length > 1 ? `${t.videoUrls.length} Videos` : 'Video'}</span>}
                  {((t.audioUrls && t.audioUrls.length > 0) || t.audioUrl) && <span className="inline-flex items-center gap-1 text-[9px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full"><Music size={8} /> {t.audioUrls?.length > 1 ? `${t.audioUrls.length} Audios` : 'Audio'}</span>}
                </div>
              </div>
            </div>
          ))}
          {tours.length === 0 && <div className="col-span-full bg-card p-16 rounded-2xl text-center text-white/50 text-sm">No tour memories yet</div>}
        </div>
      )}
    </div>
  );
};

export default RecentTourManagement;
