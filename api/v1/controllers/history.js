const { createCustomError } = require('../../../helpers/error');
const asyncWrapper = require('../../../middleware/async');
const DigitalHistory = require('../../../models/DigitalHistory');

const getHistory = asyncWrapper( async (req,res,next) => {
   const { historyId, name } = req.body;

    if (historyId) {
      const history = await DigitalHistory.findOne({ _id: historyId });
      if (!history) {
         return next(createCustomError(`Could not find any history with the following id: ${historyId}`, 404))
      }
      const { title, url, description, dateAdded } = history;
      return res.status(200).json(history);
    } else if (name) {
      const history = await DigitalHistory.find({ 'name' : { $regex: name, $options: 'i' }});
      if (!history) {
         return next(createCustomError(`Could not find any history with the following id: ${historyId}`, 404))
      }
      return res.status(200).json({
         name,
         history,
       });
    }
});


module.exports = {
   getHistory,
}