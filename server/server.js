const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');

const dbService = require('./dbService.js');

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.post('/insert', (req, res) => {
  const db = dbService.getDbServiceInstance();  
  const result = db.insertNewName();

  result
  .then(data => res.json({data: data}))
  .catch(err => console.log(err));
});

app.post('/createList/:name', (req, res) => {
  console.log('test');
  const db = dbService.getDbServiceInstance();
  const result = db.createList(req.params.name);

  result
  .then(data => res.json({data: data}))
  .catch(err => console.log(err));
});

app.listen(process.env.PORT, () => console.log(`listening on port ${process.env.PORT}`));