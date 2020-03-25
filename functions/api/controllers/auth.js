const { pick } = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('../services/jwt');
const dataService = require('../services/database');

const login = async (req, res) => {
  const { body: { username, password } } = req;
  /* Verify that a user exists in the database with the given username
   * and password combination
   *
   * i.e. userService.getUser(username) to retrieve a possible user for the username,
   * verify it exists, then compare the password on file
   */
  return dataService.getUser(username)
    .then((user) => {
      /* Only return the details we need, otherwise we start leaking data like
       * hashed passwords (or in our case unhashed passwords!!)
       */
      const userDetails = pick(user, ['name', 'username']);
      const pass = pick(user, 'passwordHash');

      if (!bcrypt.compareSync(password, pass.passwordHash)) {
        throw new Error('Invalid Password');
      }

      const { username } = userDetails;
      const authToken = jwt.createToken({ username });

      res.cookie('session', authToken).status(200).json(userDetails);
    })
    .catch(() => res.sendStatus(401));
};

module.exports = {
  login,
};
