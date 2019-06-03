var Reflux = require('reflux');

var OpenDoorRemotelyActions = Reflux.createActions([
  'openDoor',
  'openBatchDoor',
  'retrieve',
  'openDoorLogin',
  'retrievePark'
]);

module.exports = OpenDoorRemotelyActions;
