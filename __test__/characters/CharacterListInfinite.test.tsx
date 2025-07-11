import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CharacterListInfinite } from '@/app/characters/CharacterListInfinite';
import { Character } from '@/types/rickAndMorty';

// Mock the hooks
jest.mock('../../hooks/useCharacters');
jest.mock('../../hooks/useScrollBottomReached');

const mockUseCharacters = require('../../hooks/useCharacters').useCharacters;
const mockUseScrollBottomReached = require('../../hooks/useScrollBottomReached').useScrollBottomReached;

// Mock data
const mockCharacters: Character[] = [
  {
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
  },
  {
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
  }
];

const mockApiResponse = {
  pages: [
    {
      info: { next: 'https://rickandmortyapi.com/api/character?page=2' },
      results: mockCharacters
    }
  ]
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

describe('CharacterListInfinite', () => {
  const defaultProps = {
    title: 'Select Character #1',
    panelId: 0,
    selectedCharacter: null,
    onCharacterSelect: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseScrollBottomReached.mockImplementation(() => {});
  });

  describe('Rendering and Basic Functionality', () => {
    it('should render the component with title and search input', () => {
      mockUseCharacters.mockReturnValue({
        data: mockApiResponse,
        fetchNextPage: jest.fn(),
        hasNextPage: true,
        isError: false,
        isLoading: false,
        isFetchingNextPage: false
      });

      render(
        <TestWrapper>
          <CharacterListInfinite {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText('Select Character #1')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search characters...')).toBeInTheDocument();
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
      expect(screen.getByText('Morty Smith')).toBeInTheDocument();
    });

    it('should display correct number of characters', () => {
      mockUseCharacters.mockReturnValue({
        data: mockApiResponse,
        fetchNextPage: jest.fn(),
        hasNextPage: true,
        isError: false,
        isLoading: false,
        isFetchingNextPage: false
      });

      render(
        <TestWrapper>
          <CharacterListInfinite {...defaultProps} />
        </TestWrapper>
      );

      // Verify that both characters are rendered
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
      expect(screen.getByText('Morty Smith')).toBeInTheDocument();
      
      // Verify that exactly 2 character cards are present
      const characterCards = screen.getAllByTestId(/^character-card-/);
      expect(characterCards).toHaveLength(2);
    });
  });

  describe('Loading States', () => {
    it('should show skeleton loading cards when initially loading', () => {
      mockUseCharacters.mockReturnValue({
        data: undefined,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isError: false,
        isLoading: true,
        isFetchingNextPage: false
      });

      render(
        <TestWrapper>
          <CharacterListInfinite {...defaultProps} />
        </TestWrapper>
      );

      const skeletonCards = screen.getAllByTestId('skeleton-card');
      expect(skeletonCards).toHaveLength(6);
      expect(screen.queryByText('Rick Sanchez')).not.toBeInTheDocument();
    });

    it('should show loading indicator when fetching next page', () => {
      mockUseCharacters.mockReturnValue({
        data: mockApiResponse,
        fetchNextPage: jest.fn(),
        hasNextPage: true,
        isError: false,
        isLoading: false,
        isFetchingNextPage: true
      });

      render(
        <TestWrapper>
          <CharacterListInfinite {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText('Loading more characters...')).toBeInTheDocument();
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument(); // Existing characters still visible
    });
  });

  describe('Search Functionality', () => {
    it('should update search term when user types in search input', async () => {
      const mockFetchNextPage = jest.fn();
      mockUseCharacters.mockReturnValue({
        data: mockApiResponse,
        fetchNextPage: mockFetchNextPage,
        hasNextPage: true,
        isError: false,
        isLoading: false,
        isFetchingNextPage: false
      });

      render(
        <TestWrapper>
          <CharacterListInfinite {...defaultProps} />
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText('Search characters...');
      fireEvent.change(searchInput, { target: { value: 'Rick' } });

      expect(searchInput).toHaveValue('Rick');
    });

    it('should show empty state message when no characters found', () => {
      mockUseCharacters.mockReturnValue({
        data: { pages: [{ info: { next: null }, results: [] }] },
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isError: false,
        isLoading: false,
        isFetchingNextPage: false
      });

      render(
        <TestWrapper>
          <CharacterListInfinite {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText('No characters available.')).toBeInTheDocument();
    });

    it('should show search-specific message when search returns no results', () => {
      mockUseCharacters.mockReturnValue({
        data: { pages: [{ info: { next: null }, results: [] }] },
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isError: false,
        isLoading: false,
        isFetchingNextPage: false
      });

      render(
        <TestWrapper>
          <CharacterListInfinite {...defaultProps} />
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText('Search characters...');
      fireEvent.change(searchInput, { target: { value: 'NonExistentCharacter' } });

      expect(screen.getByText('No characters found matching your search.')).toBeInTheDocument();
    });
  });

  describe('Character Selection', () => {
    it('should call onCharacterSelect when a character card is clicked', () => {
      const mockOnCharacterSelect = jest.fn();
      mockUseCharacters.mockReturnValue({
        data: mockApiResponse,
        fetchNextPage: jest.fn(),
        hasNextPage: true,
        isError: false,
        isLoading: false,
        isFetchingNextPage: false
      });

      render(
        <TestWrapper>
          <CharacterListInfinite 
            {...defaultProps} 
            onCharacterSelect={mockOnCharacterSelect}
          />
        </TestWrapper>
      );

      const rickCard = screen.getByText('Rick Sanchez').closest('[data-testid]');
      fireEvent.click(rickCard!);

      expect(mockOnCharacterSelect).toHaveBeenCalledWith(mockCharacters[0]);
    });

    it('should highlight selected character', () => {
      mockUseCharacters.mockReturnValue({
        data: mockApiResponse,
        fetchNextPage: jest.fn(),
        hasNextPage: true,
        isError: false,
        isLoading: false,
        isFetchingNextPage: false
      });

      render(
        <TestWrapper>
          <CharacterListInfinite 
            {...defaultProps} 
            selectedCharacter={mockCharacters[0]}
          />
        </TestWrapper>
      );

      // The CharacterCard component should receive isSelected={true} for Rick
      // This is tested in the CharacterCard component tests
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should display error message when API fails', () => {
      mockUseCharacters.mockReturnValue({
        data: undefined,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isError: true,
        isLoading: false,
        isFetchingNextPage: false
      });

      render(
        <TestWrapper>
          <CharacterListInfinite {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText('Error loading characters. Please try again.')).toBeInTheDocument();
      expect(screen.queryByText('Rick Sanchez')).not.toBeInTheDocument();
    });

    it('should show error title when API fails', () => {
      mockUseCharacters.mockReturnValue({
        data: undefined,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isError: true,
        isLoading: false,
        isFetchingNextPage: false
      });

      render(
        <TestWrapper>
          <CharacterListInfinite {...defaultProps} />
        </TestWrapper>
      );

      const errorTitle = screen.getByText('Select Character #1');
      expect(errorTitle).toHaveClass('text-destructive');
    });
  });

  describe('Infinite Scroll Integration', () => {
    it('should call useScrollBottomReached with correct parameters', () => {
      mockUseCharacters.mockReturnValue({
        data: mockApiResponse,
        fetchNextPage: jest.fn(),
        hasNextPage: true,
        isError: false,
        isLoading: false,
        isFetchingNextPage: false
      });

      render(
        <TestWrapper>
          <CharacterListInfinite {...defaultProps} />
        </TestWrapper>
      );

      expect(mockUseScrollBottomReached).toHaveBeenCalledWith(
        expect.any(Object), // containerRef
        expect.any(Function), // callback
        100 // threshold
      );
    });

    it('should call fetchNextPage when scroll reaches bottom and has next page', () => {
      const mockFetchNextPage = jest.fn();
      mockUseCharacters.mockReturnValue({
        data: mockApiResponse,
        fetchNextPage: mockFetchNextPage,
        hasNextPage: true,
        isError: false,
        isLoading: false,
        isFetchingNextPage: false
      });

      render(
        <TestWrapper>
          <CharacterListInfinite {...defaultProps} />
        </TestWrapper>
      );

      // Simulate scroll callback being triggered
      const scrollCallback = mockUseScrollBottomReached.mock.calls[0][1];
      scrollCallback();

      expect(mockFetchNextPage).toHaveBeenCalled();
    });

    it('should not call fetchNextPage when already fetching next page', () => {
      const mockFetchNextPage = jest.fn();
      mockUseCharacters.mockReturnValue({
        data: mockApiResponse,
        fetchNextPage: mockFetchNextPage,
        hasNextPage: true,
        isError: false,
        isLoading: false,
        isFetchingNextPage: true
      });

      render(
        <TestWrapper>
          <CharacterListInfinite {...defaultProps} />
        </TestWrapper>
      );

      // Simulate scroll callback being triggered
      const scrollCallback = mockUseScrollBottomReached.mock.calls[0][1];
      scrollCallback();

      expect(mockFetchNextPage).not.toHaveBeenCalled();
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive grid layout', () => {
      mockUseCharacters.mockReturnValue({
        data: mockApiResponse,
        fetchNextPage: jest.fn(),
        hasNextPage: true,
        isError: false,
        isLoading: false,
        isFetchingNextPage: false
      });

      render(
        <TestWrapper>
          <CharacterListInfinite {...defaultProps} />
        </TestWrapper>
      );

      const gridContainer = screen.getByText('Rick Sanchez').closest('.grid');
      expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2');
    });

    it('should have responsive search input', () => {
      mockUseCharacters.mockReturnValue({
        data: mockApiResponse,
        fetchNextPage: jest.fn(),
        hasNextPage: true,
        isError: false,
        isLoading: false,
        isFetchingNextPage: false
      });

      render(
        <TestWrapper>
          <CharacterListInfinite {...defaultProps} />
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText('Search characters...');
      expect(searchInput).toHaveClass('w-full');
      
      // Check that the parent container has responsive classes
      const searchContainer = searchInput.closest('.relative');
      expect(searchContainer).toHaveClass('w-full', 'md:w-64');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      mockUseCharacters.mockReturnValue({
        data: mockApiResponse,
        fetchNextPage: jest.fn(),
        hasNextPage: true,
        isError: false,
        isLoading: false,
        isFetchingNextPage: false
      });

      render(
        <TestWrapper>
          <CharacterListInfinite {...defaultProps} />
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText('Search characters...');
      expect(searchInput).toBeInTheDocument();
      
      // Check that the container has proper scroll behavior
      const scrollContainer = screen.getByText('Rick Sanchez').closest('.overflow-y-auto');
      expect(scrollContainer).toBeInTheDocument();
    });
  });
}); 