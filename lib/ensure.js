const authorizer = require('./authorizer');

const setUnauthorized = (res) => {
  if (authorizer.getRedirectTo()) {
    res.redirect(authorizer.getRedirectTo());
  } else {
    res.status(authorizer.getStatusCode());
    res.json({ message: authorizer.getMessage() });
  }
};

const ensure = ({ ensureFunctionName, ensureField }) => (ensureValue) => (req, res, next) => {
  const user = req[authorizer.getUserProperty()];
  if (!user) {
    return setUnauthorized(res);
  }

  const isAuthorized = authorizer[ensureFunctionName]({ user, [ensureField]: ensureValue });

  if (isAuthorized instanceof Promise) {
    return isAuthorized.then(() => next(), () => setUnauthorized(res));
  }
  if (!isAuthorized) {
    return setUnauthorized(res);
  }
  return next();
};

module.exports = {
  ensureScope: ensure({ ensureFunctionName: 'ensureScope', ensureField: 'scope' }),
  ensurePermission: ensure({ ensureFunctionName: 'ensurePermission', ensureField: 'permission' }),
  ensureRole: ensure({ ensureFunctionName: 'ensureRole', ensureField: 'role' }),
  ensureGroup: ensure({ ensureFunctionName: 'ensureGroup', ensureField: 'group' }),
};
