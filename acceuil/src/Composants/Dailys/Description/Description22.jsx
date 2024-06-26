import React, { useState, useEffect } from 'react';
import axios from 'axios';
import backgroundImage from '../../assets/images/Allgenv2.png';
import './Description.css';
import pokemonNames from '../../assets/datas/pokemon_names.json';

const DescriptionGame = () => {
  const [currentPokemon, setCurrentPokemon] = useState(null);
  const [description, setDescription] = useState('');
  const [userGuess, setUserGuess] = useState('');
  const [frenchName, setFrenchName] = useState('');
  const [suggestionsWithSprites, setSuggestionsWithSprites] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  async function getPokemonsOfTheDay() {
    try {
      const response = await axios.get('http://localhost:4000/daily-pokemons'); // Assurez-vous que l'URL est correcte
      if (response.status === 200) {
        return response.data;
      } else {
        console.log('Erreur lors de la récupération des Pokémons du jour:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des Pokémons du jour:', error.message);
      return null;
    }
  };

  const fetchRandomPokemon = async () => {
    try {
      const pokemonQuery = await getPokemonsOfTheDay();
      console.log(pokemonQuery);
      const newDailyPokemon = await pokemonQuery.pokemon3;
      console.log(newDailyPokemon)
      const randomPokemon = await getPokemonDetails(newDailyPokemon)//Math.floor(Math.random() * 1025) + 1;
      const randomId = randomPokemon.data.id
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      setCurrentPokemon(response.data);

      const speciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${randomId}`);
      const frenchName = speciesResponse.data.names.find(name => name.language.name === 'fr').name;
      setFrenchName(frenchName);
      setShowSuccessMessage(false); // Réinitialiser le message de succès
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchRandomPokemon();
  }, []);

  useEffect(() => {
    const fetchPokemonDescription = async () => {
      if (currentPokemon) {
        try {
          let frenchDescription = '';
          if (currentPokemon.id === 1024) {
            frenchDescription = "Il se protège en transformant de l’énergie en cristal solide. Ce Pokémon est à l’origine du phénomène de Téracristallisation.";
          } else if (currentPokemon.id === 1025) {
            frenchDescription = "Il fait manger à sa cible un mochi empoisonné qui éveille les désirs et révèle le potentiel. Il la contrôle ensuite grâce à ses chaînes.";
          } else {
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${currentPokemon.id}`);
            const { flavor_text_entries } = response.data;
            const frenchDescriptionEntry = flavor_text_entries.find(entry => entry.language.name === 'fr');
    
            if (frenchDescriptionEntry) {
              frenchDescription = frenchDescriptionEntry.flavor_text;
              const pokemonName = frenchName.toLowerCase();
              const regex = new RegExp(pokemonName, 'gi');
              frenchDescription = frenchDescription.replace(regex, '???');
            }
          }
          setDescription(frenchDescription);
        } catch (error) {
          console.error('Error fetching Pokémon description:', error);
        }
      }
    };

    fetchPokemonDescription();
  }, [currentPokemon, frenchName]);

  const fetchSuggestionsWithSprites = async (suggestions) => {
    const suggestionsWithSpritesPromises = suggestions.map(async (suggestion) => {
      const pokemonDetails = await getPokemonDetails(pokemonNames[suggestion]);
      const pokemonSprite = getPokemonSprite(pokemonDetails);
      return { name: suggestion, sprite: pokemonSprite };
    });
    const suggestionsWithSprites = await Promise.all(suggestionsWithSpritesPromises);
    setSuggestionsWithSprites(suggestionsWithSprites);
  };

  const getPokemonDetails = async (pokemonEnglishName) => {
    return await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonEnglishName.toLowerCase()}`);
  };

  const getPokemonSprite = (pokemonDetails) => {
    return pokemonDetails.data.sprites.front_default;
  };

  const handleInputChange = (event) => {
    const value = event.target.value.toLowerCase();
    setUserGuess(value);

    const filteredSuggestions = Object.keys(pokemonNames).filter((key) =>
      key.toLowerCase().startsWith(value)
    );

    if (value.trim() !== '') {
      fetchSuggestionsWithSprites(filteredSuggestions);
    } else {
      setSuggestionsWithSprites([]);
    }
  };

  const testGuess = (guess) => {
    if (currentPokemon && guess.trim().toLowerCase() === frenchName.toLowerCase()) {
      return true;
    }
    return false;
  };

  const handleSuggestionClick = (suggestionName) => {
    setUserGuess(suggestionName); // Mettre à jour userGuess avec le nom de la suggestion
    handleGuess(); // Appeler handleGuess directement lorsque la suggestion est cliquée
  };

  const handleGuess = () => {
    setUserGuess((prevUserGuess) => {
      if (testGuess(prevUserGuess)) {
        setShowSuccessMessage(true); // Afficher le message de succès si la devinette est correcte
      } else {
        resetUserGuess();
      }
      return prevUserGuess; // Retourne l'ancienne valeur de userGuess
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleGuess();
    }
  };

  const resetUserGuess = () => {
    setUserGuess(''); // Réinitialiser la zone de texte userGuess
  };

  return (
    <div style={{ backgroundImage: `url(${backgroundImage})`,backgroundPosition: 'center', backgroundSize: 'cover', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', overflow: 'hidden' }}>
      <div className="container">
        <div className="description-box">
          {/*<h2>{frenchName}</h2>*/}
          <div className='p'>{description}</div>
          <input
            type="text"
            value={userGuess}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Entrez le nom du Pokémon"
            className="guess-input"
          />
          <br />
          <button onClick={handleGuess} className="submit-button">Soumettre</button>
        </div>
        {showSuccessMessage && (
          <div className="success-message">
            Bravo ! Vous avez deviné correctement.
          </div>
        )}
        {userGuess.trim() !== '' && (
          <div className="bottom-box">
            <div className="suggestions-box">
              {suggestionsWithSprites.map((suggestion, index) => (
                <div key={index} className="suggestion" onClick={() => handleSuggestionClick(suggestion.name)}>
                  <img src={suggestion.sprite} alt={suggestion.name} className="suggestion-image" />
                  <span>{suggestion.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DescriptionGame;
