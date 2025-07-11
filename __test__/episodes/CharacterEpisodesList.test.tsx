import React from 'react';
import { render, screen } from '@testing-library/react';
import { CharacterEpisodesList } from '@/app/episodes/CharacterEpisodesList';
import { Character } from '@/types/rickAndMorty';

// Mock the EpisodeList component
jest.mock('../../app/episodes/EpisodeList', () => ({
  EpisodeList: ({ title, episodes, emptyMessage }: any) => (
    <div data-testid="episode-list">
      <h3>{title}</h3>
      <div data-testid="episodes-count">{(episodes || []).length} episodes</div>
      <div data-testid="empty-message">{emptyMessage}</div>
    </div>
  )
}));

describe('CharacterEpisodesList', () => {
  const mockCharacter: Character = {
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

  const defaultProps = {
    character: mockCharacter,
    title: "Rick's Episodes"
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Character with Episodes', () => {
    it('should render EpisodeList with character episodes', () => {
      render(<CharacterEpisodesList {...defaultProps} />);

      expect(screen.getByTestId('episode-list')).toBeInTheDocument();
      expect(screen.getByText("Rick's Episodes")).toBeInTheDocument();
      expect(screen.getByText('3 episodes')).toBeInTheDocument();
    });

    it('should pass correct episodes to EpisodeList', () => {
      render(<CharacterEpisodesList {...defaultProps} />);

      const episodesCount = screen.getByTestId('episodes-count');
      expect(episodesCount).toHaveTextContent('3 episodes');
    });

    it('should pass correct title to EpisodeList', () => {
      render(<CharacterEpisodesList {...defaultProps} />);

      expect(screen.getByText("Rick's Episodes")).toBeInTheDocument();
    });

    it('should pass correct empty message to EpisodeList', () => {
      render(<CharacterEpisodesList {...defaultProps} />);

      const emptyMessage = screen.getByTestId('empty-message');
      expect(emptyMessage).toHaveTextContent('Rick Sanchez no tiene episodios únicos');
    });

    it('should handle character with single episode', () => {
      const characterWithOneEpisode = {
        ...mockCharacter,
        episode: ['https://rickandmortyapi.com/api/episode/1']
      };

      render(
        <CharacterEpisodesList 
          character={characterWithOneEpisode} 
          title="Single Episode"
        />
      );

      expect(screen.getByText('Single Episode')).toBeInTheDocument();
      expect(screen.getByText('1 episodes')).toBeInTheDocument();
    });

    it('should handle character with many episodes', () => {
      const characterWithManyEpisodes = {
        ...mockCharacter,
        episode: Array.from({ length: 10 }, (_, i) => 
          `https://rickandmortyapi.com/api/episode/${i + 1}`
        )
      };

      render(
        <CharacterEpisodesList 
          character={characterWithManyEpisodes} 
          title="Many Episodes"
        />
      );

      expect(screen.getByText('Many Episodes')).toBeInTheDocument();
      expect(screen.getByText('10 episodes')).toBeInTheDocument();
    });
  });

  describe('Character without Episodes', () => {
    it('should handle character with empty episodes array', () => {
      const characterWithoutEpisodes = {
        ...mockCharacter,
        episode: []
      };

      render(
        <CharacterEpisodesList 
          character={characterWithoutEpisodes} 
          title="No Episodes"
        />
      );

      expect(screen.getByText('No Episodes')).toBeInTheDocument();
      expect(screen.getByText('0 episodes')).toBeInTheDocument();
      expect(screen.getByText('Rick Sanchez no tiene episodios únicos')).toBeInTheDocument();
    });
  });

  describe('Null Character Handling', () => {
    it('should return null when character is null', () => {
      const { container } = render(
        <CharacterEpisodesList 
          character={null} 
          title="Null Character"
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should return null when character is undefined', () => {
      const { container } = render(
        <CharacterEpisodesList 
          character={undefined as any} 
          title="Undefined Character"
        />
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Dynamic Title and Empty Message', () => {
    it('should use character name in empty message', () => {
      const differentCharacter = {
        ...mockCharacter,
        name: 'Morty Smith',
        episode: []
      };

      render(
        <CharacterEpisodesList 
          character={differentCharacter} 
          title="Morty's Episodes"
        />
      );

      expect(screen.getByText("Morty's Episodes")).toBeInTheDocument();
      expect(screen.getByText('Morty Smith no tiene episodios únicos')).toBeInTheDocument();
    });

    it('should handle character with special characters in name', () => {
      const characterWithSpecialName = {
        ...mockCharacter,
        name: 'Rick "The Scientist" Sanchez',
        episode: []
      };

      render(
        <CharacterEpisodesList 
          character={characterWithSpecialName} 
          title="Special Name"
        />
      );

      expect(screen.getByText('Special Name')).toBeInTheDocument();
      expect(screen.getByText('Rick "The Scientist" Sanchez no tiene episodios únicos')).toBeInTheDocument();
    });

    it('should handle very long character names', () => {
      const characterWithLongName = {
        ...mockCharacter,
        name: 'A Very Long Character Name That Might Cause Layout Issues And Should Be Handled Properly',
        episode: []
      };

      render(
        <CharacterEpisodesList 
          character={characterWithLongName} 
          title="Long Name"
        />
      );

      expect(screen.getByText('Long Name')).toBeInTheDocument();
      expect(screen.getByText('A Very Long Character Name That Might Cause Layout Issues And Should Be Handled Properly no tiene episodios únicos')).toBeInTheDocument();
    });
  });

  describe('Props Integration', () => {
    it('should pass all required props to EpisodeList', () => {
      render(<CharacterEpisodesList {...defaultProps} />);

      // Verify that EpisodeList is rendered with all required props
      expect(screen.getByTestId('episode-list')).toBeInTheDocument();
      expect(screen.getByText("Rick's Episodes")).toBeInTheDocument();
      expect(screen.getByText('3 episodes')).toBeInTheDocument();
      expect(screen.getByText('Rick Sanchez no tiene episodios únicos')).toBeInTheDocument();
    });

    it('should handle different title props', () => {
      render(
        <CharacterEpisodesList 
          character={mockCharacter} 
          title="Custom Title"
        />
      );

      expect(screen.getByText('Custom Title')).toBeInTheDocument();
    });

    it('should handle empty title', () => {
      render(
        <CharacterEpisodesList 
          character={mockCharacter} 
          title=""
        />
      );

      const titleElement = screen.getByTestId('episode-list').querySelector('h3');
      expect(titleElement).toHaveTextContent('');
    });
  });

  describe('Memoization', () => {

    it('should re-render when character changes', () => {
      const { rerender } = render(<CharacterEpisodesList {...defaultProps} />);

      expect(screen.getByText("Rick's Episodes")).toBeInTheDocument();
      expect(screen.getByText('3 episodes')).toBeInTheDocument();

      // Change character
      const newCharacter = {
        ...mockCharacter,
        name: 'Morty Smith',
        episode: ['https://rickandmortyapi.com/api/episode/4']
      };

      rerender(
        <CharacterEpisodesList 
          character={newCharacter} 
          title="Morty's Episodes"
        />
      );

      expect(screen.getByText("Morty's Episodes")).toBeInTheDocument();
      expect(screen.getByText('1 episodes')).toBeInTheDocument();
      expect(screen.getByText('Morty Smith no tiene episodios únicos')).toBeInTheDocument();
    });

    it('should re-render when title changes', () => {
      const { rerender } = render(<CharacterEpisodesList {...defaultProps} />);

      expect(screen.getByText("Rick's Episodes")).toBeInTheDocument();

      rerender(
        <CharacterEpisodesList 
          character={mockCharacter} 
          title="Updated Title"
        />
      );

      expect(screen.getByText('Updated Title')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle character with null episodes', () => {
      const characterWithNullEpisodes = {
        ...mockCharacter,
        episode: null as any
      };

      render(
        <CharacterEpisodesList 
          character={characterWithNullEpisodes} 
          title="Null Episodes"
        />
      );

      expect(screen.getByText('Null Episodes')).toBeInTheDocument();
      expect(screen.getByText('0 episodes')).toBeInTheDocument();
    });

    it('should handle character with undefined episodes', () => {
      const characterWithUndefinedEpisodes = {
        ...mockCharacter,
        episode: undefined as any
      };

      render(
        <CharacterEpisodesList 
          character={characterWithUndefinedEpisodes} 
          title="Undefined Episodes"
        />
      );

      expect(screen.getByText('Undefined Episodes')).toBeInTheDocument();
      expect(screen.getByText('0 episodes')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      render(<CharacterEpisodesList {...defaultProps} />);

      const episodeList = screen.getByTestId('episode-list');
      expect(episodeList).toBeInTheDocument();
      
      const title = screen.getByText("Rick's Episodes");
      expect(title).toBeInTheDocument();
    });

    it('should provide meaningful content for screen readers', () => {
      render(<CharacterEpisodesList {...defaultProps} />);

      expect(screen.getByText("Rick's Episodes")).toBeInTheDocument();
      expect(screen.getByText('3 episodes')).toBeInTheDocument();
    });
  });
}); 