const assert = require('assert');

const {
  ensureScope,
  ensurePermission,
  ensureRole,
  ensureGroup,
} = require('../lib');

describe('index unit test', () => {
  it('should export ensureScope function', () => {
    assert(typeof ensureScope === 'function');
  });

  it('should export ensurePermission function', () => {
    assert(typeof ensurePermission === 'function');
  });

  it('should export ensureRole function', () => {
    assert(typeof ensureRole === 'function');
  });

  it('should export ensureGroup function', () => {
    assert(typeof ensureGroup === 'function');
  });
});
