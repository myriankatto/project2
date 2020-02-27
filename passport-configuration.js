'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./models/user');
const bcryptjs = require('bcryptjs');

const nodemailer = require('nodemailer');

passport.serializeUser((user, callback) => {
  callback(null, user._id);
});

passport.deserializeUser((id, callback) => {
  User.findById(id)
    .then(user => {
      callback(null, user);
    })
    .catch(error => {
      callback(error);
    });
});

const BOOKEMAIL = process.env.EMAIL;
const PASSWORD = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: BOOKEMAIL,
    pass: PASSWORD
  }
});

passport.use(
  'local-sign-up',
  new LocalStrategy({ passReqToCallback: true }, (req, username, password, callback) => {
    const email = req.body.email;
    let user;
    bcryptjs
      .hash(password, 10)
      .then(hash => {
        return User.create({
          username,
          email,
          passwordHash: hash
        });
      })
      .then(document => {
        user = document;

        return transporter.sendMail({
          from: `Books and Tea`,
          to: user.email,
          subject: `Welcome ${user.username} 📚`,
          html: `Welcome to Books and Tea.📚<br>
            <a href="/">Go Your Profile</a>`
        });
      })
      .then(() => {
        callback(null, user);
      })
      .catch(error => {
        callback(error);
      });
  })
);

passport.use(
  'local-sign-in',
  new LocalStrategy({}, (username, password, callback) => {
    let user;
    User.findOne({
      username
    })
      .then(document => {
        user = document;
        return bcryptjs.compare(password, user.passwordHash);
      })
      .then(passwordMatchesHash => {
        if (passwordMatchesHash) {
          callback(null, user);
        } else {
          callback(new Error('WRONG_PASSWORD'));
        }
      })
      .catch(error => {
        callback(error);
      });
  })
);
