const express = require('express');
const cors = require('cors');
const axios = require('axios');
const FormData = require('form-data');
const multer = require('multer');
const upload = multer();
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/convert-to-pdf', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    const response = await axios.post(process.env.TARGET_URL + '/convert-to-pdf', formData, {
      headers: {
        ...formData.getHeaders(),
      },
      responseType: 'stream'
    });

    res.setHeader('Content-Disposition', response.headers['content-disposition']);
    response.data.pipe(res);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Proxy conversion failed' });
  }
});

// Simple test route
app.get('/', (req, res) => {
  res.send('Proxy Server is Running');
});

// For Vercel: listen on port provided by Vercel
module.exports = app;
