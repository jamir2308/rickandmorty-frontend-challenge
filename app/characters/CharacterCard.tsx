import { memo } from 'react';
import Image from 'next/image';
import { CharacterCardProps } from '@/types/rickAndMorty';
import { Card, CardContent } from '@/components/ui/Card';

const CharacterCardComponent = ({ character, isSelected = false, onClick }: CharacterCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'alive':
        return 'bg-green-400 shadow-[0_0_8px_2px_#00fff7]';
      case 'dead':
        return 'bg-red-500 shadow-[0_0_8px_2px_#ff4c60]';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <Card 
      data-testid={`character-card-${character.id}`}
      className={`character-card card-modern transition-all duration-300 ${
        isSelected 
          ? 'selected outline outline-2 outline-primary' 
          : 'hover:shadow-xl'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-2">
        <div className="flex items-center space-x-3 min-h-[56px]">
          <div className="relative">
            <Image
              src={character.image}
              alt={character.name}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover border-2 border-secondary shadow-md"
              priority={false}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base truncate text-white drop-shadow-[0_1px_2px_rgba(0,255,247,0.10)]">
              {character.name}
            </h3>
            <div className="flex flex-col space-y-0.5 mt-1">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(character.status)}`} />
                <span className="text-xs text-muted-foreground font-medium">
                  {character.status} <span className="mx-1">·</span> {character.species}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const CharacterCard = memo(CharacterCardComponent);

CharacterCard.displayName = 'CharacterCard';
