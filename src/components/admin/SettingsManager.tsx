import { Settings as SettingsIcon, Save } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function SettingsManager() {
  const { data, updateSettings } = useData();
  const settings = data.settings || { cloudinaryPreset: 'ml_default' };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newSettings = {
      cloudinaryPreset: formData.get('cloudinaryPreset') as string,
    };
    updateSettings(newSettings);
    alert('Settings synchronized across the cluster.');
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem]">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <SettingsIcon className="text-primary" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black lowercase tracking-tighter">System Configuration</h3>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Administrative Parameters</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-white/20 uppercase tracking-widest ml-1">Cloudinary Upload Preset</label>
            <input 
              name="cloudinaryPreset"
              type="text" 
              defaultValue={settings.cloudinaryPreset}
              placeholder="e.g., ml_default"
              className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white font-bold text-sm focus:border-primary outline-none transition-all"
            />
            <p className="text-[10px] text-white/20 mt-2 ml-1 leading-relaxed">
              This preset must be configured as <span className="text-primary font-black">UNSIGNED</span> in your Cloudinary upload settings to enable direct browser uploads.
            </p>
          </div>

          <button 
            type="submit"
            className="w-full flex items-center justify-center gap-3 bg-white text-black py-5 rounded-2xl font-black text-sm hover:scale-[1.02] transition-all shadow-xl"
          >
            <Save size={18} />
            Commit Configuration
          </button>
        </form>
      </div>

      <div className="bg-primary/5 border border-primary/10 p-8 rounded-[2.5rem]">
        <h4 className="text-sm font-black lowercase tracking-tight mb-2 text-primary">Deployment Notice</h4>
        <p className="text-xs text-white/40 leading-relaxed font-medium">
          Note: These settings are currently stored in `localStorage`. To synchronize settings across multiple devices, consider migrating to a centralized cloud database like Firebase.
        </p>
      </div>
    </div>
  );
}
