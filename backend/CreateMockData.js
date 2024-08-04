const mongoose = require('mongoose');
const moment = require('moment-timezone');
require('dotenv').config();

const { User } = require('./database'); // Make sure this path is correct

const uri = process.env.MONGODB_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

const descriptions = [
  'Car accident reported',
  'Fire in a building',
  'Medical emergency at a park',
  'Robbery at a convenience store',
  'Flooding in a residential area',
  'Suspicious package found',
  'Power outage in the neighborhood',
  'Gas leak reported',
  'Minor traffic incident',
  'Animal rescue required'
];

const generateRandomCoordinate = (min, max) => Math.random() * (max - min) + min;

const createRandomEmergencyData = (username, numEvents) => {
  const events = [];
  for (let i = 0; i < numEvents; i++) {
    const latitude = generateRandomCoordinate(43.6, 43.8);
    const longitude = generateRandomCoordinate(-79.5, -79.2);
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];
    const timestamp = moment().subtract(Math.floor(Math.random() * 100), 'days').tz("America/Toronto").toDate();

    events.push({
      _id: new mongoose.Types.ObjectId(),
      location: { latitude, longitude },
      description: `${description} by ${username}`,
      images: [],
      audio: null,
      timestamp,
    });
  }
  return events;
};

const insertMockData = async () => {
  const users = [
    { username: 'Dhong', auth0Id: 'google-oauth2|104010459411486648587' },
    { username: 'David', auth0Id: 'auth0|66ac432f1e3e67c2c3f7d321' },
    { username: 'Drake Yogannason', auth0Id: 'google-oauth2|113926373202079786085' },
    { username: 'hackthe6ix2024', auth0Id: 'google-oauth2|103064479538676048453' },
    { username: 'Ethan',
  ];

  for (const user of users) {
    const userEvents = createRandomEmergencyData(user.username, 300); // 300 events per user

    await User.findOneAndUpdate(
      { username: user.username, auth0Id: user.auth0Id },
      { $set: { auth0Id: user.auth0Id, username: user.username }, $push: { emergency_data: { $each: userEvents } } },
      { new: true, upsert: true }
    );
  }

  console.log('Mock data inserted successfully');
};

insertMockData().then(() => mongoose.disconnect());
