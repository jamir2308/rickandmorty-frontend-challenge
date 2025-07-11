import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getCharacter } from '@/services/rickAndMortyApi';
import { ApiResponse, Character } from '@/types/rickAndMorty';

export const useCharacters = (searchTerm: string = '') => {
  return useInfiniteQuery({
    queryKey: ['characters', searchTerm],
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) => {
      let endpoint = `https://rickandmortyapi.com/api/character?page=${pageParam}`;
      if (searchTerm) {
        endpoint += `&name=${encodeURIComponent(searchTerm)}`;
      }
      return fetch(endpoint, { signal }).then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch characters');
        }
        return res.json();
      });
    },
    getNextPageParam: (lastPage: ApiResponse<Character>) => {
      if (lastPage?.info?.next) {
        return lastPage.info.next ? parseInt(new URL(lastPage.info.next).searchParams.get('page') || '1') : undefined;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
};

export const useCharacter = (id: number | null) => {
  return useQuery({
    queryKey: ['character', id],
    queryFn: () => getCharacter(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};