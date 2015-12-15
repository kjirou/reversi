var fs = require('fs');
var path = require('path');


function getDataFilePath() {
  return path.join(process.cwd(), 'reversi-data.json');
}

function saveData(newJsonData, callback) {
  var newFileData = JSON.stringify(newJsonData);
  fs.writeFile(getDataFilePath(), newFileData, callback);
}

function saveInitialData(callback) {
  var initialData = {
    squareMapText: [
      '--------',
      '--------',
      '--------',
      '---ox---',
      '---xo---',
      '--------',
      '--------',
      '--------'
    ].join('\n'),
    turnCount: 0
  };
  saveData(initialData, callback);
}

function loadData(callback) {
  fs.readFile(getDataFilePath(), function(err, fileData) {
    if (err) {
      callback(err);
      return;
    }
    var jsonData = JSON.parse(fileData.toString());
    callback(null, jsonData);
  });
}

module.exports = {
  loadData: loadData,
  saveData: saveData,
  saveInitialData: saveInitialData
};
