'use strict';
const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Reality check', function () {

  it('true should be true', function () {
    expect(true).to.be.true;
  });

  it('2 + 2 should equal 4', function () {
    expect(2 + 2).to.equal(4);
  });

});

describe('Express static', function () {

  it('GET request "/" should return the index page', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });
});

describe('404 handler', function () {

  it('should respond with 404 when given a bad path', function () {
    return chai.request(app)
      .get('/DOES/NOT/EXIST')
      .then(res => {
        expect(res).to.have.status(404);
      });
  });

});

describe('GET /api/notes', function(){
  it('should return the default of 10 Notes as an array', function () {
    return chai.request(app)
      .get('/api/notes')
      .then(res => {
        expect(res).to.be.json;
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.equal(10);
        expect(res.body[0]).to.be.an('object');
      });
  });

  it('should return an array of objects with the id, title and content', function () {
    return chai.request(app)
      .get('/api/notes')
      .then(res => {
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.deep.include.keys('id', 'title', 'content');
      });
  });

  it('should return correct search results for a valid query', function(){
    return chai.request(app)
      .post('/api/notes')
      .send({title: 'My super unique dummy title', content: 'Blah Blah Blah'})
      .then(() => {
        return chai.request(app)
          .get('/api/notes')
          .query({searchTerm: 'unique dummy title'})
          .then(res => {
            expect(res).to.be.json;
            expect(res.body).to.be.an('array').that.has.lengthOf(1);
            expect(res.body[0]).to.be.an('object');
            expect(res.body[0]).to.deep.include({ title: 'My super unique dummy title'});
          });
      });
  });

  it('should return an empty array for an incorrect query', function(){
    return chai.request(app)
      .get('/api/notes')
      .query({searchTerm: 'blahblahtextlotsofblaaah'})
      .then(res => {
        expect(res.body).to.be.an('array').that.is.empty;
      });
  });
});

describe('GET /api/notes/:id', function(){
  it('should return correct note object with id, title and content for a given id and should respond with a 404 for an invalid id', function(){
    return chai.request(app)
      .get('/api/notes')
      .then(res1 => {
        const firstNote = res1.body[0];
        const firstNoteId = firstNote.id;
        return chai.request(app)
          .get(`/api/notes/${firstNoteId}`)
          .then(res2 => {
            expect(res2.body).to.be.an('object').that.is.deep.equal(firstNote);
            return chai.request(app)
              .get('/api/notes/DOESNOTEXIST')
              .then(res3 => {
                expect(res3).to.have.status(404);
              });
          });
      });
  });
});

describe('POST /api/notes', function (){
  it('should create and return a new item with location header when provided valid data', function(){
    const newNote = {title: 'Where is my cheese?', content: 'My cheese has escaped the fridge and ran away with his friends lettuce, avocado, lettuce, cucumbers and olive oil'};
    return chai.request(app)
      .post('/api/notes')
      .send(newNote)
      .then(res => {
        expect(res).to.have.status(201);
        expect(res).to.be.json.and.to.have.header('location');
        expect(res.body).to.include.keys('title', 'content');
        expect(res.body).to.deep.equal(Object.assign(newNote, {id: res.body.id}));
      });
  });

  it('should return an object with a message property "Missing title in request body" when missing "title" field', function(){
    const newItemWithoutTitle = {content: 'My cheese has escaped the fridge and ran away with his friends lettuce, avocado, lettuce, cucumbers and olive oil'};
    return chai.request(app)
      .post('/api/notes')
      .send(newItemWithoutTitle)
      .then(res => {
        expect(res).to.have.status(400);
        expect(res.body).to.deep.include({ message: 'Missing `title` in request body'});
      });
      
  });
});

describe('PUT /api/notes/:id', function(){
  it('should update and return a note object when given valid data', function(){
    const updatedObj = { 'title': 'Lebron James Decides to Join Boston Celtics',
      'content': 'Lebron James has joined Boston Celtics and re-united with his former teammate in Cleveland Kyrie Irving. Lebron will play under number 23 in Boston -- the same number he had when playing for the Cavaliers' };
    return chai.request(app)
      .get('/api/notes')
      .then(res => {
        const noteId = res.body[0].id;
        return chai.request(app)
          .put(`/api/notes/${noteId}`)
          .send(updatedObj)
          .then(response => {
            expect(response).to.be.json;
            expect(response.body).to.deep.equal(Object.assign({id: noteId}, updatedObj));
          });
      });
  });

  it('should respond with a 404 for an invalid id (/api/notes/DOESNOTEXIST)', function(){
    const badId = 'DOESNOTEXIST';
    const updatedObj = {
      'title': 'Lebron James Decides to Join Boston Celtics',
      'content': 'Lebron James has joined Boston Celtics and re-united with his former teammate in Cleveland Kyrie Irving. Lebron will play under number 23 in Boston -- the same number he had when playing for the Cavaliers'
    };
    return chai.request(app)
      .put(`/api/notes/${badId}`)
      .send(updatedObj)
      .then(res => {
        expect(res).to.have.status(404);
        expect(res.body).to.deep.include({message: 'Not Found'});
      });
  });

  it('should return an object with a message property "Missing title in request body" when missing "title" field', function(){
    const newItemWithoutTitle = { content: 'My cheese has escaped the fridge and ran away with his friends lettuce, avocado, lettuce, cucumbers and olive oil' };
    return chai.request(app)
      .get('/api/notes')
      .then(res => {
        const noteId = res.body[0].id;
        return chai.request(app)
          .put('/api/notes/'+ noteId)
          .send(newItemWithoutTitle)
          .then(response => {
            expect(response).to.have.status(400);
            expect(response.body).to.deep.include({ message: 'Missing `title` in request body' });
          });
      });

  });
});
