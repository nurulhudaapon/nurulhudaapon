const express = require('express');
const router = express.Router();
const multer  = require('multer')
const upload = multer({ dest: 'public/uploads/' })

const { Customer, validate } = require('../models/customer');

router.use(express.json());

// Creating user
router.post('/', upload.none(), async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(406).send(error.details[0].message);

    let customerInfo = req.body

    function genId (min, max) {return Math.floor(Math.random() * (max - min + 1) ) + min;}
    
    async function checkInDb(id) {
        const idFound = await Customer.findOne({id});
        if (idFound) return true;
        else return false;
    }
    
    async function checkUniqueId() {
        do {
            customerInfo.id = genId(100,999);
        } while (await checkInDb(customerInfo.id));
    }

    await checkUniqueId()
    
    const customer = new Customer(customerInfo);
    const result = await customer.save();
    res.json(result);
});

// Getting user
router.get('/', async (req, res) => {
    const result = await Customer.find().select('-__v -_id').populate({ 
        path: 'accounts',
        select: '-__v -_id -id',
        populate: {
          path: 'deposits',
          select: '-_id -__v -name'
        } 
     });
    res.json(result);
});

// Deleting user
router.delete('/:id', async (req, res) => {
    const result = await Customer.deleteOne({ id: req.params.id });
    res.json(result);
});

// Updating user
router.put('/:id', upload.none(), async (req, res) => {
    let newInfo = req.body;
    const result = await Customer.updateOne({ id: req.params.id }, {
        $set: {
            name: newInfo.name,
            phone: newInfo.phone,
            address: newInfo.address,
            id: newInfo.id,
            acc_date: newInfo.acc_date
        }
    });
    res.json(result);
});

module.exports = router;

