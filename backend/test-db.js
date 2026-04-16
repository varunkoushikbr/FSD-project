const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

console.log('Attempting to connect to:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('SUCCESS: Connected to MongoDB!');
        process.exit(0);
    })
    .catch(err => {
        console.error('FAILURE: Could not connect to MongoDB.');
        console.error('Error Details:', err.message);
        if (err.message.includes('ECONNREFUSED')) {
            console.log('\nSUGGESTION: It looks like your MongoDB service is NOT running. Please start MongoDB (mongod).');
        }
        process.exit(1);
    });
