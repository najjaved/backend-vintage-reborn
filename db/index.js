// ℹ️ package responsible to make the connection with mongodb
// https://www.npmjs.com/package/mongoose
const mongoose = require('mongoose');

// ℹ️ Sets the MongoDB URI for our app to have access to it.
// If no env has been set, we dynamically set it to whatever the folder name was upon the creation of the app

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vintage-reborn-api';

// connect to database
const connectToDB = async (serverListener) => {
  try {
    const response = await mongoose.connect(MONGO_URI);
    console.log(`Connected to Mongo! Database name: "${response.connections[0].name}"`);
    if (typeof serverListener === 'function') {
      serverListener();
    }
  } catch (error) {
    console.error('Error connecting to mongo DB: ', error);
  }
}

module.exports = connectToDB;
