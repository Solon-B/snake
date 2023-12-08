import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Difficulty() {
  const navigate = useNavigate();

  const handleDifficultyClick = (difficulty) => {
    // Navigate to the corresponding play page
    navigate(`/play_${difficulty}`);
  };

  return (
    <main className="container-fluid bg-dark text-center">
      <div>
        <h1>Choose a difficulty</h1>
        <p></p>

        <button onClick={() => handleDifficultyClick('easy')} className="btn btn-success">
          Easy
        </button>
        <button onClick={() => handleDifficultyClick('medium')} className="btn btn-warning">
          Medium
        </button>
        <button onClick={() => handleDifficultyClick('hard')} className="btn btn-danger">
          Hard
        </button>
      </div>
    </main>
  );
}
