const jwt = require('../services/jwt');
const userService = require('../services/users');

/**
 * Authentication middleware to verify the validity of a session JWT and retrieve
 * the user information from the mock database to attach to the request
 * in order to use the information in any downstream requests
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const authentication = async (req, res, next) => {
  const { cookies : { session } } = req;
  try {
    const { username } = jwt.verifyToken(session);

    req.user = await userService.getUser(username);

    next();
  } catch (err) {
    // We'd want to create a new HTTP Error here with a 401 (Unauthenticated) status
    // then let the error middleware handle sending the status and associated message
    // body...
    // i.e. return next(HttpError({ status: 401, message: 'Unable to authenticate '}));
    res.sendStatus(401);
  }
};

module.exports = authentication;
