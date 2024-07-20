const User = require('../models/SignupSchema');

// Controller for user registration
exports.registerUser = async (req, res) => {
  try {
    const { firstname, lastname, email, phone, roles, password, confirmPassword } = req.body;

    // Check if the request body contains all required fields
    if (!firstname || !lastname || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Create new user
    const newUser = new User({
      firstname,
      lastname,
      email,
      phone,
      roles: roles || 'user', // Default roles to 'user' if not provided
      password,
      confirmPassword
    });

    // Save the user to the database
    await newUser.save();

    console.log('User registered successfully:', newUser);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};