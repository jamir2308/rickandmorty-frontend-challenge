
export async function getCharacters(page: number = 1) {
  const res = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
  if (!res.ok) {
    throw new Error('Failed to fetch characters');
  }
  return res.json();
}

export async function getCharacter(id: number) {
  const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch character');
  }
  return res.json();
}

export async function getEpisode(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch episode');
  }
  return res.json();
}

export async function getMultipleEpisodes(ids: number[]) {
  if (ids.length === 0) return [];
  const res = await fetch(`https://rickandmortyapi.com/api/episode/${ids.join(',')}`);
  if (!res.ok) {
    throw new Error('Failed to fetch episodes');
  }
  const data = await res.json();
  return Array.isArray(data) ? data : [data];
}