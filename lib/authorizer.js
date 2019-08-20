const DEFAULT_USER_PROPERTY = 'user';
const HTTP_STATUS_CODE_FORBIDDEN = 403;
const DEFAULT_NOT_AUTHORIZED_MESSAGE = 'Forbidden';

let userProperty;
let statusCode;
let message;
let redirectTo;
let onEnsureScope;
let onEnsurePermission;
let onEnsureRole;
let onEnsureGroup;

const initialize = (options) => {
  const {
    userProperty: _userProperty,
    statusCode: _statusCode,
    message: _message,
    redirectTo: _redirectTo,
    onEnsureScope: _onEnsureScope,
    onEnsurePermission: _onEnsurePermission,
    onEnsureRole: _onEnsureRole,
    onEnsureGroup: _onEnsureGroup,
  } = options;

  userProperty = _userProperty || userProperty;
  statusCode = _statusCode || statusCode;
  message = _message || message;
  redirectTo = _redirectTo || redirectTo;

  onEnsureScope = _onEnsureScope || onEnsureScope;
  onEnsurePermission = _onEnsurePermission || onEnsurePermission;
  onEnsureRole = _onEnsureRole || onEnsureRole;
  onEnsureGroup = _onEnsureGroup || onEnsureGroup;
};

const defaultEnsure = (ensureKey) => ({
  scope,
  permission,
  role,
  group,
  user,
} = {}) => {
  const ensureValue = scope || permission || role || group;
  if (!user || !user[ensureKey] || !ensureValue) {
    return false;
  }
  return user[ensureKey].includes(ensureValue);
};

const reset = () => {
  userProperty = DEFAULT_USER_PROPERTY;
  statusCode = HTTP_STATUS_CODE_FORBIDDEN;
  message = DEFAULT_NOT_AUTHORIZED_MESSAGE;
  redirectTo = null;
  onEnsureScope = defaultEnsure('scopes');
  onEnsurePermission = defaultEnsure('permissions');
  onEnsureRole = defaultEnsure('roles');
  onEnsureGroup = defaultEnsure('groups');
};

// Set initial values
reset();

module.exports = {
  initialize,
  reset,
  getUserProperty: () => userProperty,
  getStatusCode: () => statusCode,
  getMessage: () => message,
  getRedirectTo: () => redirectTo,
  ensureScope: (...args) => onEnsureScope(...args),
  ensurePermission: (...args) => onEnsurePermission(...args),
  ensureRole: (...args) => onEnsureRole(...args),
  ensureGroup: (...args) => onEnsureGroup(...args),
};
