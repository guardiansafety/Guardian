const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const moment = require('moment-timezone');
require('dotenv').config();

const { User } = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function fileToGenerativePart(filePath, mimeType) {
  return {
    inlineData: {
      data: fs.readFileSync(filePath).toString('base64'),
      mimeType
    },
  };
}

app.post('/create-emergency-event/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { location, description, auth0Id } = req.body;

    if (!location || !location.latitude || !location.longitude) {
      return res.status(400).send('Invalid location data');
    }

    // Convert Toronto time to a Date object
    const timestamp = moment().tz("America/Toronto").toDate();

    const emergencyData = {
      _id: new mongoose.Types.ObjectId(),
      location: {
        latitude: parseFloat(location.latitude),
        longitude: parseFloat(location.longitude),
      },
      description,
      images: [],
      audio: null,
      timestamp,  // Use the converted timestamp
    };

    const user = await User.findOneAndUpdate(
      { username, auth0Id },
      { 
        $set: { auth0Id, username },
        $push: { emergency_data: emergencyData } 
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: 'Emergency event created successfully',
      emergencyId: emergencyData._id,
    });
  } catch (error) {
    console.error('Error creating emergency event:', error);
    res.status(500).send('Error creating emergency event');
  }
});

app.post('/add-emergency-image/:username/:emergencyId', upload.array('images'), async (req, res) => {
  try {
    const { username, emergencyId } = req.params;

    if (!req.files || req.files.length === 0) {
      console.error('No image files uploaded');
      return res.status(400).send('No image files uploaded');
    }

    const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = 'Analyze the image and identify any potential threats, hazards, dangerous objects, in about 80 words. Describe the objects you detect that could pose a threat, including their types and possible dangers. Provide a brief summary of the overall threat level in the image. Also focus on describing the people in the foreground, as well as any unique things in the background that could help with location for first responders';

    let allDescriptions = [];

    for (const file of req.files) {
      const imagePart = fileToGenerativePart(file.path, file.mimetype);
      
      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();
      
      allDescriptions.push(text);
      
      // Clean up the file after processing
      fs.unlinkSync(file.path);
    }

    const combinedDescription = allDescriptions.join('\n\n');

    // Update the emergency event description with the generated text
    const user = await User.findOneAndUpdate(
      {
        username,
        'emergency_data._id': new mongoose.Types.ObjectId(emergencyId),
      },
      {
        $set: { 'emergency_data.$.description': combinedDescription },
        $push: { 'emergency_data.$.images': req.files.map(file => ({ data: file.buffer, contentType: file.mimetype })) }
      },
      { new: true }
    );

    if (!user) {
      console.error('User or emergency event not found');
      return res.status(404).send('User or emergency event not found');
    }

    res.status(200).json({ message: 'Images added and description updated successfully', description: combinedDescription });
  } catch (error) {
    console.error('Error adding images to emergency event:', error);
    res.status(500).send('Error adding images to emergency event');
  }
});

// Endpoint to get user profile data
app.get('/profile', async (req, res) => {
  try {
    const username = req.query.username;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).send('Error fetching profile');
  }
});


// geting all emergency data
app.get('/get-all-emergencies', async (req, res) => {
  try {
    const users = await User.find({}, 'username emergency_data');
    const emergencies = users.flatMap(user => 
      user.emergency_data.map(event => ({ ...event.toObject(), username: user.username }))
    );

    res.json(emergencies);
  } catch (error) {
    console.error('Error fetching emergency events:', error);
    res.status(500).send('Error fetching emergency events');
  }
});



app.post('/create-or-update-user', async (req, res) => {
  try {
    console.log('Received request to create or update user:', req.body);
    const { auth0Id, username, email } = req.body;

    if (!auth0Id || !username) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let user = await User.findOne({ auth0Id });
    
    if (user) {
      // Update existing user
      user.username = username;
      if (email) user.email = email;
      await user.save();
    } else {
      // Create new user
      user = new User({ auth0Id, username, email, emergency_data: [] });
      await user.save();
    }
    
    console.log('User created or updated successfully:', user);
    res.status(200).json({ message: 'User created or updated successfully', user });
  } catch (error) {
    console.error('Detailed error in create-or-update-user:', error);
    res.status(500).json({ error: 'Error creating or updating user', details: error.message });
  }
});


const port = 3006;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});