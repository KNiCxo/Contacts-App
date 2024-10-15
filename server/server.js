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

// GET request for gathering all data from the main table associated with the contact list
app.get('/getContacts/:name', (req, res) => {
  const db = dbService.getDbServiceInstance();
  const result = db.getContacts(req.params.name);

  result
  .then(data => res.json(data))
  .catch(err => console.log(err))
});

// GET request for gathering all data from the numbers table associated with the contact name
app.get('/getContactNumbers/:name/:contactId', (req, res) => {
  const db = dbService.getDbServiceInstance();
  const result = db.getContactNumbers(req.params.name, req.params.contactId);

  result
  .then(data => res.json(data))
  .catch(err => console.log(err))
});

// GET request for gathering all data from the emails table associated with the contact name
app.get('/getContactEmails/:name/:contactId', (req, res) => {
  const db = dbService.getDbServiceInstance();
  const result = db.getContactEmails(req.params.name, req.params.contactId);

  result
  .then(data => res.json(data))
  .catch(err => console.log(err))
});

// POST request for creating a list
app.post('/createList/:name', (req, res) => {
  const db = dbService.getDbServiceInstance();
  db.createList(req.params.name);
});

// POST request for uploading pictures
app.post('/uploadPicture', upload.single('file'), (req, res) => {
  res.json(req.file);
});

// POST request for adding contact to SQL database
app.post('/addContact', (req, res) => {
  const db = dbService.getDbServiceInstance();
  db.addContact(req.body);
  res.status(200).send('Contact added successfully');
});

// Start server
app.listen(process.env.PORT, () => console.log(`listening on port ${process.env.PORT}`));