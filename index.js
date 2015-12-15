var Board = require('./lib/board');
var storage = require('./lib/storage');


function executeInitCommand(callback) {
  storage.saveInitialData(callback);
}

module.exports = {
  executeInitCommand: executeInitCommand
};
