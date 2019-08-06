var express = require('express');
var dbHandler = require('./../dal/db-handler');
var helper = require('./../common/helper');
var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  // console.log('Time: ', new Date().toLocaleString());
  next();
});
// define the home page route
router.get('/', function(req, res) {
  res.send(dbHandler.getDistinctOutcomes());
});
// define the about route
router.get('/:rec', function(req, res) {
  var rec = req.params.rec;
  res.send(dbHandler.getHostsWithMatchingOutcome(rec));
});

router.get('/:uuid/:serial/:hostname', function(req, res) {
  res.send(
    dbHandler.getReportDetails(
      req.params.uuid,
      req.params.serial,
      req.params.hostname
    )
  );
});

router.put('/:data', function(req, res) {
  var data = req.body.data;
  dbHandler.updateReview(data);
  const message = `Received GOOD feedback for ${
    data.type === 'aggr'
      ? `Aggregate: ${data.aggr}, Host: ${data.hostname}, `
      : `${data.type} of `
  }Cluster: ${data.uuid}, Serial: ${data.serial}`;
  helper.logFeedback(message);
  res.send(data);
});

module.exports = router;
