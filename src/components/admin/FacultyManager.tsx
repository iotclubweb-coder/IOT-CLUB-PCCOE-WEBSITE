import { useState } from 'react';
import { Plus, Trash2, Edit2, Upload, Linkedin, Mail } from 'lucide-react';
import { useData } from '../../context/DataContext';
import type { FacultyMember } from '../../lib/siteData';
import { deleteCloudinaryImage } from '../../lib/cloudinary';
import toast from 'react-hot-toast';

export default function FacultyManager() {
  const { data, updateFaculty } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<FacultyMember>>({});

  const handleEdit = (mentor: FacultyMember) => {
    setEditingId(mentor.id);
    setEditForm({ ...mentor });
  };

  const handleSave = () => {
    if (!editingId) return;
    const updatedFaculty = data.faculty.map(m => m.id === editingId ? { ...m, ...editForm } as FacultyMember : m);
    updateFaculty(updatedFaculty);
    setEditingId(null);
  };

  const handleDelete = async (mentor: FacultyMember) => {
    if (window.confirm('Are you sure you want to permanently remove this faculty?')) {
      const deletePromise = async () => {
        if (mentor.image && !mentor.image.startsWith('http') && !mentor.image.includes('/')) {
           const success = await deleteCloudinaryImage(mentor.image);
           if (!success) {
               console.warn('Could not delete image from Cloudinary.');
           }
        }
        updateFaculty(data.faculty.filter(m => m.id !== mentor.id));
      };

      toast.promise(deletePromise(), {
        loading: 'Removing faculty...',
        success: 'Faculty removed successfully!',
        error: 'Failed to remove faculty.'
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, mentorId?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const targetId = mentorId || editingId;
    
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
      loading: 'Uploading photo...',
      success: (resData) => {
        // Find the latest mentor data to preserve other field changes
        if (targetId) {
            const updatedFaculty = data.faculty.map(m => 
                m.id === targetId ? { ...m, image: resData.public_id } : m
            );
            updateFaculty(updatedFaculty);
            
            // Also update editForm if we're currently editing this mentor
            if (editingId === targetId) {
                setEditForm(prev => ({ ...prev, image: resData.public_id }));
            }
        }
        return 'Photo uploaded successfully!';
      },
      error: (err) => `Upload failed: ${err.message}`
    });
  };

  const handleAdd = () => {
    const newId = Date.now().toString();
    const newMember: FacultyMember = {
      id: newId,
      name: 'New Faculty Member',
      role: 'Role',
      quote: 'Guiding and inspiring...',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + newId,
      linkedin: '',
      email: ''
    };
    
    updateFaculty([...data.faculty, newMember]);
    setTimeout(() => {
        handleEdit(newMember);
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
          Add Faculty Mentor
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {data.faculty.map((mentor) => (
          <div key={mentor.id} className="bg-white/5 border border-white/5 p-6 rounded-[2rem] hover:bg-white/10 transition-all group">
            {editingId === mentor.id ? (
              <div className="space-y-6">
                <div className="flex gap-6">
                    <div className="w-32 h-32 rounded-3xl overflow-hidden bg-secondary border border-white/10 relative group/img cursor-pointer">
                        <img src={editForm.image?.startsWith('http') ? editForm.image : `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto/v1/${editForm.image}`} className="w-full h-full object-cover" />
                        <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer">
                            <Upload className="text-white mb-2" size={24} />
                            <span className="text-[10px] font-bold uppercase text-white/60">Upload Photo</span>
                            <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, mentor.id)} accept="image/*" />
                        </label>
                    </div>
                    <div className="flex-1 space-y-4">
                        <Input label="Name" value={editForm.name} onChange={v => setEditForm({...editForm, name: v})} />
                        <Input label="Role" value={editForm.role} onChange={v => setEditForm({...editForm, role: v})} />
                    </div>
                </div>
                <div>
                    <Input label="Quote" value={editForm.quote} onChange={v => setEditForm({...editForm, quote: v})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="LinkedIn URL" value={editForm.linkedin} onChange={v => setEditForm({...editForm, linkedin: v})} />
                  <Input label="Email Address" value={editForm.email} onChange={v => setEditForm({...editForm, email: v})} />
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button onClick={() => setEditingId(null)} className="px-6 py-3 rounded-xl font-bold text-sm text-white/40 hover:text-white transition-all">Cancel</button>
                  <button onClick={handleSave} className="bg-white text-black px-8 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-all">Save Changes</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/5">
                    <img src={mentor.image?.startsWith('http') ? mentor.image : `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto/v1/${mentor.image}`} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-black lowercase tracking-tighter mb-1 group-hover:text-primary transition-colors uppercase">{mentor.name}</h3>
                  <div className="text-primary text-[10px] font-bold uppercase tracking-widest mb-2">{mentor.role}</div>
                  <div className="flex gap-4">
                    {mentor.linkedin && <Linkedin size={14} className="text-white/40" />}
                    {mentor.email && <Mail size={14} className="text-white/40" />}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => handleEdit(mentor)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-all"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(mentor)} className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-all shadow-lg"><Trash2 size={16} /></button>
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
