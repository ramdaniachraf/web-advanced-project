import './style.css';
import { getCharacters } from './api.js';

const container = document.querySelector('#character-container');
const loader = document.querySelector('#loader');
const searchInput = document.querySelector('#search-input');

let allCharacters = [];

function renderCharacters(characters) {
  container.innerHTML = characters
    .map((character) => `
      <div class="card">
        <img src="${character.image}" alt="${character.name}">
        <h3>${character.name}</h3>
        <p>${character.status} - ${character.species}</p>
      </div>
    `)
    .join('');
}

async function showCharacters() {
  loader.classList.remove('hidden');

  try {
    allCharacters = await getCharacters();
    renderCharacters(allCharacters);
  } catch (error) {
    container.innerHTML = '<p>Er ging iets mis bij het ophalen van de characters.</p>';
    console.error(error);
  } finally {
    loader.classList.add('hidden');
  }
}

searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.toLowerCase();
  const filtered = allCharacters.filter((character) =>
    character.name.toLowerCase().includes(searchTerm)
  );
  renderCharacters(filtered);
});

showCharacters();
