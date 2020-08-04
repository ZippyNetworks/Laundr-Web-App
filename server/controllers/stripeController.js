const { showConsoleError, caughtError } = require("../helpers/errors");
const User = require("../models/User");
const baseURL = require("../config/baseURL");

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
  process.env.STRIPE_STANDARD_API_ID ||
  require("../config/config").stripe.standardAPI_ID;
const studentAPI_ID =
  process.env.STRIPE_STUDENT_API_ID ||
  require("../config/config").stripe.studentAPI_ID;

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

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: planAPI_ID,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${baseURL}/user/subscription`, //after they successfully checked out
      cancel_url: `${baseURL}/user/subscription`, //usually the page they were at before. if they click to go back
      customer: req.body.customerID,
    });

    return res.json({ success: true, message: session.id });
  } catch (error) {
    showConsoleError("creating Checkout session", error);
    return res.json({
      success: false,
      message: caughtError("creating Checkout session"),
    });
  }
};

const createSetupIntent = async (req, res) => {
  try {
    const intent = await stripe.setupIntents.create({
      customer: req.body.customerID,
    });

    return res.json({ success: true, message: intent.client_secret });
  } catch (error) {
    showConsoleError("creating card setup intent", error);
    return res.json({
      success: false,
      message: caughtError("creating card setup intent"),
    });
  }
};

const getCardDetails = async (req, res) => {
  try {
    const paymentMethod = await stripe.paymentMethods.retrieve(
      req.body.paymentID
    );

    return res.json({
      success: true,
      message: paymentMethod,
    });
  } catch (error) {
    showConsoleError("getting card details", error);
    return res.json({
      success: false,
      message: caughtError("getting card details"),
    });
  }
};

const setRegPaymentID = async (req, res, next) => {
  try {
    const user = res.locals.user;
    const oldPaymentID = user.stripe.regPaymentID;

    user.stripe.regPaymentID = req.body.regPaymentID;

    await user.save();

    if (oldPaymentID != "N/A") {
      const paymentMethod = await stripe.paymentMethods.detach(oldPaymentID);
    }

    return res.json({
      success: true,
      message: "Successfully updated user payment ID.",
    });
  } catch (error) {
    showConsoleError("setting payment ID", error);
    return res.json({
      success: false,
      message: caughtError("setting payment ID"),
    });
  }
};

const chargeCustomer = async (req, res, next) => {
  const user = res.locals.user;
  const subscription = user.subscription;

  //calculate the lbs to be charged, if any
  let lbsCost = 0;

  //if the subscription has any lbs left, calculate the lbs to be deducted or charged
  if (subscription.lbsLeft > 0) {
    lbsCost = req.body.weight - subscription.lbsLeft;
  } else {
    lbsCost = req.body.weight;
  }

  //if the lbs to be charged is greater than 0, charge them. otherwise, they must be a subscriber so update their lbs left
  if (lbsCost > 0) {
    //attempt a charge
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: lbsCost * 1.5 * 100,
        currency: "usd",
        customer: user.stripe.customerID,
        payment_method: user.stripe.regPaymentID,
        off_session: true,
        confirm: true,
      });

      //if charge successful and they're a subscriber, move on to middleware to update their lbs left if its not already 0
      if (subscription.lbsLeft > 0) {
        res.locals.lbsCost = lbsCost;
        next();
      } else {
        return res.json({
          success: true,
          message: "User successfully charged.",
        });
      }
    } catch (error) {
      // Error code will be authentication_required if authentication is needed
      showConsoleError("charging user", error);
      console.log("Charging user error code is: ", error.code);

      return res.json({
        success: false,
        message: `Error with charging user: ${error.code}`,
      });
    }
  } else {
    //subscriber was not charged, so move on to middleware to update their lbs left
    res.locals.lbsCost = lbsCost;
    next();
  }
};

const updateSubscriptionLbs = async (req, res) => {
  try {
    const user = res.locals.user;
    const subscription = user.subscription;
    const lbsCost = res.locals.lbsCost;

    let updatedLbsLeft;

    if (lbsCost > 0) {
      updatedLbsLeft = 0;
    } else {
      updatedLbsLeft = subscription.lbsLeft - req.body.weight;
    }

    user.subscription.lbsLeft = updatedLbsLeft;

    await user.save();

    return res.json({
      success: true,
      message: "User successfully charged and/or subscription lbs updated.",
    });
  } catch (error) {
    showConsoleError("updating subscription lbs", error);
    return res.json({
      success: false,
      message: caughtError("updating subscription lbs"),
    });
  }
};

const findUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (user) {
      res.locals.user = user;
      next();
    } else {
      return res.json({
        success: false,
        message: "User could not be found.",
      });
    }
  } catch (error) {
    showConsoleError("finding user", error);
    return res.json({
      success: false,
      message: caughtError("finding user"),
    });
  }
};

const createSelfPortal = async (req, res) => {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: req.body.customerID,
      return_url: baseURL + "/userSubscription",
    });

    return res.json({
      success: true,
      message: session.url,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error,
    });
  }
};

module.exports = {
  createSetupIntent,
  setRegPaymentID,
  getCardDetails,
  findUser,
  updateSubscriptionLbs,
  chargeCustomer,
  createSelfPortal,
  createCheckoutSession,
};
