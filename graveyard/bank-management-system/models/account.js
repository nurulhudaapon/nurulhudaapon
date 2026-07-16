const mongoose = require("mongoose");
const config = require("config");
const Joi = require("joi");

// Customer model
const Account = mongoose.model(
  config.get("database.account"),
  new mongoose.Schema(
    {
      name: { type: String, required: true },
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: config.get("database.customer")
      },
      type: String,
      id: { type: String, required: true },
      acn: { type: String, required: true, unique: true },
      withdrawn: { type: Boolean, default: false },
      min: { type: Number, required: true },
      total: { type: Number, required: true },
      current: { type: Number, default: 0 },
      deposits: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: config.get("database.deposit")
        }
      ],
      matured: {
        type: Boolean,
        default: false
      },
      accountAge: {
          type: Number,
          default: 123,
          get: (v) => { return Math.round(((Date.now() - new Date(this.date).getTime())/8.64e+7))}
      }
    },
    {
      timestamps: { createdAt: "date", updatedAt: "lastUpdated" },
      toObject: { getters: true },
      toJSON: { getters: true }
    }
  )
);

// Joi validation
const validateAccount = accountInfo => {
  const schema = {
    customer: Joi.string()
      .min(2)
      .max(255)
      .required(),
    total: Joi.number().required(),
    min: Joi.number().required(),
    date: Joi.date().required(),
    deposits: Joi.array()
  };
  return Joi.validate(accountInfo, schema);
};

exports.Account = Account;
exports.validate = validateAccount;
