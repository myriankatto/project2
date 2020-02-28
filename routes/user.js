'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');
const axios = require('axios');

const User = require(`./../models/user`);
const Review = require('./../models/review');

router.get('/:userId/account', routeGuard(true), (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)

    .then(user => {
      res.render(`user/account`, { user });
    })
    .catch(error => {
      next(error);
    });
});

router.get('/:userId/profile', (req, res, next) => {
  const { userId } = req.params;
  const loggedUser = req.user._id;
  let document;
  let sameUser;
  userId.toString() === loggedUser.toString() ? (sameUser = true) : (sameUser = false);

  const userHas = {
    about: false,
    location: false,
    booksInRead: false,
    booksInReading: false,
    booksInToRead: false,
    booksReviews: false
  };

  User.findById(userId)
    .then(result => {
      document = result;
      if (document.about && document.about.length > 0) {
        userHas.about = true;
      }
      if (document.location && document.about.length > 0) {
        userHas.location = true;
      }
      if (document.read.length > 0) {
        userHas.booksInRead = true;
      }
      if (document.reading.length > 0) {
        userHas.booksInReading = true;
      }
      if (document.toRead.length > 0) {
        userHas.booksInToRead = true;
      }
      return Review.find({ creator: userId });
    })
    .then(reviews => {
      console.log(reviews);
      if (reviews.length > 0) {
        userHas.booksReviews = true;
      }
      reviews.map(review => {
        return (review.sameUser = sameUser);
      });
      res.render(`user/profile`, { document, reviews, sameUser, userHas });
    })
    .catch(error => {
      next(error);
    });
});

router.get('/:userId/read', (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then(user => {
      res.render(`bookshelves/read`, { user });
    })
    .catch(error => {
      next(error);
    });
});

router.get('/:userId/toread', (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then(user => {
      res.render(`bookshelves/toread`, { user });
    })
    .catch(error => {
      next(error);
    });
});

router.get('/:userId/reading', (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then(user => {
      res.render(`bookshelves/reading`, { user });
    })
    .catch(error => {
      next(error);
    });
});

router.post('/:userId/reading/:bookId/delete', routeGuard(true), (req, res, next) => {
  const { userId, bookId } = req.params;
  let doc = req.user.reading.id(bookId).remove();
  req.user.save(error => {
    if (error) {
      next(error);
    }
  });
  res.redirect(`/user/${userId}/reading`);
});

router.post('/:userId/toread/:bookId/delete', routeGuard(true), (req, res, next) => {
  const { userId, bookId } = req.params;
  let doc = req.user.toRead.id(bookId).remove();
  req.user.save(error => {
    if (error) {
      next(error);
    }
  });
  res.redirect(`/user/${userId}/toread`);
});

router.post('/:userId/read/:bookId/delete', routeGuard(true), (req, res, next) => {
  const { userId, bookId } = req.params;
  let doc = req.user.read.id(bookId).remove();
  req.user.save(error => {
    if (error) {
      next(error);
    }
  });
  res.redirect(`/user/${userId}/read`);
});

router.get('/:userId/edit', routeGuard(true), (req, res, next) => {
  const { userId } = req.params;

  const userHasInfo = {
    name: false,
    about: false,
    location: false
  };

  User.findById(userId)
    .then(user => {
      if (user.name) {
        userHasInfo.name = true;
      }
      if (user.location) {
        userHasInfo.location = true;
      }
      if (user.about) {
        userHasInfo.about = true;
      }
      res.render('user/edit', { user, userHasInfo });
    })
    .catch(error => {
      next(error);
    });
});

router.post('/:userId/edit', routeGuard(true), (req, res, next) => {
  const { userId } = req.params;
  const { name, about, location } = req.body;

  User.findByIdAndUpdate(userId, { name, about, location })

    .then(() => {
      res.redirect(`/user/${userId}/account`);
    })

    .catch(error => {
      next(error);
    });
});

router.post('/:userId/delete', routeGuard(true), (req, res, next) => {
  const { userId } = req.params;

  User.findByIdAndRemove(userId)

    .then(() => {
      res.redirect(`/`);
    })

    .catch(error => {
      next(error);
    });
});

const multer = require('multer');
const cloudinary = require('cloudinary');
const multerStorageCloudinary = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multerStorageCloudinary({
  cloudinary,
  folder: 'books-project',
  allowedFormats: ['jpg', 'png', 'eps']
});

const uploader = multer({ storage });

router.post('/:userId/picture', routeGuard(true), uploader.single('picture'), (req, res, next) => {
  const { userId } = req.params;
  const { url } = req.file;

  User.findByIdAndUpdate(userId, { picture: url })

    .then(() => {
      res.redirect(`/user/${userId}/account`);
    })

    .catch(error => {
      next(error);
    });
});

module.exports = router;
