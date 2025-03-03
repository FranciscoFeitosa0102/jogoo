
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  salesCount: { type: Number, default: 0 }, // Quantidade de vendas
  minutesAvailable: { type: Number, default: 0 } // Tempo de jogo disponível
});

module.exports = mongoose.model('User', userSchema);
