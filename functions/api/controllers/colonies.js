const dataService = require('../services/database');

/**
 * Parses the incoming csv string of colony data, creates a new colony in
 * the database, and adds data from the string to the colony.
 *
 * @param req
 * @param res
 * @param next
 */
const createColony = async (req, res, next) => {
  const { user: { username }, body: { payload, name } } = req;

  /* Create initial colony meta data and add to db */
  const colonyMeta = { colonyName: name, size: 0 };
  const colonyId = await dataService.addColony(username, colonyMeta);

  /* Parse the csv payload */
  const lines = payload.split('\n');
  const headers = lines[0].split(',');

  let animalCount = 0;
  const animalPromises = [];

  for (let i = 1; i < lines.length; i++) {
    if (/\S/.test(lines[i])) {
      const animal = createAnimal(headers, lines[i]).then((animal) => dataService.addAnimal(colonyId, animal))
        .catch((err) => {
          next(Error(`Could not create animal: ${err.toString()}`));
        });
      animalPromises.push(animal);
      animalCount++;
    }
  }

  await Promise.all(animalPromises);

  colonyMeta.colonyId = colonyId;
  colonyMeta.size = animalCount;

  const animalPart = await dataService.getAnimals(colonyId, 5, 2);
  const animalPrev = await dataService.getAnimals(colonyId, 5, 1);
  const animalNext = await dataService.getAnimals(colonyId, 5, 3);

  console.log('id', colonyId);
  console.log('prev of offset call', animalPrev);
  console.log('offset', animalPart);
  console.log('next of offset call', animalNext);

  res.status(200).json(colonyMeta);
};

/**
 * Parses a single line of csv data into an animal json object
 *
 * @param headers - headers to use as identifiers for the object
 * @param line    - line to parse into json object
 *
 * @return animal - json representation of the animal
 */
const createAnimal = async (headers, line) => {
  const animal = {};
  const lineSplit = line.split(',');

  for (let i = 0; i < headers.length; i++) {
    animal[headers[i]] = lineSplit[i];
  }

  return animal;
};

/**
 * Get animals of a colony starting at a certain page with a certain page size
 *
 * @param req
 * @param res
 */
const getAnimals = async (req, res) => {
  const { body: colonyId, pageSize, pageNum } = req;

  await dataService.getAnimalsFrom(colonyId, pageSize, pageNum)
    .then((animals) => {
      res.status(200).json(animals);
    })
    .catch(() => res.sendStatus(404));
};

module.exports = { createColony, getAnimals };
