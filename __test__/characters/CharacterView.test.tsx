import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CharacterView from '@/app/characters/CharacterView';
import { Character } from '@/types/rickAndMorty';

// Mock the components and hooks
jest.mock('../../app/characters/CharacterListInfinite', () => ({
  CharacterListInfinite: ({ title, panelId, selectedCharacter, onCharacterSelect }: any) => (
    <div data-testid={`character-list-${panelId}`}>
      <h3>{title}</h3>
      <div data-testid={`selected-character-${panelId}`}>
        {selectedCharacter ? selectedCharacter.name : 'None selected'}
      </div>
      <button 
        onClick={() => onCharacterSelect({ id: panelId + 1, name: `Character ${panelId + 1}` })}
        data-testid={`select-character-${panelId}`}
      >
        Select Character {panelId + 1}
      </button>
    </div>
  )
}));

jest.mock('../../app/episodes/CharacterEpisodesList', () => ({
  CharacterEpisodesList: ({ character, title }: any) => (
    <div data-testid={`character-episodes-${character?.id}`}>
      <h4>{title}</h4>
      <div>Episodes for {character?.name}</div>
    </div>
  )
}));

jest.mock('../../app/episodes/SharedEpisodesList', () => ({
  SharedEpisodesList: ({ character1, character2 }: any) => (
    <div data-testid="shared-episodes">
      <h4>Shared Episodes</h4>
      <div>Shared between {character1?.name} and {character2?.name}</div>
    </div>
  )
}));

jest.mock('../../hooks/useCharacterSelection', () => ({
  useCharacterSelection: (onError: (msg: string) => void) => {
    const [selectedCharacters, setSelectedCharacters] = React.useState<[Character | null, Character | null]>([null, null]);
    
    const handleSelectCharacter = (character: Character, panelId: number) => {
      if (panelId === 0 && selectedCharacters[1]?.id === character.id) {
        onError('This character is already selected in the other panel.');
        return;
      }
      if (panelId === 1 && selectedCharacters[0]?.id === character.id) {
        onError('This character is already selected in the other panel.');
        return;
      }
      
      const newSelection = [...selectedCharacters] as [Character | null, Character | null];
      newSelection[panelId] = character;
      setSelectedCharacters(newSelection);
    };

    return {
      selectedCharacters,
      handleSelectCharacter
    };
  }
}));

// Mock data
const mockCharacter1: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth (C-137)', url: 'https://rickandmortyapi.com/api/location/1' },
  location: { name: 'Earth (Replacement Dimension)', url: 'https://rickandmortyapi.com/api/location/20' },
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  episode: ['https://rickandmortyapi.com/api/episode/1'],
  url: 'https://rickandmortyapi.com/api/character/1',
  created: '2017-11-04T18:48:46.250Z'
};

const mockCharacter2: Character = {
  id: 2,
  name: 'Morty Smith',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth (C-137)', url: 'https://rickandmortyapi.com/api/location/1' },
  location: { name: 'Earth (Replacement Dimension)', url: 'https://rickandmortyapi.com/api/location/20' },
  image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
  episode: ['https://rickandmortyapi.com/api/episode/1'],
  url: 'https://rickandmortyapi.com/api/character/2',
  created: '2017-11-04T18:50:21.651Z'
};

