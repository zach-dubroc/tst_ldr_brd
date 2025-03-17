
import './App.css'
import React from 'react';

export default function ScoreBoard({leaderBoard})
{
  return(
    <>
      <h1 className='titleScore'>Leaderboard</h1>
      <table className="read-the-docs">
        <tbody>
          <tr>
            <th className='rank'>Rank</th>
            <th className='player'>Player</th>
            <th className='score'>Score</th>
          </tr>
          {leaderBoard.map((entry, index) => (
            <tr key={index} className={index % 2 === 0 ? 'tableRowEven' : 'tableRowOdd'}>
              <td>{1}</td>
              <td>{entry.username}</td>
              <td>{entry.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

  