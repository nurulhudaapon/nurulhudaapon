const express = require('express');
const router = express.Router();
const { Deposit, validate } = require('../models/deposit');
const { Account } = require('../models/account');
const { Customer } = require('../models/customer');
const multer = require('multer')
const upload = multer({ dest: 'public/uploads/' })
const { sendMail } = require('../utils/mailer');
const { sendFBMessage } = require('../utils/messangerBot');


router.use(express.json());

// Creating deposit
router.post('/', upload.none(), async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(406).send(error.details[0].message);

    let depositInfo = req.body;
    depositInfo.name = depositInfo.account.split(' - ')[0];
    depositInfo.acn = depositInfo.account.split(' - ')[1];
    // depositInfo.dBy = depositInfo.depositor;
    const deposit = new Deposit(depositInfo);

    let account = await Account.findOne({ acn: deposit.acn, matured: false, withdrawn: false });

    if (!account) return res.status(406).send(`No account found or the account has been matured.`);

    if (deposit.amount < account.min) return res.status(406).send(`Deposit amount (${deposit.amount}) is less then account minimum (${account.min})`);
    function maturityTest(params) {
        if ((account.current + deposit.amount) >= account.total) return true;
        return false;
    }

    account = await Account.findOneAndUpdate({ acn: deposit.acn }, {
        $set: {
            lastUpdated: Date.now(),
            matured: maturityTest()
        },
        $push: {
            deposits: deposit._id
        },
        $inc: {
            current: deposit.amount
        }

    }, { new: true });


    const result = await deposit.save();


    res.json({ message: 'SUCCESS! Amount Added: ' + result.amount + ' TK. Current balance: ' + account.current + ' TK' });

    let customer = await Customer.findOne({ id: account.id });

    if (customer.email) {
        let html = `Hi ${deposit.name}, <strong>${deposit.amount} Taka</strong>  has been deposited to your account <strong>(ACN: ${deposit.acn})</strong> by <strong>${deposit.dBy}</strong> to <strong>${deposit.dTo}</strong> on <strong>${deposit.date.toDateString()}</strong>.
        Your current account balance is ${account.current} Taka.`
        let sub = 'New Deposit!'

        let info = await sendMail(customer.email, sub, html);
    }

    if (customer.facebook) {
        console.log('FB message sent!');
        if (customer.facebook.psid) {
            sendFBMessage(customer.facebook.psid,
                `Hi ${deposit.name}, ${deposit.amount} Taka has been deposited to your account (ACN: ${deposit.acn}) by ${deposit.dBy} to ${deposit.dTo} on ${deposit.date.toDateString()}.
                Current balance: ${account.current} Taka.`
            );
        }
    }


    if (customer.email && account.matured) {
        console.log("matured");

        let html = `Hi ${deposit.name}, your account <strong>(ACN: ${deposit.acn}) has been matured on <strong>${deposit.date.toDateString()}</strong>.`
        let sub = 'Account Matured!'

        let info = await sendMail(customer.email, sub, html);
    }

});

// Getting deposit
router.get('/', async (req, res) => {
    const result = await Deposit.find().sort({ date: -1 });
    res.json(result);
});
router.get('/chart', async (req, res) => {
    const result = await Deposit.aggregate(
        [
        {
            $project: {
                day: {$dayOfMonth: "$day"},
                month: { $month: "$date" },
                year: {$year: "$date"},
                amount: 1
            }
        },
        {
            $group: {
                _id: {
                    day: "$day",
                    month: "$month",
                    year: "$year"
                },
                total : {$sum : "$amount"} 
            }
        }]
    );
    res.json(result);
});

// Deleting user
router.delete('/:acn', async (req, res) => {
    const result = await Deposit.deleteOne({ acn: req.params.acn });
    res.json(result);
});

// Updating user
router.put('/:acn', upload.none(), async (req, res) => {
    let newInfo = req.body;
    const result = await Deposit.updateOne({ acn: req.params.acn }, {
        $set: {
            name: newInfo.name,
            phone: newInfo.phone,
            address: newInfo.address,
            acn: newInfo.acn,
            acc_date: newInfo.acc_date
        }
    });
    res.json(result);
});
// Updating user
// router.use(express.urlencoded());
router.get('/test', upload.none(), async (req, res) => {
    let newInfo = req.query;
    console.log(newInfo);

    res.json(newInfo);
});

module.exports = router;

