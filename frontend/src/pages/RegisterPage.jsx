import React, { useState } from 'react';
import axios from 'axios';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post('/api/users/register', { username, password });
      setSuccess(true);
    } catch (err) {
      setError('Erro ao cadastrar usuário.');
    }
  };

  return (
    <div>
      {success ? (
        <p>Usuário cadastrado com sucesso! Faça login agora.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2>Cadastro</h2>
          {error && <p className="error">{error}</p>}
          <div>
            <label htmlFor="username">Usuário:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Senha:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Cadastrar</button>
        </form>
      )}
    </div>
  );
}

export default RegisterPage;
