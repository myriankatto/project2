'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');
const axios = require('axios');
const User = require('./../models/user');
const Review = require('./../models/review');
const alert = require('alert-node');

router.post('/:bookId/review/delete', routeGuard(true), (req, res, next) => {
  const { bookId } = req.params;
  const userId = req.user._id;

  Review.findOneAndRemove({ 'book.googleID': bookId })
    .then(() => {
      console.log('review deleted');
      res.redirect(`/user/${userId}/profile`);
    })
    .catch(error => {
      console.log(error);
    });
});

router.post('/:bookId/review', routeGuard(true), (req, res, next) => {
  const { bookId } = req.params;
  const userId = req.user._id;
  const { content, rate } = req.body;

  let bookData;

  axios
    .get(`https://www.googleapis.com/books/v1/volumes/${bookId}`)
    .then(bookInfo => {
      if (bookInfo.data.volumeInfo.imageLinks) {
        bookData = {
          googleID: bookInfo.data.id,
          title: bookInfo.data.volumeInfo.title,
          author: bookInfo.data.volumeInfo.authors,
          imageUrl: bookInfo.data.volumeInfo.imageLinks.thumbnail
        };
      } else {
        bookData = {
          googleID: bookInfo.data.id,
          title: bookInfo.data.volumeInfo.title,
          author: bookInfo.data.volumeInfo.authors,
          imageUrl:
            'https://dl.acm.org/specs/products/acm/releasedAssets/images/cover-default--book.svg'
        };
      }
      return User.findById(userId);
    })
    .then(user => {
      if (!user) {
        return Promise.reject(new Error('NOT_FOUND'));
      } else {
        return Review.create({
          book: bookData,
          creator: userId,
          content,
          rate
        });
      }
    })
    .then(() => {
      res.redirect(`/book/${bookId}`);
    })

    .catch(error => {
      console.log(error);
    });
});

router.get('/:bookId', (req, res, next) => {
  const { bookId } = req.params;
  let data;

  const requestPromise = axios.get(`https://www.googleapis.com/books/v1/volumes/${bookId}`);

  requestPromise
    .then(output => {
      data = output.data;

      return Review.find({
        'book.googleID': bookId
      }).populate(' creator ');
    })

    .then(reviews => {
      // console.log(reviews);
      res.render('book/single', { data, reviews });
    })

    .catch(error => {
      console.log(error);
    });
});

router.post('/:bookId', (req, res, next) => {
  const { bookId } = req.params;
  const bookshelf = req.body.bookshelf;
  const userId = req.user._id;
  //first thing is to look up the users information
  let userData;
  let bookData;
  axios
    .get(`https://www.googleapis.com/books/v1/volumes/${bookId}`)
    .then(bookInfo => {
      let image;
      const defaultImage =
        'https://dl.acm.org/specs/products/acm/releasedAssets/images/cover-default--book.svg';
      const apiImage = bookInfo.data.volumeInfo.imageLinks;
      apiImage ? (image = apiImage.thumbnail) : (image = defaultImage);

      bookData = {
        googleID: bookInfo.data.id,
        title: bookInfo.data.volumeInfo.title,
        author: bookInfo.data.volumeInfo.authors,
        imageUrl: image
      };
      return User.findById(userId);
    })
    .then(user => {
      userData = user;
      switch (bookshelf) {
        case 'read':
          // eslint-disable-next-line no-case-declarations
          let bookExists = false;
          for (let i = 0; i < userData.read.length; i++) {
            if (userData.read[i].googleID === bookData.googleID) {
              bookExists = true;
            }
          }
          if (!bookExists) {
            userData.read = [...userData.read, bookData];
            return User.findByIdAndUpdate(userId, {
              read: userData.read
            });
          } else {
            //console.log('book already exists');
            alert('This book is already in the shelf');
          }
          break;
        case 'reading':
          if (!userData.reading.includes(bookData)) {
            userData.reading = [...userData.reading, bookData];
            return User.findByIdAndUpdate(userId, {
              reading: userData.reading
            });
          } else {
            alert('This book is already in the shelf');
            break;
          }
        case 'toRead':
          if (!userData.toRead.includes(bookData)) {
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
