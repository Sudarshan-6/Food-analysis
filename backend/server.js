const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const cors = require('cors');
const fs = require('fs');
const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Set up multer middleware for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}` + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Define the port for the Express server
const port = 3001;

// Route handler to forward the request with user email to Flask server
app.post('/api/previous-searches', async (req, res) => {
  try {
    const { user } = req.body;
    // Forward the request to the Flask server with the user email
    const flaskResponse = await axios.post('http://localhost:5000/api/previous-searches', { user });

    // Get the response from the Flask server
    const data = flaskResponse.data;

    // Forward the response from the Flask server to the client
    res.json(data);
  } catch (error) {
    console.error('Error forwarding request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to handle image upload
app.post('/upload', upload.single('file'), async (req, res) => {
  let filePath;
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Prepare the image file to be sent to the Flask server
    const formData = new FormData();
    filePath = req.file.path;
    const fileStream = fs.createReadStream(filePath);
    formData.append('file', fileStream, req.file.originalname);

    // Send the image to the Flask server for barcode processing
    const response = await axios.post('http://localhost:5000/process-barcode', formData, {
      headers: formData.getHeaders(), // Set headers for form data
    });

    // Extract the barcode number from the Flask server response
    const barcodeNumber = response.data.barcode;

    // Return the barcode number as JSON response
    res.json({ bar: barcodeNumber });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Failed to process image' });
  } finally {
    // Ensure the file is deleted after the response is sent
    if (filePath) {
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', err);
        else console.log('File deleted successfully');
      });
    }
  }
});

app.post('/analysis', async (req, res) => {
  try {
    const { barcode, user } = req.body;

    // Make a request to another server
    const analysisResponse = await axios.post('http://localhost:5000/analysis', { barcode, user });

    // Get the response from the other server
    const data = analysisResponse.data;

    // Forward the response from the other server to the client
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
