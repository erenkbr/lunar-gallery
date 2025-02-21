import { useQuery } from '@tanstack/react-query'
import { useObjektsStore } from '@/app/store/slices/objektSlice'  // adjust path as needed

export function useCatalog() {
  const { selectedFilter } = useObjektsStore();
  
  const query = useQuery({
    queryKey: ['catalog', selectedFilter],
    queryFn: async () => {
      const queryString =
        selectedFilter && selectedFilter !== 'artist'
          ? `?member=${selectedFilter}`
          : '';
      
      const response = await fetch(`/api/catalog${queryString}`);
      if (!response.ok) throw new Error('Failed to fetch Objekt catalog');
      const data = await response.json();
      return data.objekts;
    },
  });

  return query;
}
