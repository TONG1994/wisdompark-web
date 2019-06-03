/**
 *   Create by Malson on 2018/4/25
 */

var Reflux = require('reflux');

var SettledCompanyActions = Reflux.createActions([
  'retrieveSettledCompany',
   'saveSettledCompany',
   'updateSettledCompany',
    'deleteSettledCompany',
    'getSettledCompanyDoor',
    'saveSettledCompanyDoor',
    'deleteSettledCompanyDoor',
    'getSettledCompanySelectedDoor'
]);

module.exports = SettledCompanyActions;