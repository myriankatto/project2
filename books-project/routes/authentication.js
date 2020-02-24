'use strict';

const { Router } = require('express');

const passport = require('passport');

const router = new Router();

const routeGuard = require('./../middleware/route-guard');

router.get('/sign-up', routeGuard(false), (req, res, next) => {
  res.render('authentication/sign-up');
});

router.post(
  '/sign-up',
  routeGuard(false),
  passport.authenticate('local-sign-up', {
    successRedirect: '/',
    failureRedirect: '/authentication/sign-up'
  })
);

router.get('/sign-in', routeGuard(false), (req, res, next) => {
  res.render('authentication/sign-in');
});

router.post(
  '/sign-in',
  routeGuard(false),
  passport.authenticate('local-sign-in', {
    successRedirect: '/',
    failureRedirect: '/authentication/sign-in'
  })
);

router.post('/sign-out', routeGuard(true), (req, res, next) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
