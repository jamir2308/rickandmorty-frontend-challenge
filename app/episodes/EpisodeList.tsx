import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EpisodeItem } from '@/app/episodes/EpisodeItem';

interface EpisodeListProps {
  title: string;
  episodes: string[]; // ahora es string[]
  isLoading?: boolean;
  emptyMessage?: string;
}

const EpisodeListComponent = ({ 
  title, 
  episodes, 
  isLoading = false, 
  emptyMessage = "No episodes found" 
}: EpisodeListProps) => {
  return (
    <Card>
      <CardHeader className="min-h-[60px]">
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <Badge variant="secondary" className="ml-2">
            {isLoading ? '...' : episodes.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[28vh] flex flex-col justify-start">
        {episodes.length > 0 ? (
          <div className="space-y-2 h-[28vh] overflow-y-auto">
            {episodes.map((episodeURL) => (
              <EpisodeItem key={episodeURL} episodeURL={episodeURL} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">{emptyMessage}</p>
        )}
      </CardContent>
    </Card>
  );
};

export const EpisodeList = memo(EpisodeListComponent);

EpisodeList.displayName = 'EpisodeList';