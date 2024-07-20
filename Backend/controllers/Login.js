const User = require('../models/SignupSchema');

// Controller for user login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user with the provided email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email' });
    }

    // Check if password matches
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // If user and password are correct, send a success response
    res.status(200).json({ message: 'Login successful'});
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};