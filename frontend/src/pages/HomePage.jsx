import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SalesPage from '../SalesPage';
import Game from '../components/Game';

function HomePage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      navigate('/login');
    } else {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error('Erro ao analisar o usuário:', err);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1>Bem-vindo, {user?.username}!</h1>
      <button onClick={handleLogout}>Sair</button>
      <SalesPage user={user} />
      <Game user={user}/>
    </div>
  );
}

export default HomePage;
