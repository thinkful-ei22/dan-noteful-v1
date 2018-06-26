'use strict';

// Load array of notes
const data = require('./db/notes');

console.log('Hello Noteful!');

const express = require('express');
const logger = require('./middleware/logger');

const app = express();

const { PORT } = require('./config');

app.use(express.static('public'));
app.use(logger);

app.get('/api/notes', (req, res) => {
  const searchTerm = req.query.searchTerm;
  if (searchTerm) {
    const filteredList = data.filter(item => item.title.includes(searchTerm));
    res.json(filteredList);
  }
  else {
    res.json(data);
  }
});

app.get('/api/notes/:id', (req, res) => {
  res.json(data.find(item => item.id === Number(req.params.id)));
});

app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});
