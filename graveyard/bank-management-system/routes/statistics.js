const express = require('express');
const router = express.Router();
const admin = require('../middleware/admin');

const _ = require('lodash');
router.use(express.json());

const { Account } = require('../models/account');
const { Customer } = require('../models/customer');
const { Deposit } = require('../models/deposit');

router.get('/', admin, async (req, res) => {
    let count = {};
    // let total = {};
    let accounts = await Account.find();
    let maturedAccountCount = await Account.find({matured: true, withdrawn: false}).count();
    let withdrawnAccountCount = await Account.find({withdrawn: true}).count();
    let customers = await Customer.find();
    let deposits = await Deposit.find().select('name acn date amount -_id').sort({date: -1});

    let sumAccount = await Account
        .aggregate([
            { $match: { $and: [{ withdrawn: false }] } },
            { $group: { _id: null, sumAccount: { $sum: "$current" } } }

        ]);
    count.maturedAccountCount = maturedAccountCount
    count.withdrawnAccountCount = withdrawnAccountCount
    count.customer = customers.length;
    count.accountCount = accounts.length;
    count.runningAccountCount = await Account.find({matured: false, withdrawn: false}).count();
    count.depositCount = deposits.length;
    
    let total = function () {
        if (sumAccount[0]) return sumAccount[0].sumAccount;
        return 0;
    }
    // console.log(total());
    
    
    count.total = total();
    count.deposits = deposits;

    res.json(count);
});



module.exports = router;

