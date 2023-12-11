import React, { useEffect, useState, useRef } from 'react';
import { GameEvent, GameNotifier } from './gameNotifier';

export function SnakeGame() {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [dx, setDx] = useState(0);
  const [dy, setDy] = useState(0);
  const [score, setScore] = useState(0);

  const gameIntervalRef = useRef(null);

  useEffect(() => {
    gameIntervalRef.current = setInterval(() => {
      gameLoop();
    }, 25);

    return () => clearInterval(gameIntervalRef.current);
  }, [dx, dy, snake, food, score]);

  async function saveScore(score) {
    const username = getPlayerName();
    const date = new Date().toLocaleDateString();
    const newScore = { name: username, score: score, date: date };

    try {
      GameNotifier.broadcastEvent(username, GameEvent.End, newScore);

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
  

  function getPlayerName() {
    const playerName = localStorage.getItem('userName');
    return playerName || 'Mystery Player';
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

  async function updateScoresServer(score) {
    const username = getPlayerName();
    const date = new Date().toLocaleDateString();
    const newScore = { name: username, score: score, date: date };
  
    try {
      if (GameNotifier.socket.readyState === WebSocket.OPEN) {
        GameNotifier.broadcastEvent(username, GameEvent.End, newScore);
      }
  
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
  

  function drawSnake(ctx) {
    snake.forEach((segment) => {
      ctx.fillStyle = 'green';
      ctx.fillRect(segment.x * 10, segment.y * 10, 10, 10);
    });
  }

  function drawFood(ctx) {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * 10, food.y * 10, 10, 10);
  }

  function update() {
    const newHead = { x: snake[0].x + dx, y: snake[0].y + dy };
    setSnake([newHead, ...snake]);

    if (newHead.x === food.x && newHead.y === food.y) {
      setFood({
        x: Math.floor(Math.random() * 50),
        y: Math.floor(Math.random() * 30),
      });
      setScore((prevScore) => prevScore + 1);
    } else {
      setSnake((prevSnake) => prevSnake.slice(0, -1));
    }
  }

  function checkCollision() {
    const head = snake[0];

    const canvasWidth = 500;
    const canvasHeight = 300;

    if (
      head.x < 0 ||
      head.x >= canvasWidth / 10 || // Assuming gridSize is 10
      head.y < 0 ||
      head.y >= canvasHeight / 10
    ) {
      gameOver();
    }

    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        gameOver();
      }
    }
  }

  function clearBoard(ctx) {
    ctx.clearRect(0, 0, 500, 300);
  }

  function gameLoop() {
    const canvas = document.getElementById('game-board');
    const ctx = canvas.getContext('2d');

    clearBoard(ctx);
    drawSnake(ctx);
    drawFood(ctx);
    update();
    checkCollision();
  }

  function handleKeyDown(event) {
    switch (event.key) {
      case 'ArrowUp':
        if (dy === 0) {
          setDx(0);
          setDy(-1);
        }
        break;
      case 'ArrowDown':
        if (dy === 0) {
          setDx(0);
          setDy(1);
        }
        break;
      case 'ArrowLeft':
        if (dx === 0) {
          setDx(-1);
          setDy(0);
        }
        break;
      case 'ArrowRight':
        if (dx === 0) {
          setDx(1);
          setDy(0);
        }
        break;
      default:
        break;
    }
  }

  function gameOver() {
    clearInterval(gameIntervalRef.current); // Use the ref to clear the interval
    const finalScore = score;
    alert(`Game Over! Your score: ${finalScore}`);
    saveScore(finalScore);
    updateScoresServer(finalScore); // Update the server with the final score
    window.location.reload(); // Reload the webpage
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dx, dy]);

  return (
<main className="container-fluid bg-dark text-center" style={{ padding: 0 }}>
  <div className="container" id="game-container">
    <h1 style={{ margin: 0 }}>SnakeKing</h1>
        <p>Player: <span className="player-name">{getPlayerName()}</span></p>
        <div id="game-board-container">
          <canvas id="game-board" width="500" height="300" style={{ border: '1.5px solid red' }}></canvas>
        </div>
        <div id="score">Score: {score}</div>
        <button
          id="restart-button"
          className="btn btn-success"
          onClick={() => {
            // Define the resetGame function logic here
            setSnake([{ x: 10, y: 10 }]);
            setFood({ x: 5, y: 5 });
            setDx(0);
            setDy(0);
            setScore(0);
          }}
        >
          Restart
        </button>
      </div>
    </main>
  );
}
