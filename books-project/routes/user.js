'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');

router.get('/:userId/dashboard', routeGuard(true), (req, res, next) => {
   //....
  res.render('user/dashboard');
});

router.get('/:userId/profile', (req, res, next) => {
  //....
  res.render('user/profile');
});

router.get('/:userId/edit', routeGuard(true), (req, res, next) => {
  //....
  res.render('user/profile/edit');
});

router.post('/:userId/edit', routeGuard(true), (req, res, next) => {
  //....
  res.redirect('user/profile');
});

module.exports = router;
