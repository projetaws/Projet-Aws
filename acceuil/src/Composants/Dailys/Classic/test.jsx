import React, { useState } from 'react';
import axios from 'axios';
import './classic.css';
import pokemonNames from '../../assets/datas/FR_EN_PokeDict.json';
import pokedexraw from '../../assets/RawPokedex.svg';

function Test() {
  const [pokemonName, setPokemonName] = useState('');
  const [pokemonDataList, setPokemonDataList] = useState([]);

  const getRandomPokemon = (pokemonNames) => {
    const pokemonKeys = Object.keys(pokemonNames);
    const randomKey = pokemonKeys[Math.floor(Math.random() * pokemonKeys.length)];
    const randomPokemon = {
      frenchName: randomKey,
      englishName: pokemonNames[randomKey],
    };
    console.log(randomPokemon.frenchName)
    return randomPokemon;
  };

  const dailyPokemon = getRandomPokemon(pokemonNames);
  console.log(dailyPokemon)

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

  const getHabitatNameInFrench = async (habitatName) => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-habitat/${habitatName}`);
      return response.data.names.find((name) => name.language.name === 'fr').name;
    } catch (error) {
      console.error('Erreur lors de la récupération du nom français de l\'habitat :', error.message);
      return 'Inconnu';
    }
  };

  const getColorNameInFrench = async (colorName) => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-color/${colorName}`);
      return response.data.names.find((name) => name.language.name === 'fr').name;
    } catch (error) {
      console.error('Erreur lors de la récupération du nom français de la couleur :', error.message);
      return 'Inconnu';
    }
  };

  const getEvolutionChain = async (species) => {
    try {
      const evolutionChainUrl = species.data.evolution_chain.url;
      
      const evolutionChainResponse = await axios.get(evolutionChainUrl);
      let evolv_stage = 1;
      
      // Fonction récursive pour calculer le stade d'évolution
      const calculateEvolutionStage = (chain) => {
        console.log(chain.evolves_to && chain.evolves_to.length > 0);
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

  const handleInputSubmit = async () => {
    if (pokemonName.trim() !== '') {
      try {
        const englishName = getEnglishPokemonName(pokemonName);
        const pokemonDetailsResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${englishName.toLowerCase()}`);

        const sprite = pokemonDetailsResponse.data.sprites.front_default;

        const speciesResponse = await axios.get(pokemonDetailsResponse.data.species.url);

        const types = await Promise.all(pokemonDetailsResponse.data.types.map(async (type) => await getTypeNameInFrench(type.type.name)));
        const habitatInFrench = await getHabitatNameInFrench(speciesResponse.data.habitat ? speciesResponse.data.habitat.name : 'Inconnu');
        const colorsInFrench = await getColorNameInFrench(speciesResponse.data.color.name);
        console.log(speciesResponse.data.name)

        const height = pokemonDetailsResponse.data.height;
        const weight = pokemonDetailsResponse.data.weight;
        const pokemonId = pokemonDetailsResponse.data.id;
        const generation = getGenerationByPokemonId(pokemonId);
        const evolutionChain = await getEvolutionChain(speciesResponse);

        const newPokemonData = {
          name: pokemonName,
          sprite: sprite,
          types: types,
          habitat: habitatInFrench,
          colors: colorsInFrench,
          height: height,
          weight: weight,
          evolutionChain : evolutionChain,
          generation: generation,
        };

        // Créez une nouvelle copie du tableau avec le nouvel élément au début
        const updatedList = [newPokemonData, ...pokemonDataList];

        // Mettez à jour l'état avec la nouvelle copie du tableau
        setPokemonDataList(updatedList);

        setPokemonName('');
      } catch (error) {
        console.error('Erreur lors de la requête à Pokeapi :', error.message);
      }
    }
  };

  return (
    <div className="classic-container"> 
      <div className='div-container'>
        {pokemonDataList.map((pokemonData, index) => (
          <div key={index} className="dynamic-div">
            <p><img src={pokemonData.sprite} alt={pokemonData.name} 
                style={{ width: '300px', height: '300px' }} /></p>
            <p>{pokemonData.types[0]}</p>
            <p>{pokemonData.types[1] || 'Aucun'}</p>
            <p>{pokemonData.habitat}</p>
            <p>{pokemonData.colors}</p>
            <p>{pokemonData.evolutionChain}</p>
            <p>{pokemonData.height * 10} cm</p>
            <p>{pokemonData.weight / 10} kg</p>
            <p>{pokemonData.generation}</p>
          </div>
        ))}
      </div>
      <img
        src={pokedexraw}
        alt="pokedex"
        width="300"
        height="200"
      />
      
      <div className='inputPokemonContainer'>
        <input className='inputPokemon'
          type="text"
          placeholder="Nom du Pokémon"
          value={pokemonName}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
        />
      </div>
      <div></div>
    </div>
  );
}

export default Test;

