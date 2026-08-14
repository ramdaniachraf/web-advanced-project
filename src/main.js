'use strict';

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
const viewGridBtn = document.querySelector('#view-grid');
const viewTableBtn = document.querySelector('#view-table');
const themeToggle = document.querySelector('#theme-toggle');

let allCharacters = [];
let currentView = 'grid';
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let isDarkTheme = localStorage.getItem('theme') === 'dark';

function applyTheme() {
  if (isDarkTheme) {
    document.body.style.backgroundColor = '#222';
    document.body.style.color = '#fff';
    themeToggle.textContent = '☀️';
  } else {
    document.body.style.backgroundColor = '#f4f4f4';
    document.body.style.color = '#222';
    themeToggle.textContent = '🌙';
  }
}

themeToggle.addEventListener('click', () => {
  isDarkTheme = !isDarkTheme;
  localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
  applyTheme();
});

applyTheme();

function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter((favId) => favId !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  applyFilters();
}

function renderGrid(characters) {
  container.textContent = '';

  for (const character of characters) {
    const card = document.createElement('div');
    card.className = 'card';

    const img = document.createElement('img');
    img.src = character.image;
    img.alt = character.name;
    img.addEventListener('click', () => openModal(character));

    const title = document.createElement('h3');
    title.textContent = character.name;
    title.addEventListener('click', () => openModal(character));

    const info = document.createElement('p');
    info.textContent = `${character.status} - ${character.species}`;

    const favoriteBtn = document.createElement('button');
    favoriteBtn.textContent = favorites.includes(character.id) ? '❤️' : '🤍';
    favoriteBtn.addEventListener('click', () => toggleFavorite(character.id));

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(info);
    card.appendChild(favoriteBtn);

    container.appendChild(card);
  }
}

function renderTable(characters) {
  container.textContent = '';

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const headerLabels = ['', 'Naam', 'Status', 'Soort', 'Gender', 'Origin', 'Locatie', 'Favoriet'];

  for (const label of headerLabels) {
    const th = document.createElement('th');
    th.textContent = label;
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');

  for (const character of characters) {
    const row = document.createElement('tr');

    const imgCell = document.createElement('td');
    const img = document.createElement('img');
    img.src = character.image;
    img.alt = character.name;
    img.width = 40;
    img.addEventListener('click', () => openModal(character));
    imgCell.appendChild(img);

    const nameCell = document.createElement('td');
    nameCell.textContent = character.name;
    nameCell.addEventListener('click', () => openModal(character));

    const statusCell = document.createElement('td');
    statusCell.textContent = character.status;

    const speciesCell = document.createElement('td');
    speciesCell.textContent = character.species;

    const genderCell = document.createElement('td');
    genderCell.textContent = character.gender;

    const originCell = document.createElement('td');
    originCell.textContent = character.origin.name;

    const locationCell = document.createElement('td');
    locationCell.textContent = character.location.name;

    const favoriteCell = document.createElement('td');
    const favoriteBtn = document.createElement('button');
    favoriteBtn.textContent = favorites.includes(character.id) ? '❤️' : '🤍';
    favoriteBtn.addEventListener('click', () => toggleFavorite(character.id));
    favoriteCell.appendChild(favoriteBtn);

    row.appendChild(imgCell);
    row.appendChild(nameCell);
    row.appendChild(statusCell);
    row.appendChild(speciesCell);
    row.appendChild(genderCell);
    row.appendChild(originCell);
    row.appendChild(locationCell);
    row.appendChild(favoriteCell);

    tbody.appendChild(row);
  }

  table.appendChild(tbody);
  container.appendChild(table);
}

function renderCharacters(characters) {
  currentView === 'grid' ? renderGrid(characters) : renderTable(characters);
}

function fillSpeciesFilter() {
  const uniqueSpecies = [];
  for (const character of allCharacters) {
    if (!uniqueSpecies.includes(character.species)) {
      uniqueSpecies.push(character.species);
    }
  }

  for (const species of uniqueSpecies) {
    const option = document.createElement('option');
    option.value = species;
    option.textContent = species;
    speciesFilter.appendChild(option);
  }
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
  modalContent.textContent = '';

  const img = document.createElement('img');
  img.src = character.image;
  img.alt = character.name;
  img.style.width = '150px';

  const title = document.createElement('h2');
  title.textContent = character.name;

  const details = [
    `Status: ${character.status}`,
    `Soort: ${character.species}`,
    `Gender: ${character.gender}`,
    `Origin: ${character.origin.name}`,
    `Locatie: ${character.location.name}`
  ];

  modalContent.appendChild(img);
  modalContent.appendChild(title);

  for (const detail of details) {
    const p = document.createElement('p');
    p.textContent = detail;
    modalContent.appendChild(p);
  }

  const noteLabel = document.createElement('label');
  noteLabel.textContent = 'Persoonlijke notitie:';

  const noteInput = document.createElement('input');
  noteInput.type = 'text';
  noteInput.value = localStorage.getItem(`note-${character.id}`) || '';

  const noteFeedback = document.createElement('p');

  const noteButton = document.createElement('button');
  noteButton.textContent = 'Bewaar notitie';
  noteButton.addEventListener('click', () => {
    if (noteInput.value.trim() === '') {
      noteFeedback.textContent = 'Vul eerst een notitie in voor je opslaat.';
    } else {
      localStorage.setItem(`note-${character.id}`, noteInput.value);
      noteFeedback.textContent = 'Notitie opgeslagen!';
    }
  });

  modalContent.appendChild(noteLabel);
  modalContent.appendChild(noteInput);
  modalContent.appendChild(noteButton);
  modalContent.appendChild(noteFeedback);

  modalOverlay.style.display = 'flex';
}

async function showCharacters() {
  loader.style.display = 'block';

  try {
    allCharacters = await getCharacters();
    renderCharacters(allCharacters);
    fillSpeciesFilter();
  } catch (error) {
    container.textContent = '';
    const errorMessage = document.createElement('p');
    errorMessage.textContent = 'Er ging iets mis bij het ophalen van de characters.';
    container.appendChild(errorMessage);
    console.error(error);
  } finally {
    loader.style.display = 'none';
  }
}

searchInput.addEventListener('input', applyFilters);
statusFilter.addEventListener('change', applyFilters);
speciesFilter.addEventListener('change', applyFilters);
sortSelect.addEventListener('change', applyFilters);

viewGridBtn.addEventListener('click', () => {
  currentView = 'grid';
  applyFilters();
});

viewTableBtn.addEventListener('click', () => {
  currentView = 'table';
  applyFilters();
});

modalClose.addEventListener('click', () => {
  modalOverlay.style.display = 'none';
});

showCharacters();
