const User = require("../models/User");

//todo: use webhooks to handle email change in chckout

const handleWebhook = async (req, res) => {
  let event;

  try {
    event = JSON.parse(req.body);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("Event: " + event.type);

  // Handle the event
  switch (event.type) {
    case "customer.subscription.updated":
      const subscriptionUpdated = event.data.object;
      console.log("subscription updated: ");
      console.log(subscriptionUpdated);

      await User.findOneAndUpdate(
        { "stripe.customerID": subscriptionUpdated.customer },
        { subscription: subscriptionUpdated }
      )
        .then((user) => {
          if (user) {
            return res.json({
              success: true,
              message: "Updated user subscription object",
            });
          } else {
            return res.json({
              success: false,
              message: "Could not find user associated with subscription",
            });
          }
        })
        .catch((error) => {
          return res.json({
            success: false,
            message: error,
          });
        });
      break;
    default:
      // Unexpected event type or one not handled
      console.log("Received an event not handled");
      return res.json({
        success: false,
        message: "Received an event not handled",
      });
  }
};

module.exports = { handleWebhook };
