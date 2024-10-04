const express = require('express');
const app = express();
const multer = require('multer');
const cors = require('cors');
const dotenv = require('dotenv');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.jpg')
  }
})

const upload = multer({ storage: storage });

const dbService = require('./dbService.js');

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.post('/createList/:name', (req, res) => {
  const db = dbService.getDbServiceInstance();
  const result = db.createList(req.params.name);
});

app.post('/uploadPicture', upload.single('file'), (req, res) => {
  res.json(req.file);
});

app.post('/addContact', (req, res) => {
  const db = dbService.getDbServiceInstance();
  const result = db.addContact(req.body);
});

app.listen(process.env.PORT, () => console.log(`listening on port ${process.env.PORT}`));