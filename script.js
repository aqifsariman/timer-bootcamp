// setting global variables for stopwatch
let watch;
let seconds = 0;
let minutes = 0;
let hours = 0;
let displayMinutes = minutes;
let displaySeconds = seconds.toFixed(2);
const boardSize = 4;
let board = [];
let firstCard = null;
let firstCardElement;
let deck;
let timer;

const makeDeck = (cardAmount) => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suits = ["❤", "♦", "♣", "♠"];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];
    /* console.log(`current suit: ${currentSuit}`); */

    // loop to create all cards in this suit
    // rank 1-13
    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      // Convert rankCounter to string
      let cardName = `${rankCounter}`;

      // 1, 11, 12 ,13
      if (cardName === "1") {
        cardName = "A";
      } else if (cardName === "11") {
        cardName = "J";
      } else if (cardName === "12") {
        cardName = "Q";
      } else if (cardName === "13") {
        cardName = "K";
      }
      if (currentSuit === "❤" || currentSuit === "♦") {
        var color = "red";
      } else if (currentSuit === "♣" || currentSuit === "♠") {
        var color = "black";
      }

      // make a single card object variable
      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
        cardColor: color,
      };

      // add the card to the deck
      newDeck.push(card);
    }
  }
  let shuffledCards = shuffleCards(newDeck);
  let zeroToEight = shuffledCards.slice(0, 8);
  let zeroToEight2 = shuffledCards.slice(0, 8);
  Array.prototype.push.apply(zeroToEight, zeroToEight2);
  return zeroToEight;
};

const getRandomIndex = (max) => Math.floor(Math.random() * max);

const shuffleCards = (cards) => {
  // Loop over the card deck array once
  for (let currentIndex = 0; currentIndex < cards.length; currentIndex += 1) {
    // Select a random index in the deck
    const randomIndex = getRandomIndex(cards.length);
    // Select the card that corresponds to randomIndex
    const randomCard = cards[randomIndex];
    // Select the card that corresponds to currentIndex
    const currentCard = cards[currentIndex];
    // Swap positions of randomCard and currentCard in the deck
    cards[currentIndex] = randomCard;
    cards[randomIndex] = currentCard;
  }
  // Return the shuffled deck
  return cards;
};

const squareClick = (cardElement, column, row) => {
  const clickedCard = board[column][row];

  // the user already clicked on this square
  if (cardElement.innerText !== "") {
    return;
  }

  // first turn
  if (firstCard === null) {
    console.log("first turn");
    firstCard = clickedCard;

    // turn this card over
    cardElement.innerText = firstCard.name;
    cardElement.innerText += firstCard.suit;

    // hold onto this for later when it may not match
    firstCardElement = cardElement;
    // second turn
  } else {
    console.log("second turn");
    if (
      clickedCard.name === firstCard.name &&
      clickedCard.suit === firstCard.suit
    ) {
      console.log("match");

      // turn this card over
      cardElement.innerText = clickedCard.name;
      cardElement.innerText += clickedCard.suit;
    } else {
      cardElement.innerText = clickedCard.name;
      cardElement.innerText += clickedCard.suit;

      setTimeout(() => {
        cardElement.innerText = "";
        // turn this card back over
        firstCardElement.innerText = "";
      }, 500);
      console.log("NOT a match");
    }
    // reset the first card
    firstCard = null;
  }
};

// DOM to create the board.
const boardElement = document.createElement("div");
boardElement.classList.add("board");
boardElement.setAttribute("id", "board");

// create all the board elements that will go on the screen
// return the built board
const buildBoardElements = (board) => {
  // create the element that everything will go inside of

  boardElement.innerHTML = "";

  // use the board data structure we passed in to create the correct size board
  for (let i = 0; i < board.length; i += 1) {
    // make a var for just this row of cards
    const row = board[i];

    // make an element for this row of cards
    const rowElement = document.createElement("div");
    rowElement.classList.add("row");
    rowElement.setAttribute("id", "row");

    // make all the squares for this row
    for (let j = 0; j < row.length; j += 1) {
      // create the square element
      const square = document.createElement("div");

      // set a class for CSS purposes
      square.classList.add("square");

      // set the click event
      // eslint-disable-next-line
      square.addEventListener("click", (event) => {
        // we will want to pass in the card element so
        // that we can change how it looks on screen, i.e.,
        // "turn the card over"
        squareClick(event.currentTarget, i, j);
      });

      rowElement.appendChild(square);
    }
    boardElement.appendChild(rowElement);
  }

  return boardElement;
};

