'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');
const axios = require('axios');
const User = require('./../models/user');
const Review = require('./../models/review');
const alert = require('alert-node');

router.post('/:id/review', routeGuard(true), (req, res, next) => {
  const id = req.params.id;
  const userId = req.user._id;
  const { content, rate } = req.body;

  User.findById(userId)
    .then(user => {
      if (!user) {
        return Promise.reject(new Error('NOT_FOUND'));
      } else {
        return Review.create({
          book: id,
          creator: userId,
          content,
          rate
        });
      }
    })

    .then(() => {
      res.redirect(`/book/${id}`);
    })

    .catch(error => {
      console.log(error);
    });
});

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  let data;

  const requestPromise = axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`);

  requestPromise
    .then(output => {
      data = output.data;

      return Review.find({ book: id }).populate(' creator ');
    })

    .then(reviews => {
      res.render('book/single', { data, reviews });
    })

    .catch(error => {
      console.log(error);
    });
});

// router.get('/:id', (req, res, next) => {
//   const id = req.params.id;

//   const requestPromise = axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`);

//   requestPromise
//     .then(output => {
//       const data = output.data;
//       //console.log(data);
//       res.render('book/single', { data });
//     })
//     .catch(error => {
//       console.log(error);
//     });
// });

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
      // console.log(bookInfo);
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
          if (!bookData) {
            userData.read = [...userData.read, bookData];
            return User.findByIdAndUpdate(userId, {
              read: userData.read
            });
          } else {
            alert('This book is already in the shelf');
            break;
          }
        case 'reading':
          if (!bookData) {
            userData.reading = [...userData.reading, bookData];
            return User.findByIdAndUpdate(userId, {
              reading: userData.reading
            });
          } else {
            alert('This book is already in the shelf');
            break;
          }
        case 'toRead':
          if (!bookData) {
            userData.toRead = [...userData.toRead, bookData];
            return User.findByIdAndUpdate(userId, {
              toRead: userData.toRead
            });
          } else {
            alert('This book is already in the shelf');
            break;
          }
      }
    })
    .then(() => {
      res.redirect(`/user/${userId}/profile`);
    })
    .catch(error => next(error));
});

module.exports = router;
