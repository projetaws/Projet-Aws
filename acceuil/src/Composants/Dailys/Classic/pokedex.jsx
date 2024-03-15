import React, { useState } from 'react';
import './pokedex.css';

function pokedex() {
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
                    <div className='pokemonTabHeader'></div>
                    <div className='pokemonTabContainer'></div>
                    <div className='pokemonTabFooter'></div>
                </div>
                <div className='spaceBar'></div>
                <div className='sideComponent'>
                    <div className='ruleComponent'></div>
                    <div className='pokemonDropDownList'></div>
                </div>
            </div>
        </div>
    );
}

export default pokedex;