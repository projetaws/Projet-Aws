import React, { useState, useEffect } from 'react';
import axios from 'axios';
import pokemonNames from '../../assets/datas/FR_EN_PokeDict.json';
import './pokedex.css';
import talentHint from '../../assets/images/talentPill.svg';
import genHint from '../../assets/images/genHint.svg';
import detailButton from '../../assets/images/pokedexButton.png'

function Pokedex() {
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
    const [attemptCounter, setAttemptCounter] = useState(0);
    const [showPopup, setShowPopup] = useState(false); // État pour gérer la visibilité du pop-up

    useEffect(() => {
        // Fonction pour générer automatiquement le Pokémon quotidien à minuit
        const generateDailyPokemon = async () => {
            const newDailyPokemon = await getRandomPokemon();
            setDailyPokemon(newDailyPokemon);
        };

        // Obtenez la date actuelle et définissez un délai pour déclencher la génération automatique du Pokémon quotidien à minuit
        const now = new Date();
        const timeUntilMidnight = new Date(now);
        timeUntilMidnight.setHours(24, 0, 0, 0);
        const millisecondsUntilMidnight = timeUntilMidnight - now;
        setTimeout(generateDailyPokemon, millisecondsUntilMidnight);

        // Exécutez generateDailyPokemon immédiatement pour le premier chargement de la page
        generateDailyPokemon();
    }, []); // L'effet ne dépend d'aucune variable et ne sera exécuté qu'une seule fois

    useEffect(() => {
        // Vérifier si le compteur atteint 5 et ajuster l'opacité de l'image de l'indice
        if (attemptCounter >= 5) {
            document.getElementById('talentHintId').style.opacity = 1;
        }
        if (attemptCounter >= 8) {
            document.getElementById('genHintId').style.opacity = 1;
        }
    }, [attemptCounter]);

    const openPopup = () => {
        setShowPopup(true);
    };

    // Fonction pour fermer le pop-up
    const closePopup = () => {
        setShowPopup(false);
    };

    const getRandomPokemon = async () => {
        const pokemonKeys = Object.keys(pokemonNames);
        const randomKey = pokemonKeys[Math.floor(Math.random() * pokemonKeys.length)];
        console.log(randomKey);
        const randomPokemon = await getPokemon(pokemonNames[randomKey]);
        return randomPokemon;
    };

    const handleGenerateRandomPokemon = async () => {
        const newDailyPokemon = await getRandomPokemon();
        setDailyPokemon(newDailyPokemon);
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

                setAttemptCounter(attemptCounter + 1);
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
        <div className='pokedexBg'>
            <div className='pokedexTop'>
                <div className='returnButton'>
                    <div className='circle-1'>
                        <div className='circle-2'></div>
                    </div>
                </div>
            </div>
            <div className='mainContainer'>
                <div className='pokemonTab'>
                    <div className='pokemonTabHeader'>
                        <div className='headerText'>
                            <p>Pokemon</p>
                            <p>Type 1</p>
                            <p>Type 2</p>
                            <p>Habitat</p>
                            <p>Couleur</p>
                            <p>Stade d'evolution</p>
                            <p>Taille</p>
                            <p>Poids</p>
                            <p>Generation</p>
                        </div>
                    </div>
                    <div className='pokemonTabContainer'>
                        {pokemonDataList.map((pokemonData, index) => (
                            <div key={index} className="dynamic-div">
                                <p><img className='sprite' src={pokemonData.pokemonSprite} alt={pokemonData.name} /></p>
                                <p style={{ backgroundColor: pokemonData.pokemonTypes[0] === dailyPokemon.pokemonTypes[0] ? '#29E43C' : '#EB0F0F' }}>
                                    {pokemonData.pokemonTypes[0]}
                                </p>
                                <p style={{ backgroundColor: pokemonData.pokemonTypes[1] === dailyPokemon.pokemonTypes[1] ? '#29E43C' : '#EB0F0F' }}>
                                    {pokemonData.pokemonTypes[1] || 'Aucun'}
                                </p>
                                <p style={{ backgroundColor: pokemonData.pokemonHabitat === dailyPokemon.pokemonHabitat ? '#29E43C' : '#EB0F0F' }}>
                                    {pokemonData.pokemonHabitat}
                                </p>
                                <p style={{ backgroundColor: pokemonData.colors === dailyPokemon.colors ? '#29E43C' : '#EB0F0F' }}>
                                    {pokemonData.colors}
                                </p>
                                <p style={{ backgroundColor: pokemonData.evolutionStage === dailyPokemon.evolutionStage ? '#29E43C' : '#EB0F0F' }}>
                                    {pokemonData.evolutionStage}
                                </p>
                                <p style={{ backgroundColor: pokemonData.height === dailyPokemon.height ? '#29E43C' : '#EB0F0F' }}>
                                    {pokemonData.height * 10} cm
                                </p>
                                <p style={{ backgroundColor: pokemonData.weight === dailyPokemon.weight ? '#29E43C' : '#EB0F0F' }}>
                                    {pokemonData.weight / 10} kg
                                </p>
                                <p style={{ backgroundColor: pokemonData.generation === dailyPokemon.generation ? '#29E43C' : '#EB0F0F' }}>
                                    {pokemonData.generation}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className='pokemonTabFooter'>
                        <div className='redPoint'></div>
                        <input className='inputPokemon'
                            type="text"
                            placeholder="Nom du Pokémon"
                            value={pokemonName}
                            onChange={handleInputChange}
                            onKeyDown={handleInputKeyDown}
                        />
                        <div className='details'>
                            <button className='detailsButton' onClick={openPopup}>
                                <img src={detailButton} alt="detail"/>
                            </button>
                        </div>
                    </div>
                </div>
                <div className='spaceBar'></div>
                <div className='sideComponent'>
                    <div className='ruleComponent'>
                        <div className='rules'>
                            <p>defi Journalier :</p>
                            <p>Mettez a l'epreuve votre connaissance des pokémons et devoilez le mystère qui se cache derriere cette enigme..</p>
                        </div>
                        <div className='hints'>
                            <button>
                                <img id="talentHintId" src={talentHint} alt="talentHint" style={{ opacity: 0.5 }} />
                            </button>
                            <button>
                                <img id='genHintId' src={genHint} alt="talentHint" style={{ opacity: 0.5 }} />
                            </button>
                        </div>
                        <div className='hintText'>
                            <p>Talent</p>
                            <p>Géneration</p>
                        </div>
                    </div>
                    <div className='pokemonDropDownList'>
                        {pokemonName.trim() !== '' && // Vérifie si la zone de texte n'est pas vide
                            Object.keys(pokemonNames).filter((name) => name.toLowerCase().startsWith(pokemonName.toLowerCase())).map((name, index) => (
                                <p key={index}>{name}</p>
                            ))
                        }
                    </div>

                    <div>
                        <div>
                        
                        </div>
                    </div>
                </div>
            </div>
            {/* Popup */}
            {showPopup && (
                <div className="popup">
                    <div className="popupTop">
                        <h2>Code couleur</h2>
                        <button onClick={closePopup}>Fermer</button>
                    </div>
                    <div className='popupBottom'>
                        <div className='correctAnwser'>
                            <div className=''></div>
                            <div></div>
                        </div>
                        <div className='wrongAnswer'>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Pokedex;