const pokemonContainer =
    document.getElementById("pokemonContainer");

const deckContainer =
    document.getElementById("deckContainer");

const rollButton =
    document.getElementById("rollButton");

const counter =
    document.getElementById("counter");

const deckCounter =
    document.getElementById("deckCounter");


// Array que guarda os 10 Pokémon atuais
let pokemons = [];


// Pokémon que estão trancados
let lockedPokemon = new Set();


// Pokémon que estão no deck
let deck = [];


// Tipos e suas cores
const typeColors = {

    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD"

};


// Busca um Pokémon na PokéAPI
async function getPokemon(id) {

    const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${id}`
    );

    const data = await response.json();

    return data;
}


// Gera um número aleatório
function randomPokemonId() {

    return Math.floor(
        Math.random() * 151
    ) + 1;

}


// Cria uma carta
function createCard(pokemon, index) {

    const card =
        document.createElement("div");

    card.className = "pokemon-card";


    // Verifica se está trancado
    if (lockedPokemon.has(index)) {

        card.classList.add("locked");

    }


    const types =
        pokemon.types.map(type => {

            const name =
                type.type.name;

            return `
                <span
                    class="type"
                    style="background:${typeColors[name]}"
                >
                    ${name}
                </span>
            `;

        }).join("");


    card.innerHTML = `

        <span class="pokemon-number">
            #${String(pokemon.id).padStart(3, "0")}
        </span>

        <button
            class="lock-button"
            onclick="toggleLock(${index})"
        >
            ${lockedPokemon.has(index) ? "🔒" : "🔓"}
        </button>

        <img
            src="${pokemon.sprites.other['official-artwork'].front_default}"
            alt="${pokemon.name}"
        >

        <div class="pokemon-name">
            ${pokemon.name}
        </div>

        <div class="types">
            ${types}
        </div>

    `;


    return card;
}


// Mostra os Pokémon
function renderPokemons() {

    pokemonContainer.innerHTML = "";


    pokemons.forEach((pokemon, index) => {

        const card =
            createCard(pokemon, index);

        pokemonContainer.appendChild(card);

    });


    counter.textContent =
        `${pokemons.length} / 10`;

}


// Trancar / destrancar
function toggleLock(index) {

    if (lockedPokemon.has(index)) {

        lockedPokemon.delete(index);

    } else {

        lockedPokemon.add(index);

        addToDeck(pokemons[index]);

    }


    renderPokemons();

    renderDeck();

}


// Adiciona Pokémon ao deck
function addToDeck(pokemon) {

    // Não permite duplicados
    const alreadyInDeck =
        deck.some(item => item.id === pokemon.id);

    if (!alreadyInDeck) {

        deck.push(pokemon);

    }

}


// Mostra o deck
function renderDeck() {

    deckContainer.innerHTML = "";


    if (deck.length === 0) {

        deckContainer.innerHTML = `
            <p class="empty-deck">
                🔒 Tranque um Pokémon
                para adicioná-lo ao seu deck.
            </p>
        `;

    }


    deck.forEach(pokemon => {

        const card =
            document.createElement("div");

        card.className = "deck-card";

        card.innerHTML = `

            <img
                src="${pokemon.sprites.front_default}"
                alt="${pokemon.name}"
            >

            <p>
                ${pokemon.name}
            </p>

            <small>🔒 Protegido</small>

        `;

        deckContainer.appendChild(card);

    });


    deckCounter.textContent =
        `${deck.length} Pokémon`;

}


// ROLA A MÁQUINA
async function rollMachine() {

    rollButton.disabled = true;

    rollButton.textContent =
        "🎰 SORTEANDO...";


    const promises = [];


    for (let i = 0; i < 10; i++) {

        // Se estiver trancado,
        // mantém o Pokémon atual
        if (lockedPokemon.has(i)) {

            promises.push(
                Promise.resolve(pokemons[i])
            );

        } else {

            promises.push(
                getPokemon(
                    randomPokemonId()
                )
            );

        }

    }


    pokemons =
        await Promise.all(promises);


    renderPokemons();


    rollButton.disabled = false;

    rollButton.textContent =
        "🎰 ROLAR POKÉMON";

}


// Evento do botão
rollButton.addEventListener(
    "click",
    rollMachine
);


// Carrega os primeiros 10
async function initialize() {

    rollButton.textContent =
        "⏳ CARREGANDO...";

    rollButton.disabled = true;


    const promises = [];

    for (let i = 1; i <= 10; i++) {

        promises.push(
            getPokemon(i)
        );

    }


    pokemons =
        await Promise.all(promises);


    renderPokemons();

    renderDeck();


    rollButton.textContent =
        "🎰 ROLAR POKÉMON";

    rollButton.disabled = false;

}


// Inicia o site
initialize();