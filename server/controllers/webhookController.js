const User = require("../models/User");
const moment = require("moment");

//todo: use webhooks to handle email change in chckout

const handleWebhook = async (req, res) => {
  let event;

  try {
    event = JSON.parse(req.body);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "customer.subscription.updated":
      console.log("Event handled: " + event.type);
      const subscriptionUpdated = event.data.object;
      console.log("subscription updated: ");
      console.log(subscriptionUpdated);

      console.log(
        "test 1: " +
          moment.unix(subscriptionUpdated.billing_cycle_anchor).format()
      );

      console.log(
        "test 2: " + moment.unix(subscriptionUpdated.billing_cycle_anchor)
      );

      console.log(
        "this shit: " +
          moment
            .unix(subscriptionUpdated.billing_cycle_anchor)
            .format("HH:mm:ss")
      );
      console.log(
        "this other shit: " +
          moment
            .unix(subscriptionUpdated.billing_cycle_anchor)
            .format("MM/DD/YYYY")
      ); //format("MM/DD/YYYY");

      let subscription = {
        id: subscriptionUpdated.id,
        anchorDate: moment
          .unix(subscriptionUpdated.billing_cycle_anchor)
          .format(),
        startDate: moment.unix(subscriptionUpdated.start_date).format(),
        periodStart: moment
          .unix(subscriptionUpdated.current_period_start)
          .format(),
        periodEnd: moment.unix(subscriptionUpdated.current_period_end).format(),
        planID: subscriptionUpdated.plan.product,
        status: subscriptionUpdated.status,
      };

      await User.findOneAndUpdate(
        { "stripe.customerID": subscriptionUpdated.customer },
        { subscription: subscription }
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
          console.log(
            "Error with updating user with subscription object: " + error
          );

          return res.json({
            success: false,
            message: error,
          });
        });
      break;
    default:
      // Unexpected event type or one not handled
      console.log("Received an event not handled: " + event.type);
      return res.json({
        success: false,
        message: "Received an event not handled",
      });
  }
};

module.exports = { handleWebhook };
