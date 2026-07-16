const express = require('express');
const router = express.Router();
const { Deposit, validate } = require('../models/deposit');
const { Account } = require('../models/account');
const multer  = require('multer')
const upload = multer({ dest: 'public/uploads/' })

router.use(express.json());

// Creating user
router.post('/', upload.none(), async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(406).send(error.details[0].message);

    let depositInfo = req.body;
    depositInfo.name = depositInfo.account.split(' - ')[0];
    depositInfo.acn = depositInfo.account.split(' - ')[1];

    const deposit = new Deposit(depositInfo);
    
    const account = await Account.findOneAndUpdate({ acn: deposit.acn }, {
        $set: {
            lastUpdated: Date.now()
        },
        $push: {
            deposits: deposit._id
        },
        $inc: {
            current: deposit.amount
        }
        
    },{new: true});

    const result = await deposit.save();
    
    res.json(result);
});

// Getting user
router.get('/', async (req, res) => {
    const result = await Deposit.find();
    res.send(result);
});

// Deleting user
router.delete('/:acn', async (req, res) => {
    const result = await Deposit.deleteOne({ acn: req.params.acn });
    res.send(result);
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

