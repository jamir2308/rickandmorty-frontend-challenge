import { useQuery } from '@tanstack/react-query';
import { Episode } from '@/types/rickAndMorty';

const fetchEpisode = async (episodeURL: string, signal?: AbortSignal) => {
  const response = await fetch(episodeURL, { signal });
  if (!response.ok) {
    throw new Error('Failed to fetch episode');
  }
  return response.json();
};

export const useEpisode = (episodeURL: string) => {
  const episodeNumber = episodeURL.split('/').pop();

  return useQuery<Episode>({
    queryKey: ['episode', episodeNumber],
    queryFn: ({ signal }) => fetchEpisode(episodeURL, signal),
    enabled: !!episodeURL,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
}; 