export interface Character {
    id: number;
    name: string;
    status: 'Alive' | 'Dead' | 'unknown';
    species: string;
    type: string;
    gender: string;
    origin: {
      name: string;
      url: string;
    };
    location: {
      name: string;
      url: string;
    };
    image: string;
    episode: string[];
    url: string;
    created: string;
  }
  
  export interface Episode {
    id: number;
    name: string;
    air_date: string;
    episode: string;
    characters: string[];
    url: string;
    created: string;
  }
  
  export interface ApiResponse<T> {
    info: {
      count: number;
      pages: number;
      next: string | null;
      prev: string | null;
    };
    results: T[];
  }
  
  export interface CharacterFilters {
    page?: number;
    name?: string;
    status?: string;
    species?: string;
    gender?: string;
  }
  
  export interface EpisodeAnalysis {
    character1Only: Episode[];
    shared: Episode[];
    character2Only: Episode[];
  }

  export interface CharacterCardProps {
    character: Character;
    isSelected?: boolean;
    onClick?: () => void;
  }

  export interface CharacterListProps {
    title: string;
    selectedCharacter: Character | null;
    onCharacterSelect: (character: Character) => void;
  }

  export interface EpisodeListProps {
    title: string;
    episodes: Episode[];
    isLoading?: boolean;
    emptyMessage?: string;
  }