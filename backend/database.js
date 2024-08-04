const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

const emergencyDataSchema = new mongoose.Schema({
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  description: String,
  images: [{
    data: Buffer,
    contentType: String
  }],
  audio: {
    data: Buffer,
    contentType: String
  },
  timestamp: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  auth0Id: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  email: { type: String },
  emergency_data: [emergencyDataSchema],
  emotions: {
    aggression: { type: Number, default: 0 },
    hostility: { type: Number, default: 0 },
    frustration: { type: Number, default: 0 },
  }
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
