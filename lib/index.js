/**
 * Expose middleware.
 */
const authorizer = require('./authorizer');
const ensure = require('./ensure');

module.exports = {
  ...ensure,
  initialize: authorizer.initialize,
  reset: authorizer.reset,
};
