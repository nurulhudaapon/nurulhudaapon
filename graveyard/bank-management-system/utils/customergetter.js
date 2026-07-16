const { Customer } = require('../models/customer');
const { Account, validate } = require('../models/account');
const { Deposit } = require('../models/deposit');

exports.get = async (id) => {
    const customer = await Customer.find({id}).populate('accounts');
    const deposit = await Deposit.find({acn: customer[0].accounts[0].acn});
    return {customer, deposit}
}