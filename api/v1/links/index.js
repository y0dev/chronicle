/* eslint-disable no-underscore-dangle */
const Links = require('../../../models/Links');
const DigitalHistory = require('../../../models/DigitalHistory');
const { parseHtmlLink } = require('../../../helpers/linkHelpers');

module.exports = (app) => {
  app.post('/api/v1/add-link', async (req, res) => {
    const { historyId, historyName } = req.body;
    const theLink = req.body.link;

    if (theLink) {
      const linkInfo = await parseHtmlLink(theLink);
      Links.create({
        url: theLink,
        title: linkInfo.title,
        keywords: [linkInfo.keywords],
        image: linkInfo.image,
        alt: linkInfo.alt,
      }, (error, link) => {
        if (error) throw error;
        if (historyName) {
          DigitalHistory.create({
            name: historyName,
            linkIds: [link._id],
          }, (err, history) => {
            if (err) throw err;
          });
        } else if (historyId) {
          DigitalHistory.findOneAndUpdate({ _id: historyId },
            { $push: { linkIds: link._id } },
            (err, history) => {
              if (err) throw err;
            });
        }
        res.send(link);
      });
    }
    // make sure it conforms to format
    // add it to database
    // update the digital history
  });

  // eslint-disable-next-line no-unused-vars
  app.get('/api/v1/get-digital-history', (req, res) => {
    // return digital history
    const { historyId } = req.body;

    if (historyId) {
      DigitalHistory.findOne({ _id: historyId }, (error, history) => {
        if (error) throw error;
        res.send(history);
      });
    }
  });
};
