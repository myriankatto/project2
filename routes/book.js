'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');
const axios = require('axios');
const User = require('./../models/user');
const Review = require('./../models/review');
const alert = require('alert-node');

router.get('/:bookId/review/:reviewId/edit', routeGuard(true), (req, res, next) => {
  const { reviewId } = req.params;
  const rates = {
    rate1: false,
    rate2: false,
    rate3: false,
    rate4: false,
    rate5: false
  };

  Review.findById(reviewId)
    .then(review => {
      if (review.rate == 1) {
        rates.rate1 = true;
      } else if (review.rate == 2) {
        rates.rate2 = true;
      } else if (review.rate == 3) {
        rates.rate3 = true;
      } else if (review.rate == 4) {
        rates.rate4 = true;
      } else if (review.rate == 5) {
        rates.rate5 = true;
      }

      res.render('book/reviewedit', { review, rates });
    })
    .catch(error => {
      console.log(error);
    });
});

router.post('/:bookId/review/:reviewId/edit', routeGuard(true), (req, res, next) => {
  const { reviewId } = req.params;
  const { rate, content } = req.body;
  const userId = req.user._id;

  Review.findByIdAndUpdate(reviewId, { rate, content })
    .then(() => {
      res.redirect(`/user/${userId}/profile`);
    })
    .catch(error => {
      console.log(error);
    });
});

router.post('/:bookId/review/:reviewId/delete', routeGuard(true), (req, res, next) => {
  const { reviewId } = req.params;
  const userId = req.user._id;

  Review.findByIdAndRemove(reviewId)
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
          let bookExistsInReadShelf = false;
          for (let i = 0; i < userData.read.length; i++) {
            if (userData.read[i].googleID === bookData.googleID) {
              bookExistsInReadShelf = true;
            }
          }
          if (!bookExistsInReadShelf) {
            userData.read = [...userData.read, bookData];
            return User.findByIdAndUpdate(userId, {
              read: userData.read
            });
          } else {
            //console.log('This book is already in the shelf');
            alert('This book is already in the shelf');
          }
          break;
        case 'reading':
          // eslint-disable-next-line no-case-declarations
          let bookExistsInReadingShelf = false;
          for (let i = 0; i < userData.reading.length; i++) {
            if (userData.reading[i].googleID === bookData.googleID) {
              bookExistsInReadingShelf = true;
            }
          }
          if (!bookExistsInReadingShelf) {
            userData.reading = [...userData.reading, bookData];
            return User.findByIdAndUpdate(userId, {
              reading: userData.reading
            });
          } else {
            // console.log('This book is already in the shelf');
            alert('This book is already in the shelf');
          }
          break;
        case 'toRead':
          // eslint-disable-next-line no-case-declarations
          let bookExistsInToReadShelf = false;
          for (let i = 0; i < userData.toRead.length; i++) {
            if (userData.toRead[i].googleID === bookData.googleID) {
              bookExistsInToReadShelf = true;
            }
          }
          if (!bookExistsInToReadShelf) {
            userData.toRead = [...userData.toRead, bookData];
            return User.findByIdAndUpdate(userId, {
              toRead: userData.toRead
            });
          } else {
            // console.log('This book is already in the shelf');
            alert('This book is already in the shelf');
          }
          break;
      }
    })
    .then(() => {
      res.redirect(`/user/${userId}/profile`);
    })
    .catch(error => next(error));
});

module.exports = router;
