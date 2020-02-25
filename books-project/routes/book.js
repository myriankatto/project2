'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');
const axios = require('axios');
const Books = require('./../models/book');
const User = require('./../models/user');

router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  console.log(id);

  const requestPromise = axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`);

  requestPromise
    .then(output => {
      const data = output.data.volumeInfo;

      console.log(data);
      res.render('book/single', { data });
    })
    .catch(error => {
      console.log(error);
    });
});

router.post('/:id', (req, res, next) => {
  const bookId = req.params.id;
  const bookshelf = req.body.bookshelf;
  const userId = req.user._id;
  //first thing is to look up the users information
  let userData;
  let bookData;
  axios
    .get(`https://www.googleapis.com/books/v1/volumes/${bookId}`)
    .then(bookInfo => {
      console.log(bookInfo);
      bookData = {
        googleID: bookInfo.data.id,
        title: bookInfo.data.volumeInfo.title,
        author: bookInfo.data.volumeInfo.authors,
        imageUrl: bookInfo.data.volumeInfo.imageLinks.thumbnail
      };
      return User.findById(userId);
    })
    .then(user => {
      userData = user;
      switch (bookshelf) {
        case 'read':
          userData.read = [...userData.read, bookData];
          return User.findByIdAndUpdate(userId, {
            read: userData.read
          });
        case 'reading':
          userData.reading = [...userData.reading, bookData];
          return User.findByIdAndUpdate(userId, {
            reading: userData.reading
          });
        case 'toRead':
          userData.toRead = [...userData.toRead, bookData];
          return User.findByIdAndUpdate(userId, {
            toRead: userData.toRead
          });
      }
    })
    .then(() => {
      res.redirect('/');
    })
    .catch(error => next(error));
});

router.post('/:bookId/review', routeGuard(true), (req, res, next) => {
  //....
  res.redirect('book/single');
});

module.exports = router;
