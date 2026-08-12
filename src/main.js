import './style.css';
import { getCharacters } from './api.js';

const container = document.querySelector('#character-container');
const loader = document.querySelector('#loader');
const searchInput = document.querySelector('#search-input');
const statusFilter = document.querySelector('#filter-status');
const speciesFilter = document.querySelector('#filter-species');
const sortSelect = document.querySelector('#sort-select');
const modalOverlay = document.querySelector('#modal-overlay');
const modalContent = document.querySelector('#modal-content');
const modalClose = document.querySelector('#modal-close');

let allCharacters = [];

function renderCharacters(characters) {
  container.innerHTML = characters
    .map((character) => `
      <div class="card" data-id="${character.id}">
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
  const sortOrder = sortSelect.value;

  const filtered = allCharacters.filter((character) => {
    const matchesSearch = character.name.toLowerCase().includes(searchTerm);
    const matchesStatus = status === '' || character.status.toLowerCase() === status;
    const matchesSpecies = species === '' || character.species === species;
    return matchesSearch && matchesStatus && matchesSpecies;
  });

  const sorted = filtered.sort((a, b) =>
    sortOrder === 'name-desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
  );

  renderCharacters(sorted);
}

function openModal(character) {
  modalContent.innerHTML = `
    <img src="${character.image}" alt="${character.name}" style="width: 150px;">
    <h2>${character.name}</h2>
    <p><strong>Status:</strong> ${character.status}</p>
    <p><strong>Soort:</strong> ${character.species}</p>
    <p><strong>Gender:</strong> ${character.gender}</p>
    <p><strong>Origin:</strong> ${character.origin.name}</p>
    <p><strong>Locatie:</strong> ${character.location.name}</p>
  `;
  modalOverlay.classList.remove('hidden');
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
sortSelect.addEventListener('change', applyFilters);

container.addEventListener('click', (event) => {
  const card = event.target.closest('.card');
  if (!card) return;

  const character = allCharacters.find((char) => char.id === Number(card.dataset.id));
  openModal(character);
});

modalClose.addEventListener('click', () => {
  modalOverlay.classList.add('hidden');
});

showCharacters();
