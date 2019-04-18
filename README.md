# connect-ensure-authorization

[![NPM version](https://img.shields.io/npm/v/connect-ensure-authorization.svg)](https://www.npmjs.com/package/connect-ensure-authorization)
[![Build Status](https://travis-ci.com/allardvanderouw/connect-ensure-authorization.svg?branch=master)](https://travis-ci.com/allardvanderouw/connect-ensure-authorization)
[![codecov](https://codecov.io/gh/allardvanderouw/connect-ensure-authorization/branch/master/graph/badge.svg)](https://codecov.io/gh/allardvanderouw/connect-ensure-authorization)
[![devDependencies Status](https://david-dm.org/allardvanderouw/connect-ensure-authorization/dev-status.svg)](https://david-dm.org/allardvanderouw/connect-ensure-authorization?type=dev) [![Greenkeeper badge](https://badges.greenkeeper.io/allardvanderouw/connect-ensure-authorization.svg)](https://greenkeeper.io/)

This middleware ensures that a user is authorized. If the user is unauthorized, the request returns a JSON error by default or redirects the user with additional configuration.

## Table of contents

   * [Install](#install)
   * [Usage](#usage)
      * [Ensure scope](#ensure-scope)
      * [Other ensure functions](#ensure-functions)
      * [Custom ensure implementation](#custom-ensure-implementation)
      * [Custom status code and/or message](#custom-status-code-andor-message)
      * [Redirect instead of return JSON](#redirect-instead-of-return-json)
      * [Custom user property](#custom-user-property)
   * [Usage with Passport](#usage-with-passport)

## Install

Yarn
```
$ yarn add connect-ensure-authorization
```

NPM
```
$ npm install connect-ensure-authorization
```

## Usage

### Ensure scope

In this example, an application has a todos API endpoint. A user must be authorized before accessing this endpoint.

```javascript
const express = require('express');
const { ensureScope } = require('connect-ensure-authorization');

const app = express();

// req.user should be like:
// {
//   username: 'bob', <-- dummy data
//   fullName: 'Bob', <-- dummy data
//   scopes: ['todos:read'] <-- used for scope checking
// }

app.get('/api/todos', ensureScope('todos:read'), (req, res) => {
  res.json([
    {
      text: 'First todo',
      completed: false,
    },
    {
      text: 'Second todo',
      completed: true,
    }
  ]);
});
```
      
If a user is not authorized when attempting to access this API, the request will return the default 403 status code with the default message "Forbidden". 

### Ensure functions

The following ensure functions are available:

| Function | User property |
| - | - |
| `ensureScope` | `scopes` |
| `ensurePermission` | `permissions` |
| `ensureRole` | `roles` |
| `ensureGroup` | `groups` |

All functions will check its corresponding user property. The user property should contain an array with strings. The ensure function does an `Array.includes` check. This default implementation can be modified to your custom requirement.

### Custom ensure implementation

The ensure implementation can be overwritten with a custom implementation. This function must return a `Promise` or a `Boolean`.

```javascript
const express = require('express');
const {
  initialize: initializeAuthorization,
  ensureScope
} = require('connect-ensure-authorization');

const app = express();

const onEnsureScope = ({ user, scope }) => new Promise((resolve, reject) => {
  if (user.scopes.includes(scope)) {
    resolve();
  } else {
    reject();
  }
});

initializeAuthorization({ onEnsureScope });

app.get('/api/todos', ensureScope('todos:read'), (req, res) => {
  res.json([
    {
      text: 'First todo',
      completed: false,
    },
    {
      text: 'Second todo',
      completed: true,
    }
  ]);
});
```

The other ensure implementations are also supported to be overwritten (by passing `onEnsurePermission`, `onEnsureRole` and `onEnsureGroup`).

### Custom status code and/or message

The middleware can be configured to return another status code and/or message when unauthorized.

```javascript
const express = require('express');
const { initialize: initializeAuthorization } = require('connect-ensure-authorization');

const app = express();

initializeAuthorization({
  statusCode: 418, // default = 403
  message: 'I\'m a teapot!', // default = "Forbidden"
});

app.get('/api/todos', ensureScope('todos:read'), (req, res) => {
  res.json([
    {
      text: 'First todo',
      completed: false,
    },
    {
      text: 'Second todo',
      completed: true,
    }
  ]);
});
```

### Redirect instead of return JSON

The following example redirects to `/forbidden` instead of returning a JSON message.

```javascript
const express = require('express');
const { initialize: initializeAuthorization } = require('connect-ensure-authorization');

const app = express()

initializeAuthorization({
  redirectTo: '/forbidden', // default = null
});

app.get('/api/todos', ensureScope('todos:read'), (req, res) => {
  res.json([
    {
      text: 'First todo',
      completed: false,
    },
    {
      text: 'Second todo',
      completed: true,
    }
  ]);
});
```

### Custom user property

If you are using [Passport](https://github.com/jaredhanson/passport), this defaultly sets the `req.user` after logging in. This can be modified to for example `req.account`. 

```javascript
const express = require('express');
const { initialize: initializeAuthorization } = require('connect-ensure-authorization');

const app = express()

initializeAuthorization({
  userProperty: 'account', // default = "user"
});

// req.account should be like:
// {
//   accountName: 'bob', // dummy data
//   fullName: 'Bob', // dummy data
//   scopes: ['todos:read'] <-- used for scope checking
// }

app.get('/api/todos', ensureScope('todos:read'), (req, res) => {
  res.json([
    {
      text: 'First todo',
      completed: false,
    },
    {
      text: 'Second todo',
      completed: true,
    }
  ]);
});
```

## Usage with Passport

Take a look at the integration test for some inspiration.  
I have also created a single file example repository using this module: https://github.com/allardvanderouw/express-api-passport-local-mongo-session-example/blob/master/server.js
