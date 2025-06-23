const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const upload = multer();

app.post('/convert-to-pdf', upload.single('file'), async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;
    const mimeType = req.file.mimetype;

    const formData = new FormData();
    formData.append('file', fileBuffer, {
      filename: fileName,
      contentType: mimeType,
    });

    const response = await axios.post(
      `${process.env.TARGET_SERVER}/convert-to-pdf`,
      formData,
      {
        headers: formData.getHeaders(),
        responseType: 'stream',
      }
    );

    res.setHeader('Content-Disposition', 'attachment; filename="converted.pdf"');
    response.data.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Proxy error' });
  }
});

app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});
