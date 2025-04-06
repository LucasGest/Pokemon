const container = document.getElementById("pokemon-container");
const searchInput = document.getElementById("search");
const generationSelect = document.getElementById("generation-select");
const lightbox = document.getElementById("lightbox");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxDescription = document.getElementById("lightbox-description");

let allPokemons = []; // liste en mémoire pour éviter de recharger

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

async function fetchPokemon(id) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await res.json();

    const speciesRes = await fetch(data.species.url);
    const speciesData = await speciesRes.json();

    const nameFr =
      speciesData.names.find((n) => n.language.name === "fr")?.name ||
      data.name;
    const description =
      speciesData.flavor_text_entries
        .find((entry) => entry.language.name === "fr")
        ?.flavor_text.replace(/\n/g, " ") || "Description non disponible.";

    const isLegendary = speciesData.is_legendary
      ? "Légendaire"
      : "Non légendaire";
    const types = data.types.map((t) => traduireType(t.type.name)).join(", ");
    const region = document.querySelector(
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
  } catch (error) {
    console.error("Erreur fetchPokemon:", error);
    return null;
  }
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

function displayPokemons(list) {
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = `<p class="no-results">Aucun Pokémon trouvé.</p>`;
    return;
  }

  list.forEach((pokemon) => {
    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
      <img src="${pokemon.image}" alt="${pokemon.name}">
      <p><strong>#${pokemon.id} ${pokemon.name}</strong></p>
      <button onclick="openLightbox('${pokemon.name}', '${pokemon.types}', '${
      pokemon.region
    }', '${pokemon.legendary}', '${pokemon.description.replace(
      /'/g,
      "&apos;"
    )}')">
        En savoir plus
      </button>
    `;
    container.appendChild(div);
  });
}

async function loadPokemons(gen) {
  const [start, end] = getGenerationRange(gen);
  allPokemons = [];

  for (let i = start; i <= end; i++) {
    const pokemon = await fetchPokemon(i);
    if (pokemon) {
      allPokemons.push(pokemon);
    }
  }

  displayPokemons(allPokemons);
}

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();

  if (query === "") {
    displayPokemons(allPokemons);
    return;
  }

  const filtered = allPokemons.filter((p) =>
    p.name.toLowerCase().includes(query)
  );

  displayPokemons(filtered);
});

generationSelect.addEventListener("change", () => {
  loadPokemons(generationSelect.value);
});

function openLightbox(name, types, region, legendary, description) {
  lightboxTitle.textContent = name;
  lightboxDescription.innerHTML = `
    <strong>Type :</strong> ${types}<br>
    <strong>Région :</strong> ${region}<br>
    <strong>Statut :</strong> ${legendary}<br>
    <strong>Description :</strong> ${description}
  `;
  lightbox.style.display = "flex";
}

function closeLightbox() {
  lightbox.style.display = "none";
}

// Init
loadPokemons(1);
