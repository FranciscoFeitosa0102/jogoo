const Sale = require('../models/sale');
const User = require('../models/user');

// Registrar uma venda
exports.recordSale = async (req, res) => {
  const { userId, amount } = req.body;
  try {
    const sale = new Sale({ userId, amount });
    await sale.save();

    // Atualizar o usuário com a quantidade de vendas
    const user = await User.findById(userId);
    user.salesCount += 1;
    user.minutesAvailable = user.salesCount * 5; // Cada venda vale 5 minutos
    await user.save();

    res.status(201).json(sale);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
