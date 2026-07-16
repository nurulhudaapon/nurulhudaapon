const request = require('request');
const config = require('config');

function callback(error, response, body) {
    // console.log('Messge sent!');

}
function sendFacebookMessage(id, messageText) {
    let message = {
        url: "https://graph.facebook.com/v2.6/me/messages?access_token=" + config.get('facebook.access_token'),
        body: {
            "recipient": {

                "id": id
            },
            "message": {
                "text": messageText,
                // "quick_replies": [
                //     {
                //         "content_type": "text",
                //         "title": "Account Balance",
                //         "payload": "ac_balance",
                //     },
                //     {
                //         "content_type": "text",
                //         "title": "Account Details",
                //         "payload": "acn_dtls",
                //     },
                //     {
                //         "content_type": "text",
                //         "title": "Others",
                //         "payload": "others",
                //     }
                // ]
            }
        },
        headers: {
            'Content-Type': 'application/json'
        },
        json: true
    };

    request.post(message, callback);
}
function getAccountBalance(acn) {
    request.post("https://bank.ponsrik.cf/balacne/", callback);
}
exports.sendFBMessage = sendFacebookMessage;
// sendFacebookMessage("2207807745965356", "How are you?");

