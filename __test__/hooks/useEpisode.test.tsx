import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEpisode } from '@/hooks/useEpisode';

// Mock fetch globally
global.fetch = jest.fn();

describe('useEpisode', () => {
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
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe('Episode Fetching', () => {
    it('should fetch episode successfully', async () => {
      const mockEpisode = {
        id: 1,
        name: 'Pilot',
        air_date: 'December 2, 2013',
        episode: 'S01E01',
        characters: [
          'https://rickandmortyapi.com/api/character/1',
          'https://rickandmortyapi.com/api/character/2'
        ],
        url: 'https://rickandmortyapi.com/api/episode/1',
        created: '2017-11-10T12:56:33.798Z'
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockEpisode)
      });

      const { result } = renderHook(() => useEpisode('https://rickandmortyapi.com/api/episode/1'), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockEpisode);
      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/episode/1', expect.any(Object));
    });

    it('should handle episode URL with query parameters', async () => {
      const mockEpisode = {
        id: 1,
        name: 'Pilot',
        air_date: 'December 2, 2013',
        episode: 'S01E01',
        characters: [],
        url: 'https://rickandmortyapi.com/api/episode/1?special=true',
        created: '2017-11-10T12:56:33.798Z'
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockEpisode)
      });

      const { result } = renderHook(() => useEpisode('https://rickandmortyapi.com/api/episode/1?special=true'), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockEpisode);
      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/episode/1?special=true', expect.any(Object));
    });

    it('should handle episode URL with fragments', async () => {
      const mockEpisode = {
        id: 1,
        name: 'Pilot',
        air_date: 'December 2, 2013',
        episode: 'S01E01',
        characters: [],
        url: 'https://rickandmortyapi.com/api/episode/1#fragment',
        created: '2017-11-10T12:56:33.798Z'
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockEpisode)
      });

      const { result } = renderHook(() => useEpisode('https://rickandmortyapi.com/api/episode/1#fragment'), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockEpisode);
      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/episode/1#fragment', expect.any(Object));
    });

    it('should handle episode with many characters', async () => {
      const mockEpisode = {
        id: 1,
        name: 'Pilot',
        air_date: 'December 2, 2013',
        episode: 'S01E01',
        characters: Array.from({ length: 20 }, (_, i) => `https://rickandmortyapi.com/api/character/${i + 1}`),
        url: 'https://rickandmortyapi.com/api/episode/1',
        created: '2017-11-10T12:56:33.798Z'
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockEpisode)
      });

      const { result } = renderHook(() => useEpisode('https://rickandmortyapi.com/api/episode/1'), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockEpisode);
      expect(result.current.data?.characters).toHaveLength(20);
    });

    it('should handle episode with no characters', async () => {
      const mockEpisode = {
        id: 1,
        name: 'Pilot',
        air_date: 'December 2, 2013',
        episode: 'S01E01',
        characters: [],
        url: 'https://rickandmortyapi.com/api/episode/1',
        created: '2017-11-10T12:56:33.798Z'
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockEpisode)
      });

      const { result } = renderHook(() => useEpisode('https://rickandmortyapi.com/api/episode/1'), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockEpisode);
      expect(result.current.data?.characters).toHaveLength(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle API error (404)', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      const { result } = renderHook(() => useEpisode('https://rickandmortyapi.com/api/episode/999999'), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Failed to fetch episode');
    });

    it('should handle API error (500)', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      const { result } = renderHook(() => useEpisode('https://rickandmortyapi.com/api/episode/1'), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Failed to fetch episode');
    });

    it('should handle network error', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useEpisode('https://rickandmortyapi.com/api/episode/1'), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Network error');
    });

    it('should handle malformed JSON response', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockRejectedValueOnce(new Error('Invalid JSON'))
      });

      const { result } = renderHook(() => useEpisode('https://rickandmortyapi.com/api/episode/1'), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Invalid JSON');
    });

    it('should handle timeout scenarios', async () => {
      (fetch as jest.Mock).mockImplementationOnce(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 100)
        )
      );

      const { result } = renderHook(() => useEpisode('https://rickandmortyapi.com/api/episode/1'), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Request timeout');
    });
  });

  describe('URL Handling', () => {
    it('should handle empty URL', () => {
      const { result } = renderHook(() => useEpisode(''), { wrapper });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(fetch).not.toHaveBeenCalled();
    });

    it('should handle invalid URL format', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Invalid URL'));

      const { result } = renderHook(() => useEpisode('invalid-url'), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Invalid URL');
    });

    it('should handle URL with special characters', async () => {
      const mockEpisode = {
        id: 1,
        name: 'Pilot',
        air_date: 'December 2, 2013',
        episode: 'S01E01',
        characters: [],
        url: 'https://rickandmortyapi.com/api/episode/1?name=Rick%20%26%20Morty',
        created: '2017-11-10T12:56:33.798Z'
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockEpisode)
      });

      const { result } = renderHook(() => useEpisode('https://rickandmortyapi.com/api/episode/1?name=Rick%20%26%20Morty'), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockEpisode);
      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/episode/1?name=Rick%20%26%20Morty', expect.any(Object));
    });

    it('should handle URL with different episode numbers', async () => {
      const mockEpisode = {
        id: 42,
        name: 'Lawnmower Dog',
        air_date: 'December 9, 2013',
        episode: 'S01E02',
        characters: [],
        url: 'https://rickandmortyapi.com/api/episode/42',
        created: '2017-11-10T12:56:33.798Z'
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockEpisode)
      });

      const { result } = renderHook(() => useEpisode('https://rickandmortyapi.com/api/episode/42'), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockEpisode);
      expect(result.current.data?.id).toBe(42);
    });
  });

  describe('Query Behavior', () => {
    it('should handle loading state', () => {
      (fetch as jest.Mock).mockImplementation(() => new Promise(() => {})); // Never resolves

      const { result } = renderHook(() => useEpisode('https://rickandmortyapi.com/api/episode/1'), { wrapper });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    it('should refetch when URL changes', async () => {
      const mockEpisode1 = {
        id: 1,
        name: 'Pilot',
        air_date: 'December 2, 2013',
        episode: 'S01E01',
        characters: [],
        url: 'https://rickandmortyapi.com/api/episode/1',
        created: '2017-11-10T12:56:33.798Z'
      };

      const mockEpisode2 = {
        id: 2,
        name: 'Lawnmower Dog',
        air_date: 'December 9, 2013',
        episode: 'S01E02',
        characters: [],
        url: 'https://rickandmortyapi.com/api/episode/2',
        created: '2017-11-10T12:56:33.798Z'
      };

      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValueOnce(mockEpisode1)
        })
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValueOnce(mockEpisode2)
        });

      const { result, rerender } = renderHook(
        ({ url }) => useEpisode(url),
        { 
          wrapper,
          initialProps: { url: 'https://rickandmortyapi.com/api/episode/1' }
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockEpisode1);

      // Change URL
      rerender({ url: 'https://rickandmortyapi.com/api/episode/2' });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockEpisode2);
      });

      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/episode/1', expect.any(Object));
      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/episode/2', expect.any(Object));
    });

    it('should handle empty URL changes', () => {
      const { result, rerender } = renderHook(
        ({ url }) => useEpisode(url),
        { 
          wrapper,
          initialProps: { url: 'https://rickandmortyapi.com/api/episode/1' }
        }
      );

      rerender({ url: '' });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    it('should handle same URL multiple times', async () => {
      const mockEpisode = {
        id: 1,
        name: 'Pilot',
        air_date: 'December 2, 2013',
        episode: 'S01E01',
        characters: [],
        url: 'https://rickandmortyapi.com/api/episode/1',
        created: '2017-11-10T12:56:33.798Z'
      };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockEpisode)
      });

      const { result, rerender } = renderHook(
        ({ url }) => useEpisode(url),
        { 
          wrapper,
          initialProps: { url: 'https://rickandmortyapi.com/api/episode/1' }
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Rerender with same URL
      rerender({ url: 'https://rickandmortyapi.com/api/episode/1' });

      expect(result.current.data).toEqual(mockEpisode);
      // Should only call fetch once due to caching
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Episode Number Extraction', () => {
    it('should extract episode number from URL correctly', async () => {
      const mockEpisode = {
        id: 1,
        name: 'Pilot',
        air_date: 'December 2, 2013',
        episode: 'S01E01',
        characters: [],
        url: 'https://rickandmortyapi.com/api/episode/1',
        created: '2017-11-10T12:56:33.798Z'
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockEpisode)
      });

      const { result } = renderHook(() => useEpisode('https://rickandmortyapi.com/api/episode/1'), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockEpisode);
    });

    it('should handle URL with trailing slash', async () => {
      const mockEpisode = {
        id: 1,
        name: 'Pilot',
        air_date: 'December 2, 2013',
        episode: 'S01E01',
        characters: [],
        url: 'https://rickandmortyapi.com/api/episode/1/',
        created: '2017-11-10T12:56:33.798Z'
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockEpisode)
      });

      const { result } = renderHook(() => useEpisode('https://rickandmortyapi.com/api/episode/1/'), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockEpisode);
    });

    it('should handle URL with query parameters', async () => {
      const mockEpisode = {
        id: 1,
        name: 'Pilot',
        air_date: 'December 2, 2013',
        episode: 'S01E01',
        characters: [],
        url: 'https://rickandmortyapi.com/api/episode/1?param=value',
        created: '2017-11-10T12:56:33.798Z'
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockEpisode)
      });

      const { result } = renderHook(() => useEpisode('https://rickandmortyapi.com/api/episode/1?param=value'), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockEpisode);
    });
  });
}); 