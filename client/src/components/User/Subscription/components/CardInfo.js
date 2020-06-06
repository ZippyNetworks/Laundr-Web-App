import React, { Component } from "react";
import {
  Elements,
  CardElement,
  ElementsConsumer,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button, withStyles, Grid } from "@material-ui/core";
import PropTypes from "prop-types";
import axios from "axios";
import jwtDecode from "jwt-decode";
import baseURL from "../../../../baseURL";
import cardInfoStyles from "../../../../styles/User/Subscription/components/cardInfoStyles";

//todo: see dashboard to dos, configure self-service portal. going w/2 attached payment IDs (one for on-demand, one for sub). modify on-site
//todo: note that when a subscription is cancelled, its payment method is not removed from stripe. refer to the user's reg payment id for the one used for on-demand charges
//todo:
//add regular payment method and update regular payment method - DONE
//card details - if reg payment ID is N/A, display add a card and dont let the network req get through. else, getCardDetails
//webhook for sub cancel (for lbs/month logic)

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

    this.state = { brand: "", expMonth: "", expYear: "", lastFour: "" };
  }

  handleSetupIntent = async (type) => {
    let secret = "";
    let token = localStorage.getItem("token");
    const data = jwtDecode(token);
    let customerID = data.stripe.customerID;

    await axios
      .post(baseURL + "/stripe/createSetupIntent", { customerID })
      .then((res) => {
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
      alert("card stored");
      let token = localStorage.getItem("token");
      const data = jwtDecode(token);
      let userEmail = data.email;

      let regPaymentID = result.setupIntent.payment_method;

      await axios
        .post(baseURL + "/stripe/setRegPaymentID", { userEmail, regPaymentID })
        .then(async (res) => {
          if (res.data.success) {
            alert("card attached to user");
            await axios
              .post(baseURL + "/user/updateToken", { userEmail })
              .then((res) => {
                if (res.data.success) {
                  const token = res.data.token;
                  localStorage.setItem("token", token);
                  alert("token updated");
                } else {
                  alert("error with updating token");
                }
              })
              .catch((error) => {
                alert("Error: " + error);
              });
          } else {
            alert("error with storing card to user");
          }
        })
        .catch((error) => {
          alert("Error: " + error);
        });
    }
  };

  handleChargeCard = async () => {
    //const { stripe } = this.props;
    let token = localStorage.getItem("token");
    const data = jwtDecode(token);
    let customerID = data.stripe.customerID;
    let paymentID = data.stripe.regPaymentID;

    await axios
      .post(baseURL + "/stripe/chargeCustomer2", { customerID, paymentID })
      .then((res) => {
        if (res.data.success) {
          alert("nice");
        } else {
          if (res.data.message === "authentication_required") {
            // // Pass the failed PaymentIntent to your client from your server
            // let intent = res.data.paymentIntent;
            // await stripe
            //   .confirmCardPayment(intent.client_secret, {
            //     payment_method: intent.last_payment_error.payment_method.id,
            //   })
            //   .then(function (result) {
            //     if (result.error) {
            //       // Show error to your customer
            //       alert(result.error.message);
            //     } else {
            //       if (result.paymentIntent.status === "succeeded") {
            //         // The payment is complete!
            //         alert("Payment complete!");
            //       }
            //     }
            //   });

            alert("Error: Card requires authentication. Please contact us.");
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

  handleGetCardDetails = async () => {
    //todo: update token when card updated, since when the card is attached to user the token theyre using to login is the old one
    let token = localStorage.getItem("token");
    const data = jwtDecode(token);
    let paymentID = data.stripe.regPaymentID;

    await axios
      .post(baseURL + "/stripe/getCardDetails", { paymentID })
      .then((res) => {
        if (res.data.success) {
          let card = res.data.message.card;
          this.setState({
            brand: card.brand,
            expMonth: card.exp_month,
            expYear: card.exp_year,
            lastFour: card.last4,
          });
        } else {
          alert("Error with getting card details");
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
          Save reg card
        </Button>
        <br />
        <br />
        <Button
          variant="contained"
          color="primary"
          className={classes.gradientButton}
          onClick={this.handleChargeCard}
        >
          Charge jackzheng10 $10 w/hardcode card
        </Button>
        <br />
        <br />
        <Grid container direction="column">
          <Grid item>
            <h2>brand: {this.state.brand}</h2>
            <h2>exp month: {this.state.expMonth}</h2>
            <h2>exp year: {this.state.expYear}</h2>
            <h2>last four: {this.state.lastFour}</h2>
            <Button
              variant="contained"
              color="primary"
              className={classes.gradientButton}
              onClick={this.handleGetCardDetails}
            >
              Fetch card details for reg payment card
            </Button>
          </Grid>
        </Grid>
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
