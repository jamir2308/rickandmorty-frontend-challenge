import { create } from 'zustand';
import { Character } from '@/types/rickAndMorty';

type SelectedCharactersStore = {
  selectedCharacters: (Character | null)[];
  setSelectedCharacter: (panelIdx: number, character: Character | null) => void;
  clearSelection: () => void;
};

export const useSelectedCharactersStore = create<SelectedCharactersStore>((set) => ({
  selectedCharacters: [null, null], // Para dos paneles
  setSelectedCharacter: (panelIdx, character) => {
    set((state) => {
      const selectedCharacters = [...state.selectedCharacters];
      selectedCharacters[panelIdx] = character;
      return { selectedCharacters };
    });
  },
  clearSelection: () => {
    set({ selectedCharacters: [null, null] });
  },
})); 