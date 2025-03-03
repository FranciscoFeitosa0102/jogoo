
const mongoose = require('mongoose');

const rankingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  points: { type: Number, default: 0 }
});

module.exports = mongoose.model('Ranking', rankingSchema);

    
