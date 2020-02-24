'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');
const axios = require('axios');

router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  console.log(id);

  const requestPromise = axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`);

  requestPromise
    .then(output => {
      const data = output.data.volumeInfo;

      console.log(data);
      res.render('book/single', { data });
    })
    .catch(error => {
      console.log(error);
    });
});

router.post('/:bookId/review', routeGuard(true), (req, res, next) => {
  //....
  res.redirect('book/single');
});

module.exports = router;
