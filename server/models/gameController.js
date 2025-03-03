const User = require('../models/user');

exports.getGameTime = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user || user.salesCount === 0) {
      return res.status(400).json({ message: 'Você precisa realizar vendas para jogar' });
    }
    res.status(200).json({ availableMinutes: user.minutesAvailable });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
