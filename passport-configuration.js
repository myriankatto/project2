'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
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
    const { name, email } = req.body;
    let user;
    bcryptjs
      .hash(password, 10)
      .then(hash => {
        return User.create({
          name,
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
          subject: `Welcome ${user.name} 📚`,
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

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: 'http://localhost:3000/authentication/facebook/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('profile', profile);
      const data = {
        name: profile.displayName,
        facebookId: profile.id,
        facebookToken: accessToken
      };
      User.findOne({ facebookId: data.facebookId })
        .then(userExists => {
          if (userExists) {
            return Promise.resolve(userExists);
          } else {
            return User.create(data);
          }
        })
        .then(newUser => {
          done(null, newUser);
        })
        .catch(error => done(error));
    }
  )
);
