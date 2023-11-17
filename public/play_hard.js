const gameBoard = document.getElementById("game-board");
const ctx = gameBoard.getContext("2d");
const gridSize = 10;
let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let dx = 0;
let dy = 0;
let gameInterval;
let score = 0;

function getPlayerName() {
  // Retrieve the player's name from local storage or wherever it is stored
  const playerName = localStorage.getItem("username");
  return playerName || "Mystery Player"; // Return a default name if not found
}

function drawSnake() {
  snake.forEach((segment) => {
    ctx.fillStyle = "green";
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
  });
}
// Simulate chat messages
setInterval(() => {
  const score = Math.floor(Math.random() * 1000);
  const chatText = document.querySelector('#player-messages');
  chatText.innerHTML =
    `<div class="event"><span class="player-event">${getPlayerName()}</span> scored ${score}</div>` + chatText.innerHTML;
}, 5000);


function drawFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function update() {
  const newHead = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(newHead);

  if (newHead.x === food.x && newHead.y === food.y) {
    // Snake ate food
    food.x = Math.floor(Math.random() * (gameBoard.width / gridSize));
    food.y = Math.floor(Math.random() * (gameBoard.height / gridSize));
    score += 1; // Increase the score
    document.getElementById("score").innerHTML = `Score: ${score}`;
  } else {
    snake.pop(); // Remove tail if no food eaten
  }
}

function checkCollision() {
  const head = snake[0];

  if (
    head.x < 0 ||
    head.x >= gameBoard.width / gridSize ||
    head.y < 0 ||
    head.y >= gameBoard.height / gridSize
  ) {
    gameOver();
  }

  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      gameOver();
    }
  }
}

function gameOver() {
  clearInterval(gameInterval);
  alert(`Game Over! Your score: ${score}`);
  saveScore(score);
}

function clearBoard() {
  ctx.clearRect(0, 0, gameBoard.width, gameBoard.height);
}

function gameLoop() {
  clearBoard();
  drawSnake();
  drawFood();
  update();
  checkCollision();
}

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      if (dy === 0) {
        dx = 0;
        dy = -1;
      }
      break;
    case "ArrowDown":
      if (dy === 0) {
        dx = 0;
        dy = 1;
      }
      break;
    case "ArrowLeft":
      if (dx === 0) {
        dx = -1;
        dy = 0;
      }
      break;
    case "ArrowRight":
      if (dx === 0) {
        dx = 1;
        dy = 0;
      }
      break;
  }
});

// Your saveScore and updateScores functions
function saveScore(score) {
  const userName = getPlayerName();
  let scores = [];
  const scoresText = localStorage.getItem('scores');
  if (scoresText) {
    scores = JSON.parse(scoresText);
  }
  scores = updateScores(userName, score, scores);

  localStorage.setItem('scores', JSON.stringify(scores));
}
// Function to simulate chat messages
function simulateChat() {
  const chatText = document.querySelector('.chat');
  const score = Math.floor(Math.random() * 1000);
  const message = `<div class="event"><span class="player-event">${getPlayerName()}</span> scored ${score}</div>`;
  chatText.insertAdjacentHTML('afterbegin', message);
}

// Call the function to start the chat simulation
setInterval(simulateChat, 5000);


function updateScores(userName, score, scores) {
  const date = new Date().toLocaleDateString();
  const newScore = { name: userName, score: score, date: date };

  let found = false;
  for (const [i, prevScore] of scores.entries()) {
    if (score > prevScore.score) {
      scores.splice(i, 0, newScore);
      found = true;
      break;
    }
  }

  if (!found) {
    scores.push(newScore);
  }

  if (scores.length > 10) {
    scores.pop();
  }

  return scores;
}

// Get a reference to the restart button
const restartButton = document.getElementById("restart-button");

// Add a click event listener to the restart button
restartButton.addEventListener("click", () => {
  resetGame();
});

function resetGame() {
  // Clear the canvas
  clearBoard();

  // Remove old snake segments
  snake.length = 0;

  // Initialize the game state back to its initial values
  snake.push({ x: 10, y: 10 });
  food = { x: 5, y: 5 };
  dx = 0;
  dy = 0;
  score = 0;
  document.getElementById("score").innerHTML = `Score: ${score}`;

  // Clear any existing game interval
  clearInterval(gameInterval);

  // Start a new game loop
  gameInterval = setInterval(gameLoop, 100);
}

gameInterval = setInterval(gameLoop, 30);
