// All routes src
const home = require('../routes/home');
const customer = require('../routes/customer');
const account = require('../routes/account');
const deposit = require('../routes/deposit');
const statistics = require('../routes/statistics');
const withdraw = require('../routes/withdraw');

module.exports = function (app) {
    // Assigning routes
    app.use('/', home);
    app.use('/customer', customer);
    app.use('/account', account);
    app.use('/deposit', deposit);
    app.use('/statistics', statistics);
    app.use('/withdraw', withdraw);
}