import { memo } from 'react';
import { EpisodeList } from './EpisodeList';
import { Character } from '@/types/rickAndMorty';

interface Props {
  character: Character | null;
  title: string;
}

export const CharacterEpisodesList = memo(({ character, title }: Props) => {
  if (!character) return null;
  return (
    <EpisodeList
      title={title}
      episodes={character.episode}
      emptyMessage={`${character.name} no tiene episodios únicos`}
    />
  );
});

CharacterEpisodesList.displayName = 'CharacterEpisodesList'; 