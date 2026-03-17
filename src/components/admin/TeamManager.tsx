import { useState } from 'react';
import { Plus, Trash2, Edit2, Upload } from 'lucide-react';
import { useData } from '../../context/DataContext';
import type { TeamMember } from '../../lib/siteData';
import { deleteCloudinaryImage } from '../../lib/cloudinary';
import toast from 'react-hot-toast';

export default function TeamManager() {
  const { data, updateTeam } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<TeamMember>>({});

  const handleEdit = (member: TeamMember) => {
    console.log('Editing member:', member);
    setEditingId(member.id);
    setEditForm({ ...member });
  };

  const handleSave = () => {
    if (!editingId) return;
    const updatedTeam = data.team.map(m => m.id === editingId ? { ...m, ...editForm } as TeamMember : m);
    updateTeam(updatedTeam);
    setEditingId(null);
  };

  const handleDelete = async (member: TeamMember) => {
    if (window.confirm('Are you sure you want to permanently remove this operative and delete their photo?')) {
      const deletePromise = async () => {
        // Only try to delete from cloudinary if it's a real public_id
        if (member.image && !member.image.startsWith('http') && !member.image.includes('/')) {
           const success = await deleteCloudinaryImage(member.image);
           if (!success) {
               console.warn('Could not delete image from Cloudinary.');
           }
        }
        updateTeam(data.team.filter(m => m.id !== member.id));
      };

      toast.promise(deletePromise(), {
        loading: 'Removing operative...',
        success: 'Operative removed successfully!',
        error: 'Failed to remove operative.'
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      loading: 'Uploading photo...',
      success: (resData) => {
        setEditForm(prev => ({ ...prev, image: resData.public_id }));
        return 'Photo uploaded successfully!';
      },
      error: (err) => `Upload failed: ${err.message}`
    });
  };

  const handleAdd = () => {
    const newId = Date.now().toString();
    const newMember: TeamMember = {
      id: newId,
      name: 'New Operative',
      role: 'Role',
      tech: 'Tech Stack',
      subRole: '',
      category: 'TECHNICAL',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + newId
    };
    
    // Use a function update to ensure we have the latest state
    const currentTeam = [...data.team, newMember];
    updateTeam(currentTeam);
    
    // Small delay to ensure state update propagated before editing
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
          Deploy New Operative
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {data.team.map((member) => (
          <div key={member.id} className="bg-white/5 border border-white/5 p-6 rounded-[2rem] hover:bg-white/10 transition-all group">
            {editingId === member.id ? (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-32 h-48 md:h-32 rounded-3xl overflow-hidden bg-secondary border border-white/10 relative group/img cursor-pointer shrink-0">
                        <img src={editForm.image?.startsWith('http') ? editForm.image : `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto/v1/${editForm.image}`} className="w-full h-full object-cover" />
                        <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer">
                            <Upload className="text-white mb-2" size={24} />
                            <span className="text-[10px] font-bold uppercase text-white/60">Upload Photo</span>
                            <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                        </label>
                    </div>
                    <div className="flex-1 space-y-4">
                        <Input label="Name" value={editForm.name} onChange={v => setEditForm({...editForm, name: v})} />
                        <Input label="Role" value={editForm.role} onChange={v => setEditForm({...editForm, role: v})} />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Tech Specialization" value={editForm.tech} onChange={v => setEditForm({...editForm, tech: v})} />
                  <Input label="Sub-role (Optional)" value={editForm.subRole} onChange={v => setEditForm({...editForm, subRole: v})} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input label="Github URL" value={(editForm as any).github} onChange={v => setEditForm({...editForm, github: v} as any)} />
                  <Input label="LinkedIn URL" value={(editForm as any).linkedin} onChange={v => setEditForm({...editForm, linkedin: v} as any)} />
                  <Input label="Email" value={(editForm as any).email} onChange={v => setEditForm({...editForm, email: v} as any)} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2 ml-1">Category</label>
                  <select 
                    value={editForm.category || ''} 
                    onChange={e => setEditForm({...editForm, category: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold text-sm focus:border-primary outline-none transition-all"
                  >
                    <option value="" disabled>Select Category</option>
                    <option value="LEADERSHIP">LEADERSHIP</option>
                    <option value="TECHNICAL">TECHNICAL</option>
                    <option value="MANAGEMENT">MANAGEMENT</option>
                    <option value="CREATIVE">CREATIVE</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button onClick={() => setEditingId(null)} className="px-6 py-3 rounded-xl font-bold text-sm text-white/40 hover:text-white transition-all">Cancel</button>
                  <button onClick={handleSave} className="bg-white text-black px-8 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-all">Verify Deploy</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/5">
                    <img src={member.image?.startsWith('http') ? member.image : `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto/v1/${member.image}`} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-black lowercase tracking-tighter mb-1 group-hover:text-primary transition-colors uppercase">{member.name}</h3>
                  <div className="text-primary text-[10px] font-bold uppercase tracking-widest mb-2">{member.role}</div>
                  <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{member.tech}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => handleEdit(member)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-all"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(member)} className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-all shadow-lg"><Trash2 size={16} /></button>
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
