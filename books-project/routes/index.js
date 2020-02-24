'use strict';

const { Router } = require('express');
const router = new Router();

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Hello World!' });
});

router.get('/search', (req, res, next) => {
  //....
 res.render('book/search');
});
module.exports = router;
