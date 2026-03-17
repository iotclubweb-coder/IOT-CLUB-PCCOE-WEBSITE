import { useState } from 'react';
import { Plus, Trash2, Edit2, MapPin, Upload } from 'lucide-react';
import { useData } from '../../context/DataContext';
import type { Event } from '../../lib/siteData';
import { getCloudinaryUrl, deleteCloudinaryImage } from '../../lib/cloudinary';
import toast from 'react-hot-toast';

export default function EventsManager() {
  const { data, updateEvents } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Event>>({});

  const handleEdit = (event: Event) => {
    setEditingId(event.id);
    setEditForm(event);
  };

  const handleSave = () => {
    if (!editingId) return;
    const updatedEvents = data.events.map(e => e.id === editingId ? { ...e, ...editForm } as Event : e);
    updateEvents(updatedEvents);
    setEditingId(null);
  };

  const handleDelete = async (event: Event) => {
    if (window.confirm('Are you sure you want to permanently delete this signal and its poster?')) {
      const deletePromise = async () => {
        // Only try to delete from cloudinary if it's a real public_id
        if (event.image && !event.image.startsWith('http') && !event.image.includes('/')) {
           const success = await deleteCloudinaryImage(event.image);
           if (!success) {
               console.warn('Could not delete image from Cloudinary.');
           }
        }
        updateEvents(data.events.filter(e => e.id !== event.id));
      };

      toast.promise(deletePromise(), {
        loading: 'Deleting signal...',
        success: 'Signal deleted successfully!',
        error: 'Failed to delete signal.'
      });
    }
  };

  const handleAdd = () => {
    const newEvent: Event = {
      id: Date.now().toString(),
      title: 'New Signal',
      date: new Date().toLocaleDateString(),
      time: '09:00 AM - 05:00 PM',
      location: 'Main Lab',
      type: 'signal',
      desc: 'Brief description of the event.',
      category: 'WORKSHOP',
      status: 'upcoming',
      regUrl: ''
    };
    updateEvents([...data.events, newEvent]);
    handleEdit(newEvent);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, eventId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', data.settings?.cloudinaryPreset || 'ml_default');

    const uploadPromise = fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    }).then(async (res) => {
      const resData = await res.json();
      if (!res.ok || !resData.secure_url) {
        throw new Error(resData.error?.message || 'Upload failed');
      }
      return resData;
    });

    toast.promise(uploadPromise, {
      loading: 'Uploading poster...',
      success: (resData) => {
        const updatedEvents = data.events.map(ev => 
          ev.id === eventId ? { ...ev, image: resData.public_id } : ev
        );
        updateEvents(updatedEvents);
        if (editingId === eventId) {
            setEditForm(prev => ({ ...prev, image: resData.public_id }));
        }
        return 'Poster uploaded successfully!';
      },
      error: (err) => `Upload failed: ${err.message}`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 bg-primary px-6 py-3 rounded-2xl font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-primary/20"
        >
          <Plus size={18} />
          Pulse New Signal
        </button>
      </div>

      <div className="grid gap-4">
        {data.events.map((event) => (
          <div key={event.id} className="bg-white/5 border border-white/5 p-6 rounded-[2rem] hover:bg-white/10 transition-all group">
            {editingId === event.id ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="aspect-video bg-white/5 rounded-2xl overflow-hidden relative group/img">
                        <img 
                            src={editForm.image?.startsWith('http') ? editForm.image : getCloudinaryUrl(editForm.image || '', { width: 600, crop: 'fit' })} 
                            className="w-full h-full object-cover"
                            alt="Event Poster"
                        />
                        <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                            <div className="flex flex-col items-center gap-2">
                                <Upload size={24} className="text-white" />
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Update Poster</span>
                            </div>
                            <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, editingId!)} accept="image/*" />
                        </label>
                    </div>
                    <Input label="Title" value={editForm.title} onChange={v => setEditForm({...editForm, title: v})} />
                    <Input label="Date" value={editForm.date} onChange={v => setEditForm({...editForm, date: v})} />
                    <Input label="Time" value={editForm.time} onChange={v => setEditForm({...editForm, time: v})} />
                    <Input label="Location" value={editForm.location} onChange={v => setEditForm({...editForm, location: v})} />
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="Type" value={editForm.type} onChange={v => setEditForm({...editForm, type: v})} />
                      <div>
                        <label className="block text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2 ml-1">Status</label>
                        <select 
                          value={editForm.status || 'upcoming'} 
                          onChange={e => setEditForm({...editForm, status: e.target.value as any})}
                          className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold text-sm focus:border-primary outline-none transition-all"
                        >
                          <option value="upcoming">Upcoming</option>
                          <option value="registering">Registering</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                    </div>
                    <Input label="Category" value={editForm.category} onChange={v => setEditForm({...editForm, category: v})} />
                    <Input label="Registration URL" value={editForm.regUrl} onChange={v => setEditForm({...editForm, regUrl: v})} />
                    <div>
                      <label className="block text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2 ml-1">Description</label>
                      <textarea 
                        value={editForm.desc} 
                        onChange={e => setEditForm({...editForm, desc: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold text-sm focus:border-primary outline-none transition-all resize-none h-32"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setEditingId(null)} className="px-6 py-3 rounded-xl font-bold text-sm text-white/40 hover:text-white transition-all">Cancel</button>
                  <button onClick={handleSave} className="bg-white text-black px-8 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-all">Save Signal</button>
                </div>
              </div>
            ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest leading-none border border-primary/20">
                        {event.type}
                      </span>
                      <span className="text-white/40 text-xs font-mono">{event.date}</span>
                    </div>
                    <h3 className="text-2xl font-black lowercase tracking-tighter mb-2 group-hover:text-primary transition-colors truncate">{event.title}</h3>
                    <div className="flex items-center gap-4 text-xs font-bold text-white/20 uppercase tracking-widest">
                      <div className="flex items-center gap-1"><MapPin size={12} /> {event.location}</div>
                    </div>
                  </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(event)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-all"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(event)} className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-all shadow-lg"><Trash2 size={16} /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string, value?: string, onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2 ml-1">{label}</label>
      <input 
        type="text" 
        value={value || ''} 
        onChange={e => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold text-sm focus:border-primary outline-none transition-all"
      />
    </div>
  );
}
