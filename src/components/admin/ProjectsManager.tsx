import { useState } from 'react';
import { Plus, Trash2, Edit2, Upload } from 'lucide-react';
import { useData } from '../../context/DataContext';
import type { Project } from '../../lib/siteData';
import { getCloudinaryUrl, deleteCloudinaryImage } from '../../lib/cloudinary';
import toast from 'react-hot-toast';

export default function ProjectsManager() {
  const { data, updateProjects } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Project>>({});

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setEditForm({ ...project });
  };

  const handleSave = () => {
    if (!editingId) return;
    const updatedProjects = (data.projects || []).map(p => p.id === editingId ? { ...p, ...editForm } as Project : p);
    updateProjects(updatedProjects);
    setEditingId(null);
  };

  const handleDelete = async (project: Project) => {
    if (window.confirm('Are you sure you want to permanently delete this project and its image?')) {
      const deletePromise = async () => {
        // Only try to delete from cloudinary if it's a real public_id
        if (project.image && !project.image.startsWith('http') && !project.image.includes('/')) {
           const success = await deleteCloudinaryImage(project.image);
           if (!success) {
               console.warn('Could not delete image from Cloudinary.');
           }
        }
        updateProjects((data.projects || []).filter(p => p.id !== project.id));
      };

      toast.promise(deletePromise(), {
        loading: 'Deleting project...',
        success: 'Project deleted successfully!',
        error: 'Failed to delete project.'
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, projectId: string) => {
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
      loading: 'Uploading thumbnail...',
      success: (resData) => {
        const updatedItem = { ...editForm, image: resData.public_id };
        setEditForm(updatedItem);
        const updatedProjects = (data.projects || []).map(p => p.id === projectId ? { ...p, image: resData.public_id } as Project : p);
        updateProjects(updatedProjects);
        return 'Thumbnail uploaded successfully!';
      },
      error: (err) => `Upload failed: ${err.message}`
    });
  };

  const handleAdd = () => {
    const newId = Date.now().toString();
    const newProject: Project = {
      id: newId,
      title: 'New Project',
      description: 'Describe your vision...',
      category: 'Web',
      tags: ['React', 'IoT'],
      links: {},
      image: 'iot-club/assets/hero'
    };
    updateProjects([...(data.projects || []), newProject]);
    handleEdit(newProject);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 bg-primary px-6 py-3 rounded-2xl font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-primary/20"
        >
          <Plus size={18} />
          Pulse New Project
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {data.projects?.map((project) => (
          <div key={project.id} className="bg-white/5 border border-white/5 p-6 rounded-[2rem] hover:bg-white/10 transition-all group">
            {editingId === project.id ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="aspect-video bg-white/5 rounded-2xl overflow-hidden relative group/img">
                        <img 
                            src={editForm.image?.startsWith('http') ? editForm.image : getCloudinaryUrl(editForm.image || '', { width: 600, crop: 'fit' })} 
                            className="w-full h-full object-cover"
                            alt="Project"
                        />
                        <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                            <div className="flex flex-col items-center gap-2">
                                <Upload size={24} className="text-white" />
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Update Image</span>
                            </div>
                            <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, project.id)} accept="image/*" />
                        </label>
                    </div>
                    <Input label="Title" value={editForm.title} onChange={v => setEditForm({...editForm, title: v})} />
                    <Input label="Category" value={editForm.category} onChange={v => setEditForm({...editForm, category: v})} />
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Demo URL" value={editForm.links?.demo} onChange={v => setEditForm({...editForm, links: {...editForm.links, demo: v}})} />
                        <Input label="Github URL" value={editForm.links?.github} onChange={v => setEditForm({...editForm, links: {...editForm.links, github: v}})} />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2 ml-1">Tags (comma separated)</label>
                        <input 
                            type="text" 
                            value={editForm.tags?.join(', ')} 
                            onChange={e => setEditForm({...editForm, tags: e.target.value.split(',').map(t => t.trim())})}
                            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold text-sm focus:border-primary outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2 ml-1">Description</label>
                        <textarea 
                            value={editForm.description} 
                            onChange={e => setEditForm({...editForm, description: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold text-sm focus:border-primary outline-none transition-all resize-none h-32"
                        />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setEditingId(null)} className="px-6 py-3 rounded-xl font-bold text-sm text-white/40 hover:text-white transition-all">Cancel</button>
                  <button onClick={handleSave} className="bg-white text-black px-8 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-all">Save Project</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-secondary shrink-0">
                    <img 
                        src={project.image?.startsWith('http') ? project.image : getCloudinaryUrl(project.image || '', { width: 200, crop: 'fill' })} 
                        className="w-full h-full object-cover" 
                    />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-primary text-[10px] font-black uppercase tracking-widest">{project.category}</span>
                    {project.featured && <span className="bg-amber-400 text-black px-2 py-0.5 rounded text-[8px] font-black uppercase">Featured</span>}
                  </div>
                  <h3 className="text-xl font-black lowercase tracking-tighter text-white group-hover:text-primary transition-colors">{project.title}</h3>
                  <p className="text-white/40 text-xs line-clamp-1 max-w-xl">{project.description}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(project)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-all"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(project)} className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-all shadow-lg"><Trash2 size={16} /></button>
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
