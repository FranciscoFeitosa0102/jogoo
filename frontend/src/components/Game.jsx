import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Game({ user }) {
  const [hasTime, setHasTime] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [error, setError] = useState('');
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    const checkGameAccess = async () => {
      try {
        const response = await axios.get(`/api/game/${user._id}`);
        setHasTime(response.data.minutes > 0);
        setTimeLeft(response.data.minutes);
      } catch (err) {
        setError('Erro ao verificar acesso ao jogo. Registre vendas para jogar.');
      }
    };
    checkGameAccess();
  }, [user]);

  const startGame = () => {
    if (hasTime) {
      setGameStarted(true);
      setError('');
    } else {
      setError('Você não tem minutos disponíveis para jogar. Registre vendas para ganhar mais tempo de jogo!');
    }
  };

  useEffect(() => {
    let intervalId;
    if (gameStarted && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 60000); // 1 minuto em milissegundos
    } else if (gameStarted && timeLeft === 0) {
      endGame();
    }
    return () => clearInterval(intervalId);
  }, [gameStarted, timeLeft]);

  const handleGameAction = () => {
      setScore((prevScore) => prevScore + 10);
    }

  const endGame = async () => {
    setGameStarted(false);
    try {
      await axios.post('/api/game/play', { userId: user._id, playTime: (user.minutesAvailable-timeLeft), points: score });
      setError('');
      alert(`Jogo encerrado! Pontuação final: ${score}`);
      setHasTime(false)
    } catch (err) {
      setError('Erro ao salvar os dados do jogo.');
    }
  };

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await axios.get('/api/game/ranking');
        setRanking(response.data);
      } catch (err) {
        setError('Erro ao obter o ranking.');
      }
    };
    fetchRanking();
  }, []);

  return (
    <div>
      <h2>Jogo</h2>
      {error && <p className="error">{error}</p>}
      {!gameStarted && (
        <div>
          <p>Minutos disponíveis: {timeLeft}</p>
          <button onClick={startGame} disabled={!hasTime}>
            Iniciar Jogo
          </button>
        </div>
      )}

      {gameStarted && (
        <div>
          <p>Tempo restante: {timeLeft} minutos</p>
          <p>Pontuação: {score}</p>
          <button onClick={handleGameAction}>Aumentar Pontos</button>
          <button onClick={endGame}>Encerrar Jogo</button>
        </div>
      )}
      <h2>Ranking</h2>
        <ul>
          {ranking.map((rank, index) => (
            <li key={index}>
              {rank.username} - {rank.points} pontos
            </li>
          ))}
        </ul>
    </div>
  );
}

export default Game;
