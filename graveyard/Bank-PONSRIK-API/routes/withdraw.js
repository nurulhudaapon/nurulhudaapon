const express = require('express');
const router = express.Router();
const multer  = require('multer')
const upload = multer({ dest: 'public/uploads/' })


const { Withdraw , validate } = require('../models/withdraw');
const { Account } = require('../models/account');

// Creating withdraw
router.post('/:acn',express.json(), upload.none(), async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(406).send(error.details[0].message);
    const account = await Account.findOneAndUpdate({acn: req.params.acn, matured: true}, {
        $set: {
            withdrawn: true
        }
    }, {new: true});
    if (!account) return res.send('Account is not found or not matured')

    console.log(account);
    

    let withdrawInfo = req.body
    withdrawInfo.account = account._id
    withdrawInfo.acn = req.params.acn
    
    const withdraw = new Withdraw(withdrawInfo);
    const result = await withdraw.save();
    res.json(result);
});

// Getting withdraw
router.get('/', async (req, res) => {
    const result = await Withdraw.find();
    res.json(result);
});

module.exports = router;

