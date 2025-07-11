import { memo, useMemo } from 'react';
import { EpisodeList } from './EpisodeList';
import { Character } from '@/types/rickAndMorty';

interface Props {
  character1: Character | null;
  character2: Character | null;
}

export const SharedEpisodesList = memo(({ character1, character2 }: Props) => {
  const sharedEpisodes = useMemo(() => {
    if (!character1 || !character2) return [];
    const set2 = new Set(character2.episode);
    return character1.episode.filter(ep => set2.has(ep));
  }, [character1, character2]);

  if (!character1 || !character2) return null;
  return (
    <EpisodeList
      title="Shared Episodes"
      episodes={sharedEpisodes}
      emptyMessage="No se encontraron episodios compartidos"
    />
  );
});

SharedEpisodesList.displayName = 'SharedEpisodesList'; 