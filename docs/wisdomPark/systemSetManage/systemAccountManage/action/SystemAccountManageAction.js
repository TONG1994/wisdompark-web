
var Reflux = require('reflux');

var SettledCompanyActions = Reflux.createActions([
  'retrieveSystemAccount',
  'saveSystemAccount',
  'updateSystemAccount',
  'checkPhone',
  'getAllPark',
  'deleteAccount',
]);

module.exports = SettledCompanyActions;