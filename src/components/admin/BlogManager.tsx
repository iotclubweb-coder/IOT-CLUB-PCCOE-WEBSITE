import { useState } from 'react';
import { Plus, Trash2, Edit2, User, Clock, Calendar, Tag } from 'lucide-react';
import { useData } from '../../context/DataContext';
import type { BlogPost } from '../../lib/siteData';

export default function BlogManager() {
  const { data, updateBlogs } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<BlogPost>>({});

  const handleEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setEditForm(post);
  };

  const handleSave = () => {
    if (!editingId) return;
    const updatedBlogs = data.blogs.map(b => b.id === editingId ? { ...b, ...editForm } as BlogPost : b);
    updateBlogs(updatedBlogs);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to stop this stream?')) {
      updateBlogs(data.blogs.filter(b => b.id !== id));
    }
  };

  const handleAdd = () => {
    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: 'New Insight Title',
      author: 'Admin',
      readTime: '5min',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      category: 'Analysis 00x'
    };
    updateBlogs([...data.blogs, newPost]);
    handleEdit(newPost);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 bg-primary px-6 py-3 rounded-2xl font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-primary/20"
        >
          <Plus size={18} />
          Broadcast New Insight
        </button>
      </div>

      <div className="space-y-4">
        {data.blogs.map((post) => (
          <div key={post.id} className="bg-white/5 border border-white/5 p-8 rounded-[3rem] hover:bg-white/10 transition-all group">
            {editingId === post.id ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Input label="Title" value={editForm.title} onChange={v => setEditForm({...editForm, title: v})} />
                  <Input label="Author" value={editForm.author} onChange={v => setEditForm({...editForm, author: v})} />
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                        <Input label="Category" value={editForm.category} onChange={v => setEditForm({...editForm, category: v})} />
                        <Input label="Read Time" value={editForm.readTime} onChange={v => setEditForm({...editForm, readTime: v})} />
                  </div>
                  <Input label="Date" value={editForm.date} onChange={v => setEditForm({...editForm, date: v})} />
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2 ml-1">Content</label>
                    <textarea 
                      value={editForm.content || ''} 
                      onChange={e => setEditForm({...editForm, content: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold text-sm focus:border-primary outline-none transition-all min-h-[150px] resize-y"
                      placeholder="Write your insight here..."
                    />
                  </div>
                </div>
                <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                  <button onClick={() => setEditingId(null)} className="px-6 py-3 rounded-xl font-bold text-sm text-white/40 hover:text-white transition-all">Cancel</button>
                  <button onClick={handleSave} className="bg-white text-black px-8 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-all">Verify Broadcast</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-1">
                     <Tag size={10} /> {post.category}
                  </div>
                  <h3 className="text-3xl font-black lowercase tracking-tighter mb-4 group-hover:text-primary transition-colors">{post.title}</h3>
                  <div className="flex items-center gap-6 text-xs font-bold text-white/20 uppercase tracking-widest">
                    <div className="flex items-center gap-1"><User size={12} /> {post.author}</div>
                    <div className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</div>
                    <div className="flex items-center gap-1"><Calendar size={12} /> {post.date}</div>
                  </div>
                </div>
                <div className="flex gap-2 ml-8">
                  <button onClick={() => handleEdit(post)} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white/40 hover:text-white transition-all"><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(post.id)} className="p-4 bg-white/5 hover:bg-red-500/20 rounded-2xl text-white/40 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
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
