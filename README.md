# 🛸 Rick & Morty Explorer

Interactieve Single Page Application voor het vak **Web Advanced**. Een SPA waarmee je Rick and Morty-personages kan verkennen, doorzoeken, filteren, sorteren en als favoriet bewaren — gebouwd met vanilla JavaScript en Vite (geen framework), zodat alle DOM- en JS-concepten rechtstreeks zichtbaar en uitlegbaar blijven.

## Inhoudstafel

- [Projectbeschrijving en functionaliteiten](#projectbeschrijving-en-functionaliteiten)
- [Gebruikte API](#gebruikte-api)
- [Screenshots](#screenshots)
- [Installatiehandleiding](#installatiehandleiding)
- [Projectstructuur](#projectstructuur)
- [Technische vereisten — implementatie](#technische-vereisten--implementatie)
- [Gebruikte bronnen](#gebruikte-bronnen)
- [AI-gebruik](#ai-gebruik)

## Projectbeschrijving en functionaliteiten

**Dataverzameling & weergave**
- Data wordt opgehaald via `fetch` (826+ personages, telkens 20 per API-pagina)
- Twee weergaves: **kaartweergave** en **tabelweergave** (8 kolommen), te wisselen via knoppen
- Klik op een personage (kaart of tabelrij) opent een detail-modal met status, soort, gender, origin, locatie

**Interactiviteit**
- Zoekfunctie op naam (live, bij elke toetsaanslag)
- Filters op status en soort (soort-lijst wordt dynamisch opgebouwd uit de opgehaalde data)
- Sorteren op naam (A-Z / Z-A)
- Alles hierboven werkt **gecombineerd**: zoeken, filteren, sorteren en de "alleen favorieten"-schakelaar tellen allemaal tegelijk mee
- Automatisch bijladen van meer personages bij het scrollen (infinite scroll)

**Personalisatie**
- Favorieten togglen (hartje-knop op elke kaart/rij), bewaard in LocalStorage
- Dark/light thema-switcher, bewaard in LocalStorage
- Persoonlijke notitie per personage (met validatie), bewaard in LocalStorage
- "Alleen favorieten"-filter

**Gebruikerservaring**
- Responsive: op smalle schermen (≤480px) worden zoekveld en kaarten volledig breed
- Hover-animatie op kaarten, "pop"-animatie op het hartje bij klikken
- Duidelijke resultaattelling en een nette melding wanneer een filtercombinatie niets oplevert
- Foutmelding bij een mislukte data-ophaling i.p.v. een stille crash

## Gebruikte API

**[The Rick and Morty API](https://rickandmortyapi.com/)** — gratis, geen API-key nodig.

Gebruikt endpoint: `GET https://rickandmortyapi.com/api/character?page=N`

Documentatie: https://rickandmortyapi.com/documentation

## Screenshots

> Zelf toe te voegen: `npm run dev`, en screenshots opslaan in een map `screenshots/` in de project-root.
>
> - `screenshots/grid-view.png` — kaartweergave
> - `screenshots/table-view.png` — tabelweergave
> - `screenshots/modal.png` — detail-modal met notitieveld
> - `screenshots/dark-theme.png` — dark thema
> - `screenshots/mobile.png` — mobiele weergave
>
> ```markdown
> ![Kaartweergave](screenshots/grid-view.png)
> ![Tabelweergave](screenshots/table-view.png)
> ![Detail-modal](screenshots/modal.png)
> ![Dark thema](screenshots/dark-theme.png)
> ![Mobiel](screenshots/mobile.png)
> ```

## Installatiehandleiding

Vereisten: [Node.js](https://nodejs.org/) (v18+) en npm.

```bash
# 1. Repository klonen
git clone https://github.com/ramdaniachraf/web-advanced-project.git
cd web-advanced-project

# 2. Dependencies installeren
npm install

# 3. Ontwikkelserver starten
npm run dev
```

Open daarna [http://localhost:5173](http://localhost:5173) in je browser.

```bash
npm run build     # productie-build (output in dist/)
npm run preview   # preview van de productie-build
```

## Projectstructuur

```
web-advanced-project/
├── index.html          # HTML-structuur (header met filters, modal-skeleton)
├── package.json
├── src/
│   ├── main.js          # volledige app-logica: state, rendering, events, filters
│   ├── api.js           # fetch-logica naar de Rick and Morty API
│   └── style.css        # alle styling (flexbox, animaties, responsive)
├── public/
│   └── favicon.svg
└── dist/                # productie-build (via npm run build)
```

## Technische vereisten — implementatie

### DOM-manipulatie

| Concept | Bestand + lijn |
|---|---|
| Elementen selecteren (`querySelector`) | [main.js:8-23](src/main.js#L8-L23) |
| Elementen manipuleren (`createElement`, `textContent`, `appendChild`) | [main.js:75-105](src/main.js#L75-L105) (renderGrid), [main.js:111-179](src/main.js#L111-L179) (renderTable), [main.js:258-315](src/main.js#L258-L315) (openModal) |
| Elementen manipuleren (`.style.property`) | [main.js:39-45](src/main.js#L39-L45) (thema), [main.js:243-247](src/main.js#L243-L247) (lege-staat), [main.js:314](src/main.js#L314) (modal tonen) |
| Events koppelen (`addEventListener`) | [main.js:85, 89, 96](src/main.js#L85) (per kaart-element), [main.js:381-397](src/main.js#L381-L397) (filters/knoppen) |

### Modern JavaScript

| Concept | Bestand + lijn |
|---|---|
| Constanten (`const`) | Overal, bv. [api.js:4](src/api.js#L4), [main.js:8-23](src/main.js#L8-L23) |
| Template literals | [api.js:10, 16](src/api.js#L10), [main.js:92, 269-274](src/main.js#L269-L274) |
| Iteratie over arrays (`for...of`) | [main.js:78](src/main.js#L78) (renderGrid), [main.js:129](src/main.js#L129) (renderTable), [main.js:192, 199, 203](src/main.js#L192-L203) (fillSpeciesFilter) |
| Array methodes (`filter`, `sort`, `includes`, `push`) | [main.js:224-233](src/main.js#L224-L233) (filter), [main.js:235-237](src/main.js#L235-L237) (sort), [main.js:62-68](src/main.js#L62-L68) (includes + push) |
| Arrow functions | Overal, bv. [main.js:49-53](src/main.js#L49-L53), [main.js:224-233](src/main.js#L224-L233) |
| Ternary operator | [main.js:95](src/main.js#L95) (hartje-icoon), [main.js:183](src/main.js#L183) (grid/tabel kiezen), [main.js:236](src/main.js#L236) (sorteervolgorde), [main.js:51](src/main.js#L51) (thema opslaan) |
| Callback functions | Event listener-callbacks overal, `.filter()`/`.sort()`-callbacks ([main.js:224, 235](src/main.js#L224)), `entries.forEach`-callback ([main.js:371](src/main.js#L371)) |
| Promises | `fetch()` geeft een Promise terug ([api.js:10](src/api.js#L10)) |
| Async & Await | [api.js:9](src/api.js#L9) (`getCharacters`), [main.js:319](src/main.js#L319) (`showCharacters`), [main.js:343](src/main.js#L343) (`loadMoreCharacters`) |
| Observer API | [main.js:370-378](src/main.js#L370-L378) (`IntersectionObserver` voor infinite scroll) |

### Data & API

| Concept | Bestand + lijn |
|---|---|
| Fetch | [api.js:10](src/api.js#L10) |
| JSON manipuleren en weergeven | [api.js:19](src/api.js#L19) (`response.json()`), [main.js:28, 67](src/main.js#L28) (`JSON.parse`/`JSON.stringify` voor favorieten in LocalStorage) |

### Opslag & validatie

| Concept | Bestand + lijn |
|---|---|
| Formuliervalidatie | [main.js:299-307](src/main.js#L299-L307) (notitie: lege input geeft foutmelding, geldige input een bevestiging) |
| LocalStorage | [main.js:28-29](src/main.js#L28-L29) (laden), [main.js:51, 67, 304](src/main.js#L51) (opslaan: thema, favorieten, notities) |

### Styling & layout

| Concept | Bestand + lijn |
|---|---|
| Flexbox | [style.css:9](src/style.css#L9) (header), [style.css:31](src/style.css#L31) (character-container) |
| Basis CSS | [style.css](src/style.css) (volledig bestand) |
| Responsive design | [style.css:65-73](src/style.css#L65-L73) (`@media (max-width: 480px)`) |
| Animaties | [style.css:46-48](src/style.css#L46-L48) (kaart-hover), [style.css:55-63](src/style.css#L55-L63) (hartje-pop) |
| Gebruiksvriendelijke elementen | Hartje-knop ([main.js:94-96](src/main.js#L94-L96)), sluitknop modal ([index.html:51](index.html#L51)), view-toggle- en thema-knoppen ([index.html:12, 37-38](index.html#L12)) |

### Asynchroon Web Dev

`async`/`await` wordt consequent gebruikt voor elke API-call: [api.js:9](src/api.js#L9) (`getCharacters`), [main.js:319](src/main.js#L319) (`showCharacters`, eerste keer laden), [main.js:343](src/main.js#L343) (`loadMoreCharacters`, infinite scroll). Foutafhandeling via `try/catch/finally` op alle drie de plekken.

### Fetch en datamanipulatie

`api.js` haalt data op en geeft het **volledige** API-antwoord terug (`data.results` + `data.info.next`), zodat `main.js` zowel de personages als de paginering-informatie kan gebruiken ([api.js:9-25](src/api.js#L9-L25)). Favorieten worden apart bijgehouden als een eigen array van ID's ([main.js:28](src/main.js#L28)), losstaand van de ruwe API-data.

### Tooling & structuur

| Vereiste | Status |
|---|---|
| Vite | Project opgezet via `npm create vite` (vanilla JS template) |
| Folderstructuur | `index.html` in de root, JavaScript in `src/`, styling in `src/style.css` |

## Gebruikte bronnen

- [The Rick and Morty API](https://rickandmortyapi.com/) — dataset
- Cursusmateriaal Web Advanced (Canvas, modules 0 t.e.m. 9) — elk technisch concept in dit project is expliciet geverifieerd tegen de effectieve lesinhoud van deze modules, niet enkel tegen de titels
- [MDN Web Docs](https://developer.mozilla.org/) — naslagwerk
- AI-assistentie: zie [AI-gebruik](#ai-gebruik) hieronder

## AI-gebruik

<!-- TODO: eigen AI-log/toelichting hier toevoegen -->

