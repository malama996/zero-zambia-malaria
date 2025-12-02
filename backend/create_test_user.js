const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createTestUser = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/maptrack';
    console.log(`Connecting to MongoDB at ${uri}...`);
    await mongoose.connect(uri);
    console.log('MongoDB Connected');

    const email = 'dr.test.manual@example.com';
    const password = 'password123';

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      console.log('User already exists, deleting...');
      await User.deleteOne({ email });
    }

    console.log('Creating new user...');
    user = new User({
      name: 'Dr. Test Manual',
      email,
      password,
      role: 'health_professional',
      facility: 'Lusaka General',
      phone: '0977123456'
    });

    await user.save();
    console.log('User created successfully');

    // Verify password
    const isMatch = await user.comparePassword(password);
    console.log(`Password comparison result: ${isMatch}`);

    mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

createTestUser();
