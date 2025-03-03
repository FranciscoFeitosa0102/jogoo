const express = require('express');
const User = require('../models/User');
const GameHistory = require('../models/GameHistory');
const router = express.Router();

// Rota para acessar o jogo
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'ID de usuário é necessário.' });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    if (user.minutes_available <= 0) {
      return res.status(403).json({ error: 'Você não tem minutos disponíveis para jogar. Registre vendas para ganhar mais tempo de jogo!' });
    }

    res.json({ message: 'Jogo liberado!', minutes: user.minutes_available });
  } catch (err) {
    console.error('Erro ao verificar acesso ao jogo:', err);
    res.status(500).json({ error: 'Erro ao verificar acesso ao jogo.' });
  }
});

//Rota para descontar os minutos de jogo.
router.post('/play', async (req, res) => {
  const { userId, playTime, points } = req.body;

  if (!userId || playTime === undefined) {
    return res.status(400).json({ error: 'ID de usuário e tempo de jogo são necessários.' });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    if (user.minutes_available < playTime) {
      return res.status(400).json({ error: 'Tempo de jogo insuficiente.' });
    }

    // Criar um novo histórico de jogo
    const newGameHistory = new GameHistory({ userId, points, playTime });
    await newGameHistory.save();

    // Atualizar a pontuação do usuário
    user.points = (user.points || 0) + points;

    // Descontar os minutos de jogo
    user.minutes_available -= playTime;
    await user.save();

    res.json({ message: 'Tempo de jogo descontado!', minutes: user.minutes_available });
  } catch (err) {
    console.error('Erro ao descontar minutos de jogo:', err);
    res.status(500).json({ error: 'Erro ao descontar minutos de jogo.' });
  }
});
// Rota para obter o ranking
router.get('/ranking', async (req, res) => {
  try {
    const ranking = await User.find({}, 'username points').sort({ points: -1 }).limit(10); // Ordena por pontos (decrescente) e limita a 10 usuários
    res.json(ranking);
  } catch (err) {
    console.error('Erro ao obter o ranking:', err);
    res.status(500).json({ error: 'Erro ao obter o ranking.' });
  }
});
module.exports = router;
