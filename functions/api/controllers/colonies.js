const dataService = require('../services/database');

/* Will need to parse incoming payload and store in database */
const createColony = async (req, res, next) => {
  const { user, body } = req;
  const username = user.username;
  const colonyName = body.name;
  const data = body.payload;
  const mockColonyMeta = { name: colonyName, size: 0, animals: [] };

  const colonyId = await dataService.addColony(username, mockColonyMeta);
  console.log(colonyId);

  var lines = data.split("\n");

  var headers = lines[0].split(",");

  for (var i = 1; i < lines.length; i++) {
    var animal = await createAnimal(headers, lines[i]);
    await dataService.addAnimal(colonyId, animal);
  }

  res.status(200).json(req.body);
}

const createAnimal = async (headers, line) => {
  var animal = {};
  var lineSplit = line.split(",");

  for (var i = 0; i < headers.length; i++) {
    animal[headers[i]] = lineSplit[i];
  }

  console.log(animal)
  return animal;
}

module.exports = { createColony };
