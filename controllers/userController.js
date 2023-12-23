const User = require("../Models/user");
const generateToken = require("../config/generateToken");

// User registration functionality
const registerUser = async (req, res) => {
  try {
    // Get user data from the registration form
    const { username, email, password } = req.body;

    // Check if all required fields are provided
    if (!username || !email || !password) {
      res.status(400);
      throw new Error("All fields are required");
    }

    // Check if the user already exists in the database
    const isExistingUser = await User.findOne({ email });

    // If user already exists, return a 302 Found status code
    if (isExistingUser) {
      return res.status(302).json({ message: "Email already registered" });
    }

    // If the user doesn't exist, create a new account
    const user = await User.create({
      username,
      email,
      password,
    });

    // Respond with user information and a token for authentication
    if (user) {
      res.status(201).json({
        message: `User ${user.username} has been created successfully`,
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(500).json({ message: "User creation failed" });
    }
  } catch (error) {
    // Handle errors and respond with a 500 Internal Server Error
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// User authentication functionality
const authUser = async (req, res) => {
  try {
    // Get user credentials from the login form
    const { email, password } = req.body;

    // Find the user in the database by email
    const user = await User.findOne({ email });

    // Check if user exists and if the password matches
    if (user && (await user.isPasswordMatch(password))) {
      // Respond with user information and a token for authentication
      res.status(200).json({
        message: `User ${user.username} has been logged in successfully`,
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      // If login fails, respond with a 500 Internal Server Error
      res.status(500).json({ message: "Cannot login" });
    }
  } catch (error) {
    // Handle errors and respond with a 500 Internal Server Error
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { registerUser, authUser };
