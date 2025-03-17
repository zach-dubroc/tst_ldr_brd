import { useState, useEffect } from 'react'
import axios from "axios";
import './App.css'
import ScoreBoard from './ScoreBoard.jsx';

function App()
{
  const [scoreBoard, setscoreBoard] = useState([])
  const score_user = import.meta.env.VITE_REACT_API_SCORE_URL;
    
  const fetchLeaderBoard = async () =>
  {
    try{
      const response = await axios.get(`${score_user}`);
      setscoreBoard(Array.isArray(response.data) ? response.data : []);
    }
    catch (error){
      console.error(error.message);
      setscoreBoard([]);
    }
  };
  useEffect(() => {
    fetchLeaderBoard();
  }, []);

  return(
    <ScoreBoard leaderBoard={scoreBoard} />
  )
}
export default App