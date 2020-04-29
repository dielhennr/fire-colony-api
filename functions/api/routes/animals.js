const { Router } = require('express');
const animalController = require('../controllers/animals');
const authentication = require('../middleware/auth');

const router = Router();

router.post('/', authentication, animalController.getAnimals);

router.post('/delete', authentication, animalController.deleteAnimal);

router.post('/edit', authentication, animalController.editAnimal);

router.post('/storeImageLink', authentication, animalController.storeImageLink);

module.exports = router;

