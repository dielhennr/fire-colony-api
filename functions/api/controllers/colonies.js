const dataService = require('../services/database');

/* Will need to parse incoming payload and store in database */
const createColony = async (req, res, next) => {
  const { user, body } = req;
  const username = user.username;
  console.log(body);
  const mockColonyMeta = { name: "test", size: 0, animals: [] };

  const colonyId = dataService.addColony(username, mockColonyMeta);
  console.log(colonyId);

  res.status(200).json(req.body);
}

module.exports = { createColony };
