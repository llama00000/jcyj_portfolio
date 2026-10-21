// Card image filenames used in the game
const cardsFont = [
  "card01.jpg",
  "card02.jpg",
  "card03.jpg",
  "card04.jpg",
  "card05.jpg",
  "card06.jpg",
  "card07.jpg",
  "card08.jpg"
];

// Game state variables
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let timerInterval;
let seconds = 0;
let steps = 0;
let gameStarted = false;
let gameInitialized = false;
let paused = false; 

// Button Allow States
let allowStart = true;
let allowRestart = false;
let allowHelp = true;

// Helper function to toggle the visual fade for disabled buttons
function updateButtonVisuals() {
  const startBtn = document.getElementById("startBtn");
  const restartBtn = document.getElementById("restartBtn");
  const helpBtn = document.getElementById("helpBtn");

  if (allowStart) startBtn.classList.remove("btn-disabled");
  else startBtn.classList.add("btn-disabled");

  if (allowRestart) restartBtn.classList.remove("btn-disabled");
  else restartBtn.classList.add("btn-disabled");

  if (allowHelp) helpBtn.classList.remove("btn-disabled");
  else helpBtn.classList.add("btn-disabled");
}

// Starts the game timer	 
function startTimer() {
   seconds = 0;
   clearInterval(timerInterval);
   document.getElementById("timer").textContent = "Time: " + seconds + "s";         
     timerInterval = setInterval(function() {
       seconds = seconds + 1;
         document.getElementById("timer").textContent = "Time: " + seconds + "s";
     }, 1000);
}

// Stops the game timer  
function stopTimer() {
  clearInterval(timerInterval);
}

// Resumes the game timer without resetting seconds
function resumeTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(function() {
    seconds = seconds + 1;
    document.getElementById("timer").textContent = "Time: " + seconds + "s";
  }, 1000);
}

// Randomly shuffles an array using Fisher-Yates algorithm        
function shuffle(array) {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;            
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex = currentIndex - 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
  return array;
}

// Creates a single card DOM element with front/back sides 
function createCard(imgFileName) {
  let card = document.createElement('div');
  card.className = 'card';
            
  let cardInner = document.createElement('div');
  cardInner.className = 'card-inner';
            
  let front = document.createElement('div');
  front.className = 'card-front';
            
  let back = document.createElement('div');
  back.className = 'card-back';
            
  let img = document.createElement('img');
    img.src = "images/" + imgFileName;
    img.alt = "card image";
    back.appendChild(img);
            
    cardInner.appendChild(front);
    cardInner.appendChild(back);
    card.appendChild(cardInner);
            
    card.addEventListener('click', function() {
      if (!gameStarted || paused) return;
      if (lockBoard || card.classList.contains('matched') || card === firstCard) return;
                
      card.classList.add('flipped');            
        if (!firstCard) {
          firstCard = card;
        } 
	    else {
          secondCard = card;
          checkMatch();
        }
    });            
  return card;
}
     
// Checks if two flipped cards match	 
function checkMatch() {
  lockBoard = true;        
    let img1 = firstCard.querySelector('img').src;
    let img2 = secondCard.querySelector('img').src;
    steps = steps + 1;
      document.getElementById("steps").textContent = "Steps: " + steps;
    
	let isMatch = (img1 === img2);        
      if (isMatch) {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
                
        let matchedCards = document.querySelectorAll('.card.matched');
        if (matchedCards.length === 16) {
          stopTimer();
          gameStarted = false; // Game over
          
          // Update logic states: 
          // Game over -> can't Start, CAN Restart, can't Help
          allowStart = false; 
          allowRestart = true;  // <--- 修复：结束游戏后允许重置
          allowHelp = false;    
          updateButtonVisuals(); // Update opacity
          
		  showWinPopup();
        }
          resetTurn();
      } 
	  else {
        setTimeout(function() {
          firstCard.classList.remove('flipped');
          secondCard.classList.remove('flipped');
          resetTurn();
        }, 1000);
      }
}

// Resets card selection after each attempt
function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}
        
// Initializes and starts a new game
function startGame() {
  if (!allowStart) return; // Blocks if not allowed

  let board = document.getElementById('gameBoard');
  board.innerHTML = "";

  let allCards = shuffle(cardsFont.concat(cardsFont));
  for (let i = 0; i < allCards.length; i++) {
    let card = createCard(allCards[i]);
    board.appendChild(card);
  }

  firstCard = null;
  secondCard = null;
  lockBoard = false;
  paused = false;

  steps = 0;
  seconds = 0;
  document.getElementById("steps").textContent = "Steps: 0";
  document.getElementById("timer").textContent = "Time: 0s";

  gameStarted = true;
  gameInitialized = true;
  startTimer();

  // Game is running: can't start, can restart, can open help
  allowStart = false;
  allowRestart = true;
  allowHelp = true;
  updateButtonVisuals();
}

// Resets and clears the game
function restartGame() {
  if (!allowRestart) return; // Blocks if not allowed

  stopTimer();
  gameStarted = false;
  gameInitialized = false;
  paused = false;

  let board = document.getElementById('gameBoard');
  board.innerHTML = "";
  document.getElementById("steps").textContent = "Steps: 0";
  document.getElementById("timer").textContent = "Time: 0s";

  // Reset to initial state: can start, can't restart, can read help
  allowStart = true;
  allowRestart = false;
  allowHelp = true;
  updateButtonVisuals();
}

// Displays the victory popup with performance summary
function showWinPopup() {
  document.getElementById("winPopup").style.display = "flex";
  document.getElementById("winMessage").innerHTML = "Congratulations🎉!<BR>You completed the game!<BR>Time taken: " + seconds + "<BR>Steps taken: " + steps;
}

// Hides the victory popup
function closeWinPopup() {
  document.getElementById("winPopup").style.display = "none";
}

// Opens the help popup and pauses the timer if the game is running
function helpGame() {
  if (!allowHelp) return; // Blocks if not allowed

  if (gameStarted && !paused) {
    paused = true;
    stopTimer();
  }
  document.getElementById("helpPopup").style.display = "block";
}

// Closes the help popup and resumes the timer if it was paused
function closeHelpAndResume() {
  document.getElementById("helpPopup").style.display = "none";
  if (gameStarted && paused) {
    paused = false;
    resumeTimer();
  }
}
      
// Event bindings after page load	  
window.onload = function () {
  const closeHelpPopupBtn = document.getElementById("closePopup");
  const closeWinBtn = document.getElementById("closeWinPopup");
  
  if (closeHelpPopupBtn) {
    closeHelpPopupBtn.addEventListener("click", closeHelpAndResume);
  }

  window.addEventListener("click", function (event) {
    if (event.target === document.getElementById("helpPopup")) {
      closeHelpAndResume();
    }
  });
  
  if (closeWinBtn) {
    closeWinBtn.addEventListener("click", closeWinPopup);
  }

  // Initialize button visual states when page loads
  updateButtonVisuals();
};