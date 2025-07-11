import { useEpisode } from '@/hooks/useEpisode';
import { Skeleton } from '@/components/ui/Skeleton';

interface EpisodeItemProps {
  episodeURL: string;
}

export const EpisodeItem = ({ episodeURL }: EpisodeItemProps) => {
  const { data: episode, isLoading, isError } = useEpisode(episodeURL);

  if (isLoading) {
    return (
      <div className="flex items-center justify-between p-3 border rounded">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-6 w-12" />
      </div>
    );
  }

  if (isError || !episode) {
    return (
      <div className="flex items-center justify-between p-3 border rounded">
        <div>
          <p className="font-medium text-sm text-muted-foreground">
            Episode: {episodeURL.split('/').pop()}
          </p>
          <p className="text-xs text-muted-foreground">Not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 border rounded hover:bg-accent/50 transition-colors animate-fade-in">
      <div>
        <p className="font-medium text-sm">{episode.name}</p>
        <p className="text-xs text-muted-foreground">{episode.air_date}</p>
      </div>
      <span className="inline-flex items-center rounded-full bg-cyan-100 text-cyan-700 border border-cyan-300 px-3 py-1 text-xs font-semibold">
        {episode.episode}
      </span>
    </div>
  );
}; 