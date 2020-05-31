const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: false,
    required: true,
  },
  anchorDate: {
    type: String,
    unique: false,
    required: true,
  },
  startDate: {
    type: String,
    unique: false,
    required: true,
  },
  periodStart: {
    type: String,
    unique: false,
    required: true,
  },
  periodEnd: {
    type: String,
    unique: false,
    required: true,
  },
  plan: {
    type: String,
    unique: false,
    required: true,
  },
  status: {
    type: String,
    unique: false,
    required: true,
  },
  lbsLeft: {
    type: Number,
    unique: false,
    required: true,
  },
});

module.exports = SubscriptionSchema;
