import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import type { SiteData, Event, TeamMember, GalleryItem, BlogPost, SiteSettings, Project, FacultyMember } from '../lib/siteData';
import { INITIAL_DATA } from '../lib/siteData';
import { supabase } from '../lib/supabase';

export type SyncStatus = 'idle' | 'saving' | 'saved' | 'error' | 'no-db';

interface DataContextType {
  data: SiteData;
  syncStatus: SyncStatus;
  updateEvents: (events: Event[]) => void;
  updateTeam: (team: TeamMember[]) => void;
  updateGallery: (gallery: GalleryItem[]) => void;
  updateBlogs: (blogs: BlogPost[]) => void;
  updateSettings: (settings: SiteSettings) => void;
  updateProjects: (projects: Project[]) => void;
  updateFaculty: (faculty: FacultyMember[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

/** Load initial data: localStorage first (instant), then Supabase (async override) */
function getLocalData(): SiteData {
  const saved = localStorage.getItem('iot_club_data');
  if (!saved) return INITIAL_DATA;
  try {
    return { ...INITIAL_DATA, ...JSON.parse(saved) };
  } catch {
    return INITIAL_DATA;
  }
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<SiteData>(getLocalData);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(supabase ? 'idle' : 'no-db');
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialLoad = useRef(true);

  // On mount: fetch from Supabase (overrides localStorage if available)
  useEffect(() => {
    async function initData() {
      if (!supabase) {
        isInitialLoad.current = false;
        return;
      }

      try {
        const { data: row, error } = await supabase
          .from('site_data')
          .select('data')
          .eq('id', 1)
          .single();

        if (!error && row?.data) {
          const merged = { ...INITIAL_DATA, ...(row.data as object) } as SiteData;
          setData(merged);
          localStorage.setItem('iot_club_data', JSON.stringify(merged));
          setSyncStatus('saved');
        } else if (error) {
          console.error('Supabase init error:', error);
          setSyncStatus('error');
        }
      } catch (err) {
        console.error('Supabase init failed:', err);
        setSyncStatus('error');
      } finally {
        isInitialLoad.current = false;
      }
    }

    // Safety timeout: Ensure we always release the "initial load" lock after 3 seconds
    const safetyTimeout = setTimeout(() => {
        if (isInitialLoad.current) {
            console.warn('Supabase init timed out, releasing lock.');
            isInitialLoad.current = false;
        }
    }, 3000);

    initData();
    return () => clearTimeout(safetyTimeout);
  }, []);

  // Debounced save to Supabase + localStorage on every data change
  const saveToSupabase = useCallback((newData: SiteData) => {
    // Always save to localStorage immediately
    localStorage.setItem('iot_club_data', JSON.stringify(newData));

    if (!supabase) return;

    // Debounce Supabase writes (500ms) to avoid spamming the API
    if (saveTimer.current) clearTimeout(saveTimer.current);
    
    // Capture client to ensure it's not null in closure
    const client = supabase;
    if (!client) {
      setSyncStatus('no-db');
      return;
    }

    setSyncStatus('saving');

    saveTimer.current = setTimeout(async () => {
      const { error } = await client
        .from('site_data')
        .upsert({ id: 1, data: newData, updated_at: new Date().toISOString() });

      if (error) {
        console.error('Supabase save failed:', error.message);
        setSyncStatus('error');
      } else {
        setSyncStatus('saved');
      }
    }, 500);
  }, []);

  // Watch for data changes and persist
  useEffect(() => {
    if (isInitialLoad.current) return;
    saveToSupabase(data);
  }, [data, saveToSupabase]);

  const updateEvents = (events: Event[]) => setData(prev => ({ ...prev, events }));
  const updateTeam = (team: TeamMember[]) => setData(prev => ({ ...prev, team }));
  const updateGallery = (gallery: GalleryItem[]) => setData(prev => ({ ...prev, gallery }));
  const updateBlogs = (blogs: BlogPost[]) => setData(prev => ({ ...prev, blogs }));
  const updateSettings = (settings: SiteSettings) => setData(prev => ({ ...prev, settings }));
  const updateProjects = (projects: Project[]) => setData(prev => ({ ...prev, projects }));
  const updateFaculty = (faculty: FacultyMember[]) => setData(prev => ({ ...prev, faculty }));

  return (
    <DataContext.Provider value={{ 
      data,
      syncStatus,
      updateEvents, 
      updateTeam, 
      updateGallery, 
      updateBlogs, 
      updateSettings,
      updateProjects,
      updateFaculty
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
