const { showConsoleError, caughtError } = require("../helpers/errors");
const cryptoRandomString = require("crypto-random-string");

const accountSID =
  process.env.TWILIO_SID || require("../config/config").twilio.accountSID;
const authToken =
  process.env.TWILIO_AUTHTOKEN || require("../config/config").twilio.authToken;
const client = require("twilio")(accountSID, authToken);
const from = process.env.TWILIO_FROM || require("../config/config").twilio.from;

const twilioVerify = async (req, res) => {
  try {
    const code = cryptoRandomString({ length: 6, type: "numeric" });

    const message = await client.messages.create({
      body:
        "Thanks for signing up! Your Laundr verification code is: " +
        code +
        ".",
      from: from,
      to: req.body.to,
    });

    return res.json({
      success: true,
      message: code,
    });
  } catch (error) {
    showConsoleError("sending verification code", error);
    return res.json({
      success: false,
      message: caughtError("sending verification code"),
    });
  }
};

module.exports = { twilioVerify };
