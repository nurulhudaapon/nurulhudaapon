const config = require('config');
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport(config.get('email'));

module.exports.sendMail = async function (to, subject, html) {
  try {
    let info = await transporter.sendMail({ from: config.get('email.from'), to, subject, html });
    console.log('Email sent, Time:' +info.messageTime+', Size: '+info.messageSize+', ID: ' + info.messageId);
  }
  catch (e) {
    console.log('Error Mailing: ' + e.response);
  }

}
// module.exports.sendMail('apon@ponsrik.cf', 'Mail Testing', '<h1>How are you?</h1>');
// console.log(config.get('email'));


