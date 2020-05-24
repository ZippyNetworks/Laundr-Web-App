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
    customer: hardCodeCustomerID, //hardcode for now, will be the id stored for every registered user (create new stripe customer for every registered user!)
  });

  if (session) {
    res.json({ success: true, message: session.id });
  } else {
    res.json({ success: false, message: "Unable to create checkout session" });
  }
};

const createSetupIntent = async (req, res) => {
  const intent = await stripe.setupIntents.create({
    customer: hardCodeCustomerID, //hardcode for now, will be the id stored for every registered user (create new stripe customer for every registered user!)
  });

  if (intent) {
    res.json({ success: true, message: intent.client_secret });
  } else {
    res.json({ success: false, message: "Unable to create SetupIntent" });
  }
};

const chargeCustomer = async (req, res) => {
  let cards;

  //get list of payment methods
  await stripe.paymentMethods
    .list({ customer: hardCodeCustomerID, type: "card" }) //hardcode customer for now
    .then((paymentMethods, err) => {
      if (err) {
        return res.json({
          success: false,
          message: "Error with fetching payment methods: " + err,
        });
      } else {
        cards = paymentMethods;
      }
    });

  //set payment id of their default card, the one first added
  //!!!TODO: OR JUST STORE A PAYMENT ID AND USE THAT FOR THESE ON-DEMAND CHARGES while keeping the sub payment method separate (self service thru stripe)
  let defaultCardID;

  if (cards.data.length === 0) {
    return res.json({ success: false, message: "NPM" }); //npm = no payment method
  } else {
    //grab the first card they added
    let defaultIndex = cards.data.length - 1;
    let defaultCard = cards.data[defaultIndex];

    defaultCardID = defaultCard.id;
  }

  //attempt a charge
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099,
      currency: "usd",
      customer: hardCodeCustomerID, //hardcode
      payment_method: defaultCardID,
      off_session: true,
      confirm: true,
    });
  } catch (err) {
    // Error code will be authentication_required if authentication is needed
    console.log("Error code is: ", err.code);
    const paymentIntentRetrieved = await stripe.paymentIntents.retrieve(
      err.raw.payment_intent.id
    );
    console.log("PI retrieved: ", paymentIntentRetrieved.id);
  }
};

module.exports = { createCheckoutSession, createSetupIntent, chargeCustomer };

const createCustomer = async () => {
  let testEmail = "jackzheng10@yahoo.com";

  const customer = await stripe.customers.create({
    email: "jackzheng10@yahoo.com",
  });

  // Recommendation: save the customer.id in your database, attach it to the user
  // important: doesnt check for duplicate emails

  console.log(customer);
};
