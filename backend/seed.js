const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

const path = require('path');
// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Task = require('./models/Task');

console.log('Connecting to:', process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/productivity-tracker');

// Connect to DB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/productivity-tracker');

const seedData = async () => {
  try {
    // Clear old data
    await User.deleteMany({ email: 'dummy@example.com' });
    
    // Create Dummy User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Password123', salt);
    
    const user = await User.create({
      name: 'Pro User',
      email: 'dummy@example.com',
      password: hashedPassword,
      points: 5400,
      totalPoints: 5400,
      currentStreak: 120,
      longestStreak: 120,
      lastActive: new Date()
    });

    console.log('Dummy User Created:', user.email, '/ Password123');

    // Create Tasks
    const tasks = [];
    const statuses = ['completed', 'in-progress', 'pending'];
    
    for (let i = 0; i < 30; i++) {
        const d = new Date();
        d.setDate(d.getDate() - Math.floor(Math.random() * 10)); // random within last 10 days
        
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const isCompleted = status === 'completed';
        
        tasks.push({
            userId: user._id,
            title: `Task ${i + 1}`,
            completed: isCompleted,
            status: status,
            date: d,
            estimatedTime: 60,
            actualTime: isCompleted ? Math.floor(Math.random() * 60) : 0,
            points: isCompleted ? 10 + Math.floor(Math.random() * 20) : 0,
            updatedAt: isCompleted ? d : undefined
        });
    }
    
    await Task.insertMany(tasks);
    console.log('30 Dummy tasks created!');
    
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
