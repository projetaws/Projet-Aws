import React, { useState } from 'react';
import axios from 'axios';
import './classic.css';
import pokemonNames from '../../assets/datas/FR_EN_PokeDict.json';
import pokedexraw from '../../assets/RawPokedex.svg';

function Test() {
  const [pokemonName, setPokemonName] = useState('');
  const [pokemonDataList, setPokemonDataList] = useState([]);

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
        const speciesResponse = await axios.get(pokemonDetailsResponse.data.species.url);

        const types = await Promise.all(pokemonDetailsResponse.data.types.map(async (type) => await getTypeNameInFrench(type.type.name)));
        const habitatInFrench = await getHabitatNameInFrench(speciesResponse.data.habitat ? speciesResponse.data.habitat.name : 'Inconnu');
        const colorsInFrench = await getColorNameInFrench(speciesResponse.data.color.name);

        const height = pokemonDetailsResponse.data.height;
        const weight = pokemonDetailsResponse.data.weight;
        const pokemonId = pokemonDetailsResponse.data.id;
        const generation = getGenerationByPokemonId(pokemonId);

        const newPokemonData = {
          name: pokemonName,
          types: types,
          habitat: habitatInFrench,
          colors: colorsInFrench,
          height: height,
          weight: weight,
          generation: generation,
        };

        setPokemonDataList((prevList) => [...prevList, newPokemonData]);
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
            <p>Nom du Pokémon: {pokemonData.name}</p>
            <p>Types: {pokemonData.types.join(', ')}</p>
            <p>Habitat: {pokemonData.habitat}</p>
            <p>Couleurs: {pokemonData.colors}</p>
            <p>Hauteur: {pokemonData.height * 10} cm</p>
            <p>Poids: {pokemonData.weight / 10} kg</p>
            <p>Generation: {pokemonData.generation}</p>
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

