'use strict';
const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

// GET Notes with search
notes.filter('cats', (err, list) => {
  if (err) {
    console.error(err);
  }
  console.log(list);
});

// GET Notes by ID
notes.find(1005, (err, item) => {
  if (err) {
    console.error(err);
  }
  if (item) {
    console.log(item);
  } else {
    console.log('not found');
  }
});

// PUT (Update) Notes by ID
const updateObj = {
  title: 'New Title',
  content: 'Blah blah blah'
};

notes.update(1005, updateObj, (err, item) => {
  if (err) {
    console.error(err);
  }
  if (item) {
    console.log(item);
  } else {
    console.log('not found');
  }
});

// POST (create) Note
const newItem = {
  'title': 'My test Title',
  'content': 'Some textfiller here'
};

notes.create(newItem, (err, item) => {
  if (err) console.error(err);

  console.log(item);
});

//DELETE (delete) Note
const id ='abc';

notes.delete(id, (err, length) => {
  if (err || !length) console.error('something is wrong!');

  console.log('deleted!');
});