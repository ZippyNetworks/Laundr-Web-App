import React, { Component } from "react";
import { withStyles, Grid, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import jwtDecode from "jwt-decode";
import baseURL from "../../../baseURL";
import axios from "axios";
import SubscriptionBoxes from "./components/SubscriptionBoxes/SubscriptionBoxes";
import SubscriptionStatus from "./components/SubscriptionStatus/SubscriptionStatus";
import subscriptionStyles from "../../../styles/User/Subscription/subscriptionStyles";
import sectionBorder from "../../../images/UserDashboard/sectionBorder.png";

//todo: add card header and divider to review page, similar to order status
//todo: add cost to order
//todo: if any other page needs an updated token, do that
//todo: add bottom border section to every page?

class Subscription extends Component {
  constructor(props) {
    super(props);

    let token = localStorage.getItem("token");
    const data = jwtDecode(token);

    let defaultSubscription = {
      plan: "",
      lbsLeft: "",
      periodStart: "N/A",
      periodEnd: "N/A",
      status: data.subscription.status,
    };

    this.state = {
      subscription: defaultSubscription,
      userEmail: data.email,
    };
  }

  componentDidMount = async () => {
    let userEmail = this.state.userEmail;

    await axios
      .post(baseURL + "/user/updateToken", { userEmail })
      .then((res) => {
        if (res.data.success) {
          const token = res.data.token;
          localStorage.setItem("token", token);

          const data = jwtDecode(token);
          let subscription = data.subscription;

          this.setState({
            subscription: subscription,
          });
        } else {
          alert("Error with updating token");
        }
      })
      .catch((error) => {
        alert("Error: " + error);
      });
  };

  renderSubscriptionComponent = () => {
    if (this.state.subscription.status === "active") {
      return (
        <React.Fragment>
          <Grid
            container
            spacing={2}
            direction="column"
            justify="center"
            alignItems="center" /*main page column*/
          >
            <SubscriptionStatus subscription={this.state.subscription} />
          </Grid>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <Grid
            container
            spacing={2}
            direction="row"
            justify="center"
            alignItems="center" /*main page column*/
          >
            <SubscriptionBoxes />
          </Grid>
        </React.Fragment>
      );
    }
  };

  render() {
    const classes = this.props.classes;

    return (
      <React.Fragment>
        <Grid
          container
          spacing={2}
          direction="column"
          justify="center"
          alignItems="center" /*main page column*/
          style={{
            paddingTop: 8,
            backgroundColor: "#21d0e5",
          }}
        >
          <Grid item>
            <Typography variant="h1" className={classes.componentName}>
              Subscription
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={2}
          direction="column"
          justify="center"
          alignItems="center" /*main page column*/
        >
          <img
            src={sectionBorder}
            style={{
              width: "100%",
              height: "100%",
              paddingTop: 8,
              paddingBottom: 15,
            }}
            alt="Section border"
          />
        </Grid>
        {this.renderSubscriptionComponent()}
      </React.Fragment>
    );
  }
}

Subscription.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(subscriptionStyles)(Subscription);
