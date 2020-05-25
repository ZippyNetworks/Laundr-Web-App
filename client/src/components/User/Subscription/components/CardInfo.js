import React, { Component } from "react";
import {
  Elements,
  CardElement,
  ElementsConsumer,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button, withStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import axios from "axios";
import baseURL from "../../../../baseURL";
import cardInfoStyles from "../../../../styles/User/Subscription/components/cardInfoStyles";

const stripeKEY =
  process.env.STRIPE_PUBLISHABLE_KEY ||
  require("../../../../config").stripe.publishableKEY;

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(stripeKEY);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

class CardInfo extends Component {
  constructor(props) {
    super(props);
  }

  handleSetupIntent = async (type) => {
    let secret = "";

    await axios
      .post(baseURL + "/stripe/createSetupIntent", {})
      .then(async (res) => {
        if (res.data.success) {
          secret = res.data.message;
        } else {
          alert("Error with creating SetupIntent");
        }
      })
      .catch((error) => {
        alert("Error: " + error);
      });

    return secret;
  };

  handleCardSetup = async () => {
    const { stripe, elements } = this.props;

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    let secret = await this.handleSetupIntent();

    const result = await stripe.confirmCardSetup(secret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: "placeholder",
        },
      },
    });

    if (result.error) {
      // Display result.error.message in your UI.
      alert("Error: " + result.error.message);
    } else {
      // The setup has succeeded. Display a success message and send
      // result.setupIntent.payment_method to your server to save the
      // card to a Customer
      alert("setup successful");
    }
  };

  handleChargeCard = async () => {
    const { stripe } = this.props;

    await axios
      .post(baseURL + "/stripe/chargeCustomer", {})
      .then(async (res) => {
        if (res.data.success) {
          alert("nice");
        } else {
          if (res.data.message === "authentication_required") {
            // Pass the failed PaymentIntent to your client from your server
            let intent = res.data.paymentIntent;
            await stripe
              .confirmCardPayment(intent.client_secret, {
                payment_method: intent.last_payment_error.payment_method.id,
              })
              .then(function (result) {
                if (result.error) {
                  // Show error to your customer
                  alert(result.error.message);
                } else {
                  if (result.paymentIntent.status === "succeeded") {
                    // The payment is complete!
                    alert("Payment complete!");
                  }
                }
              });
          } else {
            alert(
              "Error with charging card: " +
                res.data.message +
                ". Please contact us."
            );
          }
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
        <div style={{ width: 400 }}>
          <label>
            Card details
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </label>
        </div>
        <br />
        <Button
          variant="contained"
          color="primary"
          className={classes.gradientButton}
          onClick={this.handleCardSetup}
        >
          Save Card to jackzheng10
        </Button>
        <br />
        <Button
          variant="contained"
          color="primary"
          className={classes.gradientButton}
          onClick={this.handleChargeCard}
        >
          Charge jackzheng10 $10 with first paymentmethod
        </Button>
      </React.Fragment>
    );
  }
}

InjectedCardSetupForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

function InjectedCardSetupForm(props) {
  const classes = props.classes;

  return (
    <Elements stripe={stripePromise}>
      <ElementsConsumer>
        {({ stripe, elements }) => (
          <CardInfo stripe={stripe} elements={elements} classes={classes} />
        )}
      </ElementsConsumer>
    </Elements>
  );
}

export default withStyles(cardInfoStyles)(InjectedCardSetupForm);
