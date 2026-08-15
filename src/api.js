'use strict';

const API_URL = "https://rickandmortyapi.com/api/character";

export async function getCharacters(page = 1) {
  const response = await fetch(`${API_URL}?page=${page}`);
  if (!response.ok) {
    throw new Error(`API-fout: ${response.status}`);
  }
  const data = await response.json();
  return data;
}
