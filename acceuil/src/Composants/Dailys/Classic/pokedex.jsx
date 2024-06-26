import React, { useState, useEffect } from 'react';
import axios from 'axios';
import pokemonNames from '../../assets/datas/FR_EN_PokeDict.json';
import './pokedex.css';
import talentHint from '../../assets/images/talentPill.svg';
import habitatHint from '../../assets/images/habitatHint.png';
import detailButton from '../../assets/images/pokedexButton.png'
import redPoint from '../../assets/images/redPoint.svg';
import greenPoint from '../../assets/images/greenPoint.svg';
import bgImage from '../../assets/images/Allgenv2.png';
import lower from '../../assets/images/lower.png'
import higher from '../../assets/images/higher.png'


async function getPokemonsOfTheDay() {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://pokezapserver.vercel.app/daily-pokemons', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }); // Assurez-vous que l'URL est correcte
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
}

async function addGame1AdvancementItem(newItem) {
    try {
        // Récupérer l'ID utilisateur depuis le stockage local
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        // Vérifier si l'ID utilisateur est présent
        if (!userId) {
            console.error("Erreur : ID utilisateur non trouvé dans le stockage local.");
            return;
        }

        // Envoyer une requête POST à la route '/game1Advancement/add/:userId' sur le serveur local avec l'ID utilisateur et l'élément à ajouter
        const response = await axios.post(`https://pokezapserver.vercel.app/game1Advancement/add/${userId}`, { newItem }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // Si la requête a réussi, afficher le message de réussite
        console.log(response.data.message);
    } catch (error) {
        // Si la requête a échoué, afficher l'erreur
        console.error("Erreur lors de l'ajout d'un élément à la liste game1Advancement :", error.response.data.error);
    }
}
async function addGame1ScoreItem(newItem) {
    try {
        // Récupérer l'ID utilisateur depuis le stockage local
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        // Vérifier si l'ID utilisateur est présent
        if (!userId) {
            console.error("Erreur : ID utilisateur non trouvé dans le stockage local.");
            return;
        }

        // Envoyer une requête POST à la route '/game1Score/add/:userId' sur le serveur local avec l'ID utilisateur et l'élément à ajouter
        const response = await axios.post(`https://pokezapserver.vercel.app/update-game1score/add/${userId}`, { newItem }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // Si la requête a réussi, afficher le message de réussite
        console.log(response.data.message);
    } catch (error) {
        // Si la requête a échoué, afficher l'erreur
        console.error("Erreur lors de l'ajout d'un élément à la liste game1Score :", error.response.data.error);
    }
}

async function getGameAdvancement(userId) {
    try {
        const token = localStorage.getItem('token');
        // Envoyer une requête GET à la route '/game1Advancement/:userId' sur le serveur local avec l'ID utilisateur
        const response = await axios.get(`https://pokezapserver.vercel.app/gameAdvancement/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // Si la requête a réussi, retourner la liste game1Advancement
        return response.data;
    } catch (error) {
        // Si la requête a échoué, afficher l'erreur
        console.error("Erreur lors de la récupération de la liste gameAdvancement :", error.response.data.error);
        return null;
    }
}

function calculateScore(numAttempts) {
    // Initialiser le score à 100
    let score = 100;

    // Calculer le nombre d'erreurs
    const numErrors = (numAttempts > 1) ? (numAttempts * (numAttempts + 1)) / 2 : 0;

    // Déduire les points en fonction du nombre d'erreurs
    score -= numErrors;

    // Assurer que le score ne devienne pas négatif
    score = Math.max(score, 0);
    console.log(typeof (score))
    return score;
}

function Pokedex() {

    const [pokemonName, setPokemonName] = useState('');
    const [pokemonDataList, setPokemonDataList] = useState([]);
    const [dailyPokemon, setDailyPokemon] = useState(null);
    const [attemptCounter, setAttemptCounter] = useState(0);
    const [showColorAnswerPopup, setShowColorAnswerPopup] = useState(false); // État pour gérer la visibilité du pop-up
    const [showTalentHintPopup, setshowTalentHintPopup] = useState(false); // Etat pout gérer la visibilité du pop-up de l'indice du talent
    const [showHabitatHintPopup, setshowHabitatHintPopup] = useState(false);
    const [pokemonFound, setPokemonFound] = useState(false); // Nouvel état pour suivre si le Pokémon du jour a été trouvé
    const [fetched, setFetched] = useState(false);
    useEffect(() => {

        // Fonction pour générer automatiquement le Pokémon quotidien à minuit
        const generateDailyPokemon = async () => {
            const pokemonQuery = await getPokemonsOfTheDay();
            //console.log(pokemonQuery)
            const newDailyPokemon = await getPokemon(pokemonQuery.pokemon1);
            //const val = await getGame1Advancement();
            //console.log('Les pokémons saisis sont : ',val);
            setDailyPokemon(newDailyPokemon);
        };

        // Exécutez generateDailyPokemon immédiatement pour le premier chargement de la page
        generateDailyPokemon();
    }, []); // L'effet ne dépend d'aucune variable et ne sera exécuté qu'une seule fois

    useEffect(() => {
        // Vérifier si le compteur atteint 5 et ajuster l'opacité de l'image de l'indice
        if (attemptCounter >= 5) {
            document.getElementById('talentHintId').style.opacity = 1;
        }
        if (attemptCounter >= 8) {
            document.getElementById('habitatHintId').style.opacity = 1;
        }
    }, [attemptCounter]);

    const fetchData = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const classicAdvancement = await getGameAdvancement(userId);
            if(classicAdvancement.game1Bool == true) {
                setPokemonFound(true)
            }
            if (classicAdvancement.game1Advancement) {
                const pokemonDataPromises = classicAdvancement.game1Advancement.map(async item => {
                    return await getPokemon(item);
                });
                const fetchedPokemonData = await Promise.all(pokemonDataPromises);
                console.log(fetchedPokemonData[0])
    
                // Mettre à jour l'état pokemonDataList avec toutes les données d'avancement récupérées 
                setPokemonDataList(fetchedPokemonData.reverse());
                setAttemptCounter(fetchedPokemonData.length)
                //localStorage.setItem('classicAdvancement', JSON.stringify(pokemonData.reverse()));
            } else {
                //localStorage.setItem('classicAdvancement', JSON.stringify([]));
                setPokemonDataList([]);
            }
    
        } catch (error) {
            console.error("Erreur lors de la récupération du profil du joueur :", error);
        }
        return true; // Assurez-vous de retourner une valeur
    }
    
    
    useEffect(() => {
        if (!fetched) {
            fetchData();
            setFetched(true);
            console.log(pokemonDataList)
        }
    }, [fetched, fetchData]);
    console.log(pokemonDataList)
    

    
    const openColorAnswerPopup = () => {
        setShowColorAnswerPopup(true);
    };

    // Fonction pour fermer le pop-up
    const closeColorAnswerPopup = () => {
        setShowColorAnswerPopup(false);
    };

    const openTalentHintPopup = () => {
        setshowTalentHintPopup(true);
    };

    // Fonction pour fermer le pop-up
    const closeTalentHintPopup = () => {
        setshowTalentHintPopup(false);
    };

    const openHabitatHintPopup = () => {
        setshowHabitatHintPopup(true);
    };

    // Fonction pour fermer le pop-up
    const closeHabitatHintPopup = () => {
        setshowHabitatHintPopup(false);
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

    const getPokemonAbility = async (pokemonDetails) => {
        try {
            const abilities = pokemonDetails.data.abilities;
            const abilityNames = await Promise.all(abilities.map(async (ability) => {
                const abilityResponse = await axios.get(ability.ability.url);
                const abilityNameFr = abilityResponse.data.names.find(name => name.language.name === 'fr').name;
                return abilityNameFr;
            }));
            return abilityNames;
        } catch (error) {
            console.error('Erreur lors de la récupération des capacités Pokémon :', error.message);
            return [];
        }
    };

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
        const talent = await getPokemonAbility(pokemonDetails);
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
            talent: talent,
        };
        //console.log(newPokemonData.talent);
        return newPokemonData;
    }

    const handleInputSubmit = async () => {
        if (pokemonName.trim() !== '' && !pokemonFound) {
            try {
                setAttemptCounter(attemptCounter + 1);

                // Récupération du nom du pokémon en Anglais pour L'API
                const pokemonEnglishName = getEnglishPokemonName(pokemonName);

                // Récupérer le pokémon saisi par l'utilisateur
                const userPokemonData = await getPokemon(pokemonEnglishName);

                // Créez une nouvelle copie du tableau avec le nouvel élément au début
                const updatedList = [userPokemonData, ...pokemonDataList];

                // Mettez à jour l'état avec la nouvelle copie du tableau
                setPokemonDataList(updatedList);

                // Enregistrer l'avancement du joueur dans la base de données
                addGame1AdvancementItem(pokemonEnglishName);

                if (pokemonEnglishName.toLowerCase() === dailyPokemon.name.toLowerCase()) {
                    setPokemonFound(true); // Marquez le Pokémon comme trouvé
                    const score = calculateScore(attemptCounter + 1)
                    addGame1ScoreItem(score)
                }

                setPokemonName('');
            } catch (error) {
                console.error('Erreur lors de la requête à Pokeapi :', error.message);
            }
        }
    };
    return (
        <body style={{ backgroundImage: `url(${bgImage})`, backgroundPosition: 'center', backgroundSize: 'cover', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
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
                                <div className='colNames'>
                                    <p>Pokemon</p>
                                </div>
                                <div className='colNames'>
                                    <p>Type 1</p>
                                </div>
                                <div className='colNames'>
                                    <p>Type 2</p>
                                </div>
                                <div className='colNames'>
                                    <p>Habitat</p>
                                </div>
                                <div className='colNames'>
                                    <p>Couleur(s)</p>
                                </div>
                                <div className='colNames'>
                                    <p>Stade d'evolution</p>
                                </div>
                                <div className='colNames'>
                                    <p>Taille</p>
                                </div>
                                <div className='colNames'>
                                    <p>Poids</p>
                                </div>
                                <div className='colNames'>
                                    <p>Generation</p>
                                </div>
                            </div>
                        </div>
                        <div className='pokemonTabContainer'>
                            {dailyPokemon && pokemonDataList.map((pokemonData, index) => (
                                <div key={index} className="dynamic-div">
                                    <div className='bgAnswserCard'>
                                        <div className='answerCard'>
                                            <img className='sprite' src={pokemonData.pokemonSprite} alt={pokemonData.name} />
                                        </div>
                                    </div>
                                    <div className='bgAnswserCard'>
                                        <div className='answerCard'
                                            style={{ backgroundColor: pokemonData.pokemonTypes[0] === dailyPokemon.pokemonTypes[0] ? '#29E43C' : '#EB0F0F' }}>
                                            <span>{pokemonData.pokemonTypes[0]}</span>
                                        </div>
                                    </div>
                                    <div className='bgAnswserCard'>
                                        <div className='answerCard'
                                            style={{ backgroundColor: pokemonData.pokemonTypes[1] === dailyPokemon.pokemonTypes[1] ? '#29E43C' : '#EB0F0F' }}>
                                            <span>{pokemonData.pokemonTypes[1] || 'Aucun'}</span>
                                        </div>
                                    </div>
                                    <div className='bgAnswserCard'>
                                        <div className='answerCard'
                                            style={{ backgroundColor: pokemonData.pokemonHabitat === dailyPokemon.pokemonHabitat ? '#29E43C' : '#EB0F0F' }}>
                                            <span>{pokemonData.pokemonHabitat}</span>
                                        </div>
                                    </div>
                                    <div className='bgAnswserCard'>
                                        <div className='answerCard'
                                            style={{ backgroundColor: pokemonData.colors === dailyPokemon.colors ? '#29E43C' : '#EB0F0F' }}>
                                            <span>{pokemonData.colors}</span>
                                        </div>
                                    </div>
                                    <div className='bgAnswserCard'>
                                        <div className='answerCard'
                                            style={{ backgroundColor: pokemonData.evolutionStage === dailyPokemon.evolutionStage ? '#29E43C' : '#EB0F0F' }}>
                                            <span>{pokemonData.evolutionStage}</span>
                                        </div>
                                    </div>
                                    <div className='bgAnswserCard'>
                                        <div className='answerCard'
                                            style={{ backgroundColor: pokemonData.height === dailyPokemon.height ? '#29E43C' : '#EB0F0F' }}>
                                            <span>{pokemonData.height * 10} cm</span>
                                        </div>
                                    </div>
                                    <div className='bgAnswserCard'>
                                        <div className='answerCard'
                                            style={{ backgroundColor: pokemonData.weight === dailyPokemon.weight ? '#29E43C' : '#EB0F0F' }}>
                                            <span>{pokemonData.weight / 10} kg</span>
                                        </div>
                                    </div>
                                    <div className='bgAnswserCard'>
                                        <div className='answerCard'
                                            style={{ backgroundColor: pokemonData.generation === dailyPokemon.generation ? '#29E43C' : '#EB0F0F' }}>
                                            <span>{pokemonData.generation}</span>
                                        </div>
                                    </div>
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
                                disabled={pokemonFound} // Désactiver l'entrée si le Pokémon est trouvé
                            />
                            <div className='details'>
                                <button className='detailsButton' onClick={openColorAnswerPopup}>
                                    <img src={detailButton} alt="detail" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='spaceBar'></div>
                    <div className='sideComponent'>
                        <div className='sCPosition'>
                            <div className='ruleComponent'>
                                <div className='rules'>
                                    <p>defi Journalier :</p>
                                    <p>Mettez a l'epreuve votre connaissance des pokémons et devoilez le mystère qui se cache derriere cette enigme..</p>
                                </div>
                                <div className='hints'>
                                    <button onClick={openTalentHintPopup} disabled={attemptCounter < 5}>
                                        <img id="talentHintId"
                                            src={talentHint}
                                            alt="talentHint"
                                            style={{ opacity: 0.5, width: 75 }}
                                        />
                                    </button>
                                    <button
                                        onClick={openHabitatHintPopup}
                                        disabled={attemptCounter < 8}>
                                        <img id='habitatHintId' src={habitatHint} alt="talentHint" style={{ opacity: 0.5, width: 75 }} />
                                    </button>
                                </div>
                            </div>
                            <div className='pokemonDropDownList'>
                                {pokemonName.trim() !== '' && // Vérifie si la zone de texte n'est pas vide
                                    Object.keys(pokemonNames).filter((name) => name.toLowerCase().startsWith(pokemonName.toLowerCase())).map((name, index) => (
                                        <p key={index}>{name}</p>
                                    ))
                                }
                            </div>
                        </div>
                        <div>
                            <div>

                            </div>
                        </div>
                    </div>
                </div>

                {showHabitatHintPopup && (
                    <div className='popup'>
                        <div className='popupContent'>
                            <div className='popupPlacement'>
                                <p>Habitat du Pokemon :</p>
                                <button
                                    className='detailCloseButton'
                                    onClick={closeHabitatHintPopup}>X
                                </button>
                            </div>
                            <div className='popupPlacement'>
                                <p>{dailyPokemon.pokemonHabitat}</p>
                            </div>
                        </div>
                    </div>
                )}

                {showTalentHintPopup && (
                    <div className='popup'>
                        <div className='popupContent'>
                            <div className='popupPlacement'>
                                <p>Talents du Pokemon :</p>
                                <button
                                    className='detailCloseButton'
                                    onClick={closeTalentHintPopup}>X
                                </button>
                            </div>
                            <div className='popupPlacement'>
                                {dailyPokemon.talent.map((ability, index) => (
                                    <p key={index}>{ability}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Popup */}
                {showColorAnswerPopup && (
                    <div className="popup">
                        <div className='popupContent'>
                            <div className="popupPlacement">
                                <h2>Code couleur</h2>
                                <button
                                    className='detailCloseButton'
                                    onClick={closeColorAnswerPopup}>X
                                </button>
                            </div>
                            <div className='popupPlacement'>
                                <div className='anwser'>
                                    <img src={greenPoint} alt="Round vert significatif d'une réponse correct" />
                                    <p>Correct</p>
                                </div>
                                <div className='anwser'>
                                    <img src={redPoint} alt="Round rouge significatif d'une réponse incorrect" />
                                    <p>Incorrect</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </body>


    );
}

export default Pokedex;