const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({});

const Subscription = mongoose.model("Subscription", SubscriptionSchema);

module.exports = Subscription;
