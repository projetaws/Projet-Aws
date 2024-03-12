import React, { useState, useEffect } from 'react';
import axios from 'axios';


export const Classic = () => {
    const [divList, setDivList] = useState([]);
    const [pokemonName, setPokemonName] = useState('');

    const addDiv = (name, types) => {
        const newDiv = (
            <div key={divList.length} className="dynamic-div">
                <p>Nom du Pokémon: {name}</p>
                <p>Types: {types.join(', ')}</p>
            </div>
        );

        setDivList([...divList, newDiv]);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (pokemonName.trim() === '') {
                return;
            }

            try {
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
                const pokemonTypes = response.data.types.map((type) => type.type.name);

                addDiv(pokemonName, pokemonTypes);
            } catch (error) {
                console.error('Erreur lors de la requête à Pokeapi :', error.message);
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pokemonName]); // Ne dépend que de pokemonName

    const handleInputChange = (event) => {
        setPokemonName(event.target.value);
    };

    return (
        <div className="classic-container">
            <div className="div-container">
                {divList.map((div, index) => (
                    <React.Fragment key={index}>{div}</React.Fragment>
                ))}
            </div>
            <div className='inputPokemon'>
                <input
                    type="text"
                    placeholder="Nom du Pokémon"
                    value={pokemonName}
                    onChange={handleInputChange}
                />
            </div>
        </div>
    );
};

export default Classic;
