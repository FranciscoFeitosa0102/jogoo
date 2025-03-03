import React, { useState } from 'react';
import axios from 'axios';

function SalesPage({ user }) {
  const [salesCount, setSalesCount] = useState(0);
  const [error, setError] = useState("");

  const handleSalesSubmit = async () => {
    if (salesCount <= 0) {
      setError("Você precisa registrar vendas para jogar.");
      return;
    }

    try {
      await axios.post('/api/sales', { userId: user._id, salesCount });
      localStorage.setItem('user', JSON.stringify({ ...user, salesCount }));
      setError("");
      alert("Vendas registradas com sucesso!");
    } catch (err) {
      setError("Erro ao registrar vendas.");
    }
  };

  return (
    <div>
      <h2>Registrar Vendas</h2>
      <p>Digite a quantidade de vendas realizadas:</p>
      <input
        type="number"
        value={salesCount}
        onChange={(e) => setSalesCount(e.target.value)}
      />
      <button onClick={handleSalesSubmit}>Registrar</button>
      {error && <p>{error}</p>}
    </div>
  );
}

export default SalesPage;

