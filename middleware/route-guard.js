'use strict';

// Route Guard Middleware
// This piece of middleware is going to check if a user is authenticated
// If not, it sends the request to the app error handler with a message

module.exports = userShouldBeAuthenticated => (req, res, next) => {
  if (userShouldBeAuthenticated) {
    if (req.user) {
      next();
    } else {
      next(new Error(`AUTHENTICATION_REQUIRED`));
      // const error = new Error('AUTHENTICATION_REQUIRED');
      // error.status = 401;
    }
  } else {
    if (req.user) {
      next(new Error(`VISITOR_EXPECTED`));
    } else {
      next();
    }
  }
};