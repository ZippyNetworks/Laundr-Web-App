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
import paymentInfoStyles from "../../../../styles/User/Account/components/paymentInfoStyles";

//todo: maybe use the red/green for other confirms/cancels

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

    this.state = { updatePayment: false };
  }

  handleShowField = () => {
    this.setState({ updatePayment: !this.state.updatePayment });
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
                  value="Test"
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
                  value="9/99"
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
                  value="1234"
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
