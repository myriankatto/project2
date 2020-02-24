'use strict';

const { Router } = require('express');

const passport = require('passport');

const router = new Router();

router.get('/sign-up', (req, res, next) => {
  res.render('authentication/sign-up');
});

router.post(
  '/sign-up',
  passport.authenticate('local-sign-up', {
    successRedirect: '/private',
    failureRedirect: '/authentication/sign-up'
  })
);

router.get('/sign-in', (req, res, next) => {
  res.render('authentication/sign-in');
});

router.post(
  '/sign-in',
  passport.authenticate('local-sign-in', {
    successRedirect: '/dashboard',
    failureRedirect: '/authentication/sign-in'
  })
);

router.post('/sign-out', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
