'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');

const User = require(`./../models/user`);

router.get('/:userId/account', routeGuard(true), (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)

    .then(user => {
      console.log(user);
      res.render(`user/account`, { user });
    })
    .catch(error => {
      next(error);
    });
});

router.get('/:userId/profile', (req, res, next) => {
  const { userId } = req.params;

  // let user;

  User.findById(userId)

    .then(user => {
      console.log(user);
      res.render(`user/profile`, { user });
    })
    // .then(document => {
    //   user = document;
    //   console.log(user);
    //   if (document) {
    //     return User.find({ user: userId });
    //   } else {
    //     next(new Error(`USER_NOT_FOUND`));
    //   }
    // })
    // .then(posts => {
    //   const isOwnProfile = req.user && req.user._id.toString() === user._id.toString();
    //   res.render(`user/profile`, { profile: user, posts, isOwnProfile });
    // })
    .catch(error => {
      next(error);
    });
});

router.get('/:userId/edit', routeGuard(true), (req, res, next) => {
  res.render('user/edit');
});

router.post('/:userId/edit', routeGuard(true), (req, res, next) => {
  const { userId } = req.params;
  const { about, location } = req.body;

  console.log(req.body);

  User.findByIdAndUpdate(userId, { about, location })

    .then(() => {
      // console.log(about);
      res.redirect(`/user/${userId}/account`);
    })

    .catch(error => {
      next(error);
    });
});

module.exports = router;