// Test wrapper with QueryClient
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('CharacterView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Initial Rendering', () => {
    it('should render the Rick and Morty logo', () => {
      render(
        <TestWrapper>
          <CharacterView />
        </TestWrapper>
      );

      const logo = screen.getByAltText('Rick and Morty Logo');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', expect.stringContaining('rickandmorty.webp'));
    });

    it('should render two character selection panels', () => {
      render(
        <TestWrapper>
          <CharacterView />
        </TestWrapper>
      );

      expect(screen.getByTestId('character-list-0')).toBeInTheDocument();
      expect(screen.getByTestId('character-list-1')).toBeInTheDocument();
      expect(screen.getByText('Select Character #1')).toBeInTheDocument();
      expect(screen.getByText('Select Character #2')).toBeInTheDocument();
    });

    it('should show message when no characters are selected', () => {
      render(
        <TestWrapper>
          <CharacterView />
        </TestWrapper>
      );

      expect(screen.getByText('You must select both characters to see the episodes.')).toBeInTheDocument();
    });
  });

  describe('Character Selection', () => {
    it('should allow selecting different characters in both panels', async () => {
      render(
        <TestWrapper>
          <CharacterView />
        </TestWrapper>
      );

      // Select character in first panel
      fireEvent.click(screen.getByTestId('select-character-0'));
      
      // Select character in second panel
      fireEvent.click(screen.getByTestId('select-character-1'));

      await waitFor(() => {
        expect(screen.getByTestId('selected-character-0')).toHaveTextContent('Character 1');
        expect(screen.getByTestId('selected-character-1')).toHaveTextContent('Character 2');
      });
    });

    it('should show episodes when both characters are selected', async () => {
      render(
        <TestWrapper>
          <CharacterView />
        </TestWrapper>
      );

      // Select both characters
      fireEvent.click(screen.getByTestId('select-character-0'));
      fireEvent.click(screen.getByTestId('select-character-1'));

      await waitFor(() => {
        // Should show episode panels
        expect(screen.getByTestId('character-episodes-1')).toBeInTheDocument();
        expect(screen.getByTestId('character-episodes-2')).toBeInTheDocument();
        expect(screen.getByTestId('shared-episodes')).toBeInTheDocument();
        
        // Should not show the "select both characters" message
        expect(screen.queryByText('You must select both characters to see the episodes.')).not.toBeInTheDocument();
      });
    });

    it('should display correct episode titles when characters are selected', async () => {
      render(
        <TestWrapper>
          <CharacterView />
        </TestWrapper>
      );

      // Select both characters
      fireEvent.click(screen.getByTestId('select-character-0'));
      fireEvent.click(screen.getByTestId('select-character-1'));

      await waitFor(() => {
        expect(screen.getByText("Character 1's episodes")).toBeInTheDocument();
        expect(screen.getByText("Character 2's episodes")).toBeInTheDocument();
        expect(screen.getByText('Shared Episodes')).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Layout', () => {
    it('should have responsive grid layout for character selection', () => {
      render(
        <TestWrapper>
          <CharacterView />
        </TestWrapper>
      );

      const characterGrid = screen.getByTestId('character-list-0').closest('.grid');
      expect(characterGrid).toHaveClass('grid-cols-1', 'lg:grid-cols-2');
    });

    it('should have responsive grid layout for episodes when both characters are selected', async () => {
      render(
        <TestWrapper>
          <CharacterView />
        </TestWrapper>
      );

      // Select both characters
      fireEvent.click(screen.getByTestId('select-character-0'));
      fireEvent.click(screen.getByTestId('select-character-1'));

      await waitFor(() => {
        const episodesGrid = screen.getByTestId('shared-episodes').closest('.grid');
        expect(episodesGrid).toHaveClass('grid-cols-1', 'lg:grid-cols-3');
      });
    });

    it('should have responsive container classes', () => {
      render(
        <TestWrapper>
          <CharacterView />
        </TestWrapper>
      );

      const mainContainer = screen.getByTestId('character-list-0').closest('.min-h-screen');
      expect(mainContainer).toHaveClass('lg:h-screen', 'lg:overflow-hidden');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(
        <TestWrapper>
          <CharacterView />
        </TestWrapper>
      );

      // Check that the logo has proper alt text
      const logo = screen.getByAltText('Rick and Morty Logo');
      expect(logo).toBeInTheDocument();

      // Check that character selection panels have proper titles
      expect(screen.getByText('Select Character #1')).toBeInTheDocument();
      expect(screen.getByText('Select Character #2')).toBeInTheDocument();
    });

    it('should have proper button accessibility', () => {
      render(
        <TestWrapper>
          <CharacterView />
        </TestWrapper>
      );

      const selectButtons = screen.getAllByRole('button');
      expect(selectButtons).toHaveLength(2);
      
      selectButtons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });
  });

  describe('Animation and Visual Feedback', () => {
    it('should have fade-in animation for episodes section', async () => {
      render(
        <TestWrapper>
          <CharacterView />
        </TestWrapper>
      );

      // Select both characters
      fireEvent.click(screen.getByTestId('select-character-0'));
      fireEvent.click(screen.getByTestId('select-character-1'));

      await waitFor(() => {
        const episodesSection = screen.getByTestId('shared-episodes').closest('.animate-fade-in');
        expect(episodesSection).toBeInTheDocument();
      });
    });
  });
}); 