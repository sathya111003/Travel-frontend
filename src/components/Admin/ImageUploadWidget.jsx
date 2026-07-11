import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Trash2, AlertCircle } from 'lucide-react';
import { uploadImage } from '../../api/api';

const ImageUploadWidget = ({ label, value, onChange, placeholder = "https://images.unsplash.com/...", onRemove }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('Max 5MB'); return; }
    const data = new FormData();
    data.append('image', file);
    setUploading(true); setError('');
    try { const r = await uploadImage(data); onChange(r.data.url); }
    catch (err) { console.error('Image upload failed details:', err); setError(err.response?.data?.message || err.message || 'Upload failed'); }
    finally { setUploading(false); }
  };

  return (
    <div className="space-y-1.5 w-full">
      {label && <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest block">{label}</label>}
      <div className="flex items-center gap-3 bg-white/[0.02] p-3 rounded-xl border border-white/[0.06] hover:border-white/[0.1] transition-all">
        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/[0.06] bg-background flex items-center justify-center">
          {value ? (
            <img src={value} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=200&auto=format&fit=crop'; }} />
          ) : (
            <ImageIcon className="text-white/30 w-6 h-6" />
          )}
        </div>
        <div className="flex-1 flex items-center gap-2">
          <input className="flex-1 bg-background border border-white/[0.06] px-3 py-2.5 rounded-lg text-xs text-white outline-none focus:border-primary/40 transition-colors placeholder:text-white/35" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
          <label className="cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary p-2.5 rounded-lg border border-primary/20 flex items-center justify-center shrink-0 transition-all">
            {uploading ? <span className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" /> : <Upload size={14} />}
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
          </label>
          {onRemove && (
            <button type="button" onClick={onRemove} className="text-red-400/50 p-2.5 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><Trash2 size={14} /></button>
          )}
        </div>
      </div>
      {error && <div className="flex items-center gap-1.5 text-red-400 text-xs"><AlertCircle size={10} /> {error}</div>}
    </div>
  );
};

export default ImageUploadWidget;
