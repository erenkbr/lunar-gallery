import { useQuery } from '@tanstack/react-query';
import { useObjektsStore } from '@/app/store/slices/objektSlice';

export function useCatalog() {
  const { selectedGroup, selectedFilter } = useObjektsStore();

  const query = useQuery({
    queryKey: ['catalog', selectedGroup, selectedFilter],
    queryFn: async () => {
      let queryString = `?group=${selectedGroup}`;
      if (selectedFilter) {
        queryString += `&member=${selectedFilter}`;
      }

      const response = await fetch(`/api/catalog${queryString}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch catalog: ${response.statusText}`);
      }
      const data = await response.json();
      return data.objekts;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return query;
}