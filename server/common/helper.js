var fs = require('fs');
var settings = require('../settings');

var log_file = fs.createWriteStream(
  settings.PROJECT_DIR + '/feedback/feedback.log',
  {
    flags: 'w'
  }
);
class Helper {
  logMessage(msg) {
    log_file.write(msg + '\n');
  }
}
module.exports = new Helper();
