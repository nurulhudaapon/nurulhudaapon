const express = require("express");
const router = express.Router();
const { Account, validate } = require("../models/account");
const { Customer } = require("../models/customer");
const multer = require("multer");
const upload = multer({ dest: "public/uploads/" });
const admin = require("../middleware/admin");

// Creating account
router.post("/", admin, upload.none(), async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(406).send(error.details[0].message);

  let accountInfo = req.body;

  accountInfo.name = accountInfo.customer.split(" - ")[0];
  accountInfo.id = accountInfo.customer.split(" - ")[1];

  let account = new Account(accountInfo);

  const customer = await Customer.findOneAndUpdate(
    { id: account.id },
    {
      $push: {
        accounts: account._id
      }
    },
    { new: true }
  );

  account.acn = `${customer.id}${customer.accounts.length
    .toString()
    .padStart(3, 0)}`;
  account.owner = customer._id;

  const result = await account.save();

  res.json({ message: "SUCCESS! Your ACN: " + result.acn });
});

// Getting account
router.get("/", admin, async (req, res) => {
  if (req.query.type == "long") {
    const result = await Account.find({ withdrawn: false }).populate(
      "deposits"
    );
    return res.json(result);
  }
  if (req.query.type == "short") {
    const result = await Account.find({ withdrawn: false }).select(
      "name acn total min matured withdrawn -_id"
    );
    return res.json(result);
  }
  if (req.query.type == "running") {
    const result = await Account.find({
      withdrawn: false,
      matured: false,
      withdrawn: false
    }).select("name acn total min matured withdrawn -_id");
    return res.json(result);
  }
  if (req.query.type == "for-table") {
    const result = await Account.find({ withdrawn: false }).select(
      "name acn total min date current -_id"
    );
    return res.json(result);
  }
  if (req.query.type == "for-table-date") {
    const result = await Account.aggregate([
      {
        $project: {
          _id: 0,
          name: 1,
          acn: 1,
          total: 1,
          min: 1,
          age: {
            $divide: [{ $subtract: [new Date(), "$date"] }, 24 * 60 * 60 * 1000]
          },
          date: { $dateToString: { format: "%d/%m/%Y", date: "$date" } },
          current: 1,
          status: {
            $switch: {
              branches: [
                { case: "$withdrawn", then: "Withdrawn" },
                { case: "$matured", then: "Matured" }
              ],
              default: "Running"
            }
          }
        }
      }
    ]);
    // console.log(result);

    return res.json(result);
  }
  if (req.query.type == "matured") {
    const result = await Account.find({
      matured: true,
      withdrawn: false
    }).select("name acn total min matured withdrawn -_id");
    return res.json(result);
  }
  console.log("get all");
  const result = await Account.find().select("-_id -__v");
  res.json(result);
});

router.get("/:acn", admin, async (req, res) => {
  // const result = await Account.find({acn:req.params.acn}).populate('deposits');
  if (req.query.type == "short") {
    const result = await Account.findOne({ acn: req.params.acn }).select(
      "name id total min date -_id"
    );
    return res.json(result);
  }

  const result = await Account.findOne({ acn: req.params.acn });
  res.json(result);
});

// Deleting account
router.delete("/:acn", admin, async (req, res) => {
  const result = await Account.deleteOne({ acn: req.params.acn });
  res.send(result);
});

// Updating account
router.put("/:acn", admin, upload.none(), async (req, res) => {
  let newInfo = req.body;
  console.log(newInfo);

  const result = await Account.updateOne(
    { acn: req.params.acn },
    {
      $set: {
        name: newInfo.name,
        date: newInfo.date,
        min: newInfo.min,
        total: newInfo.total
      }
    }
  );
  res.json(result);
});

module.exports = router;
