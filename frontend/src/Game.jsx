import React, { useEffect, useState } from 'react';

const GamePage = ({ sales }) => {
  const [timeRemaining, setTimeRemaining] = useState(sales * 5 * 60); // 5 minutes per sale

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeRemaining > 0) {
        setTimeRemaining(timeRemaining - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining]);

  return (
    <div>
      <h1>Game Page</h1>
      <div>Time Remaining: {Math.floor(timeRemaining / 60)}:{timeRemaining % 60}</div>
      <button onClick={() => setTimeRemaining(sales * 5 * 60)}>Start Game</button>
    </div>
  );
};

export default GamePage;

