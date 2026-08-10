import './style.css';
import { getCharacters } from './api.js';

const container = document.querySelector('#character-container');
const loader = document.querySelector('#loader');
const searchInput = document.querySelector('#search-input');
const statusFilter = document.querySelector('#filter-status');
const speciesFilter = document.querySelector('#filter-species');

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

function fillSpeciesFilter() {
  const allSpecies = allCharacters.map((character) => character.species);
  const uniqueSpecies = [...new Set(allSpecies)];
  const options = uniqueSpecies
    .map((species) => `<option value="${species}">${species}</option>`)
    .join('');
  speciesFilter.innerHTML += options;
}

function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase();
  const status = statusFilter.value;
  const species = speciesFilter.value;

  const filtered = allCharacters.filter((character) => {
    const matchesSearch = character.name.toLowerCase().includes(searchTerm);
    const matchesStatus = status === '' || character.status.toLowerCase() === status;
    const matchesSpecies = species === '' || character.species === species;
    return matchesSearch && matchesStatus && matchesSpecies;
  });

  renderCharacters(filtered);
}

async function showCharacters() {
  loader.classList.remove('hidden');

  try {
    allCharacters = await getCharacters();
    renderCharacters(allCharacters);
    fillSpeciesFilter();
  } catch (error) {
    container.innerHTML = '<p>Er ging iets mis bij het ophalen van de characters.</p>';
    console.error(error);
  } finally {
    loader.classList.add('hidden');
  }
}

searchInput.addEventListener('input', applyFilters);
statusFilter.addEventListener('change', applyFilters);
speciesFilter.addEventListener('change', applyFilters);

showCharacters();
