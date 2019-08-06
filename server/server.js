var path = require('path');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var logger = require('./routes/logger');
var mailer = require('./routes/mailer');
var outcomes = require('./routes/outcomes');
var helper = require('./common/helper');
var LogType = require('./common/logtype');

var router = express.Router();
var app = express();
var port = process.env.PORT || 3011;
global.appRoot = path.resolve(__dirname);

// route middleware that will happen on every request
router.use(function(req, res, next) {
  console.log(`${req.method}, ${req.url} @${Date.now().toLocaleString()}`);
  helper.log(
    LogType.Event,
    `\t "Event": "${req.method}", 
  \t "Route": "${req.url}"`
  );
  next();
});

router.get('/', function(req, res) {
  res.send('im the home page!');
});

// about page route (http://localhost:8080/about)
router.get('/about', function(req, res) {
  res.send('im the about page!');
});

router.use('/logger', logger);
router.use('/mailer', mailer);
router.use('/outcomes', outcomes);

app.use(cors());
app.use('/api/', bodyParser.json()); // support json encoded bodies
app.use('/api/', bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use('/api', router);

app.use(function(err, req, res, next) {
  helper.log(LogType.Error, err.stack);
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, function() {
  console.log(`Express Started on Port ${port}`);
});
