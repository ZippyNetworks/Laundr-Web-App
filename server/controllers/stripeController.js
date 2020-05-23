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
    customer: "cus_HKPtDOoUXba3lO", //hardcode for now, will be the id stored for every registered user (create new stripe customer for every registered user!)
  });

  if (session) {
    res.json({ success: true, message: session.id });
  } else {
    res.json({ success: false, message: "Unable to create checkout session" });
  }
};

module.exports = { createCheckoutSession };

const createCustomer = async () => {
  let testEmail = "jackzheng10@yahoo.com";

  const customer = await stripe.customers.create({
    email: "jackzheng10@yahoo.com",
  });

  // Recommendation: save the customer.id in your database, attach it to the user
  // important: doesnt check for duplicate emails

  console.log(customer);
};
