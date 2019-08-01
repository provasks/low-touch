var express = require('express');
var router = express.Router();
var helper = require('./../common/helper');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now().toLocaleString());
  next();
});
// define the home page route
router.get('/', function(req, res) {
  res.send('Logger home page');
});
// define the log route
router.post('/log', function(req, res) {
  helper.logMessage(req.body.msg);
  res.send({ msg: 'success' });
});

module.exports = router;
