'use strict';

// Bron: The Rick and Morty API - https://rickandmortyapi.com/documentation
const API_URL = "https://rickandmortyapi.com/api/character";

// Haalt één pagina characters op (de API geeft telkens 20 resultaten terug).
// page = 1 is een standaardwaarde: als je geen paginanummer meegeeft,
// wordt automatisch de eerste pagina opgehaald.
export async function getCharacters(page = 1) {
  const response = await fetch(`${API_URL}?page=${page}`);

  // response.ok is enkel true bij een succesvolle statuscode (200-299).
  // Bij een fout (bv. 404) gooien we zelf een Error, die de aanroeper
  // (main.js) kan opvangen met try/catch.
  if (!response.ok) {
    throw new Error(`API-fout: ${response.status}`);
  }

  const data = await response.json();

  // We geven het volledige antwoord terug (results + info.next), zodat
  // main.js ook kan zien of er nog een volgende pagina bestaat (nodig
  // voor infinite scroll).
  return data;
}
