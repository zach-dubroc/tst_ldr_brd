import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ScoreBoard from './ScoreBoard.jsx';

function App() {
  const [scoreBoard, setScoreBoard] = useState([]);
  const score_user = import.meta.env.VITE_REACT_API_SCORE_URL;
  const websocket_url = import.meta.env.VITE_REACT_API_WEBSOCKET_URL; // Add your WebSocket URL here

  // Fetch initial leaderboard data
  const fetchLeaderBoard = async () => {
    try {
      const response = await axios.get(${score_user});
      setScoreBoard(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(error.message);
      setScoreBoard([]);
    }
  };

  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket(websocket_url);
  
      ws.onopen = () => {
        console.log('WebSocket connected');
      };
  
      ws.onmessage = (event) => {
        try {
          const updatedLeaderboard = JSON.parse(event.data);
          setScoreBoard(updatedLeaderboard);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
  
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
  
      ws.onclose = () => {
        console.log('WebSocket disconnected');
        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
          console.log('Attempting to reconnect...');
          connectWebSocket();
        }, 5000);
      };
    };
  
    connectWebSocket();
  
    return () => {
      ws.close();
    };
  }, []);
  return <ScoreBoard leaderBoard={scoreBoard} />;
}

export default App;