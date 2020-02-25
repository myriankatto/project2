'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');
const axios = require('axios');

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
  User.findById(userId)
    .then(document => {
      res.render(`user/profile`, { document });
    })
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
