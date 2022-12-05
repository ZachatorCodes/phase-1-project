const searchResultsStorage = document.getElementById("search-results");
const button = document.getElementById("search-button");
const searchBar = document.getElementById("search-bar");
    
button.addEventListener("click", e => {
    e.preventDefault();
    const searchText = searchBar.value;
    fetch(`https://www.cheapshark.com/api/1.0/games?title=${searchText}`)
        .then(response => response.json())
        .then(data => {
            document.querySelector("form").reset();
            searchResultsStorage.innerHTML = "";
            data.forEach(gameObj => {
                createGameElement(gameObj);
            });
        })
        .catch(error => {
            console.log("ERROR:", error);
        });
});

function createGameElement(game) {
    // grabs game information and assigns it to variables
    const gameTitle = game.external;
    const gameThumbnail = game.thumb;
    const gameID = game.gameID;
    const cheapestPrice = game.cheapest;

    // creates new elements
    const gameDiv = document.createElement("div");
    const h2 = document.createElement("h2");
    const img = document.createElement("img");
    const cheap = document.createElement("p");
    const clickForMore = document.createElement("p");

    // assigns text value to elements
    h2.textContent = gameTitle;
    img.src = gameThumbnail;
    cheap.textContent = `Cheapest Price: ${cheapestPrice}`;
    clickForMore.textContent = "Click For More";

    // appends it all together
    gameDiv.classList.add("game-cards")
    gameDiv.setAttribute("id", gameID);
    gameDiv.appendChild(h2);
    gameDiv.appendChild(img);
    gameDiv.appendChild(cheap);
    gameDiv.appendChild(clickForMore);
    clickForMore.addEventListener("click", findGameInfo);
    searchResultsStorage.appendChild(gameDiv);
}

function findGameInfo(event) {
   const gameID = event.target.parentElement.id;
   fetch(`https://www.cheapshark.com/api/1.0/games?id=${gameID}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.log("ERROR:", error);
    })
}