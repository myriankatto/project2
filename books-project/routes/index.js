'use strict';

const { Router } = require('express');
const router = new Router();
const axios = require('axios');

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Hello World!' });
});

router.get('/search', (req, res, next) => {
  const term = req.query.term;

  const requestPromise = axios.get(
    `https://www.googleapis.com/books/v1/volumes?q=${term}&maxResults=30`
  );

  requestPromise
    .then(output => {
      const data = output.data.items.map(file => {
        // console.log(file.volumeInfo.authors);
        return file;
      });
      res.render('book/search', { data });
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = router;
