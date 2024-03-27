import React, { useState } from 'react';
import axios from 'axios';
import './classic.css';
import pokemonNames from '../../assets/datas/FR_EN_PokeDict.json';
import pokezapTitle from '../../assets/images/pokezap.png'
import abilityIcon from '../../assets/images/talentPill.svg'
import habitatIcon from '../../assets/images/habitatHint.png'

function Test() {
  const [pokemonName, setPokemonName] = useState('');
  const [pokemonDataList, setPokemonDataList] = useState([]);
  const [dailyPokemon, setDailyPokemon] = useState(null);
  const [comparisonResults, setComparisonResults] = useState({
    isEqualName: false,
    isEqualType1: false,
    isEqualType2: false,
    isEqualHabitat: false,
    isEqualColors: false,
    isEqualEvolutionStage: false,
    isEqualHeight: false,
    isEqualWeight: false,
    isEqualGeneration: false,
  });

  const getRandomPokemon = async () => {
    const pokemonKeys = Object.keys(pokemonNames);
    const randomKey = pokemonKeys[Math.floor(Math.random() * pokemonKeys.length)];
    console.log(randomKey);
    const randomPokemon = await getPokemon(pokemonNames[randomKey]);
    return randomPokemon;
  };

  const getLastDailyPokemonDate = () => {
    return localStorage.getItem('lastDailyPokemonDate');
  };

  const setLastDailyPokemonDate = () => {
    const currentDate = new Date().toISOString();
    localStorage.setItem('lastDailyPokemonDate', currentDate);
  };

  const handleGenerateRandomPokemon = async () => {
    const newDailyPokemon = await getRandomPokemon();
    setDailyPokemon(newDailyPokemon);
    setLastDailyPokemonDate();
  };

  const handleInputChange = (event) => {
    setPokemonName(event.target.value);
  };

  const getEnglishPokemonName = (frenchName) => {
    return pokemonNames[frenchName] || frenchName;
  };

  const getTypeNameInFrench = async (typeName) => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/type/${typeName}`);
      return response.data.names.find((name) => name.language.name === 'fr').name;
    } catch (error) {
      console.error('Erreur lors de la récupération du nom français du type :', error.message);
      return 'Inconnu';
    }
  };

  const getHabitatName = async (speciesDetails) => {
    try {
      const englishHabitat = speciesDetails.data.habitat ? speciesDetails.data.habitat.name : 'Inconnu';
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-habitat/${englishHabitat}`);
      return response.data.names.find((name) => name.language.name === 'fr').name;
    } catch (error) {
      console.error('Erreur lors de la récupération du nom français de l\'pokemonHabitat :', error.message);
      return 'Inconnu';
    }
  };

  const getColorName = async (speciesDetails) => {
    try {
      const englishColor = speciesDetails.data.color.name;
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-color/${englishColor}`);
      return response.data.names.find((name) => name.language.name === 'fr').name;
    } catch (error) {
      console.error('Erreur lors de la récupération du nom français de la couleur :', error.message);
      return 'Inconnu';
    }
  };

  const getEvolutionStage = async (species) => {
    try {
      const evolutionChainUrl = species.data.evolution_chain.url;

      const evolutionChainResponse = await axios.get(evolutionChainUrl);
      let evolv_stage = 1;

      // Fonction récursive pour calculer le stade d'évolution
      const calculateEvolutionStage = (chain) => {
        if (chain.species.name !== species.data.name) {
          evolv_stage += 1;
        } else {
          return evolv_stage;
        }

        if (chain.evolves_to && chain.evolves_to.length > 0) {
          chain.evolves_to.forEach((evolution) => {
            calculateEvolutionStage(evolution);
          });
        }
      };

      // Appel initial de la fonction pour démarrer le processus
      calculateEvolutionStage(evolutionChainResponse.data.chain);

      return evolv_stage;
    } catch (error) {
      console.error('Erreur lors de la récupération de la chaîne d\'évolution :', error.message);
      return [];
    }
  };

  const getGenerationByPokemonId = (pokemonId) => {
    if (pokemonId <= 151) {
      return 1;
    } else if (pokemonId <= 251) {
      return 2;
    } else if (pokemonId <= 386) {
      return 3;
    } else if (pokemonId <= 493) {
      return 4;
    } else if (pokemonId <= 649) {
      return 5;
    } else if (pokemonId <= 721) {
      return 6;
    } else if (pokemonId <= 809) {
      return 7;
    } else if (pokemonId <= 898) {
      return 8;
    } else {
      return 9;
    }
  };

  const handleInputKeyDown = async (event) => {
    if (event.key === 'Enter') {
      await handleInputSubmit();
    }
  };

  const getPokemonDetails = async (pokemonEnglishName) => {
    return await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonEnglishName.toLowerCase()}`);
  }

  const getPokemonSprite = (pokemonDetails) => {
    return pokemonDetails.data.sprites.front_default;
  }

  const getPokemonSpecies = async (pokemonDetails) => {
    return await axios.get(pokemonDetails.data.species.url);
  }

  const getPokemonTypes = async (pokemonDetails) => {
    return await Promise.all(pokemonDetails.data.types.map(async (type) => await getTypeNameInFrench(type.type.name)));
  }

  const getPokemonHeight = (pokemonDetails) => {
    return pokemonDetails.data.height;
  }

  const getPokemonWeight = (pokemonDetails) => {
    return pokemonDetails.data.weight;
  }

  const getPokemonId = (pokemonDetails) => {
    return pokemonDetails.data.id;
  }

  const getPokemon = async (pokemonName) => {

    // Récupération des informations général du pokémon (cf. doc PokeAPI)
    const pokemonDetails = await getPokemonDetails(pokemonName);

    // Récupération des informations sur l'espèce du Pokemon (cf. doc PokeAPI)
    const speciesDetails = await getPokemonSpecies(pokemonDetails);

    // Récupération des éléments à afficher, nécéssaires au jeu

    const pokemonSprite = getPokemonSprite(pokemonDetails);
    const pokemonTypes = await getPokemonTypes(pokemonDetails);
    const pokemonHabitat = await getHabitatName(speciesDetails);
    const pokemonColor = await getColorName(speciesDetails);
    const evolutionStage = await getEvolutionStage(speciesDetails);
    const height = getPokemonHeight(pokemonDetails);
    const weight = getPokemonWeight(pokemonDetails);
    const pokemonId = getPokemonId(pokemonDetails);
    const generation = getGenerationByPokemonId(pokemonId);
    const newPokemonData = {
      name: pokemonName,
      pokemonSprite: pokemonSprite,
      pokemonTypes: pokemonTypes,
      pokemonHabitat: pokemonHabitat,
      colors: pokemonColor,
      height: height,
      weight: weight,
      evolutionStage: evolutionStage,
      generation: generation,
    };

    return newPokemonData;
  }

  const handleInputSubmit = async () => {
    if (pokemonName.trim() !== '') {
      try {
        // Récupération du nom du pokémon en Anglais pour L'API
        const pokemonEnglishName = getEnglishPokemonName(pokemonName);

        // Récupérer le pokémon saisi par l'utilisateur
        const userPokemonData = await getPokemon(pokemonEnglishName);

        // Comparaison des informations
        const isEqualName = userPokemonData.name.toLowerCase() === dailyPokemon.name.toLowerCase();
        const isEqualType1 = userPokemonData.pokemonTypes[0] === dailyPokemon.pokemonTypes[0];
        const isEqualType2 = (userPokemonData.pokemonTypes[1] || 'Aucun') === (dailyPokemon.pokemonTypes[1] || 'Aucun');
        const isEqualHabitat = userPokemonData.pokemonHabitat === dailyPokemon.pokemonHabitat;
        const isEqualColors = userPokemonData.colors === dailyPokemon.colors;
        const isEqualEvolutionStage = userPokemonData.evolutionStage === dailyPokemon.evolutionStage;
        const isEqualHeight = userPokemonData.height === dailyPokemon.height;
        const isEqualWeight = userPokemonData.weight === dailyPokemon.weight;
        const isEqualGeneration = userPokemonData.generation === dailyPokemon.generation;

        // Mise à jour de l'état avec les résultats de la comparaison
        setComparisonResults({
          isEqualName,
          isEqualType1,
          isEqualType2,
          isEqualHabitat,
          isEqualColors,
          isEqualEvolutionStage,
          isEqualHeight,
          isEqualWeight,
          isEqualGeneration,
        });


        // Créez une nouvelle copie du tableau avec le nouvel élément au début
        const updatedList = [userPokemonData, ...pokemonDataList];

        // Mettez à jour l'état avec la nouvelle copie du tableau
        setPokemonDataList(updatedList);

        setPokemonName('');
      } catch (error) {
        console.error('Erreur lors de la requête à Pokeapi :', error.message);
      }
    }
  };

  return (
    <div className='gameScreen'>
      <div className="headerContainer">
        <img src={pokezapTitle} alt="Pokezap" />
      </div>
      <div className='mainContainer'>
        <div className='gameContainer'>
          <div className='rulesFrame'>
            <div className='rulesContainer'>
              <div className='generationIndicator'>
                <span>Generation : 1-3</span>
              </div>
              <div>
                <span>Devine le Pokemon du jour !</span>
              </div>
              <div className='hintsContainer'>
                <div className='hint'>
                  <div>
                    <img src={abilityIcon} alt="Talent du Pokemon" style={{ opacity: 0.5, width: 75 }} />
                  </div>
                  <div>
                    <span> Indice : Talent</span>
                  </div>
                </div>
                <div className='hint'>
                  <div>
                    <img src={habitatIcon} alt="Localisation du Pokemon" style={{ opacity: 0.5, width: 75 }} />
                  </div>
                  <div>
                    <span> Indice : Habitat</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='answer'>
            <div className='userInput'>
              <input
                type="text"
                placeholder="Nom du Pokémon"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Test; 