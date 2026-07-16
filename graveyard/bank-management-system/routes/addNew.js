const express = require('express');
const router = express.Router();
const { Customer } = require('../models/customer');
const { Account } = require('../models/account');

const admin = require('../middleware/admin');


router.use(express.json());

// Add New Page
router.get('/', admin, async (req, res) => {
    res.render('admin/addNew');
});
// Add New Page
router.get('/all', admin, async (req, res) => {
    const customers = await Customer.find();
    const accounts = await Account.find();


    res.render('admin/add', { customers, accounts });
});
// Customer
router.get('/customer', admin, async (req, res) => {
    res.render('admin/customer');
});
// Getting user
router.get('/account', admin, async (req, res) => {
    const customers = await Customer.find();
    res.render('admin/addNew', { customers });
});
// Getting user
router.get('/deposit', admin, async (req, res) => {
    const accounts = await Account.find();
    res.render('admin/deposit', { accounts });
});

module.exports = router;

