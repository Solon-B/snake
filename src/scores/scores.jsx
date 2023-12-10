
import React, { useState, useEffect } from 'react';
import './scores.css';

export function Scores() {
  const [scores, setScores] = useState([]);

  const loadScores = async () => {
    try {
      const response = await fetch('/api/scores');
      const scoresData = await response.json();

      localStorage.setItem('scores', JSON.stringify(scoresData));
      setScores(scoresData);
    } catch (error) {
      const scoresText = localStorage.getItem('scores');
      if (scoresText) {
        setScores(JSON.parse(scoresText));
      }
    }
  };

  useEffect(() => {
    loadScores();
  }, []); // Empty dependency array ensures the effect runs only once after initial render

  const displayScores = () => {
    return scores.length ? (
      scores.map((score, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{score.name}</td>
          <td>{score.score}</td>
          <td>{score.date}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="4">Be the first to score</td>
      </tr>
    );
  };

  return (
    <main className="container-fluid bg-secondary text-center">
      <table className="table table-warning table-striped-columns">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Score</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody id="scores">{displayScores()}</tbody>
      </table>
    </main>
  );
}
