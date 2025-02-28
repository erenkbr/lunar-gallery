import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useObjektsStore = create(
  persist(
    (set) => ({
      selectedGroup: 'ARTMS',
      selectedFilter: null,
      selectedSeason: null,
      selectedCollection: null,
      selectedClass: null,
      setSelectedGroup: (group) => set((state) => {
        if (state.selectedGroup !== group) {
          console.log("Resetting filters for group change:", group);
          return { 
            selectedGroup: group, 
            selectedFilter: null, 
            selectedSeason: null, 
            selectedCollection: null, 
            selectedClass: null 
          };
        }
        return { selectedGroup: group };
      }),
      setSelectedFilter: (filter) => set({ selectedFilter: filter }),
      setSelectedSeason: (season) => set({ selectedSeason: season }),
      setSelectedCollection: (collection) => set({ selectedCollection: collection }),
      setSelectedClass: (classType) => set({ selectedClass: classType }),
    }),
    {
      name: 'objekts-storage',
    }
  )
);