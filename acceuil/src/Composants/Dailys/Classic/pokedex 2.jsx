body {
    display: flex; /* Permet d'ordonner les éléments*/
    justify-content: center; /* Centrer horizontalement */
    align-items: center; /* Centrer verticalement */
    height: 100vh; /* Remplir toute la hauteur de la fenêtre */
    margin: 0; /* Supprimer les marges par défaut */
    overflow: hidden;
}

.pokedexBg {
    background-color: #EF0D0D;
    width: 80vw;
    height: 70vh;
    display: flex;
    flex-direction: column; /* Les éléments fils seront alignés en colonne*/
    border-radius: 45px;
    position: relative;
}

.pokedexTop {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 15%;
    bottom: 0%;
    right: 0%;
}

.returnButton {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    height: 100%;
    width: 10%;
}

.circle-1 {
    position: relative;
    width: 50px;
    height: 50px;
    border-radius: 600px;
    border: 2px solid white;
    display: flex;
    justify-content: center;
    align-items: center;
}

.circle-2 {
    position: relative;
    width: 90%;
    height: 90%;
    border-radius: 500px;
    border: 2px solid black;
    background-color: #0DADEF;
}

.mainContainer {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
}

.pokemonTab {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 60%;
    height: 100%;
    margin-left: 2%;
}

.sideComponent {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 40%;
    height: 100%;
}

.pokemonTabHeader{
    position: relative;
    display: flex;
    width: 100%;
    height: 8%;
    background-color: white;
    border-top-left-radius: 32px;
    border-top-right-radius: 32px;
}
.pokemonTabContainer {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 98.8%;
    height: 80%;
    background-color: #0DADEF;
    border-left: solid white 3px;
    border-right: solid white 3px;
}

.pokemonTabFooter {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 12%;
    background-color: white;
    
}


