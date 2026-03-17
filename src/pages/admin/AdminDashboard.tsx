import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Radio, Users, Image as ImageIcon, FileText, LogOut, ArrowLeft, Settings as SettingsIcon, Rocket, Database, CloudOff, RefreshCw, AlertCircle, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../context/DataContext';
import EventsManager from '../../components/admin/EventsManager';
import TeamManager from '../../components/admin/TeamManager';
import GalleryManager from '../../components/admin/GalleryManager';
import BlogManager from '../../components/admin/BlogManager';
import SettingsManager from '../../components/admin/SettingsManager';
import ProjectsManager from '../../components/admin/ProjectsManager';
import FacultyManager from '../../components/admin/FacultyManager';

type Tab = 'overview' | 'events' | 'team' | 'faculty' | 'gallery' | 'blogs' | 'projects' | 'settings';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data, syncStatus } = useData();

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'events', label: 'Upcoming Signals', icon: Radio },
    { id: 'team', label: 'Core Operatives', icon: Users },
    { id: 'faculty', label: 'Faculty Mentors', icon: Users },
    { id: 'gallery', label: 'Visual Logs', icon: ImageIcon },
    { id: 'blogs', label: 'Insight Stream', icon: FileText },
    { id: 'projects', label: 'Projects', icon: Rocket },
    { id: 'settings', label: 'System Settings', icon: SettingsIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'events': return <EventsManager />;
      case 'team': return <TeamManager />;
      case 'faculty': return <FacultyManager />;
      case 'gallery': return <GalleryManager />;
      case 'blogs': return <BlogManager />;
      case 'projects': return <ProjectsManager />;
      case 'settings': return <SettingsManager />;
      default: return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Signals" value={data.events.length} icon={<Radio className="text-primary" />} />
          <StatCard title="Core Builders" value={data.team.length} icon={<Users className="text-primary" />} />
          <StatCard title="Visual Logs" value={data.gallery.length} icon={<ImageIcon className="text-primary" />} />
          <StatCard title="Insight Posts" value={data.blogs.length} icon={<FileText className="text-primary" />} />
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-6 border-b border-white/5 bg-[#0a0a0a] sticky top-0 z-50">
        <h1 className="text-xl font-black tracking-tighter lowercase">
            iot <span className="text-primary italic">admin.</span>
        </h1>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar - Desktop & Mobile */}
      <AnimatePresence>
        {(isMobileMenuOpen || window.innerWidth >= 768) && (
          <motion.aside 
            initial={window.innerWidth < 768 ? { x: -300 } : false}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className={`
              fixed md:relative inset-y-0 left-0 w-64 border-r border-white/5 p-6 bg-[#0a0a0a] z-40
              md:flex flex-col transform transition-transform duration-300 ease-in-out
              ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}
          >
            <div className="mb-12 hidden md:block">
                <h1 className="text-2xl font-black tracking-tighter lowercase">
                    iot <span className="text-primary italic">admin.</span>
                </h1>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as Tab);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                    activeTab === item.id 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Database Sync Status */}
            <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                    syncStatus === 'saved' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                    syncStatus === 'saving' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                    syncStatus === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                    'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                }`}>
                    {syncStatus === 'saved' && <Database size={18} className="shrink-0 mt-0.5" />}
                    {syncStatus === 'saving' && <RefreshCw size={18} className="shrink-0 mt-0.5 animate-spin" />}
                    {syncStatus === 'error' && <AlertCircle size={18} className="shrink-0 mt-0.5" />}
                    {syncStatus === 'no-db' && <CloudOff size={18} className="shrink-0 mt-0.5" />}
                    
                    <div className="flex-1">
                        <p className="text-sm font-bold leading-tight">
                            {syncStatus === 'saved' ? 'Synced' :
                             syncStatus === 'saving' ? 'Saving...' :
                             syncStatus === 'error' ? 'Sync Error' :
                             'Local Mode'}
                        </p>
                    </div>
                </div>

                <div className="space-y-2">
                    <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all font-bold text-sm">
                      <ArrowLeft size={18} />
                      Back to Site
                    </Link>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-bold text-sm hover:bg-red-500/5 rounded-xl transition-all">
                      <LogOut size={18} />
                      Logout
                    </button>
                </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black lowercase tracking-tighter mb-2">
              {sidebarItems.find(i => i.id === activeTab)?.label}
            </h2>
            <p className="text-white/40 text-sm font-medium">Manage your club's connectivity and signals.</p>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/5 p-6 rounded-3xl hover:border-white/10 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-primary/10 rounded-2xl">{icon}</div>
        <span className="text-xs font-bold text-white/20 uppercase tracking-widest">Active</span>
      </div>
      <div className="text-4xl font-black mb-1">{value}</div>
      <div className="text-sm font-medium text-white/40 lowercase tracking-tight">{title}</div>
    </div>
  );
}