// using DOM to create start timer
const startButton = document.getElementById("start-timer");

// creating H2 to display game message
const gameMessage = document.createElement("h2");
gameMessage.setAttribute("class", "game-message");
document.body.appendChild(gameMessage);

// creating timer board
const output = document.createElement("div");
output.setAttribute("class", "board");
output.setAttribute("id", "timer");

const initGame = () => {
  let doubleDeck = makeDeck();
  deck = shuffleCards(doubleDeck);
  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }
  const boardEl = buildBoardElements(board);
  document.body.appendChild(boardEl);
};

// when start button is clicked
const startButtonClicked = () => {
  // initgame will run once clicked
  initGame();
  // this resets the gamemessage at the start of the round
  gameMessage.innerText = "";
  let seconds = 60;
  const delayInseconds = 1;
  output.innerText = seconds;
  document.body.appendChild(output);
  // setting timer to 20s (20000)
  timer = setInterval(() => {
    output.innerHTML = `You have ${seconds.toFixed(1)}s left`;

    // if falls below zero, ouput message and flip over all cards
    if (seconds <= 0) {
      clearInterval(timer);
      output.innerHTML = "You ran out of time!";
      boardElement.innerHTML = "";
      board = [];
    }
    seconds -= 0.01;
  }, delayInseconds);
};

// once start button clicked, timer will run
startButton.addEventListener("click", () => startButtonClicked());

// creating elements for stopwatch
const startWatch = document.getElementById("start-stopwatch");
const stopStopwatch = document.getElementById("stop-stopwatch");
const elapsedTimeContainer = document.querySelector(".elapsed-time");
const elapsedTimeData = document.createElement("div");
elapsedTimeData.classList.add("elapsed-time");
const resetButton = document.getElementById("reset-button");
elapsedTimeContainer.appendChild(elapsedTimeData);
const lapDataContainer = document.querySelector(".time-data");
const lapButton = document.getElementById("lap-button");

// when stopwatch button is clicked to start
startWatch.addEventListener("click", () => {
  const delayInseconds = 1;
  initGame();

  watch = setInterval(() => {
    // seconds is now incremented
    seconds += 0.01;
    // set conditions to change from sec to min and min to hours
    if (Math.floor(seconds) / 60 === 1) {
      minutes++;
      seconds = 0;
    }
    if (Math.floor(minutes) / 60 === 1) {
      hours++;
      minutes = 0;
    }
    displaySeconds = seconds.toFixed(2);
    // set conditions to change single digits to double digits when less than zero
    if (seconds < 10) {
      displaySeconds = `0${seconds.toFixed(2)}`;
    }
    displayMinutes = minutes;
    if (minutes < 10) {
      displayMinutes = `0${minutes}`;
    }

    // update the elapsedtimedata
    elapsedTimeData.innerText = `${displayMinutes}:${displaySeconds}`;
  }, delayInseconds);
});

lapButton.addEventListener("click", () => {
  const lapDataTime = document.createElement("h4");
  lapDataContainer.appendChild(lapDataTime);
  lapDataTime.innerText = `${displayMinutes}:${displaySeconds}`;
});

// stop stopwatch
stopStopwatch.addEventListener("click", () => {
  console.log("apple");
  elapsedTimeData.innerText = `${displayMinutes}:${displaySeconds}`;
  clearInterval(watch);
});
// reset stopwatch
resetButton.addEventListener("click", () => {
  clearInterval(watch);
  clearInterval(timer);
  seconds = 0;
  minutes = 0;
  displaySeconds = "00";
  displayMinutes = "00";
  lapDataContainer.innerHTML = "";
  boardElement.innerHTML = "";
  output.innerHTML = `${displayMinutes}:${displaySeconds}`;
  board = [];
  elapsedTimeData.innerHTML = `${displayMinutes}:${displaySeconds}`;
});
