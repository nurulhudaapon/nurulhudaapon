const express = require('express');
const router = express.Router();
const { Customer } = require('../models/customer');
const { Account } = require('../models/account');
const { sendMail } = require('../utils/mailer');

router.post('/sendBalanceInfoToAllCustomer', async (req, res) => {
    const account = await Account.find();
    const mails = customers.map( a => a.email).toString();


    accounts.forEach(account => {
        // const acnMail = await Customer.findById(account.owner).select('mail');
        console.log(acnMail);

        const subject = "Your Account Balance";
        const html = `Your account (ACN: ${account.acn}, Name: ${account.name}) balance is: ${account.current} Taka.`
        sendMail(d.email)
        
    })

});
router.get('/allMails', async (req, res) => {
    const account = await Account.find();
 var emailSentCount = 0;
    account.forEach(async (account) => {
        const customer = await Customer.findById(account.owner).select('email');
        
        const subject = "Your Account Balance";
        const html = `Your account (ACN: ${account.acn}, Name: ${account.name}) balance is: ${account.current} Taka.`
        if (customer.email) {
            
            emailSentCount = emailSentCount + 1;
            // console.log('sent', emailSentCount);
            
            sendMail(customer.email, subject, html)
        }
        // console.log(html);
        
        // res.text(html)
        
    })
    await res.send(emailSentCount + ' email has been sent.')
});

module.exports = router