/**
 *   Create by Malson on 2018/4/25
 */

var Reflux = require('reflux');

var RentalCompanyActions = Reflux.createActions([
  'retrieveRentalCompany',
   'saveRentalCompany',
   'updateRentalCompany',
    'deleteRentalCompany',
    'deleteRentalCompanyFile'
]);

module.exports = RentalCompanyActions;