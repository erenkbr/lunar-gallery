// app/store/slices/objektSlice.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useObjektsStore = create(
  persist(
    (set) => ({
      selectedGroup: 'ARTMS', // Default to ARTMS
      selectedFilter: null,   // null means "all members of the group", otherwise a member name
      setSelectedGroup: (group) => set({ selectedGroup: group, selectedFilter: null }),
      setSelectedFilter: (filter) => set({ selectedFilter: filter }),
    }),
    {
      name: 'objekts-storage',
    }
  )
);