const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// Email of the user to make admin
const userEmail = 'daksh3@gmail.com';

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB connected');
  
  try {
    // Find the user by email and update isAdmin to true
    const user = await User.findOneAndUpdate(
      { email: userEmail },
      { isAdmin: true },
      { new: true }
    );
    
    if (!user) {
      console.log(`User with email ${userEmail} not found`);
    } else {
      console.log(`User ${user.name} (${user.email}) is now an admin!`);
    }
  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
})
.catch(err => console.error('MongoDB connection error:', err)); 