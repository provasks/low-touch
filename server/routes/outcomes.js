var express = require('express');
var dbHandler = require('./../dal/db-handler');
var helper = require('./../common/helper');
var router = express.Router();
var Type = require('./../common/logtype');

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
  let message = '';
  var data = req.body.data;
  if (data.type === 'aggr') {
    dbHandler.updateReview(data);
    message = `Received GOOD feedback for the Aggregate: ${data.aggr}, Host: ${
      data.hostname
    }, Cluster: ${data.uuid}, Serial: ${data.serial}`;
  } else {
    message = `Received GOOD feedback for the ${data.type} of Cluster: ${
      data.uuid
    }, Serial: ${data.serial}`;
  }
  helper.log(Type.Feedback, message);
  res.send(data);
});

module.exports = router;
