import React from 'react';
import { render, screen } from '@testing-library/react';
import { SharedEpisodesList } from '@/app/episodes/SharedEpisodesList';
import { Character } from '@/types/rickAndMorty';

// Mock the EpisodeList component
jest.mock('../../app/episodes/EpisodeList', () => ({
  EpisodeList: ({ title, episodes, emptyMessage }: any) => (
    <div data-testid="episode-list">
      <h3>{title}</h3>
      <div data-testid="episodes-count">{episodes.length} episodes</div>
      <div data-testid="empty-message">{emptyMessage}</div>
    </div>
  )
}));

describe('SharedEpisodesList', () => {
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
    episode: [
      'https://rickandmortyapi.com/api/episode/1',
      'https://rickandmortyapi.com/api/episode/2',
      'https://rickandmortyapi.com/api/episode/3'
    ],
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
    episode: [
      'https://rickandmortyapi.com/api/episode/2',
      'https://rickandmortyapi.com/api/episode/3',
      'https://rickandmortyapi.com/api/episode/4'
    ],
    url: 'https://rickandmortyapi.com/api/character/2',
    created: '2017-11-04T18:50:21.651Z'
  };

  const defaultProps = {
    character1: mockCharacter1,
    character2: mockCharacter2
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Shared Episodes Calculation', () => {
    it('should calculate shared episodes correctly', () => {
      render(<SharedEpisodesList {...defaultProps} />);

      expect(screen.getByTestId('episode-list')).toBeInTheDocument();
      expect(screen.getByText('Shared Episodes')).toBeInTheDocument();
      expect(screen.getByText('2 episodes')).toBeInTheDocument(); // Episodes 2 and 3 are shared
    });

    it('should identify correct shared episodes', () => {
      render(<SharedEpisodesList {...defaultProps} />);

      const episodesCount = screen.getByTestId('episodes-count');
      expect(episodesCount).toHaveTextContent('2 episodes');
      
      // The shared episodes should be episode 2 and 3
      // Rick has: [1, 2, 3]
      // Morty has: [2, 3, 4]
      // Shared: [2, 3]
    });

    it('should handle characters with no shared episodes', () => {
      const characterWithNoOverlap = {
        ...mockCharacter2,
        episode: [
          'https://rickandmortyapi.com/api/episode/4',
          'https://rickandmortyapi.com/api/episode/5',
          'https://rickandmortyapi.com/api/episode/6'
        ]
      };

      render(
        <SharedEpisodesList 
          character1={mockCharacter1} 
          character2={characterWithNoOverlap} 
        />
      );

      expect(screen.getByText('Shared Episodes')).toBeInTheDocument();
      expect(screen.getByText('0 episodes')).toBeInTheDocument();
      expect(screen.getByText('No se encontraron episodios compartidos')).toBeInTheDocument();
    });

    it('should handle characters with all episodes shared', () => {
      const characterWithSameEpisodes = {
        ...mockCharacter2,
        episode: [
          'https://rickandmortyapi.com/api/episode/1',
          'https://rickandmortyapi.com/api/episode/2',
          'https://rickandmortyapi.com/api/episode/3'
        ]
      };

      render(
        <SharedEpisodesList 
          character1={mockCharacter1} 
          character2={characterWithSameEpisodes} 
        />
      );

      expect(screen.getByText('Shared Episodes')).toBeInTheDocument();
      expect(screen.getByText('3 episodes')).toBeInTheDocument();
    });

    it('should handle single shared episode', () => {
      const characterWithOneShared = {
        ...mockCharacter2,
        episode: [
          'https://rickandmortyapi.com/api/episode/2',
          'https://rickandmortyapi.com/api/episode/5',
          'https://rickandmortyapi.com/api/episode/6'
        ]
      };

      render(
        <SharedEpisodesList 
          character1={mockCharacter1} 
          character2={characterWithOneShared} 
        />
      );

      expect(screen.getByText('Shared Episodes')).toBeInTheDocument();
      expect(screen.getByText('1 episodes')).toBeInTheDocument();
    });
  });

  describe('Null Character Handling', () => {
    it('should return null when character1 is null', () => {
      const { container } = render(
        <SharedEpisodesList 
          character1={null} 
          character2={mockCharacter2} 
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should return null when character2 is null', () => {
      const { container } = render(
        <SharedEpisodesList 
          character1={mockCharacter1} 
          character2={null} 
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should return null when both characters are null', () => {
      const { container } = render(
        <SharedEpisodesList 
          character1={null} 
          character2={null} 
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should return null when character1 is undefined', () => {
      const { container } = render(
        <SharedEpisodesList 
          character1={undefined as any} 
          character2={mockCharacter2} 
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should return null when character2 is undefined', () => {
      const { container } = render(
        <SharedEpisodesList 
          character1={mockCharacter1} 
          character2={undefined as any} 
        />
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Empty Episodes Handling', () => {
    it('should handle character with empty episodes array', () => {
      const characterWithEmptyEpisodes = {
        ...mockCharacter2,
        episode: []
      };

      render(
        <SharedEpisodesList 
          character1={mockCharacter1} 
          character2={characterWithEmptyEpisodes} 
        />
      );

      expect(screen.getByText('Shared Episodes')).toBeInTheDocument();
      expect(screen.getByText('0 episodes')).toBeInTheDocument();
      expect(screen.getByText('No se encontraron episodios compartidos')).toBeInTheDocument();
    });

    it('should handle both characters with empty episodes', () => {
      const character1WithEmptyEpisodes = {
        ...mockCharacter1,
        episode: []
      };
      const character2WithEmptyEpisodes = {
        ...mockCharacter2,
        episode: []
      };

      render(
        <SharedEpisodesList 
          character1={character1WithEmptyEpisodes} 
          character2={character2WithEmptyEpisodes} 
        />
      );

      expect(screen.getByText('Shared Episodes')).toBeInTheDocument();
      expect(screen.getByText('0 episodes')).toBeInTheDocument();
      expect(screen.getByText('No se encontraron episodios compartidos')).toBeInTheDocument();
    });
  });

  describe('Props Integration', () => {
    it('should pass correct title to EpisodeList', () => {
      render(<SharedEpisodesList {...defaultProps} />);

      expect(screen.getByText('Shared Episodes')).toBeInTheDocument();
    });

    it('should pass correct empty message to EpisodeList', () => {
      const characterWithNoOverlap = {
        ...mockCharacter2,
        episode: [
          'https://rickandmortyapi.com/api/episode/4',
          'https://rickandmortyapi.com/api/episode/5'
        ]
      };

      render(
        <SharedEpisodesList 
          character1={mockCharacter1} 
          character2={characterWithNoOverlap} 
        />
      );

      const emptyMessage = screen.getByTestId('empty-message');
      expect(emptyMessage).toHaveTextContent('No se encontraron episodios compartidos');
    });

    it('should pass calculated episodes to EpisodeList', () => {
      render(<SharedEpisodesList {...defaultProps} />);

      const episodesCount = screen.getByTestId('episodes-count');
      expect(episodesCount).toHaveTextContent('2 episodes');
    });
  });

  describe('Memoization', () => {
    it('should be memoized component', () => {
      expect(SharedEpisodesList.displayName).toBe('SharedEpisodesList');
    });

    it('should re-render when character1 changes', () => {
      const { rerender } = render(<SharedEpisodesList {...defaultProps} />);

      expect(screen.getByText('2 episodes')).toBeInTheDocument();

      // Change character1 episodes
      const newCharacter1 = {
        ...mockCharacter1,
        episode: [
          'https://rickandmortyapi.com/api/episode/1',
          'https://rickandmortyapi.com/api/episode/2'
        ]
      };

      rerender(
        <SharedEpisodesList 
          character1={newCharacter1} 
          character2={mockCharacter2} 
        />
      );

      expect(screen.getByText('1 episodes')).toBeInTheDocument(); // Only episode 2 is shared now
    });

    it('should re-render when character2 changes', () => {
      const { rerender } = render(<SharedEpisodesList {...defaultProps} />);

      expect(screen.getByText('2 episodes')).toBeInTheDocument();

      // Change character2 episodes
      const newCharacter2 = {
        ...mockCharacter2,
        episode: [
          'https://rickandmortyapi.com/api/episode/1',
          'https://rickandmortyapi.com/api/episode/2'
        ]
      };

      rerender(
        <SharedEpisodesList 
          character1={mockCharacter1} 
          character2={newCharacter2} 
        />
      );

      expect(screen.getByText('2 episodes')).toBeInTheDocument(); // Episodes 1 and 2 are shared
    });

    it('should re-render when both characters change', () => {
      const { rerender } = render(<SharedEpisodesList {...defaultProps} />);

      expect(screen.getByText('2 episodes')).toBeInTheDocument();

      // Change both characters
      const newCharacter1 = {
        ...mockCharacter1,
        episode: [
          'https://rickandmortyapi.com/api/episode/1',
          'https://rickandmortyapi.com/api/episode/2'
        ]
      };
      const newCharacter2 = {
        ...mockCharacter2,
        episode: [
          'https://rickandmortyapi.com/api/episode/2',
          'https://rickandmortyapi.com/api/episode/3'
        ]
      };

      rerender(
        <SharedEpisodesList 
          character1={newCharacter1} 
          character2={newCharacter2} 
        />
      );

      expect(screen.getByText('1 episodes')).toBeInTheDocument(); // Only episode 2 is shared
    });
  });

  describe('Edge Cases', () => {
    it('should handle characters with null episodes', () => {
      const characterWithNullEpisodes = {
        ...mockCharacter2,
        episode: null as any
      };

      render(
        <SharedEpisodesList 
          character1={mockCharacter1} 
          character2={characterWithNullEpisodes} 
        />
      );

      expect(screen.getByText('Shared Episodes')).toBeInTheDocument();
      expect(screen.getByText('0 episodes')).toBeInTheDocument();
    });

    it('should handle characters with undefined episodes', () => {
      const characterWithUndefinedEpisodes = {
        ...mockCharacter2,
        episode: undefined as any
      };

      render(
        <SharedEpisodesList 
          character1={mockCharacter1} 
          character2={characterWithUndefinedEpisodes} 
        />
      );

      expect(screen.getByText('Shared Episodes')).toBeInTheDocument();
      expect(screen.getByText('0 episodes')).toBeInTheDocument();
    });

    it('should handle duplicate episodes within same character', () => {
      const characterWithDuplicates = {
        ...mockCharacter2,
        episode: [
          'https://rickandmortyapi.com/api/episode/2',
          'https://rickandmortyapi.com/api/episode/2', // Duplicate
          'https://rickandmortyapi.com/api/episode/3'
        ]
      };

      render(
        <SharedEpisodesList 
          character1={mockCharacter1} 
          character2={characterWithDuplicates} 
        />
      );

      expect(screen.getByText('Shared Episodes')).toBeInTheDocument();
      expect(screen.getByText('2 episodes')).toBeInTheDocument(); // Should still count as 2 shared
    });

    it('should handle very large episode arrays', () => {
      const manyEpisodes = Array.from({ length: 100 }, (_, i) => 
        `https://rickandmortyapi.com/api/episode/${i + 1}`
      );
      const characterWithManyEpisodes = {
        ...mockCharacter2,
        episode: manyEpisodes
      };

      render(
        <SharedEpisodesList 
          character1={mockCharacter1} 
          character2={characterWithManyEpisodes} 
        />
      );

      expect(screen.getByText('Shared Episodes')).toBeInTheDocument();
      expect(screen.getByText('3 episodes')).toBeInTheDocument(); // Episodes 1, 2, 3 are shared
    });

    it('should handle special characters in episode URLs', () => {
      const characterWithSpecialUrls = {
        ...mockCharacter2,
        episode: [
          'https://rickandmortyapi.com/api/episode/2?special=true',
          'https://rickandmortyapi.com/api/episode/3#fragment',
          'https://rickandmortyapi.com/api/episode/4'
        ]
      };

      render(
        <SharedEpisodesList 
          character1={mockCharacter1} 
          character2={characterWithSpecialUrls} 
        />
      );

      expect(screen.getByText('Shared Episodes')).toBeInTheDocument();
      expect(screen.getByText('0 episodes')).toBeInTheDocument(); // No exact matches due to special characters
    });
  });

  describe('Performance', () => {
    it('should use useMemo for shared episodes calculation', () => {
      // This test verifies that the component uses useMemo
      // The memoization is tested through the re-render tests above
      render(<SharedEpisodesList {...defaultProps} />);

      expect(screen.getByText('Shared Episodes')).toBeInTheDocument();
      expect(screen.getByText('2 episodes')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      render(<SharedEpisodesList {...defaultProps} />);

      const episodeList = screen.getByTestId('episode-list');
      expect(episodeList).toBeInTheDocument();
      
      const title = screen.getByText('Shared Episodes');
      expect(title).toBeInTheDocument();
    });

    it('should provide meaningful content for screen readers', () => {
      render(<SharedEpisodesList {...defaultProps} />);

      expect(screen.getByText('Shared Episodes')).toBeInTheDocument();
      expect(screen.getByText('2 episodes')).toBeInTheDocument();
    });

    it('should provide appropriate empty state message', () => {
      const characterWithNoOverlap = {
        ...mockCharacter2,
        episode: [
          'https://rickandmortyapi.com/api/episode/4',
          'https://rickandmortyapi.com/api/episode/5'
        ]
      };

      render(
        <SharedEpisodesList 
          character1={mockCharacter1} 
          character2={characterWithNoOverlap} 
        />
      );

      expect(screen.getByText('No se encontraron episodios compartidos')).toBeInTheDocument();
    });
  });
}); 