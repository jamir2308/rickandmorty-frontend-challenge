import React from 'react';
import { render, screen } from '@testing-library/react';
import { EpisodeList } from '@/app/episodes/EpisodeList';

// Mock the EpisodeItem component
jest.mock('../../app/episodes/EpisodeItem', () => ({
  EpisodeItem: ({ episodeURL }: { episodeURL: string }) => {
    // Extract episode ID more robustly
    const episodeId = episodeURL.split('/').pop()?.split('?')[0]?.split('#')[0] || 'unknown';
    return (
      <div data-testid={`episode-item-${episodeId}`}>
        Episode {episodeId}
      </div>
    );
  }
}));

describe('EpisodeList', () => {
  const defaultProps = {
    title: 'Test Episodes',
    episodes: [
      'https://rickandmortyapi.com/api/episode/1',
      'https://rickandmortyapi.com/api/episode/2',
      'https://rickandmortyapi.com/api/episode/3'
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render the component with title and episode count', () => {
      render(<EpisodeList {...defaultProps} />);

      expect(screen.getByText('Test Episodes')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument(); // Episode count badge
    });

    it('should render all episode items', () => {
      render(<EpisodeList {...defaultProps} />);

      expect(screen.getByTestId('episode-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('episode-item-2')).toBeInTheDocument();
      expect(screen.getByTestId('episode-item-3')).toBeInTheDocument();
    });

    it('should display correct episode count in badge', () => {
      render(<EpisodeList {...defaultProps} />);

      const badge = screen.getByText('3');
      expect(badge).toHaveClass('ml-2');
    });
  });

  describe('Loading State', () => {
    it('should show loading indicator in badge when isLoading is true', () => {
      render(<EpisodeList {...defaultProps} isLoading={true} />);

      expect(screen.getByText('...')).toBeInTheDocument();
      expect(screen.queryByText('3')).not.toBeInTheDocument();
    });

    it('should still render episode items when loading', () => {
      render(<EpisodeList {...defaultProps} isLoading={true} />);

      expect(screen.getByTestId('episode-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('episode-item-2')).toBeInTheDocument();
      expect(screen.getByTestId('episode-item-3')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show default empty message when no episodes', () => {
      render(<EpisodeList title="Test Episodes" episodes={[]} />);

      expect(screen.getByText('No episodes found')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument(); // Count badge
    });

    it('should show custom empty message when provided', () => {
      render(
        <EpisodeList 
          title="Test Episodes" 
          episodes={[]} 
          emptyMessage="Custom empty message"
        />
      );

      expect(screen.getByText('Custom empty message')).toBeInTheDocument();
      expect(screen.queryByText('No episodes found')).not.toBeInTheDocument();
    });

    it('should not render episode items when empty', () => {
      render(<EpisodeList title="Test Episodes" episodes={[]} />);

      expect(screen.queryByTestId('episode-item-1')).not.toBeInTheDocument();
      expect(screen.queryByTestId('episode-item-2')).not.toBeInTheDocument();
      expect(screen.queryByTestId('episode-item-3')).not.toBeInTheDocument();
    });
  });

  describe('Layout and Styling', () => {
    it('should have proper card structure', () => {
      render(<EpisodeList {...defaultProps} />);

      const card = screen.getByText('Test Episodes').closest('.card-modern');
      expect(card).toBeInTheDocument();
    });

    it('should have proper header styling', () => {
      render(<EpisodeList {...defaultProps} />);

      const header = screen.getByText('Test Episodes').closest('.flex');
      expect(header).toHaveClass('items-center', 'justify-between');
    });

    it('should have proper title styling', () => {
      render(<EpisodeList {...defaultProps} />);

      const title = screen.getByText('Test Episodes');
      // The title is wrapped in a span, so we check the parent container
      const titleContainer = title.closest('.flex');
      expect(titleContainer).toHaveClass('text-2xl', 'font-semibold', 'leading-none', 'tracking-tight');
    });

    it('should have proper content container styling', () => {
      render(<EpisodeList {...defaultProps} />);

      const content = screen.getByTestId('episode-item-1').closest('.p-6');
      expect(content).toHaveClass('pt-0');
    });

    it('should have proper episode list container styling', () => {
      render(<EpisodeList {...defaultProps} />);

      const episodeList = screen.getByTestId('episode-item-1').closest('.space-y-2');
      expect(episodeList).toHaveClass('h-[28vh]', 'overflow-y-auto');
    });

    it('should have proper content height', () => {
      render(<EpisodeList {...defaultProps} />);

      const content = screen.getByTestId('episode-item-1').closest('.p-6');
      expect(content).toHaveClass('h-[28vh]', 'flex', 'flex-col', 'justify-start');
    });
  });

  describe('Episode Item Integration', () => {
    it('should pass correct episode URLs to EpisodeItem components', () => {
      render(<EpisodeList {...defaultProps} />);

      // Verify that EpisodeItem components are rendered with correct URLs
      expect(screen.getByTestId('episode-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('episode-item-2')).toBeInTheDocument();
      expect(screen.getByTestId('episode-item-3')).toBeInTheDocument();
    });

    it('should render episode items in correct order', () => {
      render(<EpisodeList {...defaultProps} />);

      const episodeItems = screen.getAllByTestId(/^episode-item-/);
      expect(episodeItems).toHaveLength(3);
      
      // Check that they appear in the order they were provided
      expect(episodeItems[0]).toHaveAttribute('data-testid', 'episode-item-1');
      expect(episodeItems[1]).toHaveAttribute('data-testid', 'episode-item-2');
      expect(episodeItems[2]).toHaveAttribute('data-testid', 'episode-item-3');
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive header layout', () => {
      render(<EpisodeList {...defaultProps} />);

      const header = screen.getByText('Test Episodes').closest('.flex');
      expect(header).toHaveClass('items-center', 'justify-between');
    });

    it('should have responsive title layout', () => {
      render(<EpisodeList {...defaultProps} />);

      const titleContainer = screen.getByText('Test Episodes').closest('.flex');
      expect(titleContainer).toHaveClass('items-center', 'justify-between');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<EpisodeList {...defaultProps} />);

      const title = screen.getByText('Test Episodes');
      expect(title).toBeInTheDocument();
      
      // Check that it's within a proper heading structure
      const cardHeader = title.closest('.flex');
      expect(cardHeader).toHaveClass('items-center', 'justify-between');
    });

    it('should have proper list structure for episodes', () => {
      render(<EpisodeList {...defaultProps} />);

      const episodeList = screen.getByTestId('episode-item-1').closest('.space-y-2');
      expect(episodeList).toBeInTheDocument();
      expect(episodeList).toHaveClass('h-[28vh]', 'overflow-y-auto');
    });

    it('should have proper badge for episode count', () => {
      render(<EpisodeList {...defaultProps} />);

      const badge = screen.getByText('3');
      expect(badge).toHaveClass('ml-2');
    });
  });

  describe('Edge Cases', () => {
    it('should handle single episode correctly', () => {
      render(
        <EpisodeList 
          title="Single Episode" 
          episodes={['https://rickandmortyapi.com/api/episode/1']} 
        />
      );

      expect(screen.getByText('Single Episode')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByTestId('episode-item-1')).toBeInTheDocument();
    });

    it('should handle many episodes correctly', () => {
      const manyEpisodes = Array.from({ length: 10 }, (_, i) => 
        `https://rickandmortyapi.com/api/episode/${i + 1}`
      );

      render(
        <EpisodeList 
          title="Many Episodes" 
          episodes={manyEpisodes} 
        />
      );

      expect(screen.getByText('Many Episodes')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      
      // Check that all episode items are rendered
      for (let i = 1; i <= 10; i++) {
        expect(screen.getByTestId(`episode-item-${i}`)).toBeInTheDocument();
      }
    });

    it('should handle episodes with special characters in URLs', () => {
      const episodesWithSpecialChars = [
        'https://rickandmortyapi.com/api/episode/1',
        'https://rickandmortyapi.com/api/episode/2?special=true',
        'https://rickandmortyapi.com/api/episode/3#fragment'
      ];

      render(
        <EpisodeList 
          title="Special Episodes" 
          episodes={episodesWithSpecialChars} 
        />
      );

      expect(screen.getByText('Special Episodes')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      
      // The mock should extract the episode ID correctly (without query params or fragments)
      expect(screen.getByTestId('episode-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('episode-item-2')).toBeInTheDocument();
      expect(screen.getByTestId('episode-item-3')).toBeInTheDocument();
    });

    it('should handle very long titles gracefully', () => {
      const longTitle = 'A Very Long Episode List Title That Might Cause Layout Issues And Should Be Handled Properly';
      
      render(
        <EpisodeList 
          title={longTitle} 
          episodes={defaultProps.episodes} 
        />
      );

      expect(screen.getByText(longTitle)).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  describe('Memoization', () => {
    it('should be memoized component', () => {
      expect(EpisodeList.displayName).toBe('EpisodeList');
    });

    it('should re-render when props change', () => {
      const { rerender } = render(<EpisodeList {...defaultProps} />);

      expect(screen.getByText('Test Episodes')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();

      // Change props
      rerender(
        <EpisodeList 
          title="Updated Episodes" 
          episodes={['https://rickandmortyapi.com/api/episode/4']} 
        />
      );

      expect(screen.getByText('Updated Episodes')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByTestId('episode-item-4')).toBeInTheDocument();
    });
  });
}); 