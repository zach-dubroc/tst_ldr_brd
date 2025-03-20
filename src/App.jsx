import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ScoreBoard from './ScoreBoard.jsx';

function App() {
  const [scoreBoard, setScoreBoard] = useState([]);

  // Environment-based URLs
  const score_user =
    import.meta.env.VITE_REACT_API_SCORE_URL ||
    'http://localhost:3000/get-leaderboard';

  const websocket_url =
    import.meta.env.VITE_REACT_API_WEBSOCKET_URL || 'ws://localhost:3000/ws';

  // Fetch initial leaderboard data
  const fetchLeaderBoard = async () => {
    try {
      const response = await axios.get(score_user);
      setScoreBoard(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(error.message);
      setScoreBoard([]);
    }
  };

  useEffect(() => {
    let ws;

    const connectWebSocket = () => {
      ws = new WebSocket(websocket_url);

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
        setTimeout(() => {
          console.log('Attempting to reconnect...');
          connectWebSocket();
        }, 5000);
      };
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [websocket_url]); // Notice I added websocket_url as a dependency here

  useEffect(() => {
    fetchLeaderBoard();
  }, [score_user]); // Added this dependency too

  return <ScoreBoard leaderBoard={scoreBoard} />;
}

export default App;
