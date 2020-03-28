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
 * Get first set of animals for requested colony
 *
 * @param req
 * @param res
 * @param next
 */
const getAnimals = async (req, res) => {
  const { body: colonyId, pageSize } = req;

  const animals = await dataService.getFirstAnimals(colonyId, pageSize);

  res.status(200).json(animals);
};

/**
 * Get next/prev batch of animals based on colonyId, pageSize, cursor, and next boolean from frontend 
 * next true if you want next batch/false if you want previous batch
 */
const getNextOrPrev = async (req, res) => {
  const { body: colonyId, pageSize, cursor, next } = req;

  var animals;  
  if (next) {
    animals = await dataService.getNextAnimals(colonyId, pageSize, cursor);
  } else {
    animals = await dataService.getPrevAnimals(colonyId, pageSize, cursor);
  }
  res.status(200).json(animals);
};

module.exports = { createColony, getAnimals, getNextOrPrev };
