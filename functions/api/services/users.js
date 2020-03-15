const functions = require('firebase-functions');
const admin = require('firebase-admin');

var serviceAccount = require("../../animal-colony-76d9b-firebase-adminsdk-egbh6-ac4894dd6b.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://animal-colony-61928.firebaseio.com"
});


let db = admin.firestore();

/**
 * Sends a user's registration information to the mock database and returns
 * the desired registration information upon successful insertion
 * @param registrationInformation
 * @returns {Promise<Object>}
 */
const createUser = async (registrationInformation) => {
  const { username } = registrationInformation;
  db.collection('users').doc(username).set(registrationInformation);
  return registrationInformation;
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


module.exports = { createUser, getUser };
