const MAX_POKEMON = 649;

const listWrapper = document.querySelector(".list-wrapper");
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector(".not-found-message");
const closeButton = document.querySelector("#search-close-icon");
const card = document.querySelector("#card");
const popup = document.querySelector(".popup");

const typeColors = {
    bug: "#26de81",
    dragon: "#ffeaa7",
    electric: "#fed330",
    fairy: "#ff0069",
    fighting: "#30336b",
    fire: "#f0932b",
    flying: "#81ecec",
    grass: "#00b894",
    ground: "#efb549",
    ghost: "#a55eea",
    ice: "#74b9ff",
    normal: "#95afc0",
    poison: "#6c5ce7",
    psychic: "#a29bfe",
    rock: "#2d3436",
    water: "#0190ff",
}


let fullListOfPokemons = [];

let allPokemons = [];


(async () => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`);
    const data = await response.json();
    fullListOfPokemons = data.results;
    allPokemons = fullListOfPokemons.slice(0, 150);
    // console.log(data);
    // console.log(allPokemons);
    displayPokemons(allPokemons);
})();

// fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`).then((response) => response.json()).then((data) => {
//     allPokemons = data.results;
//     console.log(allPokemons);
// });


async function fetchPokemonBeforeRedirect(id){
    try {
        const currPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json())
        return currPokemon;
    } catch (error) {
        console.log("failed to fetch data before redirect");
        // return false;
    }
}


function displayPokemons(pokemon){
    listWrapper.innerHTML = "";

    pokemon.forEach((pokemon) => {
        const pokemonID = pokemon.url.split("/")[6];
        const listItem = document.createElement('div');
        listItem.className = "list-item";
        listItem.innerHTML = `
            <div class="number-wrap">
                <p class="caption-fonts">#${pokemonID}</p>
            </div>
            <div class="image-wrap">
                <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt="${pokemon.name}" />
            </div>
            <div class="name-wrap">
                <p class="body3-fonts">${pokemon.name}</p>
            </div>
        `;


        listItem.addEventListener("click", async () => {
            const success = await fetchPokemonBeforeRedirect(pokemonID);
            generateCard(success);
            popup.style.display = "flex";
        })

        listWrapper.appendChild(listItem);
    });


}



let generateCard = (pokemon) => {
    console.log(pokemon)
    const hp = pokemon.stats[0].base_stat;
    const imgSrc = pokemon.sprites.other.dream_world.front_default;
    const name = pokemon.name;
    const statAttack = pokemon.stats[1].base_stat;
    const statDefense = pokemon.stats[2].base_stat;
    const statSpeed = pokemon.stats[5].base_stat;


    const themeColor = typeColors[pokemon.types[0].type.name];
    console.log(themeColor)

    card.innerHTML = `
        <img src="${imgSrc}" alt="${name}" />
                <div class="left-container">
                    <h2 class="poke-name">
                        ${name}
                        <span>#${pokemon.id}</span>
                    </h2>
                    <div class="text">
                        <p class="hp">
                            <span>HP :</span>
                              ${hp}
                          </p>
                        <div class="types" style="color: ${themeColor}">
                          
                        </div>
                    </div>
                    <div class="stats">
                      <div class="stat-content">
                          <h3>${statAttack}</h3>
                          <p style="color: ${themeColor}">Attack</p>
                      </div>
                      <div class="line"></div>
                      <div class="stat-content">
                          <h3>${statDefense}</h3>
                          <p style="color: ${themeColor}">Defence</p>
                      </div>
                      <div class="line"></div>
                      <div class="stat-content">
                          <h3>${statSpeed}</h3>
                          <p style="color: ${themeColor}">Speed</p>
                      </div>
                    </div>
                </div>
                <img src="./images/cancel.png" class="close-icon" />
    `
    // card.classList.add("bg");
    appendTypes(pokemon.types);
    styleCard(themeColor);

    const closePopup = document.querySelector(".close-icon");
    closePopup.addEventListener("click", () => {
        popup.style.display = "none";
    });
    window.onclick = function(event) {
        if(event.target == popup && event.target != card){
            popup.style.display = "none";
        }
    }
}

const typeDiv = document.querySelector(".types");

let appendTypes = (types) => {
    console.log(types);
    types.forEach((type) => {
        let span = document.createElement("span");
        span.textContent = type.type.name;
        document.querySelector(".types").appendChild(span);
        console.log(span);
    })
}


let styleCard = (themeColor) => {
    card.style.setProperty('--theme-color', themeColor);
    card.style.background = `radial-gradient(circle at right center, #fff 0%, #fff 70%, ${themeColor} 70%, ${themeColor} 100%)`;
}





searchInput.addEventListener("keyup", handleSearch);

function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    let regex = /^\d+$/;
    var regExp = /[a-zA-Z]/g;
    let filteredPokemons;
    if(regex.test(searchTerm)){
        filteredPokemons = fullListOfPokemons.filter((pokemon) => {
            const pokemonID = pokemon.url.split("/")[6];
            // console.log(searchTerm);
            return pokemonID.startsWith(searchTerm) | pokemonID.includes(searchTerm);
        })
    }else if(regExp.test(searchTerm)){
        filteredPokemons = fullListOfPokemons.filter((pokemon) => {
            return pokemon.name.toLowerCase().startsWith(searchTerm) || pokemon.name.toLowerCase().includes(searchTerm);
        })
    }else{
        filteredPokemons = allPokemons;
    }

    displayPokemons(filteredPokemons);

    if(filteredPokemons.length === 0){
        notFoundMessage.style.display = "flex";
    }else{
        notFoundMessage.style.display = "none";
    }

}

closeButton.addEventListener("click", clearSearchField);

function clearSearchField() {
    searchInput.value = "";
    displayPokemons(allPokemons);
}



