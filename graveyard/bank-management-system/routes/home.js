const express = require('express');
const router = express.Router();
const admin = require('../middleware/admin');

const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

router.use(cookieParser());

router.use(express.json());


const { Account } = require('../models/account');
const { Customer } = require('../models/customer');

// Home
router.get('/', async (req, res) => {
    let account = await Account.find();
    let customer = await Customer.find();
    let info = {account, customer}
    class Total extends Array { sum(key) {return this.reduce((a, b) => a + (b[key] || 0), 0);}}
    let total = new Total(...account);
    info.totalCurrent = total.sum('current')
    info.accountCount = account.length
    info.customerCount = customer.length
    res.render('user/home', {info});
});
// Customers
router.get('/customers', admin, async (req, res) => {
    let customers = await Customer.find();
    res.render('admin/customers', { customers });
});
// Accounts
router.get('/accounts', admin, async (req, res) => {
    let accounts = await Account.find();
    res.render('admin/accounts', { accounts });
});

router.get('/balance/:acn', async (req, res) => {
    const result = await Account.findOne({acn: req.params.acn}).select('total');
    res.json(result.total);
});
// My account
router.get('/myaccount', async (req, res) => {
    const query = req.query.id.toString();
    let t = query.length == 3 || query.length == 6
    if (!t) return res.status(406).send('Invalid ID or ACN');
    if (query.length == 3) {
        const result = await Customer.findOne({id: query}).select('-__v -_id').populate({
            path: 'accounts',
            select: '-__v -_id -id',
            populate: {
                path: 'deposits',
                select: '-_id -__v -name'
            }
        });
        if (!result) return res.status(404).send('No customer found.')
        res.render('user/customer', {result});
    }
    if (query.length == 6) {
        
        const result = await Account.findOne({acn: query}).select('-__v -_id').populate({path: 'deposits', select: '-__v -_id', options: { sort: { 'date': -1 } }});
        if (!result) return res.status(404).send('No account found.')
        res.render('user/account', {result});
        // console.log(result);
        
    }
});

router.get('/info', admin, async(req, res) => {

    const result = await Customer.find().select('-__v -_id').populate({
        path: 'accounts',
        select: '-__v -_id -id',
        populate: {
            path: 'deposits',
            select: '-_id -__v -name'
        }
    });

    // let accounts = await Account.find().select('current -_id');
    let accounts = await Account.aggregate([{ $group: { _id: null, sumAccount: { $sum: "$current" } } }]);

    res.json(result)
    var accountCount= 0;
    for (let i=0; i > result.length; i++){
        accountCount+= result[i].accounts.length;
        console.log(result.length, accountCount);
    }
    

    
});

router.post('/login', express.urlencoded({extended:true}), (req, res)=>{

    console.log(req.body);

    if (req.body.uname == 'bp' && req.body.psw == '338899') {
        const token = jwt.sign({name: "Nurul Huda", role: "Super"}, 'pk');
        if (req.body.remember == 'on'){

            res.cookie('token', token).redirect('/admin');
            return;
        }
        res.cookie('token', token, { maxAge: 600000}).redirect('/admin');
    } else {
        res.send('Wrong usernamer or password');
    }

    
});

router.get('/logout', (req, res)=>{

res.cookie('token', '').redirect('/admin-login.html');

});



module.exports = router;

