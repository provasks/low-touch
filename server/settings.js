module.exports = {
  PROJECT_DIR: __dirname,
  DATA_FILE: __dirname + '/data/rec_master.json',
  ROOT_NODE: 'clusters',
  logFile: {
    feedback: '/feedback/feedbacks.log',
    event: '/feedback/events.log',
    error: '/feedback/errors.log',
    info: '/feedback/info.log'
  }
};
