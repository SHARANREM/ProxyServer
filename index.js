import express from 'express';
import cors from 'cors';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());

const upload = multer();

app.post('/convert-to-pdf', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;

    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    const response = await axios.post(`${process.env.RENDER_URL}/convert-to-pdf`, formData, {
      headers: formData.getHeaders(),
      responseType: 'stream',
    });

    response.data.pipe(res);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Conversion failed' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
