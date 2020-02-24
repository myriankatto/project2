'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');


router.get('/:bookId', (req, res, next) => {
   //....
  res.render('book/single');
});

router.post('/:bookId/review', routeGuard(true), (req, res, next) => {
  //....
 res.redirect('book/single');
});

module.exports = router;
