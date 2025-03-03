const express = require('express');
const Sale = require('../models/Sale');
const User = require('../models/User');
const router = express.Router();

// Rota para cadastrar vendas
router.post('/', async (req, res) => {
  const { userId, salesCount } = req.body;

  if (!userId || salesCount === undefined || salesCount <= 0) {
    return res.status(400).json({ error: 'Dados inválidos para registrar vendas.' });
  }

  try {
    // Verificar se o usuário existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Criar uma nova venda
    const newSale = new Sale({ userId, salesCount });
    await newSale.save();

    // Calcular os minutos de jogo (10 minutos por venda)
    const minutesToAdd = salesCount * 10;

    // Atualizar os minutos de jogo do usuário
    user.minutes_available = (user.minutes_available || 0) + minutesToAdd;
    await user.save();

    res.json({ message: 'Vendas registradas e minutos atualizados!', minutesAdded: minutesToAdd, userMinutes: user.minutes_available });
  } catch (

