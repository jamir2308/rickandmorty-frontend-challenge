import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EpisodeItem } from '@/app/episodes/EpisodeItem';
import { Episode } from '@/types/rickAndMorty';

// Mock the useEpisode hook
jest.mock('../../hooks/useEpisode');

const mockUseEpisode = require('../../hooks/useEpisode').useEpisode;

// Mock data
const mockEpisode: Episode = {
  id: 1,
  name: 'Pilot',
  air_date: 'December 2, 2013',
  episode: 'S01E01',
  characters: ['https://rickandmortyapi.com/api/character/1'],
  url: 'https://rickandmortyapi.com/api/episode/1',
  created: '2017-11-10T12:56:33.798Z'
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

describe('EpisodeItem', () => {
  const defaultProps = {
    episodeURL: 'https://rickandmortyapi.com/api/episode/1'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should show skeleton loading state when episode is loading', () => {
      mockUseEpisode.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false
      });

      render(
        <TestWrapper>
          <EpisodeItem {...defaultProps} />
        </TestWrapper>
      );

      // Check that skeleton elements are present (they have animate-pulse class)
      const skeletons = screen.getAllByText('').filter(el => 
        el.className.includes('animate-pulse')
      );
      expect(skeletons.length).toBeGreaterThan(0);
      
      // Check that episode data is not shown
      expect(screen.queryByText('Pilot')).not.toBeInTheDocument();
      expect(screen.queryByText('S01E01')).not.toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should show error state when episode fails to load', () => {
      mockUseEpisode.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true
      });

      render(
        <TestWrapper>
          <EpisodeItem {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText('Episode: 1')).toBeInTheDocument();
      expect(screen.getByText('Not found')).toBeInTheDocument();
    });

    it('should show error state when episode data is null', () => {
      mockUseEpisode.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false
      });

      render(
        <TestWrapper>
          <EpisodeItem {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText('Episode: 1')).toBeInTheDocument();
      expect(screen.getByText('Not found')).toBeInTheDocument();
    });

    it('should extract episode ID from URL correctly', () => {
      mockUseEpisode.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true
      });

      render(
        <TestWrapper>
          <EpisodeItem episodeURL="https://rickandmortyapi.com/api/episode/42" />
        </TestWrapper>
      );

      expect(screen.getByText('Episode: 42')).toBeInTheDocument();
    });

    it('should have proper error state styling', () => {
      mockUseEpisode.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true
      });

      render(
        <TestWrapper>
          <EpisodeItem {...defaultProps} />
        </TestWrapper>
      );

      const container = screen.getByText('Episode: 1').closest('.flex');
      expect(container).toHaveClass('items-center', 'justify-between', 'p-3', 'border', 'rounded');
      
      const episodeText = screen.getByText('Episode: 1');
      expect(episodeText).toHaveClass('font-medium', 'text-sm', 'text-muted-foreground');
      
      const notFoundText = screen.getByText('Not found');
      expect(notFoundText).toHaveClass('text-xs', 'text-muted-foreground');
    });
  });

  describe('Success State', () => {
    it('should display episode information when data loads successfully', () => {
      mockUseEpisode.mockReturnValue({
        data: mockEpisode,
        isLoading: false,
        isError: false
      });

      render(
        <TestWrapper>
          <EpisodeItem {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText('Pilot')).toBeInTheDocument();
      expect(screen.getByText('December 2, 2013')).toBeInTheDocument();
      expect(screen.getByText('S01E01')).toBeInTheDocument();
    });

    it('should have proper success state styling', () => {
      mockUseEpisode.mockReturnValue({
        data: mockEpisode,
        isLoading: false,
        isError: false
      });

      render(
        <TestWrapper>
          <EpisodeItem {...defaultProps} />
        </TestWrapper>
      );

      const container = screen.getByText('Pilot').closest('.flex');
      expect(container).toHaveClass(
        'items-center', 
        'justify-between', 
        'p-3', 
        'border', 
        'rounded', 
        'hover:bg-accent/50', 
        'transition-colors', 
        'animate-fade-in'
      );
    });

    it('should have proper episode name styling', () => {
      mockUseEpisode.mockReturnValue({
        data: mockEpisode,
        isLoading: false,
        isError: false
      });

      render(
        <TestWrapper>
          <EpisodeItem {...defaultProps} />
        </TestWrapper>
      );

      const episodeName = screen.getByText('Pilot');
      expect(episodeName).toHaveClass('font-medium', 'text-sm');
    });

    it('should have proper air date styling', () => {
      mockUseEpisode.mockReturnValue({
        data: mockEpisode,
        isLoading: false,
        isError: false
      });

      render(
        <TestWrapper>
          <EpisodeItem {...defaultProps} />
        </TestWrapper>
      );

      const airDate = screen.getByText('December 2, 2013');
      expect(airDate).toHaveClass('text-xs', 'text-muted-foreground');
    });

    it('should have proper episode badge styling', () => {
      mockUseEpisode.mockReturnValue({
        data: mockEpisode,
        isLoading: false,
        isError: false
      });

      render(
        <TestWrapper>
          <EpisodeItem {...defaultProps} />
        </TestWrapper>
      );

      const episodeBadge = screen.getByText('S01E01');
      expect(episodeBadge).toHaveClass(
        'inline-flex', 
        'items-center', 
        'rounded-full', 
        'bg-cyan-100', 
        'text-cyan-700', 
        'border', 
        'border-cyan-300', 
        'px-3', 
        'py-1', 
        'text-xs', 
        'font-semibold'
      );
    });
  });

  describe('Hook Integration', () => {
    it('should call useEpisode with correct episode URL', () => {
      mockUseEpisode.mockReturnValue({
        data: mockEpisode,
        isLoading: false,
        isError: false
      });

      render(
        <TestWrapper>
          <EpisodeItem episodeURL="https://rickandmortyapi.com/api/episode/42" />
        </TestWrapper>
      );

      expect(mockUseEpisode).toHaveBeenCalledWith('https://rickandmortyapi.com/api/episode/42');
    });

    it('should handle different episode URLs correctly', () => {
      mockUseEpisode.mockReturnValue({
        data: mockEpisode,
        isLoading: false,
        isError: false
      });

      const { rerender } = render(
        <TestWrapper>
          <EpisodeItem episodeURL="https://rickandmortyapi.com/api/episode/1" />
        </TestWrapper>
      );

      expect(mockUseEpisode).toHaveBeenCalledWith('https://rickandmortyapi.com/api/episode/1');

      // Clear mock calls
      mockUseEpisode.mockClear();

      // Rerender with different URL
      rerender(
        <TestWrapper>
          <EpisodeItem episodeURL="https://rickandmortyapi.com/api/episode/2" />
        </TestWrapper>
      );

      expect(mockUseEpisode).toHaveBeenCalledWith('https://rickandmortyapi.com/api/episode/2');
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      mockUseEpisode.mockReturnValue({
        data: mockEpisode,
        isLoading: false,
        isError: false
      });

      render(
        <TestWrapper>
          <EpisodeItem {...defaultProps} />
        </TestWrapper>
      );

      // Check that the container is a div with proper classes
      const container = screen.getByText('Pilot').closest('div');
      expect(container).toBeInTheDocument();
      
      // Check that episode information is properly structured
      expect(screen.getByText('Pilot')).toBeInTheDocument();
      expect(screen.getByText('December 2, 2013')).toBeInTheDocument();
      expect(screen.getByText('S01E01')).toBeInTheDocument();
    });

    it('should have proper text contrast and readability', () => {
      mockUseEpisode.mockReturnValue({
        data: mockEpisode,
        isLoading: false,
        isError: false
      });

      render(
        <TestWrapper>
          <EpisodeItem {...defaultProps} />
        </TestWrapper>
      );

      // Episode name should be prominent
      const episodeName = screen.getByText('Pilot');
      expect(episodeName).toHaveClass('font-medium');
      
      // Air date should be secondary
      const airDate = screen.getByText('December 2, 2013');
      expect(airDate).toHaveClass('text-muted-foreground');
      
      // Episode badge should be distinct
      const episodeBadge = screen.getByText('S01E01');
      expect(episodeBadge).toHaveClass('bg-cyan-100', 'text-cyan-700');
    });
  });

  describe('Edge Cases', () => {

    it('should handle very long episode names', () => {
      const longEpisodeName = 'A Very Long Episode Name That Might Cause Layout Issues And Should Be Handled Properly';
      const episodeWithLongName = {
        ...mockEpisode,
        name: longEpisodeName
      };

      mockUseEpisode.mockReturnValue({
        data: episodeWithLongName,
        isLoading: false,
        isError: false
      });

      render(
        <TestWrapper>
          <EpisodeItem {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText(longEpisodeName)).toBeInTheDocument();
    });

    it('should handle special characters in episode data', () => {
      const episodeWithSpecialChars = {
        ...mockEpisode,
        name: 'Episode with "quotes" & special chars',
        air_date: 'December 2, 2013 (Special)',
        episode: 'S01E01-EXTRA'
      };

      mockUseEpisode.mockReturnValue({
        data: episodeWithSpecialChars,
        isLoading: false,
        isError: false
      });

      render(
        <TestWrapper>
          <EpisodeItem {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText('Episode with "quotes" & special chars')).toBeInTheDocument();
      expect(screen.getByText('December 2, 2013 (Special)')).toBeInTheDocument();
      expect(screen.getByText('S01E01-EXTRA')).toBeInTheDocument();
    });
  });
}); 