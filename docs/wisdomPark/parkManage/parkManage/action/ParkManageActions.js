var Reflux = require('reflux');

var ParkManageActions = Reflux.createActions([
    'retrieveSettledCompany',
    'saveSettledCompany',
    'getParkByUuid',
    'updatePark',
    'getAddress',
    'deleteSettledCompany',
    'getSettledCompanyDoor',
    'saveSettledCompanyDoor'
]);

module.exports = ParkManageActions;