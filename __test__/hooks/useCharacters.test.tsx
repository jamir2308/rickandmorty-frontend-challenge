import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCharacters, useCharacter } from '@/hooks/useCharacters';
import { getCharacter } from '@/services/rickAndMortyApi';

// Mock the API service
jest.mock('../../services/rickAndMortyApi', () => ({
  getCharacter: jest.fn(),
}));

// Mock fetch globally
global.fetch = jest.fn();

const mockGetCharacter = getCharacter as jest.MockedFunction<typeof getCharacter>;

describe('useCharacters', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
    mockGetCharacter.mockClear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe('useCharacters', () => {
    it('should fetch characters successfully with default search term', async () => {
      const mockResponse = {
        info: { 
          count: 826, 
          pages: 42, 
          next: 'https://rickandmortyapi.com/api/character?page=2', 
          prev: null 
        },
        results: [
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
          }
        ]
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse)
      });

      const { result } = renderHook(() => useCharacters(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.pages[0]).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character?page=1', expect.any(Object));
    });

    it('should fetch characters with search term', async () => {
      const mockResponse = {
        info: { count: 1, pages: 1, next: null, prev: null },
        results: [
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
          }
        ]
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse)
      });

      const { result } = renderHook(() => useCharacters('Rick'), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.pages[0]).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character?page=1&name=Rick', expect.any(Object));
    });

    it('should handle search term with special characters', async () => {
      const mockResponse = {
        info: { count: 0, pages: 0, next: null, prev: null },
        results: []
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse)
      });

      const { result } = renderHook(() => useCharacters('Rick & Morty'), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character?page=1&name=Rick%20%26%20Morty', expect.any(Object));
    });

    it('should handle API error', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      const { result } = renderHook(() => useCharacters(), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Failed to fetch characters');
    });

    it('should handle network error', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useCharacters(), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Network error');
    });

    it('should handle empty search term', async () => {
      const mockResponse = {
        info: { count: 826, pages: 42, next: 'https://rickandmortyapi.com/api/character?page=2', prev: null },
        results: []
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse)
      });

      const { result } = renderHook(() => useCharacters(''), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character?page=1', expect.any(Object));
    });

    it('should handle loading state', () => {
      (fetch as jest.Mock).mockImplementation(() => new Promise(() => {})); // Never resolves

      const { result } = renderHook(() => useCharacters(), { wrapper });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    it('should handle pagination correctly', async () => {
      const page1Response = {
        info: { 
          count: 826, 
          pages: 42, 
          next: 'https://rickandmortyapi.com/api/character?page=2', 
          prev: null 
        },
        results: [{ id: 1, name: 'Rick Sanchez' }]
      };

      const page2Response = {
        info: { 
          count: 826, 
          pages: 42, 
          next: 'https://rickandmortyapi.com/api/character?page=3', 
          prev: 'https://rickandmortyapi.com/api/character?page=1' 
        },
        results: [{ id: 2, name: 'Morty Smith' }]
      };

      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValueOnce(page1Response)
        })
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValueOnce(page2Response)
        });

      const { result } = renderHook(() => useCharacters(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.pages[0]).toEqual(page1Response);

      // Fetch next page
      await result.current.fetchNextPage();

      await waitFor(() => {
        expect(result.current.data?.pages).toHaveLength(2);
      });

      expect(result.current.data?.pages[1]).toEqual(page2Response);
    });

    it('should handle last page correctly', async () => {
      const lastPageResponse = {
        info: { 
          count: 826, 
          pages: 42, 
          next: null, 
          prev: 'https://rickandmortyapi.com/api/character?page=41' 
        },
        results: [{ id: 826, name: 'Last Character' }]
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(lastPageResponse)
      });

      const { result } = renderHook(() => useCharacters(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.hasNextPage).toBe(false);
      expect(result.current.isFetchingNextPage).toBe(false);
    });
  });

  describe('useCharacter', () => {
    it('should fetch character successfully when ID is provided', async () => {
      const mockCharacter = {
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

      mockGetCharacter.mockResolvedValueOnce(mockCharacter);

      const { result } = renderHook(() => useCharacter(1), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCharacter);
      expect(mockGetCharacter).toHaveBeenCalledWith(1);
    });

    it('should not fetch when ID is null', () => {
      const { result } = renderHook(() => useCharacter(null), { wrapper });

      expect(result.current.isLoading).toBe(false);
      expect(mockGetCharacter).not.toHaveBeenCalled();
    });

    it('should not fetch when ID is 0', () => {
      const { result } = renderHook(() => useCharacter(0), { wrapper });

      expect(result.current.isLoading).toBe(false);
      expect(mockGetCharacter).not.toHaveBeenCalled();
    });

    it('should handle API error when fetching character', async () => {
      mockGetCharacter.mockRejectedValueOnce(new Error('Failed to fetch character'));

      const { result } = renderHook(() => useCharacter(1), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Failed to fetch character');
    });

    it('should handle loading state when fetching character', () => {
      mockGetCharacter.mockImplementation(() => new Promise(() => {})); // Never resolves

      const { result } = renderHook(() => useCharacter(1), { wrapper });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    it('should refetch when ID changes', async () => {
      const mockCharacter1 = { id: 1, name: 'Rick Sanchez' };
      const mockCharacter2 = { id: 2, name: 'Morty Smith' };

      mockGetCharacter
        .mockResolvedValueOnce(mockCharacter1)
        .mockResolvedValueOnce(mockCharacter2);

      const { result, rerender } = renderHook(({ id }) => useCharacter(id), { 
        wrapper,
        initialProps: { id: 1 as number | null }
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCharacter1);

      // Change ID
      rerender({ id: 2 });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockCharacter2);
      });

      expect(mockGetCharacter).toHaveBeenCalledTimes(2);
      expect(mockGetCharacter).toHaveBeenCalledWith(1);
      expect(mockGetCharacter).toHaveBeenCalledWith(2);
    });
  });

  describe('Query Configuration', () => {
    it('should handle different search terms correctly', () => {
      const { result: result1 } = renderHook(() => useCharacters('Rick'), { wrapper });
      const { result: result2 } = renderHook(() => useCharacters('Morty'), { wrapper });

      expect(result1.current.isLoading).toBe(true);
      expect(result2.current.isLoading).toBe(true);
    });

    it('should handle different character IDs correctly', () => {
      const { result: result1 } = renderHook(() => useCharacter(1), { wrapper });
      const { result: result2 } = renderHook(() => useCharacter(2), { wrapper });

      expect(result1.current.isLoading).toBe(true);
      expect(result2.current.isLoading).toBe(true);
    });
  });
}); 