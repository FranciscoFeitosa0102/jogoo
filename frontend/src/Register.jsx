import React, { useState } from "react";
imporimport React, { useState } from 'react';

const RegisterForm = ({ onRegisterSales }) => {
  const [sales, setSales] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegisterSales(sales);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Number of Sales</label>
        <input
          type="number"
          value={sales}
          onChange={(e) => setSales(Number(e.target.value))}
          min="0"
        />
      </div>
      <button type="submit">Register Sales</button>
    </form>
  );
};

export default RegisterForm;
