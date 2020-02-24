'use strict';

const { Router } = require('express');
const router = new Router();
const axios = require('axios');

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Hello World!' });
});

router.get('/search', (req, res, next) => {
  const term = req.query.term;
  // console.log(term);

  const requestPromise = axios.get(`https://www.googleapis.com/books/v1/volumes?q=${term}`);

  requestPromise
    .then(output => {
      const data = output.data.items.map(file => {
        return file;
      });
      // console.log(id);
      // const data = output.data.items.map(file => {
      //   return file.volumeInfo;
      // });
      //console.log(data);
      res.render('book/search', { data });
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = router;
