const { toSafeInteger } = require('lodash');
const dataService = require('../services/database');

//next?
const createTag = async (req, res) => {
  const { body: { tagName, mouse } } = req;
  console.log(`in controller, tagname=${tagName}`);

  // const tagMeta = {name:tagName, list:mouse}
  await dataService.createNewTag(tagName, mouse);
  
  res.status(200).json({name:tagName, list: mouse});
  // await dataService.createNewTag(tagName, mouseList)
  //   .then((tagDetails) => {
  //     res.status(200).json(tagDetails);
  //   }).catch(() => res.sendStatus(404));
}

// const getAnimals = async (req, res) => {
//   const { body: { colonyId, rowsPerPage, page } } = req;

//   await dataService.getAnimals(colonyId, rowsPerPage, page)
//     .then((animals) => {
//       res.status(200).json(animals);
//     })
//     .catch(() => res.sendStatus(404));
// };


const getOneTag = async (req, res) => {
  const { body : { tagName } } = req;

  await dataService.getTag(tagName)
    .then((tagResult) => {
      res.status(200).json(animals);
    })
    .catch(() => res.sendStatus(404));
}



// const getAllTags = async (req, res) => {
//   await dataService.getTags()
//     .then((tags) => {
//       res.status(200).json(tags);
//     })
//     .catch(() => res.sendStatus(404));
// }

module.exports = { createTag, getOneTag };






















//source: https://codeburst.io/objects-and-hash-tables-in-javascript-a472ad1940d9
//some edits by me

// class HashTable{
//   constructor(limit=8){
//     this._limit = limit;
//     this._storage = [];
//     this._count = 0;
//   }
// }
// //this._storage = [/*container*/[/*bucket*/], [[/*tuple*/], []]]
// const makeHashTable = function(){
//   return new HashTable();
// }

// const hashCode = function(max){
//   var hash = 0;
//   if (!this.length) return hash;
//   for (i = 0; i < this.length; i++) {
//     char = this.charCodeAt(i);
//     hash = ((hash<<5)-hash)+char;
//     hash = hash & hash; // Convert to 32bit integer
//   }
//   return Math.abs(max?hash%max:hash);
// };

// const add = function(key, value) {
//   if(typeof value === 'string'){
//     var value = [value];
//   }
//   var index = key.hashCode();
//   var tuple = [key, value];
//   var bucket = this._storage[index];
//   if (bucket) { 
//     for (var i = 0; i < bucket.length; i++) {  
//       if (bucket[i][0] === key) {
//         merge(key, bucket[i][1], value);
// //         console.log(bucket[i][1]);
// //         bucket[i][1] = value;
//         console.log(bucket[i][1]);

//       } else {

//         bucket.push(tuple);
//       }
//     } 
//   } else {
//     console.log('tuple: ' + tuple);

//     this._storage[index] = [tuple];
//   } 
// };

// function merge(key, oldValues, newValues){
//   newValues.forEach(function(item){
//   if(!oldValues.includes(item)){
//      oldValues.push(item);
//   }
// });
//   console.log('merged:'+oldValues);
// }

// const retrieve = function(key) {
//   var index = key.hashCode();
//   var bucket = this._storage[index];
//   for (var i = 0; i < bucket.length; i++) {
//     if (bucket[i][0] === key) {
//       return bucket[i][1];
//     }   
//   }
// };

// const hashTable = new HashTable();

// module.exports = {makeHashTable, add, retrieve};

// hashTable.add('mouse1', ['tagB', 'tagD']);
// hashTable.add('mouse2', ['tagA', 'tagB', 'tagC']);
// hashTable.add('mouse3', ['tagB', 'tagD']);
// hashTable.add('mouse4', ['tagD', 'tagF']);
// hashTable.add('mouse1', 'tagA');
// // hashTable.add('mouse6', 'tagX');
// // hashTable.add('mouse7', 'seven');
// // hashTable.add('mouse8', 'eight');
// // hashTable.add('mouse9', 'nine');
// // hashTable.add('mouse10', 'ten');
// // hashTable.add('mouse11', 'eleven');

// console.log('mouse1: ' + hashTable.retrieve('mouse1'));
// console.log('mouse2: ' + hashTable.retrieve('mouse2'));
// console.log('mouse3: ' + hashTable.retrieve('mouse3'));
// console.log('mouse4: ' + hashTable.retrieve('mouse4'));
// // console.log('mouse6: ' + hashTable.retrieve('mouse6'));
// // // console.log(hashTable.retrieve('mouse6'));
// // console.log(hashTable.retrieve('mouse7'));
// // console.log(hashTable.retrieve('mouse8'));
// // console.log(hashTable.retrieve('mouse9'));
// // console.log(hashTable.retrieve('mouse10'));
// // console.log(hashTable.retrieve('mouse11'));

// module.exports = {HashTable, add, retrieve};
//, Hashtable.prototype.add, Hashtable.prototype.retrieve};