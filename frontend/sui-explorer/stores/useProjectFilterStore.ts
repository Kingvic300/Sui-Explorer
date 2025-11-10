import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type SortByType = 'Trending' | 'TVL' | 'Date Added' | 'Name' | 'Users' | 'Reviews';

interface ProjectFilterState {
  activeCategories: string[];
  sortBy: SortByType;
  tvl: { min: string; max: string };
  users: { min: string; max: string };
  toggleCategory: (category: string) => void;
  setSortBy: (sortBy: SortByType) => void;
  setTvl: (tvl: { min: string; max: string }) => void;
  setUsers: (users: { min: string; max: string }) => void;
  clearFilters: () => void;
}

const initialState = {
    activeCategories: [],
    sortBy: 'Trending' as SortByType,
    tvl: { min: '', max: '' },
    users: { min: '', max: '' },
};

export const useProjectFilterStore = create<ProjectFilterState>()(
  persist(
    (set) => ({
      ...initialState,
      toggleCategory: (category) => set((state) => ({
        activeCategories: state.activeCategories.includes(category)
            ? state.activeCategories.filter(c => c !== category)
            : [...state.activeCategories, category],
      })),
      setSortBy: (sortBy) => set({ sortBy }),
      setTvl: (tvl) => set({ tvl }),
      setUsers: (users) => set({ users }),
      clearFilters: () => set(initialState),
    }),
    {
      name: 'sui-project-filters-v2', // Renamed to avoid conflicts with old structure
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);