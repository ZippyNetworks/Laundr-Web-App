const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true,
  },
  anchorDate: {
    type: String,
    unique: true,
    required: true,
  },
  startDate: {
    type: String,
    unique: true,
    required: true,
  },
  periodStart: {
    type: String,
    unique: true,
    required: true,
  },
  periodEnd: {
    type: String,
    unique: true,
    required: true,
  },
  planID: {
    type: String,
    unique: true,
    required: true,
  },
  status: {
    type: String,
    unique: true,
    required: true,
  },
});

module.exports = SubscriptionSchema;
