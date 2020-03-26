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
  const { user : { username }, body : { payload, name } } = req;

  /* Create initial colony meta data and add to db*/
  const colonyMeta = { colonyName: name, size: 0, animals: [] };
  const colonyId = await dataService.addColony(username, colonyMeta);

  /* Parse the csv payload */
  var lines = payload.split("\n");
  var headers = lines[0].split(",");

  for (var i = 1; i < lines.length; i++) {
    /* Add each animal to the db under the generated colonyId if non-whitespace string*/
    if (/\S/.test(lines[i])) {
      createAnimal(headers, lines[i])
        .then((animal) => {
          dataService.addAnimal(colonyId, animal);
        })
        .catch( (err) => {
          next(Error(`Could not create animal: ${err.toString()}`));
        });
    }
  }

  console.log(colonyId);

  res.status(200).json(req.body);
}

/**
 * Parses a single line of csv data into an animal json object
 *
 * @param headers - headers to use as identifiers for the object
 * @param line    - line to parse into json object 
 *
 * @return animal - json representation of the animal
 */
const createAnimal = async (headers, line) => {
  var animal = {};
  var lineSplit = line.split(",");

  for (var i = 0; i < headers.length; i++) {
    animal[headers[i]] = lineSplit[i];
  }

  console.log(animal)
  return animal;
}

/**
 * Get colony meta data for requested partition
 *
 * @param req
 * @param res
 * @param next
 */
const getColonies = async (req, res, next) => {
  /** 
   * Send the page number and number of colonies being displayed per page in req
   * Authentication middleware will be used here to get the username, once I have
   * This I will grab the users owned colonies and then partition that based on the 
   * body of req. Then I will query for the meta data of each uuid in the partition 
   * and send result to client.
   *
   * req -
   *
   * {
   *    body: {
   *      pageNumber: x,
   *      displayFactor: y
   *    }
   * }
   *
   */
  console.log("getColony");
}

/**
 * Get animals for requested colony and partition
 *
 * @param req
 * @param res
 * @param next
 */
const getAnimals = async (req, res, next) => {
  /**
   * Send page number and number of animals to display in req 
   *
   * Same idea here but also need colony uuid in body so that I can query the database
   *
   * {
   *    body: {
   *      colonyId: 'qwASDFiofSAFDqwecwe',
   *      pageNumber: x,
   *      displayFactor: y
   *    }
   * }
   */
  console.log("getAnimals");
}

module.exports = { createColony, getColonies, getAnimals };
