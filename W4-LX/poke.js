// DOM Objects


const mainScreen = document.querySelector('.main-screen');
const pokeName = document.querySelector('.poke-name');
const pokeId = document.querySelector('.poke-id');
const pokeFrontImage = document.querySelector('.poke-front-image');
const pokeBackImage = document.querySelector('.poke-back-image');
const pokeTypeOne = document.querySelector('.poke-type-one');
const pokeTypeTwo = document.querySelector('.poke-type-two');
const pokeWeight = document.querySelector('.poke-weight');
const pokeHeight = document.querySelector('.poke-height');
const pokeListItems = document.querySelectorAll('.list-item');
const leftButton = document.querySelector('.left-button');
const rightButton = document.querySelector('.right-button');

// constants and variables
const TYPES = [
  'normal', 'fighting', 'flying',
  'poison', 'ground', 'rock',
  'bug', 'ghost', 'steel',
  'fire', 'water', 'grass',
  'electric', 'psychic', 'ice',
  'dragon', 'dark', 'fairy'
];
let prevUrl = null;
let nextUrl = null;


// Functions
const capitalize = (str) => str[0].toUpperCase() + str.substr(1);

const resetScreen = () => {
  mainScreen.classList.remove('hide');
  for (const type of TYPES) {
    mainScreen.classList.remove(type);
  }
};

const fetchPokeList = url => {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const { results, previous, next } = data;
      prevUrl = previous;
      nextUrl = next;

      for (let i = 0; i < pokeListItems.length ; i++) {
        const pokeListItem = pokeListItems[i];
        const resultData = results[i];

        if (resultData) {
          const { name, url } = resultData;
          const urlArray = url.split('/');
          const id = urlArray[urlArray.length - 2];
          pokeListItem.textContent = id + '. ' + capitalize(name);
        } else {
          pokeListItem.textContent = '';
        }
      }
    });
};

  

const fetchPokeData = id => {
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(res => res.json())
    .then(data => {
      resetScreen();

      const dataTypes = data['types'];
      const dataFirstType = dataTypes[0];
      const dataSecondType = dataTypes[1];
      pokeTypeOne.textContent = capitalize(dataFirstType['type']['name']);
      if (dataSecondType) {
        pokeTypeTwo.classList.remove('hide');
        pokeTypeTwo.textContent = capitalize(dataSecondType['type']['name']);
      } else {
        pokeTypeTwo.classList.add('hide');
        pokeTypeTwo.textContent = '';
      }
      mainScreen.classList.add(dataFirstType['type']['name']);

      pokeName.textContent = capitalize(data['name']);
      pokeId.textContent = '#' + data['id'].toString().padStart(3, '0');
      pokeWeight.textContent = data['weight'];
      pokeHeight.textContent = data['height'];
      pokeFrontImage.src = data['sprites']['front_default'] || '';
      pokeBackImage.src = data['sprites']['back_default'] || '';
    });
};

const handleLeftButtonClick = () => {
  if (prevUrl) {
    fetchPokeList(prevUrl);
  }
};

const handleRightButtonClick = () => {
  if (nextUrl) {
    fetchPokeList(nextUrl);
  }
};

const handleListItemClick = (e) => {
  if (!e.target) return;

  const listItem = e.target;
  if (!listItem.textContent) return;

  const id = listItem.textContent.split('.')[0];
  fetchPokeData(id);
};



// adding event listeners


leftButton.addEventListener('click', handleLeftButtonClick);
rightButton.addEventListener('click', handleRightButtonClick);
for (const pokeListItem of pokeListItems) {
  pokeListItem.addEventListener('click', handleListItemClick);
}


// initialize App
fetchPokeList('https://pokeapi.co/api/v2/pokemon?offset=0&limit')

const PokemonContainer = document.getElementById('pokemon__containerID');
const SearchContainer = document.getElementById('search__containerID');
const SearchElement = document.createElement('input');
SearchElement.setAttribute('type', 'text');
SearchElement.setAttribute('name', 'searchBar');
SearchElement.setAttribute('placeholder', 'Search...');
SearchContainer.appendChild(SearchElement);
const PokemonNumber = 151;

const createPokemonCard = (pokemon) => {
    const PokemonElement = document.createElement('div');
    const PokemonName = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
    const PokemonID = pokemon.id;
    const PokemonType = pokemon.types[0].type.name;
    const PokemonTypeColors = {
        fire: '#EE8130',
        grass: '#7AC74C',
        eletric: '#F7D02C',
        water: '#6390F0',
        ground: '#E2BF65',
        rock: '#B6A136',
        fairy: '#D685AD',
        poison: '#A33EA1',
        bug: '#A6B91A',
        dragon: '#6F35FC',
        psychic: '#F95587',
        flying: '#A98FF3',
        fighting: '#C22E28',
        normal: '#A8A77A',
        ice: '#96D9D6',
        ghost: '#735797',
        dark: '#705746',
        steel: '#B7B7CE',
    };
    const AddColors = PokemonTypeColors[PokemonType];
    PokemonElement.style.backgroundColor = AddColors;
    const PokemonInnerHTML = `
    <div class="pokemon__imageContainer">
    <img src="https://pokeres.bastionbot.org/images/pokemon/${PokemonID}.png" />
    </div>
    <div class="pokemon__infomationContainer">
    <span class="pokemon__id">#${PokemonID.toString().padStart(3, '0')}</span>
    <h3 class="pokemon__name">${PokemonName}</h3>
    <small class="pokemon__type">Type: <span>${PokemonType}</span></small>
    </div>`;
    PokemonElement.setAttribute('class', 'pokemon__card');
    PokemonElement.innerHTML = PokemonInnerHTML;
    PokemonContainer.appendChild(PokemonElement);
};

const getPokemons = async (id) => {
    const api_url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const response = await fetch(api_url);
    const data = await response.json();
    createPokemonCard(data);
    createSearchFilter(data);
};

const receivePokemons = async () => {
    for (let item = 1; item <= PokemonNumber; item++) {
        await getPokemons(item);
    }
};

receivePokemons();

const createSearchFilter = (pokemonData) => {
    console.log(pokemonData);
    SearchElement.addEventListener('keyup', (event) => {
        const SearchValue = event.target.value;
        const FilteredPokemons = pokemonData.filter((pokemon) => {
            return (
                pokemon.name.includes(SearchValue) || pokemon.id.includes(SearchValue)
            );
        });
        createPokemonCard(FilteredPokemons);
        console.log(FilteredPokemons);
    });
};

createSearchFilter();