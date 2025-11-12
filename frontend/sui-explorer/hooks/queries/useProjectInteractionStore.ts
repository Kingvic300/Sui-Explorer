// stores/useProjectInteractionStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProjectInteractionState {
    favorites: Record<string, string[]>;
    recentlyViewed: Record<string, string[]>;
    toggleFavorite: (wallet: string, projectId: string) => void;
    getFavorites: (wallet: string) => string[];
    recordViewed: (wallet: string, projectId: string) => void;
    getRecentlyViewed: (wallet: string) => string[];
    clearAll: () => void;
}

export const useProjectInteractionStore = create<ProjectInteractionState>()(
    persist(
        (set, get) => ({
            favorites: {},
            recentlyViewed: {},

            toggleFavorite: (wallet, projectId) => {
                if (!wallet) return;
                const userFavs = get().favorites[wallet] || [];
                const newFavs = userFavs.includes(projectId)
                    ? userFavs.filter(id => id !== projectId)
                    : [...userFavs, projectId];
                set({
                    favorites: { ...get().favorites, [wallet]: newFavs },
                });
            },

            getFavorites: wallet => get().favorites[wallet] || [],

            recordViewed: (wallet, projectId) => {
                if (!wallet) return;
                const list = get().recentlyViewed[wallet] || [];
                const newList = [projectId, ...list.filter(id => id !== projectId)].slice(0, 10);
                set({
                    recentlyViewed: { ...get().recentlyViewed, [wallet]: newList },
                });
            },

            getRecentlyViewed: wallet => get().recentlyViewed[wallet] || [],

            clearAll: () => set({ favorites: {}, recentlyViewed: {} }),
        }),
        { name: 'project-interactions' }
    )
);
