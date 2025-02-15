import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useObjektsStore = create(
  persist(
    (set) => ({
      objekts: [],
      setObjekts: (objekts) => set({ objekts }),
      clearObjekts: () => set({ objekts: [] }),
    }),
    {
      name: 'objekts-storage',
    }
  )
)