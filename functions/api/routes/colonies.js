const { Router } = require('express');
const colonyController = require('../controllers/colonies');
const authentication = require('../middleware/auth');

const router = Router();

router.post('/', authentication, colonyController.createColony);

router.get('/', authentication, colonyController.getAnimals);

router.get('/paginated', authentication, colonyController.getNextOrPrev);

module.exports = router;
