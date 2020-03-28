const bcrypt = require('bcrypt');

const dataService = require('../services/database');
const jwt = require('../services/jwt');

/**
 * Returns the current authenticated user's details
 * @param req
 * @param res
 */
const currentUser = (req, res) => {
  const { user } = req;
  res.json(user);
};

/**
 * Attempts to create a user with the given registration details
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const createUser = async (req, res, next) => {
  console.log(req.body);
  const {
    body: {
      firstName, lastName, username, password,
    },
  } = req;
  if (!firstName || !lastName) {
    next(Error(`Missing ${!firstName ? 'first' : 'last'} name`));
  }

  const passwordHash = bcrypt.hashSync(password, 5);

  await dataService.createUser({
    name: {
      first: firstName,
      last: lastName,
      full: `${firstName} ${lastName}`,
    },
    passwordHash,
    username,
  }).then((userDetails) => {
    const { username } = userDetails;
    const authToken = jwt.createToken({ username });
    res
      .cookie('session', authToken)
      .status(200)
      .json(userDetails);
  }).catch((err) => {
    next(Error(`Unable to register user at this time: ${err.toString()}`));
  });
};

module.exports = { createUser, currentUser };
