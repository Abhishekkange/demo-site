// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://NearbyKart_production:vgDxWwhHwhdWkSO0@cluster0.nkwn8jm.mongodb.net/certificate', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit the process on failure
  }
};

module.exports = connectDB;