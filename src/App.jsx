import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';
import ScoreBoard from './ScoreBoard.jsx';

function App() {
  const [scoreBoard, setScoreBoard] = useState([]);
  const [isUsingPolling, setIsUsingPolling] = useState(false);
  const pollingIntervalRef = useRef(null);

  // Environment-based URLs
  const score_user = import.meta.env.VITE_REACT_API_SCORE_URL;
  const websocket_url = import.meta.env.VITE_REACT_API_WEBSOCKET_URL;

  // Fetch leaderboard data
  const fetchLeaderBoard = async () => {
    try {
      const response = await axios.get(score_user);
      setScoreBoard(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(error.message);
      setScoreBoard([]);
    }
  };

  // Start polling as fallback
  const startPolling = () => {
    console.log('Starting polling fallback');
    setIsUsingPolling(true);
    // Clear any existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    // Set up new polling interval
    pollingIntervalRef.current = setInterval(fetchLeaderBoard, 5000);
    // Initial fetch
    fetchLeaderBoard();
  };

  useEffect(() => {
    let ws;
    let connectionTimeout;

    const connectWebSocket = () => {
      console.log('Attempting WebSocket connection to:', websocket_url);
      ws = new WebSocket(websocket_url);

      // Set connection timeout - if it doesn't connect within 5 seconds, fall back to polling
      connectionTimeout = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          console.log('WebSocket connection timed out');
          startPolling();
        }
      }, 5000);

      ws.onopen = () => {
        console.log('WebSocket connected successfully');
        clearTimeout(connectionTimeout);
        // If we were polling, we can stop now
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          setIsUsingPolling(false);
        }
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
        clearTimeout(connectionTimeout);
        // Fall back to polling on error
        startPolling();
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        // Fall back to polling on close
        startPolling();
      };
    };

    // First try WebSocket
    if (websocket_url) {
      connectWebSocket();
    } else {
      // If no WebSocket URL, just use polling
      startPolling();
    }

    // Clean up on unmount
    return () => {
      if (ws) {
        ws.close();
      }
      if (connectionTimeout) {
        clearTimeout(connectionTimeout);
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [websocket_url, score_user]);

  return <ScoreBoard leaderBoard={scoreBoard} />;
}

export default App;
