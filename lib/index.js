/**
 * Expose middleware.
 */
const authorizer = require('./authorizer');
const ensure = require('./ensure');

module.exports = {
  initialize: authorizer.initialize,
  reset: authorizer.reset,
  ensureScope: ensure.ensureScope,
  ensurePermission: ensure.ensurePermission,
  ensureRole: ensure.ensureRole,
  ensureGroup: ensure.ensureGroup,
};
