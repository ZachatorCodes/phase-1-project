const searchResultsStorage = document.getElementById("search-results");
const button = document.getElementById("search-button");
const searchBar = document.getElementById("search-bar");
const gameInfo = document.getElementById("game-info");
let storesArray;

document.addEventListener("DOMContentLoaded", () => {
    fetch("https://www.cheapshark.com/api/1.0/stores")
    .then(response => response.json())
    .then(data => {
        storesArray = data;
    })
    .catch(error => {
        console.log("ERROR:", error); 
    })
})

    
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
    const clickForMore = document.createElement("button");

    // assigns text value to elements
    h2.textContent = gameTitle;
    img.src = gameThumbnail;
    cheap.textContent = `Cheapest Available Price: $${cheapestPrice}`;
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

// handles fetching game info for clicked on game
function findGameInfo(event) {
   const gameID = event.target.parentElement.id;
   fetch(`https://www.cheapshark.com/api/1.0/games?id=${gameID}`)
    .then(response => response.json())
    .then(data => {
        gameInfo.innerHTML = "";
        handleGameInfo(data);
    })
    .catch(error => {
        console.log("ERROR:", error);
    })
}

// handles all of the data that fetching the game returns
function handleGameInfo(game) {
    //grabs game info from game object
    const gameTitle = game.info.title;
    const gameThumbnail = game.info.thumb;
    const arrayOfDeals = game.deals;
    const cheapestPrice = game.cheapestPriceEver.price;

    // creates needed elements
    const h1 = document.createElement("h1");
    const img = document.createElement("img");
    const h4 = document.createElement("h4");
    const basicGameInfo = document.createElement("div");
    const deals = document.createElement("div");
    const dealH3 = document.createElement("h3");

    basicGameInfo.id = "basic-game-info";
    deals.id = "deals";

    // sets element text content
    h1.textContent = gameTitle;
    h4.textContent = `Cheapest Price Ever: $${cheapestPrice}`;
    img.src = gameThumbnail;
    dealH3.textContent = "Deals";
    dealH3.style.textDecoration = "underline";

    // appends it all together
    basicGameInfo.appendChild(h1);
    basicGameInfo.appendChild(h4);
    basicGameInfo.appendChild(img);
    deals.appendChild(dealH3);

    gameInfo.appendChild(basicGameInfo);

    // handles all of the deal objects within the deals array
    arrayOfDeals.forEach(dealInfo => {
        dealInfo => {
            console.log(dealInfo);
        }
    })

    gameInfo.appendChild(deals);

    console.log(game);
    console.log(gameTitle);
    console.log(gameThumbnail);
}