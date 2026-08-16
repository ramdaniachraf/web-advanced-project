'use strict';

import './style.css';
import { getCharacters } from './api.js';

// ===== DOM-selectie =====
// Alle elementen die we nodig hebben, één keer opzoeken bij het opstarten.
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
const sentinel = document.querySelector('#sentinel');
const resultCount = document.querySelector('#result-count');
const favoritesOnlyCheckbox = document.querySelector('#favorites-only');
const emptyState = document.querySelector('#empty-state');
const headerEl = document.querySelector('header');
const modalBox = document.querySelector('#modal');

// ===== Applicatie-state =====
let allCharacters = [];        // alle characters die tot nu toe opgehaald zijn
let currentView = 'grid';      // 'grid' of 'table'
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];  // lijst van favoriete character-ID's
let isDarkTheme = localStorage.getItem('theme') === 'dark';
let currentPage = 1;           // huidige API-pagina
let hasNextPage = true;        // is er nog een volgende pagina om te laden?
let isLoading = false;         // voorkomt dubbele/overlappende fetches tijdens infinite scroll

// ===== Thema-switcher =====
// Past de kleuren van de pagina aan op basis van isDarkTheme, en wisselt
// het icoon van de knop (🌙 = klik om donker te worden, ☀️ = klik voor licht).
function applyTheme() {
  if (isDarkTheme) {
    document.body.style.backgroundColor = '#222';
    document.body.style.color = '#fff';
    headerEl.style.backgroundColor = '#333';
    modalBox.style.backgroundColor = '#333';
    modalBox.style.color = '#fff';
    themeToggle.textContent = '☀️';
  } else {
    document.body.style.backgroundColor = '#f4f4f4';
    document.body.style.color = '#222';
    headerEl.style.backgroundColor = '#ffffff';
    modalBox.style.backgroundColor = '#ffffff';
    modalBox.style.color = '#222';
    themeToggle.textContent = '🌙';
  }
  applyFilters(); // herrendert kaarten/tabel zodat hun kleur meteen mee verandert
}

themeToggle.addEventListener('click', () => {
  isDarkTheme = !isDarkTheme;
  localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
  applyTheme();
});

// Thema meteen toepassen bij het opstarten (haalt de vorige keuze uit LocalStorage).
applyTheme();

// ===== Favorieten =====
// Voegt een character-ID toe aan de favorieten, of verwijdert het als het
// er al in stond. Slaat het resultaat meteen op in LocalStorage.
function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter((favId) => favId !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  applyFilters(); // herrenderen zodat het hartje-icoon meteen bijwerkt
}

