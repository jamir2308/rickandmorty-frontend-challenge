import { getCharacters, getCharacter, getEpisode, getMultipleEpisodes } from '@/services/rickAndMortyApi';

// Mock fetch globally
global.fetch = jest.fn();

describe('rickAndMortyApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  describe('getCharacters', () => {
    it('should fetch characters successfully with default page', async () => {
      const mockResponse = {
        info: { count: 826, pages: 42, next: 'https://rickandmortyapi.com/api/character?page=2', prev: null },
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

      const result = await getCharacters();

      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character?page=1');
      expect(result).toEqual(mockResponse);
    });

    it('should fetch characters successfully with custom page', async () => {
      const mockResponse = {
        info: { count: 826, pages: 42, next: 'https://rickandmortyapi.com/api/character?page=3', prev: 'https://rickandmortyapi.com/api/character?page=1' },
        results: []
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse)
      });

      const result = await getCharacters(2);

      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character?page=2');
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when API returns error status', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(getCharacters()).rejects.toThrow('Failed to fetch characters');
      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character?page=1');
    });

    it('should throw error when network request fails', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(getCharacters()).rejects.toThrow('Network error');
      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character?page=1');
    });
  });

  describe('getCharacter', () => {
    it('should fetch character successfully by ID', async () => {
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

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockCharacter)
      });

      const result = await getCharacter(1);

      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character/1');
      expect(result).toEqual(mockCharacter);
    });

    it('should throw error when character not found', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(getCharacter(999999)).rejects.toThrow('Failed to fetch character');
      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character/999999');
    });

    it('should throw error when network request fails', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(getCharacter(1)).rejects.toThrow('Network error');
      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character/1');
    });

    it('should handle zero ID', async () => {
      const mockCharacter = {
        id: 0,
        name: 'Test Character',
        status: 'Alive',
        species: 'Human',
        type: '',
        gender: 'Male',
        origin: { name: 'Earth', url: 'https://rickandmortyapi.com/api/location/1' },
        location: { name: 'Earth', url: 'https://rickandmortyapi.com/api/location/1' },
        image: 'https://rickandmortyapi.com/api/character/avatar/0.jpeg',
        episode: [],
        url: 'https://rickandmortyapi.com/api/character/0',
        created: '2017-11-04T18:48:46.250Z'
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockCharacter)
      });

      const result = await getCharacter(0);

      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character/0');
      expect(result).toEqual(mockCharacter);
    });
  });

  describe('getEpisode', () => {
    it('should fetch episode successfully by URL', async () => {
      const mockEpisode = {
        id: 1,
        name: 'Pilot',
        air_date: 'December 2, 2013',
        episode: 'S01E01',
        characters: ['https://rickandmortyapi.com/api/character/1'],
        url: 'https://rickandmortyapi.com/api/episode/1',
        created: '2017-11-10T12:56:33.798Z'
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockEpisode)
      });

      const result = await getEpisode('https://rickandmortyapi.com/api/episode/1');

      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/episode/1');
      expect(result).toEqual(mockEpisode);
    });

    it('should throw error when episode not found', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(getEpisode('https://rickandmortyapi.com/api/episode/999999')).rejects.toThrow('Failed to fetch episode');
      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/episode/999999');
    });

    it('should throw error when network request fails', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(getEpisode('https://rickandmortyapi.com/api/episode/1')).rejects.toThrow('Network error');
      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/episode/1');
    });

    it('should handle URLs with special characters', async () => {
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

      const result = await getEpisode('https://rickandmortyapi.com/api/episode/1?special=true');

      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/episode/1?special=true');
      expect(result).toEqual(mockEpisode);
    });
  });

  describe('getMultipleEpisodes', () => {
    it('should fetch multiple episodes successfully', async () => {
      const mockEpisodes = [
        {
          id: 1,
          name: 'Pilot',
          air_date: 'December 2, 2013',
          episode: 'S01E01',
          characters: ['https://rickandmortyapi.com/api/character/1'],
          url: 'https://rickandmortyapi.com/api/episode/1',
          created: '2017-11-10T12:56:33.798Z'
        },
        {
          id: 2,
          name: 'Lawnmower Dog',
          air_date: 'December 9, 2013',
          episode: 'S01E02',
          characters: ['https://rickandmortyapi.com/api/character/1'],
          url: 'https://rickandmortyapi.com/api/episode/2',
          created: '2017-11-10T12:56:33.798Z'
        }
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockEpisodes)
      });

      const result = await getMultipleEpisodes([1, 2]);

      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/episode/1,2');
      expect(result).toEqual(mockEpisodes);
    });

    it('should return single episode as array when only one ID provided', async () => {
      const mockEpisode = {
        id: 1,
        name: 'Pilot',
        air_date: 'December 2, 2013',
        episode: 'S01E01',
        characters: ['https://rickandmortyapi.com/api/character/1'],
        url: 'https://rickandmortyapi.com/api/episode/1',
        created: '2017-11-10T12:56:33.798Z'
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockEpisode)
      });

      const result = await getMultipleEpisodes([1]);

      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/episode/1');
      expect(result).toEqual([mockEpisode]);
    });

    it('should return empty array when no IDs provided', async () => {
      const result = await getMultipleEpisodes([]);

      expect(fetch).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should throw error when API returns error status', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(getMultipleEpisodes([1, 2])).rejects.toThrow('Failed to fetch episodes');
      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/episode/1,2');
    });

    it('should throw error when network request fails', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(getMultipleEpisodes([1, 2])).rejects.toThrow('Network error');
      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/episode/1,2');
    });

    it('should handle large number of episode IDs', async () => {
      const ids = Array.from({ length: 10 }, (_, i) => i + 1);
      const mockEpisodes = ids.map(id => ({
        id,
        name: `Episode ${id}`,
        air_date: 'December 2, 2013',
        episode: `S01E${id.toString().padStart(2, '0')}`,
        characters: [],
        url: `https://rickandmortyapi.com/api/episode/${id}`,
        created: '2017-11-10T12:56:33.798Z'
      }));

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockEpisodes)
      });

      const result = await getMultipleEpisodes(ids);

      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/episode/1,2,3,4,5,6,7,8,9,10');
      expect(result).toEqual(mockEpisodes);
    });

    it('should handle duplicate episode IDs', async () => {
      const mockEpisodes = [
        {
          id: 1,
          name: 'Pilot',
          air_date: 'December 2, 2013',
          episode: 'S01E01',
          characters: [],
          url: 'https://rickandmortyapi.com/api/episode/1',
          created: '2017-11-10T12:56:33.798Z'
        }
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockEpisodes)
      });

      const result = await getMultipleEpisodes([1, 1, 1]);

      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/episode/1,1,1');
      expect(result).toEqual(mockEpisodes);
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed JSON response', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockRejectedValueOnce(new Error('Invalid JSON'))
      });

      await expect(getCharacters()).rejects.toThrow('Invalid JSON');
    });

    it('should handle timeout scenarios', async () => {
      (fetch as jest.Mock).mockImplementationOnce(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 100)
        )
      );

      await expect(getCharacters()).rejects.toThrow('Request timeout');
    });

    it('should handle server errors (5xx)', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      await expect(getCharacters()).rejects.toThrow('Failed to fetch characters');
    });

    it('should handle client errors (4xx)', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request'
      });

      await expect(getCharacters()).rejects.toThrow('Failed to fetch characters');
    });
  });

  describe('URL Construction', () => {
    it('should construct correct URLs for different page numbers', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ info: {}, results: [] })
      });

      await getCharacters(1);
      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character?page=1');

      await getCharacters(42);
      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character?page=42');

      await getCharacters(100);
      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character?page=100');
    });

    it('should construct correct URLs for different character IDs', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({})
      });

      await getCharacter(1);
      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character/1');

      await getCharacter(826);
      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character/826');
    });

    it('should construct correct URLs for multiple episodes', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue([])
      });

      await getMultipleEpisodes([1, 2, 3]);
      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/episode/1,2,3');

      await getMultipleEpisodes([1]);
      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/episode/1');
    });
  });
}); 