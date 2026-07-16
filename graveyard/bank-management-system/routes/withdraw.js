const express = require('express');
const router = express.Router();
const multer  = require('multer')
const upload = multer({ dest: 'public/uploads/' })


const { Withdraw , validate } = require('../models/withdraw');
const { Account } = require('../models/account');

// Creating withdraw
router.post('/', upload.none(), async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(406).send(error.details[0].message);
    const account = await Account.findOneAndUpdate({acn: req.body.acn, matured: true, withdrawn: false}, {
        $set: {
            withdrawn: true
        }
    }, {new: true});
    if (!account) return res.status(400).send('Account is not found or not matured or already withdrawn.')

    console.log(account);
    

    let withdrawInfo = req.body
    withdrawInfo.account = account._id
    withdrawInfo.acn = account.acn
    withdrawInfo.balance = account.current
    withdrawInfo.amount = (account.current - withdrawInfo.charge)
    
    const withdraw = new Withdraw(withdrawInfo);
    console.log(withdraw);
    
    const result = await withdraw.save();
    console.log('Account has been successfully withdrawn. Pay: ' + result.amount +' TK');
    

    res.json({message: `Account has been successfully withdrawn. <br> Pay: ${result.amount} TK`});
});

// Getting withdraw
router.get('/', async (req, res) => {
    const result = await Withdraw.find();
    res.json(result);
});

module.exports = router;

