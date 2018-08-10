const assert = require('assert');

const {
  ensureScope,
  ensurePermission,
  ensureRole,
  ensureGroup,
} = require('../lib/authorizer');

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

describe('authorizer unit test', () => {
  describe('ensureScope', () => {
    it('should successfully login and access a protected route', () => {
      const isAuthorized = ensureScope({ user: testUser, scope: 'scopes:read' });
      assert.equal(isAuthorized, true);
    });

    it('should throw an error if the user is not authenticated', () => {
      const isAuthorized = ensureScope({ user: null, scope: 'scopes:write' });
      assert.equal(isAuthorized, false);
    });

    it('should throw an error if the user is not authorized', () => {
      const isAuthorized = ensureScope({ user: testUser, scope: 'scopes:write' });
      assert.equal(isAuthorized, false);
    });
  });

  describe('ensurePermission', () => {
    it('should successfully login and access a protected route', () => {
      const isAuthorized = ensurePermission({ user: testUser, permission: 'read-permissions' });
      assert.equal(isAuthorized, true);
    });

    it('should throw an error if the user is not authenticated', () => {
      const isAuthorized = ensurePermission({ user: null, permission: 'write-permissions' });
      assert.equal(isAuthorized, false);
    });

    it('should throw an error if the user is not authorized', () => {
      const isAuthorized = ensurePermission({ user: testUser, permission: 'write-permissions' });
      assert.equal(isAuthorized, false);
    });
  });

  describe('ensureRole', () => {
    it('should successfully login and access a protected route', () => {
      const isAuthorized = ensureRole({ user: testUser, permission: 'consumer' });
      assert.equal(isAuthorized, true);
    });

    it('should throw an error if the user is not authenticated', () => {
      const isAuthorized = ensureRole({ user: null, permission: 'publisher' });
      assert.equal(isAuthorized, false);
    });

    it('should throw an error if the user is not authorized', () => {
      const isAuthorized = ensureRole({ user: testUser, permission: 'publisher' });
      assert.equal(isAuthorized, false);
    });
  });

  describe('ensureGroup', () => {
    it('should successfully login and access a protected route', () => {
      const isAuthorized = ensureGroup({ user: testUser, group: 'consumers' });
      assert.equal(isAuthorized, true);
    });

    it('should throw an error if the user is not authenticated', () => {
      const isAuthorized = ensureGroup({ user: null, group: 'publishers' });
      assert.equal(isAuthorized, false);
    });

    it('should throw an error if the user is not authorized', () => {
      const isAuthorized = ensureGroup({ user: testUser, group: 'publishers' });
      assert.equal(isAuthorized, false);
    });
  });
});
