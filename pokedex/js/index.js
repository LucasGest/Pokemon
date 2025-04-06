const container = document.getElementById("pokemon-container");
const searchInput = document.getElementById("search");
const generationSelect = document.getElementById("generation-select");
const lightbox = document.getElementById("lightbox");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxDescription = document.getElementById("lightbox-description");

async function fetchPokemon(id) {
  let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  let data = await response.json();

  let speciesResponse = await fetch(data.species.url);
  let speciesData = await speciesResponse.json();
  let nameFr = speciesData.names.find((n) => n.language.name === "fr").name;
  let description =
    speciesData.flavor_text_entries
      .find((entry) => entry.language.name === "fr")
      ?.flavor_text.replace(/\n/g, " ") || "Pas de description disponible.";
  let isLegendary = speciesData.is_legendary ? "Légendaire" : "Non légendaire";
  let types = data.types.map((t) => traduireType(t.type.name)).join(", ");
  let region = document.querySelector(
    `#generation-select option[value='${generationSelect.value}']`
  ).textContent;

  return {
    id: id,
    name: nameFr,
    image: data.sprites.front_default,
    legendary: isLegendary,
    description: description,
    types: types,
    region: region,
  };
}

function traduireType(type) {
  const typesFR = {
    normal: "Normal",
    fire: "Feu",
    water: "Eau",
    electric: "Électrik",
    grass: "Plante",
    ice: "Glace",
    fighting: "Combat",
    poison: "Poison",
    ground: "Sol",
    flying: "Vol",
    psychic: "Psy",
    bug: "Insecte",
    rock: "Roche",
    ghost: "Spectre",
    dragon: "Dragon",
    dark: "Ténèbres",
    steel: "Acier",
    fairy: "Fée",
  };
  return typesFR[type] || type;
}

async function loadPokemons(gen) {
  container.innerHTML = "";
  let [start, end] = getGenerationRange(gen);

  for (let i = start; i <= end; i++) {
    let pokemon = await fetchPokemon(i);

    let div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
      <img src="${pokemon.image}" alt="${pokemon.name}">
      <p><strong>#${pokemon.id.toString().padStart(3, "0")} - ${
      pokemon.name
    }</strong></p>
      <button onclick="openLightbox(
        '${pokemon.id}',
        '${pokemon.name}',
        '${pokemon.types}',
        '${pokemon.region}',
        '${pokemon.legendary}',
        '${pokemon.description.replace(/'/g, "&apos;")}'
      )">
        En savoir plus
      </button>
    `;

    container.appendChild(div);
  }
}

function openLightbox(id, name, types, region, legendary, description) {
  lightboxTitle.textContent = `#${id.toString().padStart(3, "0")} - ${name}`;
  lightboxDescription.innerHTML = `
    <strong>Type:</strong> ${types}<br>
    <strong>Région:</strong> ${region}<br>
    <strong>Statut:</strong> ${legendary}<br>
    <strong>Description:</strong> ${description}
  `;
  lightbox.style.display = "flex";
}

function closeLightbox() {
  lightbox.style.display = "none";
}

function getGenerationRange(gen) {
  const ranges = {
    1: [1, 151],
    2: [152, 251],
    3: [252, 386],
    4: [387, 493],
    5: [494, 649],
    6: [650, 721],
    7: [722, 809],
    8: [810, 905],
    9: [906, 1025],
  };
  return ranges[gen] || [1, 151];
}

searchInput.addEventListener("input", () =>
  loadPokemons(generationSelect.value)
);
generationSelect.addEventListener("change", () =>
  loadPokemons(generationSelect.value)
);

loadPokemons(1);

let sound = new Audio("../audio/combat.mp3");
sound.play();
