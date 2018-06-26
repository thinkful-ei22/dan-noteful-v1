'use strict';

// Simple In-Memory Database
const data = require('./db/notes');
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);

console.log('Hello Noteful!');

const express = require('express');
const logger = require('./middleware/logger');

const app = express();

const { PORT } = require('./config');

app.use(express.static('public'));
app.use(logger);

app.get('/api/notes', (req, res, next) => {
  const { searchTerm } = req.query;
  
  notes.filter(searchTerm, (err, list) => {
    if (err) {
      return next(err); //goes to error handler
    }
    res.json(list); //responds with filtered array
  });
});

app.get('/boom', (req, res, next) => {
  throw new Error('Boom!!!!!');
});

app.get('/api/notes/:id', (req, res, next) => {
  const id = Number(req.params.id);
  notes.find(id, (err, item) => {
    if (err) {
      return next(err);
    }
    res.json(item); //responds with found item
  });
});

app.use(function (req, res, next) {
  var err = new Error('Not found');
  err.status = 404;
  res.status(404).json({message: 'Not Found'});
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});
