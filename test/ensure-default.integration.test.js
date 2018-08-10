const assert = require('assert');
const request = require('supertest');

const { start, stop } = require('./start-default-server');

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

const readPermissions = cookie => new Promise((resolve, reject) => {
  request('http://localhost:3000')
    .get('/api/permissions')
    .set('cookie', cookie)
    .end((error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
});

const createPermission = cookie => new Promise((resolve, reject) => {
  request('http://localhost:3000')
    .post('/api/permissions')
    .set('cookie', cookie)
    .end((error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
});

const readRoles = cookie => new Promise((resolve, reject) => {
  request('http://localhost:3000')
    .get('/api/roles')
    .set('cookie', cookie)
    .end((error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
});

const createRole = cookie => new Promise((resolve, reject) => {
  request('http://localhost:3000')
    .post('/api/roles')
    .set('cookie', cookie)
    .end((error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
});

const readGroups = cookie => new Promise((resolve, reject) => {
  request('http://localhost:3000')
    .get('/api/groups')
    .set('cookie', cookie)
    .end((error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
});

const createGroup = cookie => new Promise((resolve, reject) => {
  request('http://localhost:3000')
    .post('/api/groups')
    .set('cookie', cookie)
    .end((error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
});

describe('ensure integration test', () => {
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
          assert.equal(createScopeResponse.status, 403);
          assert.deepStrictEqual(createScopeResponse.body, { message: 'Forbidden' });

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

  describe('ensurePermission', () => {
    it('should successfully login and access a protected route', (done) => {
      let cookie;

      login()
        .then((loginResponse) => {
          assert.equal(loginResponse.status, 200);
          assert.deepStrictEqual(loginResponse.body, testUser);

          cookie = loginResponse.headers['set-cookie'];
          assert.notEqual(cookie, undefined);

          return readPermissions(cookie);
        })
        .then((readPermissionsResponse) => {
          assert.equal(readPermissionsResponse.status, 200);

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

          return createPermission(cookie);
        })
        .then((createPermissionResponse) => {
          assert.equal(createPermissionResponse.status, 403);
          assert.deepStrictEqual(createPermissionResponse.body, { message: 'Forbidden' });

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

  describe('ensureRole', () => {
    it('should successfully login and access a protected route', (done) => {
      let cookie;

      login()
        .then((loginResponse) => {
          assert.equal(loginResponse.status, 200);
          assert.deepStrictEqual(loginResponse.body, testUser);

          cookie = loginResponse.headers['set-cookie'];
          assert.notEqual(cookie, undefined);

          return readRoles(cookie);
        })
        .then((readRolesResponse) => {
          assert.equal(readRolesResponse.status, 200);

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
        .get('/api/todos/1')
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

          return createRole(cookie);
        })
        .then((createRoleResponse) => {
          assert.equal(createRoleResponse.status, 403);
          assert.deepStrictEqual(createRoleResponse.body, { message: 'Forbidden' });

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

  describe('ensureGroup', () => {
    it('should successfully login and access a protected route', (done) => {
      let cookie;

      login()
        .then((loginResponse) => {
          assert.equal(loginResponse.status, 200);
          assert.deepStrictEqual(loginResponse.body, testUser);

          cookie = loginResponse.headers['set-cookie'];
          assert.notEqual(cookie, undefined);

          return readGroups(cookie);
        })
        .then((readGroupsResponse) => {
          assert.equal(readGroupsResponse.status, 200);

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
        .get('/api/todos/1')
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

          return createGroup(cookie);
        })
        .then((createGroupResponse) => {
          assert.equal(createGroupResponse.status, 403);
          assert.deepStrictEqual(createGroupResponse.body, { message: 'Forbidden' });

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
