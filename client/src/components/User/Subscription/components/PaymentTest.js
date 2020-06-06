import React, { Component } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Button, withStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import axios from "axios";
import jwtDecode from "jwt-decode";
import baseURL from "../../../../baseURL";
import paymentTestStyles from "../../../../styles/User/Subscription/components/paymentTestStyles";

import CardInfo from "./CardInfo";

const stripeKEY =
  process.env.STRIPE_PUBLISHABLE_KEY ||
  require("../../../../config").stripe.publishableKEY;

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(stripeKEY);

class PaymentTest extends Component {
  handleCheckout = async (type) => {
    // When the customer clicks on the button, redirect them to Checkout.
    // Call your backend to create the Checkout session.
    let token = localStorage.getItem("token");
    const data = jwtDecode(token);
    let customerID = data.stripe.customerID;

    await axios
      .post(baseURL + "/stripe/createCheckoutSession", { type, customerID })
      .then(async (res) => {
        if (res.data.success) {
          let sessionId = res.data.message;

          const stripe = await stripePromise;

          // If `redirectToCheckout` fails due to a browser or network
          // error, display the localized error message to your customer
          // using `error.message`.
          const { error } = await stripe.redirectToCheckout({
            sessionId,
          });

          if (error) {
            alert(error.message);
          }
        } else {
          alert(
            "Error with creating checkout session. Please try again. If the issue persists, contact us."
          );
        }
      })
      .catch((error) => {
        alert("Error: " + error);
      });
  };

  render() {
    const classes = this.props.classes;

    return (
      <React.Fragment>
        <Button
          variant="contained"
          color="primary"
          className={classes.gradientButton}
          onClick={() => {
            this.handleCheckout("Student");
          }}
        >
          Student
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.gradientButton}
          onClick={() => {
            this.handleCheckout("Standard");
          }}
        >
          Standard
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.gradientButton}
          onClick={() => {
            this.handleCheckout("Plus");
          }}
        >
          Plus
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.gradientButton}
          onClick={() => {
            this.handleCheckout("Family");
          }}
        >
          Family
        </Button>
        <br />
        <br />
        <br />
        <CardInfo />
      </React.Fragment>
    );
  }
}

PaymentTest.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(paymentTestStyles)(PaymentTest);
