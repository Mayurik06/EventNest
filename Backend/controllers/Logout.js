exports.logoutUser = async (req, res) => {
    try {
      // Optionally, clear any server-side session data
      // For example, if using express-session:
      // req.session.destroy();
  
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Error logging out user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };