import { useRef, useState } from 'react';
import { Character } from '@/types/rickAndMorty';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { CharacterCard } from '@/app/characters/CharacterCard';
import { useCharacters } from '@/hooks/useCharacters';
import { useScrollBottomReached } from '@/hooks/useScrollBottomReached';
import { Search } from 'lucide-react';

interface CharacterListInfiniteProps {
  title: string;
  selectedCharacter: Character | null;
  onCharacterSelect: (character: Character) => void;
}

export const CharacterListInfinite = ({ 
  title,
  selectedCharacter, 
  onCharacterSelect 
}: CharacterListInfiniteProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isError, 
    isLoading, 
    isFetchingNextPage 
  } = useCharacters(searchTerm);

  useScrollBottomReached(containerRef, () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, 100);

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Error loading characters. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  const allCharacters = data?.pages.flatMap(page => page.results) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 w-full">
          <span>{title}</span>
          <div className="flex items-center w-full md:w-auto space-x-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search characters..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full"
              />
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2 h-[33vh] overflow-y-auto"
        >
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} data-testid="skeleton-card">
                <CardContent className="p-2">
                  <div className="flex items-center space-x-3 min-h-[56px]">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : allCharacters.length === 0 ? (
            <div className="col-span-2 text-center py-8 text-muted-foreground">
              {searchTerm ? 'No characters found matching your search.' : 'No characters available.'}
            </div>
          ) : (
            <>
              {allCharacters.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  isSelected={selectedCharacter?.id === character.id}
                  onClick={() => onCharacterSelect(character)}
                />
              ))}
              
              {isFetchingNextPage && (
                <div className="col-span-2 flex justify-center py-4">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="text-sm text-muted-foreground">Loading more characters...</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 