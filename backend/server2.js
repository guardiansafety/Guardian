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
      mimeType,
    },
  };
}

app.post('/create-emergency-event/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { location, description, auth0Id } = req.body;

    const emergencyData = {
      _id: new mongoose.Types.ObjectId(),
      location,
      description,
      images: [],
      audio: null,
      timestamp: moment().tz("America/Toronto").toDate(),
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

    if (!req.files) {
      console.error('No image files uploaded');
      return res.status(400).send('No image files uploaded');
    }

    const imageParts = req.files.map(file => fileToGenerativePart(file.path, file.mimetype));

    const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = 'Describe the surroundings and things in the image in detail.';

    const result = await model.generateContent({
      inputs: [prompt, ...imageParts]
    });

    const text = result.generatedContent[0].text;

    console.log('Generated text:', text);

    // Update the emergency event description with the generated text
    const user = await User.findOneAndUpdate(
      {
        username,
        'emergency_data._id': mongoose.Types.ObjectId(emergencyId),
      },
      {
        $set: { 'emergency_data.$.description': text },
      },
      { new: true }
    );

    if (!user) {
      console.error('User or emergency event not found');
      return res.status(404).send('User or emergency event not found');
    }

    res.status(200).json({ message: 'Images added and description updated successfully' });
  } catch (error) {
    console.error('Error adding images to emergency event:', error);
    res.status(500).send('Error adding images to emergency event');
  } finally {
    req.files.forEach(file => fs.unlinkSync(file.path)); // Cleanup uploaded files
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

const port = 3006;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
