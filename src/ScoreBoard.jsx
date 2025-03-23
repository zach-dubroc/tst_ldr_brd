import './App.css';
import React, { useState } from 'react';

const scores = ['All', 'Top Five', 'Top Ten'];

function DisplayScores({ leaderBoard, view }) {
  let filteredLeaderBoard = leaderBoard;

  if (view === 'Top Five') {
    filteredLeaderBoard = leaderBoard.slice(0, 5);
  } else if (view === 'Top Ten') {
    filteredLeaderBoard = leaderBoard.slice(0, 10);
  }

  return (
    <>
      {filteredLeaderBoard.map((entry, index) => (
        <tr key={index} className={index % 2 === 0 ? 'tableRowEven' : 'tableRowOdd'}>
          <td>{index + 1}</td>
          <td>{entry.username}</td>
          <td>{entry.score}</td>
        </tr>
      ))}
    </>
  );
}

function SetScoreView({ activeView, setActiveView }) {
  return (
    <div>
      {scores.map((score, index) => (
        <button
          key={index}
          onClick={() => setActiveView(score)}
          className={activeView === score ? 'active' : ''}
        >
          {score}
        </button>
      ))}
    </div>
  );
}

export default function ScoreBoard({ leaderBoard }) {
  const [activeView, setActiveView] = useState(scores[0]);

  return (
    <>
      <h1 className='titleScore'>Leaderboard</h1>
      <SetScoreView activeView={activeView} setActiveView={setActiveView} />
      <table className="read-the-docs">
        <tbody>
          <tr>
            <th className='rank'>Rank</th>
            <th className='player'>Player</th>
            <th className='score'>Score</th>
          </tr>
          <DisplayScores leaderBoard={leaderBoard} view={activeView} />
        </tbody>
      </table>
    </>
  );
}