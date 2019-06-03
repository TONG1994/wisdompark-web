var Reflux = require('reflux');

var ControllorInfoActions = Reflux.createActions([
  'getDoorStatus',
  'saveController',
  'updateController',
  'retrieve',
  'retrieveDoor',
  'assignDoor'
]);

module.exports = ControllorInfoActions;