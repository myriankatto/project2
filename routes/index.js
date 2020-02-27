'use strict';

const { Router } = require('express');
const router = new Router();
const axios = require('axios');

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Books and Tea' });
});

router.get('/search/:page/q=:term', (req, res, next) => {
  const { term, page } = req.params;
  const termWithoutSpaces = term.trim().replace(' ', '+');

  let requestPromise;

  const pagesObj = {
    page1: false,
    page2: false,
    page3: false,
    page4: false
  };

  switch (page) {
    case '1':
      pagesObj.page1 = true;
      console.log(pagesObj);
      requestPromise = axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${term}&maxResults=40`
      );
      break;
    case '2':
      pagesObj.page2 = true;
      console.log(pagesObj);
      requestPromise = axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${term}&startIndex=40&maxResults=40`
      );
      break;
    case '3':
      pagesObj.page3 = true;
      console.log(pagesObj);
      requestPromise = axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${term}&startIndex=80&maxResults=40`
      );
      break;
    case '4':
      pagesObj.page4 = true;
      console.log(pagesObj);
      requestPromise = axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${term}&startIndex=100&maxResults=40`
      );
      break;
  }

  requestPromise
    .then(output => {
      const data = output.data.items.map(file => {
        // console.log(file.volumeInfo.authors);
        return file;
      });
      res.render('book/search', { data, termWithoutSpaces, pagesObj });
    })
    .catch(error => {
      console.log(error);
    });
});

router.get('/search', (req, res, next) => {
  const term = req.query.term;
  const termWithoutSpaces = term.trim().replace(' ', '+');

  const firstPage = true;

  const requestPromise = axios.get(
    `https://www.googleapis.com/books/v1/volumes?q=${term}&maxResults=40`
  );

  requestPromise
    .then(output => {
      const data = output.data.items.map(file => {
        // console.log(file.volumeInfo.authors);
        return file;
      });
      res.render('book/search', { data, termWithoutSpaces, firstPage });
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = router;
