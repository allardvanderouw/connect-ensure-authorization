const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { ensureAuthenticated } = require('connect-ensure-authenticated');

const {
  reset: resetAuthorization,
  ensureScope,
  ensurePermission,
  ensureRole,
  ensureGroup,
} = require('../lib');

const testUser = {
  username: 'bob',
  password: '12345',
  firstName: 'Bob',
  favoriteNumber: 42,
  scopes: ['scopes:read'],
  permissions: ['read-permissions'],
  roles: ['consumer'],
  groups: ['consumers'],
};

let server;

// Start a test server with Passport configuration and routes
const start = () => new Promise((resolve, reject) => {
  try {
    const app = express();

    // Resolve with test user without checks for test
    passport.use(new LocalStrategy((username, password, cb) => {
      cb(null, testUser);
    }));

    passport.serializeUser((user, cb) => {
      cb(null, user.username);
    });

    // Resolve with test user without checks for test
    passport.deserializeUser((username, cb) => {
      cb(null, testUser);
    });

    app.use(cookieParser()); // Add cookieParser for user serialization from cookie
    app.use(bodyParser.json()); // The json bodyParser is added the set JSON data in req.body
    app.use(session({ secret: 'default', resave: false, saveUninitialized: false })); // Add sessions

    app.use(passport.initialize()); // Initialize passport
    app.use(passport.session()); // Add session to passport

    // Add authentication requirement for all endpoints except /api/login
    app.use(ensureAuthenticated().unless({
      path: ['/api/login'],
    }));

    // Login API
    app.post('/api/login', (req, res, next) => {
      passport.authenticate('local', (authenticationError, user, info) => {
        if (authenticationError) {
          res.status(500);
          res.json({ error: authenticationError });
        } else if (info) {
          res.status(400);
          res.json({ error: info });
        } else {
          req.logIn(user, (loginError) => {
            if (loginError) {
              res.status(401);
              res.json({ error: loginError });
            } else {
              res.status(200);
              res.json(user);
            }
          });
        }
      })(req, res, next);
    });

    // End session
    app.post('/api/logout', (req, res) => {
      req.logout();
      res.json({ logout: true });
    });

    app.get('/api/scopes', ensureScope('scopes:read'), (req, res) => {
      res.status(200);
      res.send();
    });

    app.post('/api/scopes', ensureScope('scopes:write'), (req, res) => {
      res.status(200);
      res.send();
    });

    app.get('/api/permissions', ensurePermission('read-permissions'), (req, res) => {
      res.status(200);
      res.send();
    });

    app.post('/api/permissions', ensurePermission('write-permissions'), (req, res) => {
      res.status(200);
      res.send();
    });

    app.get('/api/roles', ensureRole('consumer'), (req, res) => {
      res.status(200);
      res.send();
    });

    app.post('/api/roles', ensureRole('publisher'), (req, res) => {
      res.status(200);
      res.send();
    });

    app.get('/api/groups', ensureGroup('consumers'), (req, res) => {
      res.status(200);
      res.send();
    });

    app.post('/api/groups', ensureGroup('publishers'), (req, res) => {
      res.status(200);
      res.send();
    });

    // Start server
    server = app.listen(3000, () => {
      resolve();
    });
  } catch (error) {
    reject(error);
  }
});

const stop = () => new Promise((resolve, reject) => {
  try {
    server.close(() => {
      resetAuthorization();
      resolve();
    });
  } catch (error) {
    reject(error);
  }
});

module.exports = { start, stop };
