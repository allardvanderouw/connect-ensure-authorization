const assert = require('assert');
const sinon = require('sinon');

const { ensureScope } = require('../lib/ensure');

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

const expressStub = {
  req: {},
  res: {
    status: () => {},
    json: () => {},
  },
  next: () => {},
};

describe('ensure unit test', () => {
  describe('ensureScope', () => {
    const sandbox = sinon.createSandbox();

    afterEach(() => {
      sandbox.restore();
    });

    it('should successfully login and access a protected route', () => {
      const next = sandbox.stub(expressStub, 'next');

      ensureScope('scopes:read')({ user: testUser }, expressStub.res, expressStub.next);

      assert(next.calledOnce);
    });

    it('should throw an error if the user is not authenticated', () => {
      const status = sandbox.stub(expressStub.res, 'status');
      const next = sandbox.stub(expressStub, 'next');

      ensureScope('scopes:write')(expressStub.req, expressStub.res, expressStub.next);

      assert(status.calledWith(403));
      assert(!next.calledOnce);
    });

    it('should throw an error if the user is not authorized', () => {
      const status = sandbox.stub(expressStub.res, 'status');
      const next = sandbox.stub(expressStub, 'next');

      ensureScope('scopes:write')({ user: testUser }, expressStub.res, expressStub.next);

      assert(status.calledWith(403));
      assert(!next.calledOnce);
    });
  });
});
