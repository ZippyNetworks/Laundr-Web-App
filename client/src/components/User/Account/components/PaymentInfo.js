import React, { Component } from "react";
import {
  withStyles,
  Grid,
  Card,
  CardContent,
  Divider,
  CardActions,
  Button,
  TextField,
  CardHeader,
  Fade,
  Collapse,
} from "@material-ui/core";
import {
  Elements,
  CardElement,
  ElementsConsumer,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PropTypes from "prop-types";
import axios from "axios";
import jwtDecode from "jwt-decode";
import baseURL from "../../../../baseURL";
import paymentInfoStyles from "../../../../styles/User/Account/components/paymentInfoStyles";

//todo: maybe use the red/green for other confirms/cancels
//todo: rerender after stored card
//todo: in .catch errors in server, specify also what went wrong!

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

class PaymentInfo extends Component {
  constructor(props) {
    super(props);

    let token = localStorage.getItem("token");
    const data = jwtDecode(token);
    let stripe = data.stripe;

    let defaultCard = {
      brand: "N/A",
      expMonth: "N/A",
      expYear: "N/A",
      lastFour: "N/A",
    };

    this.state = { updatePayment: false, stripe: stripe, card: defaultCard };
  }

  componentDidMount = async () => {
    //load payment info, if any. if there's an error, it will stay default
    let token = localStorage.getItem("token");
    const data = jwtDecode(token);

    let paymentID = data.stripe.regPaymentID;

    if (paymentID !== "N/A") {
      await axios
        .post(baseURL + "/stripe/getCardDetails", { paymentID })
        .then((res) => {
          if (res.data.success) {
            let card = res.data.message.card;

            let cardInfo = {
              brand: card.brand.toUpperCase(),
              expMonth: card.exp_month,
              expYear: card.exp_year,
              lastFour: card.last4,
            };

            this.setState({
              card: cardInfo,
            });
          }
        })
        .catch((error) => {
          alert("Error: " + error);
        });
    }
  };

  handleShowField = () => {
    this.setState({ updatePayment: !this.state.updatePayment });
  };

  handleSetupIntent = async (type) => {
    let secret;
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

    //create a setup intent
    let secret = await this.handleSetupIntent();

    //grab name
    let token = localStorage.getItem("token");
    const data = jwtDecode(token);
    let name = `${data.fname} ${data.lname}`;

    //confirm card setup with the secret
    const result = await stripe.confirmCardSetup(secret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: name,
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
      alert("Card successfully updated!");

      let token = localStorage.getItem("token");
      const data = jwtDecode(token);

      let userEmail = data.email;

      let regPaymentID = result.setupIntent.payment_method;

      await axios
        .post(baseURL + "/stripe/setRegPaymentID", { userEmail, regPaymentID })
        .then(async (res) => {
          if (res.data.success) {
            //card successfully attached to user in database
            await axios
              .post(baseURL + "/user/updateToken", { userEmail })
              .then((res) => {
                if (res.data.success) {
                  //token updated
                  const token = res.data.token;
                  localStorage.setItem("token", token);
                } else {
                  alert("Error with updating token");
                }
              })
              .catch((error) => {
                alert("Error: " + error);
              });
          } else {
            alert("Error with updating card");
          }
        })
        .catch((error) => {
          alert("Error: " + error);
        });
    }
  };

  renderPaymentButtons = (classes) => {
    if (!this.state.updatePayment) {
      return (
        <Grid item>
          <Button
            size="small"
            variant="contained"
            className={classes.gradientButton}
            onClick={this.handleShowField}
          >
            Update
          </Button>
        </Grid>
      );
    } else {
      return (
        <React.Fragment>
          <Grid item>
            <Button
              size="small"
              variant="contained"
              className={classes.gradientButtonRed}
              onClick={this.handleShowField}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              size="small"
              variant="contained"
              className={classes.gradientButtonGreen}
              onClick={this.handleCardSetup}
            >
              Confirm
            </Button>
          </Grid>
        </React.Fragment>
      );
    }
  };

  render() {
    const classes = this.props.classes;

    return (
      <React.Fragment>
        <Card className={classes.root}>
          <CardHeader
            title="Payment Info"
            titleTypographyProps={{ variant: "h5" }}
            className={classes.centerTitle}
          />
          <Divider />
          <CardContent>
            <Grid //main column
              container
              spacing={2}
            >
              <Grid item xs={4} sm={4}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Brand"
                  size="small"
                  value={this.state.card.brand}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={4} sm={4}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Expiration"
                  size="small"
                  value={`${this.state.card.expMonth}/${this.state.card.expYear}`}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={4} sm={4}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Last 4 #"
                  size="small"
                  value={this.state.card.lastFour}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              spacing={2}
            >
              {this.renderPaymentButtons(classes)}
            </Grid>
          </CardActions>
          <Collapse in={this.state.updatePayment} timeout="auto" unmountOnExit>
            <CardContent>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                spacing={2}
              >
                <div style={{ width: "100%" }}>
                  <Fade
                    in={this.state.updatePayment}
                    style={{
                      display: !this.state.updatePayment ? "none" : "block",
                      transitionDelay: this.state.updatePayment
                        ? "500ms"
                        : "0ms",
                    }}
                  >
                    <Grid item>
                      <div style={{ width: "100%" }}>
                        <CardElement options={CARD_ELEMENT_OPTIONS} />
                      </div>
                    </Grid>
                  </Fade>
                </div>
              </Grid>
            </CardContent>
          </Collapse>
        </Card>
      </React.Fragment>
    );
  }
}

InjectedPaymentInfo.propTypes = {
  classes: PropTypes.object.isRequired,
};

function InjectedPaymentInfo(props) {
  const classes = props.classes;

  return (
    <Elements stripe={stripePromise}>
      <ElementsConsumer>
        {({ stripe, elements }) => (
          <PaymentInfo stripe={stripe} elements={elements} classes={classes} />
        )}
      </ElementsConsumer>
    </Elements>
  );
}

export default withStyles(paymentInfoStyles)(InjectedPaymentInfo);
