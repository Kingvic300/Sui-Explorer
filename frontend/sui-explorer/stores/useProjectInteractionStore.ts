
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const MAX_RECENTLY_VIEWED = 4;

interface ProjectInteractionState {
  favorites: number[];
  recentlyViewed: number[];
  toggleFavorite: (id: number) => void;
  addRecentlyViewed: (id: number) => void;
  isFavorite: (id: number) => boolean;
}

export const useProjectInteractionStore = create<ProjectInteractionState>()(
  persist(
    (set, get) => ({
      favorites: [],
      recentlyViewed: [],
      toggleFavorite: (id) => set((state) => {
        const isFavorited = state.favorites.includes(id);
        if (isFavorited) {
          return { favorites: state.favorites.filter((favId) => favId !== id) };
        } else {
          return { favorites: [...state.favorites, id] };
        }
      }),
      addRecentlyViewed: (id) => set((state) => {
        const newRecentlyViewed = [id, ...state.recentlyViewed.filter(viewedId => viewedId !== id)];
        return { recentlyViewed: newRecentlyViewed.slice(0, MAX_RECENTLY_VIEWED) };
      }),
      isFavorite: (id) => get().favorites.includes(id),
    }),
    {
      name: 'sui-project-interaction',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
