document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("search-button");
    const searchBar = document.getElementById("search-bar");
    button.addEventListener("click", e => {
        e.preventDefault();
        const searchText = searchBar.value;
        fetch(`https://www.cheapshark.com/api/1.0/games?title=${searchText}`)
            .then(response => response.json())
            .then(data => {
                data.forEach(gameObj => {
                    createGameElement(gameObj);
                });
            })
            .catch(error => {
                console.log("ERROR:", error);
            })
    });
});

function createGameElement(game) {
    const gameTitle = game.external;
    const gameThumbnail = game.thumb;
    const gameID = game.gameID;
    const steamAppID = game.steamAppID;
    const cheapestPrice = game.cheapest;
    const cheapestDeal = game.cheapestDealID;
}