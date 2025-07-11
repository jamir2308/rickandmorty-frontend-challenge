import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useCharacterSelection } from '@/hooks/useCharacterSelection';
import { useSelectedCharactersStore } from '@/store/useSelectedCharactersStore';
import { Character } from '@/types/rickAndMorty';

// Mock the Zustand store
jest.mock('../../store/useSelectedCharactersStore', () => ({
  useSelectedCharactersStore: jest.fn(),
}));

const mockUseSelectedCharactersStore = useSelectedCharactersStore as jest.MockedFunction<typeof useSelectedCharactersStore>;

describe('useCharacterSelection', () => {
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

  const mockCharacter3: Character = {
    id: 3,
    name: 'Summer Smith',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Female',
    origin: { name: 'Earth (Replacement Dimension)', url: 'https://rickandmortyapi.com/api/location/20' },
    location: { name: 'Earth (Replacement Dimension)', url: 'https://rickandmortyapi.com/api/location/20' },
    image: 'https://rickandmortyapi.com/api/character/avatar/3.jpeg',
    episode: ['https://rickandmortyapi.com/api/episode/1'],
    url: 'https://rickandmortyapi.com/api/character/3',
    created: '2017-11-04T18:50:21.651Z'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Character Selection', () => {
    it('should select character in panel 0', () => {
      const mockSetSelectedCharacter = jest.fn();
      const mockSelectedCharacters = [null, null];

      mockUseSelectedCharactersStore.mockReturnValue({
        selectedCharacters: mockSelectedCharacters,
        setSelectedCharacter: mockSetSelectedCharacter,
      });

      const { result } = renderHook(() => useCharacterSelection());

      act(() => {
        result.current.handleSelectCharacter(mockCharacter1, 0);
      });

      expect(mockSetSelectedCharacter).toHaveBeenCalledWith(0, mockCharacter1);
    });

    it('should select character in panel 1', () => {
      const mockSetSelectedCharacter = jest.fn();
      const mockSelectedCharacters = [null, null];

      mockUseSelectedCharactersStore.mockReturnValue({
        selectedCharacters: mockSelectedCharacters,
        setSelectedCharacter: mockSetSelectedCharacter,
      });

      const { result } = renderHook(() => useCharacterSelection());

      act(() => {
        result.current.handleSelectCharacter(mockCharacter2, 1);
      });

      expect(mockSetSelectedCharacter).toHaveBeenCalledWith(1, mockCharacter2);
    });

    it('should deselect character when same character is selected in same panel', () => {
      const mockSetSelectedCharacter = jest.fn();
      const mockSelectedCharacters = [mockCharacter1, null];

      mockUseSelectedCharactersStore.mockReturnValue({
        selectedCharacters: mockSelectedCharacters,
        setSelectedCharacter: mockSetSelectedCharacter,
      });

      const { result } = renderHook(() => useCharacterSelection());

      act(() => {
        result.current.handleSelectCharacter(mockCharacter1, 0);
      });

      expect(mockSetSelectedCharacter).toHaveBeenCalledWith(0, null);
    });

    it('should show alert when character is already selected in other panel', () => {
      const mockSetSelectedCharacter = jest.fn();
      const mockSelectedCharacters = [mockCharacter1, null];
      const mockOnShowAlert = jest.fn();

      mockUseSelectedCharactersStore.mockReturnValue({
        selectedCharacters: mockSelectedCharacters,
        setSelectedCharacter: mockSetSelectedCharacter,
      });

      const { result } = renderHook(() => useCharacterSelection(mockOnShowAlert));

      act(() => {
        result.current.handleSelectCharacter(mockCharacter1, 1);
      });

      expect(mockOnShowAlert).toHaveBeenCalledWith(
        'This character is already selected in the other panel. Please select a different character.'
      );
      expect(mockSetSelectedCharacter).not.toHaveBeenCalled();
    });

    it('should not show alert when onShowAlert is not provided', () => {
      const mockSetSelectedCharacter = jest.fn();
      const mockSelectedCharacters = [mockCharacter1, null];

      mockUseSelectedCharactersStore.mockReturnValue({
        selectedCharacters: mockSelectedCharacters,
        setSelectedCharacter: mockSetSelectedCharacter,
      });

      const { result } = renderHook(() => useCharacterSelection());

      act(() => {
        result.current.handleSelectCharacter(mockCharacter1, 1);
      });

      expect(mockSetSelectedCharacter).not.toHaveBeenCalled();
    });

    it('should allow selecting different characters in different panels', () => {
      const mockSetSelectedCharacter = jest.fn();
      const mockSelectedCharacters = [mockCharacter1, null];

      mockUseSelectedCharactersStore.mockReturnValue({
        selectedCharacters: mockSelectedCharacters,
        setSelectedCharacter: mockSetSelectedCharacter,
      });

      const { result } = renderHook(() => useCharacterSelection());

      act(() => {
        result.current.handleSelectCharacter(mockCharacter2, 1);
      });

      expect(mockSetSelectedCharacter).toHaveBeenCalledWith(1, mockCharacter2);
    });

    it('should handle selection when both panels are empty', () => {
      const mockSetSelectedCharacter = jest.fn();
      const mockSelectedCharacters = [null, null];

      mockUseSelectedCharactersStore.mockReturnValue({
        selectedCharacters: mockSelectedCharacters,
        setSelectedCharacter: mockSetSelectedCharacter,
      });

      const { result } = renderHook(() => useCharacterSelection());

      act(() => {
        result.current.handleSelectCharacter(mockCharacter1, 0);
      });

      expect(mockSetSelectedCharacter).toHaveBeenCalledWith(0, mockCharacter1);
    });

    it('should handle selection when one panel is occupied', () => {
      const mockSetSelectedCharacter = jest.fn();
      const mockSelectedCharacters = [mockCharacter1, null];

      mockUseSelectedCharactersStore.mockReturnValue({
        selectedCharacters: mockSelectedCharacters,
        setSelectedCharacter: mockSetSelectedCharacter,
      });

      const { result } = renderHook(() => useCharacterSelection());

      act(() => {
        result.current.handleSelectCharacter(mockCharacter2, 1);
      });

      expect(mockSetSelectedCharacter).toHaveBeenCalledWith(1, mockCharacter2);
    });
  });

  describe('Alert Handling', () => {
    it('should call onShowAlert when character is already selected in other panel', () => {
      const mockSetSelectedCharacter = jest.fn();
      const mockSelectedCharacters = [mockCharacter1, null];
      const mockOnShowAlert = jest.fn();

      mockUseSelectedCharactersStore.mockReturnValue({
        selectedCharacters: mockSelectedCharacters,
        setSelectedCharacter: mockSetSelectedCharacter,
      });

      const { result } = renderHook(() => useCharacterSelection(mockOnShowAlert));

      act(() => {
        result.current.handleSelectCharacter(mockCharacter1, 1);
      });

      expect(mockOnShowAlert).toHaveBeenCalledTimes(1);
      expect(mockOnShowAlert).toHaveBeenCalledWith(
        'This character is already selected in the other panel. Please select a different character.'
      );
    });

    it('should not call onShowAlert when selecting different character', () => {
      const mockSetSelectedCharacter = jest.fn();
      const mockSelectedCharacters = [mockCharacter1, null];
      const mockOnShowAlert = jest.fn();

      mockUseSelectedCharactersStore.mockReturnValue({
        selectedCharacters: mockSelectedCharacters,
        setSelectedCharacter: mockSetSelectedCharacter,
      });

      const { result } = renderHook(() => useCharacterSelection(mockOnShowAlert));

      act(() => {
        result.current.handleSelectCharacter(mockCharacter2, 1);
      });

      expect(mockOnShowAlert).not.toHaveBeenCalled();
    });

    it('should not call onShowAlert when deselecting character', () => {
      const mockSetSelectedCharacter = jest.fn();
      const mockSelectedCharacters = [mockCharacter1, null];
      const mockOnShowAlert = jest.fn();

      mockUseSelectedCharactersStore.mockReturnValue({
        selectedCharacters: mockSelectedCharacters,
        setSelectedCharacter: mockSetSelectedCharacter,
      });

      const { result } = renderHook(() => useCharacterSelection(mockOnShowAlert));

      act(() => {
        result.current.handleSelectCharacter(mockCharacter1, 0);
      });

      expect(mockOnShowAlert).not.toHaveBeenCalled();
    });
  });

  describe('Store Integration', () => {
    it('should return selected characters from store', () => {
      const mockSelectedCharacters = [mockCharacter1, mockCharacter2];
      const mockSetSelectedCharacter = jest.fn();

      mockUseSelectedCharactersStore.mockReturnValue({
        selectedCharacters: mockSelectedCharacters,
        setSelectedCharacter: mockSetSelectedCharacter,
      });

      const { result } = renderHook(() => useCharacterSelection());

      expect(result.current.selectedCharacters).toEqual(mockSelectedCharacters);
    });

    it('should return setSelectedCharacter from store', () => {
      const mockSelectedCharacters = [null, null];
      const mockSetSelectedCharacter = jest.fn();

      mockUseSelectedCharactersStore.mockReturnValue({
        selectedCharacters: mockSelectedCharacters,
        setSelectedCharacter: mockSetSelectedCharacter,
      });

      const { result } = renderHook(() => useCharacterSelection());

      expect(result.current.setSelectedCharacter).toBe(mockSetSelectedCharacter);
    });

    it('should call store with correct parameters', () => {
      const mockSetSelectedCharacter = jest.fn();
      const mockSelectedCharacters = [null, null];

      mockUseSelectedCharactersStore.mockReturnValue({
        selectedCharacters: mockSelectedCharacters,
        setSelectedCharacter: mockSetSelectedCharacter,
      });

      const { result } = renderHook(() => useCharacterSelection());

      act(() => {
        result.current.handleSelectCharacter(mockCharacter1, 0);
      });

      expect(mockUseSelectedCharactersStore).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined selected characters', () => {
      const mockSetSelectedCharacter = jest.fn();
      const mockSelectedCharacters = [undefined, undefined];

      mockUseSelectedCharactersStore.mockReturnValue({
        selectedCharacters: mockSelectedCharacters,
        setSelectedCharacter: mockSetSelectedCharacter,
      });

      const { result } = renderHook(() => useCharacterSelection());

      act(() => {
        result.current.handleSelectCharacter(mockCharacter1, 0);
      });

      expect(mockSetSelectedCharacter).toHaveBeenCalledWith(0, mockCharacter1);
    });

    it('should handle null selected characters', () => {
      const mockSetSelectedCharacter = jest.fn();
      const mockSelectedCharacters = [null, null];

      mockUseSelectedCharactersStore.mockReturnValue({
        selectedCharacters: mockSelectedCharacters,
        setSelectedCharacter: mockSetSelectedCharacter,
      });

      const { result } = renderHook(() => useCharacterSelection());

      act(() => {
        result.current.handleSelectCharacter(mockCharacter1, 0);
      });

      expect(mockSetSelectedCharacter).toHaveBeenCalledWith(0, mockCharacter1);
    });

    it('should handle invalid panel ID', () => {
      const mockSetSelectedCharacter = jest.fn();
      const mockSelectedCharacters = [null, null];

      mockUseSelectedCharactersStore.mockReturnValue({
        selectedCharacters: mockSelectedCharacters,
        setSelectedCharacter: mockSetSelectedCharacter,
      });

      const { result } = renderHook(() => useCharacterSelection());

      act(() => {
        result.current.handleSelectCharacter(mockCharacter1, 2); // Invalid panel ID
      });

      // Should still call setSelectedCharacter with the invalid panel ID
      expect(mockSetSelectedCharacter).toHaveBeenCalledWith(2, mockCharacter1);
    });

    it('should handle negative panel ID', () => {
      const mockSetSelectedCharacter = jest.fn();
      const mockSelectedCharacters = [null, null];

      mockUseSelectedCharactersStore.mockReturnValue({
        selectedCharacters: mockSelectedCharacters,
        setSelectedCharacter: mockSetSelectedCharacter,
      });

      const { result } = renderHook(() => useCharacterSelection());

      act(() => {
        result.current.handleSelectCharacter(mockCharacter1, -1); // Negative panel ID
      });

      // Should still call setSelectedCharacter with the negative panel ID
      expect(mockSetSelectedCharacter).toHaveBeenCalledWith(-1, mockCharacter1);
    });
  });

  describe('Callback Stability', () => {
    it('should maintain stable handleSelectCharacter reference', () => {
      const mockSetSelectedCharacter = jest.fn();
      const mockSelectedCharacters = [null, null];

      mockUseSelectedCharactersStore.mockReturnValue({
        selectedCharacters: mockSelectedCharacters,
        setSelectedCharacter: mockSetSelectedCharacter,
      });

      const { result, rerender } = renderHook(() => useCharacterSelection());

      const firstReference = result.current.handleSelectCharacter;

      rerender();

      const secondReference = result.current.handleSelectCharacter;

      expect(firstReference).toBe(secondReference);
    });
  });
}); 