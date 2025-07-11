import { useCallback } from 'react';
import { Character } from '@/types/rickAndMorty';
import { useSelectedCharactersStore } from '@/store/useSelectedCharactersStore';

export function useCharacterSelection(onShowAlert?: (msg: string) => void) {
  const { selectedCharacters, setSelectedCharacter } = useSelectedCharactersStore();

  const handleSelectCharacter = useCallback(
    (character: Character, panelId: number) => {
      if (selectedCharacters[panelId]?.id === character.id) {
        setSelectedCharacter(panelId, null);
        return;
      }

      const otherPanelId = panelId === 0 ? 1 : 0;
      const isCharacterAlreadySelected = selectedCharacters[otherPanelId]?.id === character.id;

      if (isCharacterAlreadySelected) {
        if (onShowAlert) {
          onShowAlert('This character is already selected in the other panel. Please select a different character.');
        }
        return;
      }
      setSelectedCharacter(panelId, character);
    },
    [selectedCharacters, setSelectedCharacter, onShowAlert]
  );

  return {
    selectedCharacters,
    handleSelectCharacter,
    setSelectedCharacter,
  };
} 