import './style.css';
import { getCharacters } from './api.js';

const container = document.querySelector('#character-container');
const loader = document.querySelector('#loader');

async function showCharacters() {
  loader.classList.remove('hidden');

  try {
    const characters = await getCharacters();
    container.innerHTML = characters
      .map((character) => `
        <div class="card">
          <img src="${character.image}" alt="${character.name}">
          <h3>${character.name}</h3>
          <p>${character.status} - ${character.species}</p>
        </div>
      `)
      .join('');
  } catch (error) {
    container.innerHTML = '<p>Er ging iets mis bij het ophalen van de characters.</p>';
    console.error(error);
  } finally {
    loader.classList.add('hidden');
  }
}

showCharacters();
