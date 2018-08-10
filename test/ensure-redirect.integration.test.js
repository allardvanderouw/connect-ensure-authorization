const assert = require('assert');
const request = require('supertest');

const { start, stop } = require('./start-redirect-server');

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

const login = () => new Promise((resolve, reject) => {
  request('http://localhost:3000')
    .post('/api/login')
    .send({
      username: testUser.username,
      password: testUser.password,
    })
    .end((error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
});

const logout = cookie => new Promise((resolve, reject) => {
  request('http://localhost:3000')
    .post('/api/logout')
    .set('cookie', cookie)
    .end((error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
});

const readScopes = cookie => new Promise((resolve, reject) => {
  request('http://localhost:3000')
    .get('/api/scopes')
    .set('cookie', cookie)
    .end((error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
});

const createScope = cookie => new Promise((resolve, reject) => {
  request('http://localhost:3000')
    .post('/api/scopes')
    .set('cookie', cookie)
    .end((error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
});

describe('ensure redirect integration test', () => {
  before((done) => {
    start()
      .then(() => {
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  after((done) => {
    stop()
      .then(() => {
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  describe('ensureScope', () => {
    it('should successfully login and access a protected route', (done) => {
      let cookie;

      login()
        .then((loginResponse) => {
          assert.equal(loginResponse.status, 200);
          assert.deepStrictEqual(loginResponse.body, testUser);

          cookie = loginResponse.headers['set-cookie'];
          assert.notEqual(cookie, undefined);

          return readScopes(cookie);
        })
        .then((readScopesResponse) => {
          assert.equal(readScopesResponse.status, 200);

          return logout(cookie);
        })
        .then((logoutResponse) => {
          assert.equal(logoutResponse.status, 200);
          assert.deepStrictEqual(logoutResponse.body, { logout: true });

          done();
        })
        .catch((error) => {
          done(error);
        });
    });

    it('should throw an error if the user is not authenticated', (done) => {
      request('http://localhost:3000')
        .get('/api/todos')
        .expect('Content-Type', /json/)
        .expect(401)
        .end((error, response) => {
          if (error) {
            done(error);
          } else {
            assert.deepStrictEqual(response.body, { message: 'Authentication required' });

            done();
          }
        });
    });

    it('should throw an error if the user is not authorized', (done) => {
      let cookie;

      login()
        .then((loginResponse) => {
          assert.equal(loginResponse.status, 200);
          assert.deepStrictEqual(loginResponse.body, testUser);

          cookie = loginResponse.headers['set-cookie'];
          assert.notEqual(cookie, undefined);

          return createScope(cookie);
        })
        .then((createScopeResponse) => {
          assert.equal(createScopeResponse.status, 302);
          assert.equal(createScopeResponse.headers.location, '/forbidden');

          return logout(cookie);
        })
        .then((logoutResponse) => {
          assert.equal(logoutResponse.status, 200);
          assert.deepStrictEqual(logoutResponse.body, { logout: true });

          done();
        })
        .catch((error) => {
          done(error);
        });
    });
  });
});
