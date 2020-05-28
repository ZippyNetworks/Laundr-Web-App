const User = require("../models/User");

// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys
const stripeSECRET =
  process.env.STRIPE_SECRET || require("../config/config").stripe.secret;

const stripe = require("stripe")(stripeSECRET);
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

let hardCodeCustomerID = "";
let hardcodePaymentID = "";

const createCheckoutSession = async (req, res) => {
  let planAPI_ID = "";

  switch (req.body.type) {
    case "Student":
      planAPI_ID = studentAPI_ID;
      break;

    case "Standard":
      planAPI_ID = standardAPI_ID;
      break;

    case "Plus":
      planAPI_ID = plusAPI_ID;
      break;

    case "Family":
      planAPI_ID = familyAPI_ID;
      break;
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: planAPI_ID,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: "https://example.com/success?session_id={CHECKOUT_SESSION_ID}", //after they successfully checked out
    cancel_url: "http://localhost:3000/paymentTest", //usually the page they were at before. if they click to go back
    customer: req.body.customerID,
  });

  if (session) {
    res.json({ success: true, message: session.id });
  } else {
    res.json({ success: false, message: "Unable to create checkout session" });
  }
};

const createSetupIntent = async (req, res) => {
  const intent = await stripe.setupIntents.create({
    customer: req.body.customerID,
  });

  if (intent) {
    res.json({ success: true, message: intent.client_secret });
  } else {
    res.json({ success: false, message: "Unable to create SetupIntent" });
  }
};

const chargeCustomer = async (req, res) => {
  // let cards;

  // //get list of payment methods
  // await stripe.paymentMethods
  //   .list({ customer: hardCodeCustomerID, type: "card" }) //hardcode customer for now
  //   .then((paymentMethods, err) => {
  //     if (err) {
  //       return res.json({
  //         success: false,
  //         message: "Error with fetching payment methods: " + err,
  //       });
  //     } else {
  //       cards = paymentMethods;
  //     }
  //   });

  //set payment id of their default card, the one first added
  //!!!TODO: OR JUST STORE A PAYMENT ID AND USE THAT FOR THESE ON-DEMAND CHARGES while keeping the sub payment method separate (self service thru stripe)
  // let defaultCardID;

  // if (cards.data.length === 0) {
  //   return res.json({ success: false, message: "NPM" }); //npm = no payment method
  // } else {
  //   //grab the first card they added
  //   let defaultIndex = cards.data.length - 1;
  //   let defaultCard = cards.data[defaultIndex];

  //   defaultCardID = defaultCard.id;
  // }

  //attempt a charge
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099, //hardcode
      currency: "usd",
      customer: hardCodeCustomerID, //hardcode
      payment_method: hardcodePaymentID, //hardcode
      off_session: true,
      confirm: true,
    });

    return res.json({ success: true, message: "Charged successfully" });
  } catch (err) {
    // Error code will be authentication_required if authentication is needed
    console.log("Error code is: ", err.code);

    if (err.code === "authentication_required") {
      const paymentIntentRetrieved = await stripe.paymentIntents.retrieve(
        err.raw.payment_intent.id
      );
      console.log("PI retrieved: ", paymentIntentRetrieved.id);

      return res.json({
        success: false,
        message: "authentication_required",
        paymentIntent: paymentIntentRetrieved,
      });
    } else {
      return res.json({
        success: false,
        message: err.code,
      });
    }
  }
};

//dont let req get through if its "N/A"
const getCardDetails = async (req, res) => {
  await stripe.paymentMethods
    .retrieve(req.body.paymentID)
    .then((paymentMethod, err) => {
      if (err || !paymentMethod) {
        return res.json({
          success: false,
          message: "Error with fetching payment method: " + err,
        });
      } else {
        return res.json({
          success: true,
          message: paymentMethod,
        });
      }
    });
};

const setRegPaymentID = async (req, res) => {
  await User.findOneAndUpdate(
    { email: req.body.userEmail },
    {
      "stripe.regPaymentID": req.body.regPaymentID,
    }
  )
    .then((user) => {
      let oldRegPaymentID = user.stripe.regPaymentID;
      let oldDeleted = true;

      if (oldRegPaymentID != "N/A") {
        stripe.paymentMethods
          .detach(oldRegPaymentID)
          .then((paymentMethod, err) => {
            if (err || !paymentMethod) {
              oldDeleted = false;
            }
          });
      }

      //todo: send these error messages to user
      if (user && oldDeleted) {
        return res.json({
          success: true,
          message:
            "Regular payment ID successfully attached to user and old ID, if any, was detached in Stripe",
        });
      } else if (!user) {
        return res.json({
          success: false,
          message:
            "Error with attaching default payment ID to user. Please try again. If the issue persists, contact us.",
        });
      } else {
        return res.json({
          success: false,
          message:
            "Error with detaching old payment method in Stripe. Please try again. If the issue persists, contact us.",
        });
      }
    })
    .catch((error) => {
      return res.json({
        success: false,
        message: error,
      });
    });
};

module.exports = {
  createCheckoutSession,
  createSetupIntent,
  chargeCustomer,
  getCardDetails,
  setRegPaymentID,
};
