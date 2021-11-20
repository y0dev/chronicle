/* eslint-disable no-underscore-dangle */
const { getHistory } = require('../controllers/history');
const { addLink, getLinkInfoByKeyword, getLinkInfoById } = require('../controllers/links');

module.exports = (app) => {
  app.post('/api/v1/add-link', (req, res, next) => {
    addLink(req,res,next);
  });

  app.get('/api/v1/get-link-info', (req, res, next) => {
    getLinkInfoByKeyword(req,res,next);
  });

  app.get('/api/v1/get-link-info/:id', (req, res, next) => {
    getLinkInfoById(req,res,next);
  });

  // eslint-disable-next-line no-unused-vars
  app.get('/api/v1/get-digital-history', (req, res, next) => {
    // return digital history
    getHistory(req,res,next);
  });
};
