var Reflux = require('reflux');

var DoorLogsActions = Reflux.createActions([
  'getAddress',
  'getBuildingByPark',
  'getFloorByBuilding',
  'getCellByFloor',
  'getDoorByCell',
]);

module.exports = DoorLogsActions;