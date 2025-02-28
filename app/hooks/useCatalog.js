import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useObjektsStore } from '@/app/store/slices/objektSlice'; // Your Zustand store

export function useCatalog() {
  const [isMounted, setIsMounted] = useState(false);

  // Set isMounted to true only after the component mounts on the client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Grab filter state from your Zustand store
  const { selectedGroup, selectedFilter, selectedSeason, selectedCollection, selectedClass } = useObjektsStore();

  const query = useQuery({
    queryKey: ['catalog', selectedGroup, selectedFilter, selectedSeason, selectedCollection, selectedClass],
    queryFn: async () => {
      let queryString = `?group=${selectedGroup}`;
      if (selectedFilter) queryString += `&member=${selectedFilter}`;
      if (selectedSeason) queryString += `&season=${selectedSeason}`;
      if (selectedCollection) queryString += `&collection=${selectedCollection}`;
      if (selectedClass) queryString += `&class=${selectedClass}`;

      console.log("Fetching catalog with query:", queryString);

      const response = await fetch(`/api/catalog${queryString}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch catalog: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Catalog response:", data);
      return data.objekts || [];
    },
    enabled: isMounted, // Only fetch when mounted on the client
  });

  return query;
}