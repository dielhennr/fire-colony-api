const dataService = require('../services/database');
// const tagging = require('./tags');

/**
 * Get animals of a colony starting at a certain page with a certain page size
 *
 * @param req
 * @param res
 */
const getAnimals = async (req, res) => {
  const { body: { colonyId, rowsPerPage, page } } = req;

  await dataService.getAnimals(colonyId, rowsPerPage, page)
    .then((animals) => {
      console.log(JSON.stringify(animals));
      res.status(200).json(animals);
    })
    .catch(() => res.sendStatus(404));
};

const deleteAnimal = async (req, res) => {
  const { body: { colonyId, animalId } } = req;
  await dataService.deleteAnimal(colonyId, animalId)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch(() => res.sendStatus(404));
}

const editAnimal = async (req, res) => {
  const { body: { animal, colonyId } } = req;
  await dataService.editAnimal(colonyId, animal)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch(() => res.sendStatus(404));
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
  const animal = {};
  const lineSplit = line.split(',');
//Might have to update headers length if we're going to be 
//using csv files that already include tags...
//or are tags going to be an interface feature only
//idk if we're trying to go csv free...
  for (let i = 0; i < headers.length; i++) {
    animal[headers[i].trim()] = lineSplit[i];
  }

  animal.imageLinks = [];
  animal.notes = [];
  animal.tags = [];
  //add tags?

  return animal;
};

const storeImageLink = async (req, res) => {
  const { body: { colonyId, animalId, url } } = req;
  await dataService.storeImageLink(colonyId, animalId, url)
    .then((link) => {
      res.status(200).json(link);
    })
    .catch(() => res.sendStatus(500));
}

const storeNote = async (req, res) => {
  const { body: { colonyId, animalId, note } } = req;
  await dataService.storeNote(colonyId, animalId, note)
    .then((note) => {
      res.status(200).json(note);
    })
    .catch(() => res.sendStatus(500));
}

const storeTags = async (req, res) => {
  const { body: { colonyId, animalId, tag } } = req;
  await dataService.storeTag(colonyId, animalId, tag)
    .then((tag) => {
      res.status(200).json(tag);
    })
    .catch(() => res.sendStatus(500));
}

// function storeTags(){
//   const tags = tagging.makeHashTable();
//   // tags.add('mouse 1', ['tag1', 'tag2']);
//   // console.log(tags.retreive('mouse 1'));
// }
// storeTags();

module.exports = { getAnimals, deleteAnimal, editAnimal, storeImageLink, createAnimal, storeNote, storeTags };
