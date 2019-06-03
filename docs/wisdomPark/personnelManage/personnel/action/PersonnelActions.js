var Reflux = require('reflux');

var PersonnelActions = Reflux.createActions([
  'retrieveAddress',
  'addUser',
  'deleteUser',
  'edit',
  'lock',
  'unLock',
  'getSettledPersonnelSelectedDoor',
  'upload',
  'retrieveCompany'
]);

module.exports = PersonnelActions;