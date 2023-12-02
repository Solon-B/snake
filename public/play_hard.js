const gameBoard = document.getElementById("game-board");
const ctx = gameBoard.getContext("2d");
const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
const socket = configureWebSocket(protocol); // Use the socket variable from the configuration



const GameEndEvent = 'gameEnd';
const GameStartEvent = 'gameStart';
const gridSize = 10;
let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let dx = 0;
let dy = 0;
let gameInterval;
let score = 0;

function getPlayerName() {
  const playerName = localStorage.getItem("userName");
  return playerName || "Mystery Player";
}

function drawSnake() {
  snake.forEach((segment) => {
    ctx.fillStyle = "green";
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
  });
}

function drawFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function update() {
  const newHead = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(newHead);

  if (newHead.x === food.x && newHead.y === food.y) {
    food.x = Math.floor(Math.random() * (gameBoard.width / gridSize));
    food.y = Math.floor(Math.random() * (gameBoard.height / gridSize));
    score += 1;
    document.getElementById("score").innerHTML = `Score: ${score}`;
  } else {
    snake.pop();
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

async function updateScoresServer(score) {
  const username = getPlayerName();
  const date = new Date().toLocaleDateString();
  const newScore = { name: username, score: score, date: date };

  try {
    const response = await fetch('/api/updateScores', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(newScore),
    });

    // Handle the response from the server if needed
  } catch (error) {
    console.error('Error updating scores on the server:', error);
  }
}

function gameOver() {
  clearInterval(gameInterval);
  alert(`Game Over! Your score: ${score}`);
  saveScore(score);
  updateScoresServer(score); // Update the server with the final score
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
async function saveScore(score) {
  const username = getPlayerName();
  const date = new Date().toLocaleDateString();
  const newScore = { name: username, score: score, date: date };

  try {
    broadcastEvent(username, GameEndEvent, newScore, socket);

    const response = await fetch('/api/scores', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(newScore),
    });

    const scores = await response.json();
    localStorage.setItem('scores', JSON.stringify(scores));
  } catch (error) {
    console.error('Error saving score:', error);
    updateScoresLocal(newScore);
  }
}

function updateScoresLocal(newScore) {
  let scores = [];
  const scoresText = localStorage.getItem('scores');
  if (scoresText) {
    scores = JSON.parse(scoresText);
  }

  let found = false;
  for (const [i, prevScore] of scores.entries()) {
    if (newScore.score > prevScore.score) {
      scores.splice(i, 0, newScore);
      found = true;
      break;
    }
  }

  if (!found) {
    scores.push(newScore);
  }

  if (scores.length > 10) {
    scores.length = 10;
  }

  localStorage.setItem('scores', JSON.stringify(scores));
}

function configureWebSocket(protocol) {
  const socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
  socket.onopen = (event) => {
    displayMsg('system', 'game', 'connected');
  };
  socket.onclose = (event) => {
    displayMsg('system', 'game', 'disconnected');
  };
  socket.onmessage = async (event) => {
    const msg = JSON.parse(event.data);
    if (msg.type === GameEndEvent) {
      displayMsg('player', msg.from, `scored ${msg.value.score}`);
    } else if (msg.type === GameStartEvent) {
      displayMsg('player', msg.from, `started a new game`);
    }
  };

  return socket;
}

function displayMsg(cls, from, msg) {
  const chatText = document.querySelector('#player-messages');
  chatText.innerHTML =
    `<div class="event"><span class="${cls}-event">${from}</span> ${msg}</div>` + chatText.innerHTML;
}

document.addEventListener("DOMContentLoaded", function () {
  const usernameElement = document.getElementById("username");

  // Retrieve the username from local storage
  const savedName = localStorage.getItem("userName"); // Updated key to "userName"

  if (savedName) {
    usernameElement.textContent = savedName;
  }
});

function broadcastEvent(from, type, value, socket) {
  const event = {
    from: from,
    type: type,
    value: value,
  };
  socket.send(JSON.stringify(event));
}

// Get a reference to the restart button
const restartButton = document.getElementById("restart-button");

// Add a click event listener to the restart button
restartButton.addEventListener("click", () => {
  resetGame();
  broadcastEvent(getPlayerName(), GameStartEvent, {}, socket);
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
