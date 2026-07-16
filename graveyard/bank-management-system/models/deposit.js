const mongoose = require('mongoose');
const config = require('config');
const Joi = require('joi');

// Customer model
const Deposit = mongoose.model(config.get('database.deposit'), new mongoose.Schema({
    name: {type: String, required: true},
    acn: {type: String, required: true},
    date: {type: Date, required: true},
    amount: {type: Number, required: true},
    dBy: {type: String, required: true},
    // depositor: {type: String, required: true},
    dTo: {type: String, required: true}

    }));

// Joi validation
const validateDeposit = (depositInfo) => {
    const schema = {
            account: Joi.string().min(2).max(255).required(),
            amount: Joi.number().required(),
            dBy: Joi.string().max(255).min(2).required(),
            dTo: Joi.string().max(255).min(2).required(),
            date: Joi.date().required()
    }
    return Joi.validate(depositInfo, schema);
}


exports.Deposit = Deposit;
exports.validate = validateDeposit;