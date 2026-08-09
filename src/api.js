const API_URL = "https://rickandmortyapi.com/api/character";

export async function getCharacters() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`API-fout: ${response.status}`);
  }
  const data = await response.json();
  return data.results;
}
