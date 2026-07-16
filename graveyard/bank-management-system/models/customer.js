const mongoose = require('mongoose');
const config = require('config');
const Joi = require('joi');

// Customer model
const Customer = mongoose.model(config.get('database.customer'), new mongoose.Schema({
    name: {type: String, required: true},
    phone: {type: String, required: true},
    email: {type: String, default: null},
    address: {type: String, required: true},
    id: {type: String, required: true, unique: true},
    date: {type: Date, default: Date.now},
    accounts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: config.get('database.account')
    }],
    facebook: {
        type: Object
    }
    }));

// Joi validation
const validateCustomer = (customerInfo) => {
    const schema = {
            name: Joi.string().min(2).max(255).required(),
            phone: Joi.string().length(11).required(),
            email: Joi.string(),
            address: Joi.string().min(2).max(255).required(),
            date: Joi.date(),
            accounts: Joi.array()
    }
    return Joi.validate(customerInfo, schema);
}


exports.Customer = Customer;
exports.validate = validateCustomer;