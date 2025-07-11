import { render, screen, fireEvent } from '@testing-library/react';
import { CharacterCard } from '@/app/characters/CharacterCard';

const character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive' as const,
  species: 'Human',
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth (C-137)', url: '' },
  location: { name: 'Citadel of Ricks', url: '' },
  episode: ['https://rickandmortyapi.com/api/episode/1'],
  url: '',
  created: new Date().toISOString(),
};

describe('CharacterCard', () => {
  it('renders character name, image and status', () => {
    render(<CharacterCard character={character} isSelected={false} onClick={() => {}} />);
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByAltText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText(/Alive/)).toBeInTheDocument();
    expect(screen.getByText(/Human/)).toBeInTheDocument();
  });

  it('applies selection style when isSelected is true', () => {
    const { container } = render(<CharacterCard character={character} isSelected={true} onClick={() => {}} />);
    expect(container.firstChild).toHaveClass('selected');
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<CharacterCard character={character} isSelected={false} onClick={onClick} />);
    fireEvent.click(screen.getByTestId('character-card-1'));
    expect(onClick).toHaveBeenCalled();
  });
}); 