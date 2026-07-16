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
    let result = await customer.save();
    res.json({message: 'SUCCESS! Your ID: ' + result.id});
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
// Getting a user
router.get('/:id', async (req, res) => {
    const result = await Customer.findOne({id: req.params.id}).select('-__v -_id');
    res.json(result);
});

// Deleting user
router.delete('/:id', async (req, res) => {
    const result = await Customer.deleteOne({ id: req.params.id });
    res.json(result);
});

// Updating user
router.put('/:id', upload.none(), async (req, res) => {
    // console.log('req recived');
    // console.log(req.body);

    const { error } = validate(req.body);
    if (error) return res.status(406).send(error.details[0].message);
    
    
    let newInfo = req.body;
    if (!newInfo.email) newInfo.email = null;
    const result = await Customer.updateOne({ id: req.params.id }, {
        $set: {
            name: newInfo.name,
            phone: newInfo.phone,
            address: newInfo.address,
            // id: newInfo.id,
            date: newInfo.date,
            email: newInfo.email
        }
    });
    console.log(result.ok);
    if (result.ok)return res.send('Customer updated');
    res.send('Failed to update customer')
    
});

module.exports = router;

