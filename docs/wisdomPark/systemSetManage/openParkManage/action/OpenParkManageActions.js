var Reflux = require('reflux');

var OpenParkManageActions = Reflux.createActions([
  'retrievePark',
  'retrievePark2',
  'deletePark',
  'updatePark',
  'addPark',
  'retrieveParkById',
  'getAddress',
  'getRandomData'
]);

module.exports = OpenParkManageActions;