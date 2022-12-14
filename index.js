const searchResultsStorage = document.getElementById("search-results");
const button = document.getElementById("search-button");
const searchBar = document.getElementById("search-bar");
const gameInfo = document.getElementById("game-info");

button.addEventListener("mouseenter", changeColor);
button.addEventListener("mouseleave", revertColor);

// gets information about all stores once page loads
let storesArray;
document.addEventListener("DOMContentLoaded", () => {
  fetch("https://www.cheapshark.com/api/1.0/stores")
    .then((response) => response.json())
    .then((data) => {
      storesArray = data;
    })
    .catch((error) => {
      console.log("ERROR:", error);
    });
});

// searchs games by title
button.addEventListener("click", (e) => {
  e.preventDefault();
  const searchText = searchBar.value;
  fetch(`https://www.cheapshark.com/api/1.0/games?title=${searchText}`)
    .then((response) => response.json())
    .then((data) => {
      document.querySelector("form").reset();
      searchResultsStorage.innerHTML = "";
      data.forEach((gameObj) => {
        createGameElement(gameObj);
      });
    })
    .catch((error) => {
      console.log("ERROR:", error);
    });
});

// creates a game element to show search results
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
  gameDiv.classList.add("game-cards");
  gameDiv.setAttribute("id", gameID);
  gameDiv.appendChild(h2);
  gameDiv.appendChild(img);
  gameDiv.appendChild(cheap);
  gameDiv.appendChild(clickForMore);
  clickForMore.addEventListener("click", findGameInfo);
  clickForMore.addEventListener("mouseenter", changeColor);
  clickForMore.addEventListener("mouseleave", revertColor);
  searchResultsStorage.appendChild(gameDiv);
}

function changeColor(event) {
  const cardButton = event.target;
  cardButton.style["background-color"] = "#415d43";
  cardButton.style.color = "#b0c4b1";
}

function revertColor(event) {
  const cardButton = event.target;
  cardButton.style["background-color"] = "#aec3b0";
  cardButton.style.color = "black";
}

// handles fetching game info for clicked on game
function findGameInfo(event) {
  const gameID = event.target.parentElement.id;
  fetch(`https://www.cheapshark.com/api/1.0/games?id=${gameID}`)
    .then((response) => response.json())
    .then((data) => {
      gameInfo.innerHTML = "";
      handleGameInfo(data);
    })
    .catch((error) => {
      console.log("ERROR:", error);
    });
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

  basicGameInfo.id = "basic-game-info";
  deals.id = "deals";

  // sets element text content
  h1.textContent = gameTitle;
  h4.textContent = `Cheapest Price Ever: $${cheapestPrice}`;
  img.src = gameThumbnail;

  // appends it all together
  basicGameInfo.appendChild(h1);
  basicGameInfo.appendChild(h4);
  basicGameInfo.appendChild(img);

  gameInfo.appendChild(basicGameInfo);

  // handles all of the deal objects within the deals array
  arrayOfDeals.forEach((dealInfo) => {
    const specificGameDeal = document.createElement("div");
    specificGameDeal.classList.add("game-deal-info");

    // loops through stores to make sure a store is active and that the savings is more than 0, then appends info together and appends that to doc
    for (store of storesArray) {
      if (store.isActive === 1) {
        if (dealInfo.storeID === store.storeID) {
          const storeName = store.storeName;
          const storeImage = `https://www.cheapshark.com/${store.images.banner}`;
          const dealID = dealInfo.dealID;
          const price = dealInfo.price;
          const retailPrice = dealInfo.retailPrice;
          const savingsPercent = parseFloat(dealInfo.savings).toFixed(2);
          if (savingsPercent != 0) {
            const img = document.createElement("img");
            img.src = storeImage;
            specificGameDeal.appendChild(img);

            const p1 = document.createElement("p");
            p1.textContent = `Current Price: $${price}`;
            specificGameDeal.appendChild(p1);

            const p2 = document.createElement("p");
            p2.textContent = `Retail Price: $${retailPrice}`;
            specificGameDeal.appendChild(p2);

            const p3 = document.createElement("p");
            p3.textContent = `Discount: ${savingsPercent}%`;
            specificGameDeal.appendChild(p3);

            const dealButton = document.createElement("button");
            dealButton.textContent = "Visit Deal";
            dealButton.addEventListener("mouseenter", changeColor);
            dealButton.addEventListener("mouseleave", revertColor);
            dealButton.addEventListener("click", () => {
              window
                .open(
                  `https://www.cheapshark.com/redirect?dealID=${dealID}`,
                  "_blank"
                )
                .focus();
            });
            specificGameDeal.appendChild(dealButton);

            deals.appendChild(specificGameDeal);
          }
        }
      }
    }
  });

  gameInfo.appendChild(deals);
}
