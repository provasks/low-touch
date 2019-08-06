var fs = require('fs');
var settings = require('../settings');
// import LogType from './logtype';
var LogType = require('./logtype');

var feedback_log_file = fs.createWriteStream(
  settings.PROJECT_DIR + '/feedback/feedback.log',
  {
    flags: 'w'
  }
);
var events_log_file = fs.createWriteStream(
  settings.PROJECT_DIR + '/feedback/events.log',
  {
    flags: 'w'
  }
);
var error_log_file = fs.createWriteStream(
  settings.PROJECT_DIR + '/feedback/error.log',
  {
    flags: 'w'
  }
);
class Helper {
  log(type, msg) {
    const time = new Date().toLocaleString();
    switch (type) {
      case LogType.Feedback:
        console.log(`Feedback At ${time} => ${msg}\n`);
        feedback_log_file.write(`At ${time}: ${msg}\n`);
        break;
      case LogType.Error:
        console.log(`Error At ${time} => ${msg}\n`);
        error_log_file.write(`At ${time}: ${msg}\n`);
        break;
      case LogType.Event:
        console.log(`Event At ${time} => ${msg}\n`);
        events_log_file.write(`{
          \t "At": "${time}", 
          ${msg}
        },\n`);
        break;
      default:
        console.log(`Default At ${time} => ${msg}\n`);
    }
  }
}
// logFeedback(msg) {
//   feedback_log_file.write(msg + '\n');
// }
// logError(msg) {
//   error_log_file.write(
//     `{
//     \t "At": "${time}",
//     ${msg}
//   },\n`
//   );
// }
// logEvent(method, url) {
//   events_log_file.write(
//     `{
//       \t "At": "${new Date().toLocaleString()}",
//       \t "Event": "${method}",
//       \t "Route": "${url}"
//     },\n`
//   );
// }

module.exports = new Helper();
