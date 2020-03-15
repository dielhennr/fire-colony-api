/* Will need to parse incoming payload and store in database */
const createColony = async (req, res, next) => {
//  console.log(req.body);
  res.status(200).json(req.body);
}

module.exports = { createColony };
