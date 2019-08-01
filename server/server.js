var path = require('path');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var logger = require('./routes/logger');
var mailer = require('./routes/mailer');
var outcomes = require('./routes/outcomes');

var router = express.Router();
var app = express();
var port = process.env.PORT || 3011;
global.appRoot = path.resolve(__dirname);

// route middleware that will happen on every request
router.use(function(req, res, next) {
  // log each request to the console
  console.log(`${req.method}, ${req.url} @${Date.now().toLocaleString()}`);
  // continue doing what we were doing and go to the route
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
// apply the routes to our application
app.use(cors());

app.use('/api/', bodyParser.json()); // support json encoded bodies
app.use('/api/', bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use('/api', router);

app.listen(port, function() {
  console.log(`Express Started on Port ${port}`);
});
