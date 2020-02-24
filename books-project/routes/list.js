'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');

router.get('/create', routeGuard(true), (req, res, next) => {
   //....
  res.render('list/create');
});

router.post('/create', routeGuard(true), (req, res, next) => {
  //....
 res.redirect('list');
});

router.get('/:listId/edit', routeGuard(true), (req, res, next) => {
  //....
 res.render('list/edit');
});

router.post('/:listId/edit', routeGuard(true), (req, res, next) => {
  //....
 res.redirect('list');
});

router.get('/:listId', (req, res, next) => {
  //....
 res.render('list/show');
});

module.exports = router;
