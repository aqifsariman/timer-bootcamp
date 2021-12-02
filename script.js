// boardSize has to be an even number
const boardSize = 4;
const board = [];
let firstCard = null;
let firstCardElement;
let deck;


const grid = [
  ['A', 'B'],
  ['Y', 'Z'],
];

const upperLeftPosition = grid[0][0]; // 'A'
const upperRightPosition = grid[0][1]; // 'B'
const lowerLeftPosition = grid[1][0]; // 'Y'
const lowerRightPosition = grid[1][1]; // 'Z'

const makeDeck = (cardAmount) => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suits = ['❤', '♦', '♣', '♠'];

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
      if (cardName === '1') {
        cardName = 'A';
      } else if (cardName === '11') {
        cardName = 'J';
      } else if (cardName === '12') {
        cardName = 'Q';
      } else if (cardName === '13') {
        cardName = 'K';
      }
      if (currentSuit === '❤' || currentSuit ==='♦'){
        var color = 'red';
      } else if (currentSuit === '♣' || currentSuit === '♠'){
        var color = 'black'
      }

      // make a single card object variable
      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
        cardColor: color
      };
/* 
      console.log(`rank: ${rankCounter}`); */

      // add the card to the deck
      newDeck.push(card); // add double the cards to the deck
     /*  newDeck.push(card); */
    }
  }
let shuffledCards = shuffleCards(newDeck);
let zeroToEight = shuffledCards.slice(0,8)
let zeroToEight2 = shuffledCards.slice(0,8)
Array.prototype.push.apply(zeroToEight,zeroToEight2); 
console.log(zeroToEight)
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
/* console.log(cardElement);
  onsole.log('FIRST CARD DOM ELEMENT', firstCard);
  console.log('BOARD CLICKED CARD', board[column][row]); */
    
    const clickedCard = board[column][row]; 
    
    // the user already clicked on this square
    if( cardElement.innerText !== '' ){
        return;
    }

    // first turn
    if (firstCard === null) {
      console.log('first turn');
      firstCard = clickedCard;
      
      // turn this card over
      cardElement.innerText = firstCard.name;  
      cardElement.innerText += firstCard.suit;  

      // hold onto this for later when it may not match
      firstCardElement = cardElement;
    // second turn
    } else {
    
      console.log('second turn');
      if (
        clickedCard.name === firstCard.name &&
        clickedCard.suit === firstCard.suit
      ) {
        console.log('match');
    
        // turn this card over
        cardElement.innerText = clickedCard.name;
        cardElement.innerText += clickedCard.suit;

      } else {
        cardElement.innerText = clickedCard.name;
        cardElement.innerText += clickedCard.suit;

        setTimeout(() => {
          cardElement.innerText = '';
          // turn this card back over
          firstCardElement.innerText = '';
         
        }, 500);
        console.log('NOT a match');
      }
       // reset the first card
      firstCard = null;
    }
};

// create all the board elements that will go on the screen
// return the built board
const buildBoardElements = (board) => {

  // create the element that everything will go inside of
  const boardElement = document.createElement('div');

  // give it a class for CSS purposes
  boardElement.classList.add('board');

  // use the board data structure we passed in to create the correct size board
  for (let i = 0; i < board.length; i += 1) {
    // make a var for just this row of cards
    const row = board[i];

    // make an element for this row of cards
    const rowElement = document.createElement('div');
    rowElement.classList.add('row');

    // make all the squares for this row
    for (let j = 0; j < row.length; j += 1) {
      // create the square element
      const square = document.createElement('div');

      // set a class for CSS purposes
      square.classList.add('square');

      // set the click event
      // eslint-disable-next-line
      square.addEventListener('click', (event) => {
        // we will want to pass in the card element so
        // that we can change how it looks on screen, i.e.,
        // "turn the card over"
        squareClick(event.currentTarget, i, j);
      });

      rowElement.appendChild(square);
      console.log(rowElement)
    }
    boardElement.appendChild(rowElement);
    boardElement.style.display = "none"
  }

  // using DOM to create start button
const startButton= document.createElement('button')
startButton.setAttribute("class","start-button")
startButton.innerText = "CLICK TO START";
document.body.appendChild(startButton)

// creating H2 to display game message
const gameMessage = document.createElement('h2')
gameMessage.setAttribute('class', 'game-message')
document.body.appendChild(gameMessage)

// once start button clicked
startButton.addEventListener("click", () => {
  // once button click, the button will disappear
startButton.style.display ="none"
// this resets the gamemessage at the start of the round
gameMessage.innerText = ''
let seconds = 10
const delayInseconds =1;
const output = document.createElement('div')
output.setAttribute("class","timer")
output.innerText = seconds
document.body.appendChild(output)
// setting timer to 20s (20000)
const timer = setInterval(() => {
  boardElement.style.display = ""
  output.innerText = seconds.toFixed(1)
if(seconds <= 0){
  clearInterval(timer)
  gameMessage.innerText = 'You ran out of time!'
  output.innerText=""
  startButton.style.display =""
  boardElement.style.display = "none"
}
seconds -= 0.01;  
}, delayInseconds);
})
  
  return boardElement;
};

const initGame = () => {
  // create this special deck by getting the doubled cards and
  // making a smaller array that is ( boardSize squared ) number of cards
  let doubleDeck = makeDeck();
  /* let deckSubset = doubleDeck.slice(0, boardSize * boardSize); */
  deck = shuffleCards(doubleDeck);
  

  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }
console.log(board)
  const boardEl = buildBoardElements(board);
  document.body.appendChild(boardEl);
  
};

initGame()