// ===== Kaartweergave =====
// Bouwt voor elk character een kaartje op met foto, naam, status/soort
// en een favorieten-knop. Foto en titel openen de modal; het hartje heeft
// een eigen, aparte klik-listener zodat die niet ook de modal opent.
function renderGrid(characters) {
  container.textContent = ''; // vorige inhoud wissen

  for (const character of characters) {
    const card = document.createElement('div');
    card.className = 'card';
    if (isDarkTheme) {
      card.style.backgroundColor = '#333';
      card.style.color = '#fff';
    } else {
      card.style.backgroundColor = '#fff';
      card.style.color = '#222';
    }

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

// ===== Tabelweergave =====
// Bouwt een tabel op met 8 kolommen (incl. favorieten-kolom). Zelfde
// principe als renderGrid: foto/naam-cel openen de modal, het hartje
// heeft zijn eigen listener.
function renderTable(characters) {
  container.textContent = '';

  const table = document.createElement('table');
  if (isDarkTheme) {
    table.style.backgroundColor = '#333';
    table.style.color = '#fff';
  } else {
    table.style.backgroundColor = '#fff';
    table.style.color = '#222';
  }

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

// Kiest welke render-functie er gebruikt wordt, afhankelijk van de huidige weergave.
function renderCharacters(characters) {
  currentView === 'grid' ? renderGrid(characters) : renderTable(characters);
}

// Vult de soort-dropdown dynamisch met alle unieke soorten uit de opgehaalde
// data. Kan meermaals aangeroepen worden (bv. na het bijladen van een nieuwe
// pagina) zonder dubbele opties te maken: we checken eerst welke waarden er
// al als optie staan.
function fillSpeciesFilter() {
  const uniqueSpecies = [];
  for (const character of allCharacters) {
    if (!uniqueSpecies.includes(character.species)) {
      uniqueSpecies.push(character.species);
    }
  }

  const existingValues = [];
  for (const option of speciesFilter.options) {
    existingValues.push(option.value);
  }

  for (const species of uniqueSpecies) {
    if (!existingValues.includes(species)) {
      const option = document.createElement('option');
      option.value = species;
      option.textContent = species;
      speciesFilter.appendChild(option);
    }
  }
}

// ===== Filteren, sorteren en renderen =====
// Combineert zoekterm, status-filter, soort-filter, "alleen favorieten" en
// sortering in één functiepad, zodat ze altijd samen toegepast worden.
// Werkt ook de resultaattelling en de lege-staat-melding bij.
function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase();
  const status = statusFilter.value;
  const species = speciesFilter.value;
  const sortOrder = sortSelect.value;
  const onlyFavorites = favoritesOnlyCheckbox.checked;

  const filtered = allCharacters.filter((character) => {
    const matchesSearch = character.name.toLowerCase().includes(searchTerm);
    const matchesStatus = status === '' || character.status.toLowerCase() === status;
    const matchesSpecies = species === '' || character.species === species;
    // Als het vinkje niet aangevinkt is, telt deze voorwaarde altijd als waar
    // (geen filter actief). Is het wél aangevinkt, dan moet het character ook
    // echt in de favorieten-lijst staan.
    const matchesFavorite = !onlyFavorites || favorites.includes(character.id);
    return matchesSearch && matchesStatus && matchesSpecies && matchesFavorite;
  });

  const sorted = filtered.sort((a, b) =>
    sortOrder === 'name-desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
  );

  resultCount.textContent = `${sorted.length} resultaten`;

  // Lege-staat tonen/verbergen op basis van het aantal resultaten.
  if (sorted.length === 0) {
    emptyState.style.display = 'block';
    container.style.display = 'none';
  } else {
    emptyState.style.display = 'none';
    container.style.display = 'flex';
  }

  renderCharacters(sorted);
}

// ===== Detail-modal =====
// Bouwt de volledige inhoud van de modal op (foto, details, notitieveld)
// en toont die. Wordt telkens volledig herbouwd (modalContent.textContent
// = ''), dus er blijft nooit een oude foutmelding of notitie van een ander
// character hangen.
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

  // Notitieveld: bestaande notitie (indien aanwezig) wordt vooringevuld
  // vanuit LocalStorage, met een unieke sleutel per character.
  const noteLabel = document.createElement('label');
  noteLabel.textContent = 'Persoonlijke notitie:';

  const noteInput = document.createElement('input');
  noteInput.type = 'text';
  noteInput.value = localStorage.getItem(`note-${character.id}`) || '';

  const noteFeedback = document.createElement('p');

  const noteButton = document.createElement('button');
  noteButton.textContent = 'Bewaar notitie';
  noteButton.addEventListener('click', () => {
    // Validatie: een lege of enkel-spaties notitie wordt niet opgeslagen.
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

// ===== Data ophalen =====
// Haalt de eerste pagina op bij het opstarten van de app.
async function showCharacters() {
  loader.style.display = 'block';

  try {
    const data = await getCharacters(currentPage);
    allCharacters = data.results;
    hasNextPage = data.info.next !== null;
    fillSpeciesFilter();
    applyFilters(); // rendert meteen ook de resultaattelling/lege-staat correct
  } catch (error) {
    // Nette foutmelding i.p.v. de app te laten crashen.
    container.textContent = '';
    const errorMessage = document.createElement('p');
    errorMessage.textContent = 'Er ging iets mis bij het ophalen van de characters.';
    container.appendChild(errorMessage);
    console.error(error);
  } finally {
    loader.style.display = 'none';
  }
}

// Haalt de volgende pagina op (aangeroepen door de IntersectionObserver
// hieronder). isLoading voorkomt dat er een tweede fetch start terwijl de
// eerste nog bezig is (bv. bij snel scrollen).
async function loadMoreCharacters() {
  if (isLoading || !hasNextPage) return;
  isLoading = true;
  loader.style.display = 'block';

  try {
    currentPage = currentPage + 1;
    const data = await getCharacters(currentPage);
    for (const character of data.results) {
      allCharacters.push(character);
    }
    hasNextPage = data.info.next !== null;
    fillSpeciesFilter(); // kan nieuwe soorten bevatten die nog niet in de dropdown stonden
    applyFilters();
  } catch (error) {
    console.error(error);
  } finally {
    isLoading = false;
    loader.style.display = 'none';
  }
}

// ===== Observer API: infinite scroll =====
// Houdt het onzichtbare #sentinel-element (onderaan de lijst) in de gaten.
// Zodra dat in beeld komt, wordt automatisch de volgende pagina geladen.
// We roepen hier bewust geen observer.unobserve() aan: we willen dat dit
// blijft triggeren bij elke nieuwe scroll, niet maar één keer.
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      loadMoreCharacters();
    }
  });
});

observer.observe(sentinel);

// ===== Event listeners voor filters/weergave =====
searchInput.addEventListener('input', applyFilters);
statusFilter.addEventListener('change', applyFilters);
speciesFilter.addEventListener('change', applyFilters);
sortSelect.addEventListener('change', applyFilters);
favoritesOnlyCheckbox.addEventListener('change', applyFilters);

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

// App opstarten.
showCharacters();
