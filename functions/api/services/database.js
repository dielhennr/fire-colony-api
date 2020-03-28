const admin = require('firebase-admin');

const serviceAccount = require('../../animal-colony-76d9b-firebase-adminsdk-egbh6-ac4894dd6b.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://animal-colony-61928.firebaseio.com',
});

const db = admin.firestore();

/**
 * Sends a user's registration information to the mock database and returns
 * the desired registration information upon successful insertion
 * @param registrationInformation
 * @returns {Promise<Object>}
 */
const createUser = async (registrationInformation) => {
  const { username } = registrationInformation;
  registrationInformation.ownedColonies = [];
  return await db.collection('users').doc(username).set(registrationInformation);
};

/**
 * Retrieves user details from the mock database based on a given username
 * @param username
 * @returns {Promise<Object>}
 */
const getUser = async (username) => {
  const user = await db.collection('users').doc(username).get();
  return user.data();
};


/**
 * Adds a colony uuid to a users ownedColonies
 *
 * @param username - user's username
 * @param colonyId - uuid of colony to add to profile
 */
const addColonyToUser = async (username, colonyId) => {
  const user = db.collection('users').doc(username);
  user.update({
    ownedColonies: admin.firestore.FieldValue.arrayUnion(colonyId),
  });
};

/**
 * Adds initial colony meta data to the database with a generated
 * uuid for the colony. This uuid is added to the user's profile.
 *
 * @param username - username of person creating this colony
 * @param colonyInfo - Initial colony meta data
 *
 * @return colony.id - uuid of new colony
 */
const addColony = async (username, colonyInfo) => {
  const colony = db.collection('colonies').doc();
  addColonyToUser(username, colony.id);
  colonyInfo.colonyId = colony.id;
  await colony.set(colonyInfo);
  return colony.id;
};

/**
 * Adds an animal to a colony's animal list.
 *
 * @param colonyId - uuid of colony where animal should be placed
 * @param animalInfo - json object of the animal
 *
 */
const addAnimal = async (colonyId, animalInfo) => {
  const colony = db.collection('colonies').doc(colonyId);
  await colony.update({
    size: admin.firestore.FieldValue.increment(1),
  });
  const animal = colony.collection('animals').doc();
  await animal.set(animalInfo);
  return animal.id;
};

const getColonies = async (list) => {
  const coloniesRef = db.collection('colonies');
  const colonies = [];

  for (let i = 0; i < list.length; i++) {
    const colony = await coloniesRef.doc(list[i]).get();
    colonies.push(colony.data());
  }

  return colonies;
};

const getAnimals = async (colonyId, pageSize, pageNum) => {
  const animalsRef = db.collection('colonies').doc(colonyId).collection('animals').limit(pageSize).offset(pageSize * (pageNum - 1));
  const snapshot = await animalsRef.get();
  const results = snapshot.docs.map(doc => doc.data());
  return results;
};

module.exports = {
  createUser, getUser, addColony, addAnimal, addColonyToUser, getColonies, getAnimals
};
