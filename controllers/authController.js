const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// Register User
const registerUser = async (req, res) => {
  const { name, email, password,phone } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword ,phone});

  if (user) {
    res.status(201).json({ 
      _id: user.id, 
      name: user.name, 
      email: user.email, 
      phone: user.phone,
      token: generateToken(user.id) 
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({ 
      _id: user.id, 
      name: user.name, 
      email: user.email, 
      phone: user.phone,
      token: generateToken(user.id) 
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

module.exports = { registerUser, loginUser };
