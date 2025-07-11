'use client';

import { CharacterListInfinite } from '@/app/characters/CharacterListInfinite';
import { useCharacterSelection } from '@/hooks/useCharacterSelection';
import { useState } from 'react';
import { AlertMessage } from '@/components/ui/AlertMessage';
import { CharacterEpisodesList } from '@/app/episodes/CharacterEpisodesList';
import { SharedEpisodesList } from '@/app/episodes/SharedEpisodesList';
import Image from 'next/image';

export default function CharacterView() {
    const [alert, setAlert] = useState<string | null>(null);
    const { selectedCharacters, handleSelectCharacter } = useCharacterSelection((msg) => {
        setAlert(msg);
        setTimeout(() => {
            requestAnimationFrame(() => setAlert(null));
        }, 3500);
    });
    const [character1, character2] = selectedCharacters;

    const bothSelected = !!character1 && !!character2;

    return (
        <div className="min-h-screen lg:h-screen bg-background p-2 md:p-4 space-y-4 lg:overflow-hidden">
            {alert && (
                <div className="fixed top-4 right-4 z-50 w-full max-w-md transform-none">
                    <AlertMessage type="info" message={alert} onClose={() => setAlert(null)} />
                </div>
            )}
            <div>
                <Image
                    src="/rickandmorty.webp"
                    alt="Rick and Morty Logo"
                    width={233}
                    height={80}
                    className="mx-auto"
                    priority
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CharacterListInfinite
                    title="Select Character #1"
                    selectedCharacter={character1}
                    onCharacterSelect={(character) => handleSelectCharacter(character, 0)}
                />
                <CharacterListInfinite
                    title="Select Character #2"
                    selectedCharacter={character2}
                    onCharacterSelect={(character) => handleSelectCharacter(character, 1)}
                />
            </div>

            {!bothSelected ? (
                <div className="flex justify-center items-center min-h-[350px]">
                    <span className="text-3xl font-bold text-gray-700 text-center">
                        You must select both characters to see the episodes.
                    </span>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                    <CharacterEpisodesList
                        character={character1}
                        title={`${character1?.name}'s episodes`}
                    />
                    <SharedEpisodesList character1={character1} character2={character2} />
                    <CharacterEpisodesList
                        character={character2}
                        title={`${character2?.name}'s episodes`}
                    />
                </div>
            )}
        </div>
    );
} 