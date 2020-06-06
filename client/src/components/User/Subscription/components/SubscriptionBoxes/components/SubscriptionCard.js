import React, { Component } from "react";
import {
  withStyles,
  Typography,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Divider,
} from "@material-ui/core";
import { loadStripe } from "@stripe/stripe-js";
import PropTypes from "prop-types";
import axios from "axios";
import jwtDecode from "jwt-decode";
import baseURL from "../../../../../../baseURL";
import subscriptionCardStyles from "../../../../../../styles/User/Subscription/components/SubscriptionBoxes/components/subscriptionCardStyles";

const stripeKEY =
  process.env.STRIPE_PUBLISHABLE_KEY ||
  require("../../../../../../config").stripe.publishableKEY;

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(stripeKEY);

class SubscriptionCard extends Component {
  handlePurchase = async () => {
    // When the customer clicks on the button, redirect them to Checkout.
    // Call your backend to create the Checkout session.
    let token = localStorage.getItem("token");
    const data = jwtDecode(token);
    let customerID = data.stripe.customerID;

    let type = this.props.planName;

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
        <Card className={classes.root}>
          <CardMedia className={classes.media} image={this.props.image} />
          <CardContent style={{ textAlign: "center" }}>
            <Typography gutterBottom variant="h3">
              {this.props.planName}
            </Typography>
            <Typography variant="h4" color="textSecondary" gutterBottom>
              {this.props.priceText}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {this.props.text}
            </Typography>
          </CardContent>
          <Divider />
          <CardActions style={{ justifyContent: "center" }}>
            <Button
              size="small"
              variant="contained"
              className={classes.gradientButton}
              onClick={this.handlePurchase}
            >
              Purchase
            </Button>
          </CardActions>
        </Card>
      </React.Fragment>
    );
  }
}

SubscriptionCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(subscriptionCardStyles)(SubscriptionCard);
