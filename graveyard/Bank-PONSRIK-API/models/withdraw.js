const mongoose = require('mongoose');
const config = require('config');
const Joi = require('joi');

const Withdraw = mongoose.model(config.get('database.withdraw'), new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: config.get('database.account'),
        required: true
    },
    acn: {type: String, required: true},
    date: {type: Date, required: true},
    balance: {type: Number, required: true},
    amount: {type: Number, required: true},
    charge: {type: Number, required: true}
}));

// Joi validation
const validateWithdraw = (witdrawInfo) => {
    const schema = {
            date: Joi.date().required(),
            balance: Joi.number().required(),
            amount: Joi.number().required(),
            charge: Joi.number().required()
        }
    return Joi.validate(witdrawInfo, schema);
}


exports.Withdraw = Withdraw;
exports.validate = validateWithdraw;