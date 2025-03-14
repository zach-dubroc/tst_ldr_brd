import { useState, useEffect } from 'react'
import axios from "axios";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  const [scoreBoard, setscoreBoard] = useState([])
  //need to pull this from a local env file
  
  const API_BASE_URL = "https://tst-api-production.up.railway.app";
  const fetchLeaderBoard = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-leaderboard`);
      setscoreBoard(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(error.message);
      setscoreBoard([]);
    }
  };

    useEffect(() => {
    fetchLeaderBoard();
  }, []);
  
  return (
    <>

      <h1>scores</h1>
      <p className="read-the-docs">
      <table>
    <tbody>
      <tr>
        <th>user</th>
        <th>score</th>
      </tr>
      {scoreBoard.map((entry, index) => (
        
        <tr
          key={index}
          className={index % 2 === 0 ? 'tableRowEven' : 'tableRowOdd'}
        >
          
          <td>{entry.username}</td>
          
          <td>{entry.score}</td>
        </tr>
      ))}
    </tbody>
  </table>
      </p>
    </>
  )
}

export default App
