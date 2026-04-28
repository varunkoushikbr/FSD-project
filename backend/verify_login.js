const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');

dotenv.config({ path: path.join(__dirname, '.env') });

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/productivity-tracker').then(async () => {
  const email = 'dummy@example.com';
  const password = 'Password123';
  
  const user = await User.findOne({ email }).select('+password');
  console.log('User found:', !!user);
  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
  }
  process.exit(0);
});
