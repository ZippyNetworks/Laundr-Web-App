const User = require("../models/User");
const moment = require("moment");

const familyAPI_ID =
  process.env.STRIPE_FAMILY_API_ID ||
  require("../config/config").stripe.familyAPI_ID;
const plusAPI_ID =
  process.env.STRIPE_PLUS_API_ID ||
  require("../config/config").stripe.plusAPI_ID;
const standardAPI_ID =
  process.env.STANDARD_FAMILY_API_ID ||
  require("../config/config").stripe.standardAPI_ID;
const studentAPI_ID =
  process.env.STUDENT_FAMILY_API_ID ||
  require("../config/config").stripe.studentAPI_ID;

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

      // console.log(
      //   "test 1: " +
      //     moment.unix(subscriptionUpdated.billing_cycle_anchor).format()
      // ); //iso8601

      // console.log(
      //   "test 2: " + moment.unix(subscriptionUpdated.billing_cycle_anchor)
      // ); //moment object, basically a Date

      // console.log(
      //   "this 1: " +
      //     moment
      //       .unix(subscriptionUpdated.billing_cycle_anchor)
      //       .format("HH:mm:ss")
      // );
      // console.log(
      //   "this 2: " +
      //     moment
      //       .unix(subscriptionUpdated.billing_cycle_anchor)
      //       .format("MM/DD/YYYY")
      // ); //format("MM/DD/YYYY");

      let plan;

      switch (subscriptionUpdated.plan.id) {
        case familyAPI_ID:
          plan = "Family";
          break;
        case plusAPI_ID:
          plan = "Plus";
          break;
        case standardAPI_ID:
          plan = "Standard";
          break;
        case studentAPI_ID:
          plan = "Student";
          break;
      }

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
        plan: plan,
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
