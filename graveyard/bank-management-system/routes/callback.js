const { sendFBMessage } = require('../utils/messangerBot');
const express = require('express');
const router = express.Router();

const { Account } = require('../models/account');
const { Customer } = require('../models/customer');


router.use(express.json());

router.get('/webhook/facebook', (req, res) => {
    let VERIFY_TOKEN = "bp"

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            res.status(200).send(challenge);
        } else {
            res.status(404).send('Invalid request');
        }
    }
});

const messageText = {
    facebook: {
        
        default: "Thank you for messaging us. What do you want to know from us? If you want to know your account balance just send your account number.",
        accountBalance: `Your account`
    }
}

router.post('/webhook/facebook', (req, res) => {
    let body = req.body;
    if (body.object === 'page') {
        body.entry.forEach(function (entry) {
            let event = entry.messaging[0];
            // console.log(event);

            async function replayMessage() {
                if (event.message && !event.message.app_id) {

                    const psid = event.sender.id;
                    const cmnd = event.message.text.split(' ')[0].toLowerCase();
                    const info = event.message.text.split(' ')[1];

                    console.log("Command: "+cmnd, info, psid);

                    switch (cmnd) {
                        case 'gab':
                            console.log('gotten gab command');
                            
                            const accountB = await Account.findOne({ acn: info });
                            if (!accountB) return sendFBMessage(psid, `No account found with the given id (${info})`);
                            sendFBMessage(psid, `Your account (ACN: ${accountB.acn}, Name: ${accountB.name}) balance is: ${accountB.current} Taka.`);
                            break;
                        case 'gas':
                            const account = await Account.findOne({ acn: info });
                            sendFBMessage(psid,
                                `Full account info bellow:
                                    ${JSON.stringify(account)}`);
                            break;
                        case 'spn':
                            const customer = await Customer.findOneAndUpdate({ id: info }, {
                                $set: {
                                    facebook: { psid }
                                }
                            }, {new: true});
                            if (!customer) return sendFBMessage(psid, `No customer found with the given id (${info})`)
                            sendFBMessage(psid,
                                `You will be recieving notification for the account bellow:
                                Name: ${customer.name},
                                ID: ${customer.id},
                                FB PSID: ${customer.facebook.psid}`);

                            break;

                        case 'upn':
                            const customerU = await Customer.findOneAndUpdate({ id: info }, {
                                $set: {
                                    facebook: { psid: null }
                                }
                            }, {new: true});
                            if (!customerU) return sendFBMessage(psid, `No customer found with the given id (${info})`);
                            sendFBMessage(psid,
                                `You will not be recieving notification anymore for the account bellow:
                                Name: ${customerU.name},
                                ID: ${customerU.id}`);
                            break;
                        default:
                            console.log("Nothing matched.");
                            
                            // sendFBMessage(psid, messageText.facebook.default);
                            break;
                    }
                }
            }
            replayMessage();
        });
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.status(404).send('Invalid request');
    }
});

module.exports = router;