import { useState } from 'react';
import { Plus, Trash2, Edit2, Tag } from 'lucide-react';
import { useData } from '../../context/DataContext';
import type { GalleryItem } from '../../lib/siteData';
import { getCloudinaryUrl, deleteCloudinaryImage } from '../../lib/cloudinary';
import toast from 'react-hot-toast';

export default function GalleryManager() {
  const { data, updateGallery } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<GalleryItem>>({});

  const handleEdit = (item: GalleryItem) => {
    console.log('Editing item:', item);
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const handleSave = () => {
    if (!editingId) return;
    const updatedGallery = data.gallery.map(i => i.id === editingId ? { ...i, ...editForm } as GalleryItem : i);
    updateGallery(updatedGallery);
    setEditingId(null);
  };

  const handleDelete = async (item: GalleryItem) => {
    if (window.confirm('Are you sure you want to permanently delete this visual log and its image?')) {
      const deletePromise = async () => {
        // Only try to delete from cloudinary if it's a real public_id, not a raw URL or local path
        if (item.image && !item.image.startsWith('http') && !item.image.includes('/')) {
           const success = await deleteCloudinaryImage(item.image);
           if (!success) {
               console.warn('Could not delete image from Cloudinary. It may have already been deleted.');
           }
        }
        updateGallery(data.gallery.filter(i => i.id !== item.id));
      };

      toast.promise(deletePromise(), {
        loading: 'Deleting visual log...',
        success: 'Visual log deleted successfully!',
        error: 'Failed to delete visual log.'
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, itemId?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const targetId = itemId || editingId;
    if (!targetId) {
      toast.error('No item selected for upload');
      return;
    }

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
      loading: 'Uploading image...',
      success: (resData) => {
        // Find the latest item data to preserve other field changes (like caption)
        const updatedGallery = data.gallery.map(i => 
          i.id === targetId ? { ...i, image: resData.public_id } : i
        );
        updateGallery(updatedGallery);
        
        // Also update editForm if we're currently editing this item
        if (editingId === targetId) {
          setEditForm(prev => ({ ...prev, image: resData.public_id }));
        }
        
        return 'Image uploaded successfully!';
      },
      error: (err) => `Upload failed: ${err.message}`
    });
  };

  const handleAdd = () => {
    const newId = Date.now().toString();
    const newItem: GalleryItem = {
      id: newId,
      image: 'iot-club/assets/hero',
      caption: 'New visual capture',
      category: 'general'
    };
    const currentGallery = [...data.gallery, newItem];
    updateGallery(currentGallery);
    
    setTimeout(() => {
        handleEdit(newItem);
    }, 50);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 bg-primary px-6 py-3 rounded-2xl font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-primary/20"
        >
          <Plus size={18} />
          Capture Visual Log
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.gallery.map((item) => (
          <div key={item.id} className="bg-white/5 border border-white/5 flex flex-col rounded-[2rem] overflow-hidden group hover:border-white/10 transition-all">
            <div className="aspect-[4/5] bg-secondary relative group/img overflow-hidden">
                <img 
                    src={item.image?.startsWith('http') ? item.image : getCloudinaryUrl(item.image, { width: 400, crop: 'fill' })} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                    <div className="flex gap-2">
                        <button onClick={() => handleEdit(item)} className="p-3 bg-white text-black rounded-full hover:scale-110 transition-all"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(item)} className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-all"><Trash2 size={16} /></button>
                    </div>
                    <label className="bg-primary/20 hover:bg-primary/40 border border-primary/40 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-primary cursor-pointer transition-all">
                        Change Image
                        <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, item.id)} accept="image/*" />
                    </label>
                </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
                {editingId === item.id ? (
                  <div className="space-y-4">
                    <Input label="Caption" value={editForm.caption} onChange={v => setEditForm({...editForm, caption: v})} />
                    <Input label="Category" value={editForm.category} onChange={v => setEditForm({...editForm, category: v})} />
                    <div className="flex justify-end gap-2 mt-2">
                        <button onClick={() => setEditingId(null)} className="p-2 text-white/40 hover:text-white transition-all text-xs font-bold uppercase">X</button>
                        <button onClick={handleSave} className="p-2 px-4 bg-primary text-white rounded-xl text-xs font-bold uppercase">Save</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2 flex items-center gap-1">
                        <Tag size={10} /> {item.category}
                    </div>
                    <p className="text-sm font-bold text-white/60 lowercase tracking-tight line-clamp-2">{item.caption}</p>
                  </>
                )}
            </div>
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
        className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white font-bold text-xs focus:border-primary outline-none transition-all"
      />
    </div>
  );
}
