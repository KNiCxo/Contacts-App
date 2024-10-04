// Get required modules for server
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const dotenv = require('dotenv');

// Create server instance
const app = express();

// Destination and filename config for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.jpg')
  }
})

// Create multer upload instance
const upload = multer({ storage: storage });

// Create dbService instance
const dbService = require('./dbService.js');

// Enable dotenv
dotenv.config();

// Format server
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// POST request for creating a list
app.post('/createList/:name', (req, res) => {
  const db = dbService.getDbServiceInstance();
  const result = db.createList(req.params.name);
});

// POST request for uploading pictures
app.post('/uploadPicture', upload.single('file'), (req, res) => {
  res.json(req.file);
});

// POST request for adding contact to SQL database
app.post('/addContact', (req, res) => {
  const db = dbService.getDbServiceInstance();
  const result = db.addContact(req.body);
});

// Start server
app.listen(process.env.PORT, () => console.log(`listening on port ${process.env.PORT}`));