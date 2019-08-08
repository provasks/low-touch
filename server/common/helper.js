var fs = require('fs');
var settings = require('../settings');
var LogType = require('./logtype');

const logFile = {
  feedback: fs.createWriteStream(
    settings.PROJECT_DIR + settings.logFile.feedback,
    {
      flags: 'w'
    }
  ),
  error: fs.createWriteStream(settings.PROJECT_DIR + settings.logFile.error, {
    flags: 'w'
  }),
  event: fs.createWriteStream(settings.PROJECT_DIR + settings.logFile.event, {
    flags: 'w'
  }),
  info: fs.createWriteStream(settings.PROJECT_DIR + settings.logFile.info, {
    flags: 'w'
  })
};

class Helper {
  log(type, msg) {
    const time = new Date().toLocaleString();
    console.log(`Feedback At ${time} => ${msg}\n`);
    switch (type) {
      case LogType.Feedback:
        logFile.feedback.write(`At ${time} => ${msg}\n`);
        break;
      case LogType.Error:
        logFile.error.write(`At ${time} => ${msg}\n`);
        break;
      case LogType.Event:
        logFile.event.write(`{
            \t "At" => "${time}", 
            ${msg}
          },\n`);
        break;
      default:
        logFile.info.write(`At ${time} => ${msg}\n`);
    }
  }
}

module.exports = new Helper();
