import React, { useState } from 'react';

const SalesPage = ({ user }) => {
  const [sales, setSales] = useState(0);

  const handleSaleChange = (e) => {
    setSales(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para registrar as vendas e adicionar tempo ao jogo
    console.log(`Vendas registradas: ${sales} - Tempo adicionado ao jogo.`);
  };

  return (
    <div>
      <h1>Registrar Vendas</h1>
      {user ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="sales">Número de Vendas:</label>
            <input
              type="number"
              id="sales"
              value={sales}
              onChange={handleSaleChange}
              required
            />
          </div>
          <button type="submit">Registrar</button>
        </form>
      ) : (
        <p>Você precisa estar logado para registrar vendas.</p>
      )}
    </div>
  );
};

export default SalesPage;
