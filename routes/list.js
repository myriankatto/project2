'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');

const List = require('./../models/list');
const User = require('./../models/user');
const Books = require('./../models/book');

router.get('/create', routeGuard(true), (req, res, next) => {
  res.render('list/create');
});

router.post('/create', routeGuard(true), (req, res, next) => {
  const { name } = req.body;
  const creator = req.user._id;

  List.create({
    name,
    creator
  })
    .then(list => {
      res.redirect(`/list/${list._id}`);
    })
    .catch(error => {
      next(error);
    });
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
  const { listId } = req.params;
  const creator = req.user._id;

  let list;

  List.findById(listId)
    .then(document => {
      if (!document) {
        next(new Error(`NOT_FOUND`));
      } else {
        list = document;
        return User.findById(creator);
      }
    })
    .then(user => {
      res.render('list/show', { list, user });
    })
    .catch(error => {
      next(error);
    });
});

router.post('/:listId/delete', routeGuard(true), (req, res, next) => {
  //....
  //  res.redirect('list');
});

module.exports = router;
