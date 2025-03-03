const mongoose = require('mongoose');

const gameHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  points: {
    type: Number,
    default: 0,
  },
  playTime: { //Tempo de jogo
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const GameHistory = mongoose.model('GameHistory', gameHistorySchema);

module.exports = GameHistory;
