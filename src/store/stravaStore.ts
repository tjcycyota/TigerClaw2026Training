import { create } from 'zustand';
import { StravaTokens, StravaActivity } from '../types';
import { storage } from '../lib/storage';

interface StravaState {
  tokens: StravaTokens | null;
  clientSecret: string;
  activities: StravaActivity[];
  isSyncing: boolean;
  syncError: string | null;
  lastSyncAt: number | null;

  setTokens: (tokens: StravaTokens) => void;
  setClientSecret: (secret: string) => void;
  setActivities: (activities: StravaActivity[]) => void;
  setSyncing: (v: boolean) => void;
  setSyncError: (e: string | null) => void;
  setLastSync: (ts: number) => void;
  disconnect: () => void;
}

export const useStravaStore = create<StravaState>((set) => ({
  tokens: storage.getTokens(),
  clientSecret: localStorage.getItem('tc50k_client_secret') ?? '',
  activities: [],
  isSyncing: false,
  syncError: null,
  lastSyncAt: storage.getLastSync(),

  setTokens: (tokens) => {
    storage.setTokens(tokens);
    set({ tokens });
  },
  setClientSecret: (secret) => {
    localStorage.setItem('tc50k_client_secret', secret);
    set({ clientSecret: secret });
  },
  setActivities: (activities) => set({ activities }),
  setSyncing: (isSyncing) => set({ isSyncing }),
  setSyncError: (syncError) => set({ syncError }),
  setLastSync: (ts) => {
    storage.setLastSync(ts);
    set({ lastSyncAt: ts });
  },
  disconnect: () => {
    storage.clearTokens();
    localStorage.removeItem('tc50k_client_secret');
    set({ tokens: null, clientSecret: '', activities: [] });
  },
}));
